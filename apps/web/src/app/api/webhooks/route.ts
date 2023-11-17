import { createHmac } from "crypto";
import { NextRequest, NextResponse } from "next/server";

import { z } from "zod";

const logSchema = z.object({
  removed: z.boolean(),
  address: z.string(),
  data: z.string(),
  topics: z.array(z.string()),
});

const rawContractSchema = z.object({
  rawValue: z.string(),
  address: z.string(),
});

const activitySchema = z.object({
  category: z.string(),
  fromAddress: z.string(),
  toAddress: z.string(),
  erc721TokenId: z.string().optional(),
  rawContract: rawContractSchema,
  log: logSchema,
});

const eventSchema = z.object({
  network: z.string(),
  activity: z.array(activitySchema),
});

const alchemyWebhookTypeSchema = z.union([
  z.literal("MINED_TRANSACTION"),
  z.literal("DROPPED_TRANSACTION"),
  z.literal("ADDRESS_ACTIVITY"),
]);

const webhookResponseSchema = z.object({
  webhookId: z.string(),
  id: z.string(),
  createdAt: z.string(),
  type: alchemyWebhookTypeSchema,
  event: eventSchema,
});

function isValidBody(
  body: string,
  signature: string,
  signingKey: string
): boolean {
  const hmac = createHmac("sha256", signingKey); // Create a HMAC SHA256 hash using the signing key
  hmac.update(body, "utf8"); // Update the token hash with the request body using utf8
  const digest = hmac.digest("hex");
  return signature === digest;
}

export async function POST(req: NextRequest) {
  const rawBodyStr = await req.text();

  if (
    isValidBody(
      rawBodyStr,
      req.headers.get("x-alchemy-signature") ?? "",
      process.env.ALCHEMY_WEBHOOK_SIGNING_KEY as string
    )
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  const body = webhookResponseSchema.parse(await req.json());

  return NextResponse.json({ body });
}

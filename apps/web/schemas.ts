import { z } from "zod";

export const TRIGGER_TYPE = {
  TOKENS_RECEIVED: "TOKENS_RECEIVED",
};

export const stepConfigSchema = z.union([
  z.object({
    type: z.literal("SEND_PUSH_PROTOCOL"),
    foo: z.string(),
  }),
  z.object({
    type: z.literal("SEND_SLACK_MESSAGE"),
    bar: z.string(),
  }),
]);

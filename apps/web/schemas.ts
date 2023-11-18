import { z } from "zod";

export const TRIGGER_TYPE = {
  TOKENS_RECEIVED: "TOKENS_RECEIVED",
};

export const ACTIONS = {
  SEND_PUSH_PROTOCOL_NOTIFICATION: "SEND_PUSH_PROTOCOL_NOTIFICATION",
} as const;

export const pushProtocolActionConfigSchema = z.object({
  type: z.literal(ACTIONS.SEND_PUSH_PROTOCOL_NOTIFICATION),
  title: z.string(),
  message: z.string(),
});

export const stepActionConfig = z.union([
  pushProtocolActionConfigSchema,
  z.object({
    type: z.literal("SEND_SLACK_MESSAGE"),
  }),
]);

export const workflowTriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.TOKENS_RECEIVED),
  token: z.object({
    name: z.string(),
    address: z.string().transform((str) => str.toLowerCase()),
    amount: z.number().optional(),
  }),
});

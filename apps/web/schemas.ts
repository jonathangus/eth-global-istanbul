import { z } from "zod"
import {
  stepsInsertSchema,
  stepsRowSchema,
  workflowsInsertSchema,
} from "./database.schemas"

export const TRIGGER_TYPE = {
  TOKENS_RECEIVED: "TOKENS_RECEIVED",
}

export const ACTIONS = {
  SEND_PUSH_PROTOCOL_NOTIFICATION: "SEND_PUSH_PROTOCOL_NOTIFICATION",
  SWAP_ON_1INCH: "SWAP_ON_1INCH",
} as const

export const pushProtocolActionConfigSchema = z.object({
  type: z.literal(ACTIONS.SEND_PUSH_PROTOCOL_NOTIFICATION),
  title: z.string(),
  message: z.string(),
})

export const swapOn1InchConfigSchema = z.object({
  type: z.literal(ACTIONS.SWAP_ON_1INCH),
  chainId: z.number(),
  fromToken: z.object({
    address: z.string(),
  }),
  toToken: z.object({
    address: z.string(),
  }),
  // TODO: value or percentage
  amount: z.number(),
})

export const stepActionConfig = z.union([
  pushProtocolActionConfigSchema,
  swapOn1InchConfigSchema,
])

export const tokenSchema = z.object({
  name: z.string(),
  address: z.string().transform((str) => str.toLowerCase()),
  amount: z.number(),
})

export const workflowTriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.TOKENS_RECEIVED),
  token: tokenSchema,
})

export const stepTxSignDataSchema = z.object({
  preVerificationGas: z.number(),
  verificationGasLimit: z.number(),
  callGasLimit: z.number(),
  paymasterAndData: z.string(),
  to: z.string().optional(),
  data: z.string().optional(),
  callData: z.string(),
  initCode: z.string(),
  sender: z.string(),
  signature: z.string(),
  nonce: z.number(),
})

export const workflowStepSchema = stepsRowSchema.extend({
  tx_sign_data: stepTxSignDataSchema.partial().nullable().optional(),
  action: stepActionConfig,
})

export const STEP_RUN_STATUS = {
  PENDING: "PENDING",
  RUNNING: "RUNNING",
  COMPLETED: "COMPLETED",
} as const

export const createWorkflowSchema = workflowsInsertSchema
  .omit({ id: true, created_at: true })
  .extend({
    steps: z.array(
      stepsInsertSchema
        .omit({ workflow_id: true })
        .extend({ action: stepActionConfig })
    ),
    trigger: workflowTriggerSchema,
  })

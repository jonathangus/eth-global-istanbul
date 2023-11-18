import { z } from "zod"
import {
  stepsInsertSchema,
  stepsRowSchema,
  workflowsInsertSchema,
} from "./database.schemas"

export const TRIGGER_TYPE = {
  TOKENS_RECEIVED_ERC20: "TOKENS_RECEIVED_ERC20",
  TOKENS_RECEIVED_ERC721: "TOKENS_RECEIVED_ERC721",
  UNLIMITED_TOP_UP: "UNLIMITED_TOP_UP",
  TOKENS_LEAVE_ERC20: "TOKENS_LEAVE_ERC20",
  TOKENS_LEAVE_ERC721: "TOKENS_LEAVE_ERC721",
}

export const VALID_LOGIC_VALUES = {
  LESS_THAN: "LESS_THAN",
  GREATER_THAN: "GREATER_THAN",
} as const

export const tokenSchema = z.object({
  name: z.string(),
  address: z.string().transform((str) => str.toLowerCase()),
  amount: z.number(),
  logic: z
    .literal(VALID_LOGIC_VALUES.LESS_THAN)
    .or(z.literal(VALID_LOGIC_VALUES.GREATER_THAN)),
})

export const tokensReceivedERC20TriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.TOKENS_RECEIVED_ERC20),
  token: tokenSchema,
})

export const tokensReceivedERC721TriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.TOKENS_RECEIVED_ERC721),
  token: tokenSchema,
})

export const unlimitedTopUpTriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.UNLIMITED_TOP_UP),
  token: tokenSchema,
})

export const tokensLeaveERC20TriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.TOKENS_LEAVE_ERC20),
  token: tokenSchema,
})

export const tokensLeaveERC721TriggerSchema = z.object({
  type: z.literal(TRIGGER_TYPE.TOKENS_LEAVE_ERC721),
  token: tokenSchema,
})

export const workflowTriggerSchema = z.union([
  tokensReceivedERC20TriggerSchema,
  tokensReceivedERC721TriggerSchema,
  unlimitedTopUpTriggerSchema,
  tokensLeaveERC20TriggerSchema,
  tokensLeaveERC721TriggerSchema,
])

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

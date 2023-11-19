import { z } from "zod"
import {
  stepsInsertSchema,
  stepsRowSchema,
  workflowsInsertSchema,
} from "./database.schemas"

export const TRIGGER_TYPE = {
  TOKENS_RECEIVED_ERC20: "TOKENS_RECEIVED_ERC20",
  TOKENS_RECEIVED_ERC721: "TOKENS_RECEIVED_ERC721",
  TOKENS_LEAVE_ERC20: "TOKENS_LEAVE_ERC20",
  TOKENS_LEAVE_ERC721: "TOKENS_LEAVE_ERC721",
} as const

export const VALID_LOGIC_VALUES = {
  LESS_THAN: "LESS_THAN",
  GREATER_THAN: "GREATER_THAN",
} as const

export const tokenSchema = z.object({
  name: z.string(),
  address: z.string().transform((str) => str.toLowerCase()),
  amount: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") {
      return parseFloat(val)
    }
    return val
  }, z.number().optional()),
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
  tokensLeaveERC20TriggerSchema,
  tokensLeaveERC721TriggerSchema,
])

export const ACTIONS = {
  SWAP_ON_1INCH: "SWAP_ON_1INCH",
  SEND_ERC_721: "SEND_ERC_721",
  MINT_NFT: "MINT_NFT",
} as const

export const ERC721SendActionConfigSchema = z.object({
  type: z.literal(ACTIONS.SEND_ERC_721),
  receiver: z.string(),
})

export const MintNFTActionConfigSchema = z.object({
  type: z.literal(ACTIONS.MINT_NFT),
  address: z.string(),
})

export const swapOn1InchConfigSchema = z.object({
  type: z.literal(ACTIONS.SWAP_ON_1INCH),
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
  swapOn1InchConfigSchema,
  ERC721SendActionConfigSchema,
  MintNFTActionConfigSchema,
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
  chainId: z.number(),
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

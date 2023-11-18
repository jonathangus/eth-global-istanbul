import { NonRetriableError } from "inngest";
import { z } from "zod";
import { ACTIONS, workflowStepSchema } from "../../schemas";
import { SUPPORTED_CHAINS } from "../config";
import { executeTransaction } from "./execute-transaction";
import { sendNotification } from "./push-protocol";

export async function runStepAction(
  workflowStep: z.infer<typeof workflowStepSchema>
) {
  switch (workflowStep.action.type) {
    case ACTIONS.SWAP_ON_1INCH:
      const result = await executeTransaction(
        workflowStep.action.chainId as SUPPORTED_CHAINS,
        workflowStep.tx_sign_data!
      );

      if (result.ok) {
        return { ok: true, data: result };
      }

      return { ok: false, error: result.error };
    case ACTIONS.SEND_PUSH_PROTOCOL_NOTIFICATION:
      await sendNotification(
        workflowStep.action.title,
        workflowStep.action.message
      );
      return { ok: true };
    default:
      throw new NonRetriableError(`Unknown action type`);
  }
}

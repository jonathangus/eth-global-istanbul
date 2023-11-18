import { NonRetriableError } from "inngest";
import { z } from "zod";
import { ACTIONS, workflowStepSchema } from "../../schemas";
import { SUPPORTED_CHAINS } from "../config";
import { executeTransaction } from "./execute-transaction";

export async function runStepAction(
  workflowStep: z.infer<typeof workflowStepSchema>
) {
  switch (workflowStep.action.type) {
    case ACTIONS.SWAP_ON_1INCH:
      await new Promise((resolve) => setTimeout(resolve, 5000));

      const result = await executeTransaction(
        workflowStep.action.chainId as SUPPORTED_CHAINS,
        workflowStep.tx_sign_data!
      );

      if (result.ok) {
        return { ok: true, data: result };
      }

      return { ok: false, error: result.error };
    case ACTIONS.SEND_PUSH_PROTOCOL_NOTIFICATION:
      console.log("Sending push protocol notification");
      return { ok: true };
    default:
      throw new NonRetriableError(`Unknown action type`);
  }
}

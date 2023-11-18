import { z } from "zod";
import { ACTIONS, stepActionConfig } from "../../schemas";
import { NonRetriableError } from "inngest";
import { sendNotification } from "./push-protocol";

export async function runStepAction(action: z.infer<typeof stepActionConfig>) {
  switch (action.type) {
    case ACTIONS.SEND_PUSH_PROTOCOL_NOTIFICATION:
      await sendNotification(action.title, action.message);
      return { ok: true };
    default:
      throw new NonRetriableError(`Unknown action type`);
  }
}

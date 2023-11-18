import { NonRetriableError } from 'inngest';
import { z } from 'zod';
import { ACTIONS, workflowStepSchema } from '../../schemas';
import { executions } from '../actions';
import {
  getCallData as OneInchGgtCallData,
  execute as OneInchExecute,
  transformWorkflow as OneInchTransformWorkflow,
} from '../actions/1inch';

export async function runStepAction(
  workflowStep: z.infer<typeof workflowStepSchema>
) {
  switch (workflowStep.action.type) {
    case ACTIONS.SWAP_ON_1INCH:
      console.log({ workflowStep });
      const execute = executions[workflowStep.action.type];
      const result = await execute(workflowStep);

      if (result.ok) {
        return { ok: true, data: result };
      }

      return { ok: false, error: result.error };
    case ACTIONS.SEND_PUSH_PROTOCOL_NOTIFICATION:
      console.log('Sending push protocol notification');
      return { ok: true };
    default:
      throw new NonRetriableError(`Unknown action type`);
  }
}

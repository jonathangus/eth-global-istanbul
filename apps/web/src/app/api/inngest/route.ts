import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest";
import { updateOnchainListenerWebhook } from "../../../functions/update-onchain-listener-webhook";
import { runWorkflow } from "../../../functions/run-workflow";
import { triggerTokensReceivedWorkflows } from "../../../functions/trigger-tokens-received-workflows";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    updateOnchainListenerWebhook,
    runWorkflow,
    triggerTokensReceivedWorkflows,
  ],
});

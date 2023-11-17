import { alchemyBase } from "../lib/alchemy";
import { inngest } from "../lib/inngest";

export const updateOnchainListenerWebhook = inngest.createFunction(
  { id: "update-onchain-listener-webhook" },
  { event: "app/workflow.created" },
  async ({ event, step }) => {
    await step.run("Create Listener", async () => {
      alchemyBase.notify.updateWebhook(
        process.env.ALCHEMY_BASE_WEBHOOK_ID as string,
        {
          addAddresses: [event.data.address],
        }
      );
    });
  }
);

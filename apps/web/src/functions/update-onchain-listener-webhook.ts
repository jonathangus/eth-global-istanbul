import { alchemyBase } from "../lib/alchemy";
import { inngest } from "../lib/inngest";

export const updateOnchainListenerWebhook = inngest.createFunction(
  { id: "update-onchain-listener-webhook" },
  { event: "app/workflow.created" },
  async ({ event, step }) => {
    await step.run("Create Listener", async () => {
      await alchemyBase.notify.updateWebhook(
        process.env.ALCHEMY_GOERLI_WEBHOOK_ID as string,
        {
          addAddresses: [event.data.address],
        }
      );

      console.info("Listener Updated");
    });
  }
);

import { alchemyBase } from "../lib/alchemy";
import { inngest } from "../lib/inngest";

export const helloWorld = inngest.createFunction(
  { id: "create-onchain-listener" },
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

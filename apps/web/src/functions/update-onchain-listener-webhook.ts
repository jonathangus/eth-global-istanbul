import { baseGoerli, goerli } from "viem/chains";
import { alchemyBaseGoerli, alchemyGoerli } from "../lib/alchemy";
import { inngest } from "../lib/inngest";

function getAlchemy(chainId: number) {
  switch (chainId) {
    case baseGoerli.id:
      return alchemyBaseGoerli;
    case goerli.id:
      return alchemyGoerli;
    default:
      throw new Error("Invalid chainId");
  }
}

export const updateOnchainListenerWebhook = inngest.createFunction(
  { id: "update-onchain-listener-webhook", name: "Update Address Listener" },
  { event: "app/workflow.created" },
  async ({ event, step }) => {
    await step.run("Create Listener", async () => {
      await getAlchemy(event.data.chainId).notify.updateWebhook(
        process.env.ALCHEMY_GOERLI_WEBHOOK_ID as string,
        {
          addAddresses: [event.data.address],
        }
      );

      console.info("Listener Updated");
    });
  }
);

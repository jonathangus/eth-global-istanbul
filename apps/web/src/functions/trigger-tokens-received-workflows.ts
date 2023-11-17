import { TRIGGER_TYPE } from "../../schemas";
import { inngest } from "../lib/inngest";
import { supabase } from "../lib/supabase";

export const triggerTokensReceivedWorkflows = inngest.createFunction(
  { id: "trigger-tokens-received-workflows" },
  { event: "app/tokens.received" },
  async ({ event, step }) => {
    const workflows = await step.run("Get workflows", async () => {
      const { error, data } = await supabase
        .from("workflows")
        .select()
        .eq("address", event.data.toAddress)
        .contains("trigger", {
          type: TRIGGER_TYPE.TOKENS_RECEIVED,
          tokenAddress: event.data.token.address,
        });

      if (error) {
        console.error("Failed to get workflows", error);
        throw new Error("Failed to get workflows");
      }

      if (!data) {
        return [];
      }

      return data.filter(
        (workflow) =>
          Number((workflow.trigger as any).tokenAmount) >=
          event.data.token.amount
      );
    });

    const events = workflows.map((workflow) => {
      return {
        name: "app/workflow.triggered" as const,
        data: { workflowId: workflow.id },
      };
    });

    if (events.length > 0) {
      await step.sendEvent("fan-out-workflows-runs", events);
    }

    return { count: events.length };
  }
);

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
        .select("id")
        .eq("address", event.data.address)
        .eq("trigger:jsonb->>type", TRIGGER_TYPE.TOKENS_RECEIVED)
        .eq("trigger:jsonb->>tokenAddress", event.data.tokenAddress)
        .gte("trigger:jsonb->>tokenAmount", event.data.tokenAmount);

      if (error) {
        console.error("Failed to get workflows", error);
        throw new Error("Failed to get workflows");
      }

      if (!data) {
        return [];
      }

      return data;
    });

    const events = workflows.map((workflow) => {
      return {
        name: "app/workflow.triggered" as const,
        data: { workflowId: workflow.id },
      };
    });

    await step.sendEvent("fan-out-workflows-runs", events);
  }
);

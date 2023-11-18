import { TRIGGER_TYPE, workflowTriggerSchema } from "../../schemas";
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
        .eq("address", event.data.toAddress.toLowerCase());

      if (error) {
        console.error("Failed to get workflows", error);
        throw new Error("Failed to get workflows");
      }

      if (!data) {
        console.info("No workflows found");
        return [];
      }

      return data.filter((workflow) => {
        try {
          // const trigger = workflowTriggerSchema.parse(workflow.trigger);
          // const conditions: Array<boolean> = [];

          // conditions.push(trigger.token.address === event.data.token.address);

          // if (trigger.token.amount) {
          //   conditions.push(trigger.token.amount <= event.data.token.amount);
          // }

          // return conditions.every((condition) => condition);
          return true;
        } catch {
          return false;
        }
      });
    });

    const events = workflows.map((workflow) => {
      return {
        name: "app/workflow.triggered" as const,
        data: { workflowId: workflow.id },
      };
    });

    if (events.length > 0) {
      await step.sendEvent("fan-out-workflows-runs", events);
      console.info("Workflows triggered", events);
    }

    return { count: events.length };
  }
);

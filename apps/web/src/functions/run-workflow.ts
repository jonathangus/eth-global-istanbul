import { NonRetriableError } from "inngest";
import { stepActionConfig } from "../../schemas";
import { inngest } from "../lib/inngest";
import { supabase } from "../lib/supabase";
import { runStepAction } from "../lib/run-step-action";

export const runWorkflow = inngest.createFunction(
  { id: "run-workflow" },
  { event: "app/workflow.triggered" },
  async ({ event, step }) => {
    const workflowSteps = await step.run("Get workflow steps", async () => {
      const { error, data } = await supabase
        .from("steps")
        .select()
        .eq("workflow_id", event.data.workflowId)
        .order("order");

      if (error) {
        console.error("Failed to get workflow steps", error);
        throw new Error("Failed to get workflow steps");
      }

      if (!data) {
        return [];
      }

      return data;
    });

    for (const workflowStep of workflowSteps) {
      console.info("Running step", { step: workflowStep });
      await step.run(`Run step ${workflowStep.id}`, async () => {
        const action = stepActionConfig.parse(workflowStep.config);
        await runStepAction(action);
      });
    }

    return { count: workflowSteps.length };
  }
);

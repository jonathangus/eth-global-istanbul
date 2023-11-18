import { STEP_RUN_STATUS, workflowStepSchema } from "../../schemas";
import { inngest } from "../lib/inngest";
import { runStepAction } from "../lib/run-step-action";
import { supabase } from "../lib/supabase";

export const runWorkflow = inngest.createFunction(
  { id: "run-workflow" },
  { event: "app/workflow.triggered" },
  async ({ event, step }) => {
    const workflowSteps = await step.run("Get workflow steps", async () => {
      const { error, data } = await supabase
        .from("steps")
        .select()
        .eq("workflow_id", event.data.workflowId)
        .order("order", { ascending: true });

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
      const stepRun = await step.run(
        `Create step run id ${workflowStep.id}`,
        async () => {
          const { data, error } = await supabase
            .from("step_runs")
            .insert({
              step_id: workflowStep.id,
              status: STEP_RUN_STATUS.RUNNING,
              workflow_id: event.data.workflowId,
            })
            .select()
            .single();

          if (error) {
            console.error("Failed to create step run", error);
            throw new Error("Failed to create step run");
          }

          if (!data) {
            throw new Error("Failed to create step run");
          }

          return data;
        }
      );

      await step.run(`Run step ${stepRun.id}`, async () => {
        await runStepAction(workflowStepSchema.parse(workflowStep));
      });

      await step.run("Update step run", async () => {
        const { error } = await supabase
          .from("step_runs")
          .update({ status: STEP_RUN_STATUS.COMPLETED })
          .eq("id", stepRun.id);

        if (error) {
          console.error("Failed to update step run", error);
          throw new Error("Failed to update step run");
        }
      });
    }

    return { count: workflowSteps.length };
  }
);

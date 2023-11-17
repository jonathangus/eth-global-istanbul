import { NonRetriableError } from "inngest";
import { stepConfigSchema } from "../../schemas";
import { inngest } from "../lib/inngest";
import { supabase } from "../lib/supabase";

export const runWorkflow = inngest.createFunction(
  { id: "run-workflow" },
  { event: "app/workflow.triggered" },
  async ({ event, step }) => {
    const workflowSteps = await step.run("Get workflow steps", async () => {
      const { error, data } = await supabase
        .from("steps")
        .select()
        .eq("workflow_id", event.data.workflow.id);

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
      await step.run(`Run step ${workflowStep.id}`, async () => {
        const action = stepConfigSchema.parse(workflowStep.config);

        switch (action.type) {
          case "SEND_PUSH_PROTOCOL":
            return console.log("Send push protocol");
          case "SEND_SLACK_MESSAGE":
            return console.log("Send slack message");
          default:
            throw new NonRetriableError(`Unknown action type`);
        }
      });
    }

    return { count: workflowSteps.length };
  }
);

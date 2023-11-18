import { supabase } from "../../../lib/supabase";
import {
  stepActionConfig,
  workflowStepSchema,
  workflowTriggerSchema,
} from "../../../../schemas";
import { WorkflowStatusBadge } from "../../../components/workflow-status-badge";

export default async function Page({ params }: { params: { id: string } }) {
  const workflowPromise = supabase
    .from("workflows")
    .select()
    .eq("id", params.id)
    .maybeSingle();

  const stepsPromise = supabase
    .from("steps")
    .select()
    .eq("workflow_id", params.id)
    .order("order");

  const [workflow, steps] = await Promise.all([workflowPromise, stepsPromise]);

  return (
    <div className="max-w-md mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl">{workflow.data?.name}</h1>
        <WorkflowStatusBadge workflowId={params.id} />
      </div>
      <section>
        <div>
          {workflowTriggerSchema.parse(workflow.data?.trigger).token.name}
          {workflowTriggerSchema.parse(workflow.data?.trigger).token.amount}
        </div>
        {steps.data?.map((step) => {
          const { action } = workflowStepSchema.parse(step);
          return (
            <article key={step.id}>
              {step.order}
              <div className="bg-white p-4">
                {action.type === "SWAP_ON_1INCH" && <div>swap on 1inch</div>}
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
}

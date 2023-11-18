import { workflowStepSchema, workflowTriggerSchema } from "../../../../schemas";
import { TopupFlo } from "../../../components/top-up-flow";
import { WorkflowSteps } from "../../../components/workflow-steps";
import { supabase } from "../../../lib/supabase";

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
    .order("order", { ascending: true });

  const [workflow, steps] = await Promise.all([workflowPromise, stepsPromise]);

  return (
    <div className="max-w-md mx-auto py-4">
      <TopupFlo address={workflow.data?.address!} />
      <div className="flex justify-between items-center mt-4 mb-4">
        <h1 className="text-3xl">{workflow.data?.name}</h1>
      </div>
      <WorkflowSteps
        workflowId={Number(params.id)}
        steps={steps.data?.map((s) => workflowStepSchema.parse(s)) ?? []}
      />
    </div>
  );
}

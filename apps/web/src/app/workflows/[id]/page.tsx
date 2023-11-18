import { supabase } from "../../../lib/supabase";
import { workflowTriggerSchema } from "../../../../schemas";

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
      <h1>{workflow.data?.name}</h1>
      <section>
        <div>
          {workflowTriggerSchema.parse(workflow.data?.trigger).token.name}
          {workflowTriggerSchema.parse(workflow.data?.trigger).token.amount}
        </div>
        {steps.data?.map((step) => {
          return (
            <article key={step.id}>
              {step.order}
              <pre>{JSON.stringify(step.action)}</pre>
            </article>
          );
        })}
      </section>
    </div>
  );
}

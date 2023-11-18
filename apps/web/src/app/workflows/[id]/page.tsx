import { workflowStepSchema, workflowTriggerSchema } from "../../../../schemas"
import { TopupFlo } from "../../../components/top-up-flow"
import { WorkflowSteps } from "../../../components/workflow-steps"
import { supabase } from "../../../lib/supabase"

const tokenOptions = [
  { value: "USDC", label: "USDC", image: "/icons/usdc.svg", address: "1234" },
  { value: "GHO", label: "GHO", image: "/icons/gho.svg", address: "54321" },
  {
    value: "APE",
    label: "APE",
    image: "/icons/ape.svg",
    address: "783947380",
  },
]

export default async function Page({ params }: { params: { id: string } }) {
  const workflowPromise = supabase
    .from("workflows")
    .select()
    .eq("id", params.id)
    .maybeSingle()

  const stepsPromise = supabase
    .from("steps")
    .select()
    .eq("workflow_id", params.id)
    .order("order", { ascending: true })

  const [workflow, steps] = await Promise.all([workflowPromise, stepsPromise])

  const trigger = workflowTriggerSchema.parse(workflow.data?.trigger!)

  const token = tokenOptions.find((t) => t.value === trigger.token.name)

  return (
    <div className="max-w-md mx-auto py-4">
      <TopupFlo address={workflow.data?.address!} />
      <div className="flex justify-between items-center mt-4 mb-2">
        <h1 className="text-3xl">{workflow.data?.name}</h1>
      </div>
      <div className="mb-4">
        {trigger.type === "TOKENS_RECEIVED_ERC20" && (
          <p>
            Runs when{" "}
            <img
              className="inline mr-1 -translate-y-px relative"
              src={token?.image}
              width={16}
              height={16}
            />
            {token?.label} is received
          </p>
        )}
      </div>
      <WorkflowSteps
        workflowId={Number(params.id)}
        steps={steps.data?.map((s) => workflowStepSchema.parse(s)) ?? []}
      />
    </div>
  )
}

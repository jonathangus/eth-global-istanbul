import { NextRequest, NextResponse } from "next/server"
import { supabase } from "../../../lib/supabase"
import {
  stepsInsertSchema,
  workflowsInsertSchema,
} from "../../../../database.schemas"
import { inngest } from "../../../lib/inngest"
import { z } from "zod"
import { stepConfigSchema, workflowTriggerSchema } from "../../../../schemas"

export async function POST(req: NextRequest) {
  const values = workflowsInsertSchema
    .omit({ id: true, created_at: true })
    .extend({
      steps: z.array(
        stepsInsertSchema
          .omit({ workflow_id: true })
          .extend({ config: stepConfigSchema })
      ),
      trigger: workflowTriggerSchema,
    })
    .parse(await req.json())

  const workflowInsert = await supabase
    .from("workflows")
    .insert({
      address: values.address.toLowerCase(),
      name: values.name,
      trigger: values.trigger,
    })
    .select()

  if (workflowInsert.error) {
    console.error("Failed to insert workflow", workflowInsert.error)
    throw new Error("Failed to insert workflow")
  }

  if (!workflowInsert.data) {
    throw new Error("Failed to insert workflow")
  }

  const workflow = workflowInsert.data[0]

  if (!workflow) {
    console.error("Missing workflow id")
    throw new Error("Failed to insert workflow")
  }

  console.info("Workflow Created", { workflow })

  const stepInsert = await supabase.from("steps").insert(
    values.steps.map((step) => ({
      type: step.type,
      config: step.config,
      order: step.order,
      workflow_id: workflow.id,
    }))
  )

  if (stepInsert.error) {
    console.error("Failed to insert steps", stepInsert.error)
    throw new Error("Failed to insert steps")
  }

  console.info("Steps Created", { workflowId: workflow.id })

  const sendEventResponse = await inngest.send({
    name: "app/workflow.created",
    data: {
      address: values.address,
    },
  })

  console.info("Workflow Created Event Sent", sendEventResponse)

  return NextResponse.json(workflow, { status: 201 })
}

import { NextRequest, NextResponse } from "next/server";
import { supabase } from "../../../lib/supabase";
import { workflowsInsertSchema } from "../../../../schemas";
import { inngest } from "../../../lib/inngest";

export async function POST(req: NextRequest) {
  const values = workflowsInsertSchema
    .omit({ id: true, created_at: true })
    .parse(await req.json());

  const workflow = await supabase
    .from("workflows")
    .insert({
      address: values.address,
      name: values.name,
      trigger: values.trigger,
    })
    .returns();

  console.info("Workflow Created", workflow);

  const response = await inngest.send({
    name: "app/workflow.created",
    data: {
      address: values.address,
    },
  });

  console.info("Workflow Created Event Sent", response);

  return NextResponse.json(workflow, { status: 201 });
}

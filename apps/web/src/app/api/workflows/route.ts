import { NextRequest, NextResponse } from "next/server";
import { createWorkflowSchema } from "../../../../schemas";
import { inngest } from "../../../lib/inngest";
import { supabase } from "../../../lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const values = createWorkflowSchema.parse(await req.json());

    const workflowInsert = await supabase
      .from("workflows")
      .insert({
        address: values.address.toLowerCase(),
        name: values.name,
        trigger: values.trigger,
      })
      .select();

    if (workflowInsert.error) {
      console.error("Failed to insert workflow", workflowInsert.error);
      throw new Error("Failed to insert workflow");
    }

    if (!workflowInsert.data) {
      throw new Error("Failed to insert workflow");
    }

    const workflow = workflowInsert.data[0];

    if (!workflow) {
      console.error("Missing workflow id");
      throw new Error("Failed to insert workflow");
    }

    console.info("Workflow Created", { workflow });

    const stepInsert = await supabase.from("steps").insert(
      values.steps.map((step) => ({
        type: step.type,
        action: step.action,
        order: step.order,
        workflow_id: workflow.id,
        tx_sign_data: step.tx_sign_data,
      }))
    );

    if (stepInsert.error) {
      console.error("Failed to insert steps", stepInsert.error);
      throw new Error("Failed to insert steps");
    }

    console.info("Steps Created", { workflowId: workflow.id });

    const sendEventResponse = await inngest.send({
      name: "app/workflow.created",
      data: {
        address: values.address,
      },
    });

    console.info("Workflow Created Event Sent", sendEventResponse);

    return NextResponse.json(workflow, { status: 201 });
  } catch (e) {
    console.error(e);

    return NextResponse.json(e, { status: 500 });
  }
}

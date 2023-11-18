"use client";

import { z } from "zod";
import { STEP_RUN_STATUS, workflowStepSchema } from "../../schemas";
import { useWorkflowStepsStatus } from "./workflow-step-status-badge";

export function WorkflowSteps({
  workflowId,
  steps,
}: {
  workflowId: number;
  steps: Array<z.infer<typeof workflowStepSchema>>;
}) {
  const statuses = useWorkflowStepsStatus({
    workflowId,
    stepIds: steps.map((step) => step.id),
  });
  return (
    <section className="space-y-12">
      {steps.map((step) => {
        const { action } = workflowStepSchema.parse(step);
        const status = statuses[step.id];
        return (
          <article
            key={step.id}
            className={"bg-white border rounded-md overflow-hidden"}
          >
            <div className="px-4 py-3">
              {action.type === "SWAP_ON_1INCH" && <div>swap on 1inch</div>}
            </div>
            <hr />
            <div className="px-4 py-1">
              {status === STEP_RUN_STATUS.PENDING && (
                <div className="opacity-25">waiting</div>
              )}
              {status === STEP_RUN_STATUS.RUNNING && <div>running...</div>}
              {status === STEP_RUN_STATUS.COMPLETED && <div>completed ✅</div>}
            </div>
          </article>
        );
      })}
    </section>
  );
}

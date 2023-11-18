"use client";

import { z } from "zod";
import { STEP_RUN_STATUS, workflowStepSchema } from "../../schemas";
import { useWorkflowStepsStatus } from "./workflow-step-status-badge";
import { Card, CardContent, CardHeader } from "../app/components/ui/card";
import { Badge } from "../app/components/ui/badge";
import { Loader } from "lucide-react";

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
    <section className="flex flex-col items-center">
      {steps.map((step, i) => {
        const { action } = workflowStepSchema.parse(step);
        const status = statuses[step.id];
        return (
          <>
            <Card
              key={step.id}
              className={"bg-white border rounded-md overflow-hidden w-full"}
            >
              <CardHeader>
                <div className="flex justify-between items-start">
                  {action.type === "SWAP_ON_1INCH" && "Swap on 1inch"}
                  {status === STEP_RUN_STATUS.PENDING && (
                    <Badge variant="outline">Pending</Badge>
                  )}
                  {status === STEP_RUN_STATUS.RUNNING && (
                    <Badge variant="secondary">
                      Running <Loader className="w-3 h-3 ml-2 animate-spin" />
                    </Badge>
                  )}
                  {status === STEP_RUN_STATUS.COMPLETED && (
                    <Badge
                      className="bg-green-50 text-green-500"
                      variant="secondary"
                    >
                      Completed
                    </Badge>
                  )}
                </div>
              </CardHeader>
            </Card>
            {i < steps.length - 1 && (
              <div className="w-[2px] h-20 bg-gray-200" />
            )}
          </>
        );
      })}
    </section>
  );
}

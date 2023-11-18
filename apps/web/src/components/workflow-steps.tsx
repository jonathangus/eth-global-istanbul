"use client";

import { z } from "zod";
import { STEP_RUN_STATUS, workflowStepSchema } from "../../schemas";
import { useWorkflowStepsStatus } from "./workflow-step-status-badge";
import { Card, CardContent, CardHeader } from "../app/components/ui/card";
import { Badge } from "../app/components/ui/badge";
import { Loader } from "lucide-react";
import { STEP_ACTIONS } from "../step-constants";
import { Separator } from "../app/components/ui/separator";
import { SwapOn1InchForm } from "./action-item";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../app/components/ui/collapsible";

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
        const actionMeta = STEP_ACTIONS.find((x) => x.value === action.type);
        return (
          <>
            <Card key={step.id} className={"w-full"}>
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex gap-2 items-center">
                        <img width={24} height={24} src={actionMeta?.icon} />
                        {actionMeta?.label}
                      </div>
                      {status === STEP_RUN_STATUS.PENDING && (
                        <Badge variant="outline">Pending</Badge>
                      )}
                      {status === STEP_RUN_STATUS.RUNNING && (
                        <Badge variant="secondary">
                          Running{" "}
                          <Loader className="w-3 h-3 ml-2 animate-spin" />
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
                </CollapsibleTrigger>
                <CollapsibleContent asChild>
                  <>
                    <Separator />
                    <CardContent className="mt-4">
                      {action.type === "SWAP_ON_1INCH" && (
                        <SwapOn1InchForm
                          disabled
                          action={action}
                          onChange={() => {}}
                        />
                      )}
                    </CardContent>
                  </>
                </CollapsibleContent>
              </Collapsible>
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

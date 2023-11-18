"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { STEP_RUN_STATUS } from "../../schemas";

export function useWorkflowStepsStatus({
  workflowId,
  stepIds,
}: {
  workflowId: number;
  stepIds: number[];
}) {
  const [statusMap, setStatusMap] = useState<
    Record<number, (typeof STEP_RUN_STATUS)[keyof typeof STEP_RUN_STATUS]>
  >(Object.fromEntries(stepIds.map((id) => [id, STEP_RUN_STATUS.PENDING])));
  useEffect(() => {
    const channel = supabase
      .channel(`step-runs`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "step_runs",
          filter: `workflow_id=eq.${workflowId}`,
        },
        (stepRun) => {
          setStatusMap((prev) => ({
            ...prev,
            [stepRun.new.step_id]: stepRun.new.status,
          }));
        }
      )
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "step_runs",
          filter: `workflow_id=eq.${workflowId}`,
        },
        (stepRun) => {
          setStatusMap((prev) => ({
            ...prev,
            [stepRun.new.step_id]: stepRun.new.status,
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workflowId]);

  return statusMap;
}

"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

export function WorkflowStatusBadge({ workflowId }: { workflowId: string }) {
  const [status, setStatus] = useState("pending");

  useEffect(() => {
    const channel = supabase
      .channel("todos")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "workflows",
          filter: `id=eq.${workflowId}`,
        },
        (workflow) => setStatus(workflow.new.status)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workflowId]);

  return (
    <div className="px-2 py-1 rounded-sm text-sm bg-white border">{status}</div>
  );
}

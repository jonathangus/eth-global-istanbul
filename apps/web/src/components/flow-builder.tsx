"use client";

import { useRef, useState } from "react";
import { z } from "zod";
import {
  ACTIONS,
  workflowStepSchema,
  workflowTriggerSchema,
} from "../../schemas";
import { ActionItem } from "./action-item";
import { DownArrow } from "./icons/down-arrow";
import { TriggerItem } from "./trigger-item";
import { useRouter } from "next/navigation";
import { Button } from "../app/components/ui/button";

const Initialtrigger = {
  type: "TOKENS_RECEIVED",
  token: {
    name: "usdc",
    address: "0x12323243412328",
    amount: 10,
  },
};

const InitialStep = {
  config: {
    type: "SEND_PUSH_PROTOCOL_NOTIFICATION",
    title: "Money!!",
    message: "You just received money",
  },
  created_at: "",
  id: 1,
  order: 1,
  type: "action",
  workflow_id: 1,
};

export type Trigger = z.infer<typeof workflowTriggerSchema>;

export type Step = z.infer<typeof workflowStepSchema>;

let stepIdCounter = 1;

export function FlowBuilder() {
  const [trigger, setTrigger] = useState<Trigger | null>(null);
  const [steps, setSteps] = useState<Step[]>([]);

  const addStepButtonRef = useRef<HTMLButtonElement>();

  const addTrigger = (newTrigger: Trigger) => {
    setTrigger(newTrigger);
  };

  const addStep = async (newStep: Step) => {
    const stepWithId = { ...newStep, id: stepIdCounter++ };
    setSteps([...steps, stepWithId]);
    await new Promise((resolve) => setTimeout(resolve, 100));
    addStepButtonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  };

  const onRemoveStep = (stepToRemove: Step) => {
    const updatedSteps = steps
      .filter((step) => step.id !== stepToRemove.id)
      .map((step, index) => ({ ...step, order: index + 1 }));

    setSteps(updatedSteps);
  };

  const router = useRouter();

  const deployFlow = async () => {
    console.log("deploy flow");
    const response = await fetch("/api/workflows", {
      method: "POST",
      body: JSON.stringify({
        address: "myaddress",
        name: "my workflow",
        trigger: trigger,
        steps: steps,
      }),
    });

    const json = await response.json();

    router.push(`/workflows/${json.id}`);
  };

  return (
    <div className="flex flex-col items-center">
      {trigger && (
        <TriggerItem
          trigger={trigger}
          onRemoveTrigger={() => setTrigger(null)}
          onChange={(updatedTrigger: Trigger) => setTrigger(updatedTrigger)}
        />
      )}

      {steps.map((step: any) => (
        <>
          <div className="h-24 relative">
            <DownArrow />
            <div className="w-[2px] h-full  bg-gray-300" />
          </div>
          <ActionItem
            trigger={trigger}
            key={step.id}
            step={step}
            onRemoveStep={onRemoveStep}
            onChange={(updatedStep: Step) => {
              const updatedSteps = steps.map((s) => {
                if (s.id === updatedStep.id) {
                  return updatedStep;
                }
                return s;
              });
              setSteps(updatedSteps);
            }}
          />
        </>
      ))}
      <div className="space-y-4 flex flex-col mt-8">
        {!trigger && (
          <Button onClick={() => addTrigger(Initialtrigger)}>
            Add trigger
          </Button>
        )}

        {trigger && (
          <Button
            variant="outline"
            ref={addStepButtonRef}
            onClick={() =>
              addStep({
                ...InitialStep,
                order: steps.length + 1,
                action: {
                  type: ACTIONS.SWAP_ON_1INCH,
                  chainId: 1,
                  fromToken: {
                    address: "0x0",
                  },
                  toToken: {
                    address: "0x0",
                  },
                  amount: 10,
                },
                tx_sign_data: null,
              })
            }
          >
            Add step
          </Button>
        )}

        {trigger && steps.length > 0 && (
          <Button onClick={deployFlow}>Deploy Flow</Button>
        )}
      </div>
    </div>
  );
}

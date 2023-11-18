"use client"

import React, { useState } from "react"
import { TriggerItem } from "./trigger-item"
import { ActionItem } from "./action-item"
import { DownArrow } from "./icons/down-arrow"
import {
  stepsInsertSchema,
  workflowsInsertSchema,
} from "../../database.schemas"
import { z } from "zod"

const Initialtrigger = {
  id: "trigger-1",
  type: "tokenReceived",
  content: "on tokens received",
  address: "",
  amount: 0,
}

const InitialStep = {
  id: "1",
  type: "1inch",
  content: "step 1",
}

export type Trigger = {
  id: string
  type: string
  content: string
  address: string
  amount: number
}

export type Step = {
  id: string
  type: string
  content: string
}

// const Initialtrigger = {
//   id: "1",
//   created_at: "",
//   address: "",
//   name: "on tokens received erc-20",
//   trigger: {
//     id: "1",
//     type: "tokenReceived",
//     content: "on tokens received erc-20",
//     address: "0x12323243412328",
//     amount: 100,
//   },
// }

// const InitialStep = {
//   config: {
//     amount: 100,
//     from: "0x12323243412328",
//     to: "0x12323243412328",
//   },
//   created_at: "",
//   id: "1",
//   order: 1,
//   type: "1inch",
//   workflow_id: 1,
// }

// type Trigger = z.infer<typeof workflowsInsertSchema>
// type Step = z.infer<typeof stepsInsertSchema>

export function FlowBuilder() {
  const [trigger, setTrigger] = useState<Trigger | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  const addTrigger = (newTrigger: Trigger) => {
    setTrigger(newTrigger)
  }

  const addStep = (newStep: Step) => {
    setSteps([...steps, newStep])
  }

  const onRemoveStep = (stepToRemove: Step) => {
    setSteps(steps.filter((step) => step.id !== stepToRemove.id))
  }

  const addChild = () => {
    if (!trigger) {
      addTrigger(Initialtrigger)
    } else {
      addStep(InitialStep)
    }
  }

  const deployFlow = async () => {
    console.log("deploy flow")
    await fetch("api/workflows", {
      method: "POST",
      body: JSON.stringify({
        trigger: trigger,
        steps: steps,
      }),
    })
  }

  return (
    <div className="w-full h-full flex justify-center py-20">
      <div className="flex flex-col items-center gap-4">
        {trigger && (
          <TriggerItem
            trigger={trigger}
            onRemoveTrigger={() => setTrigger(null)}
            onChange={(updatedTrigger: Trigger) => setTrigger(updatedTrigger)}
          />
        )}

        {steps.map((step: any) => (
          <>
            <DownArrow />
            <ActionItem
              key={step.id}
              step={step}
              onRemoveStep={onRemoveStep}
              onChange={(updatedStep: Step) => {
                const updatedSteps = steps.map((s) => {
                  if (s.id === updatedStep.id) {
                    return updatedStep
                  }
                  return s
                })
                setSteps(updatedSteps)
              }}
            />
          </>
        ))}

        <button
          onClick={addChild}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {trigger ? "Add Action" : "Add Trigger"}
        </button>
        {trigger && steps.length > 0 && (
          <button
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
            onClick={deployFlow}
          >
            deploy flow
          </button>
        )}
      </div>
    </div>
  )
}

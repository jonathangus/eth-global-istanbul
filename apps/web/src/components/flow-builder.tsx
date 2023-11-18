"use client"

import React, { useState } from "react"
import { TriggerItem } from "./trigger-item"
import { ActionItem } from "./action-item"
import { DownArrow } from "./icons/down-arrow"
import {
  stepsInsertSchema,
  workflowsInsertSchema,
} from "../../database.schemas"
import { TypeOf, z } from "zod"
import { stepConfigSchema, workflowTriggerSchema } from "../../schemas"
import { randomUUID } from "crypto"

const Initialtrigger = {
  type: "TOKENS_RECEIVED",
  token: {
    name: "usdc",
    address: "0x12323243412328",
    amount: 10,
  },
}

const InitialStep = {
  config: {
    type: "SEND_PUSH_PROTOCOL",
    foo: "blablba",
  },
  created_at: "",
  id: 1,
  order: 1,
  type: "action",
  workflow_id: 1,
}

export type Trigger = z.infer<typeof workflowTriggerSchema>

export type Step = {
  config: {
    type: string
    foo: string
  }
  created_at?: string
  id: number
  order: number
  type: string
  workflow_id: number
}

let stepIdCounter = 1

export function FlowBuilder() {
  const [trigger, setTrigger] = useState<Trigger | null>(null)
  const [steps, setSteps] = useState<Step[]>([])

  const addTrigger = (newTrigger: Trigger) => {
    setTrigger(newTrigger)
  }

  const addStep = (newStep: Step) => {
    const stepWithId = { ...newStep, id: stepIdCounter++ }
    setSteps([...steps, stepWithId])
  }

  const onRemoveStep = (stepToRemove: Step) => {
    const updatedSteps = steps
      .filter((step) => step.id !== stepToRemove.id)
      .map((step, index) => ({ ...step, order: index + 1 }))

    setSteps(updatedSteps)
  }

  const addChild = () => {
    if (!trigger) {
      addTrigger(Initialtrigger)
    } else {
      addStep({
        ...InitialStep,
        order: steps.length + 1,
        workflow_id: 1,
      })
    }
  }

  const deployFlow = async () => {
    console.log("deploy flow")
    await fetch("api/workflows", {
      method: "POST",
      body: JSON.stringify({
        address: "myaddress",
        name: "my workflow",
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

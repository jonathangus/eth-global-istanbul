"use client"

import React, { useState } from "react"
import { TriggerItem } from "./trigger-item"
import { ActionItem } from "./action-item"

const Initialtrigger = {
  id: "trigger-1",
  type: "tokenReceived",
  content: "on tokens received",
  address: "",
  amount: 0,
}

const InitialStep = {
  id: "step-1",
  type: "type1",
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
    <div className="w-full h-full flex justify-center">
      <div className="flex flex-col items-center gap-4">
        {trigger !== null && (
          <TriggerItem
            trigger={trigger}
            onRemoveTrigger={() => setTrigger(null)}
            onChange={(updatedTrigger: Trigger) => setTrigger(updatedTrigger)}
          />
        )}
        {steps.map((step: any) => (
          <ActionItem key={step.id} step={step} onRemoveStep={onRemoveStep} />
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

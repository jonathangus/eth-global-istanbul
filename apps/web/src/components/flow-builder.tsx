"use client"

import { useRef, useState } from "react"
import { z } from "zod"
import {
  ACTIONS,
  VALID_LOGIC_VALUES,
  tokensReceivedERC20TriggerSchema,
  workflowStepSchema,
  workflowTriggerSchema,
} from "../../schemas"
import { ActionItem } from "./action-item"
import { DownArrow } from "./icons/down-arrow"
import { TriggerItem } from "./trigger-item"
import { useRouter } from "next/navigation"
import { Button } from "../app/components/ui/button"
import { useAA } from "../context/permissionless-context"
import { usepassKeyContext } from "../context/passkey-context"
import { useChain } from "../hooks/use-chain"
import { Input } from "../app/components/ui/input"

const Initialtrigger: Trigger = {
  type: "TOKENS_RECEIVED_ERC20",
  token: {
    name: "ETH",
    address: "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D",
    amount: 0.2,
    logic: VALID_LOGIC_VALUES.GREATER_THAN,
  },
}

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
}

export type Trigger = z.infer<typeof workflowTriggerSchema>
export type Step = z.infer<typeof workflowStepSchema>

let stepIdCounter = 1

const tomatoNames = [
  "Tommy Tomato",
  "Cherry Tomato",
  "Saucy Tomato",
  "Tomato Tango",
  "Sweet Tomato",
]

function getRandomTomatoName(): string {
  const defaultName = "Default Tomato"
  if (tomatoNames.length === 0) {
    return defaultName
  }
  const randomIndex = Math.floor(Math.random() * tomatoNames.length)
  return tomatoNames[randomIndex] || defaultName
}

export function FlowBuilder() {
  const [trigger, setTrigger] = useState<Trigger | null>(null)
  const [steps, setSteps] = useState<Step[]>([])
  const [workFlowName, setWorkFlowName] = useState<string>(
    getRandomTomatoName()
  )

  const addStepButtonRef = useRef<HTMLButtonElement>(null)

  const addTrigger = (newTrigger: Trigger) => {
    setTrigger(newTrigger)
  }

  const addStep = async (newStep: Step) => {
    const stepWithId = { ...newStep, id: stepIdCounter++ }
    setSteps([...steps, stepWithId])
    await new Promise((resolve) => setTimeout(resolve, 100))
    addStepButtonRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    })
  }

  const onRemoveStep = (stepToRemove: Step) => {
    const updatedSteps = steps
      .filter((step) => step.id !== stepToRemove.id)
      .map((step, index) => ({ ...step, order: index + 1 }))

    setSteps(updatedSteps)
  }

  const { smartAccount } = usepassKeyContext()
  const { createWorkflow, isSaving, completedSteps } = useAA()

  const { chainId } = useChain()

  const deployFlow = async () => {
    try {
      const parsedTrigger = tokensReceivedERC20TriggerSchema.parse({
        ...trigger,
        token: {
          ...trigger.token,
          amount: parseFloat(trigger.token.amount),
        },
      })
      console.log("deploy flow")
      createWorkflow({
        address: smartAccount,
        name: workFlowName,
        trigger: parsedTrigger,
        steps: steps,
        chain_id: chainId,
      })
    } catch (error) {
      // Handle validation error (e.g., show an error message)
      console.error("Validation error:", error)
    }
  }

  return (
    <div className="flex flex-col items-center">
      <Input
        value={workFlowName}
        onChange={(e) => setWorkFlowName(e.target.value)}
        placeholder="Workflow name"
        className="text-2xl w-full py-6 bg-white mb-4"
      />
      {trigger && (
        <TriggerItem
          trigger={trigger}
          onChange={(updatedTrigger: Trigger) => setTrigger(updatedTrigger)}
        />
      )}

      {steps.map((step) => (
        <>
          <div className="h-16 relative">
            <DownArrow />
            <div className="w-[2px] h-full  bg-gray-300" />
          </div>
          <ActionItem
            isSigned={completedSteps.includes(step.order)}
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
      <div className="space-y-4 flex flex-col mt-8">
        {!trigger && (
          <Button onClick={() => addTrigger(Initialtrigger)}>
            Add trigger
          </Button>
        )}

        {trigger && (
          <Button
            variant="outline"
            onClick={() =>
              addStep({
                ...InitialStep,
                order: steps.length + 1,
                action: {
                  type: ACTIONS.SWAP_ON_1INCH,
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
          <Button onClick={deployFlow} ref={addStepButtonRef}>
            {isSaving ? "Saving..." : "Deploy flow"}
          </Button>
        )}
      </div>
    </div>
  )
}

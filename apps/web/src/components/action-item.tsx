import React, { useState } from "react"
import { Step, Trigger } from "./flow-builder"
import { SelectActionDropDown } from "./select-action-dropdown"
import { TokenSelect } from "./token-select"
import clsx from "clsx"
import { TrashCanIcon } from "./icons/trash-can-icon"
import { set } from "zod"

type ActionItemProps = {
  step: Step
  onChange: (step: Step) => void
  onRemoveStep: (step: Step) => void
}

export const ActionItem = ({
  step,
  onChange,
  onRemoveStep,
}: ActionItemProps) => {
  const [isHovered, setisHovered] = useState(false)

  const handleDropdownChange = (newValue: string) => {
    onChange({ ...step, config: { ...step.config, type: newValue } })
  }

  const handleRemoveStep = () => {
    onRemoveStep(step)
  }

  const tokenOptions = [
    {
      value: "SEND_PUSH_PROTOCOL",
      label: "push notif",
      image: "/icons/ape.svg",
    },
    {
      value: "SEND_SLACK_MESSAGE",
      label: "swap 1inch",
      image: "/icons/1inch-logo.svg",
    },
  ]

  return (
    <div
      className="w-[600px] gap-4 bg-gray-200 rounded-md shadow-md flex flex-col relative"
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute top-0 right-0 translate-x-3 translate-y--6 rotate-[30deg] z-[999] cursor-pointer"
          onClick={handleRemoveStep}
        >
          <TrashCanIcon />
        </div>
      )}
      <div className="flex w-full rounded-t-md bg-white h-full py-4">
        <TokenSelect
          value={step.config.type}
          onChange={handleDropdownChange}
          options={tokenOptions}
        />
      </div>
    </div>
  )
}
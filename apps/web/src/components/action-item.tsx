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
    onChange({ ...step, type: newValue })
  }

  const handleRemoveStep = () => {
    onRemoveStep(step)
  }

  const tokenOptions = [
    { value: "PUSH_SLACK", label: "push notif", image: "/icons/ape.svg" },
    { value: "1inch", label: "swap 1inch", image: "/icons/1inch-logo.svg" },
  ]

  return (
    <div
      className="w-[600px] gap-4 pb-5 bg-gray-200 rounded-md shadow-md flex flex-col relative"
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
      <div className="flex w-full rounded-t-md bg-white h-1/3 py-4">
        <TokenSelect
          value={step.type}
          onChange={handleDropdownChange}
          options={tokenOptions}
        />
      </div>
    </div>
  )
}

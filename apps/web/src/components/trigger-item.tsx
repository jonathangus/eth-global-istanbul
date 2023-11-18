import React, { useState } from "react"
import { Trigger } from "./flow-builder"
import { SelectActionDropDown } from "./select-action-dropdown"
import { TokenSelect } from "./token-select"
import clsx from "clsx"
import { TrashCanIcon } from "./icons/trash-can-icon"
import { set } from "zod"

type TriggerItemProps = {
  trigger: Trigger
  onChange: (trigger: Trigger) => void
  onRemoveTrigger: () => void
}

export const TriggerItem = ({
  trigger,
  onChange,
  onRemoveTrigger,
}: TriggerItemProps) => {
  const [isHovered, setisHovered] = useState(false)

  const handleDropdownChange = (newValue: string) => {
    onChange({ ...trigger, type: newValue })
  }

  const handleTokenChange = (newValue: string) => {
    onChange({ ...trigger, address: newValue })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...trigger, address: e.target.value })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...trigger, amount: parseInt(e.target.value) })
  }

  const dropdownOptions = [
    { value: "tokenReceived", label: "on tokens received erc-20" },
    { value: "nftReceived", label: "on tokens received erc-721" },
  ]

  const tokenOptions = [
    { value: "0x12323243412328", label: "usdc", image: "/icons/usdc.svg" },
    { value: "0x123232434231", label: "gho", image: "/icons/gho.svg" },
    { value: "0x1232324123243", label: "ape", image: "/icons/ape.svg" },
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
          onClick={onRemoveTrigger}
        >
          <TrashCanIcon />
        </div>
      )}
      <div className="flex w-full rounded-t-md bg-white h-1/3 py-4">
        {trigger.type === "tokenReceived" && (
          <div className="flex w-1/4">
            <TokenSelect
              value={trigger.address}
              onChange={handleTokenChange}
              options={tokenOptions}
            />
          </div>
        )}
        <div className={clsx("flex w-full")}>
          <SelectActionDropDown
            value={trigger.type}
            onChange={handleDropdownChange}
            options={dropdownOptions}
          />
        </div>
      </div>
      <div className="flex h-2/3 flex-col px-6">
        <div className="py-3">
          <p>Token contract address</p>
        </div>

        <input
          className="w-full rounded-md px-3 py-2"
          onChange={handleAddressChange}
          value={trigger.address || ""}
        />
        <div className="py-3">
          <p>Received amount</p>
        </div>

        <input
          className="w-full rounded-md px-3 py-2"
          type="number"
          onChange={handleAmountChange}
          value={trigger.amount || 0}
        />
      </div>
    </div>
  )
}

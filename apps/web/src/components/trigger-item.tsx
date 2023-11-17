import React from "react"
import { Trigger } from "./flow-builder"

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
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ ...trigger, type: e.target.value })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...trigger, address: e.target.value })
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...trigger, amount: parseInt(e.target.value) })
  }

  return (
    <div className="w-[600px] gap-4 pb-5 bg-gray-200 rounded-md shadow-md flex flex-col">
      <div className="flex w-full rounded-t-md bg-white h-1/3 p-4">
        <select
          className="w-1/3"
          value={trigger.type}
          onChange={handleSelectChange}
        >
          <option value="tokenReceived">on tokens received</option>
        </select>
      </div>
      <div className="flex h-2/3 flex-col px-6">
        <p>Token contract address</p>
        <input
          className="w-full rounded-md"
          onChange={handleAddressChange}
          value={trigger.address || ""}
        />
        <p>Received amount</p>
        <input
          className="w-full rounded-md"
          type="number"
          onChange={handleAmountChange}
          value={trigger.amount || 0}
        />
      </div>
      <button onClick={onRemoveTrigger}>Remove Trigger</button>
    </div>
  )
}

import React from "react"

type ActionItemProps = {
  step: any
  onRemoveStep: (step: any) => void
}

export const ActionItem = ({ step, onRemoveStep }: ActionItemProps) => {
  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {}

  return (
    <div className="w-[600px] h-[200px] bg-gray rounded-md shadow-md flex flex-col">
      <div className="flex w-full rounded-t-md bg-white h-1/3">
        <select
          className="w-1/3"
          value={step.type}
          onChange={handleSelectChange}
        >
          <option value="tokenReceived">on tokens received</option>
        </select>
      </div>
      <button onClick={() => onRemoveStep(step)}>Remove Step</button>
    </div>
  )
}

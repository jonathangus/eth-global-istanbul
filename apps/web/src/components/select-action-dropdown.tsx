import React, { useState } from "react"

type Option = {
  value: string
  label: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

export const SelectActionDropDown = ({ value, onChange, options }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full relative">
      <button
        className="w-full bg-white rounded-md text-left px-4 py-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        {options.find((option) => option.value === value)?.label ||
          "Select an option"}
      </button>
      {isOpen && (
        <div className="absolute bg-white rounded-md shadow-md w-full mt-1 z-5">
          {options
            .filter((option) => option.value !== value)
            .map((option) => (
              <div
                key={option.value}
                className="hover:bg-gray-100 w-full text-left px-4 py-2 cursor-pointer"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

import React, { useState } from "react"

type Option = {
  value: string
  label: string
  image: string
}

type Props = {
  value: string
  onChange: (value: string) => void
  options: Option[]
}

export const TokenSelect = ({ value, onChange, options }: Props) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="w-full relative">
      <button
        className="w-full bg-white rounded-md text-left px-4 py-2 flex items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        {value ? (
          <>
            <img
              src={
                options.find((option) => option.value === value)?.image || ""
              }
              alt=""
              className="w-6 h-6 mr-2"
            />
            {options.find((option) => option.value === value)?.label}
          </>
        ) : (
          "Select an option"
        )}
      </button>
      {isOpen && (
        <div className="absolute bg-white rounded-md shadow-md w-full mt-1 z-4">
          {options
            .filter((option) => option.value !== value)
            .map((option) => (
              <div
                key={option.value}
                className="hover:bg-gray-100 w-full text-left px-4 py-2 cursor-pointer flex items-center"
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
              >
                <img src={option.image} alt="" className="w-6 h-6 mr-2" />
                {option.label}
              </div>
            ))}
        </div>
      )}
    </div>
  )
}

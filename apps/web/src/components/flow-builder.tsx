"use client"

import React, { useState } from "react"
import { FlowItem } from "./flow-item"

export function FlowBuilder() {
  const [children, setChildren] = useState<React.ReactNode[]>([])
  const [showModal, setShowModal] = useState(false)
  const [childType, setChildType] = useState("")

  const addChild = () => {
    const newChild = (
      <FlowItem
        key={children.length}
        type={childType}
        content={`Child ${children.length + 1}`}
      />
    )
    setChildren([...children, newChild])
    setShowModal(false)
  }

  return (
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-center">
        {children}
        <button
          onClick={() => setShowModal(true)}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          Add
        </button>

        {showModal && (
          <div className="absolute w-[30vw] h-[30vh] bg-white flex border-2 border-black">
            <div className="">
              <h4>Select Child Type</h4>
              <div className="w-full flex">
                <button
                  onClick={() => setChildType("trigger")}
                  className={`p-4 border-2 ${
                    childType === "trigger"
                      ? "bg-blue-500 text-white"
                      : "bg-white border-black"
                  }`}
                >
                  trigger
                </button>
                <button
                  onClick={() => setChildType("condition")}
                  className={`p-4 border-2 ${
                    childType === "condition"
                      ? "bg-blue-500 text-white"
                      : "bg-white border-black"
                  }`}
                >
                  condition
                </button>
                <button
                  onClick={() => setChildType("action")}
                  className={`p-4 border-2 ${
                    childType === "action"
                      ? "bg-blue-500 text-white"
                      : "bg-white border-black"
                  }`}
                >
                  action
                </button>
              </div>
              <button
                onClick={addChild}
                className="mt-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-700"
              >
                Add Child
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

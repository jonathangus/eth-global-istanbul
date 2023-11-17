"use client"

import React, { useState } from "react"
import { TriggerItem } from "./trigger-item"
import { ActionItem } from "./action-item"

export function FlowBuilder2() {
  const [children, setChildren] = useState<React.ReactNode[]>([])

  const addTrigger = () => {
    const newChild = <TriggerItem />
    setChildren([...children, newChild])
  }

  const addAction = () => {
    const newChild = <ActionItem />
    setChildren([...children, newChild])
  }

  const addChild = () => {
    if (!children || children.length === 0) {
      addTrigger()
    } else {
      addAction()
    }
  }

  return (
    <div className="w-full flex justify-center bg-gray-300">
      <div className="flex flex-col items-center gap-4">
        {children}
        <button
          onClick={() => addChild()}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
        >
          {children && children.length > 0 ? "Add Action" : "Add Trigger"}
        </button>
      </div>
    </div>
  )
}

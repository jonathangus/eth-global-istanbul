import React from "react"

type Props = {
  type: any
  content: string
}

export const FlowItem = ({ type, content }: Props) => {
  return (
    <div
      className={`child-item ${
        type === "type1" ? "bg-blue-200" : "bg-green-200"
      }`}
    >
      {content}
    </div>
  )
}

import React, { useState } from "react"
import { SelectActionDropDown } from "./select-action-dropdown"
import { TokenSelect } from "./token-select"
import clsx from "clsx"
import { TrashCanIcon } from "./icons/trash-can-icon"
import { set } from "zod"
import { z } from "zod"
import {
  ACTIONS,
  TRIGGER_TYPE,
  VALID_LOGIC_VALUES,
  swapOn1InchConfigSchema,
  tokenSchema,
  workflowTriggerSchema,
} from "../../schemas"
import { Card, CardContent, CardHeader } from "../app/components/ui/card"
import { Input } from "../app/components/ui/input"
import { Label } from "../app/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select"
import { Separator } from "../app/components/ui/separator"
import { Trigger } from "./flow-builder"

type TriggerItemProps = {
  trigger: Trigger
  onChange: (trigger: Trigger) => void
}

export const TriggerItem = ({ trigger, onChange }: TriggerItemProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <Label className="space-y-2">
          <span>On event</span>
          <Select
            value={trigger.type}
            onValueChange={(
              value:
                | "TOKENS_RECEIVED_ERC20"
                | "TOKENS_RECEIVED_ERC721"
                | "TOKENS_LEAVE_ERC20"
                | "TOKENS_LEAVE_ERC721"
            ) => onChange({ ...trigger, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="event" />
            </SelectTrigger>
            <SelectContent>
              {[
                {
                  value: "TOKENS_RECEIVED_ERC20",
                  label: "on tokens received erc-20",
                  image: "/icons/receive.png",
                },
                {
                  value: "TOKENS_RECEIVED_ERC721",
                  label: "on tokens received erc-721",
                  image: "/icons/receive.png",
                },
                {
                  value: "TOKENS_LEAVE_ERC20",
                  label: "on tokens leave erc-20",
                  image: "/icons/send.png",
                },
                {
                  value: "TOKENS_LEAVE_ERC721",
                  label: "on tokens leave erc-721",
                  image: "/icons/send.png",
                },
              ].map(({ value, label, image }) => (
                <SelectItem value={value}>
                  <div className="flex items-center">
                    <img src={image} alt="receive" className="w-6 h-6 mr-2" />
                    <span>{label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label>
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        {trigger.type === TRIGGER_TYPE.TOKENS_RECEIVED_ERC20 ||
        trigger.type === TRIGGER_TYPE.TOKENS_LEAVE_ERC20 ? (
          <OnTokensReceivedErc20
            token={trigger.token}
            onChange={(token) => onChange({ ...trigger, token })}
          />
        ) : (
          <OnTokensReceivedErc721
            token={trigger.token}
            onChange={(token) => onChange({ ...trigger, token })}
          />
        )}
      </CardContent>
    </Card>
  )
}

const TOKEN_OPTIONS = [
  {
    value: "USDC",
    label: "USDC",
    image: "/icons/usdc.svg",
    address: "0x12323243412328",
  },
  { value: "GHO", label: "GHO", image: "/icons/gho.svg", address: "54321" },
  {
    value: "APE",
    label: "APE",
    image: "/icons/ape.svg",
    address: "783947380",
  },
  {
    value: "ETH",
    label: "ETH",
    image: "/icons/ether.svg",
    address: "0x7af963cF6D228E564e2A0aA0DdBF06210B38615D",
  },
  {
    value: "custom",
    label: "custom",
    image: "/icons/Custom.svg",
    address: "",
  },
]
function OnTokensReceivedErc20({
  token,
  onChange,
}: {
  onChange: (values: z.infer<typeof tokenSchema>) => void
  token: z.infer<typeof tokenSchema>
}) {
  const handleTokenChange = (value: string) => {
    const selectedTokenObj = TOKEN_OPTIONS.find(
      (option) => option.value === value
    )

    onChange({
      ...token,
      name: value,
      address: selectedTokenObj ? selectedTokenObj.address : "0x",
    })
  }

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...token,
      address: e.target.value,
    })
  }

  const handleAmountChange = (e) => {
    let value = e.target.value
    value = value.replace(/,/g, ".")
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      onChange({ ...token, amount: value === "" ? null : value })
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Label className="space-y-2">
        <span>Token</span>
        <Select value={token.name} onValueChange={handleTokenChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Token" />
          </SelectTrigger>
          <SelectContent>
            {TOKEN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                <div className="flex items-center">
                  {option.value === "custom" ? (
                    <div className="w-6 h-6 mr-2" />
                  ) : (
                    <img
                      src={option.image}
                      alt={option.value}
                      className="w-6 h-6 mr-2"
                    />
                  )}
                  <span>{option.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      {token.name === "custom" && (
        <Label className="space-y-2">
          <span>address</span>
          <Input
            placeholder="Enter The Token Address"
            type="string"
            value={token.address}
            onChange={handleAddressChange}
          />
        </Label>
      )}
      <Label className="space-y-2">
        <span>Amount</span>
        <Input
          placeholder="how many tokens"
          type="text"
          inputMode="decimal"
          pattern="[0-9.,]*"
          value={token.amount || ""}
          onChange={handleAmountChange}
        />
        {/* <Input
          placeholder="how many tokens"
          type="number"
          inputMode="decimal"
          value={token.amount}
          onChange={(e) => {
            onChange({ ...token, amount: Number(e.target.value) })
          }}
        /> */}
      </Label>
    </div>
  )
}

function OnTokensReceivedErc721({
  token,
  onChange,
}: {
  onChange: (values: z.infer<typeof tokenSchema>) => void
  token: z.infer<typeof tokenSchema>
}) {
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...token,
      address: e.target.value,
    })
  }

  return (
    <div className="flex flex-col gap-4">
      <Label className="space-y-2">
        <span>address</span>
        <Input
          placeholder="Enter The Token Address"
          type="string"
          value={token.address}
          onChange={handleAddressChange}
        />
      </Label>
      <Label className="space-y-2">
        <span>Logic</span>
        <Select
          value={token.logic}
          onValueChange={(value) =>
            onChange({
              ...token,
              logic:
                VALID_LOGIC_VALUES[value as keyof typeof VALID_LOGIC_VALUES],
            })
          }
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Logic" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(VALID_LOGIC_VALUES).map((logicValue) => (
              <SelectItem key={logicValue} value={logicValue}>
                {logicValue}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className="space-y-2">
        <span>Amount</span>
        <Input
          placeholder="how many tokens"
          type="number"
          value={token.amount || 0}
          onChange={(e) => {
            onChange({ ...token, amount: Number(e.target.value) })
          }}
        />
      </Label>
    </div>
  )
}

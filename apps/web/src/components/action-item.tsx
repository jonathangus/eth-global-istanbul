import { z } from "zod"
import {
  ACTIONS,
  ERC721SendActionConfigSchema,
  MintNFTActionConfigSchema,
  swapOn1InchConfigSchema,
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
import { Step, Trigger } from "./flow-builder"

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../app/components/ui/command"
import { cn } from "../lib/utils"
import { Button } from "../app/components/ui/button"
import { CheckIcon } from "lucide-react"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../app/components/ui/popover"
import { STEP_ACTIONS, STEP_CONDITIONS } from "../step-constants"
import Image from "next/image"
import { Badge } from "../app/components/ui/badge"

type ActionItemProps = {
  step: Step
  onChange: (step: Step) => void
  onRemoveStep: (step: Step) => void
  isSigned?: boolean
}

export const ActionItem = ({
  step,
  onChange,
  onRemoveStep,
  isSigned,
}: ActionItemProps) => {
  const handleDropdownChange = (newValue: string) => {
    if (newValue === ACTIONS.MINT_NFT) {
      onChange({
        ...step,
        action: {
          ...step.action,
          type: newValue,
          address: "0x4ed05dd4b0149deda80ea26683b2ef72820e3e0f",
        },
      })
    } else {
      onChange({ ...step, action: { ...step.action, type: newValue } })
    }
  }

  const handleRemoveStep = () => {
    onRemoveStep(step)
  }

  // if (step.action.type === "SEND_PUSH_PROTOCOL_NOTIFICATION") {
  //   console.log("hello");
  //   render = (
  //     <div className="flex flex-col gap-4 p-4">
  //       <input
  //         className="w-full rounded-md bg-gray-100 px-4 py-2"
  //         placeholder="Title"
  //         value={step.action.title}
  //         onChange={(e) =>
  //           onChange({
  //             ...step,
  //             action: { ...step.action, title: e.target.value },
  //           })
  //         }
  //       />
  //       <input
  //         className="w-full rounded-md bg-gray-100 px-4 py-2"
  //         placeholder="Message"
  //         value={step.action.message}
  //         onChange={(e) =>
  //           onChange({
  //             ...step,
  //             action: { ...step.action, message: e.target.value },
  //           })
  //         }
  //       />
  //     </div>
  //   );
  // }

  const selected = STEP_ACTIONS.find((x) => x.value === step.action.type)

  return (
    <Card className="w-full">
      <CardHeader className="flex-row justify-between items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between"
            >
              {selected ? (
                <span className="inline-flex items-center">
                  <img
                    height={24}
                    width={24}
                    src={selected.icon}
                    className="mr-2"
                  />
                  {selected.label}
                </span>
              ) : (
                "Select..."
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="p-0" align="start">
            <Command>
              <CommandInput placeholder="Search..." />
              <CommandEmpty>Nothing found</CommandEmpty>
              <CommandGroup heading="Actions">
                {STEP_ACTIONS.map((x) => (
                  <CommandItem
                    key={x.value}
                    value={x.value}
                    onSelect={(currentValue) => {
                      handleDropdownChange(x.value)
                    }}
                    className={cn(
                      step.action.type === x.value && "bg-slate-50"
                    )}
                  >
                    <img
                      width={24}
                      height={24}
                      src={x.icon}
                      alt={x.label}
                      className="mr-2"
                    />
                    {x.label}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandGroup heading="Conditions">
                {STEP_CONDITIONS.map((x) => (
                  <CommandItem
                    key={x.value}
                    value={x.value}
                    onSelect={(currentValue) => {
                      handleDropdownChange(x.value)
                    }}
                    className={cn(
                      step.action.type === x.value && "bg-slate-50"
                    )}
                  >
                    <img
                      width={24}
                      height={24}
                      src={x.icon}
                      alt={x.label}
                      className="mr-2"
                    />
                    {x.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {/* <Label className="space-y-2">
          <Select
            value={step.action.type}
            onValueChange={(value) => handleDropdownChange(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chain" />
            </SelectTrigger>
            <SelectContent>
              {[
                { value: ACTIONS.SWAP_ON_1INCH, label: "Swap on 1inch" },
                { value: "send-tokens", label: "Send tokens" },
              ].map(({ value, label }) => (
                <SelectItem value={value}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </Label> */}
        {isSigned ? (
          <Badge className="bg-green-50 text-green-500" variant="secondary">
            Signed
          </Badge>
        ) : (
          <Badge variant="outline">Unsigned</Badge>
        )}
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        {step.action.type === "SWAP_ON_1INCH" && (
          <SwapOn1InchForm
            action={step.action}
            onChange={(action) => onChange({ ...step, action })}
          />
        )}
        {step.action.type === "MINT_NFT" && (
          <MintNftForm
            action={step.action}
            onChange={(action) => onChange({ ...step, action })}
          />
        )}
        {step.action.type === "SEND_ERC_721" && (
          <SendERC721Form
            action={step.action}
            onChange={(action) => onChange({ ...step, action })}
          />
        )}

        {!step.action.type.includes("_") && (
          <p className="text-center w-full text-gray-300">Loading</p>
        )}
      </CardContent>
    </Card>
  )
}

const TOKEN_OPTIONS = [
  { value: "USDC", label: "usdc", image: "/icons/usdc.svg", address: "1234" },
  { value: "GHO", label: "gho", image: "/icons/gho.svg", address: "54321" },
  {
    value: "APE",
    label: "ape",
    image: "/icons/ape.svg",
    address: "783947380",
  },
]

export function SwapOn1InchForm({
  onChange,
  action,
  disabled = false,
}: {
  onChange: (values: z.infer<typeof swapOn1InchConfigSchema>) => void
  action: z.infer<typeof swapOn1InchConfigSchema>
  disabled?: boolean
}) {
  return (
    <div className="flex flex-col gap-4">
      <Label className="space-y-2">
        <span>From</span>
        <Select
          value={action.fromToken.address}
          onValueChange={(value) =>
            onChange({ ...action, fromToken: { address: value } })
          }
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Trigger Type" />
          </SelectTrigger>
          <SelectContent>
            {TOKEN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>
      <Label className="space-y-2">
        <span>To</span>
        <Select
          value={action.toToken.address}
          onValueChange={(value) =>
            onChange({ ...action, toToken: { address: value } })
          }
          disabled={disabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Trigger Type" />
          </SelectTrigger>
          <SelectContent>
            {TOKEN_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Label>

      <Label className="space-y-2">
        <span>Amount</span>
        <Input
          placeholder="Enter Token Amount"
          type="number"
          value={action.amount}
          onChange={(e) => {
            onChange({ ...action, amount: Number(e.target.value) })
          }}
          disabled={disabled}
        />
      </Label>
    </div>
  )
}

export function MintNftForm({
  onChange,
  action,
}: {
  onChange: (values: z.infer<typeof MintNFTActionConfigSchema>) => void
  action: z.infer<typeof MintNFTActionConfigSchema>
}) {
  return (
    <div className="flex flex-col gap-4">
      <Label className="space-y-2">
        <span>Token Address</span>
        <Input
          placeholder="0x024658"
          value={action.address}
          onChange={(e) => {
            onChange({ ...action, address: e.target.value })
          }}
        />
      </Label>
    </div>
  )
}

export function SendERC721Form({
  onChange,
  action,
}: {
  onChange: (values: z.infer<typeof ERC721SendActionConfigSchema>) => void
  action: z.infer<typeof ERC721SendActionConfigSchema>
}) {
  return (
    <div className="flex flex-col gap-4">
      <Label className="space-y-2">
        <span>Receiver Address</span>
        <Input
          placeholder="0x024658"
          value={action.receiver}
          onChange={(e) => {
            onChange({ ...action, receiver: e.target.value })
          }}
        />
      </Label>
    </div>
  )
}

import { z } from "zod";
import { ACTIONS, swapOn1InchConfigSchema } from "../../schemas";
import { Card, CardContent, CardHeader } from "../app/components/ui/card";
import { Input } from "../app/components/ui/input";
import { Label } from "../app/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { Separator } from "../app/components/ui/separator";
import { Step, Trigger } from "./flow-builder";

import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "../app/components/ui/command";
import { cn } from "../lib/utils";
import { Button } from "../app/components/ui/button";
import { CheckIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../app/components/ui/popover";
import { STEP_ACTIONS, STEP_CONDITIONS } from "../step-constants";
import Image from "next/image";

type ActionItemProps = {
  step: Step;
  onChange: (step: Step) => void;
  onRemoveStep: (step: Step) => void;
  isSigned?: boolean;
};

export const ActionItem = ({
  step,
  onChange,
  onRemoveStep,
}: ActionItemProps) => {
  const handleDropdownChange = (newValue: string) => {
    onChange({ ...step, action: { ...step.action, type: newValue } });
  };

  const handleRemoveStep = () => {
    onRemoveStep(step);
  };

  const tokenOptions = [
    {
      value: "SEND_PUSH_PROTOCOL_NOTIFICATION",
      label: "push notif",
      image: "/icons/ape.svg",
    },
    {
      value: "SWAP_ONE_INCH",
      label: "swap 1inch",
      image: "/icons/1inch-logo.svg",
    },
  ];

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

  return (
    <Card className="w-full">
      <CardHeader>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="justify-between"
            >
              {step.action.type
                ? STEP_ACTIONS.find(
                    (framework) => framework.value === step.action.type
                  )?.label
                : "Select..."}
              {/* <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" /> */}
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
                      handleDropdownChange(x.value);
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
                      handleDropdownChange(x.value);
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
      </CardHeader>
      <Separator className="mb-4" />
      <CardContent>
        {step.action.type === "SWAP_ON_1INCH" && (
          <SwapOn1InchForm
            action={step.action}
            onChange={(action) => onChange({ ...step, action })}
          />
        )}
      </CardContent>
    </Card>
  );
};

const TOKEN_OPTIONS = [
  { value: "USDC", label: "usdc", image: "/icons/USDC.svg", address: "1234" },
  { value: "GHO", label: "gho", image: "/icons/GHO.svg", address: "54321" },
  {
    value: "APE",
    label: "ape",
    image: "/icons/APE.svg",
    address: "783947380",
  },
];
function SwapOn1InchForm({
  onChange,
  action,
}: {
  onChange: (values: z.infer<typeof swapOn1InchConfigSchema>) => void;
  action: z.infer<typeof swapOn1InchConfigSchema>;
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
            onChange({ ...action, amount: Number(e.target.value) });
          }}
        />
      </Label>
    </div>
  );
}

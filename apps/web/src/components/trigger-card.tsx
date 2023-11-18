"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import { Button } from "../app/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../app/components/ui/form"
import { Input } from "../app/components/ui/input"
import { ACTIONS, TRIGGER_TYPE, workflowTriggerSchema } from "../../schemas"
import { Trigger } from "./flow-builder"
import { useState } from "react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../app/components/ui/card"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select"

const formSchema = workflowTriggerSchema

type Props = {
  trigger: Trigger
  onChange: (trigger: Trigger) => void
  onRemoveTrigger: () => void
  addTrigger: (trigger: Trigger) => void
}

const dropdownOptions = [
  { value: "TOKENS_RECEIVED", label: "on tokens received erc-20" },
  { value: "NFT_RECEIVED", label: "on tokens received erc-721" },
]

const tokenOptions = [
  { value: "USDC", label: "usdc", image: "/icons/USDC.svg", address: "1234" },
  { value: "GHO", label: "gho", image: "/icons/GHO.svg", address: "54321" },
  {
    value: "APE",
    label: "ape",
    image: "/icons/APE.svg",
    address: "783947380",
  },
]

export const TriggerCard = ({
  trigger,
  onChange,
  onRemoveTrigger,
  addTrigger,
}: Props) => {
  function onSubmit(values: z.infer<typeof formSchema>) {
    addTrigger(values)
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: trigger,
  })

  // State variables for dropdown values
  const [selectedTriggerType, setSelectedTriggerType] = useState(
    trigger.type || TRIGGER_TYPE.TOKENS_RECEIVED
  )

  return (
    <Card className="w-[40vw] py-5">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <Select>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select Trigger Type" />
                      </SelectTrigger>
                      <SelectContent>
                        {dropdownOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {selectedTriggerType === TRIGGER_TYPE.TOKENS_RECEIVED && (
              <div>
                <FormField
                  name="token.value"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Token</FormLabel>
                      <FormControl>
                        <Select>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Trigger Type" />
                          </SelectTrigger>
                          <SelectContent>
                            {tokenOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="token.address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Token Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="token.amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Token Amount" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

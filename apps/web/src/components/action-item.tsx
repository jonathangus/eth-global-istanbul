import React, { useState } from "react";
import { Step, Trigger } from "./flow-builder";
import { SelectActionDropDown } from "./select-action-dropdown";
import { TokenSelect } from "./token-select";
import clsx from "clsx";
import { TrashCanIcon } from "./icons/trash-can-icon";
import { set } from "zod";
import Image from "next/image";
import { ThinArrow } from "./icons/thin-arrow";

type ActionItemProps = {
  trigger: Trigger | null;
  step: Step;
  onChange: (step: Step) => void;
  onRemoveStep: (step: Step) => void;
};

export const ActionItem = ({
  step,
  onChange,
  onRemoveStep,
  trigger,
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

  let render: React.ReactNode = null;

  if (step.action.type === "SEND_PUSH_PROTOCOL_NOTIFICATION") {
    console.log("hello");
    render = (
      <div className="flex flex-col gap-4 p-4">
        <input
          className="w-full rounded-md bg-gray-100 px-4 py-2"
          placeholder="Title"
          value={step.action.title}
          onChange={(e) =>
            onChange({
              ...step,
              action: { ...step.action, title: e.target.value },
            })
          }
        />
        <input
          className="w-full rounded-md bg-gray-100 px-4 py-2"
          placeholder="Message"
          value={step.action.message}
          onChange={(e) =>
            onChange({
              ...step,
              action: { ...step.action, message: e.target.value },
            })
          }
        />
      </div>
    );
  } else if (step.action.type === "SWAP_ONE_INCH") {
    render = (
      <div className="flex gap-4 p-4 justify-start items-center">
        <div className="flex">
          <p>swap to </p>
        </div>
        <div className="flex rotate-180">
          <ThinArrow height={30} width={50} />
        </div>

        <div className="flex">
          <TokenSelect
            value={step.action.type}
            onChange={handleDropdownChange}
            options={tokenOptions}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="gap-4 bg-gray-200 rounded-md shadow-md flex flex-col relative w-full">
      <div className="flex w-full rounded-t-md bg-white h-1/3 py-4">
        <TokenSelect
          value={step.action.type}
          onChange={handleDropdownChange}
          options={tokenOptions}
        />
      </div>
      <div className="h-2/3  bg-gray-200">{render}</div>
    </div>
  );
};

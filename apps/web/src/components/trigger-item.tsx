import React, { useState } from "react";
import { Trigger } from "./flow-builder";
import { SelectActionDropDown } from "./select-action-dropdown";
import { TokenSelect } from "./token-select";
import clsx from "clsx";
import { TrashCanIcon } from "./icons/trash-can-icon";
import { set } from "zod";

type TriggerItemProps = {
  trigger: Trigger;
  onChange: (trigger: Trigger) => void;
  onRemoveTrigger: () => void;
};

export const TriggerItem = ({
  trigger,
  onChange,
  onRemoveTrigger,
}: TriggerItemProps) => {
  const [isHovered, setisHovered] = useState(false);

  const handleDropdownChange = (newValue: string) => {
    onChange({ ...trigger, type: newValue });
  };

  const handleTokenChange = (newValue: string) => {
    onChange({ ...trigger, token: { ...trigger.token, name: newValue } });
  };

  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...trigger,
      token: { ...trigger.token, address: e.target.value },
    });
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...trigger,
      token: { ...trigger.token, amount: parseInt(e.target.value) },
    });
  };

  const dropdownOptions = [
    { value: "TOKENS_RECEIVED", label: "on tokens received erc-20" },
    { value: "NFT_RECEIVED", label: "on tokens received erc-721" },
  ];

  const tokenOptions = [
    { value: "USDC", label: "usdc", image: "/icons/USDC.svg", address: "1234" },
    { value: "GHO", label: "gho", image: "/icons/GHO.svg", address: "54321" },
    {
      value: "APE",
      label: "ape",
      image: "/icons/APE.svg",
      address: "783947380",
    },
  ];

  return (
    <div
      className="gap-4 pb-5 bg-gray-200 w-full rounded-md shadow-md flex flex-col relative"
      onMouseEnter={() => setisHovered(true)}
      onMouseLeave={() => setisHovered(false)}
    >
      {isHovered && (
        <div
          className="absolute top-0 right-0 translate-x-3 translate-y--6 rotate-[30deg] z-[999] cursor-pointer"
          onClick={onRemoveTrigger}
        >
          <TrashCanIcon />
        </div>
      )}
      <div className="flex w-full rounded-t-md bg-white h-1/3 py-4">
        {trigger.type === "TOKENS_RECEIVED" && (
          <div className="flex w-1/4">
            <TokenSelect
              value={trigger.token.name}
              onChange={handleTokenChange}
              options={tokenOptions}
            />
          </div>
        )}
        <div className={clsx("flex w-full")}>
          <SelectActionDropDown
            value={trigger.type}
            onChange={handleDropdownChange}
            options={dropdownOptions}
          />
        </div>
      </div>
      <div className="flex h-2/3 flex-col px-6">
        <div className="py-3">
          <p>Token contract address</p>
        </div>

        <input
          className="w-full rounded-md px-3 py-2"
          onChange={handleAddressChange}
          value={trigger.token.address || ""}
        />
        <div className="py-3">
          <p>Received amount</p>
        </div>

        <input
          className="w-full rounded-md px-3 py-2"
          type="number"
          onChange={handleAmountChange}
          value={trigger.token.amount || 0}
        />
      </div>
    </div>
  );
};

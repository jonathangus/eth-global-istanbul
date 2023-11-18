"use client";

import { baseGoerli, lineaTestnet } from "viem/chains";
import { useUIContext } from "../context/ui-context";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../app/components/ui/select";
import { SUPPORTED_CHAINS } from "../config";

export function ChainSelector() {
  const chains = [lineaTestnet, baseGoerli];
  const { setChainId } = useUIContext();
  return (
    <Select
      onValueChange={(value) => setChainId(Number(value) as SUPPORTED_CHAINS)}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Chain" />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem value={chain.id.toString()}>{chain.name}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

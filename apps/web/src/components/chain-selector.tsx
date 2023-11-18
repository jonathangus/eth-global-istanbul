'use client';

import { baseGoerli, goerli, lineaTestnet, scrollSepolia } from 'viem/chains';
import { useUIContext } from '../context/ui-context';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../app/components/ui/select';
import { SUPPORTED_CHAINS } from '../config';

export function ChainSelector() {
  const chains = [lineaTestnet, baseGoerli, scrollSepolia, goerli];
  const { setChainId, chainId } = useUIContext();
  return (
    <Select
      onValueChange={(value) => setChainId(Number(value) as SUPPORTED_CHAINS)}
      value={chainId.toString()}
    >
      <SelectTrigger className="bg-white">
        <SelectValue placeholder="select chain" />
      </SelectTrigger>
      <SelectContent>
        {chains.map((chain) => (
          <SelectItem key={chain.id} value={chain.id.toString()}>
            {chain.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

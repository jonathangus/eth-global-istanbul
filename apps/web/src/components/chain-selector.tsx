'use client';

import { baseGoerli, lineaTestnet } from 'viem/chains';
import { useUIContext } from '../context/ui-context';

export function ChainSelector() {
  const chains = [lineaTestnet, baseGoerli, lineaTestnet];
  const { setChainId } = useUIContext();
  return (
    <div>
      <select onChange={(e) => setChainId(Number(e.target.value))}>
        {chains.map((chain) => (
          <option value={chain.id}>{chain.name}</option>
        ))}
      </select>
    </div>
  );
}

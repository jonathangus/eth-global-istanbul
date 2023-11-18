import { getChainConfig } from '../util';
import { useUIContext } from '../context/ui-context';

export function useChain() {
  const { chainId } = useUIContext();

  return {
    ...getChainConfig(chainId),
    chainId,
  };
}

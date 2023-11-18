import { lineaTestnet } from 'viem/chains';

import { BUNDLER_CLIENT, PAYMASTER_CLIENT, PUBLIC_CLIENT } from '../clients-ts';
import { ENTRY_POINT_ADDRESSES, PAYMASTER_CONTRACTS } from '../config';

export function useChain() {
  const chainId = lineaTestnet.id;
  const publicClient = PUBLIC_CLIENT[chainId];

  const bundlerClient = BUNDLER_CLIENT[chainId];

  const paymasterClient = PAYMASTER_CLIENT[chainId];

  const SIMPLE_ACCOUNT_FACTORY_ADDRESS = PAYMASTER_CONTRACTS[chainId];

  const ENTRY_POINT_ADDRESS = ENTRY_POINT_ADDRESSES[chainId];

  return {
    publicClient,
    bundlerClient,
    paymasterClient,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    ENTRY_POINT_ADDRESS,
  };
}

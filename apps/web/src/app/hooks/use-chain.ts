import { lineaTestnet } from 'viem/chains';

import {
  BUNDLER_CLIENT,
  PAYMASTER_CLIENT,
  PUBLIC_CLIENT,
} from '../../clients-ts';
import { ENTRY_POINT_ADDRESSES, PAYMASTER_CONTRACTS } from '../../config';

export function useChain() {
  const publicClient = PUBLIC_CLIENT[lineaTestnet.id];

  const bundlerClient = BUNDLER_CLIENT[lineaTestnet.id];

  const paymasterClient = PAYMASTER_CLIENT[lineaTestnet.id];

  const SIMPLE_ACCOUNT_FACTORY_ADDRESS = PAYMASTER_CONTRACTS[lineaTestnet.id];

  const ENTRY_POINT_ADDRESS = ENTRY_POINT_ADDRESSES[lineaTestnet.id];

  return {
    publicClient,
    bundlerClient,
    paymasterClient,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    ENTRY_POINT_ADDRESS,
  };
}

import { BUNDLER_CLIENT, PAYMASTER_CLIENT, PUBLIC_CLIENT } from './clients-ts';
import {
  ENTRY_POINT_ADDRESSES,
  ACCOUNT_FACTORY_ADDRESSES,
  SUPPORTED_CHAINS,
} from './config';

export const getChainConfig = (chainId: SUPPORTED_CHAINS) => {
  const publicClient = PUBLIC_CLIENT[chainId];

  const bundlerClient = BUNDLER_CLIENT[chainId];

  const paymasterClient = PAYMASTER_CLIENT[chainId];

  const SIMPLE_ACCOUNT_FACTORY_ADDRESS = ACCOUNT_FACTORY_ADDRESSES[chainId];

  const ENTRY_POINT_ADDRESS = ENTRY_POINT_ADDRESSES[chainId];

  return {
    publicClient,
    bundlerClient,
    paymasterClient,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    ENTRY_POINT_ADDRESS,
  };
};

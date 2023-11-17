import { lineaTestnet } from 'viem/chains';
import { Address } from 'viem';

export type SUPPORTED_CHAINS = typeof lineaTestnet.id;

export const PAYMASTER_CONTRACTS = {
  [lineaTestnet.id]: '0x9406Cc6185a346906296840746125a0E44976454',
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const ENTRY_POINT_ADDRESSES = {
  [lineaTestnet.id]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
} satisfies Record<SUPPORTED_CHAINS, Address>;

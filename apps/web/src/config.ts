import {
  lineaTestnet,
  scrollSepolia,
  baseGoerli,
  goerli,
  mantaTestnet,
} from 'viem/chains';
import { Address } from 'viem';

export type SUPPORTED_CHAINS =
  | typeof lineaTestnet.id
  | typeof scrollSepolia.id
  | typeof baseGoerli.id
  | typeof goerli.id;

export const MOCKERC20 = {
  [lineaTestnet.id]: '0x085278ada5ed92d9098496af049903ec43f732ac',
  [scrollSepolia.id]: '0x085278ada5ed92d9098496af049903ec43f732ac',
  [baseGoerli.id]: '0x085278ada5ed92d9098496af049903ec43f732ac',
  [goerli.id]: '0x085278ada5ed92d9098496af049903ec43f732ac',
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const MOCK_ERC_721 = {
  [lineaTestnet.id]: '0x4ed05dd4b0149deda80ea26683b2ef72820e3e0f',
  [scrollSepolia.id]: '0x4ed05dd4b0149deda80ea26683b2ef72820e3e0f',
  [baseGoerli.id]: '0x4ed05dd4b0149deda80ea26683b2ef72820e3e0f',
  [goerli.id]: '0x4ed05dd4b0149deda80ea26683b2ef72820e3e0f',
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const ACCOUNT_FACTORY_ADDRESSES = {
  [lineaTestnet.id]: '0x9406Cc6185a346906296840746125a0E44976454',
  [scrollSepolia.id]: '0x9406Cc6185a346906296840746125a0E44976454',
  [baseGoerli.id]: '0x9406Cc6185a346906296840746125a0E44976454',
  [goerli.id]: '0xb3a3a075e38b1db86f7032f7a9c1e529fbe764bd',
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const ENTRY_POINT_ADDRESSES = {
  [lineaTestnet.id]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  [scrollSepolia.id]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  [baseGoerli.id]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
  [goerli.id]: '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789',
} satisfies Record<SUPPORTED_CHAINS, Address>;

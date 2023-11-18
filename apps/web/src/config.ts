import {
  lineaTestnet,
  scrollSepolia,
  baseGoerli,
  goerli,
  mantaTestnet,
} from "viem/chains";
import { Address } from "viem";

export type SUPPORTED_CHAINS =
  | typeof lineaTestnet.id
  | typeof scrollSepolia.id
  | typeof baseGoerli.id
  | typeof goerli.id;

export const MOCKERC20 = {
  [lineaTestnet.id]: "0xfd592a0C40Fe0D9803c538a99f58Cc516eE10437",
  [scrollSepolia.id]: "0x3DA56cC67Ef4FE12347c0678dFD4C66e6ca0c81f",
  [baseGoerli.id]: "0x5c8C5Ac4Fa45655cB094b3b1eED4f7A6C67a7f1B",
  [goerli.id]: "0x085278Ada5eD92D9098496af049903ec43F732AC",
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const MOCK_ERC_721 = {
  [lineaTestnet.id]: "0xD8F1c55315C85e68C87a87182B40B74132828Da5",
  [scrollSepolia.id]: "0x215B55D47583EaAC93cDc9316afeDE059674FCd2",
  [baseGoerli.id]: "0x70759504EBcCdbAC928129eE3c07E1551F48B34c",
  [goerli.id]: "0x4ED05DD4b0149DeDa80EA26683B2EF72820e3E0F",
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const ACCOUNT_FACTORY_ADDRESSES = {
  [lineaTestnet.id]: "0xD64f7938db423cf2e230385d0fc6408BD6eA4370",
  [scrollSepolia.id]: "0x248De4104EDA64b033b21Cc3b9E36d29161fB6dB",
  [baseGoerli.id]: "0x22E9cd80fFbE5d05a093a07C3E7FBc40F83033C0",
  [goerli.id]: "0xB3a3a075e38B1DB86F7032F7A9c1e529Fbe764bd",
} satisfies Record<SUPPORTED_CHAINS, Address>;

export const ENTRY_POINT_ADDRESSES = {
  [lineaTestnet.id]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [scrollSepolia.id]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [baseGoerli.id]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
  [goerli.id]: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
} satisfies Record<SUPPORTED_CHAINS, Address>;

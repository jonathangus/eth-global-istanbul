import { Network, Alchemy } from "alchemy-sdk";

export const alchemyBase = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.BASE_MAINNET,
});

export const alchemyGoerli = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.ETH_GOERLI,
});

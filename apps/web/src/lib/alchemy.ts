import { Network, Alchemy } from "alchemy-sdk";

export const alchemyBaseGoerli = new Alchemy({
  apiKey: process.env.ALCHEMY_BASE_GOERLI_API_KEY,
  network: Network.BASE_GOERLI,
});

export const alchemyGoerli = new Alchemy({
  apiKey: process.env.ALCHEMY_GOERLI_API_KEY,
  network: Network.ETH_GOERLI,
});

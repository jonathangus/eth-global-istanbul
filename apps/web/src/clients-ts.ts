import { bundlerActions } from "permissionless";
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
} from "permissionless/actions/pimlico";
import { createClient, createPublicClient, http, Chain } from "viem";
import { lineaTestnet, baseGoerli } from "viem/chains";

const apiKey = process.env.NEXT_PUBLIC_YOUR_PIMLICO_API_KEY;

const lineaTestnetName = "linea-testnet";

const createBundlerClient = (name: string, chain: Chain) =>
  createClient({
    transport: http(`https://api.pimlico.io/v1/${name}/rpc?apikey=${apiKey}`),
    chain,
  })
    .extend(bundlerActions)
    .extend(pimlicoBundlerActions);

export const BUNDLER_CLIENT = {
  [lineaTestnet.id]: createBundlerClient("linea-testnet", lineaTestnet),
  [baseGoerli.id]: createBundlerClient("base-goerli", lineaTestnet),
};

const getPaymasterClient = (name: string, chain: Chain) =>
  createClient({
    transport: http(`https://api.pimlico.io/v2/${name}/rpc?apikey=${apiKey}`),
    chain,
  }).extend(pimlicoPaymasterActions);

export const PAYMASTER_CLIENT = {
  [lineaTestnet.id]: getPaymasterClient("linea-testnet", lineaTestnet),
};

const getPublicClient = (name: string, chain: Chain) =>
  createPublicClient({
    transport: http("https://rpc.goerli.linea.build/"),
    chain: lineaTestnet,
  });

export const PUBLIC_CLIENT = {
  [lineaTestnet.id]: getPublicClient("linea-testnet", lineaTestnet),
};

import { bundlerActions } from 'permissionless';
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
} from 'permissionless/actions/pimlico';
import { createClient, createPublicClient, http, Chain } from 'viem';
import { lineaTestnet, baseGoerli, scrollSepolia } from 'viem/chains';
import { SUPPORTED_CHAINS } from './config';

const apiKey = process.env.NEXT_PUBLIC_YOUR_PIMLICO_API_KEY;

//  supported chains: arbitrum-goerli, arbitrum-sepolia, arbitrum, avalanche-fuji, avalanche, base-goerli, base, binance-testnet, binance, celo-alfajores-testnet, celo, chiado-testnet, dfk-chain-test, dfk-chain, ethereum, fuse, gnosis, goerli, klaytn-cypress, linea-testnet, linea, lyra, mantle, mumbai, nautilus, opbnb, optimism-goerli, optimism, polygon, scroll-alpha-testnet, scroll-sepolia-testnet, scroll, sepolia, xai-goerli-orbit

const createBundlerClient = (name: string, chain: Chain) =>
  createClient({
    transport: http(`https://api.pimlico.io/v1/${name}/rpc?apikey=${apiKey}`),
    chain,
  })
    .extend(bundlerActions)
    .extend(pimlicoBundlerActions);

export const BUNDLER_CLIENT = {
  [lineaTestnet.id]: createBundlerClient('linea-testnet', lineaTestnet),
  [baseGoerli.id]: createBundlerClient('base-goerli', baseGoerli),
  [scrollSepolia.id]: createBundlerClient(
    'scroll-sepolia-testnet',
    scrollSepolia
  ),
} satisfies Record<SUPPORTED_CHAINS, any>;

const getPaymasterClient = (name: string, chain: Chain) =>
  createClient({
    transport: http(`https://api.pimlico.io/v2/${name}/rpc?apikey=${apiKey}`),
    chain,
  }).extend(pimlicoPaymasterActions);

export const PAYMASTER_CLIENT = {
  [lineaTestnet.id]: getPaymasterClient('linea-testnet', lineaTestnet),
  [scrollSepolia.id]: getPaymasterClient(
    'scroll-sepolia-testnet',
    scrollSepolia
  ),
  [baseGoerli.id]: getPaymasterClient('base-goerli', baseGoerli),
} satisfies Record<SUPPORTED_CHAINS, any>;

const getPublicClient = (rpc: string, chain: Chain) =>
  createPublicClient({
    transport: http(rpc),
    chain,
  });

export const PUBLIC_CLIENT = {
  [lineaTestnet.id]: getPublicClient(
    'https://rpc.goerli.linea.build/',
    lineaTestnet
  ),
  [scrollSepolia.id]: getPublicClient(
    'https://sepolia-rpc.scroll.io/',
    scrollSepolia
  ),
  [baseGoerli.id]: getPublicClient(
    baseGoerli.rpcUrls.default.http[0],
    baseGoerli
  ),
} satisfies Record<SUPPORTED_CHAINS, any>;

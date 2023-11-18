import { getAccountNonce } from 'permissionless';
import {
  UserOperation,
  bundlerActions,
  getSenderAddress,
  getUserOperationHash,
  waitForUserOperationReceipt,
  GetUserOperationReceiptReturnType,
  signUserOperationHashWithECDSA,
} from 'permissionless';
import {
  pimlicoBundlerActions,
  pimlicoPaymasterActions,
} from 'permissionless/actions/pimlico';
import { createClient, createPublicClient, http } from 'viem';
import { lineaTestnet, polygonMumbai } from 'viem/chains';

const apiKey = process.env.NEXT_PUBLIC_YOUR_PIMLICO_API_KEY; // REPLACE THIS

const lineaTestnetName = 'linea-testnet'; // find the list of chain names on the Pimlico verifying paymaster reference page

const lineaBundlerClient = createClient({
  transport: http(
    `https://api.pimlico.io/v1/${lineaTestnetName}/rpc?apikey=${apiKey}`
  ),
  chain: lineaTestnet,
})
  .extend(bundlerActions)
  .extend(pimlicoBundlerActions);

export const BUNDLER_CLIENT = {
  [lineaTestnet.id]: lineaBundlerClient,
};

const lineaPaymasterClient = createClient({
  transport: http(
    `https://api.pimlico.io/v2/${lineaTestnetName}/rpc?apikey=${apiKey}`
  ),
  chain: lineaTestnet,
}).extend(pimlicoPaymasterActions);

export const PAYMASTER_CLIENT = {
  [lineaTestnet.id]: lineaPaymasterClient,
};

const lineaPublicClient = createPublicClient({
  transport: http('https://rpc.goerli.linea.build/'),
  chain: lineaTestnet,
});

export const PUBLIC_CLIENT = {
  [lineaTestnet.id]: lineaPublicClient,
};

'use client';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';
import type { Web3AuthConfig } from '@safe-global/auth-kit';
import { Web3AuthModalPack } from '@safe-global/auth-kit';
import type { Web3AuthOptions } from '@web3auth/modal';
import { OpenloginAdapter } from '@web3auth/openlogin-adapter';
import { CHAIN_NAMESPACES, WALLET_ADAPTERS } from '@web3auth/base';

interface SafeContext {
  loggedIn: boolean;
}

export const safeContext = createContext<SafeContext>({} as SafeContext);

const options: Web3AuthOptions = {
  clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID! as string,
  web3AuthNetwork: 'testnet',
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: '0x5',
    // https://chainlist.org/
    rpcTarget: 'https://rpc.ankr.com/eth_goerli',
  },
  uiConfig: {
    theme: 'dark',
    loginMethodsOrder: ['google', 'facebook'],
  },
};
// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: 'torus',
    showOnModal: false,
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: 'metamask',
    showOnDesktop: true,
    showOnMobile: false,
  },
};

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: 'mandatory',
  },
  adapterSettings: {
    uxMode: 'popup',
    whiteLabel: {
      name: 'Safe',
    },
  },
});

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global',
};

console.log(process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID);
export function SafeContextProvider({ children }: PropsWithChildren) {
  const register = async () => {
    const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
    await web3AuthModalPack.init({
      options,
      adapters: [openloginAdapter],
      modalConfig,
    });

    const authKitSignData = await web3AuthModalPack.signIn();
    console.log(authKitSignData);
  };

  const value = {
    loggedIn: false,
    register,
  };

  return <safeContext.Provider value={value}>{children}</safeContext.Provider>;
}

export const useSafeContext = () => useContext(safeContext);

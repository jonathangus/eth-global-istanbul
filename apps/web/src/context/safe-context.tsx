'use client';
import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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

const initialChain = {
  id: '0x5',
  token: 'gETH',
  label: 'Görli',
  shortName: 'gor',
  rpcUrl: 'https://goerli.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161',
  blockExplorerUrl: 'https://goerli.etherscan.io',
  color: '#fbc02d',
  transactionServiceUrl: 'https://safe-transaction-goerli.safe.global',
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: true,
};

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: 'https://safe-transaction-goerli.safe.global',
};

export function SafeContextProvider({ children }: PropsWithChildren) {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>('');

  // safes owned by the user
  const [safes, setSafes] = useState<string[]>([]);

  // chain selected
  const [chainId, setChainId] = useState<string>(() => {
    return initialChain.id;
  });

  // web3 provider to perform signatures
  const [web3Provider, setWeb3Provider] = useState<any>();

  const isAuthenticated = !!ownerAddress && !!chainId;
  const chain = initialChain;

  // reset React state when you switch the chain
  useEffect(() => {
    // setOwnerAddress('');
    // setSafes([]);
    // setChainId(chain.id);
    // setWeb3Provider(undefined);
  }, [chain]);

  const [web3AuthModalPack, setWeb3AuthModalPack] =
    useState<Web3AuthModalPack>();

  const init = async () => {
    const web3AuthModalPack = new Web3AuthModalPack(web3AuthConfig);
    await web3AuthModalPack.init({
      options,
      adapters: [openloginAdapter],
      modalConfig,
    });

    setWeb3AuthModalPack(web3AuthModalPack);
  };

  useEffect(() => {
    init();
  }, []);

  const register = async () => {
    loginWeb3Auth();
  };

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    if (!web3AuthModalPack) return;

    try {
      const { safes, eoa } = await web3AuthModalPack.signIn();
      const provider = web3AuthModalPack.getProvider();

      console.log({
        safes,
        eoa,
        chain,
        provider,
      });
      // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
      setChainId(chain.id);
      setOwnerAddress(eoa);
      setSafes(safes || []);
      // setWeb3Provider(new ethers.providers.Web3Provider(provider));
    } catch (error) {
      console.log('error: ', error);
    }
  }, [chain, web3AuthModalPack]);

  const value = {
    loggedIn: false,
    register,
  };

  return <safeContext.Provider value={value}>{children}</safeContext.Provider>;
}

export const useSafeContext = () => useContext(safeContext);

"use client";
import type { PropsWithChildren } from "react";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { Web3AuthConfig } from "@safe-global/auth-kit";
import { Web3AuthModalPack } from "@safe-global/auth-kit";
import type { Web3AuthOptions } from "@web3auth/modal";
import { OpenloginAdapter } from "@web3auth/openlogin-adapter";
import AccountAbstraction from "@safe-global/account-abstraction-kit-poc";
import Safe, { SafeFactory } from "@safe-global/protocol-kit";
import { EthersAdapter } from "@safe-global/protocol-kit";

import {
  ADAPTER_EVENTS,
  CHAIN_NAMESPACES,
  WALLET_ADAPTERS,
} from "@web3auth/base";
import { ethers } from "ethers";
import { GelatoRelayPack } from "@safe-global/relay-kit";

interface SafeContext {
  loggedIn: boolean;
}

export const safeContext = createContext<SafeContext>({} as SafeContext);

const options: Web3AuthOptions = {
  clientId: process.env.NEXT_PUBLIC_WEB3_AUTH_CLIENT_ID! as string,
  web3AuthNetwork: "testnet",
  chainConfig: {
    chainNamespace: CHAIN_NAMESPACES.EIP155,
    chainId: "0x5",
    // https://chainlist.org/
    rpcTarget:
      "https://eth-goerli.g.alchemy.com/v2/VuLXHJ_bqx3GV44Am_IXOQABZnDfAHm3", //https://rpc.ankr.com/eth_goerli',
  },
  uiConfig: {
    theme: "dark",
    loginMethodsOrder: ["google", "facebook"],
  },
};
// https://web3auth.io/docs/sdk/pnp/web/modal/initialize#configuring-adapters
const modalConfig = {
  [WALLET_ADAPTERS.TORUS_EVM]: {
    label: "torus",
    showOnModal: false,
  },
  [WALLET_ADAPTERS.METAMASK]: {
    label: "metamask",
    showOnDesktop: true,
    showOnMobile: false,
  },
};

const openloginAdapter = new OpenloginAdapter({
  loginSettings: {
    mfaLevel: "mandatory",
  },
  adapterSettings: {
    uxMode: "popup",
    whiteLabel: {
      name: "Safe",
    },
  },
});

const initialChain = {
  id: "0x5",
  token: "gETH",
  label: "Görli",
  shortName: "gor",
  rpcUrl: "https://eth-goerli.g.alchemy.com/v2/",
  blockExplorerUrl: "https://goerli.etherscan.io",
  color: "#fbc02d",
  transactionServiceUrl: "https://safe-transaction-goerli.safe.global",
  isStripePaymentsEnabled: false,
  isMoneriumPaymentsEnabled: true,
};

const web3AuthConfig: Web3AuthConfig = {
  txServiceUrl: "https://safe-transaction-goerli.safe.global",
};

export function SafeContextProvider({ children }: PropsWithChildren) {
  // owner address from the email  (provided by web3Auth)
  const [ownerAddress, setOwnerAddress] = useState<string>("");
  const [safeSelected, setSafeSelected] = useState<string>("");

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

  useEffect(() => {
    const getSafeAddress = async () => {
      if (web3Provider) {
        const signer = web3Provider.getSigner();
        const safeAccountAbstraction = new AccountAbstraction(signer);
        const relayPack = new GelatoRelayPack();

        await safeAccountAbstraction.init({ relayPack });

        const hasSafes = safes.length > 0;
        console.log(safes);
        const safeSelected = await safeAccountAbstraction.getSafeAddress();

        setSafeSelected(safeSelected);
      }
    };

    getSafeAddress();
  }, [safes, web3Provider]);

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

  useEffect(() => {
    if (web3AuthModalPack) {
      web3AuthModalPack.subscribe(ADAPTER_EVENTS.CONNECTED, () => {
        console.log("User is authenticated");
      });

      web3AuthModalPack.subscribe(ADAPTER_EVENTS.DISCONNECTED, () => {
        console.log("User is not authenticated");
      });
    }
  }, [web3AuthModalPack]);

  // auth-kit implementation
  const loginWeb3Auth = useCallback(async () => {
    if (!web3AuthModalPack) return;

    try {
      const { safes, eoa } = await web3AuthModalPack.signIn();
      const provider = web3AuthModalPack.getProvider();
      // we set react state with the provided values: owner (eoa address), chain, safes owned & web3 provider
      setChainId(chain.id);
      setOwnerAddress(eoa);
      setSafes(safes || []);
      setWeb3Provider(new ethers.providers.Web3Provider(provider));
      console.log({ safes, eoa });
    } catch (error) {
      console.log("error: ", error);
    }
  }, [chain, web3AuthModalPack]);

  useEffect(() => {
    if (web3AuthModalPack && web3AuthModalPack.getProvider()) {
      loginWeb3Auth();
    }
  }, [web3AuthModalPack, loginWeb3Auth]);

  const register = () => {
    loginWeb3Auth();
  };

  // console.log({ safeSelected });

  const createSafe = async () => {
    const safeOwner = web3Provider.getSigner(0);

    const provider = new ethers.providers.JsonRpcProvider(
      "https://eth-goerli.g.alchemy.com/v2/"
    );

    const owner = new ethers.Wallet("", provider);

    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: owner,

      // signerOrProvider: safeOwner,
    });

    console.log(ethAdapter, safeOwner);

    const safeFactory = await SafeFactory.create({ ethAdapter });

    console.log(safeFactory);

    const safeAccountConfig = {
      owners: [ownerAddress],
      threshold: 1,
      // to, // Optional
      // data, // Optional
      // fallbackHandler, // Optional
      // paymentToken, // Optional
      // payment, // Optional
      // paymentReceiver, // Optional
    };

    const callback = (txHash: string): void => {
      console.log({ txHash });
    };

    const safeSdk = await safeFactory.deploySafe({
      safeAccountConfig,
      callback,
    });

    const safeAddress = await safeSdk.getAddress();
    console.log("safeSdk", safeSdk);

    console.log("___safeAddress", safeAddress);

    // const safeSdk = await Safe.create({
    //   ethAdapter,
    //   safeAddress: safeSelected,
    // });
  };

  const connectAgain = async () => {
    const safeOwner = web3Provider.getSigner(0);

    const provider = new ethers.providers.Web3Provider(
      web3AuthModalPack.getProvider()
    );

    const signer = provider.getSigner();

    console.log("SIGNER", signer, signer._address);
    console.log("OEWNER ADDRSS", safeOwner.address);
    const ethAdapter = new EthersAdapter({
      ethers,
      signerOrProvider: safeOwner,
    });

    const safeSdk = await Safe.create({
      ethAdapter,
      safeAddress: "0xb3369dD2690068f1256487E0FbDd8186FA6620F0",
    });

    console.log(safeSdk);

    const ownerAddresses = await safeSdk.getOwners();

    console.log("OWNER", ownerAddresses);

    const moduleAddresses = await safeSdk.getModules();

    const safeTransaction = await safeSdk.createEnableModuleTx(
      "0x39e54bb2b3aa444b4b39dee15de3b7809c36fc38"
    );

    const signed = await signer.sendTransaction(safeTransaction.data);
    console.log("SIGNED:", signed);
    const txResponse = await safeSdk.executeTransaction(safeTransaction);

    console.log({ moduleAddresses, safeTransaction, txResponse });
  };
  const value = {
    loggedIn: false,
    register,
    createSafe,
    safeSelected,

    connectAgain,
  };

  return <safeContext.Provider value={value}>{children}</safeContext.Provider>;
}

export const useSafeContext = () => useContext(safeContext);

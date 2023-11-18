'use client';
import { createContext, useContext, useState } from 'react';
import { lineaTestnet } from 'viem/chains';
import { SUPPORTED_CHAINS } from '../config';

interface UiContext {
  chainId: SUPPORTED_CHAINS;
  setChainId: (val: SUPPORTED_CHAINS) => void;
}

export const uiContext = createContext<UiContext>({} as UiContext);

export function UiContextProvider({ children }) {
  const [chainId, setChainId] = useState<SUPPORTED_CHAINS>(lineaTestnet.id);
  const value = {
    chainId,
    setChainId,
  };

  return <uiContext.Provider value={value}>{children}</uiContext.Provider>;
}

export const useUIContext = () => useContext(uiContext);

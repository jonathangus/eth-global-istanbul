'use client';
import { createContext, useContext, useState } from 'react';
import { lineaTestnet } from 'viem/chains';

interface UiContext {
  chainId: number;
  setChainId: (val: number) => void;
}

export const uiContext = createContext<UiContext>({} as UiContext);

export function UiContextProvider({ children }) {
  const [chainId, setChainId] = useState<number>(lineaTestnet.id);
  const value = {
    chainId,
    setChainId,
  };

  return <uiContext.Provider value={value}>{children}</uiContext.Provider>;
}

export const useUIContext = () => useContext(uiContext);

'use client';
import type { PropsWithChildren } from 'react';
import { createContext, useContext } from 'react';

interface SafeContext {
  loggedIn: boolean;
}

export const safeContext = createContext<SafeContext>({} as SafeContext);

export function SafeContextProvider({ children }: PropsWithChildren) {
  const value = {
    loggedIn: false,
  };

  return <safeContext.Provider value={value}>{children}</safeContext.Provider>;
}

export const useSafeContext = () => useContext(safeContext);

'use client';
import type { PropsWithChildren } from 'react';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
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
import {
  Address,
  Hash,
  concat,
  createClient,
  createPublicClient,
  encodeFunctionData,
  http,
  Hex,
} from 'viem';
import {
  generatePrivateKey,
  privateKeyToAccount,
  signMessage,
} from 'viem/accounts';
import { lineaTestnet, polygonMumbai } from 'viem/chains';

interface PermissionlessContext {}

const permissionlessContext = createContext({});

export function PermissionlessContextProvider({ children }: PropsWithChildren) {
  const value = {};

  return (
    <permissionlessContext.Provider value={value}>
      {children}
    </permissionlessContext.Provider>
  );
}

export const useAA = () => useContext(permissionlessContext);

'use client';
import type { PropsWithChildren } from 'react';
import { createContext, useContext, useState } from 'react';
import {
  UserOperation,
  getSenderAddress,
  signUserOperationHashWithECDSA,
} from 'permissionless';
import { Address, concat, encodeFunctionData, Hex } from 'viem';
import { usepassKeyContext } from './passkey-context';
import { abi as simpleAccountABI } from '../abi/simple-account';

import { useChain } from '../hooks/use-chain';
import { useMutation } from 'wagmi';
import axios from 'axios';
import { actions, executions, transformers } from '../actions';
import { executeTransaction } from '../lib/execute-transaction';

interface PermissionlessContext {}

const permissionlessContext = createContext({});

const buildTx = async ({
  owner,
  chainId,
  entryPoint,
  accountFactory,
  publicClient,
  bundlerClient,
  nonce,
  accountExist,
  aaSenderAddress,
  initCode,
  paymasterClient,
  step,
}: any) => {
  const action = actions['SWAP_ON_1INCH'];

  // TODO
  const callData = await action(step);

  const gasPrice = await bundlerClient.getUserOperationGasPrice();

  const userOperation = {
    sender: aaSenderAddress,
    nonce: nonce,
    initCode: accountExist ? '0x' : initCode,
    callData,
    maxFeePerGas: gasPrice.fast.maxFeePerGas,
    maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
    // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
    signature:
      '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c' as Hex,
  };

  console.log({ userOperation });
  const sponsorUserOperationResult = await paymasterClient.sponsorUserOperation(
    {
      userOperation,
      entryPoint: entryPoint,
    }
  );

  const sponsoredUserOperation: UserOperation = {
    ...userOperation,
    preVerificationGas: sponsorUserOperationResult.preVerificationGas,
    verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
    callGasLimit: sponsorUserOperationResult.callGasLimit,
    paymasterAndData: sponsorUserOperationResult.paymasterAndData,
  };

  console.log('Received paymaster sponsor result:', sponsorUserOperationResult);

  const signature = await signUserOperationHashWithECDSA({
    account: owner,
    userOperation: sponsoredUserOperation,
    chainId: chainId,
    entryPoint: entryPoint,
  });

  sponsoredUserOperation.signature = signature;

  console.log({ sponsoredUserOperation });

  const tx_sign_data = {
    preVerificationGas: Number(sponsorUserOperationResult.preVerificationGas),
    verificationGasLimit: Number(
      sponsorUserOperationResult.verificationGasLimit
    ),
    callGasLimit: Number(sponsorUserOperationResult.callGasLimit),
    paymasterAndData: sponsorUserOperationResult.paymasterAndData,
    callData,
    initCode: accountExist ? '0x' : initCode,
    sender: aaSenderAddress,
    signature,
    nonce: Number(userOperation.nonce),
    chainId,
  };

  const transform = transformers['SWAP_ON_1INCH'];

  return {
    tx_sign_data,
    order: 0,
    type: 'SWAP_ON_1INCH',
    action: transform(step),
  };
};

export function PermissionlessContextProvider({ children }: PropsWithChildren) {
  const {
    publicClient,
    bundlerClient,
    paymasterClient,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    ENTRY_POINT_ADDRESS,
    chainId,
  } = useChain();
  const [completedSteps, setCompletedSteps] = useState([]);

  const { mutate: saveSteps, isLoading: isSaving } = useMutation(
    async (input) => {
      console.log({ input });
      await axios.post('/api/workflows', JSON.stringify(input));
    }
  );

  const { mutate: execute, isLoading } = useMutation(async () => _execute(), {
    onError: console.error,
  });
  const { account } = usepassKeyContext();
  const _execute = async () => {
    if (!account) {
      return console.warn('missing logged in');
    }
    console.log('time to execute...');
    setCompletedSteps([]);

    const initCode = concat([
      SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      encodeFunctionData({
        abi: [
          {
            inputs: [
              {
                internalType: 'address',
                name: 'owner',
                type: 'address',
              },
              {
                internalType: 'uint256',
                name: 'salt',
                type: 'uint256',
              },
            ],
            name: 'createAccount',
            outputs: [
              {
                internalType: 'contract SimpleAccount',
                name: 'ret',
                type: 'address',
              },
            ],
            stateMutability: 'nonpayable',
            type: 'function',
          },
        ],
        args: [account.address, 0n],
      }),
    ]);
    const senderAddress = await getSenderAddress(publicClient, {
      initCode,
      entryPoint: ENTRY_POINT_ADDRESS,
    });
    console.log('aa address:', senderAddress);

    let nonce = 0n;
    let accountExist;
    try {
      nonce = await publicClient.readContract({
        address: senderAddress,
        abi: simpleAccountABI,
        functionName: 'getNonce',
      });
      accountExist = true;
    } catch (e) {
      accountExist = false;
    }

    console.log({
      senderAddress,
      accountExist,
    });
    const aaSenderAddress = await getSenderAddress(publicClient, {
      initCode: initCode as Address,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    const txs = [];

    const steps = [
      {
        order: 0,
      },
    ];
    for (let step in steps) {
      // TODO CHECK IF TX IS NEEDED
      const tx = await buildTx({
        owner: account,
        chainId,
        entryPoint: ENTRY_POINT_ADDRESS,
        publicClient,
        nonce: nonce + BigInt(txs.length),
        accountExist,
        aaSenderAddress,
        bundlerClient,
        paymasterClient,
        initCode,
        step,
      } as any);
      setCompletedSteps((prev) => [...prev, step.order]);
      txs.push(tx);

      // console.log('result', );
      console.log(tx);

      // const result = await executions['SWAP_ON_1INCH'](tx);

      // console.log(result);
    }

    const workflowData = {
      name: 'my flow',
      address: aaSenderAddress,
      trigger: {
        type: 'TOKENS_RECEIVED',
        token: {
          name: 'USDC',
          address: '0xF98AD93Ba3b2e296E0Ca687bee3C6bE2E9ABddC8',
          amount: 100000,
        },
      },
      steps: txs,
    };

    saveSteps(workflowData);
  };

  const value = {
    isLoading,
    completedSteps,
  };

  return (
    <permissionlessContext.Provider value={value}>
      <div onClick={() => execute()}>make tx</div>
      {isLoading && <div>loading...</div>}
      passkey: {account?.address}
      {children}
    </permissionlessContext.Provider>
  );
}

export const useAA = () => useContext(permissionlessContext);

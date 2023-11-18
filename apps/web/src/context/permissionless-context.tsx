"use client";
import {
  UserOperation,
  getSenderAddress,
  signUserOperationHashWithECDSA,
} from "permissionless";
import type { PropsWithChildren } from "react";
import { createContext, useContext, useState } from "react";
import { Address, Hex, concat, encodeFunctionData } from "viem";
import { abi as simpleAccountABI } from "../abi/simple-account";
import { usepassKeyContext } from "./passkey-context";

import axios from "axios";
import { useMutation } from "wagmi";
import { z } from "zod";
import { ACTIONS, createWorkflowSchema } from "../../schemas";
import { executions, getCallData, transformers } from "../actions";
import { useChain } from "../hooks/use-chain";
import { useRouter } from "next/navigation";

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
  const getCallDataFn = getCallData[step?.action.type];

  const callData = await getCallDataFn({ chainId, aaSenderAddress });

  const gasPrice = await bundlerClient.getUserOperationGasPrice();

  const userOperation = {
    sender: aaSenderAddress,
    nonce: nonce,
    initCode: accountExist ? "0x" : initCode,
    callData,
    maxFeePerGas: gasPrice.fast.maxFeePerGas,
    maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
    // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
    signature:
      "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex,
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

  console.log("Received paymaster sponsor result:", sponsorUserOperationResult);

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
    initCode: accountExist ? "0x" : initCode,
    sender: aaSenderAddress,
    signature,
    nonce: Number(userOperation.nonce),
    chainId,
  };

  const transformFn = transformers[step?.action.type];

  return {
    tx_sign_data,
    order: 0,
    type: step?.action.type,
    action: transformFn(step, chainId),
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const router = useRouter();

  const { mutate: createWorkflowMutation, isLoading: isSaving } = useMutation(
    async (input: z.infer<typeof createWorkflowSchema>) => {
      console.log("create workflow", input);
      const res = await axios.post("/api/workflows", input);
      return res.data;
    },
    {
      onSuccess: (workflow) => {
        router.push(`/workflows/${workflow.id}`);
      },
    }
  );

  const { mutate: createWorkflow, isLoading } = useMutation(
    async (workflow: z.infer<typeof createWorkflowSchema>) =>
      _createWorkflow(workflow),
    {
      onSuccess: console.log,
      onError: console.error,
    }
  );

  const { account } = usepassKeyContext();
  const _createWorkflow = async (
    workflow: z.infer<typeof createWorkflowSchema>
  ) => {
    if (!account) {
      return console.warn("missing logged in");
    }
    console.log("time to execute...");
    setCompletedSteps([]);

    const initCode = concat([
      SIMPLE_ACCOUNT_FACTORY_ADDRESS,
      encodeFunctionData({
        abi: [
          {
            inputs: [
              {
                internalType: "address",
                name: "owner",
                type: "address",
              },
              {
                internalType: "uint256",
                name: "salt",
                type: "uint256",
              },
            ],
            name: "createAccount",
            outputs: [
              {
                internalType: "contract SimpleAccount",
                name: "ret",
                type: "address",
              },
            ],
            stateMutability: "nonpayable",
            type: "function",
          },
        ],
        args: [account.address, 0n],
      }),
    ]);
    const senderAddress = await getSenderAddress(publicClient, {
      initCode,
      entryPoint: ENTRY_POINT_ADDRESS,
    });
    console.log("aa address:", senderAddress);

    let nonce = 0n;
    let accountExist;
    try {
      nonce = await publicClient.readContract({
        address: senderAddress,
        abi: simpleAccountABI,
        functionName: "getNonce",
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

    let txs = 0;

    for (let i = 0; i < workflow.steps.length; i++) {
      const step = workflow.steps[i];

      if (!step) {
        continue;
      }

      if (
        !([ACTIONS.SWAP_ON_1INCH, ACTIONS.MINT_NFT] as string[]).includes(
          step?.action.type ?? ""
        )
      ) {
        continue;
      }

      const nextNonce = nonce + BigInt(txs);

      console.log({ nonce, txs, nextNonce });
      console.log({ step });
      const tx = await buildTx({
        owner: account,
        chainId,
        entryPoint: ENTRY_POINT_ADDRESS,
        publicClient,
        nonce: nonce,
        accountExist,
        aaSenderAddress,
        bundlerClient,
        paymasterClient,
        initCode,
        step,
      } as any);

      txs++;

      // const result = await executions[step?.action.type](tx);
      // console.log(result);
      setCompletedSteps((prev) => [...prev, step.order]);

      workflow.steps[i]!.tx_sign_data = tx.tx_sign_data;
    }

    createWorkflowMutation(workflow);
  };

  const value = {
    isSaving: isSaving || isLoading,
    createWorkflow,
    completedSteps,
  };

  return (
    <permissionlessContext.Provider value={value}>
      {children}
    </permissionlessContext.Provider>
  );
}

export const useAA = () => useContext(permissionlessContext);

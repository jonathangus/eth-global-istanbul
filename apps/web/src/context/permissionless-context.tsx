"use client";
import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import {
  UserOperation,
  getSenderAddress,
  signUserOperationHashWithECDSA,
} from "permissionless";
import { Address, concat, encodeFunctionData, Hex } from "viem";
import { usepassKeyContext } from "./passkey-context";
import { abi as simpleAccountABI } from "../abi/simple-account";

import { useChain } from "../hooks/use-chain";
import { useMutation } from "wagmi";

interface PermissionlessContext {}

const permissionlessContext = createContext({});

export function PermissionlessContextProvider({ children }: PropsWithChildren) {
  const {
    publicClient,
    bundlerClient,
    paymasterClient,
    SIMPLE_ACCOUNT_FACTORY_ADDRESS,
    ENTRY_POINT_ADDRESS,
    chainId,
  } = useChain();
  const { mutate: execute, isLoading } = useMutation(async () => _execute());
  const { account } = usepassKeyContext();
  const _execute = async () => {
    if (!account) {
      return console.warn("missing logged in");
    }

    const owner = account;

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
        args: [owner.address, 0n],
      }),
    ]);

    const senderAddress = await getSenderAddress(publicClient, {
      initCode,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    console.log("...senderAddress", senderAddress);

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

    const to = "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045";
    const value = 0n;
    const data = "0x68656c6c6f";

    const callData = encodeFunctionData({
      abi: [
        {
          inputs: [
            { name: "dest", type: "address" },
            { name: "value", type: "uint256" },
            { name: "func", type: "bytes" },
          ],
          name: "execute",
          outputs: [],
          stateMutability: "nonpayable",
          type: "function",
        },
      ],
      args: [to, value, data],
    });

    const gasPrice = await bundlerClient.getUserOperationGasPrice();

    const userOperation = {
      sender: senderAddress,
      nonce: nonce,
      initCode: accountExist ? "0x" : initCode,
      callData,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
      // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
      signature:
        "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as Hex,
    };

    const sponsorUserOperationResult =
      await paymasterClient.sponsorUserOperation({
        userOperation,
        entryPoint: ENTRY_POINT_ADDRESS,
      });

    const sponsoredUserOperation: UserOperation = {
      ...userOperation,
      preVerificationGas: sponsorUserOperationResult.preVerificationGas,
      verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
      callGasLimit: sponsorUserOperationResult.callGasLimit,
      paymasterAndData: sponsorUserOperationResult.paymasterAndData,
    };

    console.log(
      "Received paymaster sponsor result:",
      sponsorUserOperationResult
    );

    const signature = await signUserOperationHashWithECDSA({
      account: owner,
      userOperation: sponsoredUserOperation,
      chainId: chainId,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    sponsoredUserOperation.signature = signature;

    const ___senderAddress = await getSenderAddress(publicClient, {
      initCode: initCode as Address,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    console.log("___senderAddress", ___senderAddress);
    console.log("copied to clipboard!");
    // TODO SAVE IN DB
    await navigator.clipboard.writeText(
      JSON.stringify({
        preVerificationGas: Number(
          sponsorUserOperationResult.preVerificationGas
        ),
        verificationGasLimit: Number(
          sponsorUserOperationResult.verificationGasLimit
        ),
        callGasLimit: Number(sponsorUserOperationResult.callGasLimit),
        paymasterAndData: sponsorUserOperationResult.paymasterAndData,
        to,
        data,
        callData,
        initCode: accountExist ? "0x" : initCode,
        sender: senderAddress,
        signature,
        nonce: Number(userOperation.nonce),
      })
    );
  };

  const value = {
    isLoading,
  };

  return (
    <permissionlessContext.Provider value={value}>
      {/* <div onClick={() => execute()}>make tx</div>
      {isLoading && <div>loading...</div>}
      passkey: {account?.address} */}
      {children}
    </permissionlessContext.Provider>
  );
}

export const useAA = () => useContext(permissionlessContext);

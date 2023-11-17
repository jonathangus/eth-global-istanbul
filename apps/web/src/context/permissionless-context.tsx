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
import { lineaTestnet } from 'viem/chains';
import { BUNDLER_CLIENT, PAYMASTER_CLIENT, PUBLIC_CLIENT } from '../clients-ts';
import { PAYMASTER_CONTRACTS } from '../config';

interface PermissionlessContext {}

const publicClient = PUBLIC_CLIENT[lineaTestnet.id];

const bundlerClient = BUNDLER_CLIENT[lineaTestnet.id];

const paymasterClient = PAYMASTER_CLIENT[lineaTestnet.id];

const SIMPLE_ACCOUNT_FACTORY_ADDRESS = PAYMASTER_CONTRACTS[lineaTestnet.id];

console.log({ paymasterClient });
const ownerPrivateKey = generatePrivateKey();
const owner = privateKeyToAccount(ownerPrivateKey);

console.log('Generated wallet with private key:', ownerPrivateKey);

const initCode = concat([
  SIMPLE_ACCOUNT_FACTORY_ADDRESS,
  encodeFunctionData({
    abi: [
      {
        inputs: [
          { name: 'owner', type: 'address' },
          { name: 'salt', type: 'uint256' },
        ],
        name: 'createAccount',
        outputs: [{ name: 'ret', type: 'address' }],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    args: [owner.address, 0n],
  }),
]);

console.log('Generated initCode:', initCode);

const permissionlessContext = createContext({});

export function PermissionlessContextProvider({ children }: PropsWithChildren) {
  const value = {};

  const test = async () => {
    const ENTRY_POINT_ADDRESS = '0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789';

    const senderAddress = await getSenderAddress(publicClient, {
      initCode,
      entryPoint: ENTRY_POINT_ADDRESS,
    });
    console.log('Calculated sender address:', senderAddress);

    const to = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // vitalik
    const value = 0n;
    const data = '0x68656c6c6f'; // "hello" encoded to utf-8 bytes

    const callData = encodeFunctionData({
      abi: [
        {
          inputs: [
            { name: 'dest', type: 'address' },
            { name: 'value', type: 'uint256' },
            { name: 'func', type: 'bytes' },
          ],
          name: 'execute',
          outputs: [],
          stateMutability: 'nonpayable',
          type: 'function',
        },
      ],
      args: [to, value, data],
    });

    console.log('Generated callData:', callData);

    const gasPrice = await bundlerClient.getUserOperationGasPrice();

    const userOperation = {
      sender: senderAddress,
      nonce: 0n,
      initCode,
      callData,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
      // dummy signature, needs to be there so the SimpleAccount doesn't immediately revert because of invalid signature length
      signature:
        '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c' as Hex,
    };

    console.log(userOperation);

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
      'Received paymaster sponsor result:',
      sponsorUserOperationResult
    );

    const signature = await signUserOperationHashWithECDSA({
      account: owner,
      userOperation: sponsoredUserOperation,
      chainId: lineaTestnet.id,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    sponsoredUserOperation.signature = signature;

    const ___senderAddress = await getSenderAddress(publicClient, {
      initCode: initCode as Address,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    console.log('___senderAddress', ___senderAddress);

    // console.log(
    //   JSON.stringify({
    //     to,
    //     data,
    //     callData,
    //     initCode,
    //     sender: senderAddress,
    //     signature,
    //     nonce: Number(userOperation.nonce),
    //   }),
    //   {
    //     to,
    //     data,
    //     callData,
    //     initCode,
    //     sender: senderAddress,
    //     signature,
    //     nonce: Number(userOperation.nonce),
    //   }
    // );

    console.log('Generated signature:', signature);

    console.log(sponsoredUserOperation);

    // SUBMIT THE USER OPERATION TO BE BUNDLED
    const userOperationHash = await bundlerClient.sendUserOperation({
      userOperation: sponsoredUserOperation,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    console.log('Received User Operation hash:', userOperationHash);

    // let's also wait for the userOperation to be included, by continually querying for the receipts
    console.log('Querying for receipts...');
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOperationHash,
    });
    const txHash = receipt.receipt.transactionHash;

    console.log(
      `UserOperation included: https://goerli.lineascan.build/tx/${txHash}`
    );
  };
  return (
    <permissionlessContext.Provider value={value}>
      <div onClick={test}>test!!</div>
      {children}
    </permissionlessContext.Provider>
  );
}

export const useAA = () => useContext(permissionlessContext);

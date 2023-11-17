import { NextRequest, NextResponse } from 'next/server';
import {
  BUNDLER_CLIENT,
  PAYMASTER_CLIENT,
  PUBLIC_CLIENT,
} from '../../../clients-ts';
import { lineaTestnet } from 'viem/chains';
import { ENTRY_POINT_ADDRESSES, PAYMASTER_CONTRACTS } from '../../../config';
import {
  UserOperation,
  bundlerActions,
  getSenderAddress,
  getUserOperationHash,
  waitForUserOperationReceipt,
  GetUserOperationReceiptReturnType,
  signUserOperationHashWithECDSA,
} from 'permissionless';
import { Address } from 'viem';

const payload = {
  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  data: '0x68656c6c6f',
  callData:
    '0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000',
  initCode:
    '0x9406Cc6185a346906296840746125a0E449764545fbfb9cf00000000000000000000000097fa24ee9fdd85684cea3cdeea880fb3c0564fb40000000000000000000000000000000000000000000000000000000000000000',
  sender: '0xAC8320cC0986f167C000a165bA4f33f6FF9950A8',
  signature:
    '0x23af57309ab75833dd07d6132f83352571fa49ffd43ca02f5af631cd1d3a25551f31fcfda05224a9ed50946639f310e49b5cf06ed4eb0cd885a5ace213ab2edf1c',
  nonce: 0,
};

const bundlerClient = BUNDLER_CLIENT[lineaTestnet.id];

const paymasterClient = PAYMASTER_CLIENT[lineaTestnet.id];

export async function GET(req: NextRequest) {
  try {
    const gasPrice = await bundlerClient.getUserOperationGasPrice();

    const userOperation = {
      sender: payload.sender as Address,
      nonce: BigInt(payload.nonce),
      initCode: payload.initCode,
      callData: payload.callData,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
      signature:
        '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c' as Hex,
    };

    const ENTRY_POINT_ADDRESS = ENTRY_POINT_ADDRESSES[lineaTestnet.id];
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
    sponsoredUserOperation.signature = payload.signature;

    console.log({ sponsoredUserOperation });
    const publicClient = PUBLIC_CLIENT[lineaTestnet.id];
    const senderAddress = await getSenderAddress(publicClient, {
      initCode: payload.initCode as Address,
      entryPoint: ENTRY_POINT_ADDRESS,
    });

    console.log('senderAddress:::', senderAddress);

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

    console.log({ sponsorUserOperationResult });
  } catch (e) {
    console.error(e);
  }

  return NextResponse.json({ a: 123 });
}

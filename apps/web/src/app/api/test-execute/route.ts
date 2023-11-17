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
import { Address, Hex } from 'viem';

const payload = {
  preVerificationGas: 236233,
  verificationGasLimit: 492352,
  callGasLimit: 75900,
  paymasterAndData:
    '0xe3dc822D77f8cA7ac74c30B0dfFEA9FcDCAAA321000000000000000000000000000000000000000000000000000000006557de4500000000000000000000000000000000000000000000000000000000000000008eaa0a29b6ec4dfb664121f7ab2758a56def4af3c68ec714116ff3eb7567a2ec4af20d55d46ce1bf90fd48b04762b395262ece98f2f3be1393da0fc41102fe341b',
  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  data: '0x68656c6c6f',
  callData:
    '0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000',
  initCode:
    '0x9406Cc6185a346906296840746125a0E449764545fbfb9cf000000000000000000000000da5ed1b9323e26b421841b896dc2935c34a4b3620000000000000000000000000000000000000000000000000000000000000000',
  sender: '0xB777F545036D59981D1b777a02FCBBAf972102F7',
  signature:
    '0x5e56ddb489e14861753289dfc203864b143088eb51012902556af7d081661a9732a6100bf808e2f08ddbf13d637b6b6fafaae9060f1bf230221a26ed5937ba911c',
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
      initCode: payload.initCode as Hex,
      callData: payload.callData as Hex,
      maxFeePerGas: gasPrice.fast.maxFeePerGas,
      maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
      signature:
        '0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c' as any,
    };

    const ENTRY_POINT_ADDRESS = ENTRY_POINT_ADDRESSES[lineaTestnet.id];

    const sponsorUserOperationResult =
      await paymasterClient.sponsorUserOperation({
        userOperation,
        entryPoint: ENTRY_POINT_ADDRESS,
      });

    // const userOperation = {
    //   sender: payload.sender as Address,
    //   nonce: BigInt(payload.nonce),
    //   initCode: payload.initCode as Hex,
    //   callData: payload.callData as Hex,
    //   maxFeePerGas: gasPrice.fast.maxFeePerGas,
    //   maxPriorityFeePerGas: gasPrice.fast.maxPriorityFeePerGas,
    //   paymasterAndData: payload.paymasterAndData as Hex,
    //   //   preVerificationGas: BigInt(payload.preVerificationGas),
    //   //   verificationGasLimit: BigInt(payload.verificationGasLimit),
    //   //   callGasLimit: BigInt(payload.callGasLimit),
    // };

    const sponsoredUserOperation: UserOperation = {
      ...userOperation,
      preVerificationGas: BigInt(payload.preVerificationGas),
      verificationGasLimit: BigInt(payload.verificationGasLimit),
      callGasLimit: BigInt(payload.callGasLimit),
      paymasterAndData: payload.paymasterAndData as Hex,

      //   preVerificationGas: sponsorUserOperationResult.preVerificationGas,
      //   verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
      //   callGasLimit: sponsorUserOperationResult.callGasLimit,
      signature: payload.signature as Hex,
    };

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

    return NextResponse.json({
      txHash,
      explorer: `https://goerli.lineascan.build/tx/${txHash}`,
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: true });
  }
}

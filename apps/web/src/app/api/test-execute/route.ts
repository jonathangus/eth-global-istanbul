import { NextRequest, NextResponse } from 'next/server';
import { BUNDLER_CLIENT, PAYMASTER_CLIENT } from '../../../clients-ts';
import { lineaTestnet } from 'viem/chains';
import { ENTRY_POINT_ADDRESSES, PAYMASTER_CONTRACTS } from '../../../config';
import { UserOperation } from 'permissionless';
import { Address, Hex } from 'viem';

const payload = {
  preVerificationGas: 236233,
  verificationGasLimit: 492352,
  callGasLimit: 75900,
  paymasterAndData:
    '0xe3dc822D77f8cA7ac74c30B0dfFEA9FcDCAAA32100000000000000000000000000000000000000000000000000000000655889bd0000000000000000000000000000000000000000000000000000000000000000fc1d77962df16cddace2ef37ba92a61a48b2b93f6b54409d2cf16977e8524ad61b7703b89a0db89b2543095048899d792836b40ab88fb8cfef9af13e6207ab701b',
  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  data: '0x68656c6c6f',
  callData:
    '0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000',
  initCode:
    '0x9406Cc6185a346906296840746125a0E449764545fbfb9cf0000000000000000000000000affcb51c7975ac9e9d58851e7d3100b412c4f930000000000000000000000000000000000000000000000000000000000000000',
  sender: '0x31D7EAfafCa6F0567BF1BDd3707D13D76A8889cE',
  signature:
    '0xebec0938d1ad64154d89fbecd359b82ac283fa663ef18745eb39a0bd4ada3e7f0d2fe473b2261e86e5cc4779a82c7e3411d0aa99356c7a6a59f7a4ba0381338a1b',
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

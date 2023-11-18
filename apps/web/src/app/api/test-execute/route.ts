import { NextRequest, NextResponse } from 'next/server';
import { lineaTestnet, scrollSepolia, baseGoerli } from 'viem/chains';
import { UserOperation } from 'permissionless';
import { Address, Hex } from 'viem';
import { getChainConfig } from '../../../util';

const payload = {
  preVerificationGas: 46816,
  verificationGasLimit: 492556,
  callGasLimit: 75900,
  paymasterAndData:
    '0xe3dc822D77f8cA7ac74c30B0dfFEA9FcDCAAA321000000000000000000000000000000000000000000000000000000006558afbf000000000000000000000000000000000000000000000000000000000000000095a45ff8d30f19d85abe77bdc794ab75f78b0e92d9c77ebef20ac5e0deb15e843c584b2adce2b7567b235d5ccfec51160157cff7ddc4c4ae57dec289ecb1ee8a1c',
  to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  data: '0x68656c6c6f',
  callData:
    '0xb61d27f6000000000000000000000000d8da6bf26964af9d7eed9e03e53415d37aa9604500000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000060000000000000000000000000000000000000000000000000000000000000000568656c6c6f000000000000000000000000000000000000000000000000000000',
  initCode:
    '0x9406Cc6185a346906296840746125a0E449764545fbfb9cf000000000000000000000000a959d9c711468852ca9c7cf26051d58efa37456e0000000000000000000000000000000000000000000000000000000000000000',
  sender: '0xda15A136AcFdDc9351bfA2C034bD1dF76Df5a481',
  signature:
    '0x37df532dab87d0d2bffe35b65a9bc2e5d1a8e256bfeb7dde1ab623beaea0bf9e0cd28a062100b8b0bae8c0e60dd4f1f25333a143352f2f9e97f1ed7fa72255ed1c',
  nonce: 0,
};

export async function GET(req: NextRequest) {
  try {
    const chainId = lineaTestnet.id;
    const { bundlerClient, ENTRY_POINT_ADDRESS } = getChainConfig(chainId);
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

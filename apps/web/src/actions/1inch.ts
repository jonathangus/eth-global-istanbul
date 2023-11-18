import { Hex, encodeFunctionData } from 'viem';
import { executeTransaction } from '../lib/execute-transaction';
import { workflowStepSchema } from '../../schemas';
import { z } from 'zod';

export const transformWorkflow = (step: any, chainId: number) => {
  // TODO
  return {
    type: 'MINT_NFT',
    chainId: chainId,

    receiver: '0x82d3270f19CD2629005136089df8aFD96ff248a4',
    amount: 10000,
  };
};

export const getCallData = async ({ chainId }): Promise<Hex> => {
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
  return callData;
};

export const execute = async (
  workflowStep: z.infer<typeof workflowStepSchema>
) => {
  console.log('Start 1inch.... swap');
  await new Promise((resolve) => setTimeout(resolve, 5000));
  console.log('1inch.... swap complete');

  return {
    ok: true,
  };
};

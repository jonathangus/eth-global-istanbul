import { Hex, encodeFunctionData } from 'viem';
import { executeTransaction } from '../lib/execute-transaction';
import { workflowStepSchema } from '../../schemas';
import { z } from 'zod';

export const transformWorkflow = (step: any, chainId: number) => {
  // TODO
  return {
    type: 'MINT_NFT',
    chainId: chainId,
    amount: 10000,
  };
};

export const getCallData = async ({ chainId, owner }): Promise<Hex> => {
  const to = 'owner';
  const value = 100000000000000n;
  const user = 'owner';

  const callDataMint = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
          {
            internalType: 'uint256',
            name: '_phaseId',
            type: 'uint256',
          },
          {
            internalType: 'uint256',
            name: '_quantity',
            type: 'uint256',
          },
          {
            internalType: 'bytes',
            name: '_signature',
            type: 'bytes',
          },
        ],
        stateMutability: 'payable',
        type: 'function',
        name: 'mint',
        outputs: [],
      },
    ],
    args: [
      user,
      0n,
      1n,
      '0x0000000000000000000000000000000000000000000000000000000000000000',
    ],
  });

  // const to = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'; // vitalik
  // const value = 0n;
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
    args: [to, value, callDataMint],
  });
};

export const execute = async (
  workflowStep: z.infer<typeof workflowStepSchema>
) => {
  const result = await executeTransaction(
    workflowStep.action.chainId,
    workflowStep.tx_sign_data!
  );

  return result;
};

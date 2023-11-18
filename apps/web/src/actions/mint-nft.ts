import { Address, Hex, encodeFunctionData } from 'viem';
import { executeTransaction } from '../lib/execute-transaction';
import { workflowStepSchema } from '../../schemas';
import { z } from 'zod';
import { getChainConfig } from '../util';

export const transformWorkflow = (step: any, chainId: number) => {
  // TODO
  return {
    type: 'MINT_NFT',
    chainId: chainId,
    amount: 10000,
  };
};

export const getCallData = async ({
  chainId,
  aaSenderAddress,
}): Promise<Hex> => {
  const config = getChainConfig(chainId);
  const to = config.NFT_ADDRESS;
  const value = 100000000000000n;
  const user = aaSenderAddress;

  const callDataMint = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            internalType: 'address',
            name: '_to',
            type: 'address',
          },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
        name: 'mint',
        outputs: [],
      },
    ],
    args: [user as Address],
  });

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

  console.log({
    callData,
    callDataMint,
  });
  return callData;
};

export const execute = async (
  workflowStep: z.infer<typeof workflowStepSchema>
) => {
  console.log(workflowStep.action, workflowStep);
  const result = await executeTransaction(
    workflowStep.action.chainId,
    workflowStep.tx_sign_data!
  );

  return result;
};

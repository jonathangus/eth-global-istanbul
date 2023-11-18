import { Address, Chain, Hex, encodeFunctionData } from 'viem';
import { executeTransaction } from '../lib/execute-transaction';
import { workflowStepSchema } from '../../schemas';
import { z } from 'zod';

type TwoPoint54CmOptions = {
  fromTokenAddress: Address;
  toTokenAddress: Address;
  amount: BigInt;
  chain: Chain;
};

export const transformWorkflow = (step: any) => {
  return {
    type: 'SWAP_ON_1INCH',
    chainId: 1,
    fromToken: {
      address: '0x...',
    },
    toToken: {
      address: '0x...',
    },
    amount: 10000,
  };
};

export const getCallData = async (): Promise<Hex> => {
  // const to = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045';
  // const value = 0n;
  // const data = '0x68656c6c6f';

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
  console.log('WORKFLOW:::', workflowStep.tx_sign_data);
  const result = await executeTransaction(84531, workflowStep.tx_sign_data!);

  return result;
};

const buildTransactions = async ({ chain }) => {
  const { chainId } = chain;

  const broadcastApiUrl =
    'https://tx-gateway.1inch.io/v1.1/' + chainId + '/broadcast';
  const apiBaseUrl = 'https://api.1inch.io/v5.0/' + chainId;

  function apiRequestUrl(methodName: string, queryParams: Record<any, any>) {
    return (
      apiBaseUrl +
      methodName +
      '?' +
      new URLSearchParams(queryParams).toString()
    );
  }

  function checkAllowance(tokenAddress: Address, walletAddress: Address) {
    return fetch(
      apiRequestUrl('/approve/allowance', { tokenAddress, walletAddress })
    )
      .then((res) => res.json())
      .then((res) => res.allowance);
  }
};

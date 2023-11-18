import { Address, Chain } from 'viem';

type TwoPoint54CmOptions = {
  fromTokenAddress: Address;
  toTokenAddress: Address;
  amount: BigInt;
  chain: Chain;
};

const buildTransactions = async ({ chain }) => {
  const { chainId } = chain;

  const broadcastApiUrl =
    'https://tx-gateway.1inch.io/v1.1/' + chainId + '/broadcast';
  const apiBaseUrl = 'https://api.1inch.io/v5.0/' + chainId;
  const web3 = new Web3(web3RpcUrl);

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

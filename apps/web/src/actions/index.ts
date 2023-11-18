import {
  getCallData as OneInchGetCallData,
  execute as OneInchExecute,
  transformWorkflow as OneInchTransformWorkflow,
} from './1inch';

import {
  getCallData as MintNftGetCallData,
  execute as MintNftExecute,
  transformWorkflow as MintNftTransformWorkflow,
} from './mint-nft';

export const getCallData = {
  SWAP_ON_1INCH: OneInchGetCallData,
  MINT_NFT: MintNftGetCallData,
};

export const executions = {
  SWAP_ON_1INCH: OneInchExecute,
  MINT_NFT: MintNftExecute,
};

export const transformers = {
  SWAP_ON_1INCH: OneInchTransformWorkflow,
  MINT_NFT: MintNftTransformWorkflow,
};

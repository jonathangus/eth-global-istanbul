import {
  getCallData as OneInchGgtCallData,
  execute as OneInchExecute,
  transformWorkflow as OneInchTransformWorkflow,
} from './1inch';

export const actions = {
  SWAP_ON_1INCH: OneInchGgtCallData,
};

export const executions = {
  SWAP_ON_1INCH: OneInchExecute,
};

export const transformers = {
  SWAP_ON_1INCH: OneInchTransformWorkflow,
};

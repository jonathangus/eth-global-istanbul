import { ChainSelector } from '../components/chain-selector';
import { FlowBuilder } from '../components/flow-builder';
import { RegisterFlow } from '../components/register-flow';

export default function Page(): JSX.Element {
  return (
    <>
      <ChainSelector />
      <FlowBuilder />
      <RegisterFlow />
    </>
  );
}

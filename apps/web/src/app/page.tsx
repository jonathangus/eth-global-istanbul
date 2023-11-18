import { FlowBuilder } from "../components/flow-builder"
import { RegisterFlow } from "../components/register-flow"

export default function Page(): JSX.Element {
  return (
    <>
      <FlowBuilder />
      <RegisterFlow />
    </>
  )
}

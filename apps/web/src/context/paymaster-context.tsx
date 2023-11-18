import { abi as PaymasterABI } from "../abi/paymaster";
import { useChain } from "../hooks/use-chain";

export function PaymasterContextProvider({ children }) {
  const { paymasterClient } = useChain();

  const testIt = async () => {
    //     const res = paymasterClient.readContractr
    // address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    //   abi: wagmiAbi,
    //   functionName: 'balanceOf',
    //   args: ['0xa5cc3c03994DB5b0d9A5eEdD10CabaB0813678AC']
  };

  return (
    <>
      {/* <button onClick={() => testIt()}>test paymaster</button> */}
      {children}
    </>
  );
}

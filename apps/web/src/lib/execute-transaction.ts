import { UserOperation } from "permissionless";
import { Address, Hex } from "viem";
import { z } from "zod";
import { stepTxSignDataSchema } from "../../schemas";
import { BUNDLER_CLIENT, PAYMASTER_CLIENT } from "../clients-ts";
import { ENTRY_POINT_ADDRESSES, SUPPORTED_CHAINS } from "../config";

export async function executeTransaction(
  _chainId: SUPPORTED_CHAINS,
  stepTxSignData: z.infer<typeof stepTxSignDataSchema>
) {
  try {
    const chainId = stepTxSignData.chainId;
    const bundlerClient = BUNDLER_CLIENT[chainId];

    if (!bundlerClient) {
      throw new Error(`No bundler client for chainId ${chainId}`);
    }

    const paymasterClient = PAYMASTER_CLIENT[chainId];

    if (!paymasterClient) {
      throw new Error(`No paymaster client for chainId ${chainId}`);
    }

    const gasPrice = await bundlerClient.getUserOperationGasPrice();

    const userOperation = {
      sender: stepTxSignData.sender as Address,
      nonce: BigInt(stepTxSignData.nonce),
      initCode: stepTxSignData.initCode as Hex,
      callData: stepTxSignData.callData as Hex,
      maxFeePerGas: BigInt(gasPrice.fast.maxFeePerGas),
      maxPriorityFeePerGas: BigInt(gasPrice.fast.maxPriorityFeePerGas),
      signature:
        "0xa15569dd8f8324dbeabf8073fdec36d4b754f53ce5901e283c6de79af177dc94557fa3c9922cd7af2a96ca94402d35c39f266925ee6407aeb32b31d76978d4ba1c" as any,
    };

    const ENTRY_POINT_ADDRESS = ENTRY_POINT_ADDRESSES[chainId];

    const sponsoredUserOperation: UserOperation = {
      ...userOperation,
      preVerificationGas: BigInt(stepTxSignData.preVerificationGas),
      verificationGasLimit: BigInt(stepTxSignData.verificationGasLimit),
      callGasLimit: BigInt(stepTxSignData.callGasLimit),
      paymasterAndData: stepTxSignData.paymasterAndData as Hex,

      //   preVerificationGas: sponsorUserOperationResult.preVerificationGas,
      //   verificationGasLimit: sponsorUserOperationResult.verificationGasLimit,
      //   callGasLimit: sponsorUserOperationResult.callGasLimit,
      signature: stepTxSignData.signature as Hex,
    };

    const userOperationHash = await bundlerClient.sendUserOperation({
      userOperation: sponsoredUserOperation,
      entryPoint: ENTRY_POINT_ADDRESS,
    });
    console.log("Received User Operation hash:", userOperationHash);

    // let's also wait for the userOperation to be included, by continually querying for the receipts
    console.log("Querying for receipts...");
    const receipt = await bundlerClient.waitForUserOperationReceipt({
      hash: userOperationHash,
    });
    const txHash = receipt.receipt.transactionHash;

    return {
      ok: true,
      txHash,
    } as const;
  } catch (e) {
    console.error(e);
    return { ok: false, error: "Something went wrong" } as const;
  }
}

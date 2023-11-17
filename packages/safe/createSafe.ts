import "dotenv/config";

import { ethers } from "ethers";
import {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";

const createSafeWallet = async () => {
  const provider = new ethers.providers.JsonRpcProvider(
    process.env.GOERLI_RPC_URL
  );
  const owner = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  const ethAdapter = new EthersAdapter({
    ethers,
    signerOrProvider: owner,
  });

  const safeFactory = await SafeFactory.create({ ethAdapter: ethAdapter });

  const safeAccountConfig: SafeAccountConfig = {
    owners: [owner.address],
    threshold: 1,
  };
  const safeAccount = await safeFactory.deploySafe({ safeAccountConfig });
  const safeAddress = await safeAccount.getAddress();

  console.log(`Safe deployed at address : ${safeAddress}`);
  console.log(`https://app.safe.global/gor:${safeAddress}`);
};

createSafeWallet();

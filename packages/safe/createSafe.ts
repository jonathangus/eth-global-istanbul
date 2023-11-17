import "dotenv/config";

import { ethers } from "ethers";
import Safe, {
  EthersAdapter,
  SafeFactory,
  SafeAccountConfig,
} from "@safe-global/protocol-kit";

const provider = new ethers.providers.JsonRpcProvider(
  process.env.GOERLI_RPC_URL
);
const owner = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

const ethAdapter = new EthersAdapter({
  ethers,
  signerOrProvider: owner,
});

const createSafeWallet = async () => {
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

const configureSafeModule = async () => {
  const safeSdk = await Safe.create({
    ethAdapter,
    safeAddress: "0x3d5fcd91c519013f8680b89b93534dea98058cbe",
  });
  let moduleAddresses = await safeSdk.getModules();
  console.log("modules configured for this safe : ", moduleAddresses);

  const ownerAddresses = await safeSdk.getOwners();
  console.log("owners of this safe : ", ownerAddresses);

  const safeTransaction = await safeSdk.createEnableModuleTx(
    "0x39e54bb2b3aa444b4b39dee15de3b7809c36fc38"
  );

  const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction);
  const txResponse = await safeSdk.executeTransaction(safeTransaction);
  await txResponse.transactionResponse?.wait();

  moduleAddresses = await safeSdk.getModules();
  console.log("modules configured for this safe : ", moduleAddresses);
};

// createSafeWallet();
configureSafeModule();

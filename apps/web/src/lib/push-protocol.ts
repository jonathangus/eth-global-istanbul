import { Env, PushAPI } from "@pushprotocol/restapi";

import { privateKeyToAccount } from "viem/accounts";
import { goerli } from "viem/chains";

const account = privateKeyToAccount(`0x${process.env.PRIVATE_KEY}`);

export async function sendNotification(title: string, message: string) {
  const user = await PushAPI.initialize(
    { ...account, getChainId: async () => goerli.id, account },
    {
      env: "staging" as Env,
    }
  );

  const response = await user.channel.send(["*"], {
    notification: { title, body: message },
  });

  return response;
}

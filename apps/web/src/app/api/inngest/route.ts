import { serve } from "inngest/next";
import { inngest } from "../../../lib/inngest";
import { helloWorld } from "../../../functions/create-onchain-listener";

export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [helloWorld],
});

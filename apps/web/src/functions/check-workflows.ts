import { inngest } from "../lib/inngest";
import { supabase } from "../lib/supabase";

export const helloWorld = inngest.createFunction(
  { id: "create-onchain-listener" },
  { event: "app/tokens.received" },
  async ({ event, step }) => {
    await step.run("Get potential workflows", async () => {
      await supabase
        .from("workflows")
        .select("*")
        .eq("trigger:jsonb->>type", "");
    });
  }
);

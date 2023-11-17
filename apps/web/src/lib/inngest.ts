import { EventSchemas, Inngest } from "inngest";

type InngestEvent =
  | {
      name: "app/tokens.received";
      data: {
        fromAddress: string;
        toAddress: string;
        token: {
          amount: number;
          address: string;
          name: string;
        };
      };
    }
  | {
      name: "app/workflow.triggered";
      data: {
        workflowId: number;
      };
    }
  | {
      name: "app/workflow.created";
      data: {
        address: string;
      };
    };

export const inngest = new Inngest({
  id: "eth-global-istanbul",
  schemas: new EventSchemas().fromUnion<InngestEvent>(),
});

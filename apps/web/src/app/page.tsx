"use client";

import { AvatarFallback } from "@radix-ui/react-avatar";
import { ChainSelector } from "../components/chain-selector";
import { FlowBuilder } from "../components/flow-builder";
import { RegisterFlow } from "../components/register-flow";
import { usepassKeyContext } from "../context/passkey-context";
import { useAA } from "../context/permissionless-context";
import { Avatar, AvatarImage } from "./components/ui/avatar";
import { Button } from "./components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./components/ui/dialog";

import { Loader } from "lucide-react";
import { useEffect, useState } from "react";
import { useChain } from "../hooks/use-chain";

export default function Page(): JSX.Element {
  const aa = useAA();
  const { account, privateKeyId, register, isRegistering, login, isLoggingIn } =
    usepassKeyContext();
  const { chainId } = useChain();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(!account);
  }, [account, chainId]);

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={(isOpened) => {
          if (!isOpened) {
            setOpen(false);
          }
        }}
      >
        <DialogContent className="space-y-1">
          <DialogHeader>
            <DialogTitle>Sign in</DialogTitle>
            <DialogDescription>
              Login or register your account
            </DialogDescription>
          </DialogHeader>
          <Button
            disabled={privateKeyId || isRegistering}
            onClick={register}
            variant={privateKeyId ? "outline" : "default"}
          >
            Register
            {isRegistering && <Loader className="w-4 h-4 animate-spin ml-2" />}
          </Button>
          <Button
            disabled={!privateKeyId}
            onClick={login}
            variant={!privateKeyId ? "outline" : "default"}
          >
            Login
            {isLoggingIn && <Loader className="w-4 h-4 animate-spin ml-2" />}
          </Button>
        </DialogContent>
      </Dialog>
      <div className="p-4 space-y-8">
        {/* <aside className="w-72 fixed top-0 border-r border-r-gray-300 h-screen p-4">
          <div className="flex gap-2 items-center">
            <Avatar>
              <AvatarImage src="" />
              <AvatarFallback>EZ</AvatarFallback>
            </Avatar>
            <p>
              {account.address.substring(0, 5)}...
              {account.address.substring(account.address.length - 3)}
            </p>
          </div>
        </aside> */}
        {/* <main className="pl-80"> */}
        <div className="flex gap-4 w-full justify-stretch">
          <ChainSelector />
          <RegisterFlow />
        </div>
        <FlowBuilder />
        {/* </main> */}
      </div>
    </>
  );
}

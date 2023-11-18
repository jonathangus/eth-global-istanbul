"use client";

import { GateFiSDK, GateFiDisplayModeEnum } from "@gatefi/js-sdk";
import { useEffect, useRef } from "react";
import { Button } from "../app/components/ui/button";
import { usepassKeyContext } from "../context/passkey-context";

export function TopupFlo({ address }: { address: string }) {
  const sdk = useRef<GateFiSDK>();
  useEffect(() => {
    sdk.current = new GateFiSDK({
      merchantId: "0f2f9ecc-0da6-4760-bf2e-6b5a7fe797cd",
      displayMode: GateFiDisplayModeEnum.Overlay,
      nodeSelector: "#gatefi-button",
      // TODO: replace with AA wallet address
      walletAddress: address,
      isSandbox: true,
    });

    sdk.current.hide();

    return () => {
      sdk.current?.destroy();
    };
  }, []);

  sdk;

  return (
    <div>
      <Button id="gatefi-button" variant="outline" size="sm">
        Topup with Unlimit
      </Button>
    </div>
  );
}

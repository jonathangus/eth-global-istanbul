"use client";

import { GateFiSDK, GateFiDisplayModeEnum } from "@gatefi/js-sdk";
import { useEffect, useRef } from "react";
import { Button } from "../app/components/ui/button";

export function RegisterFlow() {
  const sdk = useRef<GateFiSDK>();
  useEffect(() => {
    sdk.current = new GateFiSDK({
      merchantId: "0f2f9ecc-0da6-4760-bf2e-6b5a7fe797cd",
      displayMode: GateFiDisplayModeEnum.Overlay,
      nodeSelector: "#gatefi-button",
      // TODO: replace with AA wallet address
      walletAddress: "0xD71256eC24925873cE9E9F085f89864Ca05970bD",
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
      <Button id="gatefi-button">Topup with Unlimit</Button>
    </div>
  );
}

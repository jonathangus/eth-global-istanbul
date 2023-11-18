"use client";

import { GateFiSDK, GateFiDisplayModeEnum } from "@gatefi/js-sdk";
import { useEffect, useRef } from "react";
import { Button } from "../app/components/ui/button";

export function RegisterFlow() {
  const sdk = useRef<GateFiSDK>();
  useEffect(() => {
    sdk.current = new GateFiSDK({
      merchantId: "testID",
      displayMode: GateFiDisplayModeEnum.Overlay,
      nodeSelector: "#gatefi-button",
      // TODO: replace with AA wallet address
      walletAddress: "0xD71256eC24925873cE9E9F085f89864Ca05970bD",
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

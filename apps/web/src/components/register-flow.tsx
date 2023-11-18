"use client";

import { GateFiSDK, GateFiDisplayModeEnum } from "@gatefi/js-sdk";
import { useEffect, useRef } from "react";
import { Button } from "../app/components/ui/button";

export function RegisterFlow() {
  const gatefiRef = useRef<GateFiSDK>();
  useEffect(() => {
    gatefiRef.current = new GateFiSDK({
      merchantId: "",
      displayMode: GateFiDisplayModeEnum.Overlay,
      nodeSelector: "#gatefi-button",
    });

    return () => {
      gatefiRef.current?.destroy();
    };
  }, []);

  return (
    <div>
      <Button id="gatefi-button"></Button>
    </div>
  );
}

import { useEffect, useState } from "react";
import { sdkMonitor } from "../lib/sdkMonitor";
import type { SDKState } from "../lib/sdkMonitor";

export type SDKHealthStatus = "idle" | "loading" | "ready" | "error";

export function useSDKHealth(): SDKHealthStatus {
  const [state, setState] = useState<SDKState>(sdkMonitor.getState());

  useEffect(() => {
    const unsubscribe = sdkMonitor.subscribeToState((s) => setState({ ...s }));
    return unsubscribe;
  }, []);

  if (state.error) return "error";
  if (state.isInitialized) return "ready";
  if (state.isLoading) return "loading";
  return "idle";
}

import { useRef } from "react";
import { trackSimulatorEvent } from "./analytics";

type SimulatorAction = "input_changed" | "cta_clicked";

export const useSimulatorTracking = (simulatorId: string, simulatorVersion: number, pagePath: string) => {
  const trackedActions = useRef(new Set<string>());

  return (action: SimulatorAction) => {
    const base = { simulator_id: simulatorId, simulator_version: simulatorVersion, page_path: pagePath };
    if (!trackedActions.current.has("started")) {
      trackSimulatorEvent({ ...base, action: "started" });
      trackedActions.current.add("started");
    }
    if (!trackedActions.current.has(action)) {
      trackSimulatorEvent({ ...base, action });
      trackedActions.current.add(action);
    }
    if (action === "input_changed" && !trackedActions.current.has("result_viewed")) {
      trackSimulatorEvent({ ...base, action: "result_viewed" });
      trackedActions.current.add("result_viewed");
    }
  };
};

import React, { useState, useEffect } from "react";

import PileIndicator from "@Renderer/components/atoms/battery/PileIndicator";
import DefyBatteryIndicator from "@Renderer/components/atoms/battery/DefyBatteryIndicator";

interface BatteryStatusSideProps {
  side: "left" | "right";
  batteryLevel: number;
  batteryStatus: number;
  isSavingMode: boolean;
  size: "sm" | "lg";
}

const BatteryStatusSide: React.FC<BatteryStatusSideProps> = ({ side, batteryLevel, isSavingMode, batteryStatus, size }) => {
  const [loading, setLoading] = useState(true);
  const [sideFirstLetter, setSideFirstLetter] = useState("");
  const [sideStatus, setSideStatus] = useState("status--default");

  useEffect(() => {
    if (side) {
      setLoading(false);
      setSideFirstLetter(side.charAt(0));
    }
  }, [side]);

  useEffect(() => {
    // console.log("batteryStatus", batteryStatus);
    switch (batteryStatus) {
      case 0:
        if (batteryLevel > 10 && batteryLevel < 20 && !isSavingMode) {
          setSideStatus("status--warning");
        } else if (batteryLevel <= 10 && !isSavingMode) {
          setSideStatus("status--critical");
        } else {
          setSideStatus("status--default");
        }
        break;
      case 1:
        setSideStatus("status--charging");
        break;
      case 2:
        setSideStatus("status--charging status--charging-done");
        break;
      case 3:
        setSideStatus("status--fault");
        break;
      case 4:
        setSideStatus("status--disconnected");
        break;
      default:
        setSideStatus("status--fatal-error");
    }
  }, [batteryLevel, batteryStatus, isSavingMode]);

  if (loading) return null;
  return (
    <div>
      <div
        className={`battery-indicator--item size--${size} ${size === "sm" ? "p-1 rounded-sm bg-gray-50 dark:bg-gray-800" : ""} item--${side} ${sideStatus} ${batteryStatus === 1 ? "origin-center animate-pulse" : ""} ${isSavingMode && "status--saving"}`}
      >
        <div className="battery-item--container flex gap-2 items-center" style={{ color: "var(--color-status)" }}>
          {size === "sm" ? (
            <div className="battery-indicator--side text-gray-400 text-[0.5rem] font-semibold uppercase">{sideFirstLetter}</div>
          ) : (
            ""
          )}
          {size === "sm" ? <PileIndicator batteryLevel={batteryLevel} batteryStatus={batteryStatus} /> : ""}
          {size === "lg" ? <DefyBatteryIndicator side={side} batteryLevel={batteryLevel} batteryStatus={batteryStatus} /> : ""}
        </div>
      </div>
    </div>
  );
};

export default BatteryStatusSide;

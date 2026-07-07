import React, { useState, useEffect } from "react";

import PileIndicator from "@Renderer/components/atoms/battery/PileIndicator";
import DefyBatteryIndicator from "@Renderer/components/atoms/battery/DefyBatteryIndicator";
import SonseiBatteryIndicator from "@Renderer/components/atoms/battery/SonseiBatteryIndicator";

interface BatteryStatusSideProps {
  side: "left" | "right";
  batteryLevel: number;
  batteryStatus: number;
  isSavingMode: boolean;
  size: "sm" | "lg";
  deviceType?: string;
}

const BatteryStatusSide: React.FC<BatteryStatusSideProps> = ({ side, batteryLevel, isSavingMode, batteryStatus, size, deviceType }) => {
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

  const isSonsei = deviceType?.toLowerCase().includes("sonsei");

  if (isSonsei && side === "right") {
    return null;
  }

  return (
    <div>
      <div
        className={`battery-indicator--item size--${size} ${size === "sm" ? "p-1 rounded-sm bg-gray-50 dark:bg-gray-800" : ""} item--${side} ${sideStatus} ${batteryStatus === 1 && !isSonsei ? "origin-center animate-pulse" : ""} ${isSavingMode && "status--saving"}`}
      >
        <div className={`battery-item--container flex gap-2 items-center ${size === "sm" && isSonsei ? "justify-center" : ""}`} style={{ color: "var(--color-status)" }}>
          {size === "sm" && !isSonsei ? (
            <div className="battery-indicator--side text-gray-400 text-[0.5rem] font-semibold uppercase">{sideFirstLetter}</div>
          ) : (
            ""
          )}
          {size === "sm" ? <PileIndicator batteryLevel={batteryLevel} batteryStatus={batteryStatus} /> : ""}
          {size === "sm" && isSonsei && !Number.isNaN(batteryLevel) && batteryLevel > 0 ? (
            <div className="battery-percentage-sonsei text-gray-400 text-[0.6rem] font-semibold">{batteryLevel}%</div>
          ) : (
            ""
          )}
          {size === "lg" && isSonsei ? <SonseiBatteryIndicator batteryLevel={batteryLevel} batteryStatus={batteryStatus} /> : ""}
          {size === "lg" && !isSonsei ? <DefyBatteryIndicator side={side} batteryLevel={batteryLevel} batteryStatus={batteryStatus} /> : ""}
        </div>
      </div>
    </div>
  );
};

export default BatteryStatusSide;

import React from "react";

interface DevicePreviewProps {
  deviceName: string;
  isConnected: boolean;
}
const DevicePreview = ({ deviceName, isConnected }: DevicePreviewProps) => (
  <div className="device-preview">
    <canvas
      className={`w-full block bg-center bg-no-repeat bg-contain ${deviceName} ${isConnected ? "on" : "off"}`}
      width="1140"
      height="720"
    />
  </div>
);

export default DevicePreview;

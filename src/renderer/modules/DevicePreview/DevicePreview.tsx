import React from "react";

interface DevicePreviewProps {
  deviceName: string;
  isConnected: boolean;
}
const DevicePreview = ({ deviceName, isConnected }: DevicePreviewProps) => {
  // Extract product name from displayName (e.g., "Dygma Defy wireless" -> "Defy")
  const extractProductName = (name: string): string => {
    if (!name) return "";
    // Remove "Dygma" prefix and any suffix like "wireless", "wired", "ANSI", "ISO"
    const cleaned = name
      .replace(/^Dygma\s+/i, "")
      .replace(/\s+(wireless|wired|ansi|iso)$/i, "")
      .trim();
    return cleaned;
  };

  const productName = extractProductName(deviceName);

  return (
    <div className="device-preview">
      <canvas
        className={`w-full block bg-center bg-no-repeat bg-contain ${productName} ${isConnected ? "on" : "off"}`}
        width="1140"
        height="720"
      />
    </div>
  );
};

export default DevicePreview;

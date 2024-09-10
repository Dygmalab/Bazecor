import React from "react";
import IconLayerShift from "@Renderer/components/atoms/icons/IconLayerShift";
import OSKey from "./OSKey";

interface DualFunctionTagProps {
  layerNumber?: number;
  modifier?: "shift" | "control" | "os" | "alt" | "altGr";
  direction?: "Left" | "Right";
  size?: "sm" | "md";
}

const dualFunctionTag = ({ layerNumber, modifier, direction, size }: DualFunctionTagProps) => (
  <div className={`inline-flex items-center gap-0.5 leading-4 ${layerNumber && modifier === "os" ? "-ml-1" : ""}`}>
    <div className="inline-flex items-center gap-1">
      {layerNumber ? (
        <>
          <IconLayerShift /> {layerNumber}
        </>
      ) : (
        <OSKey renderKey={modifier} direction={direction} size={size} />
      )}
    </div>{" "}
    /
  </div>
);

export default dualFunctionTag;

import IconLayerShift from "@Renderer/components/atoms/icons/IconLayerShift";
import React from "react";

interface DualFunctionTagProps {
  layerNumber: number;
}

const dualFunctionTag = ({ layerNumber }: DualFunctionTagProps) => (
  <div className="inline-flex items-center gap-0.5 -ml-1">
    <div className="inline-flex items-center gap-1 leading-4">
      <IconLayerShift /> {layerNumber}
    </div>{" "}
    /
  </div>
);

export default dualFunctionTag;

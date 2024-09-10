import React from "react";
import { IconLayerShift, IconLayerLock } from "@Renderer/components/atoms/icons";

interface LayerTagProps {
  type: "shift" | "lock";
  layerNumber: number;
}

const LayerTag = ({ type, layerNumber }: LayerTagProps) => (
  <div className="inline-flex items-center gap-0.5 -ml-1">
    <div className="inline-flex items-center gap-1 leading-4">
      {type === "shift" ? <IconLayerShift /> : <IconLayerLock />} {layerNumber}
    </div>
  </div>
);

export default LayerTag;

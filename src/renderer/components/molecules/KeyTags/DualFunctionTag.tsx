import IconLayerShift from "@Renderer/components/atoms/icons/IconLayerShift";
import React from "react";

interface DualFunctionTagProps {
  layerNumber: number;
}

const dualFunctionTag = ({ layerNumber }: DualFunctionTagProps) => (
  <>
    <div className="flex w-full items-center -mt-2 -ml-0.5">
      <div className="inline-flex items-center px-0.5 py-0 bg-white/25 rounded-sm text-white text-[6px] font-semibold uppercase backdrop-blur">
        TAP
      </div>
      <div className="inline-flex items-center px-0.5 py-0 text-white text-[6px] font-semibold uppercase">/</div>
      <div className="inline-flex items-center px-0.5 py-0 bg-white/25 rounded-sm text-white text-[6px] font-semibold uppercase backdrop-blur">
        HOLD
      </div>
    </div>
    <div className="inline-flex items-center gap-0.5 -ml-1">
      <div className="inline-flex items-center gap-1 leading-4">
        <IconLayerShift /> {layerNumber}
      </div>{" "}
      /
    </div>
  </>
);

export default dualFunctionTag;

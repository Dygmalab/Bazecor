import React from "react";
import { IconOneShotMode } from "@Renderer/components/atoms/icons";
import OSKey from "./OSKey";

interface OneShotTagProps {
  layerNumber?: number;
  modifier?: "shift" | "control" | "os" | "alt" | "altGr";
  direction?: "Left" | "Right";
  size?: "sm" | "md";
}

const OneShotTag = ({ layerNumber, modifier, direction, size }: OneShotTagProps) => (
  <div className={`inline-flex items-center gap-0.5 leading-4 ${layerNumber && modifier === "os" ? "-ml-1" : ""}`}>
    {layerNumber ? (
      <div className="inline-flex flex-nowrap whitespace-nowrap items-center gap-1 [&_svg]:!w-[19px]">
        <IconOneShotMode /> {layerNumber}
      </div>
    ) : (
      <div className="inline-flex flex-wrap gap-1 [&_svg]:!w-[19px] [&_svg]:self-center [&>div]:self-center">
        <IconOneShotMode mode="modifier" /> <OSKey renderKey={modifier} direction={direction} size={size} />
      </div>
    )}
  </div>
);

export default OneShotTag;

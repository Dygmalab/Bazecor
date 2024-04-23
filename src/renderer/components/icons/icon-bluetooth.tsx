import * as React from "react";

interface SVGProps {
  width?: number;
  height?: number;
}

function IconBluetooth({ width = 24, height = 24 }: SVGProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_4369_15994" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="3" width="24" height="19">
        <rect y="3.5" width="24" height="18" fill="white" />
      </mask>
      <g mask="url(#mask0_4369_15994)">
        <path d="M6 7L16.5 16.5L12 20.5V4.5L16.5 8.5L6 18" stroke="currentColor" strokeWidth="1.2" />
      </g>
    </svg>
  );
}

export default IconBluetooth;

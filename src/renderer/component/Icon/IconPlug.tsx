import * as React from "react";

interface SVGProps {
  width?: number;
  height?: number;
}

function IconPlug({ width = 24, height = 24 }: SVGProps) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M8 2V8M8 8H6C5.44772 8 5 8.44772 5 9V14L10 19V22H14V19L19 14V9C19 8.44772 18.5523 8 18 8H16M8 8H16M16 2V8"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default IconPlug;

import * as React from "react";

interface IconLensProps {
  size?: "lg" | "md" | "sm";
  strokeWidth?: number;
}

function IconLens({ size = "md", strokeWidth = 1.2 }: IconLensProps) {
  const width = size === "lg" ? 42 : size === "sm" ? 20 : 24;
  const height = width;
  
  return (
    <svg width={width} height={height} fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <rect x="2" y="9" width="20" height="12" rx="2" stroke="currentColor" strokeWidth={strokeWidth} />
      <rect x="5" y="12" width="3" height="2" rx="0.5" fill="currentColor" opacity={0.7} />
      <rect x="10.5" y="12" width="3" height="2" rx="0.5" fill="currentColor" opacity={0.7} />
      <rect x="16" y="12" width="3" height="2" rx="0.5" fill="currentColor" opacity={0.7} />
      <rect x="5" y="16" width="14" height="2" rx="0.5" fill="currentColor" opacity={0.7} />
      <rect x="11" y="2.5" width="10" height="8" rx="1.5" fill="currentColor" opacity={0.2} stroke="currentColor" strokeWidth={strokeWidth} />
      <path d="M14 5.5h4M14 7.5h2.5" stroke="currentColor" strokeWidth={strokeWidth * 0.8} strokeLinecap="round" opacity={0.8} />
    </svg>
  );
}

export default IconLens;

import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconLayers({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask
            id="maskLayers0"
            maskUnits="userSpaceOnUse"
            x="0"
            y="11"
            width="24"
            height="12"
            style={{
              maskType: "alpha",
            }}
          >
            <path d="M12 19.5L0 11.5V23H24V11.5L12 19.5Z" fill="white" />
          </mask>
          <g mask="url(#maskLayers0)">
            <path d="M3 15L12 9L21 15L12 21L3 15Z" strokeWidth={1.2} stroke="currentColor" />
          </g>
          <path d="M3 10L12 4L21 10L12 16L3 10Z" strokeWidth={1.2} stroke="currentColor" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask
            id="prefix_LayersSm_a"
            style={{
              maskType: "alpha",
            }}
            maskUnits="userSpaceOnUse"
            x={0}
            y={9}
            width={20}
            height={11}
          >
            <path d="M10 16.25L0 9.583v9.584h20V9.583L10 16.25z" fill="#fff" />
          </mask>
          <g mask="url(#prefix_LayersSm_a)">
            <path d="M2.5 12.5l7.5-5 7.5 5-7.5 5-7.5-5z" stroke="currentColor" />
          </g>
          <path d="M2.5 8.333l7.5-5 7.5 5-7.5 5-7.5-5z" stroke="currentColor" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconLayers;

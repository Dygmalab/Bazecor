import * as React from "react";

interface IconProps {
  size?: "md" | "sm" | "xs";
}

function IconShutdown({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M16 20v1H8v-1z" />
          <path stroke="currentColor" strokeWidth={1.2} d="M3.576 22.576l20-20" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M19 4H4a1 1 0 00-1 1v12a1 1 0 001 1h1l1.2-1.2h-2V5.2H17.8L19 4zM9.028 16.8H19.8V6.028l1.187-1.187c.009.052.013.105.013.159v12a1 1 0 01-1 1H7.828l1.2-1.2z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M6.667 16.667v.833h6.667v-.833z" />
          <path stroke="currentColor" d="M17.02 18.813L.354 2.147" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4.167 3.333h12.5c.46 0 .833.374.833.834v10c0 .46-.373.833-.833.833h-.834l-1-1H16.5V4.333H5.167l-1-1zM12.477 14H3.5V5.024l-.99-.99a.84.84 0 00-.01.133v10c0 .46.373.833.833.833h10.143l-1-1z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconShutdown;

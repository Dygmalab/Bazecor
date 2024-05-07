import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconMediaRewind({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.071 12.5l7.5 7.5V5l-7.5 7.5z" fill="currentColor" />
          <path d="M3 12.5l7.5 7.5V5L3 12.5z" fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.393 10.417l6.25 6.25v-12.5l-6.25 6.25z" fill="currentColor" />
          <path d="M2.5 10.417l6.25 6.25v-12.5l-6.25 6.25z" fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconMediaRewind;

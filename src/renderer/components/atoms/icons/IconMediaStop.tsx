import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconMediaStop({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M6 6h12v12H6z" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M5 5h10v10H5z" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconMediaStop;

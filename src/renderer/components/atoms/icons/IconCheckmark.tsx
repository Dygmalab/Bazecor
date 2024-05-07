import * as React from "react";

interface IconProps {
  size?: "sm";
}

function IconCheckmark({ size = "sm" }: IconProps) {
  return (
    <>
      {size === "sm" ? (
        <svg width={20} height={20} viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.333 10l4.583 4.583 8.75-8.75" stroke="currentColor" strokeWidth={1.2} />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconCheckmark;

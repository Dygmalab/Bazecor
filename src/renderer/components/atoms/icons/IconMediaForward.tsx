import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconMediaForward({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12.5 11.5L5 4v15l7.5-7.5z" fill="currentColor" />
          <path d="M19.571 11.5l-7.5-7.5v15l7.5-7.5z" fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.417 9.583l-6.25-6.25v12.5l6.25-6.25z" fill="currentColor" />
          <path d="M16.31 9.583l-6.25-6.25v12.5l6.25-6.25z" fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconMediaForward;

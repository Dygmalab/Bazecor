import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconInformation({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12 21.8c5.412 0 9.8-4.388 9.8-9.8 0-5.412-4.388-9.8-9.8-9.8-5.412 0-9.8 4.388-9.8 9.8 0 5.412 4.388 9.8 9.8 9.8zm0 1.2c6.075 0 11-4.925 11-11S18.075 1 12 1 1 5.925 1 12s4.925 11 11 11z"
            fill="currentColor"
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.5 17.1H13a1.6 1.6 0 01-1.6-1.6v-4a.4.4 0 00-.4-.4H9.5V9.9H11a1.6 1.6 0 011.6 1.6v4c0 .22.18.4.4.4h1.5v1.2zM12.6 6.5V8h-1.2V6.5h1.2z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx={10.001} cy={10} r={8.567} stroke="currentColor" strokeWidth={1.2} />
          <path d="M10 5.417v1.25M7.918 8.75h1.084a1 1 0 011 1v3a1 1 0 001 1h1.083" stroke="currentColor" strokeWidth={1.2} />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconInformation;

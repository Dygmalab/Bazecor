import * as React from "react";

interface IconToolsCameraProps {
  size?: "md" | "sm";
}

function IconToolsCamera({ size = "md" }: IconToolsCameraProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M17 12V7a1 1 0 00-1-1H3a1 1 0 00-1 1v10a1 1 0 001 1h13a1 1 0 001-1v-5zm0 0l4.83-4.83a.1.1 0 01.17.07v9.518a.1.1 0 01-.17.07L17 12z"
            stroke="currentColor"
            strokeWidth={1.5}
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M14.167 10V5.833A.833.833 0 0013.333 5H2.5a.833.833 0 00-.833.833v8.334c0 .46.373.833.833.833h10.833c.46 0 .834-.373.834-.833V10zm0 0l4.024-4.024a.083.083 0 01.142.059v7.93c0 .075-.09.112-.142.06L14.167 10z"
            stroke="currentColor"
            strokeWidth={1.25}
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconToolsCamera;

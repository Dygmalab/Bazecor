import * as React from "react";

interface IconProps {
  size?: "sm" | "lg";
}

const PATH =
  "M11.25 11.375V7h2v4.375h-2zm8.75 17.5V7h2v21.875h-2zm8.75-3.5V7h2v18.375h-2zm-20-10.625h7v2h-2.5V35h-2V16.75h-2.5v-2zm17.5 14h7v2h-2.5V35h-2v-4.25h-2.5v-2zm-8.75 3.5h7v2h-7v-2z";

function IconPreferences({ size = "lg" }: IconProps) {
  // The small size crops the 42px canvas to the drawing so the sliders stay readable at 16px
  const small = size === "sm";
  return (
    <svg
      width={small ? 16 : 42}
      height={small ? 16 : 42}
      viewBox={small ? "7 6 29 30" : "0 0 42 42"}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path fillRule="evenodd" clipRule="evenodd" d={PATH} fill="currentColor" />
    </svg>
  );
}

export default IconPreferences;

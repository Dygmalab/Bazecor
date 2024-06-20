import * as React from "react";

interface IconToolsCalculatorProps {
  size?: "md" | "sm";
}
function IconToolsCalculator({ size = "md" }: IconToolsCalculatorProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M20 14l-3 3m0 0l-3 3m3-3l-3-3m3 3l3 3M3 17h8" stroke="currentColor" strokeWidth={1.5} />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8 14a1 1 0 11-2 0 1 1 0 012 0zm0 6a1 1 0 11-2 0 1 1 0 012 0z"
            fill="currentColor"
          />
          <path d="M13 7h8M7 3v8M3 7h8" stroke="currentColor" strokeWidth={1.5} />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M16.667 11.667l-2.5 2.5m0 0l-2.5 2.5m2.5-2.5l-2.5-2.5m2.5 2.5l2.5 2.5M2.5 14.167h6.667"
            stroke="currentColor"
            strokeWidth={1.25}
          />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M6.667 11.667a.833.833 0 11-1.667 0 .833.833 0 011.667 0zm0 5a.833.833 0 11-1.667 0 .833.833 0 011.667 0z"
            fill="currentColor"
          />
          <path d="M10.833 5.833H17.5M5.833 2.5v6.667M2.5 5.833h6.667" stroke="currentColor" strokeWidth={1.25} />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconToolsCalculator;

import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconNote({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12.402 18.174V7.79m0 0V5l4.605-.384v2.79l-4.605.384zM12.4 18.1c0 1.17-1.188 2.3-2.9 2.3s-2.9-1.13-2.9-2.3c0-1.169 1.188-2.299 2.9-2.299s2.9 1.13 2.9 2.3zM3 12h3m2-6L6 4"
            stroke="currentColor"
            strokeWidth={1.2}
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M10.335 15.145V6.492m0 0V4.167l3.837-.32v2.325l-3.837.32zM10.333 15.084c0 .974-.99 1.916-2.416 1.916C6.49 17 5.5 16.058 5.5 15.084s.99-1.916 2.417-1.916c1.427 0 2.416.942 2.416 1.916zM2.5 10H5m1.667-5L5 3.333"
            stroke="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconNote;

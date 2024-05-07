import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconMediaPlayPause({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.577 12L4.789 5v14l5.788-7zM17.113 5.815h3.396v12.452h-3.396z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M11.453 8.635l2.783 3.366-2.783 3.365v2.901h3.396V5.815h-3.396v2.82z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M8.814 10L3.99 4.167v11.666L8.814 10zM14.261 4.846h2.83v10.377h-2.83z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M9.544 7.196l2.32 2.805-2.32 2.804v2.418h2.83V4.846h-2.83v2.35z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconMediaPlayPause;

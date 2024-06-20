import * as React from "react";

interface IconWrenchProps {
  size?: "md" | "sm";
}

function iconWrench({ size = "md" }: IconWrenchProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#prefix__Wrench)">
            <path
              d="M2.475 5.303a5.502 5.502 0 007.248 7.248l8.662 8.662a1 1 0 001.414 0l1.414-1.414a1 1 0 000-1.414l-8.662-8.662a5.502 5.502 0 00-7.248-7.248L8.84 6.01 6.01 8.84 2.475 5.303z"
              stroke="currentColor"
              strokeWidth={1.2}
            />
          </g>
          <defs>
            <clipPath id="prefix__Wrench">
              <path fill="#fff" d="M0 0h24v24H0z" />
            </clipPath>
          </defs>
        </svg>
      ) : (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <g clipPath="url(#prefix__WrenchSm)">
            <path
              d="M2.062 4.42a4.585 4.585 0 006.04 6.04l7.219 7.218a.834.834 0 001.178 0l1.179-1.179a.834.834 0 000-1.178l-7.219-7.219a4.585 4.585 0 00-6.04-6.04L7.366 5.01 5.009 7.366 2.062 4.419z"
              stroke="currentColor"
            />
          </g>
          <defs>
            <clipPath id="prefix__WrenchSm">
              <path fill="#fff" d="M0 0h20v20H0z" />
            </clipPath>
          </defs>
        </svg>
      )}
    </>
  );
}

export default iconWrench;

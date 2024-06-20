import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconToolsBrightnessLess({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M9.6 15.08a4.8 4.8 0 014.8-4.8v0a4.8 4.8 0 014.8 4.8v.62a.339.339 0 01-.339.34H9.94a.339.339 0 01-.339-.34v-.62z"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
          <path d="M14.4 6.92V5M20.16 9.494l1.358-1.358" stroke="currentColor" strokeWidth={1.5} />
          <path d="M22.08 15.08H24" stroke="currentColor" strokeWidth={1.2} />
          <path d="M8.16 9.494L6.803 8.136" stroke="currentColor" strokeWidth={1.5} />
          <path fill="currentColor" d="M0 17h8.64v1.92H0z" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 12.567a4 4 0 014-4v0a4 4 0 014 4v.517a.282.282 0 01-.282.283H8.282A.282.282 0 018 13.084v-.517z"
            stroke="currentColor"
            strokeLinejoin="round"
          />
          <path d="M12 5.767v-1.6M16.8 7.912l1.131-1.131" stroke="currentColor" strokeWidth={1.25} />
          <path d="M18.4 12.567H20" stroke="currentColor" />
          <path d="M6.8 7.912L5.669 6.781" stroke="currentColor" strokeWidth={1.25} />
          <path fill="currentColor" d="M0 14.167h7.2v1.6H0z" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconToolsBrightnessLess;

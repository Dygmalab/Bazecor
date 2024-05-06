import * as React from "react";

interface IconToolsEjectProps {
  size?: "md" | "sm" | "xs";
}

function IconToolsEject({ size = "md" }: IconToolsEjectProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 17h14v2H5v-2zm7-12L5.33 15h13.34L12 5z" fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.167 14.167h11.666v1.666H4.167v-1.666zm5.833-10L4.442 12.5h11.116L10 4.167z" fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconToolsEject;

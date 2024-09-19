import * as React from "react";

interface IconProps {
  size?: "sm" | "md";
}

function IconSplitView({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_234_4772" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="3" y="3" width="18" height="18">
            <path d="M15 3H17V5H15V3Z" fill="currentColor" />
            <path d="M19 3H21V5H19V3Z" fill="currentColor" />
            <path d="M19 7H21V9H19V7Z" fill="currentColor" />
            <path d="M19 11H21V13H19V11Z" fill="currentColor" />
            <path d="M19 15H21V17H19V15Z" fill="currentColor" />
            <path d="M19 19H21V21H19V19Z" fill="currentColor" />
            <path d="M15 19H17V21H15V19Z" fill="currentColor" />
            <path d="M3 3H9V21H3V3Z" fill="currentColor" />
          </mask>
          <g mask="url(#mask0_234_4772)">
            <rect x="3.6" y="3.6" width="16.8" height="16.8" rx="1.4" stroke="currentColor" strokeWidth="1.2" />
          </g>
          <path d="M12 1V23" stroke="currentColor" strokeWidth="1.2" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_683_16" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="2" width="16" height="16">
            <path d="M12.5 2.5H14.1667V4.16667H12.5V2.5Z" fill="currentColor" />
            <path d="M15.8333 2.5H17.5V4.16667H15.8333V2.5Z" fill="currentColor" />
            <path d="M15.8333 5.83333H17.5V7.5H15.8333V5.83333Z" fill="currentColor" />
            <path d="M15.8333 9.16667H17.5V10.8333H15.8333V9.16667Z" fill="currentColor" />
            <path d="M15.8333 12.5H17.5V14.1667H15.8333V12.5Z" fill="currentColor" />
            <path d="M15.8333 15.8333H17.5V17.5H15.8333V15.8333Z" fill="currentColor" />
            <path d="M12.5 15.8333H14.1667V17.5H12.5V15.8333Z" fill="currentColor" />
            <path d="M2.5 2.5H7.5V17.5H2.5V2.5Z" fill="currentColor" />
          </mask>
          <g mask="url(#mask0_683_16)">
            <rect x="3" y="3" width="14" height="14" rx="1.16667" stroke="currentColor" />
          </g>
          <path d="M10 0.833313V19.1666" stroke="currentColor" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconSplitView;

import * as React from "react";

interface IconStopWatchProps {
  size?: "md" | "sm" | "xs";
}

function IconStopWatch({ size = "md" }: IconStopWatchProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M12 4a9 9 0 106.844 3.156M12 4a8.98 8.98 0 016.844 3.156M12 4V3m0 4.5V14m9-9l-2.156 2.156M12 3h-2m2 0h2"
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
            d="M10 4.667a6 6 0 104.563 2.103M10 4.667c1.826 0 3.463.816 4.563 2.103M10 4.667V4m0 3v4.333m6-6L14.563 6.77M10 4H8.667M10 4h1.333"
            stroke="currentColor"
            strokeWidth={1.2}
          />
        </svg>
      ) : (
        ""
      )}
      {size === "xs" ? (
        <svg width={16} height={16} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M8 3.167a6 6 0 104.563 2.103M8 3.167c1.827 0 3.463.816 4.563 2.103M8 3.167V2.5m0 3v4.333m6-6L12.563 5.27M8 2.5H6.667M8 2.5h1.333"
            stroke="currentColor"
            strokeWidth={1.2}
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconStopWatch;

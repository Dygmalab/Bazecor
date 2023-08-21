import React, { useState, useEffect } from "react";

interface PileIndicatorProps {
  batteryLevel: number;
  isCharging: boolean;
  batteryStatus: number;
}
const PileIndicator = ({ batteryLevel, isCharging, batteryStatus }: PileIndicatorProps) => {
  const [batteryWidth, setBatteryWidth] = useState(0);
  // console.log("isCharging", isCharging);
  // console.log("batteryStatus", batteryStatus);

  const maskHash = `${Date.now()}-${(Math.random() + 1).toString(36).substring(7)}-level`;

  useEffect(() => {
    if (!isCharging) {
      if (batteryLevel < 5) {
        setBatteryWidth(1);
      } else {
        setBatteryWidth((16 * batteryLevel) / 100);
      }
    }
    if (batteryStatus === 2) {
      setBatteryWidth(16);
    }
  }, [batteryLevel, isCharging, batteryStatus]);

  return (
    <svg className="pileIndicator" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {isCharging ? (
        <>
          <mask
            id={`mask0_1956_10095-${maskHash}`}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="4"
            width="20"
            height="8"
          >
            <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          </mask>
          <g mask={`url(#mask0_1956_10095-${maskHash})`}>
            <path d="M17 5H14V2.5H24V13H12L17 5Z" fill="currentColor" />
          </g>
          <mask
            id={`mask1_1956_10095-${maskHash}`}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="4"
            width="20"
            height="8"
          >
            <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          </mask>
          <g mask={`url(#mask1_1956_10095-${maskHash})`}>
            <path d="M3 9.5L8 2H-2V13H6V9.5H3Z" fill="currentColor" />
          </g>
        </>
      ) : (
        ""
      )}
      <rect x="21" y="6" width="1" height="4" fill="currentColor" />
      {isCharging ? <path d="M7 8.45833L11 2.5V7.08333H13L9 13.5V8.45833H7Z" fill="currentColor" stroke="currentColor" /> : ""}
      {batteryStatus === 0 ? (
        <>
          <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          <rect x="2" y="6" width={batteryWidth} height="4" fill="currentColor" />
        </>
      ) : (
        ""
      )}
      {batteryStatus === 2 ? (
        <>
          <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          <rect x="2" y="6" width={16} height="4" fill="currentColor" />
        </>
      ) : (
        ""
      )}
      {batteryStatus === 3 ? (
        <>
          <mask
            id={`mask_battery3-${maskHash}`}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="-2"
            y="1"
            width="25"
            height="12"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M12.9 9.95785C14.3347 9.1279 15.3 7.57668 15.3 5.8C15.3 4.92571 15.0663 4.10602 14.6578 3.4H22.5V13H12.9V9.95785ZM8.1 13H-1.5V3.4H6.34215C5.93375 4.10602 5.7 4.92571 5.7 5.8C5.7 7.57668 6.66528 9.1279 8.1 9.95785V13Z"
              fill="black"
            />
          </mask>
          <g mask={`url(#mask_battery3-${maskHash})`}>
            <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          </g>
          <rect x="22" y="6" width="1" height="4" fill="currentColor" />
          <path
            d="M11.579 12.688C11.579 12.896 11.462 13 11.228 13H9.681C9.577 13 9.50333 12.9783 9.46 12.935C9.42533 12.8917 9.408 12.8223 9.408 12.727V11.115C9.408 10.959 9.47733 10.881 9.616 10.881H11.397C11.5183 10.881 11.579 10.9503 11.579 11.089V12.688ZM7.471 5.486C7.40167 5.46867 7.36267 5.42967 7.354 5.369C7.34533 5.30833 7.34967 5.252 7.367 5.2C7.64433 4.56733 8.069 4.082 8.641 3.744C9.213 3.39733 9.89333 3.224 10.682 3.224C11.332 3.224 11.891 3.328 12.359 3.536C12.8357 3.73533 13.204 4.00833 13.464 4.355C13.7327 4.693 13.867 5.07433 13.867 5.499C13.867 5.90633 13.7803 6.253 13.607 6.539C13.4337 6.825 13.2213 7.08067 12.97 7.306C12.7187 7.53133 12.463 7.75667 12.203 7.982C11.9517 8.19867 11.7393 8.44133 11.566 8.71C11.3927 8.97867 11.306 9.308 11.306 9.698C11.306 9.76733 11.28 9.828 11.228 9.88C11.1847 9.92333 11.124 9.945 11.046 9.945H9.98C9.798 9.945 9.707 9.84533 9.707 9.646C9.707 9.18667 9.78067 8.79233 9.928 8.463C10.0753 8.13367 10.2573 7.84767 10.474 7.605C10.6907 7.35367 10.903 7.124 11.111 6.916C11.3277 6.708 11.5097 6.5 11.657 6.292C11.813 6.084 11.891 5.85433 11.891 5.603C11.891 5.291 11.774 5.044 11.54 4.862C11.306 4.68 11.0157 4.589 10.669 4.589C10.4437 4.589 10.2227 4.63233 10.006 4.719C9.78933 4.80567 9.59867 4.93133 9.434 5.096C9.26933 5.26067 9.13933 5.45133 9.044 5.668C9.00933 5.73733 8.97467 5.78067 8.94 5.798C8.90533 5.80667 8.849 5.80667 8.771 5.798L7.471 5.486Z"
            fill="#FF6B6B"
            className="pulse"
          />
        </>
      ) : (
        ""
      )}
      {batteryStatus === 4 ? (
        <>
          <mask
            id={`mask_battery4-${maskHash}`}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="3"
            width="20"
            height="8"
          >
            <rect x="0.5" y="-0.5" width="19" height="7" transform="matrix(-1 0 0 1 20 4)" stroke="black" />
          </mask>
          <g mask={`url(#mask_battery4-${maskHash})`}>
            <path d="M20 3H9L17 11H20V3Z" fill="currentColor" />
            <path d="M3 3H0V11H11L3 3Z" fill="currentColor" />
          </g>
          <rect x="21" y="5" width="1" height="4" fill="currentColor" />
          <line
            y1="-0.6"
            x2="18"
            y2="-0.6"
            transform="matrix(-0.707107 -0.707107 -0.707107 0.707107 15.7275 13.7279)"
            stroke="currentColor"
            strokeWidth="1.2"
          />
        </>
      ) : (
        ""
      )}
      {batteryStatus === 255 ? (
        <>
          <mask
            id={`mask_battery_error_${maskHash}`}
            style={{ maskType: "alpha" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="4"
            width="20"
            height="8"
          >
            <rect x="0.5" y="4.5" width="19" height="7" stroke="black" />
          </mask>
          <g mask={`url(#mask_battery_error_${maskHash})`}>
            <path d="M0 4H6.5L7 12H0V4Z" fill="currentColor" />
            <path d="M13 4H20V12H12.5L13 4Z" fill="currentColor" />
          </g>
          <rect x="21" y="6" width="1" height="4" fill="currentColor" />
          <path
            d="M10.782 12.688C10.782 12.896 10.665 13 10.431 13H8.897C8.70633 13 8.611 12.909 8.611 12.727V11.115C8.611 10.959 8.676 10.881 8.806 10.881H10.587C10.717 10.881 10.782 10.9503 10.782 11.089V12.688ZM10.366 9.698C10.3573 9.802 10.327 9.87567 10.275 9.919C10.223 9.96233 10.1363 9.984 10.015 9.984H9.326C9.222 9.984 9.15267 9.96667 9.118 9.932C9.092 9.88867 9.07033 9.81933 9.053 9.724L8.559 3.588C8.55033 3.51 8.56333 3.45367 8.598 3.419C8.64133 3.37567 8.69333 3.354 8.754 3.354H10.665C10.8037 3.354 10.8643 3.42767 10.847 3.575L10.366 9.698Z"
            fill="currentColor"
            className="pulse"
          />
        </>
      ) : (
        ""
      )}
    </svg>
  );
};

export default PileIndicator;

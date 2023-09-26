import React from "react";

function IconWireless({ width, height, strokeWidth }) {
  return (
    <svg
      width={width ? width : 42}
      height={height ? height : 42}
      viewBox={`0 0 ${width ? width : 42} ${height ? height : 42}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="mask0_4116_799" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="2" y="-1" width="39" height="39">
        <path d="M39.5 18.5L21.5 0.5L3.5 18.5L21.5 36.5L39.5 18.5Z" fill="white" stroke="white" />
      </mask>
      <g mask="url(#mask0_4116_799)">
        <mask id="mask1_4116_799" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="2" y="-1" width="39" height="39">
          <path d="M21.5 0.5L39.5 18.5L21.5 36.5L3.5 18.5L21.5 0.5Z" fill="white" stroke="#F0F2F4" />
        </mask>
        <g mask="url(#mask1_4116_799)">
          <path
            d="M38.8878 19.9559C29.2761 10.3443 13.6926 10.3443 4.081 19.9559C-5.53062 29.5675 -5.53062 45.151 4.081 54.7626C13.6926 64.3743 29.2761 64.3743 38.8878 54.7626C48.4994 45.151 48.4994 29.5675 38.8878 19.9559Z"
            stroke="currentColor"
            strokeWidth={strokeWidth ? strokeWidth : 2}
          />
          <path
            d="M31.6878 26.0303C26.0526 20.3952 16.9161 20.3952 11.2809 26.0303C5.64575 31.6655 5.64575 40.802 11.281 46.4372C16.9161 52.0724 26.0526 52.0724 31.6878 46.4372C37.323 40.802 37.323 31.6655 31.6878 26.0303Z"
            stroke="currentColor"
            strokeWidth={strokeWidth ? strokeWidth : 2}
          />
          <path
            d="M24.5034 32.1041C22.8447 30.4454 20.1553 30.4454 18.4966 32.1041C16.8379 33.7628 16.8379 36.4522 18.4966 38.1109C20.1553 39.7696 22.8447 39.7696 24.5034 38.1109C26.1621 36.4522 26.1621 33.7628 24.5034 32.1041Z"
            stroke="currentColor"
            strokeWidth={strokeWidth ? strokeWidth : 2}
          />
        </g>
      </g>
    </svg>
  );
}

export default IconWireless;

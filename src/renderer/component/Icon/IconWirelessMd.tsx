import React from "react";

type IconWirelessProps = {
  strokeWidth?: number;
};

function IconWirelessMd({ strokeWidth = 1.2 }: IconWirelessProps) {
  return (
    <svg width="26" height="24" viewBox="0 0 26 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask id="mask0_2127_8986" style={{ maskType: "luminance" }} maskUnits="userSpaceOnUse" x="0" y="-4" width="26" height="26">
        <path d="M25 9L13 -3L1 9L13 21L25 9Z" fill="white" stroke="white" />
      </mask>
      <g mask="url(#mask0_2127_8986)">
        <mask id="mask1_2127_8986" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="-5" width="26" height="26">
          <path d="M13 -4L25 8.00001L13 20L1 8.00001L13 -4Z" fill="white" stroke="#F0F2F4" />
        </mask>
        <g mask="url(#mask1_2127_8986)">
          <path
            d="M24.5782 8.97168C18.1705 2.56394 7.78145 2.56394 1.3737 8.97168C-5.03404 15.3794 -5.03405 25.7684 1.3737 32.1762C7.78145 38.5839 18.1705 38.5839 24.5782 32.1762C30.986 25.7684 30.986 15.3794 24.5782 8.97168Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            d="M19.7782 13.021C16.0214 9.26421 9.93047 9.26421 6.17367 13.021C2.41687 16.7778 2.41687 22.8688 6.17367 26.6256C9.93047 30.3824 16.0214 30.3824 19.7782 26.6256C23.535 22.8688 23.535 16.7778 19.7782 13.021Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            d="M14.9938 17.07C13.888 15.9642 12.0951 15.9642 10.9893 17.07C9.88351 18.1758 9.88351 19.9687 10.9893 21.0745C12.0951 22.1803 13.888 22.1803 14.9938 21.0745C16.0996 19.9687 16.0996 18.1758 14.9938 17.07Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </g>
      </g>
    </svg>
  );
}

export default IconWirelessMd;

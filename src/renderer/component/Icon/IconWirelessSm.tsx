import React from "react";

type IconWirelessProps = {
  strokeWidth?: number;
};

function IconWirelessSm({ strokeWidth = 1.2 }: IconWirelessProps) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id="mask0_4410_117926"
        style={{ maskType: "luminance" }}
        maskUnits="userSpaceOnUse"
        x="0"
        y="-4"
        width="22"
        height="23"
      >
        <path d="M21 7.5L11 -2.5L1 7.5L11 17.5L21 7.5Z" fill="white" stroke="white" />
      </mask>
      <g mask="url(#mask0_4410_117926)">
        <mask id="mask1_4410_117926" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="-5" width="22" height="23">
          <path d="M11 -3.3335L21 6.66651L11 16.6665L1 6.66651L11 -3.3335Z" fill="white" stroke="#F0F2F4" />
        </mask>
        <g mask="url(#mask1_4410_117926)">
          <path
            d="M20.6451 7.4763C15.3053 2.13651 6.64781 2.13651 1.30802 7.4763C-4.03177 12.8161 -4.03177 21.4736 1.30802 26.8134C6.64781 32.1532 15.3053 32.1532 20.6451 26.8134C25.9849 21.4736 25.9849 12.8161 20.6451 7.4763Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            d="M16.6451 10.8507C13.5145 7.72007 8.43866 7.72007 5.30799 10.8507C2.17733 13.9814 2.17733 19.0572 5.30799 22.1879C8.43866 25.3185 13.5145 25.3185 16.6451 22.1879C19.7758 19.0572 19.7758 13.9814 16.6451 10.8507Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
          <path
            d="M12.6607 14.2248C11.7392 13.3033 10.2452 13.3033 9.32364 14.2248C8.40213 15.1464 8.40213 16.6404 9.32364 17.5619C10.2452 18.4834 11.7392 18.4834 12.6607 17.5619C13.5822 16.6404 13.5822 15.1464 12.6607 14.2248Z"
            stroke="currentColor"
            strokeWidth={strokeWidth}
          />
        </g>
      </g>
    </svg>
  );
}

export default IconWirelessSm;

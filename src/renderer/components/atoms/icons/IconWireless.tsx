import * as React from "react";

interface IconIconWirelessProps {
  size?: "lg" | "md" | "sm";
  strokeWidth?: number;
}

function IconWireless({ size = "md", strokeWidth = 1.2 }: IconIconWirelessProps) {
  return (
    <>
      {size === "lg" ? (
        <svg width={42} height={42} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask
            id="mask0_4116_799"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="2"
            y="-1"
            width="39"
            height="39"
          >
            <path d="M39.5 18.5L21.5 0.5L3.5 18.5L21.5 36.5L39.5 18.5Z" fill="white" stroke="white" />
          </mask>
          <g mask="url(#mask0_4116_799)">
            <mask
              id="mask1_4116_799"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="2"
              y="-1"
              width="39"
              height="39"
            >
              <path d="M21.5 0.5L39.5 18.5L21.5 36.5L3.5 18.5L21.5 0.5Z" fill="white" stroke="#F0F2F4" />
            </mask>
            <g mask="url(#mask1_4116_799)">
              <path
                d="M38.8878 19.9559C29.2761 10.3443 13.6926 10.3443 4.081 19.9559C-5.53062 29.5675 -5.53062 45.151 4.081 54.7626C13.6926 64.3743 29.2761 64.3743 38.8878 54.7626C48.4994 45.151 48.4994 29.5675 38.8878 19.9559Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <path
                d="M31.6878 26.0303C26.0526 20.3952 16.9161 20.3952 11.2809 26.0303C5.64575 31.6655 5.64575 40.802 11.281 46.4372C16.9161 52.0724 26.0526 52.0724 31.6878 46.4372C37.323 40.802 37.323 31.6655 31.6878 26.0303Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
              <path
                d="M24.5034 32.1041C22.8447 30.4454 20.1553 30.4454 18.4966 32.1041C16.8379 33.7628 16.8379 36.4522 18.4966 38.1109C20.1553 39.7696 22.8447 39.7696 24.5034 38.1109C26.1621 36.4522 26.1621 33.7628 24.5034 32.1041Z"
                stroke="currentColor"
                strokeWidth={strokeWidth}
              />
            </g>
          </g>
        </svg>
      ) : (
        ""
      )}
      {size === "md" ? (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask
            id="mask0_2127_8986"
            style={{ maskType: "luminance" }}
            maskUnits="userSpaceOnUse"
            x="0"
            y="-4"
            width="26"
            height="26"
          >
            <path d="M25 9L13 -3L1 9L13 21L25 9Z" fill="white" stroke="white" />
          </mask>
          <g mask="url(#mask0_2127_8986)">
            <mask
              id="mask1_2127_8986"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="-5"
              width="26"
              height="26"
            >
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
      ) : (
        ""
      )}
      {size === "sm" ? (
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
            <mask
              id="mask1_4410_117926"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="-5"
              width="22"
              height="23"
            >
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
      ) : (
        ""
      )}
    </>
  );
}

export default IconWireless;

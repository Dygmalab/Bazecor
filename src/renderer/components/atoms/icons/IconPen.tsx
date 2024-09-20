import * as React from "react";

interface IconProps {
  size?: "xs" | "sm" | "md";
}

function IconPen({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M15.1,5l1.4-1.3c0.4-0.4,1-0.4,1.4,0L20.3,6c0.4,0.4,0.4,1,0,1.4l-1.4,1.3L15.1,5z"
            fill="none"
            stroke="currentColor"
            strokeMiterlimit={10}
          />
          <path d="M17.3,10.4L6.7,21H3v-3.8L13.6,6.6" fill="none" stroke="currentColor" strokeMiterlimit={10} />
          <path d="M23.2,15.4" fill="none" stroke="currentColor" strokeMiterlimit={10} />
          <path d="M8.4,1" fill="none" stroke="currentColor" strokeMiterlimit={10} />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_690_11" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="20" height="20">
            <path d="M0 20V0H5.83926L15.3476 9.50836L16.3459 8.51007L7.83579 0H20V20H0Z" fill="white" />
          </mask>
          <g mask="url(#mask0_690_11)">
            <path
              d="M3 14.5821L12.7083 4.87377L15.1262 7.29167L5.41789 17H3V14.5821ZM15.8333 6.58456L13.4154 4.16667L14.1393 3.44281C14.2695 3.31263 14.4805 3.31263 14.6107 3.44281L16.5572 5.3893C16.6874 5.51947 16.6874 5.73053 16.5572 5.8607L15.8333 6.58456Z"
              stroke="currentColor"
            />
          </g>
        </svg>
      ) : (
        ""
      )}
      {size === "xs" ? (
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_690_11" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="0" width="16" height="16">
            <path d="M0 16V0H4.6714L12.2781 7.60669L13.0767 6.80806L6.26864 0H16V16H0Z" fill="white" />
          </mask>
          <g mask="url(#mask0_690_11)">
            <path
              d="M2.4 11.6657L10.1667 3.89902L12.101 5.83333L4.33431 13.6H2.4V11.6657ZM12.6667 5.26765L10.7324 3.33333L11.3114 2.75425C11.4156 2.65011 11.5844 2.65011 11.6886 2.75425L13.2458 4.31144C13.3499 4.41558 13.3499 4.58442 13.2458 4.68856L12.6667 5.26765Z"
              stroke="currentColor"
              strokeWidth="0.8"
            />
          </g>
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconPen;

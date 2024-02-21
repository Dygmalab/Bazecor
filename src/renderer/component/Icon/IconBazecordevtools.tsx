import * as React from "react";

function IconBazecordevtools({
  width = 42,
  height = 42,
  strokeWidth = 2,
}: {
  width: number;
  height: number;
  strokeWidth: number;
}) {
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} xmlns="http://www.w3.org/2000/svg">
      <g clipPath="url(#clip0_234_5188)">
        <path
          d="M2.47487 5.3033C1.59197 7.31767 1.975 9.75318 3.62396 11.4021C5.27293 13.0511 7.70843 13.4341 9.7228 12.5512L18.3848 21.2132C18.7753 21.6037 19.4085 21.6037 19.799 21.2132L21.2132 19.799C21.6037 19.4085 21.6037 18.7753 21.2132 18.3848L12.5512 9.7228C13.4341 7.70844 13.0511 5.27293 11.4021 3.62397C9.75318 1.975 7.31767 1.59197 5.3033 2.47487L8.83883 6.01041L6.01041 8.83884L2.47487 5.3033Z"
          stroke="currentColor"
          strokeWidth={strokeWidth}
        />
      </g>
      <defs>
        <clipPath id="clip0_234_5188">
          <rect width={width} height={height} fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
}

export default IconBazecordevtools;

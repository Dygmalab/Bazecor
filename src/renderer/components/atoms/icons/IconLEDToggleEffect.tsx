import * as React from "react";

interface IconProps {
  size?: "md" | "sm";
}

function IconLEDToggleEffect({ size = "md" }: IconProps) {
  return (
    <>
      {size === "md" ? (
        <svg width={24} height={24} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 17.25 5.25 L 6.75 5.25 C 3.027344 5.25 0 8.277344 0 12 C 0 15.722656 3.027344 18.75 6.75 18.75 L 17.25 18.75 C 20.972656 18.75 24 15.722656 24 12 C 24 8.277344 20.972656 5.25 17.25 5.25 Z M 17.25 17.25 C 14.351562 17.25 12 14.898438 12 12 C 12 9.101562 14.351562 6.75 17.25 6.75 C 20.148438 6.75 22.5 9.101562 22.5 12 C 22.496094 14.898438 20.148438 17.246094 17.25 17.25 Z M 17.25 17.25"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} xmlns="http://www.w3.org/2000/svg">
          <path
            d="M 14.375 4.375 L 5.625 4.375 C 2.523438 4.375 0 6.898438 0 10 C 0 13.101562 2.523438 15.625 5.625 15.625 L 14.375 15.625 C 17.476562 15.625 20 13.101562 20 10 C 20 6.898438 17.476562 4.375 14.375 4.375 Z M 14.375 14.375 C 11.957031 14.375 10 12.417969 10 10 C 10 7.582031 11.957031 5.625 14.375 5.625 C 16.792969 5.625 18.75 7.582031 18.75 10 C 18.746094 12.414062 16.789062 14.371094 14.375 14.375 Z M 14.375 14.375"
            fillRule="evenodd"
            clipRule="evenodd"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconLEDToggleEffect;

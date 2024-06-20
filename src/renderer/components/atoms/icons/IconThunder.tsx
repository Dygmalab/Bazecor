import * as React from "react";

interface IconProps {
  size?: "lg" | "md" | "sm";
}

function IconThunder({ size = "md" }: IconProps) {
  return (
    <>
      {size === "lg" ? (
        <svg width={42} height={42} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M16.75 3.142a1 1 0 01.934-.642h10.823a1 1 0 01.867 1.498L23.05 15H31.5a1 1 0 01.751 1.66l-19.756 22.5a1 1 0 01-1.69-1.006l5.491-14.904H10.5a1 1 0 01-.934-1.358l7.184-18.75zM18.372 4.5l-6.418 16.75h5.776a1 1 0 01.939 1.346L14.54 33.798 29.291 17h-7.969a1 1 0 01-.867-1.498L26.78 4.5h-8.407z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "md" ? (
        <svg width={24} height={24} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M6 12.714L10.105 2h6.184l-4.105 7.143H18L6.71 22l3.422-9.286H6z"
            stroke="currentColor"
            strokeWidth={1.2}
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M5 10.595l3.421-8.928h5.154l-3.421 5.952H15L5.592 18.333l2.851-7.738H5z"
            stroke="currentColor"
            strokeLinejoin="round"
          />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconThunder;

import * as React from "react";

interface IconProps {
  size?: "lg" | "md" | "sm";
}

function IconRobot({ size = "md" }: IconProps) {
  return (
    <>
      {size === "lg" ? (
        <svg width={42} height={42} viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 15.75h1.75V28H0V15.75z" fill="currentColor" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M7.25 9v24h27.5V9H7.25zm-1-2a1 1 0 00-1 1v26a1 1 0 001 1h29.5a1 1 0 001-1V8a1 1 0 00-1-1H6.25z"
            fill="currentColor"
          />
          <path
            d="M40.25 15.75H42V28h-1.75V15.75zM14 24.5h5.25v1.75H14V24.5zM22.75 24.5H28v1.75h-5.25V24.5zM19.25 16.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0zM28 16.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z"
            fill="currentColor"
          />
        </svg>
      ) : (
        ""
      )}
      {size === "md" ? (
        <svg width={24} height={24} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0 9h1v7H0z" />
          <mask id="maskRobotIcon" fill="#fff">
            <rect x={3} y={4} width={18} height={16} rx={1} />
          </mask>
          <rect x={3} y={4} width={18} height={16} rx={1} stroke="currentColor" strokeWidth={2.4} mask="url(#maskRobotIcon)" />
          <path fill="currentColor" d="M23 9h1v7h-1zM8 14h3v1H8zM13 14h3v1h-3z" />
          <circle cx={9.5} cy={9.5} r={1.5} fill="currentColor" />
          <circle cx={14.5} cy={9.5} r={1.5} fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
      {size === "sm" ? (
        <svg width={20} height={20} fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fill="currentColor" d="M0 7.5h.833v5.833H0z" />
          <mask id="prefix_RobotSm_a" fill="#fff">
            <rect x={2.5} y={3.333} width={15} height={13.333} rx={0.833} />
          </mask>
          <rect
            x={2.5}
            y={3.333}
            width={15}
            height={13.333}
            rx={0.833}
            stroke="currentColor"
            strokeWidth={2.033}
            mask="url(#prefix_RobotSm_a)"
          />
          <path fill="currentColor" d="M19.167 7.5H20v5.833h-.833zM6.667 11.667h2.5v.833h-2.5zM10.833 11.667h2.5v.833h-2.5z" />
          <circle cx={7.917} cy={7.917} r={1.25} fill="currentColor" />
          <circle cx={12.083} cy={7.917} r={1.25} fill="currentColor" />
        </svg>
      ) : (
        ""
      )}
    </>
  );
}

export default IconRobot;

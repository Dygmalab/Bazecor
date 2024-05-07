import React from "react";

interface CircleLoaderProps {
  radius?: number;
  percentage?: number;
  active?: boolean;
}

const CircleLoader = ({ radius = 24, percentage = 0, active = false }: CircleLoaderProps) => {
  const circumference = 2 * Math.PI * radius;
  const strokeDashOffset = circumference - (percentage / 100) * circumference;
  return (
    <div className="block">
      <svg className={`circle-loader ${active ? "active" : ""}`} width={radius * 2 + 2} height={radius * 2 + 2}>
        <circle
          className="circle-loader-progress fill-none stroke-purple-300 dark:stroke-green-200 stroke-2 origin-center -rotate-90"
          cx={radius + 1}
          cy={radius + 1}
          r={radius}
          style={{
            strokeLinecap: "round",
            strokeDasharray: circumference,
            strokeDashoffset: strokeDashOffset,
            transition: "stroke-dashoffset 250ms ease-in-out",
          }}
        />
      </svg>
    </div>
  );
};

export default CircleLoader;

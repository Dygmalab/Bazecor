import React from "react";
import Styled from "styled-components";

const Style = Styled.div`
.circle-loader {
    display: block;
}
.circle-loader-background {
    fill: none;
    stroke: #e6e6e6;
    stroke-width: 2px;
}
.circle-loader-progress {
    fill: none;
    stroke: ${({ theme }) => theme.styles.circleLoader.strokeColor};
    stroke-width: 2px;
    stroke-linecap: round;
    transform: rotate(-90deg);
    transform-origin: center;
    transition: stroke-dashoffset 250ms ease-in-out;
}
`;

const CircleLoader = ({ radius, percentage, active }) => {
  console.log("percentage :", percentage);
  const circumference = 2 * Math.PI * radius;
  const strokeDashOffset = circumference - (percentage / 100) * circumference;
  return (
    <Style>
      <svg className={`circle-loader ${active ? "active" : ""}`} width={radius * 2 + 2} height={radius * 2 + 2}>
        {/* <circle className="circle-loader-background" cx={radius} cy={radius} r={radius} transform="50% 50%" /> */}
        <circle
          className="circle-loader-progress"
          cx={radius + 1}
          cy={radius + 1}
          r={radius}
          style={{ strokeDasharray: circumference, strokeDashoffset: strokeDashOffset }}
        />
      </svg>
    </Style>
  );
};

export default CircleLoader;

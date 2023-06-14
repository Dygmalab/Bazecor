import * as React from "react";

function IconLoader(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{
        background: "none",
        display: "block",
        shapeRendering: "auto",
        animationPlayState: "running",
        animationDelay: "0s"
      }}
      width="21px"
      height="21px"
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
      {...props}
    >
      <circle
        cx="50"
        cy="50"
        fill="none"
        stroke="currentColor"
        strokeWidth="10"
        r="35"
        strokeDasharray="164.93361431346415 56.97787143782138"
        style={{ animationPlayState: "running", animationDelay: "0s" }}
      >
        <animateTransform
          attributeName="transform"
          type="rotate"
          repeatCount="indefinite"
          dur="1s"
          values="0 50 50;360 50 50"
          keyTimes="0;1"
          style={{ animationPlayState: "running", animationDelay: "0s" }}
        ></animateTransform>
      </circle>
    </svg>
  );
}

export default IconLoader;

import * as React from "react";

function IconRefresh(props) {
  const maskHash = `${(Math.random() + 1).toString(36).substring(7)}-Refresh`;
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <mask
        id={`mask0_4032_256833${maskHash}`}
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="1"
        y="2"
        width="22"
        height="21"
      >
        <path d="M18 10H22V3H2V22H22V12H18V10Z" fill="white" stroke="currentColor" />
      </mask>
      <g mask={`url(#mask0_4032_256833${maskHash})`}>
        <path
          d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C14.3894 4 16.5341 5.04751 18 6.70835"
          stroke="currentColor"
          strokeWidth="1.2"
        />
      </g>
      <path d="M20.4 9.4H15.4485L20.4 4.44853V9.4Z" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

export default IconRefresh;

import React from "react";

interface EnterISOProps {
  onClick: () => void;
}
const EnterISO = ({ onClick }: EnterISOProps) => (
  <>
    <g filter="url(#filter0_d_2211_181319)">
      <path
        d="M0 3a3 3 0 013-3h38a3 3 0 013 3v60a3 3 0 01-3 3H14a3 3 0 01-3-3V33a3 3 0 00-3-3H3a3 3 0 01-3-3V3z"
        className="baseKey KeyPositionEnter"
        onClick={onClick}
      />
    </g>
    <path
      d="M0 3a3 3 0 013-3h38a3 3 0 013 3v60a3 3 0 01-3 3H14a3 3 0 01-3-3V33a3 3 0 00-3-3H3a3 3 0 01-3-3V3z"
      fill="url(#paint_gradient)"
      fillOpacity={0.1}
      className="shapeKey KeyPositionEnter"
      onClick={onClick}
    />
  </>
);

export default EnterISO;

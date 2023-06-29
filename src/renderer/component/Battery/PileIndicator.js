import React, { useState, useEffect } from "react";

import Styled from "styled-components";

const Style = Styled.div`
.status--default {
    --color-status: ${({ theme }) => theme.colors.gray200};
}
.size--sm {
    background-color: ${({ theme }) => theme.colors.gray800};
    padding: 4px;
    border-radius: 3px;
    .battery-item--container {
        display: flex;
        grid-gap: 3px;
        align-items: center;
        .battery-indicator--side {
            color: ${({ theme }) => theme.colors.gray400};
            font-size: 0.5rem;
            font-weight: 700;
            text-transform: uppercase;
        }
    }
    .battery-indicator--shape {
        position: relative;
        border-width: 1px;
        border-style: solid;
        border-color: var(--color-status);
        width: 20px;
        height: 8px;
        padding: 1px; 
        display: block;
        &:after {
            content: "";
            position: absolute;
            width: 1px;
            height: 4px;
            background-color: var(--color-status);
            right: -3px;
            top: 50%;
            transform: translate3D(0, -50%, 0);
        }
    }
    .battery-indicator--level {
        background-color: var(--color-status);
        height: 100%;
    }
}

`;

const PileIndicator = ({ batteryLevel, isCharging }) => {
  const [batteryWidth, setBatteryWidth] = useState(0);

  useEffect(() => {
    if (!isCharging) {
      if (batteryLevel < 5) {
        setBatteryWidth(1);
      } else {
        setBatteryWidth((16 * batteryLevel) / 100);
      }
    }
  }, [batteryLevel]);

  return (
    <svg className="pileIndicator" width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      {isCharging ? (
        <>
          <mask id="mask0_1956_10095" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="4" width="20" height="8">
            <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          </mask>
          <g mask="url(#mask0_1956_10095)">
            <path d="M17 5H14V2.5H24V13H12L17 5Z" fill="currentColor" />
          </g>
          <mask id="mask1_1956_10095" style={{ maskType: "alpha" }} maskUnits="userSpaceOnUse" x="0" y="4" width="20" height="8">
            <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          </mask>
          <g mask="url(#mask1_1956_10095)">
            <path d="M3 9.5L8 2H-2V13H6V9.5H3Z" fill="currentColor" />
          </g>
        </>
      ) : (
        ""
      )}
      <rect x="21" y="6" width="1" height="4" fill="currentColor" />
      {isCharging ? (
        <path d="M7 8.45833L11 2.5V7.08333H13L9 13.5V8.45833H7Z" fill="currentColor" stroke="currentColor" />
      ) : (
        <>
          <rect x="0.5" y="4.5" width="19" height="7" stroke="currentColor" />
          <rect x="2" y="6" width={batteryWidth} height="4" fill="currentColor" />
        </>
      )}
    </svg>
  );
};

export default PileIndicator;

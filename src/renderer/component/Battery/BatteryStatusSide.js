import React, { useState, useEffect } from "react";

import Styled from "styled-components";

import { PileIndicator } from "../Battery";

const Style = Styled.div`
.status--default {
    --color-status: ${({ theme }) => theme.colors.gray200};
}
.status--warning {
    --color-status: ${({ theme }) => theme.colors.brandWarning};
}
.status--critical {
    --color-status: ${({ theme }) => theme.colors.brandPrimary};
}
.status--charging {
    --color-status: ${({ theme }) => theme.colors.purple200};
}
.size--sm {
    background-color: ${({ theme }) => theme.colors.gray800};
    padding: 4px;
    border-radius: 3px;
    .battery-item--container {
        display: flex;
        grid-gap: 5px;
        align-items: center;
        color: var(--color-status);
        .battery-indicator--side {
            color: ${({ theme }) => theme.colors.gray400};
            font-size: 0.5rem;
            font-weight: 700;
            text-transform: uppercase;
        }
    }

}


`;

const BatteryStatusSide = ({ side, level, size, isSavingMode, isCharging }) => {
  const [loading, setLoading] = useState(true);
  const [sideFirstLetter, setSideFirstLetter] = useState("");
  const [sideStatus, setSideStatus] = useState("default");

  useEffect(() => {
    if (side) {
      setLoading(false);
      setSideFirstLetter(side.charAt(0));
    }
  }, []);

  useEffect(() => {
    if (level > 10 && level < 20 && !isCharging) {
      setSideStatus("warning");
    }
    if (level < 10 && !isCharging) {
      setSideStatus("critical");
    }
  }, [level]);

  if (loading) return <div></div>;
  return (
    <Style>
      <div
        className={`battery-indicator--item size--${size} item--${side} status--${sideStatus} ${isSavingMode && "isSavingMode"} ${
          isCharging && "status--charging"
        }`}
      >
        <div className="battery-item--container">
          {size == "sm" ? <div className="battery-indicator--side">{sideFirstLetter}</div> : ""}
          {size == "sm" ? <PileIndicator level={level} isCharging={isCharging} /> : ""}
        </div>
      </div>
    </Style>
  );
};

export default BatteryStatusSide;

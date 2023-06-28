import React, { useState, useEffect } from "react";

import Styled from "styled-components";

import { PileIndicator, DefyBatteryIndicator } from "../Battery";

const Style = Styled.div`
.status--default {
    --color-status: ${({ theme }) => theme.colors.gray200};
}
.status--saving,
.status--warning  {
    --color-status: ${({ theme }) => theme.colors.brandWarning};
}
.status--critical {
    --color-status: ${({ theme }) => theme.colors.brandPrimary};
}
.status--charging {
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
}
.size--sm {
    padding: 4px;
    border-radius: 3px;
    background-color: ${({ theme }) => theme.styles.batteryIndicator.pileBackgroundColor};
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
    &.status--saving {
        background-color: ${({ theme }) => theme.styles.batteryIndicator.pileBackgroundSavingMode};
    }
    .pileIndicator {
      max-width: 100%;
    }
}
.size--lg {
  --color-stroke: ${({ theme }) => theme.styles.batteryIndicator.strokeShapeColor};
  .shapeIndicator {
    opacity: 0.1;
  }
  &.status--default {
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
    .shapeIndicator {
      opacity: 0;
    }
  }
  &.status--saving {
    --color-status: ${({ theme }) => theme.colors.brandWarning};
    --color-stroke: ${({ theme }) => theme.colors.brandWarning};
    .shapeIndicator {
      opacity: 0.25;
    }
  }
  &.status--critical:not(.status--saving) {
    .shapeIndicator {
      opacity: 0.2;
    }
  }
}
@media screen and (max-width: 999px) {
  .size--sm {
    .battery-item--container {
        .battery-indicator--side {
            display: none;
        }
    }
  }
}
@media screen and (max-height: 870px) {
  .size--sm {
    .battery-item--container {
        .battery-indicator--side {
            display: none;
        }
    }
  }
}

`;

const BatteryStatusSide = ({ side, batteryLevel, isSavingMode, isCharging, size }) => {
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
    if (batteryLevel > 10 && batteryLevel < 20 && !isCharging && !isSavingMode) {
      setSideStatus("warning");
    }
    if (batteryLevel < 10 && !isCharging && !isSavingMode) {
      setSideStatus("critical");
    }
  }, [size, batteryLevel, isCharging, isSavingMode]);

  if (loading) return <div></div>;
  return (
    <Style>
      <div
        className={`battery-indicator--item size--${size} item--${side} status--${sideStatus} ${
          isSavingMode && "status--saving"
        } ${isCharging && "status--charging"}`}
      >
        <div className="battery-item--container">
          {size == "sm" ? <div className="battery-indicator--side">{sideFirstLetter}</div> : ""}
          {size == "sm" ? <PileIndicator batteryLevel={batteryLevel} isCharging={isCharging} /> : ""}
          {size == "lg" ? <DefyBatteryIndicator side={side} batteryLevel={batteryLevel} isCharging={isCharging} /> : ""}
        </div>
      </div>
    </Style>
  );
};

export default BatteryStatusSide;

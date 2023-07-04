import React, { useState, useEffect } from "react";

import Styled from "styled-components";

import { PileIndicator, DefyBatteryIndicator } from "../Battery";

const Style = Styled.div`
.status--default,
.status--disconnected {
    --color-status: ${({ theme }) => theme.colors.gray200};
}
.status--saving,
.status--fault, 
.status--warning  {
    --color-status: ${({ theme }) => theme.colors.brandWarning};
}
.status--critical,
.status--fatal-error {
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
    &.status--saving,
    &.status--fault {
        background-color: ${({ theme }) => theme.styles.batteryIndicator.pileBackgroundSavingMode};
    }
    &.status--fatal-error {
      background-color: ${({ theme }) => theme.styles.batteryIndicator.pileBackgroundFatalError};
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
  .shapeFill {
    opacity: ${({ theme }) => theme.styles.batteryIndicator.fillShapeOpacity};
  }
  &.status--default {
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
    .shapeIndicator {
      opacity: 0;
    }
  }
  &.status--disconnected,
  &.status--disconnected.status--saving {
    --color-stroke: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorDisconnectedColor};
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorDisconnectedColor};
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
  &.status--charging,
  &.status--charging.status--saving {
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
    --color-stroke: ${({ theme }) => theme.styles.batteryIndicator.strokeShapeColor};
    .lightningbattery {
      color: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
    }
    .shapeIndicator {
      opacity: 0.1;
    }
  }
  &.status--charging.status--charging-done {
    .lightningbattery {
      color: ${({ theme }) => theme.colors.gray25};
    }
  }
  &.status--fault {
    --color-stroke: ${({ theme }) => theme.colors.brandWarning};
    .shapeIndicator {
      opacity: 0.1;
    }
  }
  &.status--fatal-error,
  &.status--fatal-error.status--saving {
    --color-status: ${({ theme }) => theme.colors.brandPrimary};
    --color-stroke: ${({ theme }) => theme.colors.brandPrimary};
    .shapeIndicator {
      opacity: ${({ theme }) => theme.styles.batteryIndicator.shapeIndicatorOpacity};
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

const BatteryStatusSide = ({ side, batteryLevel, isSavingMode, isCharging, batteryStatus, size }) => {
  const [loading, setLoading] = useState(true);
  const [sideFirstLetter, setSideFirstLetter] = useState("");
  const [sideStatus, setSideStatus] = useState("status--default");

  useEffect(() => {
    if (side) {
      setLoading(false);
      setSideFirstLetter(side.charAt(0));
    }
  }, []);

  useEffect(() => {
    console.log("batteryStatus", batteryStatus);
    switch (batteryStatus) {
      case 0:
        setSideStatus("status--default");
        break;
      case 1:
        setSideStatus("status--charging");
        break;
      case 2:
        setSideStatus("status--charging status--charging-done");
        break;
      case 3:
        setSideStatus("status--fault");
        break;
      case 4:
        setSideStatus("status--disconnected");
        break;
      default:
        setSideStatus("status--fatal-error");
    }
    if (batteryLevel > 10 && batteryLevel < 20 && !isSavingMode && batteryStatus == 0) {
      setSideStatus("status--warning");
    }
    if (batteryLevel < 10 && !isSavingMode && batteryStatus == 0) {
      setSideStatus("status--critical");
    }
  }, [size, batteryLevel, isCharging, batteryStatus, isSavingMode]);

  if (loading) return <div></div>;
  return (
    <Style>
      <div className={`battery-indicator--item size--${size} item--${side} ${sideStatus} ${isSavingMode && "status--saving"}`}>
        <div className="battery-item--container">
          {size == "sm" ? <div className="battery-indicator--side">{sideFirstLetter}</div> : ""}
          {size == "sm" ? (
            <PileIndicator batteryLevel={batteryLevel} isCharging={isCharging} batteryStatus={batteryStatus} />
          ) : (
            ""
          )}
          {size == "lg" ? (
            <DefyBatteryIndicator side={side} batteryLevel={batteryLevel} batteryStatus={batteryStatus} isCharging={isCharging} />
          ) : (
            ""
          )}
        </div>
      </div>
    </Style>
  );
};

export default BatteryStatusSide;

import React, { useState, useEffect } from "react";
import Styled from "styled-components";

import DefyBatteryIndicatorLeft from "@Renderer/component/Battery/DefyBatteryIndicatorLeft";
import DefyBatteryIndicatorRight from "@Renderer/component/Battery/DefyBatteryIndicatorRight";

import i18n from "../../i18n";

const Style = Styled.div`
.levelIndicator {
    transform-origin: bottom left;
    transform: rotate(180deg);
    fill: var(--color-status);
}
.batterySide {
    position: relative;
}
.batterySide--percentage {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    width: 100%;
    font-weight: 700;
    letter-spacing: -0.025em;
    text-align: center;
    font-size: 1.25rem;
    color: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorPercentageColor};
    text-align: center;
}
.shapeStroke {
  stroke: var(--color-stroke);
}
.shapeFill {
  fill: ${({ theme }) => theme.styles.batteryIndicator.largeIndicatorFillColor};
}
.shapeIndicator {
  fill: var(--color-status);
}
.alertMessage {
  padding: 0.3rem 0.25rem;
  font-size: 0.6875rem;
  text-align: center;
  font-weight: 600;
  border-radius: 4px;
  margin-top: 8px;
  line-height: 1rem;
  letter-spacing: -0.02rem;
  &.alert-warning {
    color: ${({ theme }) => theme.styles.batteryIndicator.alertWarningText};
    background-color: ${({ theme }) => theme.styles.batteryIndicator.alertWarningBackground};
  }
  &.alert-fatal-error {
    color: ${({ theme }) => theme.styles.batteryIndicator.alertErrorText};
    background-color: ${({ theme }) => theme.styles.batteryIndicator.alertErrorBackground};
  }
  &.alert-disconnected {
    color: ${({ theme }) => theme.styles.batteryIndicator.alertDisconnectedText};
    background-color: ${({ theme }) => theme.styles.batteryIndicator.alertDisconnectedBackground};
  }
}
`;
interface DefyBatteryIndicatorProps {
  side: "left" | "right";
  batteryLevel: number;
  batteryStatus: number;
}
const DefyBatteryIndicator = ({ side, batteryLevel, batteryStatus }: DefyBatteryIndicatorProps) => {
  const [batteryHeight, setBatteryHeight] = useState(0);

  useEffect(() => {
    switch (batteryStatus) {
      case 0:
        if (batteryLevel > 0 && batteryLevel < 5) {
          setBatteryHeight(2);
        } else {
          setBatteryHeight((115 * batteryLevel) / 100);
        }
        break;
      case 1:
        setBatteryHeight(0);
        break;
      case 2:
        setBatteryHeight(115);
        break;
      case 3:
        setBatteryHeight(0);
        break;
      case 4:
        setBatteryHeight(0);
        break;
      default:
        setBatteryHeight(0);
    }
  }, [batteryLevel, batteryStatus]);

  return (
    <Style>
      <div className="batterySideWrapper">
        <div className="batterySide">
          {side === "left" ? <DefyBatteryIndicatorLeft batteryStatus={batteryStatus} batteryHeight={batteryHeight} /> : ""}
          {side === "right" ? <DefyBatteryIndicatorRight batteryStatus={batteryStatus} batteryHeight={batteryHeight} /> : ""}
          {batteryStatus === 0 || batteryStatus === 1 ? <div className="batterySide--percentage">{batteryLevel}%</div> : ""}
        </div>
        {batteryStatus === 3 ? (
          <div className="alertMessage alert-warning">{i18n.wireless.batteryPreferences.batteryErrorReading}</div>
        ) : (
          ""
        )}
        {batteryStatus === 4 ? (
          <div className="alertMessage alert-disconnected">{i18n.wireless.batteryPreferences.batteryDisconnected}</div>
        ) : (
          ""
        )}
        {batteryStatus === 255 ? (
          <div className="alertMessage alert-fatal-error">{i18n.wireless.batteryPreferences.batteryFatalError}</div>
        ) : (
          ""
        )}
      </div>
    </Style>
  );
};

export default DefyBatteryIndicator;

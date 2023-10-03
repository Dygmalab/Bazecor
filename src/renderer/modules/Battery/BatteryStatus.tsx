import React, { useEffect, useCallback, useRef, useState } from "react";

import Styled from "styled-components";

// Custom components
import Title from "@Renderer/component/Title";
import { ButtonConfig } from "@Renderer/component/Button";
import { BatteryStatusSide, SavingModeIndicator } from "@Renderer/component/Battery";

// Assets
import { IconBattery, IconRefresh } from "@Renderer/component/Icon";

import { useDevice } from "@Renderer/DeviceContext";
import i18n from "../../i18n";

const Style = Styled.div`
.battery-indicator--wrapper {
  padding-top: 8px;
  position: relative;
  z-index: 2;
  &:before {
    position: absolute;
    top: 0;
    height: 12px;
    width: 100%;
    background: transparent;
    content: "";
  }
}
.battery-indicator--container {
  display: flex;
  grid-gap: 3px;
  > div {
    flex: 1;
  }
}
.battery-defy--indicator {
  display: flex;
  grid-gap: 8px;
  position: relative;
}
.dropdown-menu--battery {
  opacity: 0;
  visibility: hidden;
  position: absolute;
  bottom: 100%;
  top: auto;
  display: flex;
  transition: 300ms ease all;
  background-color: ${({ theme }) => theme.styles.batteryIndicator.panelBackgroundColor};
  padding: 8px 16px 24px 16px;
  width: auto;
  z-index: 1101;
  h4 {
    color: ${({ theme }) => theme.styles.batteryIndicator.titleColor};
    .hasIcon svg {
      vertical-align: -0.25em;
    }
  }
}
.battery-indicator--wrapper:hover {
  .dropdown-menu--battery {
    bottom: 100%;
    opacity: 1;
    visibility: visible;
  }
}
.batterySettingItem {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  .custom-switch {
    padding-left: 0;
    margin-right: 24px;
    height: 32px;
    margin-top: -8px;
  }
}
.batterySettingLabel {
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray200};
  margin: 0;
}
.button-config[data-animate='1'] svg{
  animation: rotateUpdateIcon 500ms 1;
}
@keyframes rotateUpdateIcon {
  0% {
    transform: scale(1) rotate(0deg);
  }
  50% {
    transform: scale(0.8) rotate(180deg);
  }
  100% {
    transform: scale(1) rotate(360deg);
  }
}
@media screen and (max-height: 870px) {
  .battery-indicator--container {
    > div {
      flex: 0 0 50%;
    }
  }
}
`;
interface BatteryStatusProps {
  disable: boolean;
}
const BatteryStatus = ({ disable }: BatteryStatusProps) => {
  const [bLeft, setbLeft] = useState(100);
  const [bRight, setbRight] = useState(100);
  const [sLeft, setsLeft] = useState(0);
  const [sRight, setsRight] = useState(0);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(0);
  const target = useRef(null);
  const [state] = useDevice();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIdAnimateRef = useRef<NodeJS.Timeout | null>(null);

  const getBatteryStatus = useCallback(async () => {
    if (state.currentDevice) {
      const left = await state.currentDevice.command("wireless.battery.left.level");
      const right = await state.currentDevice.command("wireless.battery.right.level");
      const leftStatus = await state.currentDevice.command("wireless.battery.left.status");
      const rightStatus = await state.currentDevice.command("wireless.battery.right.status");
      const savingMode = await state.currentDevice.command("wireless.battery.savingMode");
      setbLeft(parseInt(left, 10));
      setbRight(parseInt(right, 10));
      setsLeft(leftStatus.includes("0x") ? 255 : parseInt(leftStatus, 10));
      setsRight(rightStatus.includes("0x") ? 255 : parseInt(rightStatus, 10));
      setIsSavingMode(parseInt(savingMode, 10) > 0);
    }

    // console.log("L Status internal: ", sLeft);
    // console.log("L Status focus: ", leftStatus);
    // console.log("L Level internal: ", bLeft);

    // console.log("R Status: ", sRight);
    // console.log("R Status focus: ", rightStatus);
  }, []);

  // async function getBatteryStatus() {
  //   const focus = new Focus();
  //   const left = await focus.command("wireless.battery.left.level");
  //   const right = await focus.command("wireless.battery.right.level");
  //   const leftStatus = await focus.command("wireless.battery.left.status");
  //   const rightStatus = await focus.command("wireless.battery.right.status");
  //   const savingMode = await focus.command("wireless.battery.savingMode");
  //   setbLeft(parseInt(left, 10));
  //   setbRight(parseInt(right, 10));
  //   setsLeft(leftStatus.includes("0x") ? 255 : parseInt(leftStatus, 10));
  //   setsRight(rightStatus.includes("0x") ? 255 : parseInt(rightStatus, 10));
  //   setIsSavingMode(parseInt(savingMode, 10) > 0);

  //   console.log("L Status internal: ", sLeft);
  //   console.log("L Status focus: ", leftStatus);
  //   console.log("L Level internal: ", bLeft);

  //   console.log("R Status: ", sRight);
  //   console.log("R Status focus: ", rightStatus);
  // }

  if (!disable) {
    getBatteryStatus();
  }

  useEffect(() => {
    if (!disable) {
      intervalIdRef.current = setInterval(() => {
        getBatteryStatus();
      }, 60 * 1000);
    }
    // Return a cleanup function to clear the interval
    return () => {
      if (intervalIdRef.current) {
        clearInterval(intervalIdRef.current);
      }
    };
  }, [disable, getBatteryStatus]);

  useEffect(() => {
    intervalIdAnimateRef.current = setInterval(() => {
      setAnimateIcon(0);
    }, 1100);

    return () => {
      if (intervalIdAnimateRef.current) {
        clearInterval(intervalIdAnimateRef.current);
      }
    };
  }, [animateIcon]);

  const forceRetrieveBattery = async () => {
    // const { disable } = props;
    if (disable) return;
    if (state.currentDevice) {
      await state.cururentDevice.command("wireless.battery.forceRead");
    }
    await getBatteryStatus();
    setAnimateIcon(1);
  };

  return (
    <Style>
      <div className="battery-indicator--wrapper" ref={target}>
        <div className="battery-indicator--container">
          <BatteryStatusSide side="left" batteryLevel={bLeft} isSavingMode={isSavingMode} batteryStatus={sLeft} size="sm" />
          <BatteryStatusSide side="right" batteryLevel={bRight} isSavingMode={isSavingMode} batteryStatus={sRight} size="sm" />
        </div>
        <div className="dropdown-menu dropdown-menu--battery">
          <div className="dropdown-menu__inner">
            <Title text={i18n.wireless.batteryPreferences.battery} headingLevel={4} svgICO={<IconBattery />} />
            <div className="battery-defy--indicator">
              <BatteryStatusSide side="left" batteryLevel={bLeft} isSavingMode={isSavingMode} batteryStatus={sLeft} size="lg" />
              <BatteryStatusSide
                side="right"
                batteryLevel={bRight}
                isSavingMode={isSavingMode}
                batteryStatus={sRight}
                size="lg"
              />
              <SavingModeIndicator isSavingMode={isSavingMode} />
            </div>
            <div className="batterySettingItem batteryUpdateStatus">
              <div className="batterySettingLabel">Force read Battery level</div>
              <ButtonConfig
                onClick={() => {
                  forceRetrieveBattery();
                }}
                icoSVG={<IconRefresh />}
                variation="button-settings"
                dataAnimate={animateIcon}
                selected={null}
                size={null}
                buttonText={null}
                tooltip={null}
                tooltipPlacement={null}
                tooltipClassName={null}
                icoPosition={null}
                tooltipDelay={null}
                disabled={null}
              />
            </div>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default BatteryStatus;

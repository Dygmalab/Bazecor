import React, { useEffect, useCallback, useRef, useState } from "react";

import Styled from "styled-components";

// Custom components
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { BatteryStatusSide, SavingModeIndicator } from "@Renderer/components/atoms/battery";

// Assets
import { IconRefresh, IconBattery } from "@Renderer/components/atoms/icons";

import { useDevice } from "@Renderer/DeviceContext";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { i18n } from "@Renderer/i18n";

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
.batteryLoader {
  width: 206px;
  height: 127px;
  text-align: center;
  display: grid;
  align-items: center;
}
`;
interface BatteryStatusProps {
  disable: boolean;
}
const BatteryStatus = ({ disable }: BatteryStatusProps) => {
  const [bLeft, setbLeft] = useState(0);
  const [bRight, setbRight] = useState(0);
  const [sLeft, setsLeft] = useState(3);
  const [sRight, setsRight] = useState(3);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(0);
  const [loading, setLoading] = useState(true);
  const target = useRef(null);
  const { state } = useDevice();

  const intervalIdRef = useRef<NodeJS.Timeout | null>(null);
  const intervalIdAnimateRef = useRef<NodeJS.Timeout | null>(null);

  const delay = (ms: number) =>
    new Promise(res => {
      setTimeout(res, ms);
    });

  const getBatteryStatus = useCallback(async () => {
    if (state.currentDevice && !disable && !state.currentDevice.isSending) {
      let left = "";
      let right = "";
      let leftStatus = "";
      let rightStatus = "";
      let savingMode = "";
      // iterator values
      let newReading = false;
      let counter = 5;
      // reading until we get a result != 4 or we try 5 times
      while (newReading === false && counter > 0) {
        /* eslint-disable no-await-in-loop */
        left = await state.currentDevice.noCacheCommand("wireless.battery.left.level");
        right = await state.currentDevice.noCacheCommand("wireless.battery.right.level");
        leftStatus = await state.currentDevice.noCacheCommand("wireless.battery.left.status");
        rightStatus = await state.currentDevice.noCacheCommand("wireless.battery.right.status");
        savingMode = await state.currentDevice.noCacheCommand("wireless.battery.savingMode");
        counter -= 1;
        if (leftStatus !== "4" && rightStatus !== "4") {
          newReading = true;
        } else {
          await delay(500);
        }
        /* eslint-enable no-await-in-loop */
      }
      setbLeft(parseInt(left, 10));
      setbRight(parseInt(right, 10));
      setsLeft(leftStatus?.includes("0x") ? 255 : parseInt(leftStatus, 10));
      setsRight(rightStatus?.includes("0x") ? 255 : parseInt(rightStatus, 10));
      setIsSavingMode(parseInt(savingMode, 10) > 0);
      setLoading(false);
    }
  }, [disable, state.currentDevice]);

  useEffect(() => {
    if (!disable) {
      getBatteryStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!disable) {
      intervalIdRef.current = setInterval(() => {
        getBatteryStatus();
      }, 5 * 1000);
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
    if (disable) return;
    if (state.currentDevice) {
      await state.currentDevice.noCacheCommand("wireless.battery.forceRead");
    }
    setAnimateIcon(1);
    setLoading(true);
    await getBatteryStatus();
    setLoading(false);
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
            <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center mb-2">
              <IconBattery /> {i18n.wireless.batteryPreferences.battery}
            </Heading>
            {loading ? (
              <div className="batteryLoader">
                <LogoLoader width="200" warning={false} error={false} paused={false} />
              </div>
            ) : (
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
            )}
            <div className="batterySettingItem batteryUpdateStatus flex gap-2 items-center justify-start">
              <Button
                variant="config"
                size="icon"
                onClick={forceRetrieveBattery}
                className="p-2 flex justify-center items-center"
              >
                <span className={`inline-flex w-6 origin-center ${animateIcon ? "animate-spin" : ""}`}>
                  <IconRefresh />
                </span>
              </Button>
              <div className="batterySettingLabel">Force read</div>
            </div>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default BatteryStatus;

import React, { useEffect, useRef, useState } from "react";
import i18n from "../../i18n";
import Styled from "styled-components";
import Focus from "../../../api/focus";

//Bootstrap components
import Overlay from "react-bootstrap/Overlay";
import Form from "react-bootstrap/Form";

//Custom components
import Title from "../../component/Title";
import { ButtonConfig } from "../../component/Button";
import { BatteryStatusSide, SavingModeIndicator } from "../../component/Battery";

//Assets
import { IconBattery, IconRefresh } from "../../component/Icon";

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
  grid-gap: 4px;
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

const BatteryStatus = ({ disable }) => {
  const [show, setShow] = useState(false);
  const [bLeft, setbLeft] = useState(100);
  const [bRight, setbRight] = useState(100);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
  const [animateIcon, setAnimateIcon] = useState(0);
  const target = useRef(null);

  useEffect(() => {
    let intervalID;
    if (show === true) {
      intervalID = setInterval(() => {
        setShow(false);
        clearInterval(intervalID);
      }, 3000);
    }
    return () => clearInterval(intervalID);
  }, [show]);

  useEffect(() => {
    getBatteryStatus();
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      getBatteryStatus();
    }, 60000);

    return () => clearInterval(intervalID);
  }, []);

  useEffect(() => {
    const intervalID = setInterval(() => {
      setAnimateIcon(0);
    }, 1100);

    return () => clearInterval(intervalID);
  }, [animateIcon]);

  const getBatteryStatus = async () => {
    if (disable) return;
    const focus = new Focus();
    const left = await focus.command("wireless.battery.left.level");
    const right = await focus.command("wireless.battery.right.level");
    setbLeft(left);
    setbRight(right);
  };
  const forceRetrieveBattery = async () => {
    if (disable) return;
    const focus = new Focus();
    await focus.command("wireless.battery.forceRead");
    await getBatteryStatus();
    setAnimateIcon(1);
  };

  return (
    <Style>
      <div className="battery-indicator--wrapper" ref={target} onMouseEnter={() => setShow(!show)}>
        <div className="battery-indicator--container">
          <BatteryStatusSide side="left" batteryLevel={bLeft} isSavingMode={isSavingMode} isCharging={isCharging} size="sm" />
          <BatteryStatusSide side="right" batteryLevel={bRight} isSavingMode={isSavingMode} isCharging={isCharging} size="sm" />
        </div>
        <div className="dropdown-menu dropdown-menu--battery">
          <div className="dropdown-menu__inner">
            <Title text={i18n.wireless.batteryPreferences.battery} headingLevel={4} svgICO={<IconBattery />} />
            <div className="battery-defy--indicator">
              <BatteryStatusSide side="left" batteryLevel={bLeft} isSavingMode={isSavingMode} isCharging={isCharging} size="lg" />
              <BatteryStatusSide
                side="right"
                batteryLevel={bRight}
                isSavingMode={isSavingMode}
                isCharging={isCharging}
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
                style={"button-settings"}
                dataAnimate={animateIcon}
              />
            </div>
          </div>
        </div>
      </div>
    </Style>
  );
};

export default BatteryStatus;

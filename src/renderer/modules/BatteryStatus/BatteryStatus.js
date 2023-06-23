import React, { useEffect, useRef, useState } from "react";
import i18n from "../../i18n";
import Styled from "styled-components";
import Focus from "../../../api/focus";

//Bootstrap components
import Overlay from "react-bootstrap/Overlay";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

//Custom components
import Title from "../../component/Title";
import { BatteryStatusSide } from "../../component/Battery";

//Assets
import { IconBattery } from "../../component/Icon";

const Style = Styled.div`
.battery-indicator--wrapper {
  padding-top: 8px;
}
.battery-indicator--container {
  display: flex;
  grid-gap: 3px;
  > div {
    flex: 1;
  }
}
`;

const BatteryStatus = ({ disable }) => {
  const [show, setShow] = useState(false);
  const [bLeft, setbLeft] = useState(100);
  const [bRight, setbRight] = useState(100);
  const [isSavingMode, setIsSavingMode] = useState(false);
  const [isCharging, setIsCharging] = useState(false);
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
  };

  return (
    <Style>
      <div className="battery-indicator--wrapper" ref={target} onMouseEnter={() => setShow(!show)}>
        <div className="battery-indicator--container">
          <BatteryStatusSide side="left" batteryLevel={bLeft} size="sm" isSavingMode={isSavingMode} isCharging={isCharging} />
          <BatteryStatusSide side="right" batteryLevel={bRight} size="sm" isSavingMode={isSavingMode} isCharging={isCharging} />
        </div>
      </div>
      <Overlay
        target={target.current}
        show={show}
        placement="top"
        popperConfig={{
          modifiers: {
            name: "offset",
            enabled: true,
            options: {
              offset: [0, -4]
            }
          }
        }}
      >
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            className="dropdown-menu dropdown-menu--battery"
            {...props}
            style={{
              ...props.style
            }}
          >
            <div className="dropdown-menu__inner">
              <Title text={i18n.wireless.batteryPreferences.battery} headingLevel={4} svgICO={<IconBattery />} />
              <div className="battery-defy--indicator">
                <BatteryStatusSide
                  side="left"
                  batteryLevel={bLeft}
                  size="lg"
                  isSavingMode={isSavingMode}
                  isCharging={isCharging}
                />
                <BatteryStatusSide
                  side="right"
                  batteryLevel={bRight}
                  size="lg"
                  isSavingMode={isSavingMode}
                  isCharging={isCharging}
                />
              </div>
              <div className="batterySetting">
                <Form>
                  <Form.Label>Enable Saving Mode</Form.Label>
                  <Form.Check
                    type="switch"
                    id="settingSavingMode"
                    checked={isSavingMode}
                    onChange={() => setIsSavingMode(!isSavingMode)}
                  />
                </Form>
              </div>

              <Button
                onClick={() => {
                  forceRetrieveBattery();
                }}
              >
                Force read Battery level
              </Button>
            </div>
          </div>
        )}
      </Overlay>
    </Style>
  );
};

export default BatteryStatus;

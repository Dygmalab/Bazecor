import React, { useEffect, useRef, useState } from "react";
import Styled from "styled-components";
import Focus from "../../../api/focus";

//Bootstrap components
import Overlay from "react-bootstrap/Overlay";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";

//Custom components
import { BatteryStatusSide } from "../../component/Battery";

const Style = Styled.div`
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
          <BatteryStatusSide side="left" level={4} size="sm" isSavingMode={false} isCharging={false} />
          <BatteryStatusSide side="right" level={18} size="sm" isSavingMode={false} isCharging={false} />
        </div>
        <p style={{ fontSize: "0.9em", justifyContent: "center", margin: "0" }}>{`L:${bLeft}% R:${bRight}%`}</p>
      </div>
      <Overlay target={target.current} show={show} placement="top">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <Container
            {...props}
            style={{
              backgroundColor: "#25273b",
              padding: "2px 10px",
              color: "white",
              width: "260px",
              borderRadius: 3,
              ...props.style,
              zIndex: 2000
            }}
          >
            <Row>Battery data from keyboard!</Row>
            <Row>
              <Col xs={6}>{bLeft}</Col>
              <Col xs={6}>{bRight}</Col>
            </Row>
            <Row>Button for energy saving mode</Row>
            <Row>
              <Button
                onClick={() => {
                  forceRetrieveBattery();
                }}
              >
                Force read Battery level
              </Button>
            </Row>
          </Container>
        )}
      </Overlay>
    </Style>
  );
};

export default BatteryStatus;

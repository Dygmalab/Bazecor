import React, { useRef, useState } from "react";
import Overlay from "react-bootstrap/Overlay";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

export default function BatteryStatus() {
  const [show, setShow] = useState(false);
  const [bLeft, setbLeft] = useState(90);
  const [bRight, setbRight] = useState(96);
  const target = useRef(null);

  return (
    <>
      <div ref={target} onMouseEnter={() => setShow(!show)} onMouseLeave={() => setShow(!show)}>
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
              <Col xs={6}>50%</Col>
              <Col xs={6}>50%</Col>
            </Row>
            <Row>Button for energy saving mode</Row>
          </Container>
        )}
      </Overlay>
    </>
  );
}

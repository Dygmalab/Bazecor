import React, { useState, useEffect } from "react";
import DeviceChecks from "../controller/FlashingSM/DeviceChecks";
import { useMachine } from "@xstate/react";

// Visual components
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Button from "react-bootstrap/Button";

// Extra components
import { getStaticPath } from "../config";
import i18n from "../i18n";

// Bazecor components
import PageHeader from "../modules/PageHeader";
import FirmwareUpdatePanel from "../modules/FirmwareUpdatePanel";
import FirmwareUpdateProcess from "../modules/FirmwareUpdateProcess";

const Styles = Styled.div`
height: inherit;
.main-container {
  overflow: hidden;
  height: 100vh;
}
.firmware-update {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  &.center-content {
    height: 100vh;
  }
}
.disclaimerContent {
  font-size: 15px;
  margin-top: 32px;
  line-height: 1.5em;
  font-weight: 500;
}
`;

function AltFirmwareUpdate() {
  const [DeviceChecksState, DeviceChecksSend] = useMachine(DeviceChecks, {
    actions: {
      addEscListener: () => {
        document.addEventListener("keydown", _handleKeyDown);
      },
      removeEscListener: () => {
        document.removeEventListener("keydown", _handleKeyDown);
      }
    }
  });

  const _handleKeyDown = event => {
    switch (event.keyCode) {
      case 27:
        console.log("esc key logged");
        DeviceChecksSend("ESCPRESSED");
        break;
      default:
        break;
    }
  };

  return (
    <Styles>
      <Container fluid className={`firmware-update`}>
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div>
          <FirmwareUpdatePanel disclaimerCard={0} />
          <Button onClick={() => DeviceChecksSend("START")}>Start Checks</Button>
          <Button onClick={() => DeviceChecksSend("SKIP")}>Skip if raise</Button>
          <Button onClick={() => DeviceChecksSend("CHECK")}>Check Defy Sides</Button>
          <Card>{JSON.stringify(DeviceChecksState.context)}</Card>
        </div>
      </Container>
    </Styles>
  );
}

export default AltFirmwareUpdate;

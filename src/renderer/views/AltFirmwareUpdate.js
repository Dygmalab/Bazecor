import React, { useState, useEffect } from "react";
import FWSelection from "../controller/FlashingSM/FWSelection";
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
  const [FWSelectionState, FWSelectionSend] = useMachine(FWSelection);
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
        FWSelectionSend("ESCPRESSED");
        break;
      default:
        break;
    }
  };

  const { context } = FWSelectionState;

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (context?.device?.version && context?.firmwareList[0] && context?.selectefirmware >= 0) {
      setLoading(false);
    }
  }, [context]);

  return (
    <Styles>
      <Container fluid className={`firmware-update`}>
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div>
          {loading && context.stateblock < 2 ? (
            "loading"
          ) : (
            <FirmwareUpdatePanel
              content={context}
              device={context.device}
              currentlyVersionRunning={context.device.version}
              latestVersionAvailable={context.firmwareList[0].version}
              firmwareList={context.firmwareList}
              firmwareFilename={null}
              disclaimerCard={0}
              selectedFirmware={context.selectefirmware}
              send={FWSelectionSend}
              onClick={() => FWSelectionSend("NEXT")}
            />
          )}
          {loading && context.stateblock == 5 ? "loading" : "Ready to update"}

          <Button onClick={() => FWSelectionSend("RETRY")}>Retry when error</Button>
          <Button onClick={() => FWSelectionSend("NEXT")}>Next state</Button>
          <Button onClick={() => DeviceChecksSend("START")}>Start Checks</Button>
          <Button onClick={() => DeviceChecksSend("SKIP")}>Skip if raise</Button>
          <Button onClick={() => DeviceChecksSend("CHECK")}>Check Defy Sides</Button>
          <Card>{JSON.stringify(context)}</Card>
        </div>
      </Container>
    </Styles>
  );
}

export default AltFirmwareUpdate;

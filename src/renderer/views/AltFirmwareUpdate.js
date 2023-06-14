import React from "react";
import { useMachine } from "@xstate/react";
import MainProcessSM from "../controller/FlashingSM/MainProcess";

// Visual components
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";

// Extra components
import i18n from "../i18n";

// Bazecor components
import PageHeader from "../modules/PageHeader";
import { FirmwareErrorPanel, FirmwareCheckProcessPanel, FirmwareUpdatePanel, FirmwareUpdateProcess } from "../modules/Firmware";

import { FirmwareLoader } from "../component/Loader";

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
.panel-wrapper {
  width: 100%;
}
`;

const AltFirmwareUpdate = props => {
  const [state, send] = useMachine(MainProcessSM);

  const nextBlock = context => {
    send("NEXT", { data: context });
  };

  const retryBlock = () => {
    send("RETRY");
  };

  const errorBlock = error => {
    send("ERROR", { data: error });
  };

  return (
    <Styles>
      <Container fluid className={`firmware-update center-content`}>
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div className="panel-wrapper">
          {state.context.Block === -1 ? (
            <FirmwareErrorPanel nextBlock={nextBlock} retryBlock={retryBlock} />
          ) : state.context.Block === 0 ? (
            <FirmwareLoader />
          ) : state.context.Block === 1 ? (
            <FirmwareUpdatePanel
              nextBlock={nextBlock}
              retryBlock={retryBlock}
              errorBlock={errorBlock}
              allowBeta={props.allowBeta}
            />
          ) : state.context.Block === 2 ? (
            <FirmwareCheckProcessPanel
              nextBlock={nextBlock}
              retryBlock={retryBlock}
              errorBlock={errorBlock}
              context={state.context}
            />
          ) : state.context.Block === 3 ? (
            <FirmwareUpdateProcess
              nextBlock={nextBlock}
              retryBlock={retryBlock}
              errorBlock={errorBlock}
              context={state.context}
              toggleFlashing={props.toggleFlashing}
              toggleFwUpdate={props.toggleFwUpdate}
              onDisconnect={props.onDisconnect}
              device={props.device}
            />
          ) : (
            ""
          )}
          {/* <FirmwareUpdateProcess countdown={1} /> */}
          <Card style={{ maxWidth: "1080px", display: "none" }}>
            <Card.Title>MainProcessSM Context</Card.Title>
            <Card.Body>{JSON.stringify(state.context)}</Card.Body>
          </Card>
        </div>
      </Container>
    </Styles>
  );
};

export default AltFirmwareUpdate;

import React, { useState, useEffect } from "react";
import { useMachine } from "@xstate/react";
import DeviceChecks from "../controller/FlashingSM/DeviceChecks";
import MainProcessSM from "../controller/FlashingSM/MainProcess";

// Visual components
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

// Extra components
import { getStaticPath } from "../config";
import i18n from "../i18n";

// Bazecor components
import PageHeader from "../modules/PageHeader";
import {
  FirmwareErrorPanel,
  FirmwareCheckProcessPanel,
  FirmwareUpdatePanel,
  FirmwareStartUpdatePanel
} from "../modules/Firmware";

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
  const [state, send] = useMachine(MainProcessSM);
  // const [DeviceChecksState, DeviceChecksSend] = useMachine(DeviceChecks, {
  //   actions: {
  //     addEscListener: () => {
  //       document.addEventListener("keydown", _handleKeyDown);
  //     },
  //     removeEscListener: () => {
  //       document.removeEventListener("keydown", _handleKeyDown);
  //     }
  //   }
  // });

  // const _handleKeyDown = event => {
  //   switch (event.keyCode) {
  //     case 27:
  //       console.log("esc key logged");
  //       DeviceChecksSend("ESCPRESSED");
  //       break;
  //     default:
  //       break;
  //   }
  // };

  const nextBlock = context => {
    console.log("before sending NEXT", context);
    send("NEXT", { data: context });
  };

  const retryBlock = () => {
    send("RETRY");
  };

  return (
    <Styles>
      <Container fluid className={`firmware-update`}>
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div>
          <FirmwareErrorPanel nextBlock={nextBlock} retryBlock={retryBlock} />
          {state.context.Block === -1 ? (
            "error"
          ) : state.context.Block === 0 ? (
            <div className="loading marginCenter">
              <Spinner className="spinner-border" role="status" />
            </div>
          ) : state.context.Block === 1 ? (
            <FirmwareUpdatePanel nextBlock={nextBlock} retryBlock={retryBlock} />
          ) : state.context.Block === 2 ? (
            <FirmwareCheckProcessPanel nextBlock={nextBlock} retryBlock={retryBlock} />
          ) : state.context.Block === 3 ? (
            <FirmwareStartUpdatePanel nextBlock={nextBlock} retryBlock={retryBlock} />
          ) : (
            ""
          )}
          <Card style={{ maxWidth: "1080px" }}>{JSON.stringify(state.context)}</Card>
        </div>
      </Container>
    </Styles>
  );
}

export default AltFirmwareUpdate;

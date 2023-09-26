import React from "react";
import { useMachine } from "@xstate/react";
import MainProcessSM from "@Renderer/controller/FlashingSM/MainProcess";

// Visual components
import Styled from "styled-components";
import Container from "react-bootstrap/Container";

// Extra components
import i18n from "@Renderer/i18n";

// Bazecor components
import { PageHeader } from "@Renderer/modules/PageHeader";
import {
  FirmwareErrorPanel,
  FirmwareCheckProcessPanel,
  FirmwareUpdatePanel,
  FirmwareUpdateProcess,
} from "@Renderer/modules/Firmware";

import { FirmwareLoader } from "@Renderer/component/Loader";

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

function FirmwareUpdate(props: any) {
  const { allowBeta, toggleFlashing, toggleFwUpdate, onDisconnect, device } = props;
  const [state, send] = useMachine(MainProcessSM);

  const nextBlock = (context: any) => {
    send("NEXT", { data: context });
  };

  const retryBlock = () => {
    send("RETRY");
  };

  const errorBlock = (error: any) => {
    send("ERROR", { data: error });
  };

  return (
    <Styles>
      <Container fluid className="firmware-update center-content">
        <PageHeader text={i18n.app.menu.firmwareUpdate} />
        <div className="panel-wrapper">
          {state.context.Block === -1 ? <FirmwareErrorPanel nextBlock={nextBlock} retryBlock={retryBlock} /> : ""}
          {state.context.Block === 0 ? (
            <FirmwareLoader width={undefined} warning={undefined} error={undefined} paused={undefined} />
          ) : (
            ""
          )}
          {state.context.Block === 1 ? (
            <FirmwareUpdatePanel nextBlock={nextBlock} retryBlock={retryBlock} errorBlock={errorBlock} allowBeta={allowBeta} />
          ) : (
            ""
          )}
          {state.context.Block === 2 ? (
            <FirmwareCheckProcessPanel
              nextBlock={nextBlock}
              retryBlock={retryBlock}
              errorBlock={errorBlock}
              context={state.context}
            />
          ) : (
            ""
          )}
          {state.context.Block === 3 ? (
            <FirmwareUpdateProcess
              nextBlock={nextBlock}
              retryBlock={retryBlock}
              errorBlock={errorBlock}
              context={state.context}
              toggleFlashing={toggleFlashing}
              toggleFwUpdate={toggleFwUpdate}
              onDisconnect={onDisconnect}
              device={device}
            />
          ) : (
            ""
          )}
        </div>
      </Container>
    </Styles>
  );
}

export default FirmwareUpdate;

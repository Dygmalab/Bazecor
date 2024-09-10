import React from "react";
import { useMachine } from "@xstate/react";
import FlashManager from "@Renderer/controller/FlashManager/machine";

// Visual components
import Styled from "styled-components";

// Extra components
// import { i18n } from "@Renderer/i18n";

// Bazecor components
import { PageHeader } from "@Renderer/modules/PageHeader";
import {
  FirmwareErrorPanel,
  FirmwareCheckProcessPanel,
  FirmwareUpdatePanel,
  FirmwareUpdateProcess,
} from "@Renderer/modules/Firmware";

import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { useDevice } from "@Renderer/DeviceContext";

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
  // font-size: 15px;
  // margin-top: 32px;
  // line-height: 1.5em;
  // font-weight: 500;
}
.panel-wrapper {
  width: 100%;
}
`;

interface FirmwareUpdateProps {
  allowBeta: boolean;
  toggleFlashing: () => void;
  toggleFwUpdate: (value: boolean) => void;
  onDisconnect: () => void;
  setRestoredOk: (value: boolean) => void;
}

function FirmwareUpdate(props: FirmwareUpdateProps) {
  const { allowBeta, toggleFlashing, toggleFwUpdate, onDisconnect, setRestoredOk } = props;
  const { state: deviceState } = useDevice();
  const [state, send] = useMachine(FlashManager, { input: { Block: 0, deviceState } });

  const nextBlock = (context: any) => {
    send({ type: "next-event", ...context });
  };

  const retryBlock = (context: any) => {
    send({ type: "retry-event", Block: context.Block, backup: context.backup });
  };

  const errorBlock = (context: any) => {
    send({ type: "error-event", error: context.error });
  };

  return (
    <Styles>
      <div className="px-3 firmware-update center-content">
        <PageHeader text="Firmware Update" />
        <div className="panel-wrapper">
          {state.context.Block === -1 ? <FirmwareErrorPanel nextBlock={nextBlock} retryBlock={retryBlock} /> : ""}
          {state.context.Block === 0 ? (
            <LogoLoader firmwareLoader />
          ) : (
            // <FirmwareLoader width={undefined} warning={undefined} error={undefined} paused={undefined} />
            ""
          )}
          {state.context.Block === 1 ? (
            <FirmwareUpdatePanel nextBlock={nextBlock} retryBlock={retryBlock} errorBlock={errorBlock} allowBeta={allowBeta} />
          ) : (
            ""
          )}
          {state.context.Block === 2 ? (
            <FirmwareCheckProcessPanel nextBlock={nextBlock} retryBlock={retryBlock} context={state.context} />
          ) : (
            ""
          )}
          {state.context.Block === 3 ? (
            <FirmwareUpdateProcess
              nextBlock={nextBlock}
              retryBlock={retryBlock}
              context={state.context}
              toggleFlashing={toggleFlashing}
              toggleFwUpdate={toggleFwUpdate}
              onDisconnect={onDisconnect}
              setRestoredOk={setRestoredOk}
            />
          ) : (
            ""
          )}
        </div>
      </div>
    </Styles>
  );
}

export default FirmwareUpdate;

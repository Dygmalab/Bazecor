// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Styled from "styled-components";
import { useMachine } from "@xstate/react";
import i18n from "../../i18n";
import SemVer from "semver";

// State machine
import FlashDevice from "../../controller/FlashingSM/FlashDevice";

// Visual components
import Title from "../../component/Title";
import { RegularButton } from "../../component/Button";
import { StepsBar } from "../../component/StepsBar";
import { IconArrowRight } from "../../component/Icon";

// Visual modules
import { FirmwareProgressStatus } from "../Firmware";

const Style = Styled.div`   
width: 100%;  
height:inherit;
.firmware-wrapper {
  max-width: 680px;   
  width: 100%;
  margin: auto;
  .firmware-row {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
  }
  .firmware-content {
    flex: 0 0 66%;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundContent}; 
  }
  .firmware-sidebar {
    flex: 0 0 34%;
    background: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundSidebar}; 
  }
  .firmware-content--inner {
    padding: 32px;
  }
  .borderLeftTopRadius {
    border-top-left-radius: 14px;
  } 
  .borderRightTopRadius {
    border-top-right-radius: 14px;
  }
  .borderLeftBottomRadius {
    border-bottom-left-radius: 14px;
  } 
  .borderRightBottomRadius {
    border-bottom-right-radius: 14px;
  }
}
.firmware-footer {
  width: 100%;
  margin-top: 62px;
}
.holdButton { 
  margin-bottom: 32px;
}
.holdTootip {
  h6 {
    font-size: 13px;  
    font-weight: 395;
    letter-spacing: 0;
    color:  ${({ theme }) => theme.colors.gray300}; 
  }
}
.progress-visualizer {
  margin-top: 162px;
}
`;

/**
 * This FirmwareUpdateProcess function returns a module that wrap all modules and components to manage the first steps of firware update.
 * The object will accept the following parameters
 *
 * @param {number} disclaimerCard - Number that indicates the software when the installation will begin.
 * @returns {<FirmwareUpdateProcess>} FirmwareUpdateProcess component.
 */

const FirmwareUpdateProcess = ({ nextBlock, retryBlock, context, toggleFlashing, toggleFwUpdate, onDisconnect, device }) => {
  const [toggledFlashing, sendToggledFlashing] = useState(false);
  const [state, send] = useMachine(FlashDevice, {
    context: {
      device: context.device,
      originalDevice: device,
      backup: context.backup,
      firmwares: context.firmwares,
      isUpdated: context.isUpdated,
      versions: context.versions,
      RaiseBrightness: context.RaiseBrightness
    },
    actions: {
      addEscListener: () => {
        console.log("added event listener");
        document.addEventListener("keydown", _handleKeyDown);
      },
      removeEscListener: () => {
        console.log("removed event listener");
        document.removeEventListener("keydown", _handleKeyDown);
      },
      toggleFlashing: async () => {
        if (toggledFlashing) return;
        console.log("starting flashing indicators");
        await toggleFlashing();
        toggleFwUpdate();
        sendToggledFlashing(true);
      },
      finishFlashing: async () => {
        if (!toggledFlashing) return;
        sendToggledFlashing(false);
        console.log("closing flashin process");
        await toggleFlashing();
        toggleFwUpdate();
        onDisconnect();
      }
    }
  });

  const _handleKeyDown = event => {
    switch (event.keyCode) {
      case 27:
        console.log("esc key logged");
        send("ESCPRESSED");
        break;
      default:
        break;
    }
  };

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (state.context.stateblock > 0) {
      setLoading(false);
    }
    if (state.matches("success")) nextBlock(state.context);
  }, [state.context]);

  const [simulateCountdown, setSimulateCountdown] = useState(0);
  const stepsDefy = [
    { name: "1", icon: false },
    { name: "2", icon: false },
    { name: "3", icon: false },
    { name: "4", icon: false }
  ];
  const stepsRaise = [
    { step: 1, title: "1. Hold the key", description: "Backing up you layers" },
    { step: 6, title: "2. Release the key", description: "Preparing the Keyboard" },
    { step: 7, title: "3. Updating the Firmware", description: "Gently installing..." },
    { step: 8, title: "4. Restoring your Layers", description: "Wrapping everything up!" },
    { step: 9, title: "Firmware update!", description: "Solid as a rock! 💪" },
    { step: 10, title: "Firmware update error!", description: "Errors!!!! 🫠" }
  ];

  return (
    <Style>
      {loading ? (
        ""
      ) : (
        <div className="firmware-wrapper upgrade-firmware">
          <div className="firmware-row">{/* <StepsBar steps={steps} stepActive={simulateCountdown - 1} /> */}</div>
          <div className="firmware-row progress-visualizer">
            <FirmwareProgressStatus
              flashProgress={state.context.globalProgress}
              countdown={state.context.stateblock}
              deviceProduct={state.context.device.info.product}
              keyboardType={state.context.device.info.keyboardType}
              steps={state.context.device.info.product == "Defy" ? stepsDefy : stepsRaise}
            />
          </div>
          {state.context.stateblock == 1 ? (
            <div className="firmware-footer">
              <div className="holdButton">
                <RegularButton
                  className="flashingbutton nooutlined"
                  style="outline"
                  size="sm"
                  buttonText={i18n.firmwareUpdate.texts.cancelButton}
                  onClick={() => {
                    retryBlock();
                  }}
                />
              </div>
              <div className="holdTootip">
                <Title
                  text={i18n.firmwareUpdate.texts.flashCardHelp}
                  headingLevel={6}
                  tooltip={i18n.firmwareUpdate.texts.flashCardHelpTooltip}
                  tooltipSize="wide"
                />
              </div>
            </div>
          ) : (
            ""
          )}
          {state.context.stateblock == 10 ? (
            <div className="firmware-footer">
              <div className="holdButton">
                <RegularButton
                  className="flashingbutton nooutlined"
                  style="outline"
                  size="sm"
                  buttonText={i18n.firmwareUpdate.texts.cancelButton}
                  onClick={() => {
                    send("CANCEL");
                    retryBlock();
                  }}
                />
                <RegularButton
                  className="flashingbutton nooutlined"
                  style="outline"
                  size="sm"
                  buttonText={"Retry the flashing procedure"}
                  onClick={() => {
                    send("RETRY");
                  }}
                />
              </div>
              <div className="holdTootip">
                <Title
                  text={i18n.firmwareUpdate.texts.flashCardHelp}
                  headingLevel={6}
                  tooltip={i18n.firmwareUpdate.texts.flashCardHelpTooltip}
                  tooltipSize="wide"
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      )}
      <hr />
      <div>
        <h3>percentages</h3>
        <div>
          <div>{`global Percentage: ${state.context.globalProgress}`}</div>
          <div>{`left Percentage: ${state.context.leftProgress}`}</div>
          <div>{`right Percentage: ${state.context.rightProgress}`}</div>
          <div>{`reset Percentage: ${state.context.resetProgress}`}</div>
          <div>{`neuron Percentage: ${state.context.neuronProgress}`}</div>
          <div>{`restore Percentage: ${state.context.restoreProgress}`}</div>
        </div>
      </div>
      <hr />
      <div style={{ display: "flex", gridGap: "16px", alignItems: "center", margin: "62px 0" }}>
        <RegularButton
          onClick={() => setSimulateCountdown(simulateCountdown + 1)}
          style="primary"
          buttonText="Simulate next step"
        />
        <RegularButton
          onClick={() => setSimulateCountdown(simulateCountdown - 1)}
          style="primary"
          buttonText="Simulate prev step"
        />
        {simulateCountdown}
      </div>
      <div style={{ maxWidth: "1080px" }}>{JSON.stringify(state.context)}</div>
    </Style>
  );
};

export default FirmwareUpdateProcess;

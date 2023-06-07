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
import Callout from "../../component/Callout";
import { RegularButton } from "../../component/Button";

// Visual modules
import WhatsNew from "../WhatsNew";
import {
  FirmwareUpdateProcess,
  FirmwareAdvancedOptions,
  FirmwareNeuronStatus,
  FirmwareVersionStatus,
  FirmwareProgressStatus,
  FirmwareImageHelp,
  FirmwareNeuronHelp
} from "../Firmware";

const Style = Styled.div`
width: 100%;
.firmware-wrapper {
  max-width: 960px;
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

.buttonActions {
  position: relative;
  display: flex;
  height: 116px;
  margin-bottom: 42px;
  margin-right: 32px;
  background-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundStripeColor};
  border-bottom-right-radius: 16px;
  border-top-right-radius: 16px;
  align-items:center;
  justify-content: center;
}
.dropdownCustomFirmware {
  position: absolute;
  top: 50%;
  right: 14px;
  transform: translate3d(0, -50%,0);
  margin-top: 0;
  z-index: 9;

  .buttonToggler.dropdown-toggle.btn {
    color: ${({ theme }) => theme.styles.firmwareUpdatePanel.iconDropodownColor};
  }
}
.wrapperActions {
  display: flex;
  padding-left: 32px;
  margin-left: 32px;
  align-items: center;
  height: 116px;
  margin-bottom: 42px;
  background-color: ${({ theme }) => theme.styles.firmwareUpdatePanel.backgroundStripeColor};
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  overflow: hidden;
  .button {
    align-self: center;
  }
}
.disclaimer-firmware {
  .lineColor {
      stroke: ${({ theme }) => theme.styles.firmwareUpdatePanel.neuronStatusLineWarning};
  }
  .firmware-content--inner h3 {
    color: ${({ theme }) => theme.styles.firmwareUpdatePanel.disclaimerTitle};
  }
}
.buttonActions .button.outline,
.buttonActions .button.primary {
  margin-right: -32px;
}
@media screen and (max-width: 1100px) {
  .buttonActions .button.primary {
    margin-right: -16px;
  }
}
@media screen and (max-width: 980px) {
  .buttonActions .button.primary {
    margin-right: 6px;
  }
}
@media screen and (max-width: 860px) {
  .buttonActions .button.primary {
    margin-right: 16px;
  }
  .dropdownCustomFirmware {
    right: 8px;
  }
  .buttonActions {
    justify-content: flex-start;
    padding-left: 8px;
  }
  .firmware-wrapper .firmware-content {
    flex: 0 0 55%;
  }
  .firmware-wrapper .firmware-sidebar {
    flex: 0 0 45%;
  }
  .badge {
    font-size: 11px;
    font-weight: 600;
    padding: 8px;
  }
  .hidden-on-sm {
    display:none;
  }
}
`;

/**
 * This FirmwareUpdatePanel function returns a module that wrap all modules and components to manage the first steps of firware update.
 * The object will accept the following parameters
 *
 * @param {number} disclaimerCard - Number that indicates the software when the installation will begin.
 * @returns {<FirmwareUpdatePanel>} FirmwareUpdatePanel component.
 */

const FirmwareStartUpdatePanel = ({ nextBlock, retryBlock, context, toggleFlashing, toggleFwUpdate, onDisconnect, device }) => {
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
        console.log("starting flashing indicators");
        await toggleFlashing();
        toggleFwUpdate();
        //onDisconnect();
      },
      finishFlashing: async () => {
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

  return (
    <Style>
      {loading ? (
        ""
      ) : (
        <div className="firmware-wrapper disclaimer-firmware">
          <div className="firmware-row">
            <div className="firmware-content borderLeftTopRadius">
              <div className="firmware-content--inner">
                <Title text={i18n.firmwareUpdate.texts.disclaimerTitle} headingLevel={3} />
                <div
                  className={"disclaimerContent"}
                  dangerouslySetInnerHTML={{ __html: i18n.firmwareUpdate.texts.disclaimerContent }}
                />
                <Callout
                  content={i18n.firmwareUpdate.texts.calloutIntroText}
                  className="mt-lg"
                  size="md"
                  hasVideo={state.context.device.info.product == "Raise" ? true : true}
                  media={`aVu7EL4LXMI`}
                  videoTitle="How to update the Software & Firmware of your Dygma keyboard"
                  videoDuration={state.context.device.info.product == "Raise" ? "2:58" : null}
                />
              </div>
            </div>
            <div className="firmware-sidebar borderRightTopRadius">
              <FirmwareNeuronStatus
                isUpdated={state.context.isUpdated}
                status="waiting"
                deviceProduct="Defy"
                keyboardType="wireless"
              />
            </div>
          </div>
          <div className="firmware-row">
            <div className="firmware-content borderLeftBottomRadius">
              <div className="wrapperActions">
                <RegularButton
                  className="flashingbutton nooutlined"
                  style="outline"
                  buttonText={i18n.firmwareUpdate.texts.backwds}
                  // onClick={onCancelDialog}
                />
              </div>
            </div>
            <div className="firmware-sidebar borderRightBottomRadius">
              <div className="buttonActions">
                <RegularButton
                  className="flashingbutton nooutlined"
                  style="primary"
                  buttonText={i18n.firmwareUpdate.texts.letsStart}
                  // onClick={onBackup}`
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <RegularButton
        buttonText={"Retry when error"}
        onClick={() => {
          send("RETRY");
          retryBlock();
        }}
      ></RegularButton>
      <div style={{ maxWidth: "1080px" }}>{JSON.stringify(state.context)}</div>
    </Style>
  );
};

export default FirmwareStartUpdatePanel;

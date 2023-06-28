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

import React, { useState, useEffect, useRef } from "react";
import Styled from "styled-components";
import { useMachine } from "@xstate/react";
import i18n from "../../i18n";

// State machine
import FWSelection from "../../controller/FlashingSM/FWSelection";

// Visual components
import Title from "../../component/Title";
import Callout from "../../component/Callout";
import { RegularButton } from "../../component/Button";
import { FirmwareLoader } from "../../component/Loader";
import { IconLoader } from "../../component/Icon";

// Visual modules
import { FirmwareNeuronStatus, FirmwareVersionStatus } from "../Firmware";

const Style = Styled.div`
width: 100%;
height:inherit;
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

function FirmwareUpdatePanel({ nextBlock, retryBlock, errorBlock, allowBeta }) {
  const [state, send] = useMachine(FWSelection, { context: { allowBeta: allowBeta } });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (state.context.stateblock >= 3 || state.context.stateblock == -1) {
      setLoading(false);
    }
    if (state.matches("success")) nextBlock(state.context);
    if (state.matches("failure")) errorBlock(state.context.error);
  }, [state.context]);

  return (
    <Style>
      {loading ? (
        <FirmwareLoader />
      ) : (
        <div className="firmware-wrapper home-firmware">
          <div className="firmware-row">
            <div className="firmware-content borderLeftTopRadius">
              <div className="firmware-content--inner">
                <Title
                  text={
                    state.context.isUpdated
                      ? i18n.firmwareUpdate.texts.versionUpdatedTitle
                      : i18n.firmwareUpdate.texts.versionOutdatedTitle
                  }
                  headingLevel={3}
                  type={state.context.isUpdated ? "success" : "warning"}
                />
                <Callout
                  content={i18n.firmwareUpdate.texts.calloutIntroText}
                  className="mt-lg"
                  size="md"
                  hasVideo={state.context.device.info.product == "Raise" ? true : false}
                  media={`aVu7EL4LXMI`}
                  videoTitle="How to update the Software & Firmware of your Dygma keyboard"
                  videoDuration={state.context.device.info.product == "Raise" ? "2:58" : null}
                />
              </div>
            </div>
            <div className="firmware-sidebar borderRightTopRadius">
              <FirmwareNeuronStatus
                isUpdated={state.context.isUpdated}
                deviceProduct={state.context.device.info.product}
                keyboardType={state.context.device.info.keyboardType}
              />
            </div>
          </div>
          <div className="firmware-row">
            <div className="firmware-content borderLeftBottomRadius">
              {state.context.firmwareList && state.context.firmwareList.length > 0 ? (
                <FirmwareVersionStatus
                  currentlyVersionRunning={state.context.device.version}
                  latestVersionAvailable={state.context.firmwareList[state.context.selectedFirmware].version}
                  isUpdated={state.context.isUpdated}
                  firmwareList={state.context.firmwareList}
                  selectedFirmware={state.context.selectedFirmware}
                  send={send}
                />
              ) : (
                ""
              )}
            </div>
            <div className="firmware-sidebar borderRightBottomRadius">
              <div className="buttonActions">
                <RegularButton
                  className="flashingbutton nooutlined"
                  style={state.context.isUpdated ? "outline" : "primary"}
                  buttonText={
                    state.context.stateblock == 4
                      ? "Processing..."
                      : state.context.isUpdated
                      ? i18n.firmwareUpdate.flashing.buttonUpdated
                      : i18n.firmwareUpdate.flashing.button
                  }
                  icoSVG={state.context.stateblock == 4 ? <IconLoader /> : null}
                  icoPosition={state.context.stateblock == 4 ? "right" : null}
                  disabled={state.context.stateblock == 4 ? true : false}
                  onClick={() => {
                    send("NEXT");
                  }}
                />

                <div className="dropdownCustomFirmware">
                  {/* <FirmwareAdvancedOptions
                      firmwareFilename={firmwareFilename}
                      selectFirmware={selectFirmware}
                      selectExperimental={selectExperimental}
                    /> */}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </Style>
  );
}

export default FirmwareUpdatePanel;

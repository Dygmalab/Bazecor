// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2023  Dygmalab, Inc.
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
import Styled from "styled-components";
import { useMachine } from "@xstate/react";
import i18n from "../../i18n";
import SemVer from "semver";

// State machine
import FWSelection from "../../controller/FlashingSM/FWSelection";

// Visual components
import Title from "../../component/Title";
import Callout from "../../component/Callout";
import { RegularButton } from "../../component/Button";
import { FirmwareLoader } from "../../component/Loader";

// Visual modules
import { FirmwareNeuronStatus } from "../Firmware";

//Assets
import videoDefyCablesDisconnect from "@Assets/videos/connectCablesDefy.mp4";
import { IconNoWifi, IconWarning } from "../../component/Icon";

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
.errorListWrapper {
    padding-top: 16px;
    display: flex;
    grid-gap: 16px;
    align-items: center;
    .errorListItem {
        display: flex;
        grid-gap: 24px;
        align-items: center;
    }
    .errorListImage {
        video {
            aspect-ratio: 1 /1;
            object-fit: cover;
            width: 162px;
            border-radius: 16px;
            border: 3px solid ${({ theme }) => theme.colors.brandWarning};
        }
    }
    .errorListContent {
        // max-width: 200px;
        color: ${({ theme }) => theme.styles.firmwareErrorPanel.textColor}
    }
}
.iconWarning {
  color: ${({ theme }) => theme.colors.brandWarning};
}
`;

/**
 * This FirmwareUpdatePanel function returns a module that wrap all modules and components to manage the first steps of firware update.
 * The object will accept the following parameters
 *
 * @param {number} disclaimerCard - Number that indicates the software when the installation will begin.
 * @returns {<FirmwareUpdatePanel>} FirmwareUpdatePanel component.
 */

function FirmwareErrorPanel({ nextBlock, retryBlock }) {
  const [state, send] = useMachine(FWSelection);
  const [handleError, setHandleError] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (state.context.device.version && state.context.firmwareList && state.context.firmwareList.length > 0) {
      setLoading(false);
    }
    if (state.matches("success")) {
      setHandleError(false);
      nextBlock(state.context);
    }
    if (state.matches("failure")) {
      console.log("Matches failure");
      setHandleError(true);
    }
  }, [state.context]);

  return (
    <Style>
      {loading && !handleError ? (
        <FirmwareLoader />
      ) : (
        <div className="firmware-wrapper">
          <div className="firmware-row">
            <div className="firmware-content borderLeftTopRadius">
              <div className="firmware-content--inner">
                <Title text={i18n.firmwareUpdate.texts.errorTitle} headingLevel={3} type="warning" />
                <div className="errorListWrapper">
                  {handleError ? (
                    state.context.error == "error.platform.GitHubData" ? (
                      <div className="errorListItem">
                        <div className="errorListImage iconWarning">
                          <IconNoWifi />
                        </div>
                        <div className="errorListContent">{i18n.firmwareUpdate.texts.noInternetConncetion}</div>
                      </div>
                    ) : (
                      ""
                    )
                  ) : (
                    ""
                  )}
                </div>
              </div>
            </div>
            <div className="firmware-sidebar borderRightTopRadius">
              <FirmwareNeuronStatus
                isUpdated={false}
                icon={<IconWarning />}
                status="warning"
                deviceProduct={state.context.device.info.product}
                keyboardType={state.context.device.info.keyboardType}
              />
            </div>
          </div>
          <div className="firmware-row">
            <div className="firmware-content borderLeftBottomRadius">
              <div className="wrapperActions">
                {!handleError ? (
                  <RegularButton
                    className="flashingbutton nooutlined"
                    styles="outline transp-bg"
                    buttonText={i18n.firmwareUpdate.texts.cancelButton}
                    // onClick={onCancelDialog}
                  />
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="firmware-sidebar borderRightBottomRadius">
              <div className="buttonActions">
                <RegularButton
                  className="flashingbutton nooutlined"
                  styles="primary"
                  buttonText={i18n.general.retry}
                  onClick={() => {
                    send("RETRY");
                    retryBlock();
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "none" }}>{JSON.stringify(state.context)}</div>
    </Style>
  );
}

export default FirmwareErrorPanel;

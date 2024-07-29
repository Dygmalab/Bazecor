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
import log from "electron-log/renderer";
import { useMachine } from "@xstate/react";
import { i18n } from "@Renderer/i18n";

// State machine
import { IconNoWifi, IconWarning } from "@Renderer/components/atoms/icons";
import Heading from "@Renderer/components/atoms/Heading";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { Button } from "@Renderer/components/atoms/Button";
import FWSelection from "../../controller/FirmwareSelection/machine";

// Visual components

// Visual modules
import FirmwareNeuronStatus from "./FirmwareNeuronStatus";

// Assets
// import videoDefyCablesDisconnect from "@Assets/videos/connectCablesDefy.mp4";

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
    color: ${({ theme }) => theme.styles.firmwareUpdatePanel.iconDropdownColor};
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

interface FirmwareErrorPanelType {
  nextBlock: (context: any) => void;
  retryBlock: (context: any) => void;
}

function FirmwareErrorPanel(props: FirmwareErrorPanelType) {
  const { nextBlock, retryBlock } = props;
  const [state, send] = useMachine(FWSelection);
  const [handleError, setHandleError] = useState(false);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (state.context.device.version && state.context.firmwareList && state.context.firmwareList.length > 0) {
      setLoading(false);
    }
    if (state.value === "success") {
      setHandleError(false);
      setLoading(false);
      nextBlock(state.context);
    }
    if (state.value === "failure") {
      log.info("Matches failure");
      setHandleError(true);
      setLoading(false);
    }
  }, [nextBlock, state, state.context]);

  log.info("Checking incomming error to FW-E-P", state.context.error);
  return (
    <Style>
      {!handleError || loading ? (
        <LogoLoader firmwareLoader />
      ) : (
        <div className="firmware-wrapper">
          <div className="firmware-row">
            <div className="firmware-content borderLeftTopRadius">
              <div className="firmware-content--inner">
                {(state.context?.error?.error as Error)?.message.includes("Failed to fetch") ? (
                  <>
                    <Heading headingLevel={3} renderAs="h3" variant="warning">
                      {i18n.firmwareUpdate.texts.errorTitle}
                    </Heading>
                    <div className="errorListWrapper">
                      <div className="errorListItem">
                        <div className="errorListImage iconWarning">
                          <IconNoWifi />
                        </div>
                        <div className="errorListContent">{i18n.firmwareUpdate.texts.noInternetConnection}</div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <Heading headingLevel={3} renderAs="h3" variant="warning">
                      Something went wrong
                    </Heading>
                    <div className="errorListWrapper">
                      <div className="errorListItem">
                        <div className="errorListImage iconWarning">
                          <IconNoWifi />
                        </div>
                        <div className="errorListContent">
                          {state.context?.error
                            ? (state.context?.error?.error as Error)?.message
                            : "Contact our customer for more details"}
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="firmware-sidebar borderRightTopRadius">
              <FirmwareNeuronStatus
                isUpdated={false}
                icon={<IconWarning />}
                status="warning"
                deviceProduct={state.context.device.info?.product ? state.context.device.info.product : "Raise"}
                keyboardType={state.context.device.info?.keyboardType ? state.context.device.info.keyboardType : "Wired"}
              />
            </div>
          </div>
          <div className="firmware-row">
            <div className="firmware-content borderLeftBottomRadius">
              <div className="wrapperActions">
                {!handleError ? (
                  <Button
                    variant="outline"
                    onClick={() => {
                      // TODO: refactor this
                      send({ type: "retry-event" });
                    }}
                    size="sm"
                  >
                    {i18n.firmwareUpdate.texts.cancelButton}
                  </Button>
                ) : (
                  ""
                )}
              </div>
            </div>
            <div className="firmware-sidebar borderRightBottomRadius">
              <div className="buttonActions">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    send({ type: "retry-event" });
                    retryBlock(state.context);
                  }}
                >
                  {i18n.general.retry}
                </Button>
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

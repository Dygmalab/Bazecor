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
import Styled from "styled-components";
import { useMachine } from "@xstate/react";
import Card from "react-bootstrap/Card";
import i18n from "../../i18n";
import SemVer from "semver";

// State machine
import DeviceChecks from "../../controller/FlashingSM/DeviceChecks";

// Visual components
import Title from "../../component/Title";
import Callout from "../../component/Callout";
import { RegularButton } from "../../component/Button";
import { FirmwareLoader } from "../../component/Loader";
import AccordionFirmware from "../../component/Accordion/AccordionFirmware";

import { FirmwareNeuronStatus } from "../Firmware";

//Assets
import videoDefyCablesDisconnect from "../../../../static/videos/connectCablesDefy.mp4";
import { IconWarning } from "../../component/Icon";

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
    letter-spacing: -0.01em;
    strong {
      font-weight: 601;
    }
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
      max-width: 200px;
      color: ${({ theme }) => theme.styles.firmwareErrorPanel.textColor}
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

const FirmwareCheckProcessPanel = ({ nextBlock, retryBlock, context }) => {
  const [state, send] = useMachine(DeviceChecks, { context: { device: context.device } });

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (state.context.stateblock > 0) {
      setLoading(false);
    }
    if (state.matches("success")) nextBlock(state.context);
  }, [state.context]);

  const listItems = [
    { id: 0, text: "sideLeftOk", checked: state.context.sideLeftOk },
    { id: 1, text: "sideLeftBL", checked: state.context.sideLeftBL },
    { id: 2, text: "sideRightOK", checked: state.context.sideRightOK },
    { id: 3, text: "sideRightBL", checked: state.context.sideRightBL },
    { id: 4, text: "backup", checked: state.context.backup }
  ];

  return (
    <Style>
      {loading || !state.context.backup ? (
        <FirmwareLoader />
      ) : (
        <>
          {(state.context.device.info.product == "Raise" && state.context.backup) ||
          (state.context.device.info.product == "Defy" &&
            state.context.sideLeftOk &&
            state.context.sideLeftBL &&
            state.context.sideRightOK &&
            state.context.sideRightBL &&
            state.context.backup) ? (
            <div className="firmware-wrapper disclaimer-firmware">
              <div className="firmware-row">
                <div className="firmware-content borderLeftTopRadius">
                  <div className="firmware-content--inner">
                    <Title text={i18n.firmwareUpdate.texts.disclaimerTitle} headingLevel={3} />
                    <div
                      className={"disclaimerContent"}
                      dangerouslySetInnerHTML={{ __html: i18n.firmwareUpdate.texts.disclaimerContent }}
                    />
                    <Callout content={i18n.firmwareUpdate.texts.disclaimerContent2} size="sm" className="mt-lg" />
                    {state.context.device.info.product == "Defy" ? <AccordionFirmware items={listItems} /> : ""}
                  </div>
                </div>
                <div className="firmware-sidebar borderRightTopRadius">
                  <FirmwareNeuronStatus
                    isUpdated={state.context.isUpdated}
                    status="waiting"
                    deviceProduct={state.context.device.info.product}
                    keyboardType={state.context.device.info.keyboardType}
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
                      onClick={() => {
                        retryBlock();
                      }}
                    />
                  </div>
                </div>
                <div className="firmware-sidebar borderRightBottomRadius">
                  <div className="buttonActions">
                    <RegularButton
                      className="flashingbutton nooutlined"
                      style="primary"
                      buttonText={i18n.firmwareUpdate.texts.letsStart}
                      onClick={() => send("PRESSED")}
                    />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="firmware-wrapper">
              <div className="firmware-row">
                <div className="firmware-content borderLeftTopRadius">
                  <div className="firmware-content--inner">
                    <Title text={i18n.firmwareUpdate.texts.errorTitle} headingLevel={3} type="warning" />
                    <div className="errorListWrapper">
                      {!state.context.sideLeftBL || !state.context.sideRightBL ? (
                        <div className="errorListItem">
                          <div className="errorListImage">
                            <video width={162} height={162} autoPlay={true} loop={true} className="img-center img-fluid">
                              <source src={videoDefyCablesDisconnect} type="video/mp4" />
                            </video>
                          </div>
                          <div className="errorListContent">{i18n.firmwareUpdate.texts.errorMissingCables}</div>
                        </div>
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
                    <RegularButton
                      className="flashingbutton nooutlined"
                      style="outline"
                      buttonText={i18n.firmwareUpdate.texts.cancelButton}
                      onClick={() => {
                        retryBlock();
                      }}
                    />
                  </div>
                </div>
                <div className="firmware-sidebar borderRightBottomRadius">
                  <div className="buttonActions">
                    <RegularButton
                      className="flashingbutton nooutlined"
                      style="primary"
                      buttonText={i18n.general.retry}
                      onClick={() => {
                        send("PRESSED");
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </Style>
  );
};

export default FirmwareCheckProcessPanel;

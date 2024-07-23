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
import { i18n } from "@Renderer/i18n";

// State machine
import FirmwareSelection from "@Renderer/controller/FirmwareSelection/machine";

// Visual components
import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { IconBluetooth, IconLoader, IconUSB, IconWarning } from "@Renderer/components/atoms/icons";

// Visual modules
import { FirmwareNeuronStatus, FirmwareVersionStatus } from "@Renderer/modules/Firmware";
import { useDevice } from "@Renderer/DeviceContext";

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
`;

interface FirmwareUpdatePanelProps {
  nextBlock: (context: any) => void;
  retryBlock: (context: any) => void;
  errorBlock: (context: any) => void;
  allowBeta: boolean;
}

function FirmwareUpdatePanel(props: FirmwareUpdatePanelProps) {
  const { nextBlock, retryBlock, errorBlock, allowBeta } = props;
  const { state: deviceState } = useDevice();
  const [loading, setLoading] = useState(true);
  const [state, send] = useMachine(FirmwareSelection, { input: { allowBeta, deviceState } });

  let flashButtonText = state.context.stateblock === 4 ? "Processing..." : "";
  if (flashButtonText === "")
    flashButtonText = state.context.isUpdated ? i18n.firmwareUpdate.flashing.buttonUpdated : i18n.firmwareUpdate.flashing.button;

  useEffect(() => {
    if (state.context.stateblock >= 3 || state.context.stateblock === -1) {
      setLoading(false);
    }
    if (state.value === "success") nextBlock(state.context);
    if (state.value === "failure") errorBlock(state.context.error);
  }, [errorBlock, nextBlock, retryBlock, state]);

  return (
    <Style>
      {loading ? (
        // <FirmwareLoader />
        <LogoLoader firmwareLoader />
      ) : (
        <div className="firmware-wrapper home-firmware">
          <div className="firmware-row">
            <div className="firmware-content borderLeftTopRadius">
              <div className="firmware-content--inner">
                <Heading headingLevel={3} variant={state.context.isUpdated ? "success" : "warning"}>
                  {state.context.isUpdated
                    ? i18n.firmwareUpdate.texts.versionUpdatedTitle
                    : i18n.firmwareUpdate.texts.versionOutdatedTitle}
                </Heading>
                <Callout
                  className="mt-4"
                  size="sm"
                  hasVideo={state.context.device.info.product === "Raise"}
                  media="aVu7EL4LXMI"
                  videoTitle="How to update the Software & Firmware of your Dygma keyboard"
                  videoDuration={state.context.device.info.product === "Raise" ? "2:58" : null}
                >
                  <p>
                    {i18n.firmwareUpdate.texts.calloutIntroText}
                    <br />
                    {i18n.firmwareUpdate.texts.calloutIntroText2}
                  </p>
                </Callout>
              </div>
            </div>
            <div className="firmware-sidebar borderRightTopRadius">
              <FirmwareNeuronStatus
                isUpdated={state.context.isUpdated}
                deviceProduct={state.context.device.info.product}
                keyboardType={state.context.device.info.keyboardType}
                icon={undefined}
                status=""
              />
            </div>
          </div>
          <div className="firmware-row">
            <div className="firmware-content borderLeftBottomRadius">
              <FirmwareVersionStatus
                device={state.context.device}
                isUpdated={state.context.isUpdated}
                firmwareList={state.context.firmwareList}
                selectedFirmware={state.context.selectedFirmware}
                send={send}
                typeSelected={state.context.typeSelected}
              />
            </div>
            <div className="firmware-sidebar borderRightBottomRadius">
              <div className="buttonActions">
                {(state.context.firmwareList.length > 0 || state.context.typeSelected === "custom") &&
                deviceState.currentDevice.type === "serial" ? (
                  <Button
                    onClick={() => {
                      send({ type: "next-event" });
                    }}
                    variant={state.context.isUpdated ? "outline" : "primary"}
                    disabled={state.context.stateblock === 4}
                  >
                    {flashButtonText} {state.context.stateblock === 4 ? <IconLoader /> : null}
                  </Button>
                ) : (
                  <>
                    {deviceState.currentDevice.type === "serial" ? (
                      <div className="px-4 py-4">
                        <div className="px-4 py-4 rounded-md bg-gray-25 dark:bg-gray-600/50 flex gap-4 items-center animate-bounce-error">
                          <div className="inline-flex w-10 h-10 aspect-square items-center justify-center text-orange-900/50 bg-orange-200/50 dark:text-orange-200 dark:bg-orange-200/25 rounded-full">
                            <IconWarning />
                          </div>
                          <div className="flex flex-wrap gap-2 text-gray-400 dark:text-gray-25 text-sm">
                            No firmware available
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="px-4 py-4">
                        <div className="px-4 py-4 rounded-md bg-gray-25 dark:bg-gray-700 flex flex-col items-center gap-2 text-sm animate-bounce-error">
                          <div className="flex w-full items-center px-2 py-0 rounded-xl text-2xxs font-semibold tracking-tight leading-tight bg-orange-200 text-orange-900 [&_svg]:w-4">
                            <IconBluetooth /> Your keyboard is connected via BT
                          </div>
                          <div className="flex gap-4">
                            <div className="inline-flex w-10 h-10 aspect-square items-center justify-center text-orange-900/50 bg-orange-200/50 dark:text-orange-200 dark:bg-orange-200/25 rounded-full">
                              <IconUSB />
                            </div>
                            <div className="flex flex-wrap gap-2 text-gray-400 dark:text-gray-25 text-ssm">
                              Please plug the keyboard via USB to update the firmware.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </Style>
  );
}

export default FirmwareUpdatePanel;

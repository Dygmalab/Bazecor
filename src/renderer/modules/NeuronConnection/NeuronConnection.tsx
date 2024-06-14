/* eslint-disable react/prop-types */
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

import React from "react";
import Styled from "styled-components";
import { ToastContainer } from "react-toastify";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import NeuronStatus from "@Renderer/component/NeuronStatus";
import { SelectKeyboardDropdown } from "@Renderer/components/molecules/CustomSelect";
import { i18n } from "@Renderer/i18n";

import "react-toastify/dist/ReactToastify.css";
import { IconConnected } from "@Renderer/components/atoms/icons";
import { NeuronConnectionProps } from "@Renderer/types/selectKeyboard";

const Style = Styled.div`
.button.toastButton {
  z-index: 3000;
}
.neuronConnection {
  display: flex;
  align-items: center;
  margin-top: -62px;
}
.neuronInformation {
  align-self: center;
  width: 464px;
  margin-left: -32px;
  padding: 24px 32px;
  background-color: ${({ theme }) => theme.styles.neuronConnection.backgroundColor};
  border-radius: 14px;
  z-index: 2;
  h2 {
    color: ${({ theme }) => theme.styles.neuronConnection.titleColor};
    &.warning {
      color: ${({ theme }) => theme.colors.textWarning};
    }
  }
  .neuronSubtileText {
    color: ${({ theme }) => theme.styles.neuronConnection.subTitleColor};
    font-weight: 600;
    letter-spacing: -0.03em;
  }
}
.buttons > .button {
  margin-right: 16px;
}
.activeVirtualKeyboard {
  display: flex;
  flex-wrap: nowrap;
  margin-bottom: 16px;
}
.activeVirtualKeyboardIcon {
  flex: 0 0 32px;
  color: ${({ theme }) => theme.styles.virtualKeyboard.iconConnectedColor};
  align-self: center;
}
.activeVirtualKeyboardModel {
  color: ${({ theme }) => theme.styles.dropdown.titleColor};
  font-size: 16px;
  font-weight: 600;
  line-height: 1.5em;
  letter-spacing: -0.03em;
  margin-bottom: 2px;
}
.activeVirtualKeyboardType {
  color: ${({ theme }) => theme.styles.dropdown.subTitleColor};
  font-size: 13px;
  font-weight: 600;
  letter-spacing: -0.03em;

  margin-bottom: 0;
  small {
    font-size: 12px;
    font-weight: 600;
  }
}
@media screen and (max-width: 890px) {
  .neuronConnection {
    flex-wrap: wrap;
    justify-content: center;
    margin-top: -82px;
  }
  .neuronStatusInner {
    transform: scale(0.8);
  }
  .neuronInformation {
    margin-left: auto;
    margin-right: auto;
    margin-top: -74px;
  }
}
`;
function NeuronConnection(props: NeuronConnectionProps) {
  const {
    loading,
    scanFoundDevices,
    scanDevices,
    onKeyboardConnect,
    connected,
    onDisconnect,
    onDisconnectConnect,
    selectPort,
    selectedPortIndex,
    deviceItems,
    isVirtual,
    virtualDevice,
    connectedDeviceIndex,
  } = props;
  return (
    <Style>
      <div className="neuronConnection">
        <NeuronStatus
          loading={loading ? "loading" : undefined}
          connected={connected}
          connectedDevice={connectedDeviceIndex}
          scanFoundDevices={scanFoundDevices}
          deviceItems={deviceItems.length}
          selectedPortIndex={selectedPortIndex}
          isVirtual={isVirtual}
        />
        {isVirtual ? (
          <div className="neuronInformation">
            <Heading renderAs="h2" headingLevel={2}>
              {i18n.keyboardSelect.selectPrompt}
            </Heading>
            <div className="activeVirtualKeyboard">
              <div className="activeVirtualKeyboardIcon">
                <IconConnected />
              </div>
              <div className="activeVirtualKeyboardName">
                <div className="activeVirtualKeyboardModel">
                  {virtualDevice.device.info.vendor} {virtualDevice.device.info.product} {virtualDevice.device.info.keyboardType}
                </div>
                <div className="activeVirtualKeyboardType">Virtual keyboard</div>
              </div>
            </div>
            <div className="buttons flex gap-2">
              <Button variant="secondary" onClick={onDisconnect}>
                {i18n.keyboardSelect.disconnect}
              </Button>
            </div>
          </div>
        ) : (
          <div className="neuronInformation">
            {!deviceItems.length && !connected ? (
              <>
                <Heading renderAs="h2" headingLevel={2} variant="warning">
                  {i18n.keyboardSelect.noDevices}
                </Heading>
                <p className="neuronSubtileText">{i18n.keyboardSelect.noDevicesSubtitle}</p>
              </>
            ) : (
              ""
            )}

            {deviceItems.length > 0 ? (
              <>
                <Heading renderAs="h2" headingLevel={2}>
                  {i18n.keyboardSelect.selectPrompt}
                </Heading>
                <SelectKeyboardDropdown
                  deviceItems={deviceItems}
                  selectPort={selectPort}
                  connected={connected}
                  connectedDevice={connectedDeviceIndex}
                />
              </>
            ) : (
              ""
            )}
            <div className="buttons flex gap-2">
              <Button
                disabled={scanFoundDevices}
                variant={`${connected || deviceItems.length > 0 ? "outline" : "primary"}`}
                onClick={scanDevices}
              >
                {i18n.keyboardSelect.scan}
              </Button>

              {connected && connectedDeviceIndex === selectedPortIndex ? (
                <Button variant="purple" onClick={onDisconnect}>
                  {i18n.keyboardSelect.disconnect}
                </Button>
              ) : (
                ""
              )}
              {connected && connectedDeviceIndex !== selectedPortIndex ? (
                <Button variant="primary" onClick={onDisconnectConnect}>
                  {i18n.keyboardSelect.connect}
                </Button>
              ) : (
                ""
              )}
              {!connected && deviceItems.length > 0 ? (
                <Button variant="primary" onClick={onKeyboardConnect}>
                  {i18n.keyboardSelect.connect}
                </Button>
              ) : (
                ""
              )}

              {!deviceItems.length ? (
                <Button variant="primary" onClick={onKeyboardConnect} disabled>
                  {i18n.keyboardSelect.connect}
                </Button>
              ) : (
                ""
              )}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </Style>
  );
}

export default NeuronConnection;

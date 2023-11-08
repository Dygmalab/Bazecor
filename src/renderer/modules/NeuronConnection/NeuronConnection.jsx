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
import Title from "../../component/Title";
import { RegularButton, Button } from "../../component/Button";
import NeuronStatus from "../../component/NeuronStatus";
import { SelectKeyboardDropdown } from "../../component/Select";
import i18n from "../../i18n";

import "react-toastify/dist/ReactToastify.css";
import { IconConnected } from "../../component/Icon";

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
function NeuronConnection({
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
  connectedDevice,
}) {
  return (
    <Style>
      <div className="neuronConnection">
        <NeuronStatus
          loading={loading ? "loading" : undefined}
          connected={connected}
          connectedDevice={connectedDevice}
          scanFoundDevices={scanFoundDevices}
          deviceItems={deviceItems.length}
          selectedPortIndex={selectedPortIndex}
          isVirtual={isVirtual}
        />
        {isVirtual ? (
          <div className="neuronInformation">
            <Title text={i18n.keyboardSelect.selectPrompt} headingLevel={2} />
            <div className="activeVirtualKeyboard">
              <div className="activeVirtualKeyboardIcon">
                <IconConnected />
              </div>
              <div className="activeVirtualKeyboardName">
                <div className="activeVirtualKeyboardModel">
                  {virtualDevice.info.vendor} {virtualDevice.info.product} {virtualDevice.info.keyboardType}
                </div>
                <div className="activeVirtualKeyboardType">Virtual keyboard</div>
              </div>
            </div>
            <div className="buttons">
              <RegularButton
                buttonText={i18n.keyboardSelect.disconnect}
                styles="secondary"
                onClick={onDisconnect}
                disabled={false}
              />
              <Button variant="secondary" onClick={onDisconnect}>
                {i18n.keyboardSelect.disconnect}
              </Button>
            </div>
          </div>
        ) : (
          <div className="neuronInformation">
            {!deviceItems.length ? (
              <>
                <Title text={i18n.keyboardSelect.noDevices} headingLevel={2} type="warning" />
                <p className="neuronSubtileText">{i18n.keyboardSelect.noDevicesSubtitle}</p>
              </>
            ) : (
              ""
            )}

            {deviceItems.length > 0 ? (
              <>
                <Title text={i18n.keyboardSelect.selectPrompt} headingLevel={2} />
                <SelectKeyboardDropdown
                  deviceItems={deviceItems}
                  selectPort={selectPort}
                  selectedPortIndex={selectedPortIndex}
                  connected={connected}
                  connectedDevice={connectedDevice}
                />
              </>
            ) : (
              ""
            )}
            <div className="buttons">
              <Button
                onClick={scanDevices}
                variant={`${connected || deviceItems.length > 0 ? "outline" : "primary"}`}
                disabled={scanFoundDevices}
              >
                {i18n.keyboardSelect.scan}
              </Button>
              {connected && connectedDevice === selectedPortIndex ? (
                <Button variant="purple" onClick={onDisconnect} disabled={false}>
                  {i18n.keyboardSelect.disconnect}
                </Button>
              ) : null}
              {connected && connectedDevice !== selectedPortIndex ? (
                <Button onClick={onDisconnectConnect} variant="primary" disabled={false}>
                  {i18n.keyboardSelect.connect}
                </Button>
              ) : null}
              {!connected && deviceItems.length > 0 ? (
                <Button onClick={onKeyboardConnect} variant="primary" disabled={false}>
                  {i18n.keyboardSelect.connect}
                </Button>
              ) : null}

              {!deviceItems.length ? (
                <Button variant="primary" disabled>
                  {i18n.keyboardSelect.connect}
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
    </Style>
  );
}

export default NeuronConnection;

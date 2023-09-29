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

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

import React, { useState, useEffect, useCallback } from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";
import { ipcRenderer } from "electron";
import Container from "react-bootstrap/Container";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";

import { PageHeader } from "../modules/PageHeader";

import i18n from "../i18n";
import NeuronConnection from "../modules/NeuronConnection";
import ToastMessage from "../component/ToastMessage";

import Store from "../utils/Store";

const store = Store.getStore();

const Styles = Styled.div`
height: 100vh;
.main-container {
  overflow: hidden;
  height: 100vh;
}
.cardButton-wrapper {
  display: block;
  width: 100%;
  text-align: left;
  padding-top: 16px;
  margin-top: 16px;
  border-top: 1px solid ${({ theme }) => theme.styles.virtualKeyboard.cardButtonDivider};
  .cardButton {
    padding: 8px 24px;
    background: ${({ theme }) => theme.styles.virtualKeyboard.cardButtonBackground};
    border-radius: 6px;
    width: 100%;
    .button-link {
      padding-left: 0;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.purple200};
    }
  }
}
.keyboard-select {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .keyboard-row {
    justify-content: center;
    align-items: center;
    display: flex;
    padding-top: 15vh;
    .keyboard-col {
      min-width: 500px;
      max-width: 500px;

      .keyboard-card {
        background: ${({ theme }) => theme.card.background};
        border: none;
        box-shadow: none;
        .loader {
          align-self: center;
          .spinner-border {
            width: 4rem;
            height: 4rem;
          }
        }
        .preview {
          justify-content: center;
          align-items: center;
          display: flex;
          padding: 0px;

          .keyboard {
            justify-content: center;
            align-items: center;
            display: flex;
            svg {
              width: 80%;
              margin-bottom: 10px;
            }
          }
          .options {
            text-align: center;
            .selector {
              width: 100%;
              .dropdown-toggle::after{
                position: absolute;
                right: 10px;
                top: 30px;
              }
              .toggler {
                width: 100%;
                background-color: transparent;
                color: ${({ theme }) => theme.colors.button.text};
                border: 0;
                border-bottom: black 1px solid;
                border-radius: 0px;
                padding-bottom: 6px;
                :hover {
                  background-color: transparent;
                }
              }
              .toggler:hover {
                border-bottom: black 2px solid;
                padding-bottom: 5px;
              }
              .toggler:focus {
                border-bottom: rgba($color: red, $alpha: 0.8) 2px solid;
                box-shadow: none;
              }
              .menu {
                width: inherit;
                justify-content: center;
                align-items: center;
                text-align: center;
              }
              .key-icon {
                background-color: ${({ theme }) => theme.colors.button.background} !important;
                border-radius: 100%;
                padding: 0;
                max-width: 50px;
                height: 50px;
                svg {
                  font-size: 2.1em;
                  margin-top: 18%;
                  width: 100%;
                  color: ${({ theme }) => theme.colors.button.text};
                }
              }
              .key-text {
                span {
                  width: 100%;
                }
              }
              .muted {
                color: rgba(140,140,140,0.8) !important;
              }
              a:hover {
                background-color: ${({ theme }) => theme.colors.button.hover} !important;
              }
              .dropdown-item {
                display: inherit;
              }
            }
            .selector-error {
              color: red;
            }
          }
        }
      }
        .buttons {
          padding: 0px;
          button {
            width: 100%;
          }
        }
    }
  }
}


`;

interface SelectKeyboardProps {
  onConnect: (...args: any[]) => any;
  onDisconnect: any;
  connected: any;
}

const SelectKeyboard: React.FC<SelectKeyboardProps> = (props): JSX.Element => {
  const [state, dispatch] = useDevice();
  const [selectedPortIndex, setSelectedPortIndex] = useState(0);
  const [opening, setOpening] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanFoundDevices, setScanFoundDevices] = useState(false);
  const { onConnect, onDisconnect, connected } = props;

  const findKeyboards = useCallback(async (): Promise<any[]> => {
    setIsLoading(true);
    // if (state.currentDevice !== undefined && isIterable) {
    //   setIsLoading(false);
    //   return [];
    // }
    try {
      const list = await DeviceTools.list();
      dispatch({ type: "addDevicesList", payload: list });
      setIsLoading(false);
      setDevices(list);
      return list;
    } catch (err) {
      console.log("Error while finding keyboards", err);
      setIsLoading(false);
      setDevices([]);
      return [];
    }
  }, [dispatch]);

  // useEffect(() => {
  //   const finder = () => findKeyboards();
  //   const disconnectedfinder = () => {
  //     setSelectedPortIndex(0);
  //     findKeyboards();
  //   };
  //   ipcRenderer.on("usb-connected", finder);
  //   ipcRenderer.on("usb-disconnected", disconnectedfinder);
  //   if (!connected) {
  //     findKeyboards();
  //   }
  //   return () => {
  //     ipcRenderer.removeListener("usb-connected", finder);
  //     ipcRenderer.removeListener("usb-disconnected", disconnectedfinder);
  //   };
  // }, [connected, findKeyboards]);

  useEffect(() => {
    if (connected && state.currentDevice) {
      findKeyboards();
    }
  }, [connected, findKeyboards, state.currentDevice]);

  const scanDevices = async (): Promise<void> => {
    const keyboards = await findKeyboards();
    console.log("found devices!!", keyboards);
    setScanFoundDevices(keyboards?.length > 0);
    setTimeout(() => {
      setScanFoundDevices(false);
    }, 1000);
  };

  const selectPort = (event: any) => {
    // console.log(event);
    setSelectedPortIndex(parseInt(event, 10));
  };

  const onKeyboardConnect = async () => {
    const { deviceList } = state;
    console.log("trying to connect to:", deviceList, selectedPortIndex, deviceList[selectedPortIndex]);
    setOpening(true);
    try {
      const response = await DeviceTools.connect(deviceList[selectedPortIndex]);
      dispatch({ type: "changeCurrent", payload: { selected: selectedPortIndex, device: response } });
      await onConnect();
    } catch (err) {
      setOpening(false);
      const errorMessage = err.toString();
      toast.error(<ToastMessage title={errorMessage} />, { icon: "" });
    }
    (i18n as any).refreshHardware(devices[selectedPortIndex]); // we use any because i18n indeed has that function defined
  };

  const handleOnDisconnect = async () => {
    await state.currentDevice.close();
    await onDisconnect();
  };

  const handleOnDisconnectConnect = async () => {
    await state.currentDevice.close();
    await onDisconnect();
    const delay = ms =>
      new Promise(res => {
        setTimeout(res, ms);
      });
    await delay(500);
    await onKeyboardConnect();
  };

  const getDeviceItems = () => {
    const neurons = store.get("neurons");
    const result = devices.map((device, index) => {
      console.log("checking device :", device);
      if (device.device.bootloader)
        return {
          index,
          displayName: device?.device?.info?.displayName,
          userName: "",
          path: device.path || i18n.keyboardSelect.unknown,
        };
      const preparedSN = device.productId === "2201" ? device.serialNumber.slice(0, 32) : device.serialNumber;
      const neuron = neurons.find(neuron => neuron.id.toLowerCase() === preparedSN.toLowerCase());

      return {
        index,
        displayName: device?.device?.info?.displayName,
        userName: neuron ? neuron.name : "",
        path: device.path || i18n.keyboardSelect.unknown,
      };
    });
    return result;
  };

  let deviceItems = null;
  if (devices && devices.length > 0) {
    deviceItems = getDeviceItems();
  }

  const selectedDevice = devices && devices[selectedPortIndex];
  const connectedDevice = state.selected;
  console.log("Checking connected Data: ", connectedDevice, selectedPortIndex, connected, scanFoundDevices);
  return (
    <Styles>
      <Container fluid className="keyboard-select center-content">
        <PageHeader text={i18n.keyboardSelect.title} />
        <div className="keyboardSelection-wrapper">
          <NeuronConnection
            loading={isLoading}
            scanFoundDevices={scanFoundDevices !== undefined ? scanFoundDevices : false}
            scanDevices={scanDevices}
            cantConnect={(selectedDevice ? !selectedDevice.accessible : false) || opening || (devices && devices.length === 0)}
            onKeyboardConnect={onKeyboardConnect}
            connected={connected}
            onDisconnect={handleOnDisconnect}
            onDisconnectConnect={handleOnDisconnectConnect}
            deviceItems={deviceItems != null ? deviceItems : []}
            selectPort={selectPort}
            selectedPortIndex={selectedPortIndex}
            isVirtual={false}
            virtualDevice={false}
            connectedDevice={connectedDevice}
          />
        </div>
      </Container>
    </Styles>
  );
};

export default SelectKeyboard;

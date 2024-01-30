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

import React, { useState, useEffect, useCallback } from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";
import { ipcRenderer } from "electron";
import Container from "react-bootstrap/Container";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";

import { Banner } from "@Renderer/component/Banner";
import Title from "@Renderer/component/Title";
import { IconBluetooth } from "@Renderer/component/Icon";
import { DeviceItemsType, SelectKeyboardProps } from "@Renderer/types/selectKeyboard";
import { Neuron } from "@Renderer/types/neurons";
import { PageHeader } from "@Renderer/modules/PageHeader";

import { i18n, refreshHardware } from "@Renderer/i18n";
import NeuronConnection from "@Renderer/modules/NeuronConnection";
import ToastMessage from "@Renderer/component/ToastMessage";

import Store from "../utils/Store";
import Device from "../../api/comms/Device";

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

const SelectKeyboard = (props: SelectKeyboardProps) => {
  const [state, dispatch] = useDevice();
  const [selectedPortIndex, setSelectedPortIndex] = useState(0);
  const [devices, setDevices] = useState([]);
  const [deviceItems, setDeviceItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [scanFoundDevices, setScanFoundDevices] = useState(false);
  const { onConnect, onDisconnect, connected } = props;

  const findKeyboards = useCallback(async (): Promise<Device[]> => {
    setIsLoading(true);
    // if (state.currentDevice !== undefined && isIterable) {
    //   setIsLoading(false);
    //   return [];
    // }
    try {
      const list = (await DeviceTools.list()) as Device[];
      dispatch({ type: "addDevicesList", payload: list });
      console.log("Devices Available:", list);
      setIsLoading(false);
      setDevices(list);
      return list;
    } catch (err) {
      console.log("Error while finding keyboards", err);
      setIsLoading(false);
      setDevices(undefined);
      return undefined;
    }
  }, [dispatch]);

  const getDeviceItems: () => Array<DeviceItemsType> = useCallback(() => {
    const neurons = store.get("neurons") as Neuron[];
    const result = devices?.map((dev, index) => {
      // console.log("checking device :", device);
      const devName = dev.type === "hid" ? "Bluetooth" : i18n.keyboardSelect.unknown;
      if (dev.device.bootloader)
        return {
          index,
          displayName: dev?.device?.info?.displayName as string,
          userName: "",
          path: (dev.path || devName) as string,
        };
      const preparedSN = dev.productId === "2201" ? dev.serialNumber.slice(0, 32) : dev.serialNumber;
      const neuron = neurons.find(n => n.id.toLowerCase() === preparedSN.toLowerCase());

      return {
        index,
        displayName: dev?.device?.info?.displayName as string,
        userName: neuron ? neuron.name : "",
        path: (dev.path || devName) as string,
      };
    });
    return result;
  }, [devices]);

  useEffect(() => {
    const finder = () => findKeyboards();

    const disconnectedfinder = () => {
      setSelectedPortIndex(0);
      findKeyboards();
      if (state.currentDevice) {
        state.currentDevice.close();
      }
    };

    ipcRenderer.on("usb-connected", finder);
    ipcRenderer.on("usb-disconnected", disconnectedfinder);

    if (!connected) {
      findKeyboards();
    } else {
      setSelectedPortIndex(state.selected);
    }

    return () => {
      ipcRenderer.removeListener("usb-connected", finder);
      ipcRenderer.removeListener("usb-disconnected", disconnectedfinder);
    };
  }, [connected, findKeyboards, state.currentDevice, state.selected]);

  useEffect(() => {
    if (connected && state.currentDevice) {
      findKeyboards();
    }
  }, [connected, findKeyboards, state.currentDevice]);

  useEffect(() => {
    if (devices) {
      const currentDeviceItems = getDeviceItems() as DeviceItemsType[];
      setDeviceItems(currentDeviceItems);
    }
  }, [devices, getDeviceItems]);

  const scanDevices = async (): Promise<void> => {
    const keyboards = await findKeyboards();
    console.log("found devices!!", keyboards);
    setScanFoundDevices(keyboards?.length > 0);
    setTimeout(() => {
      setScanFoundDevices(false);
    }, 1000);
  };

  const selectPort = (event: string) => {
    // console.log(event);
    setSelectedPortIndex(parseInt(event, 10));
  };

  const onKeyboardConnect = async () => {
    const { deviceList } = state;
    console.log("trying to connect to:", deviceList, selectedPortIndex, deviceList[selectedPortIndex]);
    try {
      const response = await DeviceTools.connect(deviceList[selectedPortIndex]);
      console.log("GOING TO CONNECT TO!!", selectedPortIndex, response);
      dispatch({ type: "changeCurrent", payload: { selected: selectedPortIndex, device: response } });
      await onConnect(response);
    } catch (err) {
      const errorMessage = err.toString();
      toast.error(<ToastMessage title={errorMessage} />, { icon: "" });
    }
    refreshHardware(devices[selectedPortIndex]); // we use any because i18n indeed has that function defined
  };

  const handleOnDisconnect = async () => {
    await onDisconnect(state.currentDevice);
  };

  const handleOnDisconnectConnect = async () => {
    await onDisconnect(state.currentDevice);
    const delay = (ms: number) =>
      new Promise(res => {
        setTimeout(res, ms);
      });
    await delay(500);
    await onKeyboardConnect();
  };

  const connectedDeviceIndex = state.selected;
  // console.log("Checking connected Data: ", connectedDevice, selectedPortIndex, connected, scanFoundDevices);

  return (
    <Styles>
      <Container fluid className="keyboard-select center-content">
        <PageHeader text={i18n.keyboardSelect.title} />
        <div className="keyboardSelection-wrapper">
          <NeuronConnection
            loading={isLoading}
            scanFoundDevices={scanFoundDevices !== undefined ? scanFoundDevices : false}
            scanDevices={scanDevices}
            onKeyboardConnect={onKeyboardConnect}
            connected={connected}
            onDisconnect={handleOnDisconnect}
            onDisconnectConnect={handleOnDisconnectConnect}
            deviceItems={deviceItems}
            selectPort={selectPort}
            selectedPortIndex={selectedPortIndex}
            isVirtual={false}
            virtualDevice={undefined}
            connectedDeviceIndex={connectedDeviceIndex}
          />
          <div className="card-alert" style={{ marginTop: "16px" }}>
            <Banner icon={<IconBluetooth />} variant="warning">
              <Title text="Defy owners!" headingLevel={5} />
              <p
                style={{ maxWidth: "610px" }}
                dangerouslySetInnerHTML={{ __html: i18n.keyboardSelect.HIDReminderOfManuallyScan }}
              />
            </Banner>
          </div>
        </div>
      </Container>
    </Styles>
  );
};

export default SelectKeyboard;

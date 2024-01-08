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

import React, { useState, useEffect, useMemo, useCallback } from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";
import fs from "fs";
import path from "path";
import { ipcRenderer } from "electron";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";

import Dropdown from "react-bootstrap/Dropdown";
import { USBDevice, USBDeviceDescriptor, NonSerialDeviceDescriptor } from "@Renderer/types/devices";
import { Banner } from "@Renderer/component/Banner";
import { PageHeader } from "../modules/PageHeader";
import { RegularButton } from "../component/Button";

import Focus from "../../api/focus";
import Hardware from "../../api/hardware";
import { RaiseISO, RaiseANSI, DefyWired, DefyWireless, enumerator } from "../../api/hardware-virtual";

import i18n from "../i18n";
import NeuronConnection from "../modules/NeuronConnection";
import ToastMessage from "../component/ToastMessage";

import { IconArrowRight, IconCloudDownload, IconUpload, IconKeyboard, IconBluetooth } from "../component/Icon";
import Title from "../component/Title";
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
  connected: any;
  onDisconnect: any;
  device: any;
  loading: boolean;
  setLoading: (loading) => unknown;
}

const SelectKeyboard: React.FC<SelectKeyboardProps> = (props): React.JSX.Element => {
  const [selectedPortIndex, setSelectedPortIndex] = useState(0);
  const [opening, setOpening] = useState(false);
  const [devices, setDevices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showVirtualKeyboardModal, setShowVirtualKeyboardModal] = useState(false);
  const [selectedVirtualKeyboard, setSelectedVirtualKeyboard] = useState(0);
  const [scanFoundDevices, setScanFoundDevices] = useState(false);
  const focus = useMemo(() => new Focus(), []);
  const { onConnect, connected, device, onDisconnect, loading, setLoading } = props;

  const findNonSerialKeyboards = useCallback(async (deviceList: any[]) => {
    const connectedDevices: USBDevice[] = await ipcRenderer.invoke("usb-devices");
    const nonSerialDeviceList = Hardware.nonSerial;
    let connectedDeviceData: USBDeviceDescriptor;
    let nonSerialDeviceData: NonSerialDeviceDescriptor;
    connectedDevices.forEach(connectedDevice => {
      connectedDeviceData = connectedDevice.deviceDescriptor;
      nonSerialDeviceList.forEach(nonSerialDevice => {
        nonSerialDeviceData = nonSerialDevice.usb;
        if (
          connectedDeviceData.idVendor === nonSerialDeviceData.vendorId &&
          connectedDeviceData.idProduct === nonSerialDeviceData.productId
        ) {
          let found = false;
          deviceList.forEach(sDevice => {
            if (
              sDevice.device.usb.vendorId === connectedDeviceData.idVendor &&
              sDevice.device.usb.productId === connectedDeviceData.idProduct
            ) {
              found = true;
            }
          });
          if (!found) deviceList.push({ device: nonSerialDevice });
        }
      });
    });
    return deviceList;
  }, []);

  const findKeyboards = useCallback(async (): Promise<any[]> => {
    setLoading(true);
    setIsLoading(true);
    const isIterable = devices.length > 0 && typeof devices[Symbol.iterator] === "function";
    if (focus.closed === false && isIterable) {
      setIsLoading(false);
      setLoading(false);
      return [];
    }
    // if (!focus.closed && device) {
    //   setDevices([device]);
    //   return [];
    // }
    try {
      const serialDevices = await focus.find(...Hardware.serial);
      // console.log("Printing devices: ", serialDevices);
      const supportedDevices = [];
      let device;
      for (let i = 0; i < serialDevices.length; i += 1) {
        device = serialDevices[i];
        /* eslint-disable no-await-in-loop */
        device.accessible = await focus.isDeviceAccessible(device);
        // console.log("before checking device supported", device, focus);
        if (device.accessible && (await focus.isDeviceSupported(device))) {
          supportedDevices.push(device);
        } else if (!device.accessible) {
          supportedDevices.push(device);
        }
        /* eslint-disable no-await-in-loop */
      }
      console.log("Supported devices", supportedDevices);
      const list = await findNonSerialKeyboards(supportedDevices);
      console.log("Non serial keyboards", list);
      setIsLoading(false);
      setLoading(false);
      setDevices(list);
      if (connected) {
        const connectedDev = list.findIndex(dev => focus.serialNumber?.includes(dev.serialNumber));
        // console.log("check connected", connectedDev);
        setSelectedPortIndex(connectedDev);
      } else if (list.length > 0) {
        setSelectedPortIndex(0);
      } else {
        setSelectedPortIndex(-1);
      }

      return list;
    } catch (err) {
      console.log("Error while finding keyboards", err);
      const list = await findNonSerialKeyboards([]);
      console.log("Non serial keyboards", list);
      setIsLoading(false);
      setLoading(false);
      setDevices(list);
      return list;
    }
  }, [findNonSerialKeyboards, device, focus]);

  useEffect(() => {
    const finder = () => findKeyboards();
    const disconnectedfinder = () => {
      setSelectedPortIndex(0);
      findKeyboards();
    };
    ipcRenderer.on("usb-connected", finder);
    ipcRenderer.on("usb-disconnected", disconnectedfinder);
    if (!connected) {
      findKeyboards();
    }
    return () => {
      ipcRenderer.removeListener("usb-connected", finder);
      ipcRenderer.removeListener("usb-disconnected", disconnectedfinder);
    };
  }, [connected, findKeyboards]);

  useEffect(() => {
    if (connected && device) {
      findKeyboards();
    }
  }, [connected, device, findKeyboards]);

  const scanDevices = async (): Promise<void> => {
    const keyboards = await findKeyboards();
    setScanFoundDevices(keyboards?.length > 0);
    setTimeout(() => {
      setScanFoundDevices(false);
    }, 1000);
  };

  const toggleVirtualKeyboardModal = (): void => {
    setShowVirtualKeyboardModal(currentValue => !currentValue);
  };

  const selectVirtualKeyboard = (event: any) => {
    // console.log(event);
    setSelectedVirtualKeyboard(event);
  };

  const selectPort = (event: any) => {
    // console.log(event);
    setSelectedPortIndex(parseInt(event, 10));
  };

  const onKeyboardConnect = async () => {
    setLoading(true);
    setOpening(true);
    try {
      if (!devices[selectedPortIndex].path) {
        devices[selectedPortIndex].device.device = devices[selectedPortIndex].device;
      }
      const focus = new Focus();
      focus.serialNumber = devices[selectedPortIndex].serialNumber;
      await onConnect(devices[selectedPortIndex], null);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setOpening(false);
      const errorMessage = err.toString();
      toast.error(<ToastMessage title={errorMessage} />, { icon: "" });
    }
    (i18n as any).refreshHardware(devices[selectedPortIndex]); // we use any because i18n indeed has that function defined
  };

  const convertBackupToVK = async (backup: any): any => {
    let vk;
    let fileName;

    Hardware.serial.forEach(hardwareDevice => {
      if (
        backup.neuron.device.usb.productId === hardwareDevice.usb.productId &&
        backup.neuron.device.usb.vendorId === hardwareDevice.usb.vendorId &&
        backup.neuron.device.info.keyboardType === hardwareDevice.info.keyboardType
      ) {
        if (hardwareDevice.info.keyboardType === "ANSI") {
          vk = { ...RaiseANSI };
          fileName = "VirtualRaiseANSI";
        }
        if (hardwareDevice.info.keyboardType === "ISO") {
          vk = { ...RaiseISO };
          fileName = "VirtualRaiseISO";
        }
        if (hardwareDevice.info.keyboardType === "wired") {
          vk = { ...DefyWired };
          fileName = "VirtualDefy";
        }
        // TODO: replace this DEFY with the wireless version
        if (hardwareDevice.info.keyboardType === "wireless") {
          vk = { ...DefyWireless };
          fileName = "VirtualDefy";
        }
        vk.device.components = hardwareDevice.components;
      }
    });

    backup.backup.forEach(line => {
      if (vk.virtual[line.command] !== undefined) {
        vk.virtual[line.command].data = line.data;
      } else {
        vk.virtual[line.command] = { data: line.data, eraseable: true };
      }
    });

    // Ask the user for the place to put the backup

    const options = {
      title: i18n.keyboardSelect.virtualKeyboard.newTitle,
      buttonLabel: i18n.keyboardSelect.virtualKeyboard.buttonLabelSave,
      defaultPath: path.join(store.get("settings.backupFolder"), `${fileName}.json`),
      filters: [{ name: "Json", extensions: ["json"] }],
    };
    const newPath = await ipcRenderer.invoke("save-dialog", options);
    console.log("Save file to", newPath);
    if (newPath === undefined) {
      toast.warning("Path not defined! aborting...", {
        autoClose: 2000,
        icon: "",
      });
      return;
    }
    // Save the virtual KB in the specified location
    const json = JSON.stringify(vk, null, 2);
    fs.writeFileSync(newPath, json, err => {
      if (err) {
        console.error(err);
        throw err;
      }
    });

    vk.device.path = "VIRTUAL";
    vk.device.bootloader = false;
    vk.device.filePath = newPath;
    return vk;
  };

  const getDateTime = () => {
    const d = new Date();
    return `-${
      d.getFullYear() +
      `0${d.getMonth() + 1}`.slice(-2) +
      `0${d.getDate()}`.slice(-2) +
      `0${d.getHours()}`.slice(-2) +
      `0${d.getMinutes()}`.slice(-2) +
      `0${d.getSeconds()}`.slice(-2)
    }`;
  };

  const onLoadFile = async () => {
    // Read a file that is a backup
    const options = {
      title: i18n.keyboardSelect.virtualKeyboard.useTitle,
      buttonLabel: i18n.keyboardSelect.virtualKeyboard.buttonLabel,
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: i18n.dialog.allFiles, extensions: ["*"] },
      ],
    };
    const data = await ipcRenderer.invoke("open-dialog", options);
    let filePath;
    if (!data.canceled) {
      [filePath] = data.filePaths;
    } else {
      console.log("user closed file connect dialog");
      return;
    }
    console.log("Opening file", filePath);
    // Open the file and load it's contents
    let file;
    try {
      file = JSON.parse(fs.readFileSync(filePath));
      // console.log(file);
      // console.log("loaded backup", file.device.info.product + " " + file.device.info.keyboardType, file.virtual.version.data);
      if (!file.virtual && !file.backup) throw Error("not a valid file, no virtual or backup objects");
    } catch (e) {
      console.error(e);
      window.alert(i18n.keyboardSelect.virtualKeyboard.errorLoadingFile);
      return;
    }
    if (!file.virtual && file.backup) {
      if (!window.confirm(i18n.keyboardSelect.virtualKeyboard.backupTransform)) {
        return;
      }
      file = await convertBackupToVK(file);
      file.virtual["hardware.chip_id"].data += getDateTime();
      await onConnect(file.device, file);
      return;
    }

    Hardware.serial.forEach(localDevice => {
      if (
        file.device.usb.productId === localDevice.usb.productId &&
        file.device.usb.vendorId === localDevice.usb.vendorId &&
        file.device.info.keyboardType === localDevice.info.keyboardType
      ) {
        file.device.components = localDevice.components;
      }
    });

    file.device.path = "VIRTUAL";
    file.device.bootloader = false;
    file.device.filePath = filePath;
    await onConnect(file.device, file);
  };

  const newFile = async (virtualKeyboard, fileName: string) => {
    // Ask the user for the place to put the backup
    const options = {
      title: i18n.keyboardSelect.virtualKeyboard.newTitle,
      buttonLabel: i18n.keyboardSelect.virtualKeyboard.buttonLabelSave,
      defaultPath: path.join(store.get("settings.backupFolder"), `${fileName}.json`),
      filters: [{ name: "Json", extensions: ["json"] }],
    };
    const newPath = await ipcRenderer.invoke("save-dialog", options);
    console.log("Save file to", newPath);
    if (newPath === undefined) {
      toast.warning("Path not defined! aborting...");
      return;
    }
    console.log("Exchange focus for file access");
    Hardware.serial.forEach(localDevice => {
      if (
        virtualKeyboard.device.usb.productId === localDevice.usb.productId &&
        virtualKeyboard.device.usb.vendorId === localDevice.usb.vendorId &&
        virtualKeyboard.device.info.keyboardType === localDevice.info.keyboardType
      ) {
        virtualKeyboard.device.components = localDevice.components;
      }
    });

    virtualKeyboard.device.path = "VIRTUAL";
    virtualKeyboard.device.bootloader = false;
    virtualKeyboard.device.filePath = newPath;
    virtualKeyboard.virtual["hardware.chip_id"].data += getDateTime();

    // Retarded virtualKeyboard storage to save ti with new hardware.chipID
    // Save the virtual KB in the specified location
    const json = JSON.stringify(virtualKeyboard, null, 2);
    fs.writeFileSync(newPath, json, err => {
      if (err) {
        console.error(err);
        throw err;
      }
    });

    // Final connection function
    await onConnect(virtualKeyboard.device, virtualKeyboard);
  };

  const handleOnDisconnect = async () => {
    await onDisconnect();
  };

  const handleOnDisconnectConnect = async () => {
    await onDisconnect();
    const delay = ms => new Promise(res => setTimeout(res, ms));
    await delay(500);
    await onKeyboardConnect();
  };

  const getDeviceItems = () => {
    const neurons = store.get("neurons");
    const result = devices.map((localDevice, index) => {
      console.log("checking device :", localDevice);
      if (localDevice.device.bootloader)
        return {
          index,
          displayName: localDevice?.device?.info?.displayName,
          userName: "",
          path: localDevice.path || i18n.keyboardSelect.unknown,
        };
      const preparedSN = localDevice.productId === "2201" ? localDevice.serialNumber.slice(0, 32) : localDevice.serialNumber;
      const neuron = Array.isArray(neurons) ? neurons.find(n => n.id.toLowerCase() === preparedSN.toLowerCase()) : { name: "" };

      return {
        index,
        displayName: localDevice?.device?.info?.displayName,
        userName: neuron ? neuron.name : "",
        path: localDevice.path || i18n.keyboardSelect.unknown,
      };
    });
    return result;
  };

  let deviceItems = null;
  if (devices && devices.length > 0) {
    deviceItems = getDeviceItems();
  }

  const selectedDevice = devices && devices[selectedPortIndex];
  const connectedDevice = devices && devices.findIndex(dev => focus.serialNumber?.includes(dev.serialNumber));
  // console.log("Checking connected Data: ", connectedDevice, selectedPortIndex);
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
            isVirtual={focus.file}
            virtualDevice={focus.device}
            connectedDevice={connectedDevice}
          />
          <div className="card-alert" style={{ marginTop: "16px" }}>
            <Banner icon={<IconBluetooth />} variant="warning">
              <Title text="Defy owners!" headingLevel={5} />
              <p style={{ maxWidth: "610px" }}>
                To configure your keyboard using Bazecor, you must connect your keyboard either{" "}
                <strong>through cables or RF (Radio Frequency).</strong> This is necessary to establish the initial connection and
                settings.
              </p>
            </Banner>
          </div>
          <div className="cardButton-wrapper">
            <div className="cardButton">
              <RegularButton
                buttonText={i18n.keyboardSelect.virtualKeyboard.buttonText}
                styles="button-link transp-bg"
                icoSVG={<IconArrowRight />}
                icoPosition="right"
                size="sm"
                onClick={() => {
                  toggleVirtualKeyboardModal();
                }}
              />
            </div>
            <Modal
              show={showVirtualKeyboardModal}
              size="lg"
              onHide={() => toggleVirtualKeyboardModal()}
              aria-labelledby="contained-modal-title-vcenter"
              centered
            >
              <Modal.Header closeButton>
                <Modal.Title>{i18n.keyboardSelect.virtualKeyboard.modaltitle}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <div className="virtualKeyboards-wrapper">
                  <div className="virtualKeyboards-col">
                    <Title
                      text={i18n.keyboardSelect.virtualKeyboard.newVirtualKeyboardTitle}
                      headingLevel={4}
                      svgICO={<IconCloudDownload />}
                    />
                    <p>{i18n.keyboardSelect.virtualKeyboard.newVirtualKeyboardDescription}</p>
                    <label>{i18n.keyboardSelect.virtualKeyboard.newVirtualKeyboardLabel}</label>
                    <Dropdown className="custom-dropdown" onSelect={selectVirtualKeyboard}>
                      <Dropdown.Toggle id="dropdown-custom">
                        <div className="dropdownItemSelected">
                          <div className="dropdownIcon">
                            <IconKeyboard />
                          </div>
                          <div className="dropdownItem">{enumerator[selectedVirtualKeyboard].device.info.displayName}</div>
                        </div>
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="super-colors virtualKeyboardsMenu">
                        {enumerator.map((item, index) => (
                          <Dropdown.Item
                            eventKey={index}
                            key={`${item.device.info.displayName}-dropdown`}
                            className={`${selectedVirtualKeyboard === index ? "active" : ""}`}
                          >
                            <div className="dropdownInner">
                              <div className="dropdownIcon">
                                <IconKeyboard />
                              </div>
                              <div className="dropdownItem">{item?.device?.info?.displayName}</div>
                            </div>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                    <RegularButton
                      buttonText={i18n.keyboardSelect.virtualKeyboard.createButtonLabel}
                      styles="primary"
                      onClick={() => {
                        let fileName = enumerator[selectedVirtualKeyboard].device.info.product;
                        fileName =
                          fileName === "Defy"
                            ? `Virtual${fileName}`
                            : `Virtual${fileName}${enumerator[selectedVirtualKeyboard].device.info.keyboardType}`;
                        newFile(enumerator[selectedVirtualKeyboard], fileName);
                      }}
                    />
                  </div>
                  <div className="virtualKeyboards-col virtualKeyboards-col--text">
                    <span>OR</span>
                  </div>
                  <div className="virtualKeyboards-col">
                    <Title
                      text={i18n.keyboardSelect.virtualKeyboard.loadVirtualKeyboardTitle}
                      headingLevel={4}
                      svgICO={<IconUpload />}
                    />
                    <p>{i18n.keyboardSelect.virtualKeyboard.loadVirtualKeyboardDescription}</p>
                    <RegularButton buttonText={i18n.general.loadFile} styles="primary" onClick={() => onLoadFile()} />
                  </div>
                </div>
              </Modal.Body>
            </Modal>
          </div>
        </div>
      </Container>
    </Styles>
  );
};

export default SelectKeyboard;

/* eslint-disable no-console */
import React, { useState } from "react";
import { Dropdown, Modal } from "react-bootstrap";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";
import path from "path";
import fs from "fs";

import { IconArrowRight, IconCloudDownload, IconKeyboard, IconUpload } from "@Renderer/component/Icon";
import { RegularButton } from "@Renderer/component/Button";
import Title from "@Renderer/component/Title";
import { i18n } from "@Renderer/i18n";

import { VirtualType } from "@Renderer/types/devices";
import { BackupType } from "@Renderer/types/backups";

import Hardware from "../../../api/hardware";
import { RaiseISO, RaiseANSI, DefyWired, DefyWireless, Raise2ANSI, Raise2ISO, enumerator } from "../../../api/hardware-virtual";
import Store from "../../utils/Store";
import { isVirtualType } from "../../../api/comms/virtual";
import Backup from "../../../api/backup";

const store = Store.getStore();

interface VirtualSelectorProps {
  handleVirtualConnect: (file: any) => void;
}

export default function VirtualSelector(props: VirtualSelectorProps) {
  const [showVirtualKeyboardModal, setShowVirtualKeyboardModal] = useState(false);
  const [selectedVirtualKeyboard, setSelectedVirtualKeyboard] = useState(0);
  const { handleVirtualConnect } = props;

  const toggleVirtualKeyboardModal = (): void => {
    setShowVirtualKeyboardModal(currentValue => !currentValue);
  };

  const selectVirtualKeyboard = (event: string) => {
    // console.log(event);
    setSelectedVirtualKeyboard(parseInt(event, 10));
  };

  const convertBackupToVK = async (backup: BackupType) => {
    let vk: VirtualType;
    let fileName;

    Hardware.serial.forEach(hardwareDevice => {
      if (
        backup.neuron.device.usb.productId === hardwareDevice.usb.productId &&
        backup.neuron.device.usb.vendorId === hardwareDevice.usb.vendorId &&
        backup.neuron.device.info.keyboardType === hardwareDevice.info.keyboardType
      ) {
        if (hardwareDevice.info.keyboardType === "ANSI") {
          if (hardwareDevice.info.product === "Raise2") {
            vk = { ...Raise2ANSI };
            fileName = "VirtualRaise2ANSI";
          } else {
            vk = { ...RaiseANSI };
            fileName = "VirtualRaiseANSI";
          }
        }
        if (hardwareDevice.info.keyboardType === "ISO") {
          if (hardwareDevice.info.product === "Raise2") {
            vk = { ...Raise2ISO };
            fileName = "VirtualRaise2ISO";
          } else {
            vk = { ...RaiseISO };
            fileName = "VirtualRaiseISO";
          }
          vk = { ...RaiseISO };
        }
        if (hardwareDevice.info.keyboardType === "wired") {
          vk = { ...DefyWired };
          fileName = "VirtualDefy";
        }
        if (hardwareDevice.info.keyboardType === "wireless") {
          vk = { ...DefyWireless };
          fileName = "VirtualDefy";
        }
        vk.device.components = hardwareDevice.components;
      }
    });

    backup.backup.forEach((line: any) => {
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
      defaultPath: path.join(store.get("settings.backupFolder") as string, `${fileName}.json`),
      filters: [{ name: "Json", extensions: ["json"] }],
    };
    const newPath = await ipcRenderer.invoke("save-dialog", options);
    console.log("Save file to", newPath);
    if (newPath === undefined) {
      toast.warning("Path not defined! aborting...", {
        autoClose: 2000,
        icon: "",
      });
      return undefined;
    }
    // Save the virtual KB in the specified location
    const json = JSON.stringify(vk, null, 2);
    try {
      fs.writeFileSync(newPath, json);
    } catch (error) {
      console.error(error);
      throw error;
    }

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
    let file: VirtualType | BackupType;
    try {
      file = JSON.parse(fs.readFileSync(filePath).toString("utf-8")) as VirtualType | BackupType;
      // console.log(file);
      // console.log("loaded backup", file.device.info.product + " " + file.device.info.keyboardType, file.virtual.version.data);
      if (!isVirtualType(file) && !Backup.isBackupType(file)) throw Error("not a valid file, no virtual or backup objects");
    } catch (e) {
      console.error(e);
      window.alert(i18n.keyboardSelect.virtualKeyboard.errorLoadingFile);
      return;
    }
    if (!isVirtualType(file) && Backup.isBackupType(file)) {
      if (!window.confirm(i18n.keyboardSelect.virtualKeyboard.backupTransform)) {
        return;
      }
      file = await convertBackupToVK(file);
      file.virtual["hardware.chip_id"].data += getDateTime();
      handleVirtualConnect(file);
      return;
    }
    if (isVirtualType(file)) {
      Hardware.serial.forEach((localDevice: any) => {
        if (
          (file as VirtualType).device.usb.productId === localDevice.usb.productId &&
          (file as VirtualType).device.usb.vendorId === localDevice.usb.vendorId &&
          (file as VirtualType).device.info.keyboardType === localDevice.info.keyboardType
        ) {
          (file as VirtualType).device.components = localDevice.components;
        }
      });

      file.device.path = "VIRTUAL";
      file.device.bootloader = false;
      file.device.filePath = filePath;
      handleVirtualConnect(file);
    }
  };

  const newFile = async (virtualKeyboard: VirtualType, fileName: string) => {
    const newVK = { ...virtualKeyboard };
    // Ask the user for the place to put the backup
    const options = {
      title: i18n.keyboardSelect.virtualKeyboard.newTitle,
      buttonLabel: i18n.keyboardSelect.virtualKeyboard.buttonLabelSave,
      defaultPath: path.join(store.get("settings.backupFolder") as string, `${fileName}.json`),
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
        newVK.device.usb.productId === localDevice.usb.productId &&
        newVK.device.usb.vendorId === localDevice.usb.vendorId &&
        newVK.device.info.keyboardType === localDevice.info.keyboardType
      ) {
        newVK.device.components = localDevice.components;
      }
    });

    newVK.device.path = "VIRTUAL";
    newVK.device.bootloader = false;
    newVK.device.filePath = newPath;
    newVK.virtual["hardware.chip_id"].data += getDateTime();

    // Retarded virtualKeyboard storage to save ti with new hardware.chipID
    // Save the virtual KB in the specified location
    const json = JSON.stringify(newVK, null, 2);
    try {
      fs.writeFileSync(newPath, json);
    } catch (error) {
      console.error(error);
      throw error;
    }

    // Final connection function
    handleVirtualConnect(newVK);
  };

  return (
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
              <h3>{i18n.keyboardSelect.virtualKeyboard.newVirtualKeyboardLabel}</h3>
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
                      eventKey={index.toString()}
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
  );
}

import React, { useState, useEffect } from "react";
import Slider from "@appigram/react-rangeslider";
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";
import fs from "fs";

// React Bootstrap Components
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Own Components
import { useDevice } from "@Renderer/DeviceContext";
import ToastMessage from "@Renderer/component/ToastMessage";
import i18n from "@Renderer/i18n";
import Title from "@Renderer/component/Title";
import BackupFolderConfigurator from "@Renderer/modules/BackupFolderConfigurator";

// Icons Imports
import { IconArrowDownWithLine, IconFloppyDisk } from "@Renderer/component/Icon";

// Utils
import Store from "@Renderer/utils/Store";

const store = Store.getStore();

interface BackupSettingsProps {
  connected: boolean;
  neurons: any;
  neuronID: string;
}

const BackupSettings = (props: BackupSettingsProps) => {
  const [backupFolder, setBackupFolder] = useState("");
  const [storeBackups, setStoreBackups] = useState(13);
  const [state] = useDevice();
  const { connected, neurons, neuronID } = props;
  useEffect(() => {
    setBackupFolder(store.get("settings.backupFolder") as string);
    setStoreBackups(store.get("settings.backupFrequency") as number);
  }, []);

  const ChooseBackupFolder = async () => {
    const options = {
      title: i18n.keyboardSettings.backupFolder.title,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowButton,
      properties: ["openDirectory"],
    };

    const resp = await ipcRenderer.invoke("open-dialog", options);

    if (!resp.canceled) {
      console.log(resp.filePaths);
      setBackupFolder(resp.filePaths[0]);
      store.set("settings.backupFolder", `${resp.filePaths[0]}`);
    } else {
      console.log("user closed backup folder dialog");
    }
  };

  const restoreBackup = async (backup: any) => {
    let data = [];
    if (Array.isArray(backup)) {
      data = backup;
    } else {
      data = backup.backup;
      const localNeurons = [...neurons];
      const index = localNeurons.findIndex(n => n.id === neuronID);
      localNeurons[index] = backup.neuron;
      localNeurons[index].id = neuronID;
      store.set("neurons", localNeurons);
    }
    if (state.currentDevice) {
      try {
        for (let i = 0; i < data.length; i += 1) {
          let val = data[i].data;
          // Boolean values needs to be sent as int
          if (typeof val === "boolean") {
            val = +val;
          }
          // TODO: remove this block when necessary
          if (state.currentDevice.device.info.product === "Defy") {
            // if (data[i].command.includes("macros") || data[i].command.includes("superkeys")) continue;
          }
          console.log(`Going to send ${data[i].command} to keyboard`);
          // eslint-disable-next-line no-await-in-loop
          await state.currentDevice.command(`${data[i].command} ${val}`.trim());
        }
        await state.currentDevice.command("led.mode 0");
        console.log("Restoring all settings");
        console.log("Firmware update OK");
        toast.success(
          <ToastMessage
            title="Backup restored successfully"
            content="Your backup was restored successfully to the device!"
            icon={<IconArrowDownWithLine />}
          />,
          {
            autoClose: 2000,
            icon: "",
          },
        );
        return true;
      } catch (e) {
        console.log(`Restore settings: Error: ${e.message}`);
        return false;
      }
    }
    return false;
  };

  const restoreVirtual = async (virtual: any) => {
    if (state.currentDevice) {
      try {
        console.log("Restoring all settings");
        for (const command in virtual) {
          if (virtual[command].eraseable === true) {
            console.log(`Going to send ${command} to keyboard`);
            // eslint-disable-next-line no-await-in-loop
            await state.currentDevice.command(`${command} ${virtual[command].data}`.trim());
          }
        }
        await state.currentDevice.command("led.mode 0");
        console.log("Settings restored OK");
        toast.success(
          <ToastMessage
            title="Backup restored successfully"
            content="Your backup was restored successfully to the device!"
            icon={<IconArrowDownWithLine />}
          />,
          {
            autoClose: 2000,
            icon: "",
          },
        );
        return true;
      } catch (e) {
        console.log(`Restore settings: Error: ${e.message}`);
        return false;
      }
    }
    return false;
  };

  const GetBackup = async () => {
    const options = {
      title: i18n.keyboardSettings.backupFolder.restoreTitle,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowRestore,
      defaultPath: backupFolder,
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: i18n.dialog.allFiles, extensions: ["*"] },
      ],
    };

    const resp = await ipcRenderer.invoke("open-dialog", options);

    if (!resp.canceled) {
      console.log(resp.filePaths);
      let loadedFile;
      try {
        loadedFile = JSON.parse(fs.readFileSync(resp.filePaths[0], "utf-8"));
        if (loadedFile.virtual !== undefined) {
          restoreVirtual(loadedFile.virtual);
          console.log("Restored Virtual backup");
          return;
        }
        if (loadedFile.backup !== undefined || loadedFile[0].command !== undefined) {
          restoreBackup(loadedFile);
          console.log("Restored normal backup");
        }
      } catch (e) {
        console.error(e);
        alert("The file is not a valid global backup");
      }
    } else {
      console.log("user closed SaveDialog");
    }
  };

  const onSetStoreBackups = (value: any) => {
    console.log("changed backup period to: ", value);
    setStoreBackups(value);
    store.set("settings.backupFrequency", value);
  };

  return (
    <Card className="overflowFix card-preferences mt-4">
      <Card.Title>
        <Title text={i18n.keyboardSettings.backupFolder.header} headingLevel={3} svgICO={<IconFloppyDisk />} />
      </Card.Title>
      <Card.Body className="pb-0">
        <Form.Group controlId="backupFolder" className="mb-0">
          <Row>
            <Col>
              <BackupFolderConfigurator
                chooseBackupFolder={ChooseBackupFolder}
                getBackup={GetBackup}
                backupFolder={backupFolder}
                connected={connected}
              />
            </Col>
          </Row>
          <Row>
            <Col className="mt-3">
              <Form.Label>{i18n.keyboardSettings.backupFolder.storeTime}</Form.Label>
            </Col>
          </Row>
          <Row>
            <Col xs={2} className="p-0 text-center align-self-center">
              <span className="tagsfix">1 month</span>
            </Col>
            <Col xs={8} className="px-1">
              <Slider min={0} max={13} step={1} value={storeBackups} onChange={onSetStoreBackups} />
            </Col>
            <Col xs={2} className="p-0 text-center align-self-center">
              <span className="tagsfix">Forever</span>
            </Col>
          </Row>
        </Form.Group>
      </Card.Body>
    </Card>
  );
};

export default BackupSettings;

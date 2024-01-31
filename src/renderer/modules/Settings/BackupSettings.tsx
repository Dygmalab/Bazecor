/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
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
import { ipcRenderer } from "electron";
import { toast } from "react-toastify";
import fs from "fs";
import path from "path";

// React Bootstrap Components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";

// Own Components
import { useDevice } from "@Renderer/DeviceContext";
import ToastMessage from "@Renderer/component/ToastMessage";
import { i18n } from "@Renderer/i18n";
import { RegularButton } from "@Renderer/component/Button";

// Icons Imports
import { IconArrowDownWithLine, IconFloppyDisk } from "@Renderer/component/Icon";

// Utils
import Store from "@Renderer/utils/Store";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require(`glob`);
const store = Store.getStore();

interface BackupSettingsProps {
  connected: boolean;
  neurons: any;
  neuronID: string;
  updateTab: (value: string) => void;
}

const BackupSettings = (props: BackupSettingsProps) => {
  const [backupFolder, setBackupFolder] = useState("");
  const [state] = useDevice();
  const { connected, neurons, neuronID, updateTab } = props;
  useEffect(() => {
    setBackupFolder(store.get("settings.backupFolder") as string);
  }, []);

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
          await state.currentDevice.noCacheCommand(data[i].command, val.trim());
        }
        await state.currentDevice.noCacheCommand("led.mode 0");
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
            await state.currentDevice.noCacheCommand(`${command} ${virtual[command].data}`.trim());
          }
        }
        await state.currentDevice.noCacheCommand("led.mode 0");
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

  const getLatestBackup = async () => {
    try {
      // creating folder path with current device
      const folderPath = path.join(backupFolder, state.currentDevice.device.info.product, neuronID);
      console.log("going to search for newest file in: ", folderPath);

      // sorting folder files to find newest
      const newestFile = glob
        .sync(`${folderPath}/*json`)
        .map((name: string) => ({ name, ctime: fs.statSync(name).ctime }))
        .sort((a: any, b: any) => b.ctime - a.ctime)[0].name;
      console.log("selected backup: ", newestFile);

      // Loading latest backup for the device
      const loadedFile = JSON.parse(fs.readFileSync(newestFile, "utf-8"));
      console.log("selected backup content: ", loadedFile);

      // called restorer with backup data
      await restoreBackup(loadedFile);
      console.log("Restored latest backup");
    } catch (error) {
      console.error(error);
      alert(`The loaded backup could not be restored`);
    }
  };

  const setApplicationTab = () => {
    // Call the onTabChange function from props with the desired value
    updateTab("Application");
  };

  return (
    <Card className="mt-3 max-w-2xl mx-auto" variant="default">
      <CardHeader>
        <CardTitle variant="default">
          <IconFloppyDisk /> {i18n.keyboardSettings.backupFolder.header}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <h3 className="text-gray-400 dark:text-gray-100 tracking-tight font-semibold">Backup folder</h3>
          <p className="text-gray-300 dark:text-gray-300 tracking-tight font-semibold text-sm">
            {backupFolder}
            <button
              type="button"
              className="px-1 m-0 decoration-1 text-purple-300 hover:text-purple-300 dark:text-purple-200 dark:hover:text-purple-100"
              value="Application"
              onClick={setApplicationTab}
            >
              Change folder
            </button>
          </p>
          <h3 className="mt-3 mb-1 text-gray-400 dark:text-gray-100 tracking-tight font-semibold">Backup actions</h3>
          <div className="flex gap-3">
            <RegularButton onClick={GetBackup} styles="short" buttonText="Restore backup from file..." disabled={!connected} />
            <RegularButton onClick={getLatestBackup} styles="short" buttonText="Restore from last backup" />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BackupSettings;

/* eslint-disable no-console */
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
import { BackupSettingsProps } from "@Renderer/types/preferences";
import WaitForRestoreDialog from "@Renderer/component/WaitForRestoreDialog";
import { BackupType } from "@Renderer/types/backups";
import { VirtualType } from "@Renderer/types/devices";
import Backup from "../../../api/backup";

const store = Store.getStore();

const BackupSettings = (props: BackupSettingsProps) => {
  const [backupFolder, setBackupFolder] = useState("");
  const [performingBackup, setPerformingBackup] = useState(false);
  const { state } = useDevice();

  const { connected, neurons, neuronID, toggleBackup, destroyContext } = props;
  useEffect(() => {
    setBackupFolder(store.get("settings.backupFolder") as string);
  }, []);

  const openPerformingBackup = () => {
    setPerformingBackup(true);
  };

  const closePerformingBackup = () => {
    setPerformingBackup(false);
  };

  const localRestoreBackup = async (backup: BackupType) => {
    try {
      openPerformingBackup();
      toggleBackup(true);
      await Backup.restoreBackup(neurons, neuronID, backup, state.currentDevice);
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
      closePerformingBackup();
      toggleBackup(false);
      return true;
    } catch (e) {
      closePerformingBackup();
      toggleBackup(false);
      return false;
    }
  };

  const localRestoreVirtual = async (virtual: VirtualType) => {
    try {
      openPerformingBackup();
      toggleBackup(true);
      await Backup.restoreVirtual(virtual, state.currentDevice);
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
      closePerformingBackup();
      toggleBackup(false);
      return true;
    } catch (e) {
      closePerformingBackup();
      toggleBackup(false);
      return false;
    }
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
          await localRestoreVirtual(loadedFile as VirtualType);
          await destroyContext();
          console.log("Restored Virtual backup");
          return;
        }
        if (loadedFile.backup !== undefined || loadedFile[0].command !== undefined) {
          await localRestoreBackup(loadedFile);
          await destroyContext();
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

  const localGetLatestBackup = async () => {
    try {
      const loadedFile = await Backup.getLatestBackup(backupFolder, neuronID, state.currentDevice);
      await localRestoreBackup(loadedFile);
      await destroyContext();
      console.log("Restored latest backup");
    } catch (error) {
      console.error(error);
      alert(`The loaded backup could not be restored`);
    }
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
          <h3 className="mb-1 text-gray-400 dark:text-gray-100 tracking-tight font-semibold">Backup actions</h3>
          <div className="flex gap-3">
            <RegularButton onClick={GetBackup} styles="short" buttonText="Restore backup from file..." disabled={!connected} />
            <RegularButton onClick={localGetLatestBackup} styles="short" buttonText="Restore from last backup" />
            <WaitForRestoreDialog title="Restoring Backup" open={performingBackup} />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default BackupSettings;

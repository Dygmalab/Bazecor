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

// React Bootstrap Components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";

// Own Components
import { i18n } from "@Renderer/i18n";

// Icons Imports
import { IconFloppyDisk, IconFolder } from "@Renderer/components/atoms/icons";

// Utils
import Store from "@Renderer/utils/Store";
import { Slider } from "@Renderer/components/atoms/slider";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";

const store = Store.getStore();

const FileBackUpHandling = () => {
  const [backupFolder, setBackupFolder] = useState("");
  const [storeBackups, setStoreBackups] = useState(13);
  useEffect(() => {
    const freq = store.get("settings.backupFrequency") as number;
    setBackupFolder(store.get("settings.backupFolder") as string);
    if (freq === 0) {
      setStoreBackups(13);
      store.set("settings.backupFrequency", 13);
    } else {
      setStoreBackups(freq);
    }
  }, []);

  const ChooseBackupFolder = async () => {
    const options = {
      title: i18n.keyboardSettings.backupFolder.title,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowButton,
      properties: ["openDirectory"],
    };

    const resp = await ipcRenderer.invoke("open-dialog", options);

    if (!resp.canceled) {
      // console.log(resp.filePaths);
      setBackupFolder(resp.filePaths[0]);
      store.set("settings.backupFolder", `${resp.filePaths[0]}`);
      toast.success(
        <ToastMessage
          icon={<IconFloppyDisk />}
          title={i18n.success.backupPath}
          content={`${i18n.success.backupPathText} ${resp.filePaths[0]}`}
        />,
        { autoClose: 2000, icon: "", toastId: "backupPath" },
      );
    } else {
      // console.log("user closed backup folder dialog");
    }
  };

  const onSetStoreBackups = (value: number[]) => {
    // console.log("changed backup period to: ", value);
    setStoreBackups(value[0]);
    store.set("settings.backupFrequency", value[0]);
    toast.success(
      <ToastMessage
        icon={<IconFloppyDisk />}
        title={i18n.success.backupStoragePeriod}
        content={`${i18n.success.backupStoragePeriodText} ${value[0]} months`}
      />,
      { autoClose: 2000, icon: "", toastId: "backupStoragePeriod" },
    );
  };

  return (
    <Card className="mt-3 max-w-2xl mx-auto" variant="default">
      <CardHeader>
        <CardTitle variant="default">
          <IconFolder /> File Handling
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <h3 className="text-gray-400 dark:text-gray-100 tracking-tight font-semibold mb-2">Backup folder</h3>
          <div className="flex w-full items-center justify-between py-[3px] px-[3px] rounded-[6px] border-[1px] tracking-tight font-semibold text-sm border-gray-100 dark:border-gray-600 bg-gray-25 dark:bg-gray-900/20">
            <span className="block px-2 w-full truncate pointer-events-none text-gray-500 dark:text-gray-100">
              {backupFolder}
            </span>{" "}
            <button className="button short mt-0 whitespace-nowrap" onClick={ChooseBackupFolder} type="button">
              Change folder
            </button>
          </div>
          <h3 className="mt-4 mb-2 text-gray-400 dark:text-gray-100 tracking-tight font-semibold">
            {i18n.keyboardSettings.backupFolder.storeTime}
          </h3>
          <div className="flex w-full">
            <div className="mb-0 w-full flex gap-2">
              <div className="flex max-w-16 p-0 text-center items-center">
                <span className="tagsfix">1 month</span>
              </div>
              <div className="w-full flex items-center p-0">
                <Slider min={1} max={13} step={1} value={[storeBackups]} onValueChange={onSetStoreBackups} />
              </div>
              <div className="flex max-w-16 p-0 text-center items-center">
                <span className="tagsfix">Forever</span>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileBackUpHandling;

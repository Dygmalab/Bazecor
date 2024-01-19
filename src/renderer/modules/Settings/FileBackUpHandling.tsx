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
import Slider from "@appigram/react-rangeslider";
import { ipcRenderer } from "electron";

// React Bootstrap Components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Own Components
import i18n from "@Renderer/i18n";

// Icons Imports
import { IconFolder } from "@Renderer/component/Icon";

// Utils
import Store from "@Renderer/utils/Store";

const store = Store.getStore();

const FileBackUpHandling = () => {
  const [backupFolder, setBackupFolder] = useState("");
  const [storeBackups, setStoreBackups] = useState(13);
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
      // console.log(resp.filePaths);
      setBackupFolder(resp.filePaths[0]);
      store.set("settings.backupFolder", `${resp.filePaths[0]}`);
    } else {
      // console.log("user closed backup folder dialog");
    }
  };

  const onSetStoreBackups = (value: any) => {
    // console.log("changed backup period to: ", value);
    setStoreBackups(value);
    store.set("settings.backupFrequency", value);
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
            <Form.Group controlId="backupFolder" className="mb-0 w-full">
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
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default FileBackUpHandling;

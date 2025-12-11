import { ipcMain, app } from "electron";
import fs from "fs";
import path from "path";
import log from "electron-log/main";

const getLabelsFilePath = (deviceId: string): string => {
  const userDataPath = app.getPath("userData");
  return path.join(userDataPath, `key-labels-${deviceId}.json`);
};

const removeKeyLabelsIPCs = () => {
  ipcMain.removeHandler("key-labels:read");
  ipcMain.removeHandler("key-labels:write");
  ipcMain.removeHandler("key-labels:write-export");
  ipcMain.removeHandler("key-labels:read-import");
};

const configureKeyLabelsIPCs = () => {
  ipcMain.handle("key-labels:read", async (_event, deviceId: string) => {
    const filePath = getLabelsFilePath(deviceId);
    log.verbose(`Reading key labels from: ${filePath}`);

    try {
      if (!fs.existsSync(filePath)) {
        return { version: 1, deviceId, labels: [] };
      }
      const content = fs.readFileSync(filePath, "utf-8");
      return JSON.parse(content);
    } catch (error) {
      log.error("Failed to read key labels:", error);
      return { version: 1, deviceId, labels: [] };
    }
  });

  ipcMain.handle("key-labels:write", async (_event, deviceId: string, data: unknown) => {
    const filePath = getLabelsFilePath(deviceId);
    log.verbose(`Writing key labels to: ${filePath}`);

    try {
      const content = JSON.stringify(data, null, 2);
      fs.writeFileSync(filePath, content, "utf-8");
      return { success: true };
    } catch (error) {
      log.error("Failed to write key labels:", error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle("key-labels:write-export", async (_event, filePath: string, content: string) => {
    log.verbose(`Exporting key labels to: ${filePath}`);
    try {
      fs.writeFileSync(filePath, content, "utf-8");
      return { success: true };
    } catch (error) {
      log.error("Failed to export key labels:", error);
      return { success: false, error: String(error) };
    }
  });

  ipcMain.handle("key-labels:read-import", async (_event, filePath: string) => {
    log.verbose(`Importing key labels from: ${filePath}`);
    try {
      const content = fs.readFileSync(filePath, "utf-8");
      return content;
    } catch (error) {
      log.error("Failed to import key labels:", error);
      throw error;
    }
  });
};

export { configureKeyLabelsIPCs, removeKeyLabelsIPCs };

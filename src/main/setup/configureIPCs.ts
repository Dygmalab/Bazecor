import { ipcMain, app, dialog, shell, nativeTheme } from "electron";
import { uIOhook } from "uiohook-napi";
import { sendKeyUp, sendkeyDown } from "./configureCaptureKeys";
import listDrivesHandler from "../utils/listDrivesHandler";
import GlobalRecording from "../managers/GlobalRecording";
import Window from "../managers/Window";

const configureIPCs = () => {
  const globalRecording = GlobalRecording.getInstance();
  const window = Window.getWindow();

  ipcMain.removeHandler("start-recording");
  ipcMain.on("start-recording", () => {
    console.log("start-recording");
    globalRecording.setRecording(true);
    uIOhook.on("keydown", sendkeyDown);
    uIOhook.on("keyup", sendKeyUp);
    uIOhook.start();
  });

  ipcMain.removeHandler("stop-recording");
  ipcMain.on("stop-recording", () => {
    console.log("stop-recording");
    globalRecording.setRecording(false);
    uIOhook.off("keydown", sendkeyDown);
    uIOhook.off("keyup", sendKeyUp);
    uIOhook.stop();
  });

  ipcMain.removeHandler("list-drives");
  ipcMain.handle("list-drives", async (event, options) => {
    const data = listDrivesHandler(event, options);
    return data;
  });

  ipcMain.removeHandler("open-dialog");
  ipcMain.handle("open-dialog", async (event, options) => {
    const data = await dialog.showOpenDialog(window, options);
    return data;
  });

  ipcMain.removeHandler("save-dialog");
  ipcMain.handle("save-dialog", async (event, options) => {
    const data = dialog.showSaveDialogSync(window, options);
    return data;
  });

  ipcMain.removeHandler("is-devtools-opened");
  ipcMain.handle("is-devtools-opened", async () => {
    const data = window.webContents.isDevToolsOpened();
    return data;
  });

  ipcMain.removeHandler("manage-devtools");
  ipcMain.handle("manage-devtools", (event, action) => {
    if (action === true) {
      window.webContents.openDevTools();
    } else {
      window.webContents.closeDevTools();
    }
  });

  ipcMain.removeHandler("get-userPath");
  ipcMain.handle("get-userPath", (event, path) => app.getPath(path));

  ipcMain.removeHandler("openExternal");
  ipcMain.handle("openExternal", (event, URI) => shell.openExternal(URI));

  ipcMain.removeHandler("get-Locale");
  ipcMain.handle("get-Locale", () => {
    const locale = app.getLocale();
    return locale;
  });

  ipcMain.removeHandler("get-NativeTheme");
  ipcMain.handle("get-NativeTheme", () => nativeTheme.shouldUseDarkColors);
};

export default configureIPCs;

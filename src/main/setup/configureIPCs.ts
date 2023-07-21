import { ipcMain, app, dialog, shell, nativeTheme } from "electron";
import { uIOhook } from "uiohook-napi";
import { sendKeyUp, sendkeyDown } from "./configureCaptureKeys";
import listDrivesHandler from "../utils/listDrivesHandler";
import GlobalRecording from "../managers/GlobalRecording";
import Window from "../managers/Window";

const configureIPCs = () => {
  const globalRecording = GlobalRecording.getInstance();
  const window = Window.getWindow();

  ipcMain.on("start-recording", (event, arg) => {
    console.log("start-recording");
    globalRecording.setRecording(true);
    uIOhook.on("keydown", sendkeyDown);
    uIOhook.on("keyup", sendKeyUp);
    uIOhook.start();
  });

  ipcMain.on("stop-recording", (event, arg) => {
    console.log("stop-recording");
    globalRecording.setRecording(false);
    uIOhook.off("keydown", sendkeyDown);
    uIOhook.off("keyup", sendKeyUp);
    uIOhook.stop();
  });

  ipcMain.handle("list-drives", async (event, options) => {
    const data = listDrivesHandler(event, options);
    return data;
  });
  ipcMain.handle("open-dialog", async (event, options) => {
    const data = await dialog.showOpenDialog(window, options);
    return data;
  });

  ipcMain.handle("save-dialog", async (event, options) => {
    const data = dialog.showSaveDialogSync(window, options);
    return data;
  });

  ipcMain.handle("is-devtools-opened", async (event, someArgument) => {
    const data = window.webContents.isDevToolsOpened();
    return data;
  });

  ipcMain.handle("manage-devtools", (event, action) => {
    if (action === true) {
      window.webContents.openDevTools();
    } else {
      window.webContents.closeDevTools();
    }
  });

  ipcMain.handle("get-userPath", (event, path) => app.getPath(path));

  ipcMain.handle("openExternal", (event, URI) => shell.openExternal(URI));

  ipcMain.handle("get-Locale", (event, someArgument) => {
    const locale = app.getLocale();
    return locale;
  });

  ipcMain.handle("get-NativeTheme", (event, someArgument) => nativeTheme.shouldUseDarkColors);
};

export default configureIPCs;

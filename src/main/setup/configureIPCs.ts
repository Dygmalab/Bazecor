import { ipcMain, app, dialog, shell, nativeTheme, systemPreferences } from "electron";
import { uIOhook } from "uiohook-napi";
import { sendKeyUp, sendkeyDown } from "./configureCaptureKeys";
import listDrivesHandler from "../utils/listDrivesHandler";
import GlobalRecording from "../managers/GlobalRecording";
import Window from "../managers/Window";

const removeIPCs = () => {
  ipcMain.removeHandler("start-recording");
  ipcMain.removeHandler("stop-recording");
  ipcMain.removeHandler("list-drives");
  ipcMain.removeHandler("open-dialog");
  ipcMain.removeHandler("is-devtools-opened");
  ipcMain.removeHandler("save-dialog");
  ipcMain.removeHandler("manage-devtools");
  ipcMain.removeHandler("get-userPath");
  ipcMain.removeHandler("get-Locale");
  ipcMain.removeHandler("openExternal");
  ipcMain.removeHandler("get-NativeTheme");
  ipcMain.removeHandler("ask-for-accessibility");
};

const configureIPCs = () => {
  const globalRecording = GlobalRecording.getInstance();

  ipcMain.on("start-recording", () => {
    console.log("start-recording");
    globalRecording.setRecording(true);
    uIOhook.on("keydown", sendkeyDown);
    uIOhook.on("keyup", sendKeyUp);
    uIOhook.start();
  });

  ipcMain.on("stop-recording", () => {
    const isTrusted = systemPreferences.isTrustedAccessibilityClient(false);
    if (isTrusted) {
      console.log("stop-recording");
      globalRecording.setRecording(false);
      uIOhook.off("keydown", sendkeyDown);
      uIOhook.off("keyup", sendKeyUp);
      uIOhook.stop();
    }
  });

  ipcMain.handle("list-drives", async (event, options) => {
    const data = listDrivesHandler(event, options);
    return data;
  });

  ipcMain.handle("open-dialog", async (event, options) => {
    const window = Window.getWindow();
    const data = await dialog.showOpenDialog(window, options);
    return data;
  });

  ipcMain.handle("save-dialog", async (event, options) => {
    const window = Window.getWindow();
    const data = dialog.showSaveDialogSync(window, options);
    return data;
  });

  ipcMain.handle("is-devtools-opened", async () => {
    const window = Window.getWindow();
    const data = window.webContents.isDevToolsOpened();
    return data;
  });

  ipcMain.handle("manage-devtools", (event, action) => {
    const window = Window.getWindow();
    if (action === true) {
      window.webContents.openDevTools();
    } else {
      window.webContents.closeDevTools();
    }
  });

  ipcMain.handle("get-userPath", (event, path) => app.getPath(path));

  ipcMain.handle("openExternal", (event, URI) => shell.openExternal(URI));

  ipcMain.handle("get-Locale", () => {
    const locale = app.getLocale();
    return locale;
  });

  ipcMain.handle("get-NativeTheme", () => nativeTheme.shouldUseDarkColors);

  ipcMain.handle("ask-for-accessibility", async () => {
    console.log("someone asked for accessibility", process.platform);
    if (process.platform === "darwin") {
      const isTrusted = systemPreferences.isTrustedAccessibilityClient(false);
      console.log("isTrustedAccessibilityClient", isTrusted);
      if (!isTrusted) {
        const clickedButton = await dialog.showMessageBox(null, {
          type: "warning",
          message: "Bazecor requires accessibility",
          detail:
            "Bazecor uses accessibility to record macros and list Bluetooth-HID devices like the Defy wireless, please try again after authorizing the application if you want access to these features",
          defaultId: 1,
          cancelId: 0,
          buttons: ["Not Now", "Turn On Accessibility"],
        });
        console.log("checking return value: ", clickedButton);
        if (clickedButton.response === 1) {
          // Calling isTrustedAccessibilityClient with prompt=true has the side effect
          // of showing the native dialog that either denies access or opens System
          // Preferences.
          systemPreferences.isTrustedAccessibilityClient(true);
          return false;
        }
        return false;
      }
      return true;
    }
    return true;
  });
};

export { configureIPCs, removeIPCs };

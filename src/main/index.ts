import { app, BrowserWindow, Menu } from "electron";
import log from "electron-log/main";
import createWindow from "./createWindow";
import { setTheme } from "./setup/theme";
import setBackup from "./setup/setBackup";
import GlobalRecording from "./managers/GlobalRecording";
import { addUSBListeners, removeUSBListeners } from "./setup/configureUSB";
import { removeIPCs } from "./setup/configureIPCs";
import configureAutoUpdate from "./setup/configureAutoUpdate";

if (process.env.NODE_ENV === "development") {
  log.transports.console.level = "debug";
}
log.initialize();
configureAutoUpdate();
log.info(app.getPath("userData"));
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  addUSBListeners();
  setBackup();
  setTheme();
  // await setDevTools(); devtools do not work with latest electron
  createWindow();
  // we do not want a menu on top of the window
  Menu.setApplicationMenu(null);
});

// Emitted before the application starts closing its windows.
// Calling event.preventDefault() will prevent the default behavior,
// which is terminating the application.
app.on("before-quit", () => {
  removeUSBListeners();
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  } else {
    removeIPCs();
  }
});

app.on("activate", async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    addUSBListeners();
    createWindow();
  }
});

app.on("web-contents-created", (_, wc) => {
  wc.on("before-input-event", (__, input) => {
    const globalRecording = GlobalRecording.getInstance();
    if (!globalRecording.getRecording() && input.type === "keyDown" && input.control) {
      if (input.shift && input.code === "KeyI") {
        wc.openDevTools();
      }
      if (input.code === "KeyR") {
        wc.reload();
      }
      if (input.code === "KeyQ") {
        app.quit();
      }
    }
  });
});

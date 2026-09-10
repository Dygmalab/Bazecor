import { app, Menu } from "electron";
import log from "electron-log/main";
import createWindow from "./createWindow";
import { setTheme } from "./setup/theme";
import setBackup from "./setup/setBackup";
import GlobalRecording from "./managers/GlobalRecording";
import Window from "./managers/Window";
import { addUSBListeners, removeUSBListeners } from "./setup/configureUSB";
import { removeIPCs } from "./setup/configureIPCs";
import configureAutoUpdate from "./setup/configureAutoUpdate";
import configureLens from "./setup/configureLens";
import configureTray, { openMainWindow } from "./setup/configureTray";
import { getRunInBackground } from "../lens/main/lens-settings";
import { overlayController } from "../lens/main/overlay-controller";
import { isAppQuitting } from "./managers/AppLifecycle";

if (process.env.NODE_ENV === "development") {
  log.transports.console.level = "verbose";
} else {
  log.transports.console.level = "info";
}
log.initialize();
configureAutoUpdate();
log.info(app.getPath("userData"));
// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// eslint-disable-next-line global-require
if (require("electron-squirrel-startup")) {
  app.quit();
}

// A second launch (e.g. from the login item while already tray-resident) must
// focus the existing instance instead of spawning a second overlay/tray.
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on("second-instance", () => {
    openMainWindow();
  });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  addUSBListeners();
  setBackup();
  setTheme();
  configureLens();
  configureTray();
  // Login-item launches pass --hidden (or wasOpenedAsHidden on macOS): start
  // tray-resident with the overlay available but no main window.
  const startHidden = process.argv.includes("--hidden") || app.getLoginItemSettings().wasOpenedAsHidden;
  if (startHidden && getRunInBackground()) {
    // No window to go with it, so no Dock icon either — the tray icon is the
    // only entry point until createWindow() brings it back.
    app.dock?.hide();
  } else {
    createWindow();
  }
  // we do not want a menu on top of the window
  Menu.setApplicationMenu(null);
});

// Emitted before the application starts closing its windows.
// Calling event.preventDefault() will prevent the default behavior,
// which is terminating the application.
app.on("before-quit", event => {
  // macOS delivers Cmd+Q (and Dock "Quit") straight to the app as a terminate
  // request — it never goes through a window's own "close" event, so it skips
  // right past onClose.ts's "keep running in background" handling and tears
  // down everything, including a live Lens overlay. isAppQuitting() is only
  // true here if something in our own code (tray Quit) already called
  // markAppQuitting() before requesting the quit, so this only catches the
  // OS-level trigger. Redirect it to a normal window close instead, which
  // mac's onClose.ts already handles correctly (close the window, leave the
  // app + overlay running, same as clicking the red button or Cmd+W).
  //
  // Only when background mode is actually on, though: without it there is no
  // tray icon to bring Bazecor back, so swallowing the quit would strand the
  // app running with no way to reach or close it.
  if (process.platform === "darwin" && !isAppQuitting() && getRunInBackground()) {
    event.preventDefault();
    const win = Window.getWindow();
    if (win && !win.isDestroyed()) win.close();
    return;
  }
  removeUSBListeners();
});

app.on("will-quit", () => {
  overlayController.shutdown();
});

// NOTE: with the Lens overlay window alive this event never fires — the real
// "main window closed" handling lives in setup/onClose.ts. This stays as the
// quit path for sessions where the overlay was never created.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    if (!getRunInBackground()) {
      app.quit();
    }
  } else {
    removeIPCs();
  }
});

app.on("activate", async () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  const win = Window.getWindow();
  if (!win || win.isDestroyed()) {
    addUSBListeners();
    createWindow();
  } else {
    win.show();
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
    }
  });
});

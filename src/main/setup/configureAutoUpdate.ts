import log from "electron-log/main";
import { makeUserNotifier, updateElectronApp, UpdateSourceType } from "update-electron-app";
import Store from "../managers/Store";

const store = Store.getStore();

/* The dialog can come up while Bazecor is only in the tray, and the library's
 * default text never says which application it is about. macOS does not show
 * the title, so the text has to name Bazecor too. */
const updateDialog = {
  title: "Bazecor Update",
  detail: "A new version of Bazecor has been downloaded. Restart Bazecor to apply the update.",
  restartButtonText: "Restart Bazecor",
  laterButtonText: "Later",
};

const configureAutoUpdate = () => {
  const autoUpdate = store.get("settings.autoUpdate") as boolean;

  if (autoUpdate === true && process.platform !== "linux") {
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        host: "https://update.electronjs.org",
        repo: "dygmalab/bazecor",
      },
      updateInterval: "24 hour",
      logger: log,
      notifyUser: true,
      onNotifyUser: makeUserNotifier(updateDialog),
    });
  }
};

export default configureAutoUpdate;

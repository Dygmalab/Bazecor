import log from "electron-log/main";
import { updateElectronApp, UpdateSourceType } from "update-electron-app";
import Store from "../managers/Store";

const store = Store.getStore();

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
    });
  }
};

export default configureAutoUpdate;

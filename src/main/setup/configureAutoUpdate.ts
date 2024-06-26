import log from "electron-log/main";
import { updateElectronApp, UpdateSourceType } from "update-electron-app";
import Store from "../managers/Store";

const store = Store.getStore();

const configureAutoUpdate = () => {
  const autoUpdate = store.get("settings.autoUpdate") as boolean;

  if (autoUpdate === true) {
    updateElectronApp({
      updateSource: {
        type: UpdateSourceType.ElectronPublicUpdateService,
        repo: "Dygmalab/Bazecor",
        host: "https://github.com/Dygmalab/Bazecor",
      },
      updateInterval: "24 hour",
      logger: log,
    });
  }
};

export default configureAutoUpdate;

import { BrowserWindow, dialog, MessageBoxOptions } from "electron";
import Store from "../managers/Store";

const store = Store.getStore();

const autoUpdateOptIn = (mainWindow: BrowserWindow) => {
  const autoUpdate = store.get("settings.autoUpdate") as boolean;

  if (autoUpdate === undefined && process.platform !== "linux") {
    let dialogOpts: MessageBoxOptions;
    if (process.platform !== "darwin") {
      dialogOpts = {
        type: "question",
        buttons: ["Decline", "Consent"],
        cancelId: 0,
        defaultId: 1,
        title: "Bazecor auto update tool",
        message: "Bazecor will update automatically whenever possible",
        detail:
          "Do you want to make Bazecor able to auto update automatically?, click consent to authorize automatic downloads of new versions, if you decline this feature, you can enable it again in preferences.",
      };
      dialog.showMessageBox(mainWindow, dialogOpts).then(response => {
        if (response.response === 1) {
          store.set("settings.autoUpdate", true);
        } else {
          store.set("settings.autoUpdate", false);
        }
      });
    } else {
      dialogOpts = {
        type: "question",
        buttons: ["Consent", "Decline"],
        cancelId: 1,
        defaultId: 0,
        title: "Bazecor auto update tool",
        message: "Bazecor will update automatically whenever possible",
        detail:
          "Do you want to make Bazecor able to auto update automatically?, click consent to authorize automatic downloads of new versions, if you decline this feature, you can enable it again in preferences.",
      };
      dialog.showMessageBox(mainWindow, dialogOpts).then(response => {
        if (response.response === 0) {
          store.set("settings.autoUpdate", true);
        } else {
          store.set("settings.autoUpdate", false);
        }
      });
    }
  }
};

export default autoUpdateOptIn;

import { app } from "electron";
import path from "path";
import fs from "fs";
import Store from "../managers/Store";

const setBackup = () => {
  const store = Store.getStore();
  const bfolder = store.get("settings.backupFolder");
  console.log("CHECKING BACKUP FOLDER VALUE", bfolder);
  if (bfolder == "" || bfolder == undefined) {
    const defaultPath = path.join(app.getPath("home"), "Dygma", "Backups");
    console.log(defaultPath);
    store.set("settings.backupFolder", defaultPath);
    fs.mkdir(defaultPath, { recursive: true }, err => {
      if (err) {
        console.error(err);
      }
      console.log("Directory created successfully!");
    });
  }
};

export default setBackup;

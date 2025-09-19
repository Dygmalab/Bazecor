import path from "path";
import fs from "fs";
import log from "electron-log/renderer";
import { Neuron } from "@Renderer/types/neurons";
import { BackupType } from "@Renderer/types/backups";
import { VirtualType } from "@Renderer/types/virtual";
import Store from "../../renderer/utils/Store";
import Device from "../comms/Device";
import {
  convertColormapR2toR,
  convertColormapRtoR2,
  convertKeymapR2toR,
  convertKeymapRtoR2,
  convertPaletteR2toR,
  convertPaletteRtoR2,
  parseColormapRaw,
  parseKeymapRaw,
  parsePaletteRaw,
} from "../parsers";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require(`glob`);
const store = Store.getStore();

export default class Backup {
  neurons: Neuron[];

  constructor() {
    this.neurons = store.get("neurons") as Neuron[];
    this.DoBackup = this.DoBackup.bind(this);
  }

  /**
   * Returns a list of device commands relevant for creating a backup.
   * @param {Device} device The device to get commands from.
   * @returns {Promise<string[]>} A promise that resolves to an array of command strings.
   */
  static async Commands(device: Device): Promise<string[]> {
    const notRequired = [
      "eeprom",
      "hardware",
      "settings.valid?",
      "settings.version",
      "settings.crc",
      "keymap.default",
      "layer",
      "help",
      "version",
      "led.mode",
      "led.theme",
      "led.at",
      "led.setMultiple",
      "led.getMultiple",
      "led.setAll",
      "led.fade",
      "macros.trigger",
      "macros.memory",
      "upgrade",
      "settings.printConfig",
      "settings.aliveInterval",
      "settings.spiSpeed",
      "settings.cpuSpeed",
      "settings.ledDriverPullUp",
      "settings.underGlow",
      "settings.ledDriver",
      "wireless.battery.left",
      "wireless.battery.right",
    ];
    const commands = await device.command("help");
    const validCommands = commands.split(/\r?\n/).filter(c => !notRequired.some(v => c.includes(v)));
    if (!validCommands.includes("led.brightnessUG")) validCommands.push("led.brightnessUG");
    return validCommands;
  }

  /**
   * Checks if the configured backup folder is a valid directory.
   * @returns {boolean} True if the backup folder is a valid directory, false otherwise.
   */
  static backupFolderValid = (): boolean => {
    const folder = store.get("settings.backupFolder") as string;
    try {
      const stats = fs.statSync(folder);
      return stats.isDirectory();
    } catch (error) {
      return false;
    }
  };

  /**
   * Creates a backup of the connected device\'s configuration.
   * It executes a list of commands on the device and combines the output with local neuron configuration.
   * @param {string[]} commands The list of commands to execute on the device for the backup.
   * @param {string} neuronID The ID of the neuron associated with the device to back up local settings.
   * @param {Device} device The device to back up.
   * @returns {Promise<BackupType | undefined>} A promise that resolves to the backup object, or undefined for virtual devices.
   */
  async DoBackup(commands: string[], neuronID: string, device: Device): Promise<BackupType | undefined> {
    if (device.file !== false) return undefined;
    const backup: BackupType = {
      neuronID: undefined,
      neuron: undefined,
      versions: undefined,
      backup: undefined,
    };
    const commandList = [];
    for (let i = 0; i < commands.length; i += 1) {
      const command = commands[i];
      log.info(command);
      // eslint-disable-next-line no-await-in-loop
      const data = await device.command(command);
      commandList.push({ command, data });
    }
    const vData = await device.command("version");
    const parts = vData.split(" ");
    const versions = {
      bazecor: parts[0],
      kaleidoscope: parts[1],
      firmware: parts[2],
    };
    backup.neuronID = neuronID;
    backup.neuron = this.neurons.find(n => n.id === neuronID);
    if (backup.neuron === undefined)
      backup.neuron = {
        device: undefined,
        id: "",
        name: "",
        layers: [],
        macros: [],
        superkeys: [],
      };
    backup.neuron.device = device.device;
    backup.versions = versions;
    backup.backup = commandList;
    return backup;
  }

  /**
   * Saves a backup object to a file.
   * For physical devices, it saves to the backup folder with a timestamped filename.
   * For virtual devices (file-based), it updates the existing file.
   * @param {BackupType} backup The backup data object to be stored.
   * @param {Device} device The device associated with the backup.
   * @returns {boolean} True if the backup was saved successfully, otherwise throws an error.
   */
  static SaveBackup(backup: BackupType, device: Device): boolean {
    const localBackup = { ...backup };
    if (device.file !== false) {
      const file = JSON.parse(fs.readFileSync(device.fileData.device.filePath).toString("utf-8"));
      file.virtual = device.fileData.virtual;
      const json = JSON.stringify(file, null, 2);
      try {
        fs.writeFileSync(device.fileData.device.filePath, json);
      } catch (error) {
        log.error(error);
        throw error;
      }
      return true;
    }
    const { product } = device.device.info;
    const d = new Date();
    const folder = store.get("settings.backupFolder") as string;
    try {
      if (localBackup.neuron.name === undefined || localBackup.neuron.name === "") localBackup.neuron.name = "NoName";
      const folderPath = path.join(folder, product, localBackup.neuronID);
      const fullPath = path.join(
        folder,
        product,
        localBackup.neuronID,
        `${
          d.getFullYear() +
          `0${d.getMonth() + 1}`.slice(-2) +
          `0${d.getDate()}`.slice(-2) +
          `0${d.getHours()}`.slice(-2) +
          `0${d.getMinutes()}`.slice(-2) +
          `0${d.getSeconds()}`.slice(-2)
        }-${localBackup.neuron.name.replace(/[^\w\s]/gi, "")}.json`,
      );
      const json = JSON.stringify(localBackup, null, 2);
      log.info(fullPath, folderPath, localBackup);
      log.info("Creating folders");
      fs.mkdir(folderPath, { recursive: true }, err => {
        if (err) {
          log.error(err);
          throw err;
        }
      });
      log.info(`Saving Backup to -> ${fullPath}`);
      try {
        if (!fs.existsSync(path.parse(fullPath).dir)) {
          fs.mkdirSync(path.parse(fullPath).dir, { recursive: true });
        }
        fs.writeFileSync(fullPath, json);
      } catch (error) {
        log.error(error);
        throw error;
      }
      return true;
    } catch (error) {
      log.warn("Error occurred when saving backup to folder");
      throw new Error(error);
    }
  }

  /**
   * Restores a backup to a device.
   * This includes updating local neuron settings and sending commands to the device.
   * It handles compatibility conversions between different device models (e.g., Raise to Raise2).
   * @param {Neuron[]} neurons The current list of all neurons.
   * @param {string} neuronID The ID of the neuron to restore.
   * @param {BackupType} backup The backup object to restore.
   * @param {Device} device The device to restore the backup to.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
   */
  static restoreBackup = async (neurons: Neuron[], neuronID: string, backup: BackupType, device: Device): Promise<boolean> => {
    let data: any[];
    if (Array.isArray(backup)) {
      data = backup;
    } else {
      data = backup.backup;
      const localNeurons = [...neurons];
      const index = localNeurons.findIndex(n => n.id === neuronID);
      localNeurons[index] = backup.neuron;
      localNeurons[index].id = neuronID;
      store.set("neurons", localNeurons);
    }
    log.info("Checking if statement:", device.device.info.product === "Raise2", backup.neuron.device.info.product === "Raise");
    if (device.device.info.product === "Raise2" && backup.neuron.device.info.product === "Raise")
      data = Backup.convertRaiseToRaise2(backup, device);
    if (device.device.info.product === "Raise" && backup.neuron.device.info.product === "Raise2")
      data = Backup.convertRaise2ToRaise(backup, device);
    if (device) {
      try {
        for (let i = 0; i < data.length; i += 1) {
          let val = data[i].data;
          // Boolean values needs to be sent as int
          if (typeof val === "boolean") {
            val = +val;
          }
          // TODO: remove this block when necessary
          if (device.device.info.product === "Defy") {
            // if (data[i].command.includes("macros") || data[i].command.includes("superkeys")) continue;
          }
          log.info(`Going to send ${data[i].command} to keyboard`);
          // eslint-disable-next-line no-await-in-loop
          await device.command(data[i].command, val.trim());
        }
        await device.noCacheCommand("led.mode 0");
        log.info("Restoring all settings");
        log.info("Firmware update OK");
        return true;
      } catch (e) {
        log.info(`Restore settings: Error: ${e.message}`);
        return false;
      }
    }
    return false;
  };

  /**
   * Restores settings to a virtual (file-based) device.
   * @param {VirtualType} virtual The virtual device data to restore.
   * @param {Device} device The virtual device instance.
   * @returns {Promise<boolean>} A promise that resolves to true on success, false on failure.
   */
  static restoreVirtual = async (virtual: VirtualType, device: Device): Promise<boolean> => {
    if (device) {
      try {
        log.info("Restoring all settings");
        const data = virtual.virtual;
        for (const command in data) {
          if (data[command].eraseable === true) {
            // eslint-disable-next-line no-await-in-loop
            if (!(command.includes("wireless") || command.includes("led"))) {
              log.warn(`Going to send ${command} to keyboard`);
              // eslint-disable-next-line no-await-in-loop
              await device.command(command, data[command].data.trim());
            }
          }
        }
        log.info("Settings restored OK");
        return true;
      } catch (e) {
        log.info(`Restore settings: Error: ${e.message}`);
        return false;
      }
    }
    return false;
  };

  /**
   * Finds and loads the most recent backup file for a specific neuron.
   * @param {string} backupFolder The root folder where backups are stored.
   * @param {string} neuronID The ID of the neuron to find the latest backup for.
   * @param {Device} device The device associated with the neuron.
   * @returns {Promise<any | undefined>} A promise that resolves to the parsed backup object, or undefined if not found or an error occurs.
   */
  static getLatestBackup = async (backupFolder: string, neuronID: string, device: Device): Promise<any | undefined> => {
    try {
      // creating folder path with current device
      const folderPath = path
        .join(backupFolder, device.device.info.product, neuronID)
        .split(path.sep)
        .join(path[process.platform === "win32" ? "win32" : "posix"].sep);
      log.info("going to search for newest file in: ", folderPath);

      // sorting folder files to find newest
      let folderSync;
      if (process.platform === "win32") folderSync = glob.sync(`${folderPath}\\*json`.replace(/\\/g, "/"));
      else folderSync = glob.sync(`${folderPath}/*json`);
      type FolderMapType = { name: string; ctime: Date };
      const mappedFolder: FolderMapType[] = folderSync.map((name: string) => ({
        name,
        ctime: fs.statSync(name).ctime,
      }));
      const newestFile = mappedFolder.sort((a: FolderMapType, b: FolderMapType) => b.ctime.getTime() - a.ctime.getTime());

      // Loading latest backup for the device
      const loadedFile = JSON.parse(fs.readFileSync(newestFile[0].name, "utf-8"));
      log.info("selected backup content: ", loadedFile);
      log.info("Restored latest backup");
      return loadedFile;
    } catch (error) {
      log.error(error);
      return undefined;
    }
  };

  /**
   * Converts a backup from a Raise device to be compatible with a Raise2 device.
   * @param {BackupType} backup The Raise backup object.
   * @param {Device} dev The target Raise2 device.
   * @returns {any[]} The converted backup data.
   */
  static convertRaiseToRaise2 = (backup: BackupType, dev: Device): any[] => {
    log.info("converting Raise Backup to Raise2");
    const bkpDev = backup.neuron.device;
    const keyLayerSize = 80;
    const colorLayerSize = bkpDev ? bkpDev.keyboardUnderglow.rows * bkpDev.keyboardUnderglow.columns : 132;

    const localBackup: BackupType = JSON.parse(JSON.stringify(backup));
    localBackup.neuron.device = dev.device;
    const keymapIndex = localBackup.backup.findIndex(c => c.command === "keymap.custom");
    const paletteIndex = localBackup.backup.findIndex(c => c.command === "palette");
    const colormapIndex = localBackup.backup.findIndex(c => c.command === "colormap.map");

    const custom = parseKeymapRaw(localBackup.backup[keymapIndex].data, keyLayerSize);
    const palette = parsePaletteRaw(localBackup.backup[paletteIndex].data, false);
    const colormap = parseColormapRaw(localBackup.backup[colormapIndex].data, colorLayerSize);

    const keymapFinal = custom.map((layer: number[]) => convertKeymapRtoR2(layer, dev.device.info.keyboardType));
    const colormapFinal = colormap.map((layer: number[]) =>
      convertColormapRtoR2(layer, dev.device.info.keyboardType, backup.neuron.device.info.keyboardType),
    );
    const paletteFinal = palette.map(color => convertPaletteRtoR2(color));

    localBackup.backup[colormapIndex].data = colormapFinal
      .flat()
      .map(k => k.toString())
      .join(" ");
    localBackup.backup[keymapIndex].data = keymapFinal
      .flat()
      .map(k => k.toString())
      .join(" ");
    localBackup.backup[paletteIndex].data = paletteFinal
      .flat()
      .map(v => v.toString())
      .join(" ");

    log.info("Final Backup:", localBackup.backup);
    return localBackup.backup;
  };

  /**
   * Converts a backup from a Raise2 device to be compatible with a Raise device.
   * @param {BackupType} backup The Raise2 backup object.
   * @param {Device} dev The target Raise device.
   * @returns {any[]} The converted backup data.
   */
  static convertRaise2ToRaise = (backup: BackupType, dev: Device): any[] => {
    log.info("converting Raise2 Backup to Raise");
    const bkpDev = backup.neuron.device;
    const keyLayerSize = 80;
    const colorLayerSize = bkpDev ? bkpDev.keyboardUnderglow.rows * bkpDev.keyboardUnderglow.columns : 176;

    const localBackup: BackupType = JSON.parse(JSON.stringify(backup));
    localBackup.neuron.device = dev.device;

    const keymapIndex = localBackup.backup.findIndex(c => c.command === "keymap.custom");
    const paletteIndex = localBackup.backup.findIndex(c => c.command === "palette");
    const colormapIndex = localBackup.backup.findIndex(c => c.command === "colormap.map");

    const custom = parseKeymapRaw(localBackup.backup[keymapIndex].data, keyLayerSize);
    const palette = parsePaletteRaw(localBackup.backup[paletteIndex].data, true);
    const colormap = parseColormapRaw(localBackup.backup[colormapIndex].data, colorLayerSize);

    const keymapFinal = custom.map((layer: number[]) => convertKeymapR2toR(layer, dev.device.info.keyboardType));
    const colormapFinal = colormap.map((layer: number[]) =>
      convertColormapR2toR(layer, dev.device.info.keyboardType, backup.neuron.device.info.keyboardType),
    );
    const paletteFinal = palette.map(color => convertPaletteR2toR(color));

    localBackup.backup[colormapIndex].data = colormapFinal
      .flat()
      .map(k => k.toString())
      .join(" ");
    localBackup.backup[keymapIndex].data = keymapFinal
      .flat()
      .map(k => k.toString())
      .join(" ");
    localBackup.backup[paletteIndex].data = paletteFinal
      .flat()
      .map(v => v.toString())
      .join(" ");

    log.info("Final Backup:", localBackup.backup);
    return localBackup.backup;
  };

  /**
   * Type guard to check if an object is a BackupType.
   * @param {any} backup The object to check.
   * @returns {boolean} True if the object has a \'backup\' property.
   */
  static isBackupType = (backup: any): backup is any => "backup" in backup;
}

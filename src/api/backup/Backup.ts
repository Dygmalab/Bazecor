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
  convertKeymapDefyToSonsei,
  convertColormapDefyToSonsei,
  parseColormapRaw,
  parseKeymapRaw,
  parsePaletteRaw,
} from "../parsers";
import { rgb2w } from "../color";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require(`glob`);
const store = Store.getStore();

type BackupCmd = { command: string; data: string };

export default class Backup {
  neurons: Neuron[];

  /**
   * @constructor
   */
  constructor() {
    this.neurons = store.get("neurons") as Neuron[];
    this.DoBackup = this.DoBackup.bind(this);
  }

  /**
   * Returns the list of available commands excluding the ones that do not return useful information for the backup.
   * @param {Device} device The device to get the commands from.
   * @returns {Promise<string[]>} An array with strings that contain the serial commands that are capable of returning the keyboard configuration.
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
   * Checks if the backup folder set in the application settings is a valid directory.
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
   * Creates a backup of the entire keyboard configuration.
   *
   * It executes a list of commands on the device and retrieves the current neuron configuration
   * to create a complete backup object.
   *
   * @param {string[]} commands The list of commands to execute on the keyboard.
   * @param {string} neuronID The ID of the neuron to back up.
   * @param {Device} device The device to back up.
   * @returns {Promise<BackupType | undefined>} A promise that resolves with the backup object, or undefined if the device is a file.
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
   * Saves the backup object to a file in the settings.backupFolder.
   * The file format is RaiseBackup-YYYYMMDDhhmmss.json.
   * @param {BackupType} backup The backup data object to be stored locally.
   * @param {Device} device The device the backup is for.
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
      log.warn("Error ocurred when saving backup to folder");
      throw new Error(error);
    }
  }

  /**
   * Restores a backup to a device. It handles converting the backup if it's from a different keyboard model.
   * @param {Neuron[]} neurons The list of all neurons.
   * @param {string} neuronID The ID of the neuron to restore.
   * @param {BackupType} backup The backup object to restore.
   * @param {Device} device The device to restore the backup to.
   * @returns {Promise<boolean>} A promise that resolves to true if the restore was successful, false otherwise.
   */
  static restoreBackup = async (neurons: Neuron[], neuronID: string, backup: BackupType, device: Device): Promise<boolean> => {
    let data: BackupCmd[] = [];
    if (Array.isArray(backup)) {
      data = backup as unknown as BackupCmd[];
    } else {
      data = (backup as BackupType).backup as unknown as BackupCmd[];
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
    if (device.device.info.product === "Sonsei" && backup.neuron.device.info.product === "Defy")
      data = Backup.convertDefyToSonsei(backup, device);
    // Reorder to ensure superkeys are restored before keymap
    try {
      const keymapIdx = data.findIndex((c: BackupCmd) => typeof c.command === "string" && c.command === "keymap.custom");
      if (keymapIdx > -1) {
        const toMoveIdxs: number[] = [];
        for (let i = keymapIdx + 1; i < data.length; i += 1) {
          const cmd = data[i]?.command;
          if (typeof cmd === "string" && /^superkeys?\.map$/i.test(cmd)) {
            toMoveIdxs.push(i);
          }
        }
        if (toMoveIdxs.length > 0) {
          const toMove = toMoveIdxs.map(i => data[i]);
          const skip = new Set(toMoveIdxs);
          const reordered: BackupCmd[] = [];
          for (let i = 0; i < data.length; i += 1) {
            if (i === keymapIdx) {
              for (const item of toMove) reordered.push(item);
            }
            if (!skip.has(i)) {
              reordered.push(data[i]);
            }
          }
          data = reordered;
        }
      }
    } catch (reorderErr) {
      log.warn("Reordering backup commands failed: ", reorderErr);
    }
    if (device) {
      try {
        for (let i = 0; i < data.length; i += 1) {
          let val: unknown = data[i].data;
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
          await device.command(data[i].command, String(val).trim());
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
   * Restores settings from a virtual backup file to a device.
   * @param {VirtualType} virtual The virtual backup object.
   * @param {Device} device The device to restore the settings to.
   * @returns {Promise<boolean>} A promise that resolves to true if the restore was successful, false otherwise.
   */
  static restoreVirtual = async (virtual: VirtualType, device: Device): Promise<boolean> => {
    if (device) {
      try {
        log.info("Restoring all settings");
        const data = virtual.virtual;
        
        // Check if we need to convert between different keyboard families
        const virtualProduct = virtual.device.info.product;
        const deviceProduct = device.device.info.product;
        const needsRaiseConversion = (virtualProduct === "Raise" && deviceProduct === "Raise2") || 
                                      (virtualProduct === "Raise2" && deviceProduct === "Raise");
        const needsDefySonseiConversion = virtualProduct === "Defy" && deviceProduct === "Sonsei";
        
        for (const command in data) {
          if (data[command].eraseable === true) {
            // eslint-disable-next-line no-await-in-loop
            if (!(command.includes("wireless") || command.includes("led"))) {
              let commandData = data[command].data.trim();
              
              // Convert keymap, colormap and palette between Raise and Raise2
              if (needsRaiseConversion) {
                const keyboardType = device.device.info.keyboardType;
                const backupKeyboardType = virtual.device.info.keyboardType;
                
                if (command === "keymap.custom") {
                  const keyLayerSize = 80;
                  const custom = parseKeymapRaw(commandData, keyLayerSize);
                  if (virtualProduct === "Raise" && deviceProduct === "Raise2") {
                    const keymapFinal = custom.map((layer: number[]) => convertKeymapRtoR2(layer, keyboardType));
                    commandData = keymapFinal.flat().map(k => k.toString()).join(" ");
                  } else if (virtualProduct === "Raise2" && deviceProduct === "Raise") {
                    const keymapFinal = custom.map((layer: number[]) => convertKeymapR2toR(layer, keyboardType));
                    commandData = keymapFinal.flat().map(k => k.toString()).join(" ");
                  }
                } else if (command === "colormap.map") {
                  const sourceLayerSize = virtual.device.keyboardUnderglow.rows * virtual.device.keyboardUnderglow.columns;
                  const colormap = parseColormapRaw(commandData, sourceLayerSize);
                  if (virtualProduct === "Raise" && deviceProduct === "Raise2") {
                    const colormapFinal = colormap.map((layer: number[]) =>
                      convertColormapRtoR2(layer, keyboardType, backupKeyboardType),
                    );
                    commandData = colormapFinal.flat().map(k => k.toString()).join(" ");
                  } else if (virtualProduct === "Raise2" && deviceProduct === "Raise") {
                    const colormapFinal = colormap.map((layer: number[]) =>
                      convertColormapR2toR(layer, keyboardType, backupKeyboardType),
                    );
                    commandData = colormapFinal.flat().map(k => k.toString()).join(" ");
                  }
                } else if (command === "palette") {
                  const isSourceRGBW = virtualProduct === "Raise2";
                  const palette = parsePaletteRaw(commandData, isSourceRGBW);
                  if (virtualProduct === "Raise" && deviceProduct === "Raise2") {
                    const paletteFinal = palette.map(color => {
                      const rgbw = rgb2w(color);
                      return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
                    });
                    commandData = paletteFinal.flat().map(v => v.toString()).join(" ");
                  } else if (virtualProduct === "Raise2" && deviceProduct === "Raise") {
                    const paletteFinal = palette.map(color => [color.r, color.g, color.b]);
                    commandData = paletteFinal.flat().map(v => v.toString()).join(" ");
                  }
                }
              }
              
              // Convert keymap/colormap/palette between Defy and Sonsei
              if (needsDefySonseiConversion) {
                if (command === "keymap.custom") {
                  const keyLayerSize = 80;
                  const custom = parseKeymapRaw(commandData, keyLayerSize);
                  const keymapFinal = custom.map((layer: number[]) => convertKeymapDefyToSonsei(layer));
                  commandData = keymapFinal.flat().map(k => k.toString()).join(" ");
                } else if (command === "colormap.map") {
                  const colorLayerSize = virtual.device.keyboardUnderglow.rows * virtual.device.keyboardUnderglow.columns;
                  const colormap = parseColormapRaw(commandData, colorLayerSize);
                  const colormapFinal = colormap.map((layer: number[]) => convertColormapDefyToSonsei(layer));
                  commandData = colormapFinal.flat().map(k => k.toString()).join(" ");
                } else if (command === "palette") {
                  // Defy uses RGBW, Sonsei uses RGB
                  const palette = parsePaletteRaw(commandData, true);
                  const paletteFinal = palette.map(color => [color.r, color.g, color.b]);
                  commandData = paletteFinal.flat().map(v => v.toString()).join(" ");
                }
              }
              
              log.warn(`Going to send ${command} to keyboard`);
              // eslint-disable-next-line no-await-in-loop
              await device.command(command, commandData);
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
   * Finds and returns the latest backup file for a given device and neuron ID.
   * @param {string} backupFolder The folder where backups are stored.
   * @param {string} neuronID The ID of the neuron.
   * @param {Device} device The device.
   * @returns {Promise<any | undefined>} A promise that resolves with the loaded backup object, or undefined if no backup is found or an error occurs.
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
   * Converts a backup from a Defy keyboard to a Sonsei keyboard format.
   * @param {BackupType} backup The backup object to convert.
   * @param {Device} dev The destination device (Raise 2).
   * @returns {BackupCmd[]} The converted backup data.
   */
  static convertDefyToSonsei = (backup: BackupType, dev: Device) => {
    log.info("converting Defy Backup to Sonsei");
    const defyKeyLayerSize = 80;
    const defyColorLayerSize = 178;

    const localBackup: BackupType = JSON.parse(JSON.stringify(backup));
    localBackup.neuron.device = dev.device;

    const keymapIndex = localBackup.backup.findIndex(c => c.command === "keymap.custom");
    const paletteIndex = localBackup.backup.findIndex(c => c.command === "palette");
    const colormapIndex = localBackup.backup.findIndex(c => c.command === "colormap.map");

    const custom = parseKeymapRaw(localBackup.backup[keymapIndex].data, defyKeyLayerSize);
    const colormap = parseColormapRaw(localBackup.backup[colormapIndex].data, defyColorLayerSize);
    const palette = parsePaletteRaw(localBackup.backup[paletteIndex].data, true);

    const keymapFinal = custom.map((layer: number[]) => convertKeymapDefyToSonsei(layer));
    const colormapFinal = colormap.map((layer: number[]) => convertColormapDefyToSonsei(layer));
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
   * Converts a backup from a Raise keyboard to a Raise 2 keyboard format.
   * @param {BackupType} backup The backup object to convert.
   * @param {Device} dev The destination device (Raise 2).
   * @returns {BackupCmd[]} The converted backup data.
   */
  static convertRaiseToRaise2 = (backup: BackupType, dev: Device): BackupCmd[] => {
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
      .map(color => {
        const rgbw = rgb2w(color);
        return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
      })
      .flat()
      .map(v => v.toString())
      .join(" ");

    log.info("Final Backup:", localBackup.backup);
    return localBackup.backup;
  };

  /**
   * Converts a backup from a Raise 2 keyboard to a Raise keyboard format.
   * @param {BackupType} backup The backup object to convert.
   * @param {Device} dev The destination device (Raise).
   * @returns {BackupCmd[]} The converted backup data.
   */
  static convertRaise2ToRaise = (backup: BackupType, dev: Device): BackupCmd[] => {
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
      .map(color => [color.r, color.g, color.b])
      .flat()
      .map(v => v.toString())
      .join(" ");

    log.info("Final Backup:", localBackup.backup);
    return localBackup.backup;
  };

  /**
   * Type guard to check if an object is a BackupType.
   * @param {any} backup The object to check.
   * @returns {boolean} True if the object has a 'backup' property.
   */
  static isBackupType = (backup: any): backup is any => "backup" in backup;
}

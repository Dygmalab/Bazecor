import path from "path";
import fs from "fs";
import { ipcRenderer } from "electron";
import log from "electron-log/renderer";
import { Neuron } from "@Renderer/types/neurons";
import { BackupType } from "@Renderer/types/backups";
import { VirtualType } from "@Renderer/types/virtual";
import { PaletteType } from "@Renderer/types/layout";
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
  convertKeymapSonseiToDefy,
  convertColormapSonseiToDefy,
  convertKeyPositionDefyToSonsei,
  convertKeyPositionSonseiToDefy,
  DEFY_KEYS_PER_LAYER,
  DEFY_LEDS_PER_LAYER,
  SONSEI_KEYS_PER_LAYER,
  SONSEI_LEDS_PER_LAYER,
  parseColormapRaw,
  parseKeymapRaw,
  parsePaletteRaw,
  remapComboPositions,
  stripRaise2OnlyKeys,
  stripRaise2OnlySuperkeyActions,
} from "../parsers";
import { isLegacyCombosReply, upgradeLegacyCombosReply } from "../parsers/combos";
import { fitPaletteToFormat } from "../parsers/palette";
import { rgb2w } from "../color";
import { isSupportedLensProduct } from "../../lens/shared/constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const glob = require(`glob`);
const store = Store.getStore();

type BackupCmd = { command: string; data: string };

// Backed up even when `help` does not list it (see Commands below).
const UNLISTED_BACKUP_COMMANDS = ["led.brightnessUG"];

// Keyboards whose palette is RGBW; the rest (Sonsei, Raise) take plain RGB.
const RGBW_PALETTE_PRODUCTS = ["Defy", "Raise2"];

/** `data` as the target keyboard expects it: only `palette` can arrive in the wrong format. */
const fitCommandToDevice = (command: string, data: string, product: string | undefined): string =>
  command === "palette" && product ? fitPaletteToFormat(data, RGBW_PALETTE_PRODUCTS.includes(product)) : data;

type ConversionSpec = {
  from: string;
  to: string;
  sourceKeys: number;
  targetKeys: number;
  sourceLeds: number;
  targetLeds: number;
  sourceRGBW: boolean;
  // The target has an underglow strip the source lacks; the restore keeps its current colours
  targetUnderglow: boolean;
  // currentLayer: the same layer as it is now on the target board, for the keys / LEDs the source lacks
  keymap: (layer: number[], currentLayer?: number[]) => number[];
  colormap: (layer: number[], currentLayer?: number[], underglowColor?: number) => number[];
  palette: (color: PaletteType) => number[];
  keyPosition: (position: number) => number | null;
};

const DEFY_TO_SONSEI: ConversionSpec = {
  from: "Defy",
  to: "Sonsei",
  sourceKeys: DEFY_KEYS_PER_LAYER,
  targetKeys: SONSEI_KEYS_PER_LAYER,
  sourceLeds: DEFY_LEDS_PER_LAYER,
  targetLeds: SONSEI_LEDS_PER_LAYER,
  sourceRGBW: true,
  targetUnderglow: false,
  keymap: convertKeymapDefyToSonsei,
  colormap: convertColormapDefyToSonsei,
  palette: color => {
    const rgb = convertPaletteR2toR(color);
    return [rgb.r, rgb.g, rgb.b];
  },
  keyPosition: convertKeyPositionDefyToSonsei,
};

const SONSEI_TO_DEFY: ConversionSpec = {
  from: "Sonsei",
  to: "Defy",
  sourceKeys: SONSEI_KEYS_PER_LAYER,
  targetKeys: DEFY_KEYS_PER_LAYER,
  sourceLeds: SONSEI_LEDS_PER_LAYER,
  targetLeds: DEFY_LEDS_PER_LAYER,
  sourceRGBW: false,
  targetUnderglow: true,
  keymap: convertKeymapSonseiToDefy,
  colormap: convertColormapSonseiToDefy,
  palette: color => {
    const rgbw = rgb2w(color);
    return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
  },
  keyPosition: convertKeyPositionSonseiToDefy,
};

const DEFY_SONSEI_CONVERSIONS = [DEFY_TO_SONSEI, SONSEI_TO_DEFY];

const findDefySonseiConversion = (from: string | undefined, to: string | undefined) =>
  DEFY_SONSEI_CONVERSIONS.find(c => c.from === from && c.to === to);

/** What the restore needs to know about the target board for the parts of it
 * the source board lacks; see Backup.conversionTarget. */
type ConversionTarget = {
  // The target's keymap before the restore
  keymap?: number[][];
  // The target's colormap before the restore, read only when it has an underglow to keep
  colormap?: number[][];
  // The palette slot for the target's underglow when its colormap can't be read
  underglowColor?: number;
};

// A Dygma palette holds 16 colours
const PALETTE_SIZE = 16;

/** A backup's palette as colours. It is put in the source board's format
 * first, as some backups carry the other one (see fitPaletteToFormat). */
const parseSourcePalette = (spec: ConversionSpec, palette: string) =>
  parsePaletteRaw(fitPaletteToFormat(palette, spec.sourceRGBW), spec.sourceRGBW);

/** The last slot of a backup's palette, which is usually black. */
const lastPaletteIndex = (spec: ConversionSpec, palette: string | undefined): number => {
  const colors = palette ? parseSourcePalette(spec, palette).length : 0;
  return (colors > 0 ? colors : PALETTE_SIZE) - 1;
};

/** Rewrites one command's data for the target board, or returns it untouched
 * when the command carries nothing layout-specific. */
const convertDefySonseiCommand = (spec: ConversionSpec, command: string, data: string, target: ConversionTarget = {}): string => {
  const join = (values: number[]) => values.map(v => v.toString()).join(" ");
  switch (command) {
    case "keymap.custom":
      return join(parseKeymapRaw(data, spec.sourceKeys).flatMap((layer, i) => spec.keymap(layer, target.keymap?.[i])));
    case "colormap.map":
      return join(
        parseColormapRaw(data, spec.sourceLeds).flatMap((layer, i) =>
          spec.colormap(layer, target.colormap?.[i], target.underglowColor),
        ),
      );
    case "palette":
      return join(parseSourcePalette(spec, data).flatMap(color => spec.palette(color)));
    case "combos.map":
      return remapComboPositions(data, spec.keyPosition);
    default:
      return data;
  }
};

export default class Backup {
  neurons: Neuron[];

  constructor() {
    this.neurons = store.get("neurons") as Neuron[];
    this.DoBackup = this.DoBackup.bind(this);
  }

  /**
   * Function that returns the list of available commands excluding the ones that do not return usefull information for the backup
   * @returns An array with strings that contain the serial commands that are capable of returing the keyboard configuration
   */
  static async Commands(device: Device) {
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
      // Read-only diagnostic dumps. They report live plugin state -- current
      // state machine, counters, whether CapsWord is active right now -- which
      // is not configuration, and replaying it on restore does nothing.
      "autoshift.state",
      "capsword.state",
      "combos.state",
    ];
    const commands = await device.command("help");
    // A blank line in `help` used to end up in every backup as an empty command.
    const validCommands = commands
      .split(/\r?\n/)
      .filter(c => c.trim().length > 0)
      .filter(c => !notRequired.some(v => c.includes(v)));
    UNLISTED_BACKUP_COMMANDS.forEach(c => {
      if (!validCommands.includes(c)) validCommands.push(c);
    });
    return validCommands;
  }

  static backupFolderValid = () => {
    const folder = store.get("settings.backupFolder") as string;
    try {
      const stats = fs.statSync(folder);
      return stats.isDirectory();
    } catch (error) {
      return false;
    }
  };

  /**
   * The function is desgned to make a backup of the whole configuration pertaining the Raise keyboard
   *
   * To achieve this it uses both the list of commands provided by the caller and the neuron ID which
   * will help the function retrieve the current neuron configuration stored locally, so it can be added
   * to the backup
   *
   * @param {Array<string>} commands The required list of commands to be executed on the keyboard, they are retrieved using the Backup.commands function of this same module, you can add or remove from that list as needed.
   * @param {string} neuronID This parameter contains the neuronID obtained from the Raise, so the corresponding local settings can be retrieved.
   * @returns {Backup} Backup The function returns the full made backup, so it can be stored wherever is needed, and changed if the module requires it.
   */
  async DoBackup(commands: string[], neuronID: string, device: Device) {
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
   * This function physically stores the backup file passed as a variable, the backup is stored in the settings.backupFolder and it uses the following file format
   *
   * RaiseBackup-YYYYMMDDhhmmss.json
   * @param {*} localBackup The backup data object to be stored locally
   * @returns True when the function has successfully stored the backup locally, and false if something fails, an error log will be also pushed to the console
   */
  static SaveBackup(backup: BackupType, device: Device) {
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
    const { product, keyboardType } = device.device.info;
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
        // Notify Layer Lens for every board it can visualize (Sonsei, Defy, …).
        // Lens stores the ref per product and only displays it when that board is
        // the active (last-connected) device, so an idle Defy backup is harmless.
        // Unsupported products (e.g. Raise1) are still skipped.
        if (isSupportedLensProduct(product)) {
          log.info(`[Lens] backup saved for ${product} -> notifying Lens (neuronID: ${localBackup.neuronID})`);
          ipcRenderer.send("lens:backup-saved", { backupFolder: folder, neuronID: localBackup.neuronID, product, keyboardType });
        } else {
          log.info(`[Lens] backup saved for ${product} -> not a Lens-supported board, ignored`);
        }
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

  static restoreBackup = async (neurons: Neuron[], neuronID: string, backup: BackupType, device: Device) => {
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
    const targetProduct = device.device.info.product;
    const sourceProduct = backup.neuron?.device?.info?.product;
    log.info(`Restoring a ${sourceProduct ?? "unknown"} backup onto a ${targetProduct}`);
    if (targetProduct === "Raise2" && sourceProduct === "Raise") data = Backup.convertRaiseToRaise2(backup, device);
    if (targetProduct === "Raise" && sourceProduct === "Raise2") data = Backup.convertRaise2ToRaise(backup, device);
    if (targetProduct === "Sonsei" && sourceProduct === "Defy") data = await Backup.convertDefyToSonsei(backup, device);
    if (targetProduct === "Defy" && sourceProduct === "Sonsei") data = await Backup.convertSonseiToDefy(backup, device);
    // A command the keyboard does not know may never be answered, and a request
    // that times out leaves its reply callback queued in Device, shifting every
    // later reply onto the wrong command -- so the rest of the restore silently
    // goes wrong. Worse, older firmware hangs on an unknown command whose
    // arguments overflow its serial buffer (combos.map after a downgrade), and
    // every command after it times out. Another board's backup or a newer
    // firmware's backup carries some, so only send what the target lists in `help`.
    data = await Backup.keepSupportedCommands(data, device);
    data = data.filter(c => typeof c.command === "string" && c.command.trim().length > 0);
    data = data.map(c => (typeof c.data === "string" ? { ...c, data: fitCommandToDevice(c.command, c.data, targetProduct) } : c));
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
    data = await Backup.adaptCombosToDevice(data, device);
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

  static restoreVirtual = async (virtual: VirtualType, device: Device) => {
    if (device) {
      try {
        log.info("Restoring all settings");
        const data = virtual.virtual;

        // Check if we need to convert between different keyboard families
        const virtualProduct = virtual.device.info.product;
        const deviceProduct = device.device.info.product;
        const needsRaiseConversion =
          (virtualProduct === "Raise" && deviceProduct === "Raise2") ||
          (virtualProduct === "Raise2" && deviceProduct === "Raise");
        const defySonseiConversion = findDefySonseiConversion(virtualProduct, deviceProduct);
        // Same reason as in restoreBackup: never send commands the target does
        // not know, whether they come from another board or a newer firmware.
        const supported = await Backup.supportedCommands(device);
        const conversionTarget = defySonseiConversion
          ? await Backup.conversionTarget(device, defySonseiConversion, data.palette?.data)
          : undefined;

        for (const command in data) {
          if (supported && !supported.has(command)) {
            log.info(`Skipping ${command}: not supported by the connected keyboard`);
          } else if (data[command].eraseable === true) {
            // eslint-disable-next-line no-await-in-loop
            if (!(command.includes("wireless") || command.includes("led"))) {
              let commandData = data[command].data.trim();

              if (command === "superkeys.map" && virtualProduct === "Raise2" && deviceProduct === "Raise") {
                commandData = stripRaise2OnlySuperkeyActions(commandData);
              }

              // Convert keymap, colormap and palette between Raise and Raise2
              if (needsRaiseConversion) {
                const { keyboardType } = device.device.info;
                const backupKeyboardType = virtual.device.info.keyboardType;

                if (command === "keymap.custom") {
                  const keyLayerSize = 80;
                  const custom = parseKeymapRaw(commandData, keyLayerSize);
                  if (virtualProduct === "Raise" && deviceProduct === "Raise2") {
                    const keymapFinal = custom.map((layer: number[]) => convertKeymapRtoR2(layer, keyboardType));
                    commandData = keymapFinal
                      .flat()
                      .map(k => k.toString())
                      .join(" ");
                  } else if (virtualProduct === "Raise2" && deviceProduct === "Raise") {
                    const keymapFinal = custom.map((layer: number[]) =>
                      stripRaise2OnlyKeys(convertKeymapR2toR(layer, keyboardType)),
                    );
                    commandData = keymapFinal
                      .flat()
                      .map(k => k.toString())
                      .join(" ");
                  }
                } else if (command === "colormap.map") {
                  const sourceLayerSize = virtual.device.keyboardUnderglow.rows * virtual.device.keyboardUnderglow.columns;
                  const colormap = parseColormapRaw(commandData, sourceLayerSize);
                  if (virtualProduct === "Raise" && deviceProduct === "Raise2") {
                    const colormapFinal = colormap.map((layer: number[]) =>
                      convertColormapRtoR2(layer, keyboardType, backupKeyboardType),
                    );
                    commandData = colormapFinal
                      .flat()
                      .map(k => k.toString())
                      .join(" ");
                  } else if (virtualProduct === "Raise2" && deviceProduct === "Raise") {
                    const colormapFinal = colormap.map((layer: number[]) =>
                      convertColormapR2toR(layer, keyboardType, backupKeyboardType),
                    );
                    commandData = colormapFinal
                      .flat()
                      .map(k => k.toString())
                      .join(" ");
                  }
                } else if (command === "palette") {
                  const isSourceRGBW = virtualProduct === "Raise2";
                  const palette = parsePaletteRaw(commandData, isSourceRGBW);
                  if (virtualProduct === "Raise" && deviceProduct === "Raise2") {
                    const paletteFinal = palette.map(color => {
                      const rgbw = rgb2w(color);
                      return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
                    });
                    commandData = paletteFinal
                      .flat()
                      .map(v => v.toString())
                      .join(" ");
                  } else if (virtualProduct === "Raise2" && deviceProduct === "Raise") {
                    const paletteFinal = palette.map(color => [color.r, color.g, color.b]);
                    commandData = paletteFinal
                      .flat()
                      .map(v => v.toString())
                      .join(" ");
                  }
                }
              }

              // Convert keymap/colormap/palette/combos between Defy and Sonsei
              if (defySonseiConversion) {
                commandData = convertDefySonseiCommand(defySonseiConversion, command, commandData, conversionTarget);
              }
              commandData = fitCommandToDevice(command, commandData, deviceProduct);

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

  static getLatestBackup = async (backupFolder: string, neuronID: string, device: Device) => {
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
   * A backup from the first combos firmware stores `combos.map` with four keys
   * per combo. Restoring it onto the current firmware -- which is what the
   * firmware update flow does right after flashing -- has to convert it first,
   * or every record lands misaligned. The keyboard is asked which format it
   * speaks, so restoring onto the old firmware still sends the old blob.
   */
  static adaptCombosToDevice = async <T extends { command: string; data: unknown }>(
    data: T[],
    device: Device | undefined,
  ): Promise<T[]> => {
    const index = data.findIndex(c => c.command === "combos.map");
    if (index < 0 || !device) return data;

    const stored = String(data[index].data ?? "");
    if (!isLegacyCombosReply(stored)) return data;

    try {
      const current = (await device.command("combos.map")) as string;
      if (!current || current.trim().length === 0 || isLegacyCombosReply(current)) return data;
    } catch (error) {
      log.warn("[Combos] could not read combos.map before restoring; sending the backup as is", error);
      return data;
    }

    log.info("[Combos] converting a 4-key combos.map backup to the current 6-key format");
    const adapted = data.slice();
    adapted[index] = { ...data[index], data: upgradeLegacyCombosReply(stored) };
    return adapted;
  };

  /** The commands `device` lists in `help`, or null when they can't be read. */
  static supportedCommands = async (device: Device): Promise<Set<string> | null> => {
    let help: unknown;
    try {
      // Not from the cache: after a firmware update the cached list belongs to
      // the firmware that was replaced.
      help = await device.noCacheCommand("help");
    } catch (error) {
      log.warn("Could not read the keyboard's command list", error);
      return null;
    }
    // Device returns the Error itself when the request fails.
    if (typeof help !== "string") {
      log.warn("Could not read the keyboard's command list", help);
      return null;
    }
    const supported = new Set(
      help
        .split(/\r?\n/)
        .map(c => c.trim())
        .filter(c => c.length > 0),
    );
    if (supported.size === 0) return null;
    UNLISTED_BACKUP_COMMANDS.forEach(c => supported.add(c));
    return supported;
  };

  /**
   * Drops the commands `device` does not list in `help`. Keeps everything when
   * `help` can't be read, rather than restoring nothing.
   */
  static keepSupportedCommands = async <T extends { command: string }>(data: T[], device: Device): Promise<T[]> => {
    const supported = await Backup.supportedCommands(device);
    if (!supported) return data;
    return data.filter(c => {
      if (supported.has(c.command)) return true;
      log.info(`Skipping ${c.command}: not supported by the connected keyboard`);
      return false;
    });
  };

  /** The keymap on `dev` before the restore, split into layers of the target
   * board's size, so the keys the source board lacks keep their current value
   * instead of turning transparent. Undefined when it can't be read. */
  private static readTargetKeymap = async (dev: Device, spec: ConversionSpec): Promise<number[][] | undefined> => {
    try {
      const raw = (await dev.noCacheCommand("keymap.custom")) as string;
      return raw ? parseKeymapRaw(raw, spec.targetKeys) : undefined;
    } catch (error) {
      log.warn(`Could not read the ${spec.to} keymap; keys the ${spec.from} lacks will be transparent`, error);
      return undefined;
    }
  };

  /** The colormap on `dev` before the restore, split into layers of the target
   * board's size, so the LEDs the source lacks (underglow included) keep the
   * palette slots they have now.
   * Undefined when it can't be read. */
  private static readTargetColormap = async (dev: Device, spec: ConversionSpec): Promise<number[][] | undefined> => {
    try {
      const raw = (await dev.noCacheCommand("colormap.map")) as string;
      return raw ? parseColormapRaw(raw, spec.targetLeds) : undefined;
    } catch (error) {
      log.warn(`Could not read the ${spec.to} colormap; its underglow will take the palette's last colour`, error);
      return undefined;
    }
  };

  /** The target board's current keymap and, when it has an underglow, its
   * current colormap. The palette's last slot (usually black) is the underglow
   * colour for layers the current colormap doesn't cover. */
  private static conversionTarget = async (
    dev: Device,
    spec: ConversionSpec,
    palette: string | undefined,
  ): Promise<ConversionTarget> => ({
    keymap: await Backup.readTargetKeymap(dev, spec),
    colormap: spec.targetUnderglow ? await Backup.readTargetColormap(dev, spec) : undefined,
    underglowColor: spec.targetUnderglow ? lastPaletteIndex(spec, palette) : undefined,
  });

  /** Moves a Defy <-> Sonsei backup onto the other board's layout: keymap,
   * colormap, palette (RGBW vs RGB) and combo key positions. */
  private static convertDefySonsei = async (backup: BackupType, dev: Device, spec: ConversionSpec) => {
    log.info(`converting ${spec.from} Backup to ${spec.to}`);
    const palette = backup.backup.find(c => c.command === "palette")?.data;
    const target = await Backup.conversionTarget(dev, spec, typeof palette === "string" ? palette : undefined);
    const localBackup: BackupType = JSON.parse(JSON.stringify(backup));
    localBackup.neuron.device = dev.device;
    localBackup.backup = localBackup.backup.map(c =>
      typeof c.data === "string" ? { ...c, data: convertDefySonseiCommand(spec, c.command, c.data, target) } : c,
    );
    log.info("Final Backup:", localBackup.backup);
    return localBackup.backup;
  };

  static convertDefyToSonsei = (backup: BackupType, dev: Device) => Backup.convertDefySonsei(backup, dev, DEFY_TO_SONSEI);

  static convertSonseiToDefy = (backup: BackupType, dev: Device) => Backup.convertDefySonsei(backup, dev, SONSEI_TO_DEFY);

  static convertRaiseToRaise2 = (backup: BackupType, dev: Device) => {
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

  static convertRaise2ToRaise = (backup: BackupType, dev: Device) => {
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

    // The Raise 1 firmware lacks Lens, Autoshift, CapsWord and the wireless keys.
    const keymapFinal = custom.map((layer: number[]) =>
      stripRaise2OnlyKeys(convertKeymapR2toR(layer, dev.device.info.keyboardType)),
    );
    const colormapFinal = colormap.map((layer: number[]) =>
      convertColormapR2toR(layer, dev.device.info.keyboardType, backup.neuron.device.info.keyboardType),
    );
    const paletteFinal = palette.map(color => convertPaletteR2toR(color));

    const superkeysIndex = localBackup.backup.findIndex(c => c.command === "superkeys.map");
    if (superkeysIndex > -1 && typeof localBackup.backup[superkeysIndex].data === "string") {
      localBackup.backup[superkeysIndex].data = stripRaise2OnlySuperkeyActions(localBackup.backup[superkeysIndex].data);
    }

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

  static isBackupType = (backup: any): backup is any => "backup" in backup;
}

import fs from "fs";
import path from "path";
import type { KeyboardModel, LensKeyboardRef } from "../shared/types";
import { SONSEI_KEYS_PER_LAYER, SONSEI_COLOR_LAYER_SIZE, getProductSpec } from "../shared/constants";
import { parseKeymap, parsePaletteRGB, parsePaletteRGBW, parseColormap, parseSuperkeys, parseNames } from "./parsers";

interface BazecorNeuronLayer {
  id: number;
  name: string;
}

interface BazecorNeuronSuperkey {
  id: number;
  name: string;
  actions?: number[];
}

interface BazecorNeuron {
  layers?: BazecorNeuronLayer[];
  superkeys?: BazecorNeuronSuperkey[];
  macros?: { id: number; name?: string }[];
}

interface BazecorBackup {
  neuronID: string;
  neuron?: BazecorNeuron;
  backup: { command: string; data: string }[];
}

function getCommandData(backup: BazecorBackup, command: string): string {
  return backup.backup.find(e => e.command === command)?.data ?? "";
}

export function parseBackupToModel(backupRaw: string, product: string, keyboardType?: string): KeyboardModel {
  const backup = JSON.parse(backupRaw) as BazecorBackup;
  // Per-product layout metrics; unknown products fall back to Sonsei (RGB).
  const spec = getProductSpec(product);
  const kpl = spec?.keysPerLayer ?? SONSEI_KEYS_PER_LAYER;
  const cls = spec?.colorLayerSize ?? SONSEI_COLOR_LAYER_SIZE;
  const parsePalette = spec?.paletteFormat === "rgbw" ? parsePaletteRGBW : parsePaletteRGB;

  const keymapRaw = getCommandData(backup, "keymap.custom");
  const paletteRaw = getCommandData(backup, "palette");
  const colormapRaw = getCommandData(backup, "colormap.map");
  const defaultLayerRaw = getCommandData(backup, "settings.defaultLayer");
  const superkeysRaw = getCommandData(backup, "superkeys.map");

  // Names are stored in backup.neuron (Bazecor electron-store), not in Focus commands.
  // Sort by id to guarantee index alignment with keymap codes.
  const { neuron } = backup;
  const layerNames =
    neuron?.layers
      ?.slice()
      .sort((a, b) => a.id - b.id)
      .map(l => l.name) ?? parseNames(getCommandData(backup, "layers.names"));

  const superkeyNames =
    neuron?.superkeys
      ?.slice()
      .sort((a, b) => a.id - b.id)
      .map(s => s.name) ?? parseNames(getCommandData(backup, "superkeys.names"));

  const macroNames =
    neuron?.macros
      ?.slice()
      .sort((a, b) => a.id - b.id)
      .map(m => m.name ?? "") ?? parseNames(getCommandData(backup, "macros.names"));

  return {
    product,
    keyboardType,
    keymap: parseKeymap(keymapRaw, kpl),
    palette: parsePalette(paletteRaw),
    colormap: parseColormap(colormapRaw, cls),
    defaultLayer: parseInt(defaultLayerRaw.trim() || "0", 10),
    superkeys: parseSuperkeys(superkeysRaw),
    superkeyNames,
    macroNames,
    layerNames,
  };
}

export function findLatestBackup(keyboard: LensKeyboardRef): string | null {
  const { backupFolder, neuronID, product } = keyboard;
  const folderPath = path.join(backupFolder, product, neuronID);
  if (!fs.existsSync(folderPath)) return null;

  const files = fs
    .readdirSync(folderPath)
    .filter(f => f.endsWith(".json"))
    .map(f => path.join(folderPath, f));
  if (files.length === 0) return null;

  const sorted = files.map(f => ({ f, mtime: fs.statSync(f).mtime.getTime() })).sort((a, b) => b.mtime - a.mtime);

  return sorted[0].f;
}

export function readLatestModel(keyboard: LensKeyboardRef): KeyboardModel | null {
  const filePath = findLatestBackup(keyboard);
  if (!filePath) return null;
  try {
    const raw = fs.readFileSync(filePath, "utf-8");
    return parseBackupToModel(raw, keyboard.product, keyboard.keyboardType);
  } catch {
    return null;
  }
}

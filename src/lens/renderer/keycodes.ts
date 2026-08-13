import type { DecodedKey, FunctionIconName } from "../shared/types";

/* Firmware keycode → display label decoding for the Lens overlay.
 *
 * Labels mirror Bazecor's keymap DB (src/api/keymap/db/*) so a key reads the
 * same in the overlay as in the Layout Editor: single-line keys use the DB's
 * `primary` label, and keys the DB renders as a small `top` tag over a primary
 * ("MACRO 3", "Mouse UP", "Num 7", …) become two stacked lines here. Icons the
 * editor draws as React components (layer shift/lock tags, media glyphs) are
 * approximated with text/unicode equivalents. */

// Single-line labels, keyed by keycode. Letter/digit/punctuation entries can be
// overridden per language layout (see layouts.ts).
const BASE: Record<number, string> = {
  4: "A",
  5: "B",
  6: "C",
  7: "D",
  8: "E",
  9: "F",
  10: "G",
  11: "H",
  12: "I",
  13: "J",
  14: "K",
  15: "L",
  16: "M",
  17: "N",
  18: "O",
  19: "P",
  20: "Q",
  21: "R",
  22: "S",
  23: "T",
  24: "U",
  25: "V",
  26: "W",
  27: "X",
  28: "Y",
  29: "Z",
  30: "1",
  31: "2",
  32: "3",
  33: "4",
  34: "5",
  35: "6",
  36: "7",
  37: "8",
  38: "9",
  39: "0",
  40: "ENTER",
  41: "ESC",
  42: "BACKSPACE",
  43: "TAB",
  44: "SPACE",
  45: "-",
  46: "=",
  47: "[",
  48: "]",
  49: "\\",
  51: ";",
  52: "'",
  53: "`",
  54: ",",
  55: ".",
  56: "/",
  57: "CAPS LOCK",
  58: "F1",
  59: "F2",
  60: "F3",
  61: "F4",
  62: "F5",
  63: "F6",
  64: "F7",
  65: "F8",
  66: "F9",
  67: "F10",
  68: "F11",
  69: "F12",
  70: "PRINT SCRN",
  71: "SCROLL LCK",
  72: "PAUSE",
  73: "INSERT",
  74: "HOME",
  75: "PAGE UP",
  76: "DEL",
  77: "END",
  78: "PAGE DOWN",
  79: "→",
  80: "←",
  81: "↓",
  82: "↑",
  100: "<>",
  101: "MENU",
  104: "F13",
  105: "F14",
  106: "F15",
  107: "F16",
  108: "F17",
  109: "F18",
  110: "F19",
  111: "F20",
  112: "F21",
  113: "F22",
  114: "F23",
  115: "F24",
};

// Keys Bazecor renders as a small `top` group tag above the `primary` label —
// shown in Lens as two stacked lines ([line1, line2]).
const TWO_LINE: Record<number, [string, string]> = {
  // Modifiers (db/modifiers.ts)
  224: ["LEFT", "CTRL"],
  225: ["LEFT", "SHIFT"],
  226: ["LEFT", "ALT"],
  227: ["LEFT", "OS"],
  228: ["RIGHT", "CTRL"],
  229: ["RIGHT", "SHIFT"],
  230: ["ALT GR", ""],
  231: ["RIGHT", "OS"],

  // Numpad (db/numpad.ts)
  83: ["Num", "LOCK"],
  84: ["Num", "/"],
  85: ["Num", "*"],
  86: ["Num", "-"],
  87: ["Num", "+"],
  88: ["Num", "ENTER"],
  89: ["Num", "1"],
  90: ["Num", "2"],
  91: ["Num", "3"],
  92: ["Num", "4"],
  93: ["Num", "5"],
  94: ["Num", "6"],
  95: ["Num", "7"],
  96: ["Num", "8"],
  97: ["Num", "9"],
  98: ["Num", "0"],
  99: ["Num", "."],

  // Mouse movement / wheel / buttons / warp (db/mousecontrols.ts)
  20481: ["Mouse", "UP"],
  20482: ["Mouse", "DOWN"],
  20484: ["Mouse", "LEFT"],
  20488: ["Mouse", "RIGHT"],
  20497: ["M.Wheel", "UP"],
  20498: ["M.Wheel", "DOWN"],
  20500: ["M.Wheel", "LEFT"],
  20504: ["M.Wheel", "RIGHT"],
  20545: ["M.Btn", "LEFT"],
  20546: ["M.Btn", "RIGHT"],
  20548: ["M.Btn", "MIDDLE"],
  20552: ["M.Btn", "BACK"],
  20560: ["M.Btn", "FORW."],
  20576: ["M.Warp", "END"],
  20517: ["M.Warp", "NW"],
  20518: ["M.Warp", "SW"],
  20521: ["M.Warp", "NE"],
  20522: ["M.Warp", "SE"],

  // LED effects (db/ledeffects.tsx)
  17152: ["LED", "NEXT"],
  17153: ["LED", "PREV."],
  17154: ["LED", "TOGGLE"],

  // SpaceCadet (db/spacecadet.ts)
  53591: ["SCadet", "ENABLE"],
  53592: ["SCadet", "DISABLE"],

  // Wireless / Lens (db/wireless.ts). 54112 is claimed by both RF STATUS and the
  // Lens superkey; Bazecor's key picker treats it as the Lens key, so we do too.
  54108: ["BATT.", "LEVEL"],
  54109: ["BLUET.", "PAIR."],
  54111: ["ENERGY", "STATUS"],
  54112: ["LENS", "SK-LENS"],
  54113: ["LENS", "TAP"],
  54114: ["LENS", "HOLD"],
};

const ONE_SHOT_MOD: Record<number, string> = {
  49153: "Ctrl",
  49154: "Shift",
  49155: "Alt",
  49156: "OS",
  49157: "Ctrl",
  49158: "Shift",
  49159: "AltGr",
  49160: "OS",
};

// Media / miscellaneous singles (db/mediacontrols.tsx, db/miscellaneous.tsx) —
// Bazecor renders these as icons (IconMediaSoundMute, IconToolsEject, …); the
// icon glyphs themselves are drawn in key-label.tsx's FUNCTION_ICON_PATHS,
// keyed by the names below.
const FUNCTION: Record<number, FunctionIconName> = {
  19682: "mute",
  23785: "vol-up",
  23786: "vol-down",
  22733: "play-pause",
  22709: "next",
  22710: "prev",
  22711: "stop",
  22712: "eject",
  22713: "shuffle",
  18552: "camera",
  18834: "calculator",
  23663: "bright-up",
  23664: "bright-down",
  20865: "power-off",
  20866: "sleep",
};

export { layoutOverrides, shiftOverrides } from "./layouts";

// Layer key codes — verified against Bazecor src/api/keymap/db/layerswitch.tsx
const LAYER_LOCK_MIN = 17408; // LockLayerTable  layer 1-10
const LAYER_LOCK_MAX = 17417;
const LAYER_SHIFT_MIN = 17450; // ShiftToLayerTable layer 1-10
const LAYER_SHIFT_MAX = 17459;
const LAYER_MOVE_MIN = 17492; // MoveToLayerTable  layer 1-10
const LAYER_MOVE_MAX = 17501;

// One-shot layer — db/oneshot.tsx layer 1-8
const LAYER_ONESHOT_MIN = 49161;
const LAYER_ONESHOT_MAX = 49168;

// Dual-use modifier — db/dualuse.tsx: base + keyCode, Ctrl/Shift/Alt/OS are
// contiguous 256-wide blocks from 49169; AltGr sits apart at 50705.
const DUAL_MOD_MIN = 49169;
const DUAL_MOD_MAX = 50192; // 49937 (OS) + 255
const DUAL_MOD_NAMES = ["Ctrl", "Shift", "Alt", "OS"];
const DUAL_ALTGR_MIN = 50705;
const DUAL_ALTGR_MAX = 50960;

// Dual-use layer — db/dualuse.tsx: base 51218 + (layerIdx)*256 + keyCode, layers 1-8
const LAYER_DUAL_MIN = 51218;
const LAYER_DUAL_MAX = 53265;

// TapDance / Leader — db/tapdance.ts (53267 + 0..63), db/leader.ts (53283-53290,
// inside the tapdance range; Bazecor's DB gives Leader priority, so we do too).
const TAPDANCE_MIN = 53267;
const TAPDANCE_MAX = 53330;
const LEADER_MIN = 53283;
const LEADER_MAX = 53290;

// Steno — db/steno.ts, codes 53549-53590 in table order.
const STENO_MIN = 53549;
// prettier-ignore
const STENO_LABELS = [
  "FN", "N1", "N2", "N3", "N4", "N5", "N6", "S1", "S2", "TL", "KL", "PL", "WL", "HL",
  "RL", "A", "O", "ST1", "ST2", "RE1", "RE2", "PWR", "ST3", "ST4", "E", "U", "FR",
  "RR", "PR", "BR", "LR", "GR", "TR", "SR", "DR", "N7", "N8", "N9", "NA", "NB", "NC", "ZR",
];
const STENO_MAX = STENO_MIN + STENO_LABELS.length - 1;

// Macros and superkeys — verified against Bazecor src/api/keymap/db/macros.ts & superkeys.ts
const MACRO_MIN = 53852; // 53852 + index (128 macros)
const MACRO_MAX = 53979;
const SUPERKEY_MIN = 53980; // 53980 + index (128 superkeys)
const SUPERKEY_MAX = 54107;

/* eslint-disable no-bitwise -- decoding firmware keycodes is inherently bit-mask work */
// Modifier flag bits per Bazecor's withModifiers() offsets (db/utils.ts):
// Control +256, Alt +512, AltGr +1024, Shift +2048, OS +4096.
function modBitsToArray(modByte: number): string[] {
  const mods: string[] = [];
  if (modByte & 0x01) mods.push("Ctrl");
  if (modByte & 0x02) mods.push("Alt");
  if (modByte & 0x04) mods.push("AltGr");
  if (modByte & 0x08) mods.push("Shift");
  if (modByte & 0x10) mods.push("OS");
  return mods;
}

export function superkeyIndex(code: number): number | null {
  if (code >= SUPERKEY_MIN && code <= SUPERKEY_MAX) return code - SUPERKEY_MIN;
  return null;
}

/** Tap-label for a plain HID code inside a compound key (dual-use, key+modifier). */
function baseLabelFor(code: number, layout: Record<number, string>): string {
  if (layout[code]) return layout[code];
  if (BASE[code] !== undefined) return BASE[code];
  const twoLine = TWO_LINE[code];
  if (twoLine) return twoLine[1] ? `${twoLine[0]} ${twoLine[1]}` : twoLine[0];
  return "";
}

function layerName(num: number, layerNames: string[]): string {
  return layerNames[num - 1] || "";
}

/* Layer keys mirror Bazecor's LayerTag (shift/lock icon + layer number): the
 * primary line always shows the target layer's plain number — never a custom
 * layer name, so the icon + number reads the same regardless of how long or
 * short the layer's name happens to be — and holdIcon tells key-label.tsx to
 * draw the matching lock/shift/oneshot glyph in place of text. */
function decodeLayerKey(code: number, layerNames: string[], layout: Record<number, string>): DecodedKey | null {
  if (code >= LAYER_LOCK_MIN && code <= LAYER_LOCK_MAX) {
    const n = code - LAYER_LOCK_MIN + 1;
    return { primary: `${n}`, hold: "lock", holdIcon: "lock" };
  }
  if (code >= LAYER_SHIFT_MIN && code <= LAYER_SHIFT_MAX) {
    const n = code - LAYER_SHIFT_MIN + 1;
    return { primary: `${n}`, hold: "shift", holdIcon: "shift" };
  }
  if (code >= LAYER_MOVE_MIN && code <= LAYER_MOVE_MAX) {
    const n = code - LAYER_MOVE_MIN + 1;
    return { primary: `${n}`, hold: "lock", holdIcon: "lock" };
  }
  if (code >= LAYER_ONESHOT_MIN && code <= LAYER_ONESHOT_MAX) {
    const n = code - LAYER_ONESHOT_MIN + 1;
    return { primary: `${n}`, hold: "1shot", holdIcon: "oneshot" };
  }
  if (code >= LAYER_DUAL_MIN && code <= LAYER_DUAL_MAX) {
    const layerIdx = Math.trunc((code - LAYER_DUAL_MIN) / 256);
    const tapLabel = baseLabelFor((code - LAYER_DUAL_MIN) % 256, layout);
    const name = layerName(layerIdx + 1, layerNames);
    return { primary: tapLabel || name || `${layerIdx + 1}`, hold: name || `${layerIdx + 1}` };
  }
  return null;
}

function decodeDualUseModifier(code: number, layout: Record<number, string>): DecodedKey | null {
  if (code >= DUAL_MOD_MIN && code <= DUAL_MOD_MAX) {
    const modName = DUAL_MOD_NAMES[(code - DUAL_MOD_MIN) >> 8];
    return { primary: baseLabelFor((code - DUAL_MOD_MIN) % 256, layout) || modName, hold: modName };
  }
  if (code >= DUAL_ALTGR_MIN && code <= DUAL_ALTGR_MAX) {
    return { primary: baseLabelFor(code - DUAL_ALTGR_MIN, layout) || "AltGr", hold: "AltGr" };
  }
  return null;
}

export function decodeKey(
  code: number,
  layout: Record<number, string> = {},
  layerNames: string[] = [],
  macroNames: string[] = [],
  shiftSymbols: Record<number, string> | null = null,
): DecodedKey {
  if (code === 0) return { primary: "NO", subtitle: "KEY", hold: "" };
  if (code === 1 || code === 65535) return { primary: "TRANS", hold: "" };
  if (layout[code]) return { primary: layout[code], hold: "" };
  if (BASE[code] !== undefined) return { primary: BASE[code], hold: "" };
  const twoLine = TWO_LINE[code];
  if (twoLine) return twoLine[1] ? { primary: twoLine[0], subtitle: twoLine[1], hold: "" } : { primary: twoLine[0], hold: "" };
  if (ONE_SHOT_MOD[code]) return { primary: ONE_SHOT_MOD[code], hold: "1shot" };
  if (FUNCTION[code]) return { primary: "", hold: "", icon: FUNCTION[code] };

  const layerKey = decodeLayerKey(code, layerNames, layout);
  if (layerKey) return layerKey;

  const dualMod = decodeDualUseModifier(code, layout);
  if (dualMod) return dualMod;

  if (code >= SUPERKEY_MIN && code <= SUPERKEY_MAX) return { primary: `SK${code - SUPERKEY_MIN + 1}`, hold: "" };

  if (code >= MACRO_MIN && code <= MACRO_MAX) {
    const idx = code - MACRO_MIN;
    return { primary: "MACRO", subtitle: macroNames[idx] || `${idx + 1}`, hold: "" };
  }

  if (code >= STENO_MIN && code <= STENO_MAX) return { primary: "Steno", subtitle: STENO_LABELS[code - STENO_MIN], hold: "" };
  // Leader shares codes with the middle of the TapDance range; Bazecor resolves
  // the collision in Leader's favor, so check it first.
  if (code >= LEADER_MIN && code <= LEADER_MAX) return { primary: "Leader", subtitle: `#${code - LEADER_MIN}`, hold: "" };
  if (code >= TAPDANCE_MIN && code <= TAPDANCE_MAX) return { primary: "TAPD", subtitle: `${code - TAPDANCE_MIN}`, hold: "" };

  // Key + modifier combination: high byte = modifier flags, low byte = HID keycode.
  // Checked last so all named ranges above take priority.
  const modFlags = (code >> 8) & 0xff;
  const baseCode = code & 0xff;
  if (modFlags !== 0) {
    // Shift alone on a symbol-row key produces a specific character — show
    // that character, not the unshifted key + a "S" chip (see shiftOverrides
    // in layouts.ts for why this is scoped to plain Shift only, not Ctrl/Alt/
    // AltGr/OS combos, which really are shortcuts and should keep showing the
    // chip — and why it's null instead of guessing on layouts with no
    // transcribed shift table yet).
    if (modFlags === 0x08 && shiftSymbols?.[baseCode]) {
      return { primary: shiftSymbols[baseCode], hold: "" };
    }
    const baseLabel = baseLabelFor(baseCode, layout);
    if (baseLabel) return { primary: baseLabel, hold: "", modifiers: modBitsToArray(modFlags) };
  }

  return { primary: `#${code}`, hold: "" };
}

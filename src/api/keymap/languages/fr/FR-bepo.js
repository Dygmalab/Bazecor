/* Bazecor keymap library
 * Copyright (C) 2019  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Is an Array of objects of values that have to be modified.
 */
import { withModifiers } from "../../db/utils";

const OFFSET_CONTROL = 256;
const OFFSET_ALT = 512;
const OFFSET_CONTROL_ALT = 768;
const OFFSET_ALTGR = 1024;
const OFFSET_SHIFT = 2048;
const OFFSET_OS = 4096;
const OFFSET_SHIFT_ALTGR = 3072;

const symbols = [
  {
    code: 53,
    labels: {
      primary: "$",
    },
  },
  {
    code: 30,
    labels: {
      primary: '"',
    },
  },
  {
    code: 31,
    labels: {
      primary: "«",
    },
  },
  {
    code: 32,
    labels: {
      primary: "»",
    },
  },
  {
    code: 33,
    labels: {
      primary: "(",
    },
  },
  {
    code: 34,
    labels: {
      primary: ")",
    },
  },
  {
    code: 35,
    labels: {
      primary: "@",
    },
  },
  {
    code: 36,
    labels: {
      primary: "+",
    },
  },
  {
    code: 37,
    labels: {
      primary: "-",
    },
  },
  {
    code: 38,
    labels: {
      primary: "/",
    },
  },
  {
    code: 39,
    labels: {
      primary: "*",
    },
  },
  {
    code: 45,
    labels: {
      primary: "=",
    },
  },
  {
    code: 46,
    labels: {
      primary: "%",
    },
  },
];

const frFRbepoLetters = [
  // First row
  {
    code: 20,
    labels: {
      primary: "b",
    },
  },
  {
    code: 26,
    labels: {
      primary: "é",
    },
  },
  {
    code: 8,
    labels: {
      primary: "p",
    },
  },
  {
    code: 21,
    labels: {
      primary: "o",
    },
  },
  {
    code: 23,
    labels: {
      primary: "è",
    },
  },
  {
    code: 28,
    labels: {
      primary: "^",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 24,
    labels: {
      primary: "v",
    },
  },
  {
    code: 12,
    labels: {
      primary: "d",
    },
  },
  {
    code: 18,
    labels: {
      primary: "l",
    },
  },
  {
    code: 19,
    labels: {
      primary: "j",
    },
  },
  {
    code: 47,
    labels: {
      primary: "z",
    },
    newGroupName: "Letters",
  },
  {
    code: 48,
    labels: {
      primary: "w",
    },
    newGroupName: "Letters",
  },
  // Second row
  {
    code: 4,
    labels: {
      primary: "a",
    },
  },
  {
    code: 22,
    labels: {
      primary: "u",
    },
  },
  {
    code: 7,
    labels: {
      primary: "i",
    },
  },
  {
    code: 9,
    labels: {
      primary: "e",
    },
  },
  {
    code: 10,
    labels: {
      primary: ",",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 11,
    labels: {
      primary: "c",
    },
  },
  {
    code: 13,
    labels: {
      primary: "t",
    },
  },
  {
    code: 14,
    labels: {
      primary: "s",
    },
  },
  {
    code: 15,
    labels: {
      primary: "r",
    },
  },
  {
    code: 51,
    labels: {
      primary: "n",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "m",
    },
    newGroupName: "Letters",
  },
  {
    code: 49,
    labels: {
      primary: "ç",
    },
    newGroupName: "Letters",
  },
  // Third row
  {
    code: 100,
    labels: {
      primary: "ê",
    },
    newGroupName: "Letters",
  },
  {
    code: 29,
    labels: {
      primary: "à",
    },
  },
  {
    code: 27,
    labels: {
      primary: "y",
    },
  },
  {
    code: 6,
    labels: {
      primary: "x",
    },
  },
  {
    code: 25,
    labels: {
      primary: ".",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 5,
    labels: {
      primary: "k",
    },
  },
  {
    code: 17,
    labels: {
      primary: "’",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 16,
    labels: {
      primary: "q",
    },
  },
  {
    code: 54,
    labels: {
      primary: "g",
    },
    newGroupName: "Letters",
  },
  {
    code: 55,
    labels: {
      primary: "h",
    },
    newGroupName: "Letters",
  },
  {
    code: 56,
    labels: {
      primary: "f",
    },
    newGroupName: "Letters",
  },
];

const altGRFrench = {
  groupName: "AltCtrl French",
  keys: [
    // Numbers row + AltGr
    {
      code: OFFSET_ALTGR + 53,
      labels: {
        primary: "–",
      },
    },
    {
      code: OFFSET_ALTGR + 30,
      labels: {
        primary: "—",
      },
    },
    {
      code: OFFSET_ALTGR + 31,
      labels: {
        primary: "<",
      },
    },
    {
      code: OFFSET_ALTGR + 32,
      labels: {
        primary: ">",
      },
    },
    {
      code: OFFSET_ALTGR + 33,
      labels: {
        primary: "[",
      },
    },
    {
      code: OFFSET_ALTGR + 34,
      labels: {
        primary: "]",
      },
    },
    {
      code: OFFSET_ALTGR + 35,
      labels: {
        primary: "^",
      },
    },
    {
      code: OFFSET_ALTGR + 36,
      labels: {
        primary: "±",
      },
    },
    {
      code: OFFSET_ALTGR + 37,
      labels: {
        primary: "−",
      },
    },
    {
      code: OFFSET_ALTGR + 38,
      labels: {
        primary: "÷",
      },
    },
    {
      code: OFFSET_ALTGR + 39,
      labels: {
        primary: "×",
      },
    },
    {
      code: OFFSET_ALTGR + 45,
      labels: {
        primary: "≠",
      },
    },
    // First row
    {
      code: OFFSET_ALTGR + 20,
      labels: {
        primary: "|",
      },
    },
    {
      code: OFFSET_ALTGR + 26,
      labels: {
        primary: "´",
      },
    },
    {
      code: OFFSET_ALTGR + 8,
      labels: {
        primary: "&",
      },
    },
    {
      code: OFFSET_ALTGR + 21,
      labels: {
        primary: "œ",
      },
    },
    {
      code: OFFSET_ALTGR + 23,
      labels: {
        primary: "`",
      },
    },
    {
      code: OFFSET_ALTGR + 28,
      labels: {
        primary: "¡",
      },
    },
    {
      code: OFFSET_ALTGR + 24,
      labels: {
        primary: "ˇ",
      },
    },
    {
      code: OFFSET_ALTGR + 12,
      labels: {
        primary: "∞",
      },
    },
    {
      code: OFFSET_ALTGR + 18,
      labels: {
        primary: "/",
      },
    },
    {
      code: OFFSET_ALTGR + 47,
      labels: {
        primary: "–",
      },
      newGroupName: "Letters",
    },
    // Second row
    {
      code: OFFSET_ALTGR + 4,
      labels: {
        primary: "æ",
      },
    },
    {
      code: OFFSET_ALTGR + 22,
      labels: {
        primary: "ù",
      },
    },
    {
      code: OFFSET_ALTGR + 7,
      labels: {
        primary: "¨",
      },
    },
    {
      code: OFFSET_ALTGR + 9,
      labels: {
        primary: "€",
      },
    },
    {
      code: OFFSET_ALTGR + 10,
      labels: {
        primary: "'",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 11,
      labels: {
        primary: "¸",
      },
    },
    {
      code: OFFSET_ALTGR + 13,
      labels: {
        primary: "ᵉ",
      },
    },
    {
      code: OFFSET_ALTGR + 14,
      labels: {
        primary: "ß",
      },
    },
    {
      code: OFFSET_ALTGR + 15,
      labels: {
        primary: "˘",
      },
    },
    {
      code: OFFSET_ALTGR + 51,
      labels: {
        primary: "~",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 52,
      labels: {
        primary: "¯",
      },
      newGroupName: "Letters",
    },
    // Third row
    {
      code: OFFSET_ALTGR + 100,
      labels: {
        primary: "/",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 29,
      labels: {
        primary: "\\",
      },
    },
    {
      code: OFFSET_ALTGR + 27,
      labels: {
        primary: "{",
      },
    },
    {
      code: OFFSET_ALTGR + 6,
      labels: {
        primary: "}",
      },
    },
    {
      code: OFFSET_ALTGR + 25,
      labels: {
        primary: "…",
      },
    },
    {
      code: OFFSET_ALTGR + 5,
      labels: {
        primary: "~",
      },
    },
    {
      code: OFFSET_ALTGR + 17,
      labels: {
        primary: "¿",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 16,
      labels: {
        primary: "°",
      },
    },
    {
      code: OFFSET_ALTGR + 54,
      labels: {
        primary: "µ",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 55,
      labels: {
        primary: ".",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 56,
      labels: {
        primary: "˛",
      },
      newGroupName: "Letters",
    },
  ],
};

const shiftedSymbols = {
  groupName: "Shifted French",
  keys: [
    {
      code: 2078,
      labels: {
        primary: "1",
      },
      newGroupName: "Digits",
    },
    {
      code: 2079,
      labels: {
        primary: "2",
      },
      newGroupName: "Digits",
    },
    {
      code: 2080,
      labels: {
        primary: "3",
      },
      newGroupName: "Digits",
    },
    {
      code: 2081,
      labels: {
        primary: "4",
      },
      newGroupName: "Digits",
    },
    {
      code: 2082,
      labels: {
        primary: "5",
      },
      newGroupName: "Digits",
    },
    {
      code: 2083,
      labels: {
        primary: "6",
      },
      newGroupName: "Digits",
    },
    {
      code: 2084,
      labels: {
        primary: "7",
      },
      newGroupName: "Digits",
    },
    {
      code: 2085,
      labels: {
        primary: "8",
      },
      newGroupName: "Digits",
    },
    {
      code: 2086,
      labels: {
        primary: "9",
      },
      newGroupName: "Digits",
    },
    {
      code: 2087,
      labels: {
        primary: "0",
      },
      newGroupName: "Digits",
    },
    {
      code: 2093,
      labels: {
        primary: "°",
      },
    },
    {
      code: 2095,
      labels: {
        primary: "¨",
      },
    },
    {
      code: 2096,
      labels: {
        primary: "£",
      },
    },
    {
      code: 2097,
      labels: {
        primary: "µ",
      },
    },
    {
      code: 2099,
      labels: {
        primary: "M",
      },
    },
    {
      code: 2100,
      labels: {
        primary: "%",
      },
    },
    {
      code: 2064,
      labels: {
        primary: "?",
      },
    },
    {
      code: 2102,
      labels: {
        primary: ".",
      },
    },
    {
      code: 2103,
      labels: {
        primary: "/",
      },
    },
    {
      code: 2104,
      labels: {
        primary: "§",
      },
    },
    {
      code: 2148,
      labels: {
        primary: ">",
      },
    },
  ],
};

const altCtrlFrench = {
  groupName: "AltCtrl French",
  keys: [
    {
      code: OFFSET_CONTROL_ALT + 31,
      labels: {
        primary: "~",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 32,
      labels: {
        primary: "#",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 33,
      labels: {
        primary: "{",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 34,
      labels: {
        primary: "[",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 35,
      labels: {
        primary: "|",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 36,
      labels: {
        primary: "`",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 37,
      labels: {
        primary: "\\",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 38,
      labels: {
        primary: "^",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 39,
      labels: {
        primary: "@",
      },
    },
    {
      code: OFFSET_CONTROL_ALT + 45,
      labels: {
        primary: "]",
      },
    },
    {
      code: 814,
      labels: {
        primary: "}",
      },
    },
    {
      code: 776,
      labels: {
        primary: "€",
      },
    },
    {
      code: 816,
      labels: {
        primary: "¤",
      },
    },
  ],
};

const tableAGrS = {
  groupName: "AltGrShift French",
  keys: [
    {
      code: OFFSET_SHIFT_ALTGR + 53,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 30,
      labels: {
        primary: "„",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 31,
      labels: {
        primary: "“",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 32,
      labels: {
        primary: "”",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 33,
      labels: {
        primary: "⩽",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 34,
      labels: {
        primary: "⩾",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 36,
      labels: {
        primary: "¬",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 37,
      labels: {
        primary: "¼",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 38,
      labels: {
        primary: "½",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 39,
      labels: {
        primary: "¾",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 45,
      labels: {
        primary: "′",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 46,
      labels: {
        primary: "″",
      },
    },
    // First row
    {
      code: OFFSET_SHIFT_ALTGR + 20,
      labels: {
        primary: "_",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 8,
      labels: {
        primary: "§",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 21,
      labels: {
        primary: "Œ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 23,
      labels: {
        primary: "`",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 18,
      labels: {
        primary: "£",
      },
    },
    // Second row
    {
      code: OFFSET_SHIFT_ALTGR + 4,
      labels: {
        primary: "Æ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 22,
      labels: {
        primary: "Ù",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 7,
      labels: {
        primary: "˙",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 9,
      labels: {
        primary: "¤",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 10,
      labels: {
        primary: ",",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 11,
      labels: {
        primary: "©",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 13,
      labels: {
        primary: "™",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 14,
      labels: {
        primary: "ſ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 15,
      labels: {
        primary: "",
      },
    },
    // Third row
    {
      code: OFFSET_SHIFT_ALTGR + 29,
      labels: {
        primary: "‚",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 27,
      labels: {
        primary: "‘",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 6,
      labels: {
        primary: "’",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 25,
      labels: {
        primary: "·",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 5,
      labels: {
        primary: "‑",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 17,
      labels: {
        primary: "̉",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 16,
      labels: {
        primary: "̛",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 54,
      labels: {
        primary: "†",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 55,
      labels: {
        primary: "‡",
      },
      newGroupName: "Letters",
    },
  ],
};

const frFRbepo = frFRbepoLetters.concat(symbols);

const table = { keys: frFRbepo };
const tableWithoutModifier = { keys: frFRbepoLetters };

const frFRbepoCtrlTable = withModifiers(table, "Control +", "C+", OFFSET_CONTROL);
const frFRbepoLAltTable = withModifiers(table, "Alt +", "A+", OFFSET_ALT);
const frFRbepoRAltTable = withModifiers(table, "AltGr +", "AGr+", OFFSET_ALTGR);
const frFRbepoShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", OFFSET_SHIFT);
const frFRbepoGuiTable = withModifiers(table, "Os+", "O+", OFFSET_OS);

// Double
const frFRbepoCATable = withModifiers(table, "Control + Alt +", "C+A+", OFFSET_CONTROL_ALT);
const frFRbepoCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const frFRbepoCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const frFRbepoCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const frFRbepoAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const frFRbepoASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const frFRbepoAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const frFRbepoAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const frFRbepoAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const frFRbepoSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple
const frFRbepoCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const frFRbepoCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const frFRbepoCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const frFRbepoCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const frFRbepoCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const frFRbepoCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const frFRbepoAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const frFRbepoAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const frFRbepoASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const frFRbepoAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad
const frFRbepoCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const frFRbepoCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const frFRbepoCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const frFRbepoAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const frFRbepoAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

const DualUseCtrlTable = withModifiers(table, "Control /", "CTRL/", 49169);
const DualUseShiftTable = withModifiers(table, "Shift /", "SHIFT/", 49425);
const DualUseAltTable = withModifiers(table, "Alt /", "ALT/", 49681);
const DualUseGuiTable = withModifiers(table, "Os /", "OS/", 49937);
const DualUseAltGrTable = withModifiers(table, "AltGr /", "ALTGR/", 50705);
const DualUseLayer1Tables = withModifiers(table, "Layer #1 /", "L#1/", 51218);
const DualUseLayer2Tables = withModifiers(table, "Layer #2 /", "L#2/", 51474);
const DualUseLayer3Tables = withModifiers(table, "Layer #3 /", "L#3/", 51730);
const DualUseLayer4Tables = withModifiers(table, "Layer #4 /", "L#4/", 51986);
const DualUseLayer5Tables = withModifiers(table, "Layer #5 /", "L#5/", 52242);
const DualUseLayer6Tables = withModifiers(table, "Layer #6 /", "L#6/", 52498);
const DualUseLayer7Tables = withModifiers(table, "Layer #7 /", "L#7/", 52754);
const DualUseLayer8Tables = withModifiers(table, "Layer #8 /", "L#8/", 53010);

const frFRbepoModifiedTables = [
  shiftedSymbols,
  frFRbepoCtrlTable,
  frFRbepoLAltTable,
  frFRbepoRAltTable,
  frFRbepoShiftTable,
  frFRbepoGuiTable,
  frFRbepoCATable,
  altCtrlFrench,
  altGRFrench,
  frFRbepoCAGrTable,
  frFRbepoCSTable,
  frFRbepoCGTable,
  frFRbepoASTable,
  frFRbepoAGTable,
  frFRbepoAAGrTable,
  frFRbepoSGTable,
  frFRbepoAGrSTable,
  frFRbepoAGrGTable,
  frFRbepoCAAGTable,
  frFRbepoCASTable,
  frFRbepoCAGTable,
  frFRbepoCAGSTable,
  frFRbepoCAGGTable,
  frFRbepoCSGTable,
  frFRbepoAAGSTable,
  frFRbepoAAGGTable,
  frFRbepoASGTable,
  frFRbepoAGSGTable,
  frFRbepoCAAGrSTable,
  frFRbepoCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  frFRbepoCAGrSGTable,
  frFRbepoAAGrSGTable,
  frFRbepoAllModTable,
  DualUseCtrlTable,
  DualUseShiftTable,
  DualUseAltTable,
  DualUseGuiTable,
  DualUseAltGrTable,
  DualUseLayer1Tables,
  DualUseLayer2Tables,
  DualUseLayer3Tables,
  DualUseLayer4Tables,
  DualUseLayer5Tables,
  DualUseLayer6Tables,
  DualUseLayer7Tables,
  DualUseLayer8Tables,
];

export { frFRbepo as default, frFRbepoModifiedTables };

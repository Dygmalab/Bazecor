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
      primary: '«',
    },
  },
  {
    code: 31,
    labels: {
      primary: "»",
    },
  },
  {
    code: 32,
    labels: {
      primary: "\"",
    },
  },
  {
    code: 33,
    labels: {
      primary: "-",
    },
  },
  {
    code: 34,
    labels: {
      primary: "+",
    },
  },
  {
    code: 35,
    labels: {
      primary: "*",
    },
  },
  {
    code: 36,
    labels: {
      primary: "/",
    },
  },
  {
    code: 37,
    labels: {
      primary: "=",
    },
  },
  {
    code: 38,
    labels: {
      primary: "(",
    },
  },
  {
    code: 39,
    labels: {
      primary: ")",
    },
  },
  {
    code: 45,
    labels: {
      primary: "@",
    },
  },
  {
    code: 46,
    labels: {
      primary: "#",
    },
  },
];

const frenchLetters = [
  // First row
  {
    code: 20,
    labels: {
      primary: "à",
    },
  },
  {
    code: 26,
    labels: {
      primary: "j",
    },
  },
  {
    code: 8,
    labels: {
      primary: "o",
    },
  },
  {
    code: 21,
    labels: {
      primary: "é",
    },
  },
  {
    code: 23,
    labels: {
      primary: "b",
    },
  },
  {
    code: 28,
    labels: {
      primary: "f",
    },
  },
  {
    code: 24,
    labels: {
      primary: "d",
    },
  },
  {
    code: 12,
    labels: {
      primary: "l",
    },
  },
  {
    code: 18,
    labels: {
      primary: "'",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 19,
    labels: {
      primary: "q",
    },
  },
  {
    code: 47,
    labels: {
      primary: "x",
    },
    newGroupName: "Letters",
  },
  {
    code: 48,
    labels: {
      primary: "z",
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
      primary: "i",
    },
  },
  {
    code: 7,
    labels: {
      primary: "e",
    },
  },
  {
    code: 9,
    labels: {
      primary: "u",
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
      primary: "p",
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
      primary: "^",
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
      primary: "¨",
    },
  },
  {
    code: 29,
    labels: {
      primary: "k",
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
      primary: "è",
    },
    newGroupName: "Letters",
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
      primary: "w",
    },
  },
  {
    code: 17,
    labels: {
      primary: "g",
    },
    newGroupName: "Letters",
  },
  {
    code: 16,
    labels: {
      primary: "c",
    },
  },
  {
    code: 54,
    labels: {
      primary: "m",
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
      primary: "v",
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
        primary: "¤",
      },
    },
    {
      code: OFFSET_ALTGR + 30,
      labels: {
        primary: "“",
      },
    },
    {
      code: OFFSET_ALTGR + 31,
      labels: {
        primary: "”",
      },
    },
    {
      code: OFFSET_ALTGR + 32,
      labels: {
        primary: "„",
      },
    },
    {
      code: OFFSET_ALTGR + 33,
      labels: {
        primary: "‑",
      },
    },
    {
      code: OFFSET_ALTGR + 34,
      labels: {
        primary: "±",
      },
    },
    {
      code: OFFSET_ALTGR + 35,
      labels: {
        primary: "×",
      },
    },
    {
      code: OFFSET_ALTGR + 36,
      labels: {
        primary: "\\",
      },
    },
    {
      code: OFFSET_ALTGR + 37,
      labels: {
        primary: "≠",
      },
    },
    {
      code: OFFSET_ALTGR + 38,
      labels: {
        primary: "[",
      },
    },
    {
      code: OFFSET_ALTGR + 39,
      labels: {
        primary: "]",
      },
    },
    {
      code: OFFSET_ALTGR + 45,
      labels: {
        primary: "−",
      },
    },
    {
      code: OFFSET_ALTGR + 46,
      labels: {
        primary: "°",
      },
    },
    // First row
    {
      code: OFFSET_ALTGR + 20,
      labels: {
        primary: "<",
      },
    },
    {
      code: OFFSET_ALTGR + 26,
      labels: {
        primary: ">",
      },
    },
    {
      code: OFFSET_ALTGR + 8,
      labels: {
        primary: "œ",
      },
    },
    {
      code: OFFSET_ALTGR + 21,
      labels: {
        primary: "″",
      },
    },
    {
      code: OFFSET_ALTGR + 23,
      labels: {
        primary: "—",
      },
    },
    {
      code: OFFSET_ALTGR + 28,
      labels: {
        primary: "‘",
      },
    },
    {
      code: OFFSET_ALTGR + 24,
      labels: {
        primary: "{",
      },
    },
    {
      code: OFFSET_ALTGR + 12,
      labels: {
        primary: "}",
      },
    },
    {
      code: OFFSET_ALTGR + 18,
      labels: {
        primary: "’",
      },
    },
    {
      code: OFFSET_ALTGR + 19,
      labels: {
        primary: "°",
      },
    },
    {
      code: OFFSET_ALTGR + 47,
      labels: {
        primary: "|",
      },
    },
    {
      code: OFFSET_ALTGR + 48,
      labels: {
        primary: "➼",
      },
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
        primary: "₂",
      },
    },
    {
      code: OFFSET_ALTGR + 7,
      labels: {
        primary: "²",
      },
    },
    {
      code: OFFSET_ALTGR + 9,
      labels: {
        primary: "ù",
      },
    },
    {
      code: OFFSET_ALTGR + 10,
      labels: {
        primary: "–",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 11,
      labels: {
        primary: "`",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 13,
      labels: {
        primary: "&",
      },
    },
    {
      code: OFFSET_ALTGR + 14,
      labels: {
        primary: "∞",
      },
    },
    {
      code: OFFSET_ALTGR + 15,
      labels: {
        primary: "ɾ",
      },
    },
    {
      code: OFFSET_ALTGR + 51,
      labels: {
        primary: "∼",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 52,
      labels: {
        primary: "¨",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 49,
      labels: {
        primary: " ̛",
      },
      newGroupName: "Punctuation",
    },
    // Third row
    {
      code: OFFSET_ALTGR + 100,
      labels: {
        primary: "‽",
      },
    },
    {
      code: OFFSET_ALTGR + 27,
      labels: {
        primary: "˙",
      },
    },
    {
      code: OFFSET_ALTGR + 6,
      labels: {
        primary: "`",
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
        primary: "•",
      },
    },
    {
      code: OFFSET_ALTGR + 17,
      labels: {
        primary: "µ",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 16,
      labels: {
        primary: "̦",
      },
    },
    {
      code: OFFSET_ALTGR + 54,
      labels: {
        primary: "¯",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 55,
      labels: {
        primary: "˘̆",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 56,
      labels: {
        primary: "˰",
      },
      newGroupName: "Letters",
    },
  ],
};

const shiftedSymbols = {
  groupName: "Shifted French",
  keys: [
    {
      code: OFFSET_SHIFT + 53,
      labels: {
        primary: "€",
      },
    },
    {
      code: OFFSET_SHIFT + 30,
      labels: {
        primary: '1',
      },
    },
    {
      code: OFFSET_SHIFT + 31,
      labels: {
        primary: "2",
      },
    },
    {
      code: OFFSET_SHIFT + 32,
      labels: {
        primary: "3",
      },
    },
    {
      code: OFFSET_SHIFT + 33,
      labels: {
        primary: "4",
      },
    },
    {
      code: OFFSET_SHIFT + 34,
      labels: {
        primary: "5",
      },
    },
    {
      code: OFFSET_SHIFT + 35,
      labels: {
        primary: "6",
      },
    },
    {
      code: OFFSET_SHIFT + 36,
      labels: {
        primary: "7",
      },
    },
    {
      code: OFFSET_SHIFT + 37,
      labels: {
        primary: "8",
      },
    },
    {
      code: OFFSET_SHIFT + 38,
      labels: {
        primary: "9",
      },
    },
    {
      code: OFFSET_SHIFT + 39,
      labels: {
        primary: "0",
      },
    },
    {
      code: OFFSET_SHIFT + 45,
      labels: {
        primary: "_",
      },
    },
    {
      code: OFFSET_SHIFT + 46,
      labels: {
        primary: "%",
      },
    },
    // First row
    {
      code: OFFSET_SHIFT + 20,
      labels: {
        primary: "À",
      },
    },
    {
      code: OFFSET_SHIFT + 26,
      labels: {
        primary: "J",
      },
    },
    {
      code: OFFSET_SHIFT + 8,
      labels: {
        primary: "O",
      },
    },
    {
      code: OFFSET_SHIFT + 21,
      labels: {
        primary: "É",
      },
    },
    {
      code: OFFSET_SHIFT + 23,
      labels: {
        primary: "B",
      },
    },
    {
      code: OFFSET_SHIFT + 28,
      labels: {
        primary: "F",
      },
    },
    {
      code: OFFSET_SHIFT + 24,
      labels: {
        primary: "D",
      },
    },
    {
      code: OFFSET_SHIFT + 12,
      labels: {
        primary: "L",
      },
    },
    {
      code: OFFSET_SHIFT + 18,
      labels: {
        primary: "?",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT + 19,
      labels: {
        primary: "Q",
      },
    },
    {
      code: OFFSET_SHIFT + 47,
      labels: {
        primary: "X",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 48,
      labels: {
        primary: "Z",
      },
      newGroupName: "Letters",
    },
    // Second row
    {
      code: OFFSET_SHIFT + 4,
      labels: {
        primary: "A",
      },
    },
    {
      code: OFFSET_SHIFT + 22,
      labels: {
        primary: "I",
      },
    },
    {
      code: OFFSET_SHIFT + 7,
      labels: {
        primary: "E",
      },
    },
    {
      code: OFFSET_SHIFT + 9,
      labels: {
        primary: "U",
      },
    },
    {
      code: OFFSET_SHIFT + 10,
      labels: {
        primary: ";",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT + 11,
      labels: {
        primary: "P",
      },
    },
    {
      code: OFFSET_SHIFT + 13,
      labels: {
        primary: "T",
      },
    },
    {
      code: OFFSET_SHIFT + 14,
      labels: {
        primary: "S",
      },
    },
    {
      code: OFFSET_SHIFT + 15,
      labels: {
        primary: "R",
      },
    },
    {
      code: OFFSET_SHIFT + 51,
      labels: {
        primary: "N",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 52,
      labels: {
        primary: "!",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 49,
      labels: {
        primary: "Ç",
      },
      newGroupName: "Letters",
    },
    // Third row
    {
      code: OFFSET_SHIFT + 100,
      labels: {
        primary: "ø",
      },
    },
    {
      code: OFFSET_SHIFT + 29,
      labels: {
        primary: "K",
      },
    },
    {
      code: OFFSET_SHIFT + 27,
      labels: {
        primary: "Y",
      },
    },
    {
      code: OFFSET_SHIFT + 6,
      labels: {
        primary: "È",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 25,
      labels: {
        primary: ":",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT + 5,
      labels: {
        primary: "W",
      },
    },
    {
      code: OFFSET_SHIFT + 17,
      labels: {
        primary: "G",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 16,
      labels: {
        primary: "C",
      },
    },
    {
      code: OFFSET_SHIFT + 54,
      labels: {
        primary: "M",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 55,
      labels: {
        primary: "H",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 56,
      labels: {
        primary: "V",
      },
      newGroupName: "Letters",
    },
  ],
};

const tableAGrS = {
  groupName: "AltGrShift French",
  keys: [
    {
      code: OFFSET_SHIFT_ALTGR + 53,
      labels: {
        primary: "©",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 30,
      labels: {
        primary: '¼',
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 31,
      labels: {
        primary: "½",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 32,
      labels: {
        primary: "¾",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 33,
      labels: {
        primary: "⅓",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 34,
      labels: {
        primary: "⅔",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 35,
      labels: {
        primary: "✻",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 36,
      labels: {
        primary: "÷",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 37,
      labels: {
        primary: "≈",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 38,
      labels: {
        primary: "′",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 39,
      labels: {
        primary: "″",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 45,
      labels: {
        primary: "_",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 46,
      labels: {
        primary: "º",
      },
    },
    // First row
    {
      code: OFFSET_SHIFT_ALTGR + 20,
      labels: {
        primary: "⩽",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 26,
      labels: {
        primary: "⩾",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 8,
      labels: {
        primary: "Œ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 21,
      labels: {
        primary: "ж",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 23,
      labels: {
        primary: "❏",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 28,
      labels: {
        primary: "✦",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 24,
      labels: {
        primary: "†",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 12,
      labels: {
        primary: "‡",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 18,
      labels: {
        primary: "¿",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 19,
      labels: {
        primary: "⸮",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 47,
      labels: {
        primary: "®",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 48,
      labels: {
        primary: "™",
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
        primary: "§",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 7,
      labels: {
        primary: "¶",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 9,
      labels: {
        primary: "Ù",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 10,
      labels: {
        primary: "✓",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 11,
      labels: {
        primary: "★",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 13,
      labels: {
        primary: "⬅",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 14,
      labels: {
        primary: "⬇",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 15,
      labels: {
        primary: "⬆",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 51,
      labels: {
        primary: "⮕",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 52,
      labels: {
        primary: "¡",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 49,
      labels: {
        primary: "🄯",
      },
    },
    // Third row
    {
      code: OFFSET_SHIFT_ALTGR + 100,
      labels: {
        primary: "Ø",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 29,
      labels: {
        primary: "⎈",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 27,
      labels: {
        primary: "⌥",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 6,
      labels: {
        primary: "⌘",
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
        primary: "✗",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 17,
      labels: {
        primary: "✣",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 16,
      labels: {
        primary: "♠",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 54,
      labels: {
        primary: "♥",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 55,
      labels: {
        primary: "♦",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 56,
      labels: {
        primary: "♣",
      },
    },
  ],
};

const frenchOptimot = frenchLetters.concat(symbols);

const table = { keys: frenchOptimot };
const tableWithoutModifier = { keys: frenchLetters };

const frenchCtrlTable = withModifiers(table, "Control +", "C+", OFFSET_CONTROL);
const frenchLAltTable = withModifiers(table, "Alt +", "A+", OFFSET_ALT);
const frenchRAltTable = withModifiers(table, "AltGr +", "AGr+", OFFSET_ALTGR);
const frenchShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", OFFSET_SHIFT);
const frenchGuiTable = withModifiers(table, "Os+", "O+", OFFSET_OS);

// Double
const frenchCATable = withModifiers(table, "Control + Alt +", "C+A+", OFFSET_CONTROL_ALT);
const frenchCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const frenchCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const frenchCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const frenchAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const frenchASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const frenchAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const frenchAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const frenchAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const frenchSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple
const frenchCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const frenchCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const frenchCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const frenchCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const frenchCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const frenchCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const frenchAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const frenchAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const frenchASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const frenchAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad
const frenchCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const frenchCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const frenchCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const frenchAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const frenchAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

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

const frenchOptimotModifiedTables = [
  shiftedSymbols,
  frenchCtrlTable,
  frenchLAltTable,
  frenchRAltTable,
  frenchShiftTable,
  frenchGuiTable,
  frenchCATable,
  altGRFrench,
  frenchCAGrTable,
  frenchCSTable,
  frenchCGTable,
  frenchASTable,
  frenchAGTable,
  frenchAAGrTable,
  frenchSGTable,
  frenchAGrSTable,
  frenchAGrGTable,
  frenchCAAGTable,
  frenchCASTable,
  frenchCAGTable,
  frenchCAGSTable,
  frenchCAGGTable,
  frenchCSGTable,
  frenchAAGSTable,
  frenchAAGGTable,
  frenchASGTable,
  frenchAGSGTable,
  frenchCAAGrSTable,
  frenchCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  frenchCAGrSGTable,
  frenchAAGrSGTable,
  frenchAllModTable,
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

export { frenchOptimot as default, frenchOptimotModifiedTables };

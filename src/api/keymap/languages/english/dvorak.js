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
      primary: "`",
    },
  },
  {
    code: 30,
    labels: {
      primary: '1',
    },
  },
  {
    code: 31,
    labels: {
      primary: "2",
    },
  },
  {
    code: 32,
    labels: {
      primary: "3",
    },
  },
  {
    code: 33,
    labels: {
      primary: "4",
    },
  },
  {
    code: 34,
    labels: {
      primary: "5",
    },
  },
  {
    code: 35,
    labels: {
      primary: "6",
    },
  },
  {
    code: 36,
    labels: {
      primary: "7",
    },
  },
  {
    code: 37,
    labels: {
      primary: "8",
    },
  },
  {
    code: 38,
    labels: {
      primary: "9",
    },
  },
  {
    code: 39,
    labels: {
      primary: "0",
    },
  },
  {
    code: 45,
    labels: {
      primary: "[",
    },
  },
  {
    code: 46,
    labels: {
      primary: "]",
    },
  },
];

const dvorakLetters = [
  // First row
  {
    code: 20,
    labels: {
      primary: "′",
    },
  },
  {
    code: 26,
    labels: {
      primary: ",",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 8,
    labels: {
      primary: ".",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 21,
    labels: {
      primary: "p",
    },
  },
  {
    code: 23,
    labels: {
      primary: "y",
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
      primary: "g",
    },
  },
  {
    code: 12,
    labels: {
      primary: "c",
    },
  },
  {
    code: 18,
    labels: {
      primary: "r",
    },
  },
  {
    code: 19,
    labels: {
      primary: "l",
    },
  },
  {
    code: 47,
    labels: {
      primary: "/",
    },
  },
  {
    code: 48,
    labels: {
      primary: "=",
    },
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
      primary: "o",
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
      primary: "i",
    },
  },
  {
    code: 11,
    labels: {
      primary: "d",
    },
  },
  {
    code: 13,
    labels: {
      primary: "h",
    },
  },
  {
    code: 14,
    labels: {
      primary: "t",
    },
  },
  {
    code: 15,
    labels: {
      primary: "n",
    },
  },
  {
    code: 51,
    labels: {
      primary: "s",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "-",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 49,
    labels: {
      primary: "\\",
    },
  },
  // Third row
  {
    code: 100,
    labels: {
      primary: "",
    },
  },
  {
    code: 29,
    labels: {
      primary: ";",
    },
  },
  {
    code: 27,
    labels: {
      primary: "q",
    },
  },
  {
    code: 6,
    labels: {
      primary: "j",
    },
    newGroupName: "Letters",
  },
  {
    code: 25,
    labels: {
      primary: "k",
    },
  },
  {
    code: 5,
    labels: {
      primary: "x",
    },
  },
  {
    code: 17,
    labels: {
      primary: "b",
    },
    newGroupName: "Letters",
  },
  {
    code: 16,
    labels: {
      primary: "m",
    },
  },
  {
    code: 54,
    labels: {
      primary: "w",
    },
    newGroupName: "Letters",
  },
  {
    code: 55,
    labels: {
      primary: "v",
    },
    newGroupName: "Letters",
  },
  {
    code: 56,
    labels: {
      primary: "z",
    },
    newGroupName: "Letters",
  },
];

const altGRDvorak = {
  groupName: "AltCtrl Dvorak",
  keys: [
    // Numbers row + AltGr
    {
      code: OFFSET_ALTGR + 53,
      labels: {
        primary: "`",
      },
    },
    {
      code: OFFSET_ALTGR + 30,
      labels: {
        primary: "¡",
      },
    },
    {
      code: OFFSET_ALTGR + 31,
      labels: {
        primary: "²",
      },
    },
    {
      code: OFFSET_ALTGR + 32,
      labels: {
        primary: "³",
      },
    },
    {
      code: OFFSET_ALTGR + 33,
      labels: {
        primary: "¤",
      },
    },
    {
      code: OFFSET_ALTGR + 34,
      labels: {
        primary: "€",
      },
    },
    {
      code: OFFSET_ALTGR + 35,
      labels: {
        primary: "¼",
      },
    },
    {
      code: OFFSET_ALTGR + 36,
      labels: {
        primary: "½",
      },
    },
    {
      code: OFFSET_ALTGR + 37,
      labels: {
        primary: "¾",
      },
    },
    {
      code: OFFSET_ALTGR + 38,
      labels: {
        primary: "‘",
      },
    },
    {
      code: OFFSET_ALTGR + 39,
      labels: {
        primary: "’",
      },
    },
    {
      code: OFFSET_ALTGR + 45,
      labels: {
        primary: "«",
      },
    },
    {
      code: OFFSET_ALTGR + 46,
      labels: {
        primary: "»",
      },
    },
    // First row
    {
      code: OFFSET_ALTGR + 20,
      labels: {
        primary: "'",
      },
    },
    {
      code: OFFSET_ALTGR + 26,
      labels: {
        primary: "ç",
      },
    },
    {
      code: OFFSET_ALTGR + 8,
      labels: {
        primary: " ̇",
      },
    },
    {
      code: OFFSET_ALTGR + 21,
      labels: {
        primary: "ö",
      },
    },
    {
      code: OFFSET_ALTGR + 23,
      labels: {
        primary: "ü",
      },
    },
    {
      code: OFFSET_ALTGR + 28,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 24,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 12,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 18,
      labels: {
        primary: "©",
      },
    },
    {
      code: OFFSET_ALTGR + 19,
      labels: {
        primary: "®",
      },
    },
    {
      code: OFFSET_ALTGR + 47,
      labels: {
        primary: "¿",
      },
    },
    {
      code: OFFSET_ALTGR + 48,
      labels: {
        primary: "",
      },
    },
    // Second row
    {
      code: OFFSET_ALTGR + 4,
      labels: {
        primary: "á",
      },
    },
    {
      code: OFFSET_ALTGR + 22,
      labels: {
        primary: "ó",
      },
    },
    {
      code: OFFSET_ALTGR + 7,
      labels: {
        primary: "é",
      },
    },
    {
      code: OFFSET_ALTGR + 9,
      labels: {
        primary: "ú",
      },
    },
    {
      code: OFFSET_ALTGR + 10,
      labels: {
        primary: "í",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 11,
      labels: {
        primary: "ð",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_ALTGR + 13,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 14,
      labels: {
        primary: "þ",
      },
    },
    {
      code: OFFSET_ALTGR + 15,
      labels: {
        primary: "ñ",
      },
    },
    {
      code: OFFSET_ALTGR + 51,
      labels: {
        primary: "ß",
      },
    },
    {
      code: OFFSET_ALTGR + 52,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 49,
      labels: {
        primary: "",
      },
      newGroupName: "Punctuation",
    },
    // Third row
    {
      code: OFFSET_ALTGR + 100,
      labels: {
        primary: "¶",
      },
    },
    {
      code: OFFSET_ALTGR + 27,
      labels: {
        primary: "ä",
      },
    },
    {
      code: OFFSET_ALTGR + 6,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 25,
      labels: {
        primary: "œ",
      },
    },
    {
      code: OFFSET_ALTGR + 5,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 17,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_ALTGR + 16,
      labels: {
        primary: "µ",
      },
    },
    {
      code: OFFSET_ALTGR + 54,
      labels: {
        primary: "å",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 55,
      labels: {
        primary: "",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_ALTGR + 56,
      labels: {
        primary: "æ",
      },
      newGroupName: "Letters",
    },
  ],
};

const shiftedSymbols = {
  groupName: "Shifted Dvorak",
  keys: [
    {
      code: OFFSET_SHIFT + 53,
      labels: {
        primary: "~",
      },
    },
    {
      code: OFFSET_SHIFT + 30,
      labels: {
        primary: '!',
      },
    },
    {
      code: OFFSET_SHIFT + 31,
      labels: {
        primary: "@",
      },
    },
    {
      code: OFFSET_SHIFT + 32,
      labels: {
        primary: "#",
      },
    },
    {
      code: OFFSET_SHIFT + 33,
      labels: {
        primary: "$",
      },
    },
    {
      code: OFFSET_SHIFT + 34,
      labels: {
        primary: "%",
      },
    },
    {
      code: OFFSET_SHIFT + 35,
      labels: {
        primary: "^",
      },
    },
    {
      code: OFFSET_SHIFT + 36,
      labels: {
        primary: "&",
      },
    },
    {
      code: OFFSET_SHIFT + 37,
      labels: {
        primary: "*",
      },
    },
    {
      code: OFFSET_SHIFT + 38,
      labels: {
        primary: "(",
      },
    },
    {
      code: OFFSET_SHIFT + 39,
      labels: {
        primary: ")",
      },
    },
    {
      code: OFFSET_SHIFT + 45,
      labels: {
        primary: "{",
      },
    },
    {
      code: OFFSET_SHIFT + 46,
      labels: {
        primary: "}",
      },
    },
    // First row
    {
      code: OFFSET_SHIFT + 20,
      labels: {
        primary: " ̈",
      },
    },
    {
      code: OFFSET_SHIFT + 26,
      labels: {
        primary: "<",
      },
    },
    {
      code: OFFSET_SHIFT + 8,
      labels: {
        primary: ">",
      },
    },
    {
      code: OFFSET_SHIFT + 21,
      labels: {
        primary: "P",
      },
    },
    {
      code: OFFSET_SHIFT + 23,
      labels: {
        primary: "Y",
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
        primary: "G",
      },
    },
    {
      code: OFFSET_SHIFT + 12,
      labels: {
        primary: "C",
      },
    },
    {
      code: OFFSET_SHIFT + 18,
      labels: {
        primary: "R",
      },
    },
    {
      code: OFFSET_SHIFT + 19,
      labels: {
        primary: "L",
      },
    },
    {
      code: OFFSET_SHIFT + 47,
      labels: {
        primary: "?",
      },
    },
    {
      code: OFFSET_SHIFT + 48,
      labels: {
        primary: "+",
      },
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
        primary: "O",
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
        primary: "I",
      },
    },
    {
      code: OFFSET_SHIFT + 11,
      labels: {
        primary: "D",
      },
    },
    {
      code: OFFSET_SHIFT + 13,
      labels: {
        primary: "H",
      },
    },
    {
      code: OFFSET_SHIFT + 14,
      labels: {
        primary: "T",
      },
    },
    {
      code: OFFSET_SHIFT + 15,
      labels: {
        primary: "N",
      },
    },
    {
      code: OFFSET_SHIFT + 51,
      labels: {
        primary: "S",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 52,
      labels: {
        primary: "_",
      },
    },
    {
      code: OFFSET_SHIFT + 49,
      labels: {
        primary: "|",
      },
    },
    // Third row
    {
      code: OFFSET_SHIFT + 100,
      labels: {
	primary: "",
      },
    },
    {
      code: OFFSET_SHIFT + 29,
      labels: {
	primary: ":",
      },
    },
    {
      code: OFFSET_SHIFT + 27,
      labels: {
        primary: "Q",
      },
    },
    {
      code: OFFSET_SHIFT + 6,
      labels: {
        primary: "J",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 25,
      labels: {
        primary: "K",
      },
    },
    {
      code: OFFSET_SHIFT + 5,
      labels: {
        primary: "X",
      },
    },
    {
      code: OFFSET_SHIFT + 17,
      labels: {
        primary: "B",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 16,
      labels: {
        primary: "M",
      },
    },
    {
      code: OFFSET_SHIFT + 54,
      labels: {
        primary: "W",
      },
      newGroupName: "Letters",
    },
    {
      code: OFFSET_SHIFT + 55,
      labels: {
        primary: "V",
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
  groupName: "AltGrShift Dvorak",
  keys: [
    {
      code: OFFSET_SHIFT_ALTGR + 53,
      labels: {
        primary: "~",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 30,
      labels: {
        primary: '¹',
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 31,
      labels: {
        primary: "˝",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 32,
      labels: {
        primary: " ̄",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 33,
      labels: {
        primary: "£",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 34,
      labels: {
        primary: " ̦",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 35,
      labels: {
        primary: "^",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 36,
      labels: {
        primary: " ̛",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 37,
      labels: {
        primary: "˛",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 38,
      labels: {
        primary: " ̆",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 39,
      labels: {
        primary: "°",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 45,
      labels: {
        primary: "“",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 46,
      labels: {
        primary: "”",
      },
    },
    // First row
    {
      code: OFFSET_SHIFT_ALTGR + 20,
      labels: {
        primary: "\"",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 26,
      labels: {
        primary: "Ç",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 8,
      labels: {
        primary: " ̌",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 21,
      labels: {
        primary: "Ö",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 23,
      labels: {
        primary: "Ü",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 28,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 24,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 12,
      labels: {
        primary: "¢",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 18,
      labels: {
        primary: "®",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 19,
      labels: {
        primary: "Ø",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 47,
      labels: {
        primary: " ̉",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 48,
      labels: {
        primary: "",
      },
    },
    // Second row
    {
      code: OFFSET_SHIFT_ALTGR + 4,
      labels: {
        primary: "Á",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 22,
      labels: {
        primary: "Ó",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 7,
      labels: {
        primary: "É",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 9,
      labels: {
        primary: "Ú",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 10,
      labels: {
        primary: "Í",
      },
      newGroupName: "Punctuation",
    },
    {
      code: OFFSET_SHIFT_ALTGR + 11,
      labels: {
        primary: "Ð",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 13,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 14,
      labels: {
        primary: "Þ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 15,
      labels: {
        primary: "Ñ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 51,
      labels: {
        primary: "§",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 52,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 49,
      labels: {
        primary: "¦",
      },
    },
    // Third row
    {
      code: OFFSET_SHIFT_ALTGR + 100,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 29,
      labels: {
        primary: "°",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 27,
      labels: {
        primary: "Ä",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 6,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 25,
      labels: {
        primary: "Œ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 5,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 17,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 16,
      labels: {
        primary: "µ",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 54,
      labels: {
        primary: "Å",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 55,
      labels: {
        primary: "",
      },
    },
    {
      code: OFFSET_SHIFT_ALTGR + 56,
      labels: {
        primary: "Æ",
      },
    },
  ],
};

const dvorak = dvorakLetters.concat(symbols);

const table = { keys: dvorak };
const tableWithoutModifier = { keys: dvorakLetters };

const dvorakCtrlTable = withModifiers(table, "Control +", "C+", OFFSET_CONTROL);
const dvorakLAltTable = withModifiers(table, "Alt +", "A+", OFFSET_ALT);
const dvorakRAltTable = withModifiers(table, "AltGr +", "AGr+", OFFSET_ALTGR);
const dvorakShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", OFFSET_SHIFT);
const dvorakGuiTable = withModifiers(table, "Os+", "O+", OFFSET_OS);

// Double
const dvorakCATable = withModifiers(table, "Control + Alt +", "C+A+", OFFSET_CONTROL_ALT);
const dvorakCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const dvorakCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const dvorakCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const dvorakAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const dvorakASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const dvorakAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const dvorakAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const dvorakAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const dvorakSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple
const dvorakCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const dvorakCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const dvorakCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const dvorakCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const dvorakCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const dvorakCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const dvorakAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const dvorakAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const dvorakASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const dvorakAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad
const dvorakCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const dvorakCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const dvorakCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const dvorakAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const dvorakAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

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

const dvorakModifiedTables = [
  shiftedSymbols,
  dvorakCtrlTable,
  dvorakLAltTable,
  dvorakRAltTable,
  dvorakShiftTable,
  dvorakGuiTable,
  dvorakCATable,
  altGRDvorak,
  dvorakCAGrTable,
  dvorakCSTable,
  dvorakCGTable,
  dvorakASTable,
  dvorakAGTable,
  dvorakAAGrTable,
  dvorakSGTable,
  dvorakAGrSTable,
  dvorakAGrGTable,
  dvorakCAAGTable,
  dvorakCASTable,
  dvorakCAGTable,
  dvorakCAGSTable,
  dvorakCAGGTable,
  dvorakCSGTable,
  dvorakAAGSTable,
  dvorakAAGGTable,
  dvorakASGTable,
  dvorakAGSGTable,
  dvorakCAAGrSTable,
  dvorakCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  dvorakCAGrSGTable,
  dvorakAAGrSGTable,
  dvorakAllModTable,
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

export { dvorak as default, dvorakModifiedTables };

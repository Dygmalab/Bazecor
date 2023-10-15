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

const symbolsS = [
  {
    code: 53,
    labels: {
      primary: "#",
    },
  },
  {
    code: 30,
    labels: {
      primary: "1",
    },
    newGroupName: "Digits",
  },
  {
    code: 31,
    labels: {
      primary: "2",
    },
    newGroupName: "Digits",
  },
  {
    code: 32,
    labels: {
      primary: "3",
    },
    newGroupName: "Digits",
  },
  {
    code: 33,
    labels: {
      primary: "4",
    },
    newGroupName: "Digits",
  },
  {
    code: 34,
    labels: {
      primary: "5",
    },
    newGroupName: "Digits",
  },
  {
    code: 35,
    labels: {
      primary: "6",
    },
    newGroupName: "Digits",
  },
  {
    code: 36,
    labels: {
      primary: "7",
    },
    newGroupName: "Digits",
  },
  {
    code: 37,
    labels: {
      primary: "8",
    },
    newGroupName: "Digits",
  },
  {
    code: 38,
    labels: {
      primary: "9",
    },
    newGroupName: "Digits",
  },
  {
    code: 39,
    labels: {
      primary: "0",
    },
    newGroupName: "Digits",
  },
  {
    code: 45,
    labels: {
      primary: "°",
    },
  },
  {
    code: 46,
    labels: {
      primary: "`",
    },
  },
];

const letters = [
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

const lettersS = [
  // First row
  {
    code: 20,
    labels: {
      primary: "B",
    },
  },
  {
    code: 26,
    labels: {
      primary: "É",
    },
  },
  {
    code: 8,
    labels: {
      primary: "P",
    },
  },
  {
    code: 21,
    labels: {
      primary: "O",
    },
  },
  {
    code: 23,
    labels: {
      primary: "È",
    },
  },
  {
    code: 28,
    labels: {
      primary: "!",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 24,
    labels: {
      primary: "V",
    },
  },
  {
    code: 12,
    labels: {
      primary: "D",
    },
  },
  {
    code: 18,
    labels: {
      primary: "L",
    },
  },
  {
    code: 19,
    labels: {
      primary: "J",
    },
  },
  {
    code: 47,
    labels: {
      primary: "Z",
    },
    newGroupName: "Letters",
  },
  {
    code: 48,
    labels: {
      primary: "W",
    },
    newGroupName: "Letters",
  },
  // Second row
  {
    code: 4,
    labels: {
      primary: "A",
    },
  },
  {
    code: 22,
    labels: {
      primary: "U",
    },
  },
  {
    code: 7,
    labels: {
      primary: "I",
    },
  },
  {
    code: 9,
    labels: {
      primary: "E",
    },
  },
  {
    code: 10,
    labels: {
      primary: ";",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 11,
    labels: {
      primary: "C",
    },
  },
  {
    code: 13,
    labels: {
      primary: "T",
    },
  },
  {
    code: 14,
    labels: {
      primary: "S",
    },
  },
  {
    code: 15,
    labels: {
      primary: "R",
    },
  },
  {
    code: 51,
    labels: {
      primary: "N",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "M",
    },
    newGroupName: "Letters",
  },
  {
    code: 49,
    labels: {
      primary: "Ç",
    },
    newGroupName: "Letters",
  },
  // Third row
  {
    code: 100,
    labels: {
      primary: "Ê",
    },
    newGroupName: "Letters",
  },
  {
    code: 29,
    labels: {
      primary: "À",
    },
  },
  {
    code: 27,
    labels: {
      primary: "Y",
    },
  },
  {
    code: 6,
    labels: {
      primary: "X",
    },
  },
  {
    code: 25,
    labels: {
      primary: ":",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 5,
    labels: {
      primary: "K",
    },
  },
  {
    code: 17,
    labels: {
      primary: "?",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 16,
    labels: {
      primary: "Q",
    },
  },
  {
    code: 54,
    labels: {
      primary: "G",
    },
    newGroupName: "Letters",
  },
  {
    code: 55,
    labels: {
      primary: "H",
    },
    newGroupName: "Letters",
  },
  {
    code: 56,
    labels: {
      primary: "F",
    },
    newGroupName: "Letters",
  },
];

const tableAGr = {
  groupName: "AltGr French",
  keys: [
    // Numbers row + AltGr
    {
      code: 53,
      labels: {
        primary: "–",
      },
    },
    {
      code: 30,
      labels: {
        primary: "—",
      },
    },
    {
      code: 31,
      labels: {
        primary: "<",
      },
    },
    {
      code: 32,
      labels: {
        primary: ">",
      },
    },
    {
      code: 33,
      labels: {
        primary: "[",
      },
    },
    {
      code: 34,
      labels: {
        primary: "]",
      },
    },
    {
      code: 35,
      labels: {
        primary: "^",
      },
    },
    {
      code: 36,
      labels: {
        primary: "±",
      },
    },
    {
      code: 37,
      labels: {
        primary: "−",
      },
    },
    {
      code: 38,
      labels: {
        primary: "÷",
      },
    },
    {
      code: 39,
      labels: {
        primary: "×",
      },
    },
    {
      code: 45,
      labels: {
        primary: "≠",
      },
    },
    {
      code: 46,
      labels: {
        primary: "‰",
      },
    },
    // First row
    {
      code: 20,
      labels: {
        primary: "|",
      },
    },
    {
      code: 26,
      labels: {
        primary: "´",
      },
    },
    {
      code: 8,
      labels: {
        primary: "&",
      },
    },
    {
      code: 21,
      labels: {
        primary: "œ",
      },
    },
    {
      code: 23,
      labels: {
        primary: "`",
      },
    },
    {
      code: 28,
      labels: {
        primary: "¡",
      },
    },
    {
      code: 24,
      labels: {
        primary: "ˇ",
      },
    },
    {
      code: 12,
      labels: {
        primary: "∞",
      },
    },
    {
      code: 18,
      labels: {
        primary: "/",
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
        primary: "–",
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
        primary: "æ",
      },
    },
    {
      code: 22,
      labels: {
        primary: "ù",
      },
    },
    {
      code: 7,
      labels: {
        primary: "¨",
      },
    },
    {
      code: 9,
      labels: {
        primary: "€",
      },
    },
    {
      code: 10,
      labels: {
        primary: "'",
      },
      newGroupName: "Punctuation",
    },
    {
      code: 11,
      labels: {
        primary: "¸",
      },
    },
    {
      code: 13,
      labels: {
        primary: "ᵉ",
      },
    },
    {
      code: 14,
      labels: {
        primary: "ß",
      },
    },
    {
      code: 15,
      labels: {
        primary: "˘",
      },
    },
    {
      code: 51,
      labels: {
        primary: "~",
      },
      newGroupName: "Letters",
    },
    {
      code: 52,
      labels: {
        primary: "¯",
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
        primary: "/",
      },
      newGroupName: "Letters",
    },
    {
      code: 29,
      labels: {
        primary: "\\",
      },
    },
    {
      code: 27,
      labels: {
        primary: "{",
      },
    },
    {
      code: 6,
      labels: {
        primary: "}",
      },
    },
    {
      code: 25,
      labels: {
        primary: "…",
      },
    },
    {
      code: 5,
      labels: {
        primary: "~",
      },
    },
    {
      code: 17,
      labels: {
        primary: "¿",
      },
      newGroupName: "Punctuation",
    },
    {
      code: 16,
      labels: {
        primary: "°",
      },
    },
    {
      code: 54,
      labels: {
        primary: "µ",
      },
      newGroupName: "Letters",
    },
    {
      code: 55,
      labels: {
        primary: ".",
      },
      newGroupName: "Letters",
    },
    {
      code: 56,
      labels: {
        primary: "˛",
      },
      newGroupName: "Letters",
    },
  ],
};

const tableAGrS = {
  groupName: "AltGrShift French",
  keys: [
    {
      code: 53,
      labels: {
        primary: "¶",
      },
    },
    {
      code: 30,
      labels: {
        primary: "„",
      },
    },
    {
      code: 31,
      labels: {
        primary: "“",
      },
    },
    {
      code: 32,
      labels: {
        primary: "”",
      },
    },
    {
      code: 33,
      labels: {
        primary: "⩽",
      },
    },
    {
      code: 34,
      labels: {
        primary: "⩾",
      },
    },
    {
      code: 35,
      labels: {
        primary: "^",
      },
    },
    {
      code: 36,
      labels: {
        primary: "¬",
      },
    },
    {
      code: 37,
      labels: {
        primary: "¼",
      },
    },
    {
      code: 38,
      labels: {
        primary: "½",
      },
    },
    {
      code: 39,
      labels: {
        primary: "¾",
      },
    },
    {
      code: 45,
      labels: {
        primary: "′",
      },
    },
    {
      code: 46,
      labels: {
        primary: "″",
      },
    },
    // First row
    {
      code: 20,
      labels: {
        primary: "_",
      },
    },
    {
      code: 26,
      labels: {
        primary: "´",
      },
    },
    {
      code: 8,
      labels: {
        primary: "§",
      },
    },
    {
      code: 21,
      labels: {
        primary: "Œ",
      },
    },
    {
      code: 23,
      labels: {
        primary: "`",
      },
    },
    {
      code: 28,
      labels: {
        primary: "¡",
      },
    },
    {
      code: 24,
      labels: {
        primary: "ˇ",
      },
    },
    {
      code: 12,
      labels: {
        primary: "∞",
      },
    },
    {
      code: 18,
      labels: {
        primary: "£",
      },
    },
    {
      code: 19,
      labels: {
        primary: "J",
      },
    },
    {
      code: 47,
      labels: {
        primary: "–",
      },
      newGroupName: "Letters",
    },
    {
      code: 48,
      labels: {
        primary: "W",
      },
      newGroupName: "Letters",
    },
    // Second row
    {
      code: 4,
      labels: {
        primary: "Æ",
      },
    },
    {
      code: 22,
      labels: {
        primary: "Ù",
      },
    },
    {
      code: 7,
      labels: {
        primary: "˙",
      },
    },
    {
      code: 9,
      labels: {
        primary: "¤",
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
        primary: "©",
      },
    },
    {
      code: 13,
      labels: {
        primary: "™",
      },
    },
    {
      code: 14,
      labels: {
        primary: "ſ",
      },
    },
    {
      code: 15,
      labels: {
        primary: "®",
      },
    },
    {
      code: 51,
      labels: {
        primary: "~",
      },
      newGroupName: "Letters",
    },
    {
      code: 52,
      labels: {
        primary: "¯",
      },
      newGroupName: "Letters",
    },
    {
      code: 49,
      labels: {
        primary: "Ç",
      },
      newGroupName: "Letters",
    },
    // Third row
    {
      code: 100,
      labels: {
        primary: "^",
      },
      newGroupName: "Letters",
    },
    {
      code: 29,
      labels: {
        primary: "‚",
      },
    },
    {
      code: 27,
      labels: {
        primary: "‘",
      },
    },
    {
      code: 6,
      labels: {
        primary: "’",
      },
    },
    {
      code: 25,
      labels: {
        primary: "·",
      },
      newGroupName: "Punctuation",
    },
    {
      code: 5,
      labels: {
        primary: "‑",
      },
    },
    {
      code: 17,
      labels: {
        primary: "̉",
      },
      newGroupName: "Punctuation",
    },
    {
      code: 16,
      labels: {
        primary: "̛",
      },
    },
    {
      code: 54,
      labels: {
        primary: "†",
      },
      newGroupName: "Letters",
    },
    {
      code: 55,
      labels: {
        primary: "‡",
      },
      newGroupName: "Letters",
    },
    {
      code: 56,
      labels: {
        primary: "˛",
      },
      newGroupName: "Letters",
    },
  ],
};

const frXXbepo = letters.concat(symbols);
const frXXbepoS = lettersS.concat(symbolsS);

const table = { keys: frXXbepo };
const tableS = { keys: frXXbepoS };

const frXXbepoCtrlTable = withModifiers(table, "Control +", "C+", 256);
const frXXbepoLAltTable = withModifiers(table, "Alt +", "A+", 512);
const frXXbepoRAltTable = withModifiers(tableAGr, "AltGr +", "AGr+", 1024);
const frXXbepoShiftTable = withModifiers(tableS, "Shift +", "S+", 2048);
const frXXbepoGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double
const frXXbepoCATable = withModifiers(tableAGr, "Control + Alt +", "C+A+", 768);
const frXXbepoCAGrTable = withModifiers(tableAGr, "Control + AltGr +", "C+AGr+", 1280);
const frXXbepoCSTable = withModifiers(tableS, "Control + Shift +", "C+S+", 2304);
const frXXbepoCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const frXXbepoAAGrTable = withModifiers(tableAGr, "Alt + AltGr +", "A+AGr+", 1536);
const frXXbepoASTable = withModifiers(tableS, "Alt + Shift +", "A+S+", 2560);
const frXXbepoAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const frXXbepoAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const frXXbepoAGrGTable = withModifiers(tableAGr, "AltGr + Os +", "AGr+O+", 5120);
const frXXbepoSGTable = withModifiers(tableS, "Shift + Os +", "S+O+", 6144);

// Triple
const frXXbepoCAAGTable = withModifiers(tableAGr, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const frXXbepoCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const frXXbepoCAGTable = withModifiers(tableAGr, "Control + Alt + Os +", "C+A+O+", 4864);
const frXXbepoCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const frXXbepoCAGGTable = withModifiers(tableAGr, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const frXXbepoCSGTable = withModifiers(tableS, "Control + Shift + Os +", "C+S+O+", 6400);
const frXXbepoAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const frXXbepoAAGGTable = withModifiers(tableAGr, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const frXXbepoASGTable = withModifiers(tableS, "Alt + Shift + Os +", "A+S+O+", 6656);
const frXXbepoAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad
const frXXbepoCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const frXXbepoCAAGrGTable = withModifiers(tableAGr, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const frXXbepoCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const frXXbepoAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const frXXbepoAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

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

const frXXbepoModifiedTables = [
  frXXbepoCtrlTable,
  frXXbepoLAltTable,
  frXXbepoRAltTable,
  frXXbepoShiftTable,
  frXXbepoGuiTable,
  frXXbepoCATable,
  frXXbepoCAGrTable,
  frXXbepoCSTable,
  frXXbepoCGTable,
  frXXbepoASTable,
  frXXbepoAGTable,
  frXXbepoAAGrTable,
  frXXbepoSGTable,
  frXXbepoAGrSTable,
  frXXbepoAGrGTable,
  frXXbepoCAAGTable,
  frXXbepoCASTable,
  frXXbepoCAGTable,
  frXXbepoCAGSTable,
  frXXbepoCAGGTable,
  frXXbepoCSGTable,
  frXXbepoAAGSTable,
  frXXbepoAAGGTable,
  frXXbepoASGTable,
  frXXbepoAGSGTable,
  frXXbepoCAAGrSTable,
  frXXbepoCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  frXXbepoCAGrSGTable,
  frXXbepoAAGrSGTable,
  frXXbepoAllModTable,
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

export { frXXbepo, frXXbepoModifiedTables };

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
import { BaseKeycodeTableType, KeymapCodeTableType } from "../../types";

const symbols: KeymapCodeTableType[] = [
  {
    code: 53,
    labels: {
      primary: "`",
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
      primary: "/",
    },
  },
  {
    code: 46,
    labels: {
      primary: "=",
    },
  },
];

const symbolsS: KeymapCodeTableType[] = [
  {
    code: 53,
    labels: {
      primary: "~",
    },
    alt: true,
  },
  {
    code: 30,
    labels: {
      primary: "€",
    },
    alt: true,
  },
  {
    code: 31,
    labels: {
      primary: "«",
    },
    alt: true,
  },
  {
    code: 32,
    labels: {
      primary: "»",
    },
    alt: true,
  },
  {
    code: 33,
    labels: {
      primary: "$",
    },
    alt: true,
  },
  {
    code: 34,
    labels: {
      primary: "%",
    },
    alt: true,
  },
  {
    code: 35,
    labels: {
      primary: "^",
    },
    alt: true,
  },
  {
    code: 36,
    labels: {
      primary: "&",
    },
    alt: true,
  },
  {
    code: 37,
    labels: {
      primary: "*",
    },
    alt: true,
  },
  {
    code: 38,
    labels: {
      primary: "#",
    },
    alt: true,
  },
  {
    code: 39,
    labels: {
      primary: "@",
    },
    alt: true,
  },
  {
    code: 45,
    labels: {
      primary: "_",
    },
    alt: true,
  },
  {
    code: 46,
    labels: {
      primary: "+",
    },
    alt: true,
  },
];

const letters: KeymapCodeTableType[] = [
  // First row
  {
    code: 20,
    labels: {
      primary: "q",
    },
  },
  {
    code: 26,
    labels: {
      primary: "c",
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
      primary: "p",
    },
  },
  {
    code: 23,
    labels: {
      primary: "w",
    },
  },
  {
    code: 28,
    labels: {
      primary: "j",
    },
  },
  {
    code: 24,
    labels: {
      primary: "m",
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
      primary: "★",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 19,
    labels: {
      primary: "y",
    },
  },
  {
    code: 47,
    labels: {
      primary: "[",
    },
  },
  {
    code: 48,
    labels: {
      primary: "]",
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
      primary: "s",
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
      primary: "n",
    },
  },
  {
    code: 10,
    labels: {
      primary: "f",
    },
  },
  {
    code: 11,
    labels: {
      primary: "l",
    },
  },
  {
    code: 13,
    labels: {
      primary: "r",
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
      primary: "i",
    },
  },
  {
    code: 51,
    labels: {
      primary: "u",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "'",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 49,
    labels: {
      primary: "\\",
    },
    newGroupName: "Punctuation",
  },
  // Third row
  {
    code: 100,
    labels: {
      primary: "<",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 29,
    labels: {
      primary: "z",
    },
  },
  {
    code: 27,
    labels: {
      primary: "x",
    },
  },
  {
    code: 6,
    labels: {
      primary: "-",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 25,
    labels: {
      primary: "v",
    },
  },
  {
    code: 5,
    labels: {
      primary: "b",
    },
  },
  {
    code: 17,
    labels: {
      primary: ".",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 16,
    labels: {
      primary: "h",
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
      primary: ",",
    },
  },
  {
    code: 56,
    labels: {
      primary: "k",
    },
    newGroupName: "Letters",
  },
];

const lettersS: KeymapCodeTableType[] = [
  // First row
  {
    code: 20,
    labels: {
      primary: "Q",
    },
    alt: true,
  },
  {
    code: 26,
    labels: {
      primary: "C",
    },
    alt: true,
  },
  {
    code: 8,
    labels: {
      primary: "O",
    },
    alt: true,
  },
  {
    code: 21,
    labels: {
      primary: "P",
    },
    alt: true,
  },
  {
    code: 23,
    labels: {
      primary: "W",
    },
    alt: true,
  },
  {
    code: 28,
    labels: {
      primary: "J",
    },
    alt: true,
  },
  {
    code: 24,
    labels: {
      primary: "M",
    },
    alt: true,
  },
  {
    code: 12,
    labels: {
      primary: "D",
    },
    alt: true,
  },
  {
    code: 18,
    labels: {
      primary: "!",
    },
    alt: true,
    newGroupName: "Punctuation",
  },
  {
    code: 19,
    labels: {
      primary: "Y",
    },
    alt: true,
  },
  {
    code: 47,
    labels: {
      primary: "{",
    },
    alt: true,
  },
  {
    code: 48,
    labels: {
      primary: "}",
    },
    alt: true,
  },
  // Second row
  {
    code: 4,
    labels: {
      primary: "A",
    },
    alt: true,
  },
  {
    code: 22,
    labels: {
      primary: "S",
    },
    alt: true,
  },
  {
    code: 7,
    labels: {
      primary: "E",
    },
    alt: true,
  },
  {
    code: 9,
    labels: {
      primary: "N",
    },
    alt: true,
  },
  {
    code: 10,
    labels: {
      primary: "F",
    },
    alt: true,
  },
  {
    code: 11,
    labels: {
      primary: "L",
    },
    alt: true,
  },
  {
    code: 13,
    labels: {
      primary: "R",
    },
    alt: true,
  },
  {
    code: 14,
    labels: {
      primary: "T",
    },
    alt: true,
  },
  {
    code: 15,
    labels: {
      primary: "I",
    },
    alt: true,
  },
  {
    code: 51,
    labels: {
      primary: "U",
    },
    alt: true,
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: '"',
    },
    alt: true,
  },
  {
    code: 49,
    labels: {
      primary: "|",
    },
    alt: true,
  },
  // Third row
  {
    code: 100,
    labels: {
      primary: ">",
    },
    alt: true,
  },
  {
    code: 29,
    labels: {
      primary: "Z",
    },
    alt: true,
  },
  {
    code: 27,
    labels: {
      primary: "X",
    },
    alt: true,
  },
  {
    code: 6,
    labels: {
      primary: "?",
    },
    alt: true,
    newGroupName: "Punctuation",
  },
  {
    code: 25,
    labels: {
      primary: "V",
    },
    alt: true,
  },
  {
    code: 5,
    labels: {
      primary: "B",
    },
    alt: true,
  },
  {
    code: 17,
    labels: {
      primary: ":",
    },
    alt: true,
    newGroupName: "Punctuation",
  },
  {
    code: 16,
    labels: {
      primary: "H",
    },
    alt: true,
  },
  {
    code: 54,
    labels: {
      primary: "G",
    },
    alt: true,
    newGroupName: "Letters",
  },
  {
    code: 55,
    labels: {
      primary: ";",
    },
    alt: true,
  },
  {
    code: 56,
    labels: {
      primary: "K",
    },
    alt: true,
    newGroupName: "Letters",
  },
];

const tableAGr: BaseKeycodeTableType = {
  groupName: "AltGr French",
  keys: [
    // Numbers row + AltGr
    {
      code: 53,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 30,
      labels: {
        primary: "₁",
      },
      alt: true,
    },
    {
      code: 31,
      labels: {
        primary: "₂",
      },
      alt: true,
    },
    {
      code: 32,
      labels: {
        primary: "₃",
      },
      alt: true,
    },
    {
      code: 33,
      labels: {
        primary: "₄",
      },
      alt: true,
    },
    {
      code: 34,
      labels: {
        primary: "₅",
      },
      alt: true,
    },
    {
      code: 35,
      labels: {
        primary: "₆",
      },
      alt: true,
    },
    {
      code: 36,
      labels: {
        primary: "₇",
      },
      alt: true,
    },
    {
      code: 37,
      labels: {
        primary: "₈",
      },
      alt: true,
    },
    {
      code: 38,
      labels: {
        primary: "₉",
      },
      alt: true,
    },
    {
      code: 39,
      labels: {
        primary: "₀",
      },
      alt: true,
    },
    {
      code: 45,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 46,
      labels: {
        primary: "",
      },
      alt: true,
    },
    // First row
    {
      code: 20,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 26,
      labels: {
        primary: "<",
      },
      alt: true,
    },
    {
      code: 8,
      labels: {
        primary: ">",
      },
      alt: true,
    },
    {
      code: 21,
      labels: {
        primary: "$",
      },
      alt: true,
    },
    {
      code: 23,
      labels: {
        primary: "%",
      },
      alt: true,
    },
    {
      code: 28,
      labels: {
        primary: "@",
      },
      alt: true,
    },
    {
      code: 24,
      labels: {
        primary: "&",
      },
      alt: true,
    },
    {
      code: 12,
      labels: {
        primary: "*",
      },
      alt: true,
    },
    {
      code: 18,
      labels: {
        primary: "'",
      },
      alt: true,
    },
    {
      code: 19,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: 47,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 48,
      labels: {
        primary: "",
      },
      alt: true,
    },
    // Second row
    {
      code: 4,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: 22,
      labels: {
        primary: "(",
      },
      alt: true,
    },
    {
      code: 7,
      labels: {
        primary: ")",
      },
      alt: true,
    },
    {
      code: 9,
      labels: {
        primary: "}",
      },
      alt: true,
    },
    {
      code: 10,
      labels: {
        primary: "=",
      },
      alt: true,
    },
    {
      code: 11,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
    {
      code: 13,
      labels: {
        primary: "+",
      },
      alt: true,
    },
    {
      code: 14,
      labels: {
        primary: "-",
      },
      alt: true,
    },
    {
      code: 15,
      labels: {
        primary: "/",
      },
      alt: true,
    },
    {
      code: 51,
      labels: {
        primary: '"',
      },
      alt: true,
    },
    {
      code: 52,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 49,
      labels: {
        primary: "",
      },
      alt: true,
    },
    // Third row
    {
      code: 100,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 29,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 27,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 6,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 25,
      labels: {
        primary: "_",
      },
      alt: true,
    },
    {
      code: 5,
      labels: {
        primary: "#",
      },
      alt: true,
    },
    {
      code: 17,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 16,
      labels: {
        primary: "!",
      },
      alt: true,
    },
    {
      code: 54,
      labels: {
        primary: ";",
      },
      alt: true,
    },
    {
      code: 55,
      labels: {
        primary: ":",
      },
      alt: true,
    },
    {
      code: 56,
      labels: {
        primary: "?",
      },
      alt: true,
    },
  ],
};

const tableAGrS: BaseKeycodeTableType = {
  groupName: "AltGrShift French",
  keys: [
    {
      code: 53,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 30,
      labels: {
        primary: "¹",
      },
      alt: true,
    },
    {
      code: 31,
      labels: {
        primary: "²",
      },
      alt: true,
    },
    {
      code: 32,
      labels: {
        primary: "³",
      },
      alt: true,
    },
    {
      code: 33,
      labels: {
        primary: "⁴",
      },
      alt: true,
    },
    {
      code: 34,
      labels: {
        primary: "⁵",
      },
      alt: true,
    },
    {
      code: 35,
      labels: {
        primary: "⁶",
      },
      alt: true,
    },
    {
      code: 36,
      labels: {
        primary: "⁷",
      },
      alt: true,
    },
    {
      code: 37,
      labels: {
        primary: "⁸",
      },
      alt: true,
    },
    {
      code: 38,
      labels: {
        primary: "⁹",
      },
      alt: true,
    },
    {
      code: 39,
      labels: {
        primary: "⁰",
      },
      alt: true,
    },
    {
      code: 45,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 46,
      labels: {
        primary: "",
      },
      alt: true,
    },
    // First row
    {
      code: 20,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 26,
      labels: {
        primary: "≤",
      },
      alt: true,
    },
    {
      code: 8,
      labels: {
        primary: "≥",
      },
      alt: true,
    },
    {
      code: 21,
      labels: {
        primary: "¤",
      },
      alt: true,
    },
    {
      code: 23,
      labels: {
        primary: "‰",
      },
      alt: true,
    },
    {
      code: 28,
      labels: {
        primary: "˚",
      },
      alt: true,
    },
    {
      code: 24,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 12,
      labels: {
        primary: "×",
      },
      alt: true,
    },
    {
      code: 18,
      labels: {
        primary: "´",
      },
      alt: true,
    },
    {
      code: 19,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: 47,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 48,
      labels: {
        primary: "",
      },
      alt: true,
    },
    // Second row
    {
      code: 4,
      labels: {
        primary: "ˇ",
      },
      alt: true,
    },
    {
      code: 22,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 7,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 9,
      labels: {
        primary: "˙",
      },
      alt: true,
    },
    {
      code: 10,
      labels: {
        primary: "≠",
      },
      alt: true,
    },
    {
      code: 11,
      labels: {
        primary: "/",
      },
      alt: true,
    },
    {
      code: 13,
      labels: {
        primary: "±",
      },
      alt: true,
    },
    {
      code: 14,
      labels: {
        primary: "ˉ",
      },
      alt: true,
    },
    {
      code: 15,
      labels: {
        primary: "÷",
      },
      alt: true,
    },
    {
      code: 51,
      labels: {
        primary: "˝",
      },
      alt: true,
    },
    {
      code: 52,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 49,
      labels: {
        primary: "",
      },
      alt: true,
    },
    // Third row
    {
      code: 100,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 29,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 27,
      labels: {
        primary: ",",
      },
      alt: true,
    },
    {
      code: 6,
      labels: {
        primary: "˛",
      },
      alt: true,
    },
    {
      code: 25,
      labels: {
        primary: "–",
      },
      alt: true,
    },
    {
      code: 5,
      labels: {
        primary: "",
      },
      alt: true,
    },
    {
      code: 17,
      labels: {
        primary: "¦",
      },
      alt: true,
    },
    {
      code: 16,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
    {
      code: 54,
      labels: {
        primary: "¸",
      },
      alt: true,
    },
    {
      code: 55,
      labels: {
        primary: ":",
      },
      alt: true,
    },
    {
      code: 56,
      labels: {
        primary: "˘",
      },
      alt: true,
    },
  ],
};

const frXXergol = letters.concat(symbols);
const frXXergolS = lettersS.concat(symbolsS);

const table: BaseKeycodeTableType = { keys: frXXergol, groupName: "" };
const tableS: BaseKeycodeTableType = { keys: frXXergolS, groupName: "" };

const frXXergolCtrlTable = withModifiers(table, "Control +", "C+", 256);
const frXXergolLAltTable = withModifiers(table, "Alt +", "A+", 512);
const frXXergolRAltTable = withModifiers(tableAGr, "AltGr +", "AGr+", 1024);
const frXXergolShiftTable = withModifiers(tableS, "Shift +", "S+", 2048);
const frXXergolGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double
const frXXergolCATable = withModifiers(tableAGr, "Control + Alt +", "C+A+", 768);
const frXXergolCAGrTable = withModifiers(tableAGr, "Control + AltGr +", "C+AGr+", 1280);
const frXXergolCSTable = withModifiers(tableS, "Control + Shift +", "C+S+", 2304);
const frXXergolCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const frXXergolAAGrTable = withModifiers(tableAGr, "Alt + AltGr +", "A+AGr+", 1536);
const frXXergolASTable = withModifiers(tableS, "Alt + Shift +", "A+S+", 2560);
const frXXergolAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const frXXergolAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const frXXergolAGrGTable = withModifiers(tableAGr, "AltGr + Os +", "AGr+O+", 5120);
const frXXergolSGTable = withModifiers(tableS, "Shift + Os +", "S+O+", 6144);

// Triple
const frXXergolCAAGTable = withModifiers(tableAGr, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const frXXergolCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const frXXergolCAGTable = withModifiers(tableAGr, "Control + Alt + Os +", "C+A+O+", 4864);
const frXXergolCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const frXXergolCAGGTable = withModifiers(tableAGr, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const frXXergolCSGTable = withModifiers(tableS, "Control + Shift + Os +", "C+S+O+", 6400);
const frXXergolAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const frXXergolAAGGTable = withModifiers(tableAGr, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const frXXergolASGTable = withModifiers(tableS, "Alt + Shift + Os +", "A+S+O+", 6656);
const frXXergolAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad
const frXXergolCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const frXXergolCAAGrGTable = withModifiers(tableAGr, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const frXXergolCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const frXXergolAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const frXXergolAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

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

const frXXergolModifiedTables = [
  frXXergolCtrlTable,
  frXXergolLAltTable,
  frXXergolRAltTable,
  frXXergolShiftTable,
  frXXergolGuiTable,
  frXXergolCATable,
  frXXergolCAGrTable,
  frXXergolCSTable,
  frXXergolCGTable,
  frXXergolASTable,
  frXXergolAGTable,
  frXXergolAAGrTable,
  frXXergolSGTable,
  frXXergolAGrSTable,
  frXXergolAGrGTable,
  frXXergolCAAGTable,
  frXXergolCASTable,
  frXXergolCAGTable,
  frXXergolCAGSTable,
  frXXergolCAGGTable,
  frXXergolCSGTable,
  frXXergolAAGSTable,
  frXXergolAAGGTable,
  frXXergolASGTable,
  frXXergolAGSGTable,
  frXXergolCAAGrSTable,
  frXXergolCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  frXXergolCAGrSGTable,
  frXXergolAAGrSGTable,
  frXXergolAllModTable,
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

export { frXXergol, frXXergolModifiedTables };

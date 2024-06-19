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

const esLALetters: KeymapCodeTableType[] = [
  {
    code: 51,
    labels: {
      primary: "Ñ",
    },
    newGroupName: "Letters",
  },
];

const esLAModifierKeys: KeymapCodeTableType[] = [
  {
    code: 45,
    labels: {
      primary: "'",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 46,
    labels: {
      primary: "¿",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 47,
    labels: {
      primary: "´",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 48,
    labels: {
      primary: "+",
    },
  },
  {
    code: 49,
    labels: {
      primary: "}",
    },
  },
  {
    code: 52,
    labels: {
      primary: "{",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 53,
    labels: {
      primary: "|",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 56,
    labels: {
      primary: "-",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 100,
    labels: {
      primary: "<",
    },
  },
];

const shiftModifierSpanish: BaseKeycodeTableType = {
  groupName: "AltCtrl Spanish",
  keys: [
    {
      code: 2079,
      labels: {
        primary: '"',
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2080,
      labels: {
        primary: "#",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2083,
      labels: {
        primary: "&",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2084,
      labels: {
        primary: "/",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2085,
      labels: {
        primary: "(",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2086,
      labels: {
        primary: ")",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2087,
      labels: {
        primary: "=",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2093,
      labels: {
        primary: "'",
      },
      newGroupName: "Shifted Digits",
    },
    {
      code: 2094,
      labels: {
        primary: "¿",
      },
      newGroupName: "Shifted Digits",
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
        primary: "*",
      },
    },
    {
      code: 2097,
      labels: {
        primary: "]",
        top: "S+",
      },
    },
    {
      code: 2099,
      labels: {
        primary: "Ñ",
        top: "S+",
      },
    },
    {
      code: 2100,
      labels: {
        primary: "[",
      },
    },
    {
      code: 2101,
      labels: {
        primary: "°",
      },
    },
    {
      code: 2102,
      labels: {
        primary: ";",
      },
    },
    {
      code: 2103,
      labels: {
        primary: ":",
      },
    },
    {
      code: 2104,
      labels: {
        primary: "_",
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

const altCtrlSpanish: BaseKeycodeTableType = {
  groupName: "AltCtrl Spanish",
  keys: [
    {
      code: 788,
      labels: {
        primary: "@",
      },
    },
    {
      code: 813,
      labels: {
        primary: "\\",
      },
    },
    {
      code: 816,
      labels: {
        primary: "~",
      },
    },
    {
      code: 817,
      labels: {
        primary: "`",
      },
    },
    {
      code: 820,
      labels: {
        primary: "^",
      },
    },
    {
      code: 821,
      labels: {
        primary: "¬",
      },
    },
  ],
};

const altGrSpanish: BaseKeycodeTableType = altCtrlSpanish;

const esLA = esLALetters.concat(esLAModifierKeys);

const table: BaseKeycodeTableType = { keys: esLA, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: esLALetters, groupName: "" };

const esLACtrlTable = withModifiers(table, "Control +", "C+", 256);
const esLALAltTable = withModifiers(table, "Alt +", "A+", 512);
const esLARAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const esLAShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const esLAGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const esLACATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const esLACAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const esLACSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const esLACGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const esLAAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const esLAASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const esLAAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const esLAAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const esLAAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const esLASGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const esLACAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const esLACASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const esLACAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const esLACAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const esLACAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const esLACSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const esLAAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const esLAAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const esLAASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const esLAAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const esLACAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const esLACAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const esLACAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const esLAAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const esLAAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const esLAModifiedTables = [
  shiftModifierSpanish,
  esLACtrlTable,
  esLALAltTable,
  esLARAltTable,
  altGrSpanish,
  esLAShiftTable,
  esLAGuiTable,
  esLACATable,
  altCtrlSpanish,
  esLACAGrTable,
  esLACSTable,
  esLACGTable,
  esLAASTable,
  esLAAGTable,
  esLAAAGrTable,
  esLASGTable,
  esLAAGrSTable,
  esLAAGrGTable,
  esLACAAGTable,
  esLACASTable,
  esLACAGTable,
  esLACAGSTable,
  esLACAGGTable,
  esLACSGTable,
  esLAAAGSTable,
  esLAAAGGTable,
  esLAASGTable,
  esLAAGSGTable,
  esLACAAGrSTable,
  esLACAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  esLACAGrSGTable,
  esLAAAGrSGTable,
  esLAAllModTable,
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

export { esLA, esLAModifiedTables };

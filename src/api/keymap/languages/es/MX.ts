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

const esMXLetters: KeymapCodeTableType[] = [
  {
    code: 51,
    labels: {
      primary: "Ñ",
    },
    newGroupName: "Letters",
  },
];

const esMXModifierKeys: KeymapCodeTableType[] = [
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
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2080,
      labels: {
        primary: "#",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2083,
      labels: {
        primary: "&",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2084,
      labels: {
        primary: "/",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2085,
      labels: {
        primary: "(",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2086,
      labels: {
        primary: ")",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2087,
      labels: {
        primary: "=",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2093,
      labels: {
        primary: "?",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2094,
      labels: {
        primary: "¡",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2095,
      labels: {
        primary: "¨",
      },
      alt: true,
    },
    {
      code: 2096,
      labels: {
        primary: "*",
      },
      alt: true,
    },
    {
      code: 2097,
      labels: {
        primary: "]",
        top: "S+",
      },
      alt: true,
    },
    {
      code: 2099,
      labels: {
        primary: "Ñ",
        top: "S+",
      },
      alt: true,
    },
    {
      code: 2100,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 2101,
      labels: {
        primary: "°",
      },
      alt: true,
    },
    {
      code: 2102,
      labels: {
        primary: ";",
      },
      alt: true,
    },
    {
      code: 2103,
      labels: {
        primary: ":",
      },
      alt: true,
    },
    {
      code: 2104,
      labels: {
        primary: "_",
      },
      alt: true,
    },
    {
      code: 2148,
      labels: {
        primary: ">",
      },
      alt: true,
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
      alt: true,
    },
    {
      code: 813,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
    {
      code: 816,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 817,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: 820,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 821,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
  ],
};

const altGrSpanish: BaseKeycodeTableType = {
  groupName: "AltCtrl Spanish",
  keys: [
    {
      code: 1044,
      labels: {
        primary: "@",
      },
      alt: true,
    },
    {
      code: 1069,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
    {
      code: 1072,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 1073,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: 1076,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 1077,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
  ],
};

const esMX = esMXLetters.concat(esMXModifierKeys);

const table: BaseKeycodeTableType = { keys: esMX, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: esMXLetters, groupName: "" };

const esMXCtrlTable = withModifiers(table, "Control +", "C+", 256);
const esMXLAltTable = withModifiers(table, "Alt +", "A+", 512);
const esMXRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const esMXShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const esMXGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const esMXCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const esMXCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const esMXCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const esMXCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const esMXAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const esMXASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const esMXAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const esMXAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const esMXAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const esMXSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const esMXCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const esMXCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const esMXCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const esMXCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const esMXCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const esMXCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const esMXAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const esMXAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const esMXASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const esMXAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const esMXCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const esMXCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const esMXCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const esMXAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const esMXAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const esMXModifiedTables = [
  shiftModifierSpanish,
  esMXCtrlTable,
  esMXLAltTable,
  esMXRAltTable,
  altGrSpanish,
  esMXShiftTable,
  esMXGuiTable,
  esMXCATable,
  altCtrlSpanish,
  esMXCAGrTable,
  esMXCSTable,
  esMXCGTable,
  esMXASTable,
  esMXAGTable,
  esMXAAGrTable,
  esMXSGTable,
  esMXAGrSTable,
  esMXAGrGTable,
  esMXCAAGTable,
  esMXCASTable,
  esMXCAGTable,
  esMXCAGSTable,
  esMXCAGGTable,
  esMXCSGTable,
  esMXAAGSTable,
  esMXAAGGTable,
  esMXASGTable,
  esMXAGSGTable,
  esMXCAAGrSTable,
  esMXCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  esMXCAGrSGTable,
  esMXAAGrSGTable,
  esMXAllModTable,
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

export { esMX, esMXModifiedTables };

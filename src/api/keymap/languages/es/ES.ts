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

const esESLetters: KeymapCodeTableType[] = [
  {
    code: 49,
    labels: {
      primary: "Ç",
    },
    newGroupName: "Letters",
  },
  {
    code: 51,
    labels: {
      primary: "Ñ",
    },
    newGroupName: "Letters",
  },
];

const esESModifierKeys: KeymapCodeTableType[] = [
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
      primary: "¡",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 47,
    labels: {
      primary: "`",
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
    code: 52,
    labels: {
      primary: "´",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 53,
    labels: {
      primary: "º",
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
        primary: "·",
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
        primary: "¿",
      },
      alt: true,

      newGroupName: "Shifted Digits",
    },
    {
      code: 2095,
      labels: {
        primary: "^",
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
        primary: "Ç",
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
        primary: "¨",
      },
      alt: true,
    },
    {
      code: 2101,
      labels: {
        primary: "ª",
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
      code: 798,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 799,
      labels: {
        primary: "@",
      },
      alt: true,
    },
    {
      code: 800,
      labels: {
        primary: "#",
      },
      alt: true,
    },
    {
      code: 801,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 802,
      labels: {
        primary: "€",
      },
      alt: true,
    },
    {
      code: 803,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
    {
      code: 776,
      labels: {
        primary: "€",
      },
      alt: true,
    },
    {
      code: 815,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 816,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 817,
      labels: {
        primary: "}",
      },
      alt: true,
    },
    {
      code: 820,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: 821,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
  ],
};

const altGrSpanish: BaseKeycodeTableType = {
  groupName: "AltCtrl Spanish",
  keys: [
    {
      code: 1054,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 1055,
      labels: {
        primary: "@",
      },
      alt: true,
    },
    {
      code: 1056,
      labels: {
        primary: "#",
      },
      alt: true,
    },
    {
      code: 1057,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 1058,
      labels: {
        primary: "€",
      },
      alt: true,
    },
    {
      code: 1059,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
    {
      code: 1032,
      labels: {
        primary: "€",
      },
      alt: true,
    },
    {
      code: 1071,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 1072,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 1073,
      labels: {
        primary: "}",
      },
      alt: true,
    },

    {
      code: 1076,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: 1077,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
  ],
};

const esES = esESLetters.concat(esESModifierKeys);

const table: BaseKeycodeTableType = { keys: esES, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: esESLetters, groupName: "" };

const esESCtrlTable = withModifiers(table, "Control +", "C+", 256);
const esESLAltTable = withModifiers(table, "Alt +", "A+", 512);
const esESRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const esESShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const esESGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const esESCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const esESCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const esESCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const esESCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const esESAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const esESASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const esESAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const esESAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const esESAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const esESSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const esESCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const esESCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const esESCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const esESCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const esESCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const esESCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const esESAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const esESAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const esESASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const esESAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const esESCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const esESCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const esESCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const esESAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const esESAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const esESModifiedTables = [
  shiftModifierSpanish,
  esESCtrlTable,
  esESLAltTable,
  esESRAltTable,
  altGrSpanish,
  esESShiftTable,
  esESGuiTable,
  esESCATable,
  altCtrlSpanish,
  esESCAGrTable,
  esESCSTable,
  esESCGTable,
  esESASTable,
  esESAGTable,
  esESAAGrTable,
  esESSGTable,
  esESAGrSTable,
  esESAGrGTable,
  esESCAAGTable,
  esESCASTable,
  esESCAGTable,
  esESCAGSTable,
  esESCAGGTable,
  esESCSGTable,
  esESAAGSTable,
  esESAAGGTable,
  esESASGTable,
  esESAGSGTable,
  esESCAAGrSTable,
  esESCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  esESCAGrSGTable,
  esESAAGrSGTable,
  esESAllModTable,
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

export { esES, esESModifiedTables };

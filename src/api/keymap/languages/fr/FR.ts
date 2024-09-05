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

const frFRLetters: KeymapCodeTableType[] = [
  {
    code: 20,
    labels: {
      primary: "A",
    },
  },
  {
    code: 26,
    labels: {
      primary: "Z",
    },
  },
  {
    code: 4,
    labels: {
      primary: "Q",
    },
  },
  {
    code: 51,
    labels: {
      primary: "M",
    },
    newGroupName: "Letters",
  },
  {
    code: 29,
    labels: {
      primary: "W",
    },
  },
  {
    code: 53,
    labels: {
      primary: "²",
    },
    newGroupName: "Letters",
  },
];

const frFRModifierKeys: KeymapCodeTableType[] = [
  {
    code: 31,
    labels: {
      primary: "é",
    },
    newGroupName: "Letters",
  },
  {
    code: 36,
    labels: {
      primary: "è",
    },
    newGroupName: "Letters",
  },
  {
    code: 38,
    labels: {
      primary: "ç",
    },
    newGroupName: "Letters",
  },
  {
    code: 39,
    labels: {
      primary: "à",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "ù",
    },
    newGroupName: "Letters",
  },
  {
    code: 30,
    labels: {
      primary: "&",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 32,
    labels: {
      primary: '"',
    },
    newGroupName: "Punctuation",
  },
  {
    code: 33,
    labels: {
      primary: "'",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 34,
    labels: {
      primary: "(",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 35,
    labels: {
      primary: "-",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 37,
    labels: {
      primary: "_",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 45,
    labels: {
      primary: ")",
    },
  },

  {
    code: 47,
    labels: {
      primary: "^",
    },
  },
  {
    code: 48,
    labels: {
      primary: "$",
    },
  },
  {
    code: 49,
    labels: {
      primary: "*",
    },
  },
  {
    code: 16,
    labels: {
      primary: ",",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 54,
    labels: {
      primary: ";",
    },
  },
  {
    code: 55,
    labels: {
      primary: ":",
    },
  },
  {
    code: 56,
    labels: {
      primary: "!",
    },
  },
  {
    code: 100,
    labels: {
      primary: "<",
    },
  },
];

const altCtrlFrench: BaseKeycodeTableType = {
  groupName: "AltCtrl French",
  keys: [
    {
      code: 799,
      labels: {
        primary: "~",
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
        primary: "{",
      },
      alt: true,
    },
    {
      code: 802,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 803,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 804,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: 805,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
    {
      code: 806,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 807,
      labels: {
        primary: "@",
      },
      alt: true,
    },
    {
      code: 813,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 814,
      labels: {
        primary: "}",
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
      code: 816,
      labels: {
        primary: "¤",
      },
      alt: true,
    },
  ],
};

const altGRFrench: BaseKeycodeTableType = {
  groupName: "AltCtrl French",
  keys: [
    {
      code: 1055,
      labels: {
        primary: "~",
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
        primary: "{",
      },
      alt: true,
    },
    {
      code: 1058,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 1059,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 1060,
      labels: {
        primary: "`",
      },
      alt: true,
    },
    {
      code: 1061,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
    {
      code: 1062,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 1063,
      labels: {
        primary: "@",
      },
      alt: true,
    },
    {
      code: 1069,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 1070,
      labels: {
        primary: "}",
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
      code: 1072,
      labels: {
        primary: "¤",
      },
      alt: true,
    },
  ],
};

const shiftModifierFrench: BaseKeycodeTableType = {
  groupName: "Shifted French",
  keys: [
    {
      code: 2078,
      labels: {
        primary: "1",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2079,
      labels: {
        primary: "2",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2080,
      labels: {
        primary: "3",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2081,
      labels: {
        primary: "4",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2082,
      labels: {
        primary: "5",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2083,
      labels: {
        primary: "6",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2084,
      labels: {
        primary: "7",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2085,
      labels: {
        primary: "8",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2086,
      labels: {
        primary: "9",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2087,
      labels: {
        primary: "0",
      },
      alt: true,
      newGroupName: "Digits",
    },
    {
      code: 2093,
      labels: {
        primary: "°",
      },
      alt: true,
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
        primary: "£",
      },
      alt: true,
    },
    {
      code: 2097,
      labels: {
        primary: "µ",
      },
      alt: true,
    },
    {
      code: 2099,
      labels: {
        primary: "M",
      },
      alt: true,
    },
    {
      code: 2100,
      labels: {
        primary: "%",
      },
      alt: true,
    },
    {
      code: 2064,
      labels: {
        primary: "?",
      },
      alt: true,
    },
    {
      code: 2102,
      labels: {
        primary: ".",
      },
      alt: true,
    },
    {
      code: 2103,
      labels: {
        primary: "/",
      },
      alt: true,
    },
    {
      code: 2104,
      labels: {
        primary: "§",
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

const frFR = frFRLetters.concat(frFRModifierKeys);

const table: BaseKeycodeTableType = { keys: frFR, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: frFRLetters, groupName: "" };

const frFRCtrlTable = withModifiers(table, "Control +", "C+", 256);
const frFRLAltTable = withModifiers(table, "Alt +", "A+", 512);
const frFRRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const frFRShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const frFRGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const frFRCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const frFRCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const frFRCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const frFRCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const frFRAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const frFRASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const frFRAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const frFRAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const frFRAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const frFRSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const frFRCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const frFRCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const frFRCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const frFRCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const frFRCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const frFRCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const frFRAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const frFRAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const frFRASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const frFRAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const frFRCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const frFRCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const frFRCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const frFRAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const frFRAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const frFRModifiedTables = [
  shiftModifierFrench,
  frFRCtrlTable,
  frFRLAltTable,
  frFRRAltTable,
  frFRShiftTable,
  frFRGuiTable,
  frFRCATable,
  altCtrlFrench,
  altGRFrench,
  frFRCAGrTable,
  frFRCSTable,
  frFRCGTable,
  frFRASTable,
  frFRAGTable,
  frFRAAGrTable,
  frFRSGTable,
  frFRAGrSTable,
  frFRAGrGTable,
  frFRCAAGTable,
  frFRCASTable,
  frFRCAGTable,
  frFRCAGSTable,
  frFRCAGGTable,
  frFRCSGTable,
  frFRAAGSTable,
  frFRAAGGTable,
  frFRASGTable,
  frFRAGSGTable,
  frFRCAAGrSTable,
  frFRCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  frFRCAGrSGTable,
  frFRAAGrSGTable,
  frFRAllModTable,
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

export { frFR, frFRModifiedTables };

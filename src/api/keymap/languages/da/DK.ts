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

const daDKLetters: KeymapCodeTableType[] = [
  {
    code: 47,
    labels: {
      primary: "Å",
    },
    newGroupName: "Letters",
  },
  {
    code: 51,
    labels: {
      primary: "Æ",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "Ø",
    },
    newGroupName: "Letters",
  },
];

const daDKModifierKeys: KeymapCodeTableType[] = [
  {
    code: 53,
    labels: {
      primary: "½",
    },
  },
  {
    code: 45,
    labels: {
      primary: "+",
    },
  },
  {
    code: 46,
    labels: {
      primary: "´",
    },
  },
  {
    code: 48,
    labels: {
      primary: "¨",
    },
  },
  {
    code: 49,
    labels: {
      primary: "'",
    },
  },
  {
    code: 56,
    labels: {
      primary: "-",
    },
  },
  {
    code: 100,
    labels: {
      primary: "<",
    },
  },
];

const altCtrlDanish: BaseKeycodeTableType = {
  groupName: "AltCtrl Danish",
  keys: [
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
        primary: "£",
      },
      alt: true,
    },
    {
      code: 801,
      labels: {
        primary: "$",
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
      code: 804,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: 805,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 806,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 807,
      labels: {
        primary: "}",
      },
      alt: true,
    },
    {
      code: 814,
      labels: {
        primary: "|",
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
        primary: "~",
      },
      alt: true,
    },
    {
      code: 784,
      labels: {
        primary: "µ",
      },
      alt: true,
    },
    {
      code: 868,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
  ],
};

const altGRDanish: BaseKeycodeTableType = {
  groupName: "AltCtrl Danish",
  keys: [
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
        primary: "£",
      },
      alt: true,
    },
    {
      code: 1057,
      labels: {
        primary: "$",
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
      code: 1060,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: 1061,
      labels: {
        primary: "[",
      },
      alt: true,
    },
    {
      code: 1062,
      labels: {
        primary: "]",
      },
      alt: true,
    },
    {
      code: 1063,
      labels: {
        primary: "}",
      },
      alt: true,
    },
    {
      code: 1070,
      labels: {
        primary: "|",
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
        primary: "~",
      },
      alt: true,
    },
    {
      code: 1040,
      labels: {
        primary: "µ",
      },
      alt: true,
    },
    {
      code: 1124,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
  ],
};

const shiftModifierDanish: BaseKeycodeTableType = {
  groupName: "Shifted Danish",
  keys: [
    {
      code: 2101,
      labels: {
        primary: "§",
      },
      alt: true,
    },
    {
      code: 2079,
      labels: {
        primary: '"',
      },
      alt: true,
    },
    {
      code: 2081,
      labels: {
        primary: "¤",
      },
      alt: true,
    },
    {
      code: 2083,
      labels: {
        primary: "&",
      },
      alt: true,
    },
    {
      code: 2084,
      labels: {
        primary: "/",
      },
      alt: true,
    },
    {
      code: 2085,
      labels: {
        primary: "(",
      },
      alt: true,
    },
    {
      code: 2086,
      labels: {
        primary: ")",
      },
      alt: true,
    },
    {
      code: 2087,
      labels: {
        primary: "=",
      },
      alt: true,
    },
    {
      code: 2093,
      labels: {
        primary: "?",
      },
      alt: true,
    },
    {
      code: 2094,
      labels: {
        primary: "`",
      },
      alt: true,
    },

    {
      code: 2096,
      labels: {
        primary: "^",
      },
      alt: true,
    },
    {
      code: 2097,
      labels: {
        primary: "*",
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

const daDK = daDKLetters.concat(daDKModifierKeys);

const table: BaseKeycodeTableType = { keys: daDK, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: daDKLetters, groupName: "" };

const daDKCtrlTable = withModifiers(table, "Control +", "C+", 256);
const daDKLAltTable = withModifiers(table, "Alt +", "A+", 512);
const daDKRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const daDKShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const daDKGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const daDKCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const daDKCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const daDKCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const daDKCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const daDKAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const daDKASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const daDKAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const daDKAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const daDKAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const daDKSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const daDKCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const daDKCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const daDKCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const daDKCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const daDKCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const daDKCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const daDKAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const daDKAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const daDKASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const daDKAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const daDKCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const daDKCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const daDKCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const daDKAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const daDKAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const daDKModifiedTables = [
  shiftModifierDanish,
  daDKCtrlTable,
  daDKLAltTable,
  daDKRAltTable,
  daDKShiftTable,
  daDKGuiTable,
  daDKCATable,
  altCtrlDanish,
  altGRDanish,
  daDKCAGrTable,
  daDKCSTable,
  daDKCGTable,
  daDKAAGrTable,
  daDKASTable,
  daDKAGTable,
  daDKAGrSTable,
  daDKAGrGTable,
  daDKSGTable,
  daDKCAAGTable,
  daDKCASTable,
  daDKCAGTable,
  daDKCAGSTable,
  daDKCAGGTable,
  daDKCSGTable,
  daDKAAGSTable,
  daDKAAGGTable,
  daDKASGTable,
  daDKAGSGTable,
  daDKCAAGrSTable,
  daDKCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  daDKCAGrSGTable,
  daDKAAGrSGTable,
  daDKAllModTable,
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

export { daDK, daDKModifiedTables };

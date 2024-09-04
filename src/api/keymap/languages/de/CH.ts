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

const deCHLetters: KeymapCodeTableType[] = [
  {
    code: 28,
    labels: {
      primary: "Z",
    },
  },
  {
    code: 29,
    labels: {
      primary: "Y",
    },
  },
];

const deCHModifierKeys: KeymapCodeTableType[] = [
  {
    code: 53,
    labels: {
      primary: "§",
    },
  },
  {
    code: 45,
    labels: {
      primary: "'",
    },
  },
  {
    code: 46,
    labels: {
      primary: "^",
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
      primary: "$",
    },
    newGroupName: "Shifted Digits",
  },
  {
    code: 47,
    labels: {
      primary: "Ü",
    },
    newGroupName: "Letters",
  },
  {
    code: 51,
    labels: {
      primary: "Ö",
    },
    newGroupName: "Letters",
  },
  {
    code: 52,
    labels: {
      primary: "Ä",
    },
    newGroupName: "Letters",
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

const altCtrlSwissGerman: BaseKeycodeTableType = {
  groupName: "AltCtrl SwissGerman",
  keys: [
    {
      code: 798,
      labels: {
        primary: "¦",
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
      code: 803,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
    {
      code: 804,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 805,
      labels: {
        primary: "¢",
      },
      alt: true,
    },
    {
      code: 813,
      labels: {
        primary: "´",
      },
      alt: true,
    },
    {
      code: 814,
      labels: {
        primary: "~",
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
      code: 868,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
  ],
};

const altGrSwissGerman: BaseKeycodeTableType = {
  groupName: "AltCtrl SwissGerman",
  keys: [
    {
      code: 1054,
      labels: {
        primary: "¦",
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
      code: 1059,
      labels: {
        primary: "¬",
      },
      alt: true,
    },
    {
      code: 1060,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 1061,
      labels: {
        primary: "¢",
      },
      alt: true,
    },
    {
      code: 1069,
      labels: {
        primary: "´",
      },
      alt: true,
    },
    {
      code: 1070,
      labels: {
        primary: "~",
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
      code: 1124,
      labels: {
        primary: "\\",
      },
      alt: true,
    },
  ],
};

const shiftModifierSwissGerman: BaseKeycodeTableType = {
  groupName: "Shifted SwissGerman",
  keys: [
    {
      code: 2101,
      labels: {
        primary: "°",
      },
      alt: true,
    },
    {
      code: 2078,
      labels: {
        primary: "+",
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
      code: 2080,
      labels: {
        primary: "*",
      },
      alt: true,
    },
    {
      code: 2081,
      labels: {
        primary: "ç",
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
      code: 2095,
      labels: {
        primary: "È",
      },
      alt: true,
    },
    {
      code: 2096,
      labels: {
        primary: "!",
      },
      alt: true,
    },
    {
      code: 2097,
      labels: {
        primary: "£",
      },
      alt: true,
    },
    {
      code: 2099,
      labels: {
        primary: "É",
      },
      alt: true,
    },
    {
      code: 2100,
      labels: {
        primary: "À",
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

const deCH = deCHLetters.concat(deCHModifierKeys);

const table: BaseKeycodeTableType = { keys: deCH, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: deCHLetters, groupName: "" };

const deCHCtrlTable = withModifiers(table, "Control +", "C+", 256);
const deCHLAltTable = withModifiers(table, "Alt +", "A+", 512);
const deCHRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const deCHShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const deCHGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const deCHCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const deCHCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const deCHCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const deCHCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const deCHAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const deCHASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const deCHAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const deCHAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const deCHAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const deCHSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const deCHCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const deCHCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const deCHCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const deCHCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const deCHCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const deCHCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const deCHAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const deCHAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const deCHASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const deCHAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const deCHCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const deCHCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const deCHCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const deCHAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const deCHAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const deCHModifiedTables = [
  shiftModifierSwissGerman,
  deCHCtrlTable,
  deCHLAltTable,
  deCHRAltTable,
  deCHShiftTable,
  deCHGuiTable,
  deCHCATable,
  altCtrlSwissGerman,
  altGrSwissGerman,
  deCHCAGrTable,
  deCHCSTable,
  deCHCGTable,
  deCHAAGrTable,
  deCHASTable,
  deCHAGTable,
  deCHAGrSTable,
  deCHAGrGTable,
  deCHSGTable,
  deCHCAAGTable,
  deCHCASTable,
  deCHCAGTable,
  deCHCAGSTable,
  deCHCAGGTable,
  deCHCSGTable,
  deCHAAGSTable,
  deCHAAGGTable,
  deCHASGTable,
  deCHAGSGTable,
  deCHCAAGrSTable,
  deCHCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  deCHCAGrSGTable,
  deCHAAGrSGTable,
  deCHAllModTable,
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

export { deCH, deCHModifiedTables };

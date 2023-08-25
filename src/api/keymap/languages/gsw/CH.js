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

const gswCHLetters = [
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

const gswCHModifierKeys = [
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

const altCtrlSwissGerman = {
  groupName: "AltCtrl SwissGerman",
  keys: [
    {
      code: 798,
      labels: {
        primary: "¦",
      },
    },
    {
      code: 799,
      labels: {
        primary: "@",
      },
    },
    {
      code: 800,
      labels: {
        primary: "#",
      },
    },
    {
      code: 803,
      labels: {
        primary: "¬",
      },
    },
    {
      code: 804,
      labels: {
        primary: "|",
      },
    },
    {
      code: 805,
      labels: {
        primary: "¢",
      },
    },
    {
      code: 813,
      labels: {
        primary: "´",
      },
    },
    {
      code: 814,
      labels: {
        primary: "~",
      },
    },
    {
      code: 776,
      labels: {
        primary: "€",
      },
    },
    {
      code: 815,
      labels: {
        primary: "[",
      },
    },
    {
      code: 816,
      labels: {
        primary: "]",
      },
    },
    {
      code: 817,
      labels: {
        primary: "}",
      },
    },
    {
      code: 820,
      labels: {
        primary: "{",
      },
    },
    {
      code: 868,
      labels: {
        primary: "\\",
      },
    },
  ],
};

const altGrSwissGerman = {
  groupName: "AltCtrl SwissGerman",
  keys: [
    {
      code: 1054,
      labels: {
        primary: "¦",
      },
    },
    {
      code: 1055,
      labels: {
        primary: "@",
      },
    },
    {
      code: 1056,
      labels: {
        primary: "#",
      },
    },
    {
      code: 1059,
      labels: {
        primary: "¬",
      },
    },
    {
      code: 1060,
      labels: {
        primary: "|",
      },
    },
    {
      code: 1061,
      labels: {
        primary: "¢",
      },
    },
    {
      code: 1069,
      labels: {
        primary: "´",
      },
    },
    {
      code: 1070,
      labels: {
        primary: "~",
      },
    },
    {
      code: 1032,
      labels: {
        primary: "€",
      },
    },
    {
      code: 1071,
      labels: {
        primary: "[",
      },
    },
    {
      code: 1072,
      labels: {
        primary: "]",
      },
    },
    {
      code: 1073,
      labels: {
        primary: "}",
      },
    },
    {
      code: 1076,
      labels: {
        primary: "{",
      },
    },
    {
      code: 1124,
      labels: {
        primary: "\\",
      },
    },
  ],
};

const shiftModifierSwissGerman = {
  groupName: "Shifted SwissGerman",
  keys: [
    {
      code: 2101,
      labels: {
        primary: "°",
      },
    },
    {
      code: 2078,
      labels: {
        primary: "+",
      },
    },
    {
      code: 2079,
      labels: {
        primary: '"',
      },
    },
    {
      code: 2080,
      labels: {
        primary: "*",
      },
    },
    {
      code: 2081,
      labels: {
        primary: "ç",
      },
    },
    {
      code: 2083,
      labels: {
        primary: "&",
      },
    },
    {
      code: 2084,
      labels: {
        primary: "/",
      },
    },
    {
      code: 2085,
      labels: {
        primary: "(",
      },
    },
    {
      code: 2086,
      labels: {
        primary: ")",
      },
    },
    {
      code: 2087,
      labels: {
        primary: "=",
      },
    },
    {
      code: 2093,
      labels: {
        primary: "?",
      },
    },
    {
      code: 2094,
      labels: {
        primary: "`",
      },
    },
    {
      code: 2095,
      labels: {
        primary: "È",
      },
    },
    {
      code: 2096,
      labels: {
        primary: "!",
      },
    },
    {
      code: 2097,
      labels: {
        primary: "£",
      },
    },
    {
      code: 2099,
      labels: {
        primary: "É",
      },
    },
    {
      code: 2100,
      labels: {
        primary: "À",
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

const gswCH = gswCHLetters.concat(gswCHModifierKeys);

const table = { keys: gswCH };
const tableWithoutModifier = { keys: gswCHLetters };

const gswCHCtrlTable = withModifiers(table, "Control +", "C+", 256);
const gswCHLAltTable = withModifiers(table, "Alt +", "A+", 512);
const gswCHRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const gswCHShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const gswCHGuiTable = withModifiers(table, "Os+", "O+", 4096);
// Double

const gswCHCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);

const gswCHCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);

const gswCHCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);

const gswCHCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);

const gswCHAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);

const gswCHASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);

const gswCHAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);

const gswCHAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);

const gswCHAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);

const gswCHSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const gswCHCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);

const gswCHCASTable = withModifiers(table, "Meh +", "Meh+", 2816);

const gswCHCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);

const gswCHCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);

const gswCHCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);

const gswCHCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);

const gswCHAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);

const gswCHAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);

const gswCHASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);

const gswCHAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const gswCHCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);

const gswCHCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);

const gswCHCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);

const gswCHAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);

const gswCHAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const gswCHModifiedTables = [
  shiftModifierSwissGerman,
  gswCHCtrlTable,
  gswCHLAltTable,
  gswCHRAltTable,
  gswCHShiftTable,
  gswCHGuiTable,
  gswCHCATable,
  altCtrlSwissGerman,
  altGrSwissGerman,
  gswCHCAGrTable,
  gswCHCSTable,
  gswCHCGTable,
  gswCHAAGrTable,
  gswCHASTable,
  gswCHAGTable,
  gswCHAGrSTable,
  gswCHAGrGTable,
  gswCHSGTable,
  gswCHCAAGTable,
  gswCHCASTable,
  gswCHCAGTable,
  gswCHCAGSTable,
  gswCHCAGGTable,
  gswCHCSGTable,
  gswCHAAGSTable,
  gswCHAAGGTable,
  gswCHASGTable,
  gswCHAGSGTable,
  gswCHCAAGrSTable,
  gswCHCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  gswCHCAGrSGTable,
  gswCHAAGrSGTable,
  gswCHAllModTable,
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

export { gswCH as default, gswCHModifiedTables };

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

const altCtrlBase = 768;
const altGrBase = 1024;
const shiftBase = 2048;

const enGBLetters = [];

const enGBModifierKeys = [
  // R4
  {
    code: 49,
    labels: {
      primary: "#",
    },
  },
  // R1
  {
    code: 100,
    labels: {
      primary: "\\",
    },
  },
];

const shiftModifier = {
  groupName: "Shifted British English",
  keys: [
    // R4
    {
      code: shiftBase + 53,
      labels: {
        primary: "¬",
      },
    },
    {
      code: shiftBase + 31,
      labels: {
        primary: '"',
      },
    },
    {
      code: shiftBase + 32,
      labels: {
        primary: "£",
      },
    },
    // R2
    {
      code: shiftBase + 52,
      labels: {
        primary: "@",
      },
    },
    {
      code: shiftBase + 49,
      labels: {
        primary: "~",
      },
    },
    // R1
    {
      code: shiftBase + 100,
      labels: {
        primary: "|",
      },
    },
  ],
};

const altCtrlModifier = {
  groupName: "AltCtrl British English",
  keys: [
    // R4
    {
      code: altCtrlBase + 53,
      labels: {
        primary: "¦",
      },
    },
    {
      code: altCtrlBase + 33,
      labels: {
        primary: "€",
      },
    },
    // R3
    {
      code: altCtrlBase + 8,
      labels: {
        primary: "É",
      },
    },
    {
      code: altCtrlBase + 24,
      labels: {
        primary: "Ú",
      },
    },
    {
      code: altCtrlBase + 12,
      labels: {
        primary: "Í",
      },
    },
    {
      code: altCtrlBase + 18,
      labels: {
        primary: "Ó",
      },
    },
    // R2
    {
      code: altCtrlBase + 4,
      labels: {
        primary: "Á",
      },
    },
  ],
};

const altGrModifier = {
  groupName: "AltGr British English",
  keys: [
    // R4
    {
      code: altGrBase + 53,
      labels: {
        primary: "¦",
      },
    },
    {
      code: altGrBase + 33,
      labels: {
        primary: "€",
      },
    },
    // R3
    {
      code: altGrBase + 8,
      labels: {
        primary: "É",
      },
    },
    {
      code: altGrBase + 24,
      labels: {
        primary: "Ú",
      },
    },
    {
      code: altGrBase + 12,
      labels: {
        primary: "Í",
      },
    },
    {
      code: altGrBase + 18,
      labels: {
        primary: "Ó",
      },
    },
    // R2
    {
      code: altGrBase + 4,
      labels: {
        primary: "Á",
      },
    },
  ],
};

const enGB = enGBLetters.concat(enGBModifierKeys);

const table = { keys: enGB };
const tableWithoutModifier = { keys: enGBLetters };

const enGBCtrlTable = withModifiers(table, "Control +", "C+", 256);
const enGBLAltTable = withModifiers(table, "Alt +", "A+", 512);
const enGBRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const enGBShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const enGBGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const enGBCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const enGBCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const enGBCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const enGBCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const enGBAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const enGBASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const enGBAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const enGBAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const enGBAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const enGBSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const enGBCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const enGBCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const enGBCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const enGBCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const enGBCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const enGBCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const enGBAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const enGBAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const enGBASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const enGBAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const enGBCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const enGBCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const enGBCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const enGBAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const enGBAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const enGBModifiedTables = [
  shiftModifier,
  enGBCtrlTable,
  enGBLAltTable,
  enGBRAltTable,
  enGBShiftTable,
  enGBGuiTable,
  enGBCATable,
  altCtrlModifier,
  altGrModifier,
  enGBCAGrTable,
  enGBCSTable,
  enGBCGTable,
  enGBAAGrTable,
  enGBASTable,
  enGBAGTable,
  enGBAGrSTable,
  enGBAGrGTable,
  enGBSGTable,
  enGBCAAGTable,
  enGBCASTable,
  enGBCAGTable,
  enGBCAGSTable,
  enGBCAGGTable,
  enGBCSGTable,
  enGBAAGSTable,
  enGBAAGGTable,
  enGBASGTable,
  enGBAGSGTable,
  enGBCAAGrSTable,
  enGBCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  enGBCAGrSGTable,
  enGBAAGrSGTable,
  enGBAllModTable,
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

export { enGB, enGBModifiedTables };

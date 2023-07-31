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

const eurkeyLetters = [];

const eurkeyModifierKeys = [];

// Control + Alt +
const CACode = 768;

// AltGr +
const RAltCode = 1024;

// AltGr + Shift +
const AGrSCode = 3072;

// Meh +
const CASCode = 2816;

function RAltLetters(baseCode) {
  return [
    {
      code: baseCode + 4,
      labels: {
        primary: "Ä",
      },
    },
    {
      code: baseCode + 5,
      labels: {
        primary: "Í",
      },
    },
    {
      code: baseCode + 6,
      labels: {
        primary: "Ç",
      },
    },
    {
      code: baseCode + 7,
      labels: {
        primary: "Đ",
      },
    },
    {
      code: baseCode + 8,
      labels: {
        primary: "Ë",
      },
    },
    {
      code: baseCode + 9,
      labels: {
        primary: "È",
      },
    },
    {
      code: baseCode + 10,
      labels: {
        primary: "É",
      },
    },
    {
      code: baseCode + 11,
      labels: {
        primary: "Ù",
      },
    },
    {
      code: baseCode + 12,
      labels: {
        primary: "Ï",
      },
    },
    {
      code: baseCode + 13,
      labels: {
        primary: "Ú",
      },
    },
    {
      code: baseCode + 14,
      labels: {
        primary: "Ĳ",
      },
    },
    {
      code: baseCode + 15,
      labels: {
        primary: "Ø",
      },
    },
    {
      code: baseCode + 17,
      labels: {
        primary: "Ñ",
      },
    },
    {
      code: baseCode + 18,
      labels: {
        primary: "Ö",
      },
    },
    {
      code: baseCode + 19,
      labels: {
        primary: "Œ",
      },
    },
    {
      code: baseCode + 20,
      labels: {
        primary: "Æ",
      },
    },
    {
      code: baseCode + 21,
      labels: {
        primary: "Ý",
      },
    },
    {
      code: baseCode + 22,
      labels: {
        primary: "ẞ",
      },
    },
    {
      code: baseCode + 23,
      labels: {
        primary: "Þ",
      },
    },
    {
      code: baseCode + 24,
      labels: {
        primary: "Ü",
      },
    },
    {
      code: baseCode + 25,
      labels: {
        primary: "Ì",
      },
    },
    {
      code: baseCode + 26,
      labels: {
        primary: "Å",
      },
    },
    {
      code: baseCode + 27,
      labels: {
        primary: "Á",
      },
    },
    {
      code: baseCode + 28,
      labels: {
        primary: "Ÿ",
      },
    },
    {
      code: baseCode + 29,
      labels: {
        primary: "À",
      },
    },
  ];
};

function RAltSymbols(baseCode) {
  return [
    {
      code: baseCode + 16,
      labels: {
        primary: "α",
      },
    },
  ];
};

function AGrSSymbols(baseCode) {
  return [
    {
      code: baseCode + 16,
      labels: {
        primary: "√",
      },
    },
  ];
};

const eurkeyCATableMod = {
  groupName: "CtrlAlt Eurkey",
  keys: RAltLetters(CACode).concat(RAltSymbols(CACode)),
};

const eurkeyRAltTableMod = {
  groupName: "AltGr Eurkey",
  keys: RAltLetters(RAltCode).concat(RAltSymbols(RAltCode)),
};

const eurkeyAGrSTableMod = {
  groupName: "AltGrShift Eurkey",
  keys: RAltLetters(AGrSCode).concat(AGrSSymbols(AGrSCode)),
};

const eurkeyCASTableMod = {
  groupName: "Meh Eurkey",
  keys: RAltLetters(CASCode).concat(AGrSSymbols(CASCode)),
}

const eurkey = eurkeyLetters.concat(eurkeyModifierKeys);

const table = { keys: eurkey };
const tableWithoutModifier = { keys: eurkeyLetters };

const eurkeyCtrlTable = withModifiers(table, "Control +", "C+", 256);
const eurkeyLAltTable = withModifiers(table, "Alt +", "A+", 512);
const eurkeyRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const eurkeyShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const eurkeyGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const eurkeyCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const eurkeyCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const eurkeyCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const eurkeyCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const eurkeyAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const eurkeyASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const eurkeyAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const eurkeyAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const eurkeyAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const eurkeySGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const eurkeyCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const eurkeyCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const eurkeyCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const eurkeyCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const eurkeyCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const eurkeyCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const eurkeyAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const eurkeyAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const eurkeyASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const eurkeyAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const eurkeyCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const eurkeyCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const eurkeyCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const eurkeyAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const eurkeyAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const eurkeyModifiedTables = [
  eurkeyCtrlTable,
  eurkeyLAltTable,
  eurkeyRAltTable,
  eurkeyRAltTableMod,
  eurkeyShiftTable,
  eurkeyGuiTable,
  eurkeyCATable,
  eurkeyCATableMod,
  eurkeyCAGrTable,
  eurkeyCSTable,
  eurkeyCGTable,
  eurkeyAAGrTable,
  eurkeyASTable,
  eurkeyAGTable,
  eurkeyAGrSTable,
  eurkeyAGrSTableMod,
  eurkeyAGrGTable,
  eurkeySGTable,
  eurkeyCAAGTable,
  eurkeyCASTable,
  eurkeyCASTableMod,
  eurkeyCAGTable,
  eurkeyCAGSTable,
  eurkeyCAGGTable,
  eurkeyCSGTable,
  eurkeyAAGSTable,
  eurkeyAAGGTable,
  eurkeyASGTable,
  eurkeyAGSGTable,
  eurkeyCAAGrSTable,
  eurkeyCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  eurkeyCAGrSGTable,
  eurkeyAAGrSGTable,
  eurkeyAllModTable,
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
  DualUseLayer8Tables
];

export { eurkey as default, eurkeyModifiedTables };
// export default eurkey;

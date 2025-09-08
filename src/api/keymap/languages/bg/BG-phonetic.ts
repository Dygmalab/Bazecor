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

import { ModifierCodes, withModifiers } from "../../db/utils";
import { BaseKeycodeTableType, KeymapCodeTableType } from "../../types";

const bgBGphoneticLetters: KeymapCodeTableType[] = [
  // Letters row 1
  {
    code: 20,
    labels: {
      primary: "Я",
    },
    newGroupName: "Letters",
  },
  {
    code: 26,
    labels: {
      primary: "В",
    },
    newGroupName: "Letters",
  },
  {
    code: 8,
    labels: {
      primary: "Е",
    },
    newGroupName: "Letters",
  },
  {
    code: 21,
    labels: {
      primary: "Р",
    },
    newGroupName: "Letters",
  },
  {
    code: 23,
    labels: {
      primary: "Т",
    },
    newGroupName: "Letters",
  },
  {
    code: 28,
    labels: {
      primary: "Ъ",
    },
    newGroupName: "Letters",
  },
  {
    code: 24,
    labels: {
      primary: "У",
    },
    newGroupName: "Letters",
  },
  {
    code: 12,
    labels: {
      primary: "И",
    },
    newGroupName: "Letters",
  },
  {
    code: 18,
    labels: {
      primary: "О",
    },
    newGroupName: "Letters",
  },
  {
    code: 19,
    labels: {
      primary: "П",
    },
    newGroupName: "Letters",
  },
  {
    code: 47,
    labels: {
      primary: "Ш",
    },
    newGroupName: "Letters",
  },
  {
    code: 48,
    labels: {
      primary: "Щ",
    },
    newGroupName: "Letters",
  },
  // Letters row 2
  {
    code: 4,
    labels: {
      primary: "А",
    },
    newGroupName: "Letters",
  },
  {
    code: 22,
    labels: {
      primary: "С",
    },
    newGroupName: "Letters",
  },
  {
    code: 7,
    labels: {
      primary: "Д",
    },
    newGroupName: "Letters",
  },
  {
    code: 9,
    labels: {
      primary: "Ф",
    },
    newGroupName: "Letters",
  },
  {
    code: 10,
    labels: {
      primary: "Г",
    },
    newGroupName: "Letters",
  },
  {
    code: 11,
    labels: {
      primary: "Х",
    },
    newGroupName: "Letters",
  },
  {
    code: 13,
    labels: {
      primary: "Й",
    },
    newGroupName: "Letters",
  },
  {
    code: 14,
    labels: {
      primary: "К",
    },
    newGroupName: "Letters",
  },
  {
    code: 15,
    labels: {
      primary: "Л",
    },
    newGroupName: "Letters",
  },
  {
    code: 49,
    labels: {
      primary: "Ю",
    },
    newGroupName: "Letters",
  },
  // Letters row 3
  {
    code: 29,
    labels: {
      primary: "З",
    },
    newGroupName: "Letters",
  },
  {
    code: 27,
    labels: {
      primary: "ь",
    },
    newGroupName: "Letters",
  },
  {
    code: 6,
    labels: {
      primary: "Ц",
    },
    newGroupName: "Letters",
  },
  {
    code: 25,
    labels: {
      primary: "Ж",
    },
    newGroupName: "Letters",
  },
  {
    code: 5,
    labels: {
      primary: "Б",
    },
    newGroupName: "Letters",
  },
  {
    code: 17,
    labels: {
      primary: "Н",
    },
    newGroupName: "Letters",
  },
  {
    code: 16,
    labels: {
      primary: "М",
    },
    newGroupName: "Letters",
  },
];

const bgBGphoneticModifierKeys: KeymapCodeTableType[] = [
  // Number row
  {
    code: 53,
    labels: {
      primary: "ч",
    },
  },
  {
    code: 30,
    labels: {
      primary: "1",
    },
  },
  {
    code: 31,
    labels: {
      primary: "2",
    },
  },
  {
    code: 32,
    labels: {
      primary: "3",
    },
  },
  {
    code: 33,
    labels: {
      primary: "4",
    },
  },
  {
    code: 34,
    labels: {
      primary: "5",
    },
  },
  {
    code: 35,
    labels: {
      primary: "6",
    },
  },
  {
    code: 36,
    labels: {
      primary: "7",
    },
  },
  {
    code: 37,
    labels: {
      primary: "8",
    },
  },
  {
    code: 38,
    labels: {
      primary: "9",
    },
  },
  {
    code: 39,
    labels: {
      primary: "0",
    },
  },
  {
    code: 45,
    labels: {
      primary: "-",
    },
  },
  {
    code: 46,
    labels: {
      primary: "=",
    },
  },
  // Symbols with shifted variants
  {
    code: 51,
    labels: {
      primary: ";",
    },
  },
  {
    code: 52,
    labels: {
      primary: '"',
    },
  },
  {
    code: 54,
    labels: {
      primary: ",",
    },
  },
  {
    code: 55,
    labels: {
      primary: ".",
    },
  },
  {
    code: 56,
    labels: {
      primary: "/",
    },
  },
];

const shiftModifierBulgarianPhonetic: BaseKeycodeTableType = {
  groupName: "Shifted Bulgarian Phonetic",
  keys: [
    // Row 1 - Numbers with shifted symbols
    {
      code: ModifierCodes.SHIFT + 53,
      labels: {
        primary: "Ч",
      },
    },
    {
      code: ModifierCodes.SHIFT + 30,
      labels: {
        primary: "!",
      },
    },
    {
      code: ModifierCodes.SHIFT + 31,
      labels: {
        primary: "@",
      },
    },
    {
      code: ModifierCodes.SHIFT + 32,
      labels: {
        primary: "№",
      },
    },
    {
      code: ModifierCodes.SHIFT + 33,
      labels: {
        primary: "$",
      },
    },
    {
      code: ModifierCodes.SHIFT + 34,
      labels: {
        primary: "%",
      },
    },
    {
      code: ModifierCodes.SHIFT + 35,
      labels: {
        primary: "€",
      },
    },
    {
      code: ModifierCodes.SHIFT + 36,
      labels: {
        primary: "§",
      },
    },
    {
      code: ModifierCodes.SHIFT + 37,
      labels: {
        primary: "*",
      },
    },
    {
      code: ModifierCodes.SHIFT + 38,
      labels: {
        primary: "(",
      },
    },
    {
      code: ModifierCodes.SHIFT + 39,
      labels: {
        primary: ")",
      },
    },
    {
      code: ModifierCodes.SHIFT + 45,
      labels: {
        primary: "_",
      },
    },
    {
      code: ModifierCodes.SHIFT + 46,
      labels: {
        primary: "+",
      },
    },
    // Symbols with shifted variants
    {
      code: ModifierCodes.SHIFT + 51,
      labels: {
        primary: ":",
      },
    },
    {
      code: ModifierCodes.SHIFT + 52,
      labels: {
        primary: '"',
      },
    },
    {
      code: ModifierCodes.SHIFT + 54,
      labels: {
        primary: "<",
      },
    },
    {
      code: ModifierCodes.SHIFT + 55,
      labels: {
        primary: ">",
      },
    },
    {
      code: ModifierCodes.SHIFT + 56,
      labels: {
        primary: "?",
      },
    },
  ],
};

const bgBGphonetic = bgBGphoneticLetters.concat(bgBGphoneticModifierKeys);

const table: BaseKeycodeTableType = { keys: bgBGphonetic, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: bgBGphoneticLetters, groupName: "" };

const bgBGphoneticCtrlTable = withModifiers(table, "Control +", "C+", 256);
const bgBGphoneticLAltTable = withModifiers(table, "Alt +", "A+", 512);
const bgBGphoneticRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const bgBGphoneticShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const bgBGphoneticGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const bgBGphoneticCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const bgBGphoneticCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const bgBGphoneticCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const bgBGphoneticCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const bgBGphoneticAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const bgBGphoneticASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const bgBGphoneticAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const bgBGphoneticAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const bgBGphoneticAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const bgBGphoneticSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const bgBGphoneticCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const bgBGphoneticCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const bgBGphoneticCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const bgBGphoneticCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const bgBGphoneticCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const bgBGphoneticCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const bgBGphoneticAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const bgBGphoneticAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const bgBGphoneticASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const bgBGphoneticAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const bgBGphoneticCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const bgBGphoneticCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const bgBGphoneticCAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const bgBGphoneticAAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const bgBGphoneticAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const bgBGphoneticModifiedTables = [
  shiftModifierBulgarianPhonetic,
  bgBGphoneticCtrlTable,
  bgBGphoneticLAltTable,
  bgBGphoneticRAltTable,
  bgBGphoneticShiftTable,
  bgBGphoneticGuiTable,
  bgBGphoneticCATable,
  bgBGphoneticCAGrTable,
  bgBGphoneticCSTable,
  bgBGphoneticCGTable,
  bgBGphoneticAAGrTable,
  bgBGphoneticASTable,
  bgBGphoneticAGTable,
  bgBGphoneticAGrSTable,
  bgBGphoneticAGrGTable,
  bgBGphoneticSGTable,
  bgBGphoneticCAAGTable,
  bgBGphoneticCASTable,
  bgBGphoneticCAGTable,
  bgBGphoneticCAGSTable,
  bgBGphoneticCAGGTable,
  bgBGphoneticCSGTable,
  bgBGphoneticAAGSTable,
  bgBGphoneticAAGGTable,
  bgBGphoneticASGTable,
  bgBGphoneticAGSGTable,
  bgBGphoneticCAAGrSTable,
  bgBGphoneticCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  bgBGphoneticCAGrSGTable,
  bgBGphoneticAAGrSGTable,
  bgBGphoneticAllModTable,
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

export { bgBGphonetic, bgBGphoneticModifiedTables };

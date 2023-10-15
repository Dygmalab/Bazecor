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
import LetterTable from "../../db/letters";

const Letters = [
  {
    code: 4,
    labels: {
      primary: "a",
    },
  },
  {
    code: 5,
    labels: {
      primary: "b",
    },
  },
  {
    code: 6,
    labels: {
      primary: "c",
    },
  },
  {
    code: 7,
    labels: {
      primary: "d",
    },
  },
  {
    code: 8,
    labels: {
      primary: "e",
    },
  },
  {
    code: 9,
    labels: {
      primary: "f",
    },
  },
  {
    code: 10,
    labels: {
      primary: "g",
    },
  },
  {
    code: 11,
    labels: {
      primary: "h",
    },
  },
  {
    code: 12,
    labels: {
      primary: "i",
    },
  },
  {
    code: 13,
    labels: {
      primary: "j",
    },
  },
  {
    code: 14,
    labels: {
      primary: "k",
    },
  },
  {
    code: 15,
    labels: {
      primary: "l",
    },
  },
  {
    code: 16,
    labels: {
      primary: "m",
    },
  },
  {
    code: 17,
    labels: {
      primary: "n",
    },
  },
  {
    code: 18,
    labels: {
      primary: "o",
    },
  },
  {
    code: 19,
    labels: {
      primary: "p",
    },
  },
  {
    code: 20,
    labels: {
      primary: "q",
    },
  },
  {
    code: 21,
    labels: {
      primary: "r",
    },
  },
  {
    code: 22,
    labels: {
      primary: "s",
    },
  },
  {
    code: 23,
    labels: {
      primary: "t",
    },
  },
  {
    code: 24,
    labels: {
      primary: "u",
    },
  },
  {
    code: 25,
    labels: {
      primary: "v",
    },
  },
  {
    code: 26,
    labels: {
      primary: "w",
    },
  },
  {
    code: 27,
    labels: {
      primary: "x",
    },
  },
  {
    code: 28,
    labels: {
      primary: "y",
    },
  },
  {
    code: 29,
    labels: {
      primary: "z",
    },
  },
];

const AGrLetters = [
  {
    code: 4,
    labels: {
      primary: "ä",
    },
  },
  {
    code: 5,
    labels: {
      primary: "í",
    },
  },
  {
    code: 6,
    labels: {
      primary: "ç",
    },
  },
  {
    code: 7,
    labels: {
      primary: "đ",
    },
  },
  {
    code: 8,
    labels: {
      primary: "ë",
    },
  },
  {
    code: 9,
    labels: {
      primary: "è",
    },
  },
  {
    code: 10,
    labels: {
      primary: "é",
    },
  },
  {
    code: 11,
    labels: {
      primary: "ù",
    },
  },
  {
    code: 12,
    labels: {
      primary: "ï",
    },
  },
  {
    code: 13,
    labels: {
      primary: "ú",
    },
  },
  {
    code: 14,
    labels: {
      primary: "ĳ",
    },
  },
  {
    code: 15,
    labels: {
      primary: "ø",
    },
  },
  {
    code: 17,
    labels: {
      primary: "ñ",
    },
  },
  {
    code: 18,
    labels: {
      primary: "ö",
    },
  },
  {
    code: 19,
    labels: {
      primary: "œ",
    },
  },
  {
    code: 20,
    labels: {
      primary: "æ",
    },
  },
  {
    code: 21,
    labels: {
      primary: "ý",
    },
  },
  {
    code: 22,
    labels: {
      primary: "ß",
    },
  },
  {
    code: 23,
    labels: {
      primary: "þ",
    },
  },
  {
    code: 24,
    labels: {
      primary: "ü",
    },
  },
  {
    code: 25,
    labels: {
      primary: "ì",
    },
  },
  {
    code: 26,
    labels: {
      primary: "å",
    },
  },
  {
    code: 27,
    labels: {
      primary: "á",
    },
  },
  {
    code: 28,
    labels: {
      primary: "ÿ",
    },
  },
  {
    code: 29,
    labels: {
      primary: "à",
    },
  },
];

const AGrSLetters = [
  {
    code: 4,
    labels: {
      primary: "Ä",
    },
  },
  {
    code: 5,
    labels: {
      primary: "Í",
    },
  },
  {
    code: 6,
    labels: {
      primary: "Ç",
    },
  },
  {
    code: 7,
    labels: {
      primary: "Đ",
    },
  },
  {
    code: 8,
    labels: {
      primary: "Ë",
    },
  },
  {
    code: 9,
    labels: {
      primary: "È",
    },
  },
  {
    code: 10,
    labels: {
      primary: "É",
    },
  },
  {
    code: 11,
    labels: {
      primary: "Ù",
    },
  },
  {
    code: 12,
    labels: {
      primary: "Ï",
    },
  },
  {
    code: 13,
    labels: {
      primary: "Ú",
    },
  },
  {
    code: 14,
    labels: {
      primary: "Ĳ",
    },
  },
  {
    code: 15,
    labels: {
      primary: "Ø",
    },
  },
  {
    code: 17,
    labels: {
      primary: "Ñ",
    },
  },
  {
    code: 18,
    labels: {
      primary: "Ö",
    },
  },
  {
    code: 19,
    labels: {
      primary: "Œ",
    },
  },
  {
    code: 20,
    labels: {
      primary: "Æ",
    },
  },
  {
    code: 21,
    labels: {
      primary: "Ý",
    },
  },
  {
    code: 22,
    labels: {
      primary: "ẞ",
    },
  },
  {
    code: 23,
    labels: {
      primary: "Þ",
    },
  },
  {
    code: 24,
    labels: {
      primary: "Ü",
    },
  },
  {
    code: 25,
    labels: {
      primary: "Ì",
    },
  },
  {
    code: 26,
    labels: {
      primary: "Å",
    },
  },
  {
    code: 27,
    labels: {
      primary: "Á",
    },
  },
  {
    code: 28,
    labels: {
      primary: "Ÿ",
    },
  },
  {
    code: 29,
    labels: {
      primary: "À",
    },
  },
];

const AGSymbols = [
  {
    code: 53,
    labels: {
      primary: "`",
    },
  },
  {
    code: 30,
    labels: {
      primary: "¡",
    },
  },
  {
    code: 31,
    labels: {
      primary: "ª",
    },
  },
  {
    code: 32,
    labels: {
      primary: "º",
    },
  },
  {
    code: 33,
    labels: {
      primary: "£",
    },
  },
  {
    code: 34,
    labels: {
      primary: "€",
    },
  },
  {
    code: 35,
    labels: {
      primary: "^",
    },
  },
  {
    code: 36,
    labels: {
      primary: "˚",
    },
  },
  {
    code: 37,
    labels: {
      primary: "„",
    },
  },
  {
    code: 38,
    labels: {
      primary: "“",
    },
  },
  {
    code: 39,
    labels: {
      primary: "”",
    },
  },
  {
    code: 45,
    labels: {
      primary: "✓",
    },
  },
  {
    code: 46,
    labels: {
      primary: "×",
    },
  },
  {
    code: 47,
    labels: {
      primary: "«",
    },
  },
  {
    code: 48,
    labels: {
      primary: "»",
    },
  },
  {
    code: 49,
    labels: {
      primary: "¬",
    },
  },
  {
    code: 51,
    labels: {
      primary: "°",
    },
  },
  {
    code: 52,
    labels: {
      primary: "´",
    },
  },
  {
    code: 16,
    labels: {
      primary: "α",
    },
  },
  {
    code: 54,
    labels: {
      primary: "ò",
    },
  },
  {
    code: 55,
    labels: {
      primary: "ó",
    },
  },
  {
    code: 56,
    labels: {
      primary: "¿",
    },
  },
];

const AGrSSymbols = [
  {
    code: 53,
    labels: {
      primary: "~",
    },
  },
  {
    code: 30,
    labels: {
      primary: "¹",
    },
  },
  {
    code: 31,
    labels: {
      primary: "²",
    },
  },
  {
    code: 32,
    labels: {
      primary: "³",
    },
  },
  {
    code: 33,
    labels: {
      primary: "¥",
    },
  },
  {
    code: 34,
    labels: {
      primary: "¢",
    },
  },
  {
    code: 35,
    labels: {
      primary: "ˇ",
    },
  },
  {
    code: 36,
    labels: {
      primary: "¯",
    },
  },
  {
    code: 37,
    labels: {
      primary: "‚",
    },
  },
  {
    code: 38,
    labels: {
      primary: "‘",
    },
  },
  {
    code: 39,
    labels: {
      primary: "’",
    },
  },
  {
    code: 45,
    labels: {
      primary: "✗",
    },
  },
  {
    code: 46,
    labels: {
      primary: "÷",
    },
  },
  {
    code: 47,
    labels: {
      primary: "‹",
    },
  },
  {
    code: 48,
    labels: {
      primary: "›",
    },
  },
  {
    code: 49,
    labels: {
      primary: "¦",
    },
  },
  {
    code: 51,
    labels: {
      primary: "·",
    },
  },
  {
    code: 52,
    labels: {
      primary: "¨",
    },
  },
  {
    code: 16,
    labels: {
      primary: "√",
    },
  },
  {
    code: 54,
    labels: {
      primary: "Ò",
    },
  },
  {
    code: 55,
    labels: {
      primary: "Ó",
    },
  },
  {
    code: 56,
    labels: {
      primary: "…",
    },
  },
];

const enXXeurkey = Letters;

const table = { keys: enXXeurkey };
const tableS = { keys: LetterTable.keys };

const tableAGr = {
  groupName: "AltGr Eurkey",
  keys: AGrLetters.concat(AGSymbols),
};

const tableAGrS = {
  groupName: "AltGrShift Eurkey",
  keys: AGrSLetters.concat(AGrSSymbols),
};

const enXXeurkeyCtrlTable = withModifiers(table, "Control +", "C+", 256);
const enXXeurkeyLAltTable = withModifiers(table, "Alt +", "A+", 512);
const enXXeurkeyRAltTable = withModifiers(tableAGr, "AltGr +", "AGr+", 1024);
const enXXeurkeyShiftTable = withModifiers(tableS, "Shift +", "S+", 2048);
const enXXeurkeyGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const enXXeurkeyCATable = withModifiers(tableAGr, "Control + Alt +", "C+A+", 768);
const enXXeurkeyCAGrTable = withModifiers(tableAGr, "Control + AltGr +", "C+AGr+", 1280);
const enXXeurkeyCSTable = withModifiers(tableS, "Control + Shift +", "C+S+", 2304);
const enXXeurkeyCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const enXXeurkeyAAGrTable = withModifiers(tableAGr, "Alt + AltGr +", "A+AGr+", 1536);
const enXXeurkeyASTable = withModifiers(tableS, "Alt + Shift +", "A+S+", 2560);
const enXXeurkeyAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const enXXeurkeyAGrSTable = withModifiers(tableAGrS, "AltGr + Shift +", "AGr+S+", 3072);
const enXXeurkeyAGrGTable = withModifiers(tableAGr, "AltGr + Os +", "AGr+O+", 5120);
const enXXeurkeySGTable = withModifiers(tableS, "Shift + Os +", "S+O+", 6144);

// Triple

const enXXeurkeyCAAGTable = withModifiers(tableAGr, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const enXXeurkeyCASTable = withModifiers(tableAGrS, "Meh +", "Meh+", 2816);
const enXXeurkeyCAGTable = withModifiers(tableAGr, "Control + Alt + Os +", "C+A+O+", 4864);
const enXXeurkeyCAGSTable = withModifiers(tableAGrS, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const enXXeurkeyCAGGTable = withModifiers(tableAGr, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const enXXeurkeyCSGTable = withModifiers(tableS, "Control + Shift + Os +", "C+S+O+", 6400);
const enXXeurkeyAAGSTable = withModifiers(tableAGrS, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const enXXeurkeyAAGGTable = withModifiers(tableAGr, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const enXXeurkeyASGTable = withModifiers(tableS, "Alt + Shift + Os +", "A+S+O+", 6656);
const enXXeurkeyAGSGTable = withModifiers(tableAGrS, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const enXXeurkeyCAAGrSTable = withModifiers(tableAGrS, "Meh + AltGr +", "M+AGr+", 3840);
const enXXeurkeyCAAGrGTable = withModifiers(tableAGr, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const enXXeurkeyCAGrSGTable = withModifiers(tableAGrS, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const enXXeurkeyAAGrSGTable = withModifiers(tableAGrS, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const enXXeurkeyAllModTable = withModifiers(tableAGrS, "Hyper + AltGr +", "H+AGr+", 7936);

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

const enXXeurkeyModifiedTables = [
  enXXeurkeyCtrlTable,
  enXXeurkeyLAltTable,
  enXXeurkeyRAltTable,
  enXXeurkeyShiftTable,
  enXXeurkeyGuiTable,
  enXXeurkeyCATable,
  enXXeurkeyCAGrTable,
  enXXeurkeyCSTable,
  enXXeurkeyCGTable,
  enXXeurkeyAAGrTable,
  enXXeurkeyASTable,
  enXXeurkeyAGTable,
  enXXeurkeyAGrSTable,
  enXXeurkeyAGrGTable,
  enXXeurkeySGTable,
  enXXeurkeyCAAGTable,
  enXXeurkeyCASTable,
  enXXeurkeyCAGTable,
  enXXeurkeyCAGSTable,
  enXXeurkeyCAGGTable,
  enXXeurkeyCSGTable,
  enXXeurkeyAAGSTable,
  enXXeurkeyAAGGTable,
  enXXeurkeyASGTable,
  enXXeurkeyAGSGTable,
  enXXeurkeyCAAGrSTable,
  enXXeurkeyCAAGrGTable,
  withModifiers(tableAGrS, "Hyper +", "Hyper+", 6912),
  enXXeurkeyCAGrSGTable,
  enXXeurkeyAAGrSGTable,
  enXXeurkeyAllModTable,
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

export { enXXeurkey, enXXeurkeyModifiedTables };

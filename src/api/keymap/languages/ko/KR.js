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

const koKRLetters = [
  {
    code: 144,
    labels: {
      primary: "한/영",
      verbose: "한/영",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 145,
    labels: {
      primary: "한자",
      verbose: "한자",
    },
    newGroupName: "Punctuation",
  },
];

const koKRModifierKeys = [];

const altCtrlKorean = {
  groupName: "AltCtrl Korean",
  keys: [],
};

const altGRKorean = {
  groupName: "AltCtrl Korean",
  keys: [],
};

const shiftModifierKorean = {
  groupName: "Shifted Korean",
  keys: [],
};

const koKR = koKRLetters.concat(koKRModifierKeys);

const table = { keys: koKR };
const tableWithoutModifier = { keys: koKRLetters };

const koKRCtrlTable = withModifiers(table, "Control +", "C+", 256);
const koKRLAltTable = withModifiers(table, "Alt +", "A+", 512);
const koKRRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const koKRShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const koKRGuiTable = withModifiers(table, "Gui +", "G+", 4096);
// Double

const koKRCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);

const koKRCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);

const koKRCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);

const koKRCGTable = withModifiers(table, "Control + Gui +", "C+G+", 4352);

const koKRAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);

const koKRASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);

const koKRAGTable = withModifiers(table, "Alt + Gui +", "A+G+", 4608);

const koKRAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);

const koKRAGrGTable = withModifiers(table, "AltGr + Gui +", "AGr+G+", 5120);

const koKRSGTable = withModifiers(table, "Shift + Gui +", "S+G+", 6144);

// Triple

const koKRCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);

const koKRCASTable = withModifiers(table, "Meh +", "Meh+", 2816);

const koKRCAGTable = withModifiers(table, "Control + Alt + Gui +", "C+A+G+", 4864);

const koKRCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);

const koKRCAGGTable = withModifiers(table, "Control + AltGr + Gui +", "C+AGr+G+", 5376);

const koKRCSGTable = withModifiers(table, "Control + Shift + Gui +", "C+S+G+", 6400);

const koKRAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);

const koKRAAGGTable = withModifiers(table, "Alt + AltGr + Gui +", "A+AGr+G+", 5632);

const koKRASGTable = withModifiers(table, "Alt + Shift + Gui +", "A+S+G+", 6656);

const koKRAGSGTable = withModifiers(table, "AltGr + Shift + Gui +", "AGr+S+G+", 7168);

// Quad

const koKRCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);

const koKRCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Gui +", "C+A+AGr+G+", 5888);

const koKRAAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Gui +", "C+AGr+S+G+", 7424);

const koKRCAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Gui +", "A+AGr+S+G+", 7680);

const koKRAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

const DualUseCtrlTable = withModifiers(table, "Control /", "CTRL/", 49169);
const DualUseShiftTable = withModifiers(table, "Shift /", "SHIFT/", 49425);
const DualUseAltTable = withModifiers(table, "Alt /", "ALT/", 49681);
const DualUseGuiTable = withModifiers(table, "Gui /", "GUI/", 49937);
const DualUseAltGrTable = withModifiers(table, "AltGr /", "ALTGR/", 50705);
const DualUseLayer1Tables = withModifiers(table, "Layer #1 /", "L#1/", 51218);
const DualUseLayer2Tables = withModifiers(table, "Layer #2 /", "L#2/", 51474);
const DualUseLayer3Tables = withModifiers(table, "Layer #3 /", "L#3/", 51730);
const DualUseLayer4Tables = withModifiers(table, "Layer #4 /", "L#4/", 51986);
const DualUseLayer5Tables = withModifiers(table, "Layer #5 /", "L#5/", 52242);
const DualUseLayer6Tables = withModifiers(table, "Layer #6 /", "L#6/", 52498);
const DualUseLayer7Tables = withModifiers(table, "Layer #7 /", "L#7/", 52754);
const DualUseLayer8Tables = withModifiers(table, "Layer #8 /", "L#8/", 53010);

const koKRModifiedTables = [
  koKRCtrlTable,
  koKRLAltTable,
  koKRRAltTable,
  koKRShiftTable,
  koKRGuiTable,
  koKRCATable,
  shiftModifierKorean,
  altCtrlKorean,
  altGRKorean,
  koKRCAGrTable,
  koKRCSTable,
  koKRCGTable,
  koKRAAGrTable,
  koKRASTable,
  koKRAGTable,
  koKRSGTable,
  koKRAGrSTable,
  koKRAGrGTable,
  koKRCAAGTable,
  koKRCASTable,
  koKRCAGTable,
  koKRCAGSTable,
  koKRCAGGTable,
  koKRCSGTable,
  koKRAAGSTable,
  koKRAAGGTable,
  koKRASGTable,
  koKRAGSGTable,
  koKRCAAGrSTable,
  koKRCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  koKRCAGrSGTable,
  koKRAAGrSGTable,
  koKRAllModTable,
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

export { koKR as default, koKRModifiedTables };

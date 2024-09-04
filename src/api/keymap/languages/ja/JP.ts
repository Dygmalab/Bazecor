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

const jaJPLetters: KeymapCodeTableType[] = [
  {
    code: 53,
    labels: {
      primary: "半角/全角 漢字",
    },
  },
  {
    code: 30,
    labels: {
      primary: "ぬ",
    },
    newGroupName: "Letters",
  },
  {
    code: 31,
    labels: {
      primary: "ふ",
    },
    newGroupName: "Letters",
  },
  {
    code: 32,
    labels: {
      primary: "あ",
    },
    newGroupName: "Letters",
  },
  {
    code: 33,
    labels: {
      primary: "う",
    },
    newGroupName: "Letters",
  },
  {
    code: 34,
    labels: {
      primary: "え",
    },
    newGroupName: "Letters",
  },
  {
    code: 35,
    labels: {
      primary: "お",
    },
    newGroupName: "Letters",
  },
  {
    code: 36,
    labels: {
      primary: "や",
    },
    newGroupName: "Letters",
  },
  {
    code: 37,
    labels: {
      primary: "ゆ",
    },
    newGroupName: "Letters",
  },
  {
    code: 38,
    labels: {
      primary: "よ",
    },
    newGroupName: "Letters",
  },
  {
    code: 39,
    labels: {
      primary: "わ",
    },
    newGroupName: "Letters",
  },
  {
    code: 45,
    labels: {
      primary: "ほ",
    },
  },
  {
    code: 46,
    labels: {
      primary: "へ",
    },
  },
  {
    code: 20,
    labels: {
      primary: "た",
    },
  },
  {
    code: 26,
    labels: {
      primary: "て",
    },
  },
  {
    code: 8,
    labels: {
      primary: "い",
    },
  },
  {
    code: 21,
    labels: {
      primary: "す",
    },
  },
  {
    code: 23,
    labels: {
      primary: "か",
    },
  },
  {
    code: 28,
    labels: {
      primary: "ん",
    },
  },
  {
    code: 24,
    labels: {
      primary: "な",
    },
  },
  {
    code: 12,
    labels: {
      primary: "に",
    },
  },
  {
    code: 18,
    labels: {
      primary: "ら",
    },
  },
  {
    code: 19,
    labels: {
      primary: "せ",
    },
  },
  {
    code: 49,
    labels: {
      primary: "む",
    },
    newGroupName: "Letters",
  },
  {
    code: 4,
    labels: {
      primary: "ち",
    },
  },
  {
    code: 22,
    labels: {
      primary: "と",
    },
  },
  {
    code: 7,
    labels: {
      primary: "し",
    },
  },
  {
    code: 9,
    labels: {
      primary: "は",
    },
  },
  {
    code: 10,
    labels: {
      primary: "き",
    },
  },
  {
    code: 11,
    labels: {
      primary: "く",
    },
  },
  {
    code: 13,
    labels: {
      primary: "ま",
    },
  },
  {
    code: 14,
    labels: {
      primary: "の",
    },
  },
  {
    code: 15,
    labels: {
      primary: "り",
    },
  },
  {
    code: 51,
    labels: {
      primary: "れ",
    },
  },
  {
    code: 52,
    labels: {
      primary: "け",
    },
  },
  {
    code: 29,
    labels: {
      primary: "つ",
    },
  },
  {
    code: 27,
    labels: {
      primary: "さ",
    },
  },
  {
    code: 6,
    labels: {
      primary: "そ",
    },
  },
  {
    code: 25,
    labels: {
      primary: "ひ",
    },
  },
  {
    code: 5,
    labels: {
      primary: "こ",
    },
  },
  {
    code: 17,
    labels: {
      primary: "み",
    },
  },
  {
    code: 16,
    labels: {
      primary: "も",
    },
  },
  {
    code: 54,
    labels: {
      primary: "ね",
    },
  },
  {
    code: 55,
    labels: {
      primary: "る",
    },
  },
  {
    code: 56,
    labels: {
      primary: "め",
    },
  },
  {
    code: 135,
    labels: {
      primary: "\\ろ",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 136,
    labels: {
      primary: "Hiragana",
      verbose: "カタカナ/ひらがな/ローマ字",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 137,
    labels: {
      primary: "¥",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 138,
    labels: {
      primary: "変換",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 139,
    labels: {
      primary: "無変換",
    },
    newGroupName: "Punctuation",
  },
];

const jaJPModifierKeys: KeymapCodeTableType[] = [
  {
    code: 47,
    labels: {
      primary: "゛",
    },
  },
  {
    code: 48,
    labels: {
      primary: "゜",
    },
  },
];

const altCtrlJapanese: BaseKeycodeTableType = {
  groupName: "AltCtrl Japanese",
  keys: [
    {
      code: 821,
      labels: {
        primary: "ロ",
      },
      alt: true,
    },
    {
      code: 798,
      labels: {
        primary: "ヌ",
      },
      alt: true,
    },
    {
      code: 799,
      labels: {
        primary: "フ",
      },
      alt: true,
    },
    {
      code: 800,
      labels: {
        primary: "ア",
      },
      alt: true,
    },
    {
      code: 801,
      labels: {
        primary: "ウ",
      },
      alt: true,
    },
    {
      code: 802,
      labels: {
        primary: "エ",
      },
      alt: true,
    },
    {
      code: 803,
      labels: {
        primary: "オ",
      },
      alt: true,
    },
    {
      code: 804,
      labels: {
        primary: "ヤ",
      },
      alt: true,
    },
    {
      code: 805,
      labels: {
        primary: "ユ",
      },
      alt: true,
    },
    {
      code: 806,
      labels: {
        primary: "ヨ",
      },
      alt: true,
    },
    {
      code: 807,
      labels: {
        primary: "ワ",
      },
      alt: true,
    },
    {
      code: 813,
      labels: {
        primary: "ホ",
      },
      alt: true,
    },
    {
      code: 814,
      labels: {
        primary: "ヘ",
      },
      alt: true,
    },
    {
      code: 788,
      labels: {
        primary: "タ",
      },
      alt: true,
    },
    {
      code: 794,
      labels: {
        primary: "テ",
      },
      alt: true,
    },
    {
      code: 776,
      labels: {
        primary: "イ",
      },
      alt: true,
    },
    {
      code: 789,
      labels: {
        primary: "ス",
      },
      alt: true,
    },
    {
      code: 791,
      labels: {
        primary: "カ",
      },
      alt: true,
    },
    {
      code: 796,
      labels: {
        primary: "ン",
      },
      alt: true,
    },
    {
      code: 792,
      labels: {
        primary: "ナ",
      },
      alt: true,
    },
    {
      code: 780,
      labels: {
        primary: "ニ",
      },
      alt: true,
    },
    {
      code: 786,
      labels: {
        primary: "ラ",
      },
      alt: true,
    },
    {
      code: 787,
      labels: {
        primary: "セ",
      },
      alt: true,
    },
    {
      code: 817,
      labels: {
        primary: "ム",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: 772,
      labels: {
        primary: "チ",
      },
      alt: true,
    },
    {
      code: 790,
      labels: {
        primary: "ト",
      },
      alt: true,
    },
    {
      code: 775,
      labels: {
        primary: "シ",
      },
      alt: true,
    },
    {
      code: 777,
      labels: {
        primary: "ハ",
      },
      alt: true,
    },
    {
      code: 778,
      labels: {
        primary: "キ",
      },
      alt: true,
    },
    {
      code: 779,
      labels: {
        primary: "ク",
      },
      alt: true,
    },
    {
      code: 781,
      labels: {
        primary: "マ",
      },
      alt: true,
    },
    {
      code: 782,
      labels: {
        primary: "ノ",
      },
      alt: true,
    },
    {
      code: 783,
      labels: {
        primary: "リ",
      },
      alt: true,
    },
    {
      code: 819,
      labels: {
        primary: "レ",
      },
      alt: true,
    },
    {
      code: 820,
      labels: {
        primary: "ケ",
      },
      alt: true,
    },
    {
      code: 797,
      labels: {
        primary: "ツ",
      },
      alt: true,
    },
    {
      code: 795,
      labels: {
        primary: "サ",
      },
      alt: true,
    },
    {
      code: 774,
      labels: {
        primary: "ソ",
      },
      alt: true,
    },
    {
      code: 793,
      labels: {
        primary: "ヒ",
      },
      alt: true,
    },
    {
      code: 773,
      labels: {
        primary: "コ",
      },
      alt: true,
    },
    {
      code: 785,
      labels: {
        primary: "ミ",
      },
      alt: true,
    },
    {
      code: 784,
      labels: {
        primary: "モ",
      },
      alt: true,
    },
    {
      code: 822,
      labels: {
        primary: "ネ",
      },
      alt: true,
    },
    {
      code: 823,
      labels: {
        primary: "ル",
      },
      alt: true,
    },
    {
      code: 824,
      labels: {
        primary: "メ",
      },
      alt: true,
    },
  ],
};

const altGRJapanese: BaseKeycodeTableType = {
  groupName: "AltCtrl Japanese",
  keys: [
    {
      code: 1077,
      labels: {
        primary: "ロ",
      },
      alt: true,
    },
    {
      code: 1054,
      labels: {
        primary: "ヌ",
      },
      alt: true,
    },
    {
      code: 1055,
      labels: {
        primary: "フ",
      },
      alt: true,
    },
    {
      code: 1056,
      labels: {
        primary: "ア",
      },
      alt: true,
    },
    {
      code: 1057,
      labels: {
        primary: "ウ",
      },
      alt: true,
    },
    {
      code: 1058,
      labels: {
        primary: "エ",
      },
      alt: true,
    },
    {
      code: 1059,
      labels: {
        primary: "オ",
      },
      alt: true,
    },
    {
      code: 1060,
      labels: {
        primary: "ヤ",
      },
      alt: true,
    },
    {
      code: 1061,
      labels: {
        primary: "ユ",
      },
      alt: true,
    },
    {
      code: 1062,
      labels: {
        primary: "ヨ",
      },
      alt: true,
    },
    {
      code: 1063,
      labels: {
        primary: "ワ",
      },
      alt: true,
    },
    {
      code: 1069,
      labels: {
        primary: "ホ",
      },
      alt: true,
    },
    {
      code: 1070,
      labels: {
        primary: "ヘ",
      },
      alt: true,
    },
    {
      code: 1044,
      labels: {
        primary: "タ",
      },
      alt: true,
    },
    {
      code: 1050,
      labels: {
        primary: "テ",
      },
      alt: true,
    },
    {
      code: 1032,
      labels: {
        primary: "イ",
      },
      alt: true,
    },
    {
      code: 1045,
      labels: {
        primary: "ス",
      },
      alt: true,
    },
    {
      code: 1047,
      labels: {
        primary: "カ",
      },
      alt: true,
    },
    {
      code: 1052,
      labels: {
        primary: "ン",
      },
      alt: true,
    },
    {
      code: 1048,
      labels: {
        primary: "ナ",
      },
      alt: true,
    },
    {
      code: 1036,
      labels: {
        primary: "ニ",
      },
      alt: true,
    },
    {
      code: 1042,
      labels: {
        primary: "ラ",
      },
      alt: true,
    },
    {
      code: 1043,
      labels: {
        primary: "セ",
      },
      alt: true,
    },
    {
      code: 1073,
      labels: {
        primary: "ム",
      },
      alt: true,
      newGroupName: "Letters",
    },
    {
      code: 1028,
      labels: {
        primary: "チ",
      },
      alt: true,
    },
    {
      code: 1046,
      labels: {
        primary: "ト",
      },
      alt: true,
    },
    {
      code: 1031,
      labels: {
        primary: "シ",
      },
      alt: true,
    },
    {
      code: 1033,
      labels: {
        primary: "ハ",
      },
      alt: true,
    },
    {
      code: 1034,
      labels: {
        primary: "キ",
      },
      alt: true,
    },
    {
      code: 1035,
      labels: {
        primary: "ク",
      },
      alt: true,
    },
    {
      code: 1037,
      labels: {
        primary: "マ",
      },
      alt: true,
    },
    {
      code: 1038,
      labels: {
        primary: "ノ",
      },
      alt: true,
    },
    {
      code: 1039,
      labels: {
        primary: "リ",
      },
      alt: true,
    },
    {
      code: 1075,
      labels: {
        primary: "レ",
      },
      alt: true,
    },
    {
      code: 1076,
      labels: {
        primary: "ケ",
      },
      alt: true,
    },
    {
      code: 1053,
      labels: {
        primary: "ツ",
      },
      alt: true,
    },
    {
      code: 1051,
      labels: {
        primary: "サ",
      },
      alt: true,
    },
    {
      code: 1030,
      labels: {
        primary: "ソ",
      },
      alt: true,
    },
    {
      code: 1049,
      labels: {
        primary: "ヒ",
      },
      alt: true,
    },
    {
      code: 1029,
      labels: {
        primary: "コ",
      },
      alt: true,
    },
    {
      code: 1041,
      labels: {
        primary: "ミ",
      },
      alt: true,
    },
    {
      code: 1040,
      labels: {
        primary: "モ",
      },
      alt: true,
    },
    {
      code: 1078,
      labels: {
        primary: "ネ",
      },
      alt: true,
    },
    {
      code: 1079,
      labels: {
        primary: "ル",
      },
      alt: true,
    },
    {
      code: 1080,
      labels: {
        primary: "メ",
      },
      alt: true,
    },
  ],
};

const shiftModifierJapanese: BaseKeycodeTableType = {
  groupName: "Shifted Japanese",
  keys: [
    {
      code: 2080,
      labels: {
        primary: "ぁ",
      },
      alt: true,
    },
    {
      code: 2081,
      labels: {
        primary: "ぅ",
      },
      alt: true,
    },
    {
      code: 2082,
      labels: {
        primary: "ぇ",
      },
      alt: true,
    },
    {
      code: 2083,
      labels: {
        primary: "ぉ",
      },
      alt: true,
    },
    {
      code: 2084,
      labels: {
        primary: "ゃ",
      },
      alt: true,
    },
    {
      code: 2085,
      labels: {
        primary: "ゅ",
      },
      alt: true,
    },
    {
      code: 2086,
      labels: {
        primary: "ょ",
      },
      alt: true,
    },
    {
      code: 2087,
      labels: {
        primary: "を",
      },
      alt: true,
    },
    {
      code: 2093,
      labels: {
        primary: "ー",
      },
      alt: true,
    },
    {
      code: 2056,
      labels: {
        primary: "ぃ",
      },
      alt: true,
    },
    {
      code: 2095,
      labels: {
        primary: "「",
      },
      alt: true,
    },
    {
      code: 2096,
      labels: {
        primary: "」",
      },
      alt: true,
    },
    {
      code: 2077,
      labels: {
        primary: "っ",
      },
      alt: true,
    },
    {
      code: 2102,
      labels: {
        primary: "、",
      },
      alt: true,
    },
    {
      code: 2103,
      labels: {
        primary: "。",
      },
      alt: true,
    },
    {
      code: 2104,
      labels: {
        primary: "・",
      },
      alt: true,
    },
  ],
};

const jaJP = jaJPLetters.concat(jaJPModifierKeys);

const table: BaseKeycodeTableType = { keys: jaJP, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: jaJPLetters, groupName: "" };

const jaJPCtrlTable = withModifiers(table, "Control +", "C+", 256);
const jaJPLAltTable = withModifiers(table, "Alt +", "A+", 512);
const jaJPRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const jaJPShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const jaJPGuiTable = withModifiers(table, "Os+", "O+", 4096);

// Double

const jaJPCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const jaJPCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const jaJPCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);
const jaJPCGTable = withModifiers(table, "Control + Os +", "C+O+", 4352);
const jaJPAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const jaJPASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);
const jaJPAGTable = withModifiers(table, "Alt + Os +", "A+O+", 4608);
const jaJPAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);
const jaJPAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+O+", 5120);
const jaJPSGTable = withModifiers(table, "Shift + Os +", "S+O+", 6144);

// Triple

const jaJPCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const jaJPCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const jaJPCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+O+", 4864);
const jaJPCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);
const jaJPCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+O+", 5376);
const jaJPCSGTable = withModifiers(table, "Control + Shift + Os +", "C+S+O+", 6400);
const jaJPAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);
const jaJPAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+O+", 5632);
const jaJPASGTable = withModifiers(table, "Alt + Shift + Os +", "A+S+O+", 6656);
const jaJPAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+S+O+", 7168);

// Quad

const jaJPCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const jaJPCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888);
const jaJPAAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424);
const jaJPCAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680);
const jaJPAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const jaJPModifiedTables = [
  jaJPCtrlTable,
  jaJPLAltTable,
  jaJPRAltTable,
  jaJPShiftTable,
  jaJPGuiTable,
  jaJPCATable,
  shiftModifierJapanese,
  altCtrlJapanese,
  altGRJapanese,
  jaJPCAGrTable,
  jaJPCSTable,
  jaJPCGTable,
  jaJPAAGrTable,
  jaJPASTable,
  jaJPAGTable,
  jaJPSGTable,
  jaJPAGrSTable,
  jaJPAGrGTable,
  jaJPCAAGTable,
  jaJPCASTable,
  jaJPCAGTable,
  jaJPCAGSTable,
  jaJPCAGGTable,
  jaJPCSGTable,
  jaJPAAGSTable,
  jaJPAAGGTable,
  jaJPASGTable,
  jaJPAGSGTable,
  jaJPCAAGrSTable,
  jaJPCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  jaJPCAGrSGTable,
  jaJPAAGrSGTable,
  jaJPAllModTable,
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

export { jaJP, jaJPModifiedTables };

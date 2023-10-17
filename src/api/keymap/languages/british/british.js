import { withModifiers } from "../../db/utils";

const britishLetters = [];
const altGRBritish = {
  groupName: "AltGR British",
  keys: [
    {
      code: 1077,
      labels: {
        primary: "¦",
      },
    },
    {
      code: 1057,
      labels: {
        primary: "€",
      },
    },
    {
      code: 1028,
      labels: {
        primary: "Á",
      },
    },
    {
      code: 1032,
      labels: {
        primary: "É",
      },
    },
    {
      code: 1048,
      labels: {
        primary: "Ú",
      },
    },
    {
      code: 1036,
      labels: {
        primary: "Í",
      },
    },
    {
      code: 1042,
      labels: {
        primary: "Ó",
      },
    },
  ],
};

const britishModifierKeys = [
  {
    code: 100,
    labels: {
      primary: "\\",
    },
  },
  {
    code: 56,
    labels: {
      primary: "/",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 51,
    labels: {
      primary: ";",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 52,
    labels: {
      primary: "'",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 49,
    labels: {
      primary: "#",
    },
    newGroupName: "Punctuation",
  },
  {
    code: 53,
    labels: {
      primary: "`",
    },
    newGroupName: "Punctuation",
  },
];

const shiftModifierBritish = {
  groupName: "Shift British",
  keys: [
    {
      code: 2148,
      labels: {
        primary: "|",
      },
    },
    {
      code: 2102,
      labels: {
        primary: "<",
      },
    },
    {
      code: 2103,
      labels: {
        primary: ">",
      },
    },
    {
      code: 2104,
      labels: {
        primary: "?",
      },
    },
    {
      code: 2097,
      labels: {
        primary: "~",
        // top: "S+",
      },
    },
    {
      code: 2099,
      labels: {
        primary: ":",
        // top: "S+",
      },
    },
    {
      code: 2100,
      labels: {
        primary: "@",
      },
    },
    {
      code: 2101,
      labels: {
        primary: "¬",
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
        primary: "£",
      },
    },
  ],
};
const british = britishLetters.concat(britishModifierKeys);

const table = { keys: british };
const tableWithoutModifier = { keys: britishLetters };

const britishCtrlTable = withModifiers(table, "Control +", "C+", 256);
const britishLAltTable = withModifiers(table, "Alt +", "A+", 512);
const britishRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const britishShiftTable = withModifiers(tableWithoutModifier, "Shift +", "S+", 2048);
const britishGuiTable = withModifiers(table, "Gui +", "G+", 4096);
// Double

const britishCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);

const britishCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);

const britishCSTable = withModifiers(table, "Control + Shift +", "C+S+", 2304);

const britishCGTable = withModifiers(table, "Control + Gui +", "C+G+", 4352);

const britishAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);

const britishASTable = withModifiers(table, "Alt + Shift +", "A+S+", 2560);

const britishAGTable = withModifiers(table, "Alt + Gui +", "A+G+", 4608);

const britishAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+S+", 3072);

const britishAGrGTable = withModifiers(table, "AltGr + Gui +", "AGr+G+", 5120);

const britishSGTable = withModifiers(table, "Shift + Gui +", "S+G+", 6144);

// Triple

const britishCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);

const britishCASTable = withModifiers(table, "Meh +", "Meh+", 2816);

const britishCAGTable = withModifiers(table, "Control + Alt + Gui +", "C+A+G+", 4864);

const britishCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+S+", 3328);

const britishCAGGTable = withModifiers(table, "Control + AltGr + Gui +", "C+AGr+G+", 5376);

const britishCSGTable = withModifiers(table, "Control + Shift + Gui +", "C+S+G+", 6400);

const britishAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+S+", 3584);

const britishAAGGTable = withModifiers(table, "Alt + AltGr + Gui +", "A+AGr+G+", 5632);

const britishASGTable = withModifiers(table, "Alt + Shift + Gui +", "A+S+G+", 6656);

const britishAGSGTable = withModifiers(table, "AltGr + Shift + Gui +", "AGr+S+G+", 7168);

// Quad

const britishCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);

const britishCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Gui +", "C+A+AGr+G+", 5888);

const britishAAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Gui +", "C+AGr+S+G+", 7424);

const britishCAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Gui +", "A+AGr+S+G+", 7680);

const britishAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const britishModifiedTables = [
  shiftModifierBritish,
  britishCtrlTable,
  britishLAltTable,
  britishRAltTable,
  britishShiftTable,
  britishGuiTable,
  britishCATable,
  altGRBritish,
  britishCAGrTable,
  britishCSTable,
  britishCGTable,
  britishAAGrTable,
  britishASTable,
  britishAGTable,
  britishSGTable,
  britishAGrSTable,
  britishAGrGTable,
  britishCAAGTable,
  britishCASTable,
  britishCAGTable,
  britishCAGSTable,
  britishCAGGTable,
  britishCSGTable,
  britishAAGSTable,
  britishAAGGTable,
  britishASGTable,
  britishAGSGTable,
  britishCAAGrSTable,
  britishCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  britishCAGrSGTable,
  britishAAGrSGTable,
  britishAllModTable,
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

export { british as default, britishModifiedTables };

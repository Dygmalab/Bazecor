import { withModifiers } from "../../db/utils";

const plPLprogLetters = [];

const altGRPolish = {
  groupName: "AltGR Polish",
  keys: [
    {
      code: 1028,
      labels: {
        primary: "Ą",
      },
    },
    {
      code: 1030,
      labels: {
        primary: "Ć",
      },
    },
    {
      code: 1032,
      labels: {
        primary: "Ę",
      },
    },
    {
      code: 1039,
      labels: {
        primary: "Ł",
      },
    },
    {
      code: 1041,
      labels: {
        primary: "Ń",
      },
    },
    {
      code: 1042,
      labels: {
        primary: "Ó",
      },
    },
    {
      code: 1046,
      labels: {
        primary: "Ś",
      },
    },
    {
      code: 1051,
      labels: {
        primary: "Ź",
      },
    },
    {
      code: 1053,
      labels: {
        primary: "Ż",
      },
    },
  ],
};

const plPLprog = plPLprogLetters;

const table = { keys: plPLprog };
const tableWithoutModifier = { keys: plPLprogLetters };

const plPLprogCtrlTable = withModifiers(table, "Control +", "C+", 256);
const plPLprogLAltTable = withModifiers(table, "Alt +", "A+", 512);
const plPLprogRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const plPLprogShiftTable = withModifiers(tableWithoutModifier, "Shift +", "O+", 2048);
const plPLprogGuiTable = withModifiers(table, "Os +", "O+", 4096);

// Double

const plPLprogCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const plPLprogCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const plPLprogCSTable = withModifiers(table, "Control + Shift +", "C+O+", 2304);
const plPLprogCGTable = withModifiers(table, "Control + Os +", "C+G+", 4352);
const plPLprogAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const plPLprogASTable = withModifiers(table, "Alt + Shift +", "A+O+", 2560);
const plPLprogAGTable = withModifiers(table, "Alt + Os +", "A+G+", 4608);
const plPLprogAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+O+", 3072);
const plPLprogAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+G+", 5120);
const plPLprogSGTable = withModifiers(table, "Shift + Os +", "O+G+", 6144);

// Triple

const plPLprogCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const plPLprogCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const plPLprogCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+G+", 4864);
const plPLprogCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+O+", 3328);
const plPLprogCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+G+", 5376);
const plPLprogCSGTable = withModifiers(table, "Control + Shift + Os +", "C+O+G+", 6400);
const plPLprogAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+O+", 3584);
const plPLprogAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+G+", 5632);
const plPLprogASGTable = withModifiers(table, "Alt + Shift + Os +", "A+O+G+", 6656);
const plPLprogAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+O+G+", 7168);

// Quad

const plPLprogCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const plPLprogCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+G+", 5888);
const plPLprogAAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+O+G+", 7424);
const plPLprogCAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+O+G+", 7680);
const plPLprogAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const plPLprogModifiedTables = [
  plPLprogCtrlTable,
  plPLprogLAltTable,
  plPLprogRAltTable,
  plPLprogShiftTable,
  plPLprogGuiTable,
  plPLprogCATable,
  altGRPolish,
  plPLprogCAGrTable,
  plPLprogCSTable,
  plPLprogCGTable,
  plPLprogAAGrTable,
  plPLprogASTable,
  plPLprogAGTable,
  plPLprogSGTable,
  plPLprogAGrSTable,
  plPLprogAGrGTable,
  plPLprogCAAGTable,
  plPLprogCASTable,
  plPLprogCAGTable,
  plPLprogCAGSTable,
  plPLprogCAGGTable,
  plPLprogCSGTable,
  plPLprogAAGSTable,
  plPLprogAAGGTable,
  plPLprogASGTable,
  plPLprogAGSGTable,
  plPLprogCAAGrSTable,
  plPLprogCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  plPLprogCAGrSGTable,
  plPLprogAAGrSGTable,
  plPLprogAllModTable,
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

export { plPLprog, plPLprogModifiedTables };

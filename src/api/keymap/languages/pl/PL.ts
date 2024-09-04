import { withModifiers } from "../../db/utils";
import { BaseKeycodeTableType, KeymapCodeTableType } from "../../types";

const plPLLetters: KeymapCodeTableType[] = [];

const altGRPolish: BaseKeycodeTableType = {
  groupName: "AltGr Polish",
  keys: [
    {
      code: 1028,
      labels: {
        primary: "Ą",
      },
      alt: true,
    },
    {
      code: 1030,
      labels: {
        primary: "Ć",
      },
      alt: true,
    },
    {
      code: 1032,
      labels: {
        primary: "Ę",
      },
      alt: true,
    },
    {
      code: 1039,
      labels: {
        primary: "Ł",
      },
      alt: true,
    },
    {
      code: 1041,
      labels: {
        primary: "Ń",
      },
      alt: true,
    },
    {
      code: 1042,
      labels: {
        primary: "Ó",
      },
      alt: true,
    },
    {
      code: 1046,
      labels: {
        primary: "Ś",
      },
      alt: true,
    },
    {
      code: 1051,
      labels: {
        primary: "Ź",
      },
      alt: true,
    },
    {
      code: 1053,
      labels: {
        primary: "Ż",
      },
      alt: true,
    },
  ],
};

const plPL = plPLLetters;

const table: BaseKeycodeTableType = { keys: plPL, groupName: "" };
const tableWithoutModifier: BaseKeycodeTableType = { keys: plPLLetters, groupName: "" };

const plPLCtrlTable = withModifiers(table, "Control +", "C+", 256);
const plPLLAltTable = withModifiers(table, "Alt +", "A+", 512);
const plPLRAltTable = withModifiers(table, "AltGr +", "AGr+", 1024);
const plPLShiftTable = withModifiers(tableWithoutModifier, "Shift +", "O+", 2048);
const plPLGuiTable = withModifiers(table, "Os +", "O+", 4096);

// Double

const plPLCATable = withModifiers(table, "Control + Alt +", "C+A+", 768);
const plPLCAGrTable = withModifiers(table, "Control + AltGr +", "C+AGr+", 1280);
const plPLCSTable = withModifiers(table, "Control + Shift +", "C+O+", 2304);
const plPLCGTable = withModifiers(table, "Control + Os +", "C+G+", 4352);
const plPLAAGrTable = withModifiers(table, "Alt + AltGr +", "A+AGr+", 1536);
const plPLASTable = withModifiers(table, "Alt + Shift +", "A+O+", 2560);
const plPLAGTable = withModifiers(table, "Alt + Os +", "A+G+", 4608);
const plPLAGrSTable = withModifiers(table, "AltGr + Shift +", "AGr+O+", 3072);
const plPLAGrGTable = withModifiers(table, "AltGr + Os +", "AGr+G+", 5120);
const plPLSGTable = withModifiers(table, "Shift + Os +", "O+G+", 6144);

// Triple

const plPLCAAGTable = withModifiers(table, "Control + Alt + AltGr +", "C+A+AGr+", 1792);
const plPLCASTable = withModifiers(table, "Meh +", "Meh+", 2816);
const plPLCAGTable = withModifiers(table, "Control + Alt + Os +", "C+A+G+", 4864);
const plPLCAGSTable = withModifiers(table, "Control + AltGr + Shift +", "C+AGr+O+", 3328);
const plPLCAGGTable = withModifiers(table, "Control + AltGr + Os +", "C+AGr+G+", 5376);
const plPLCSGTable = withModifiers(table, "Control + Shift + Os +", "C+O+G+", 6400);
const plPLAAGSTable = withModifiers(table, "Alt + AltGr + Shift +", "A+AGr+O+", 3584);
const plPLAAGGTable = withModifiers(table, "Alt + AltGr + Os +", "A+AGr+G+", 5632);
const plPLASGTable = withModifiers(table, "Alt + Shift + Os +", "A+O+G+", 6656);
const plPLAGSGTable = withModifiers(table, "AltGr + Shift + Os +", "AGr+O+G+", 7168);

// Quad

const plPLCAAGrSTable = withModifiers(table, "Meh + AltGr +", "M+AGr+", 3840);
const plPLCAAGrGTable = withModifiers(table, "Control + Alt + AltGr + Os +", "C+A+AGr+G+", 5888);
const plPLAAGrSGTable = withModifiers(table, "Control + AltGr + Shift + Os +", "C+AGr+O+G+", 7424);
const plPLCAGrSGTable = withModifiers(table, "Alt + AltGr + Shift + Os +", "A+AGr+O+G+", 7680);
const plPLAllModTable = withModifiers(table, "Hyper + AltGr +", "H+AGr+", 7936);

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

const plPLModifiedTables = [
  plPLCtrlTable,
  plPLLAltTable,
  plPLRAltTable,
  plPLShiftTable,
  plPLGuiTable,
  plPLCATable,
  altGRPolish,
  plPLCAGrTable,
  plPLCSTable,
  plPLCGTable,
  plPLAAGrTable,
  plPLASTable,
  plPLAGTable,
  plPLSGTable,
  plPLAGrSTable,
  plPLAGrGTable,
  plPLCAAGTable,
  plPLCASTable,
  plPLCAGTable,
  plPLCAGSTable,
  plPLCAGGTable,
  plPLCSGTable,
  plPLAAGSTable,
  plPLAAGGTable,
  plPLASGTable,
  plPLAGSGTable,
  plPLCAAGrSTable,
  plPLCAAGrGTable,
  withModifiers(table, "Hyper +", "Hyper+", 6912),
  plPLCAGrSGTable,
  plPLAAGrSGTable,
  plPLAllModTable,
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

export { plPL, plPLModifiedTables };

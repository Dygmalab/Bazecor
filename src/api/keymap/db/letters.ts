/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { withModifiers } from "./utils";
import { BaseKeycodeTableType } from "../types";

const LetterTable: BaseKeycodeTableType = {
  groupName: "Letters",
  keys: [
    {
      code: 4,
      labels: {
        primary: "A",
      },
    },
    {
      code: 5,
      labels: {
        primary: "B",
      },
    },
    {
      code: 6,
      labels: {
        primary: "C",
      },
    },
    {
      code: 7,
      labels: {
        primary: "D",
      },
    },
    {
      code: 8,
      labels: {
        primary: "E",
      },
    },
    {
      code: 9,
      labels: {
        primary: "F",
      },
    },
    {
      code: 10,
      labels: {
        primary: "G",
      },
    },
    {
      code: 11,
      labels: {
        primary: "H",
      },
    },
    {
      code: 12,
      labels: {
        primary: "I",
      },
    },
    {
      code: 13,
      labels: {
        primary: "J",
      },
    },
    {
      code: 14,
      labels: {
        primary: "K",
      },
    },
    {
      code: 15,
      labels: {
        primary: "L",
      },
    },
    {
      code: 16,
      labels: {
        primary: "M",
      },
    },
    {
      code: 17,
      labels: {
        primary: "N",
      },
    },
    {
      code: 18,
      labels: {
        primary: "O",
      },
    },
    {
      code: 19,
      labels: {
        primary: "P",
      },
    },
    {
      code: 20,
      labels: {
        primary: "Q",
      },
    },
    {
      code: 21,
      labels: {
        primary: "R",
      },
    },
    {
      code: 22,
      labels: {
        primary: "S",
      },
    },
    {
      code: 23,
      labels: {
        primary: "T",
      },
    },
    {
      code: 24,
      labels: {
        primary: "U",
      },
    },
    {
      code: 25,
      labels: {
        primary: "V",
      },
    },
    {
      code: 26,
      labels: {
        primary: "W",
      },
    },
    {
      code: 27,
      labels: {
        primary: "X",
      },
    },
    {
      code: 28,
      labels: {
        primary: "Y",
      },
    },
    {
      code: 29,
      labels: {
        primary: "Z",
      },
    },
  ],
};

/* Modifier tables */

// Single
const CtrlLetterTable = withModifiers(LetterTable, "Control +", "", 256);
const LAltLetterTable = withModifiers(LetterTable, "Alt +", "", 512);
const RAltLetterTable = withModifiers(LetterTable, "AltGr +", "", 1024);
const ShiftLetterTable = withModifiers(LetterTable, "Shift +", "", 2048);
const GuiLetterTable = withModifiers(LetterTable, "Os+", "", 4096);

// Double

const CALetterTable = withModifiers(LetterTable, "Control + Alt +", "", 768);

const CAGrLetterTable = withModifiers(LetterTable, "Control + AltGr +", "", 1280);

const CSLetterTable = withModifiers(LetterTable, "Control + Shift +", "", 2304);

const CGLetterTable = withModifiers(LetterTable, "Control + Os +", "", 4352);

const AAGrLetterTable = withModifiers(LetterTable, "Alt + AltGr +", "", 1536);
const SGLetterTable = withModifiers(LetterTable, "Shift + Os +", "", 6144);

const ASLetterTable = withModifiers(LetterTable, "Alt + Shift +", "", 2560);

const AGLetterTable = withModifiers(LetterTable, "Alt + Os +", "", 4608);

const AGrSLetterTable = withModifiers(LetterTable, "AltGr + Shift +", "", 3072);

const AGrGLetterTable = withModifiers(LetterTable, "AltGr + Os +", "", 5120);

// Triple

const CAAGLetterTable = withModifiers(LetterTable, "Control + Alt + AltGr +", "", 1792);

const CASLetterTable = withModifiers(LetterTable, "Meh +", "", 2816);

const CAGLetterTable = withModifiers(LetterTable, "Control + Alt + Os +", "", 4864);

const CAGSLetterTable = withModifiers(LetterTable, "Control + AltGr + Shift +", "", 3328);

const CAGGLetterTable = withModifiers(LetterTable, "Control + AltGr + Os +", "", 5376);

const CSGLetterTable = withModifiers(LetterTable, "Control + Shift + Os +", "", 6400);

const AAGSLetterTable = withModifiers(LetterTable, "Alt + AltGr + Shift +", "", 3584);

const AAGGLetterTable = withModifiers(LetterTable, "Alt + AltGr + Os +", "", 5632);

const ASGLetterTable = withModifiers(LetterTable, "Alt + Shift + Os +", "", 6656);

const AGSGLetterTable = withModifiers(LetterTable, "AltGr + Shift + Os +", "", 7168);

// Quad

const CAAGrSLetterTable = withModifiers(LetterTable, "Meh + AltGr +", "", 3840);

const CAAGrGLetterTable = withModifiers(LetterTable, "Control + Alt + AltGr + Os +", "", 5888);

const CAGrSGLetterTable = withModifiers(LetterTable, "Control + AltGr + Shift + Os +", "", 7424);

const AAGrSGLetterTable = withModifiers(LetterTable, "Alt + AltGr + Shift + Os +", "", 7680);

const AllModLetterTable = withModifiers(LetterTable, "Hyper + AltGr +", "", 7936);

const ModifiedLetterTables = [
  CtrlLetterTable,
  LAltLetterTable,
  RAltLetterTable,
  ShiftLetterTable,
  GuiLetterTable,
  CALetterTable,
  CAGrLetterTable,
  CSLetterTable,
  CGLetterTable,
  ASLetterTable,
  AGLetterTable,
  SGLetterTable,
  AAGrLetterTable,
  AGrSLetterTable,
  AGrGLetterTable,
  CAAGLetterTable,
  CASLetterTable,
  CAGLetterTable,
  CAGSLetterTable,
  CAGGLetterTable,
  CSGLetterTable,
  AAGSLetterTable,
  AAGGLetterTable,
  ASGLetterTable,
  AGSGLetterTable,
  CAAGrSLetterTable,
  CAAGrGLetterTable,
  withModifiers(LetterTable, "Hyper +", "", 6912),
  CAGrSGLetterTable,
  AAGrSGLetterTable,
  AllModLetterTable,
];

export { LetterTable, ModifiedLetterTables };

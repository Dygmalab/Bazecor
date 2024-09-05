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

const PunctuationTable = {
  groupName: "Punctuation",
  keys: [
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
    {
      code: 47,
      labels: {
        primary: "[",
      },
    },
    {
      code: 48,
      labels: {
        primary: "]",
      },
    },
    {
      code: 49,
      labels: {
        primary: "\\",
      },
    },
    {
      code: 51,
      labels: {
        primary: ";",
      },
    },
    {
      code: 52,
      labels: {
        primary: "'",
      },
    },
    {
      code: 53,
      labels: {
        primary: "`",
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
    {
      code: 57,
      labels: {
        primary: "⇪",
        verbose: "Caps Lock",
      },
    },
    {
      code: 100,
      labels: {
        primary: "<>",
        verbose: "ISO <>",
      },
    },
  ],
};

const ShiftedPunctuationTable = {
  groupName: "Shifted Punctuation",
  keys: [
    {
      code: 2093,
      labels: {
        primary: "_",
      },
      alt: true,
    },
    {
      code: 2094,
      labels: {
        primary: "+",
      },
      alt: true,
    },
    {
      code: 2095,
      labels: {
        primary: "{",
      },
      alt: true,
    },
    {
      code: 2096,
      labels: {
        primary: "}",
      },
      alt: true,
    },
    {
      code: 2097,
      labels: {
        primary: "|",
      },
      alt: true,
    },
    {
      code: 2099,
      labels: {
        primary: ":",
      },
      alt: true,
    },
    {
      code: 2100,
      labels: {
        primary: '"',
      },
      alt: true,
    },
    {
      code: 2101,
      labels: {
        primary: "~",
      },
      alt: true,
    },
    {
      code: 2102,
      labels: {
        primary: "<",
      },
      alt: true,
    },
    {
      code: 2103,
      labels: {
        primary: ">",
      },
      alt: true,
    },
    {
      code: 2104,
      labels: {
        primary: "?",
      },
      alt: true,
    },
    {
      code: 2148,
      labels: {
        primary: "Alt. |",
        verbose: "Non-US |",
      },
      alt: true,
    },
  ],
};

const ModifiedPunctuationTables = [
  // Single
  withModifiers(PunctuationTable, "Control +", "", 256),
  withModifiers(PunctuationTable, "Alt +", "", 512),
  withModifiers(PunctuationTable, "AltGr +", "", 1024),
  ShiftedPunctuationTable,
  withModifiers(PunctuationTable, "Os+", "", 4096),

  // Double
  withModifiers(PunctuationTable, "Control + Alt +", "", 768),
  withModifiers(PunctuationTable, "Control + AltGr +", "", 1280),
  withModifiers(PunctuationTable, "Control + Shift +", "", 2304),
  withModifiers(PunctuationTable, "Control + Os +", "", 4352),
  withModifiers(PunctuationTable, "Alt + AltGr +", "", 1536),
  withModifiers(PunctuationTable, "Alt + Shift +", "", 2560),
  withModifiers(PunctuationTable, "Alt + Os +", "", 4608),
  withModifiers(PunctuationTable, "AltGr + Shift +", "", 3072),
  withModifiers(PunctuationTable, "AltGr + Os +", "", 5120),
  withModifiers(PunctuationTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(PunctuationTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(PunctuationTable, "Meh +", "", 2816),
  withModifiers(PunctuationTable, "Control + Alt + Os +", "", 4864),
  withModifiers(PunctuationTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(PunctuationTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(PunctuationTable, "Control + Shift + Os +", "", 6400),
  withModifiers(PunctuationTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(PunctuationTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(PunctuationTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(PunctuationTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(PunctuationTable, "Meh + AltGr +", "", 3840),
  withModifiers(PunctuationTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(PunctuationTable, "Hyper +", "Hyper+", 6912),
  withModifiers(PunctuationTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(PunctuationTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(PunctuationTable, "Hyper + AltGr +", "", 7936),
];
export default PunctuationTable;
export { ModifiedPunctuationTables };

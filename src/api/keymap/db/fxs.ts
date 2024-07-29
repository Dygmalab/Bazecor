/* Bazecor-keymap -- Bazecor keymap library
 *  Copyright (C) 2018, 2019  Keyboardio, Inc.
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

const FunctionKeyTable = {
  groupName: "Fx keys",
  keys: [
    {
      code: 58,
      labels: {
        primary: "F1",
      },
    },
    {
      code: 59,
      labels: {
        primary: "F2",
      },
    },
    {
      code: 60,
      labels: {
        primary: "F3",
      },
    },
    {
      code: 61,
      labels: {
        primary: "F4",
      },
    },
    {
      code: 62,
      labels: {
        primary: "F5",
      },
    },
    {
      code: 63,
      labels: {
        primary: "F6",
      },
    },
    {
      code: 64,
      labels: {
        primary: "F7",
      },
    },
    {
      code: 65,
      labels: {
        primary: "F8",
      },
    },
    {
      code: 66,
      labels: {
        primary: "F9",
      },
    },
    {
      code: 67,
      labels: {
        primary: "F10",
      },
    },
    {
      code: 68,
      labels: {
        primary: "F11",
      },
    },
    {
      code: 69,
      labels: {
        primary: "F12",
      },
    },
    {
      code: 104,
      labels: {
        primary: "F13",
      },
    },
    {
      code: 105,
      labels: {
        primary: "F14",
      },
    },
    {
      code: 106,
      labels: {
        primary: "F15",
      },
    },
    {
      code: 107,
      labels: {
        primary: "F16",
      },
    },
    {
      code: 108,
      labels: {
        primary: "F17",
      },
    },
    {
      code: 109,
      labels: {
        primary: "F18",
      },
    },
    {
      code: 110,
      labels: {
        primary: "F19",
      },
    },
    {
      code: 111,
      labels: {
        primary: "F20",
      },
    },
    {
      code: 112,
      labels: {
        primary: "F21",
      },
    },
    {
      code: 113,
      labels: {
        primary: "F22",
      },
    },
    {
      code: 114,
      labels: {
        primary: "F23",
      },
    },
    {
      code: 115,
      labels: {
        primary: "F24",
      },
    },
  ],
};

const ModifiedFunctionKeyTables = [
  // Single
  withModifiers(FunctionKeyTable, "Control +", "", 256),
  withModifiers(FunctionKeyTable, "Alt +", "", 512),
  withModifiers(FunctionKeyTable, "AltGr +", "", 1024),
  withModifiers(FunctionKeyTable, "Shift +", "", 2048),
  withModifiers(FunctionKeyTable, "Os+", "", 4096),

  // Double
  withModifiers(FunctionKeyTable, "Control + Alt +", "", 768),
  withModifiers(FunctionKeyTable, "Control + AltGr +", "", 1280),
  withModifiers(FunctionKeyTable, "Control + Shift +", "", 2304),
  withModifiers(FunctionKeyTable, "Control + Os +", "", 4352),
  withModifiers(FunctionKeyTable, "Alt + AltGr +", "", 1536),
  withModifiers(FunctionKeyTable, "Alt + Shift +", "", 2560),
  withModifiers(FunctionKeyTable, "Alt + Os +", "", 4608),
  withModifiers(FunctionKeyTable, "AltGr + Shift +", "", 3072),
  withModifiers(FunctionKeyTable, "AltGr + Os +", "", 5120),
  withModifiers(FunctionKeyTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(FunctionKeyTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(FunctionKeyTable, "Meh +", "", 2816),
  withModifiers(FunctionKeyTable, "Control + Alt + Os +", "", 4864),
  withModifiers(FunctionKeyTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(FunctionKeyTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(FunctionKeyTable, "Control + Shift + Os +", "", 6400),
  withModifiers(FunctionKeyTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(FunctionKeyTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(FunctionKeyTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(FunctionKeyTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(FunctionKeyTable, "Meh + AltGr +", "", 3840),
  withModifiers(FunctionKeyTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(FunctionKeyTable, "Hyper +", "Hyper+", 6912),
  withModifiers(FunctionKeyTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(FunctionKeyTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(FunctionKeyTable, "Hyper + AltGr +", "", 7936),
];

export default FunctionKeyTable;
export { ModifiedFunctionKeyTables };

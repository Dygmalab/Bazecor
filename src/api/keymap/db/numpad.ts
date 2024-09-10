/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018  Keyboardio, Inc.
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

const NumpadTable = {
  groupName: "Numpad",
  keys: [
    {
      code: 89,
      labels: {
        top: "Num",
        primary: "1",
      },
    },
    {
      code: 90,
      labels: {
        top: "Num",
        primary: "2",
      },
    },
    {
      code: 91,
      labels: {
        top: "Num",
        primary: "3",
      },
    },
    {
      code: 92,
      labels: {
        top: "Num",
        primary: "4",
      },
    },
    {
      code: 93,
      labels: {
        top: "Num",
        primary: "5",
      },
    },
    {
      code: 94,
      labels: {
        top: "Num",
        primary: "6",
      },
    },
    {
      code: 95,
      labels: {
        top: "Num",
        primary: "7",
      },
    },
    {
      code: 96,
      labels: {
        top: "Num",
        primary: "8",
      },
    },
    {
      code: 97,
      labels: {
        top: "Num",
        primary: "9",
      },
    },
    {
      code: 98,
      labels: {
        top: "Num",
        primary: "0",
      },
    },
    {
      code: 99,
      labels: {
        top: "Num",
        primary: ".",
      },
    },
    {
      code: 85,
      labels: {
        top: "Num",
        primary: "*",
      },
    },
    {
      code: 86,
      labels: {
        top: "Num",
        primary: "-",
      },
    },
    {
      code: 87,
      labels: {
        top: "Num",
        primary: "+",
      },
    },
    {
      code: 88,
      labels: {
        top: "Num",
        primary: "Enter",
      },
    },
    {
      code: 83,
      labels: {
        primary: "NUMLOCK",
        verbose: "Num Lock",
      },
    },
    {
      code: 84,
      labels: {
        top: "Num",
        primary: "/",
      },
    },
  ],
};

const ModifiedNumpadTables = [
  // Single
  withModifiers(NumpadTable, "Control +", "", 256),
  withModifiers(NumpadTable, "Alt +", "", 512),
  withModifiers(NumpadTable, "AltGr +", "", 1024),
  withModifiers(NumpadTable, "Shift +", "", 2048),
  withModifiers(NumpadTable, "Os+", "", 4096),

  // Double
  withModifiers(NumpadTable, "Control + Alt +", "", 768),
  withModifiers(NumpadTable, "Control + AltGr +", "", 1280),
  withModifiers(NumpadTable, "Control + Shift +", "", 2304),
  withModifiers(NumpadTable, "Control + Os +", "", 4352),
  withModifiers(NumpadTable, "Alt + AltGr +", "", 1536),
  withModifiers(NumpadTable, "Alt + Shift +", "", 2560),
  withModifiers(NumpadTable, "Alt + Os +", "", 4608),
  withModifiers(NumpadTable, "AltGr + Shift +", "", 3072),
  withModifiers(NumpadTable, "AltGr + Os +", "", 5120),
  withModifiers(NumpadTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(NumpadTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(NumpadTable, "Meh +", "", 2816),
  withModifiers(NumpadTable, "Control + Alt + Os +", "", 4864),
  withModifiers(NumpadTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(NumpadTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(NumpadTable, "Control + Shift + Os +", "", 6400),
  withModifiers(NumpadTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(NumpadTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(NumpadTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(NumpadTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(NumpadTable, "Meh + AltGr +", "", 3840),
  withModifiers(NumpadTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(NumpadTable, "Hyper +", "", 6912),
  withModifiers(NumpadTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(NumpadTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(NumpadTable, "Hyper + AltGr +", "", 7936),
];

export { NumpadTable as default, ModifiedNumpadTables };

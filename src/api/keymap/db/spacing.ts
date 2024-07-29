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

const SpacingTable = {
  groupName: "Spacing",
  keys: [
    {
      code: 44,
      labels: {
        primary: "SPACE",
      },
    },
    {
      code: 40,
      labels: {
        primary: "ENTER",
      },
    },
    {
      code: 43,
      labels: {
        primary: "TAB",
      },
    },
    {
      code: 41,
      labels: {
        primary: "ESC",
      },
    },
    {
      code: 42,
      labels: {
        primary: "BACKSPACE",
        verbose: "Backspace",
      },
    },
    {
      code: 76,
      labels: {
        primary: "DEL",
      },
    },
    {
      code: 73,
      labels: {
        primary: "INSERT",
      },
    },
  ],
};

const ModifiedSpacingTables = [
  // Single
  withModifiers(SpacingTable, "Control +", "", 256),
  withModifiers(SpacingTable, "Alt +", "", 512),
  withModifiers(SpacingTable, "AltGr +", "", 1024),
  withModifiers(SpacingTable, "Shift +", "", 2048),
  withModifiers(SpacingTable, "Os+", "", 4096),

  // Double
  withModifiers(SpacingTable, "Control + Alt +", "", 768),
  withModifiers(SpacingTable, "Control + AltGr +", "", 1280),
  withModifiers(SpacingTable, "Control + Shift +", "", 2304),
  withModifiers(SpacingTable, "Control + Os +", "", 4352),
  withModifiers(SpacingTable, "Alt + AltGr +", "", 1536),
  withModifiers(SpacingTable, "Alt + Shift +", "", 2560),
  withModifiers(SpacingTable, "Alt + Os +", "", 4608),
  withModifiers(SpacingTable, "AltGr + Shift +", "", 3072),
  withModifiers(SpacingTable, "AltGr + Os +", "", 5120),
  withModifiers(SpacingTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(SpacingTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(SpacingTable, "Meh +", "", 2816),
  withModifiers(SpacingTable, "Control + Alt + Os +", "", 4864),
  withModifiers(SpacingTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(SpacingTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(SpacingTable, "Control + Shift + Os +", "", 6400),
  withModifiers(SpacingTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(SpacingTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(SpacingTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(SpacingTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(SpacingTable, "Meh + AltGr +", "", 3840),
  withModifiers(SpacingTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(SpacingTable, "Hyper +", "", 6912),
  withModifiers(SpacingTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(SpacingTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(SpacingTable, "Hyper + AltGr +", "", 7936),
];

export default SpacingTable;
export { ModifiedSpacingTables };

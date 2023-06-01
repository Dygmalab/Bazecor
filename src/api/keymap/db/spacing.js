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
        primary: "SPACE"
      }
    },
    {
      code: 40,
      labels: {
        primary: "ENTER"
      }
    },
    {
      code: 43,
      labels: {
        primary: "TAB"
      }
    },
    {
      code: 41,
      labels: {
        primary: "ESC"
      }
    },
    {
      code: 42,
      labels: {
        primary: "BACKSPACE",
        verbose: "Backspace"
      }
    },
    {
      code: 76,
      labels: {
        primary: "DEL"
      }
    },
    {
      code: 73,
      labels: {
        primary: "INSERT"
      }
    }
  ]
};

const ModifiedSpacingTables = [
  // Single
  withModifiers(SpacingTable, "Control +", "C+", 256),
  withModifiers(SpacingTable, "Alt +", "A+", 512),
  withModifiers(SpacingTable, "AltGr +", "AGr+", 1024),
  withModifiers(SpacingTable, "Shift +", "S+", 2048),
  withModifiers(SpacingTable, "Os+", "O+", 4096),

  // Double
  withModifiers(SpacingTable, "Control + Alt +", "C+A+", 768),
  withModifiers(SpacingTable, "Control + AltGr +", "C+AGr+", 1280),
  withModifiers(SpacingTable, "Control + Shift +", "C+S+", 2304),
  withModifiers(SpacingTable, "Control + Os +", "C+O+", 4352),
  withModifiers(SpacingTable, "Alt + AltGr +", "A+AGr+", 1536),
  withModifiers(SpacingTable, "Alt + Shift +", "A+S+", 2560),
  withModifiers(SpacingTable, "Alt + Os +", "A+O+", 4608),
  withModifiers(SpacingTable, "AltGr + Shift +", "AGr+S+", 3072),
  withModifiers(SpacingTable, "AltGr + Os +", "AGr+O+", 5120),
  withModifiers(SpacingTable, "Shift + Os +", "S+O+", 6144),

  // Triple
  withModifiers(SpacingTable, "Control + Alt + AltGr +", "C+A+AGr+", 1792),
  withModifiers(SpacingTable, "Meh +", "Meh+", 2816),
  withModifiers(SpacingTable, "Control + Alt + Os +", "C+A+O+", 4864),
  withModifiers(SpacingTable, "Control + AltGr + Shift +", "C+AGr+S+", 3328),
  withModifiers(SpacingTable, "Control + AltGr + Os +", "C+AGr+O+", 5376),
  withModifiers(SpacingTable, "Control + Shift + Os +", "C+S+O+", 6400),
  withModifiers(SpacingTable, "Alt + AltGr + Shift +", "A+AGr+S+", 3584),
  withModifiers(SpacingTable, "Alt + AltGr + Os +", "A+AGr+O+", 5632),
  withModifiers(SpacingTable, "Alt + Shift + Os +", "A+S+O+", 6656),
  withModifiers(SpacingTable, "AltGr + Shift + Os +", "AGr+S+O+", 7168),

  // Quad
  withModifiers(SpacingTable, "Meh + AltGr +", "M+AGr+", 3840),
  withModifiers(SpacingTable, "Control + Alt + AltGr + Os +", "C+A+AGr+O+", 5888),
  withModifiers(SpacingTable, "Hyper +", "Hyper+", 6912),
  withModifiers(SpacingTable, "Control + AltGr + Shift + Os +", "C+AGr+S+O+", 7424),
  withModifiers(SpacingTable, "Alt + AltGr + Shift + Os +", "A+AGr+S+O+", 7680),

  // All
  withModifiers(SpacingTable, "Hyper + AltGr +", "H+AGr+", 7936)
];

export { SpacingTable as default, ModifiedSpacingTables };

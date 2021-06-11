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
        primary: "␣",
        verbose: "Space"
      }
    },
    {
      code: 40,
      labels: {
        primary: "↵",
        verbose: "Enter"
      }
    },
    {
      code: 43,
      labels: {
        primary: "↹",
        verbose: "Tab"
      }
    },
    {
      code: 41,
      labels: {
        primary: "Esc",
        verbose: "Escape"
      }
    },
    {
      code: 42,
      labels: {
        primary: "⌫",
        verbose: "Backspace"
      }
    },
    {
      code: 76,
      labels: {
        primary: "⌦",
        verbose: "Delete"
      }
    },
    {
      code: 73,
      labels: {
        primary: "⎀",
        verbose: "Insert"
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
  withModifiers(SpacingTable, "Gui +", "G+", 4096),

  // Double
  withModifiers(SpacingTable, "Control + Alt +", "C+A+", 768),
  withModifiers(SpacingTable, "Control + AltGr +", "C+AGr+", 1280),
  withModifiers(SpacingTable, "Control + Shift +", "C+S+", 2304),
  withModifiers(SpacingTable, "Control + Gui +", "C+G+", 4352),
  withModifiers(SpacingTable, "Alt + AltGr +", "A+AGr+", 1536),
  withModifiers(SpacingTable, "Alt + Shift +", "A+S+", 2560),
  withModifiers(SpacingTable, "Alt + Gui +", "A+G+", 4608),
  withModifiers(SpacingTable, "AltGr + Shift +", "AGr+S+", 3072),
  withModifiers(SpacingTable, "AltGr + Gui +", "AGr+G+", 5120),
  withModifiers(SpacingTable, "Shift + Gui +", "S+G+", 6144),

  // Triple
  withModifiers(SpacingTable, "Control + Alt + AltGr +", "C+A+AGr+", 1792),
  withModifiers(SpacingTable, "Meh +", "Meh+", 2816),
  withModifiers(SpacingTable, "Control + Alt + Gui +", "C+A+G+", 4864),
  withModifiers(SpacingTable, "Control + AltGr + Shift +", "C+AGr+S+", 3328),
  withModifiers(SpacingTable, "Control + AltGr + Gui +", "C+AGr+G+", 5376),
  withModifiers(SpacingTable, "Control + Shift + Gui +", "C+S+G+", 6400),
  withModifiers(SpacingTable, "Alt + AltGr + Shift +", "A+AGr+S+", 3584),
  withModifiers(SpacingTable, "Alt + AltGr + Gui +", "A+AGr+G+", 5632),
  withModifiers(SpacingTable, "Alt + Shift + Gui +", "A+S+G+", 6656),
  withModifiers(SpacingTable, "AltGr + Shift + Gui +", "AGr+S+G+", 7168),

  // Quad
  withModifiers(SpacingTable, "Meh + AltGr +", "M+AGr+", 3840),
  withModifiers(
    SpacingTable,
    "Control + Alt + AltGr + Gui +",
    "C+A+AGr+G+",
    5888
  ),
  withModifiers(SpacingTable, "Hyper +", "Hyper+", 6912),
  withModifiers(
    SpacingTable,
    "Control + AltGr + Shift + Gui +",
    "C+AGr+S+G+",
    7424
  ),
  withModifiers(
    SpacingTable,
    "Alt + AltGr + Shift + Gui +",
    "A+AGr+S+G+",
    7680
  ),

  // All
  withModifiers(SpacingTable, "Hyper + AltGr +", "H+AGr+", 7936)
];

export { SpacingTable as default, ModifiedSpacingTables };

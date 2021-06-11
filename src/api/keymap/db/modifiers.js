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

const GuiLabels = {
  linux: "LINUX",
  win32: "WIN",
  darwin: "⌘"
};

const GuiVerboses = {
  linux: "Linux",
  win32: "Windows",
  darwin: "Command"
};

const AltLabels = {
  linux: "ALT",
  win32: "ALT",
  darwin: "⌥"
};

const AltVerboses = {
  linux: "Alt",
  win32: "Alt",
  darwin: "Option"
};

const guiLabel = GuiLabels[process.platform] || "Gui";
const guiVerbose = GuiVerboses[process.platform] || "Gui";
const AltLabel = AltLabels[process.platform] || "ALT";
const AltVerbose = AltVerboses[process.platform] || "Alt";

const ModifiersTable = {
  groupName: "Modifiers",
  keys: [
    {
      code: 224,
      labels: {
        primary: "LEFT CTRL",
        verbose: "Left Control"
      }
    },
    {
      code: 225,
      labels: {
        primary: "LEFT ⇧",
        verbose: "Left Shift"
      }
    },
    {
      code: 226,
      labels: {
        primary: "LEFT " + AltLabel,
        verbose: "Left " + AltVerbose
      }
    },
    {
      code: 227,
      labels: {
        primary: "LEFT " + guiLabel,
        verbose: "Left " + guiVerbose
      }
    },
    {
      code: 228,
      labels: {
        primary: "RIGHT CTRL",
        verbose: "Right Control"
      }
    },
    {
      code: 229,
      labels: {
        top: "",
        primary: "RIGHT ⇧",
        verbose: "Right Shift"
      }
    },
    {
      code: 230,
      labels: {
        top: "",
        primary: "RIGHT " + AltLabel,
        verbose: "AltGr"
      }
    },
    {
      code: 231,
      labels: {
        primary: "RIGHT " + guiLabel,
        verbose: "Right " + guiVerbose
      }
    }
  ]
};

const HyperMehTable = {
  groupName: "Hyper & Meh",
  keys: [
    {
      code: 2530,
      labels: {
        primary: "Meh"
      }
    },
    {
      code: 3043,
      labels: {
        primary: "Hyper"
      }
    }
  ]
};

const ModifiedModifiersTables = [
  // Single
  withModifiers(ModifiersTable, "Control +", "C+", 256),
  withModifiers(ModifiersTable, "Alt +", "A+", 512),
  withModifiers(ModifiersTable, "AltGr +", "AGr+", 1024),
  withModifiers(ModifiersTable, "Shift +", "S+", 2048),
  withModifiers(ModifiersTable, "Gui +", "G+", 4096),

  // Double
  withModifiers(ModifiersTable, "Control + Alt +", "C+A+", 768),
  withModifiers(ModifiersTable, "Control + AltGr +", "C+AGr+", 1280),
  withModifiers(ModifiersTable, "Control + Shift +", "C+S+", 2304),
  withModifiers(ModifiersTable, "Control + Gui +", "C+G+", 4352),
  withModifiers(ModifiersTable, "Alt + AltGr +", "A+AGr+", 1536),
  withModifiers(ModifiersTable, "Alt + Shift +", "A+S+", 2560),
  withModifiers(ModifiersTable, "Alt + Gui +", "A+G+", 4608),
  withModifiers(ModifiersTable, "AltGr + Shift +", "AGr+S+", 3072),
  withModifiers(ModifiersTable, "AltGr + Gui +", "AGr+G+", 5120),
  withModifiers(ModifiersTable, "Shift + Gui +", "S+G+", 6144),

  // Triple
  withModifiers(ModifiersTable, "Control + Alt + AltGr +", "C+A+AGr+", 1792),
  withModifiers(ModifiersTable, "Meh +", "Meh+", 2816),
  withModifiers(ModifiersTable, "Control + Alt + Gui +", "C+A+G+", 4864),
  withModifiers(ModifiersTable, "Control + AltGr + Shift +", "C+AGr+S+", 3328),
  withModifiers(ModifiersTable, "Control + AltGr + Gui +", "C+AGr+G+", 5376),
  withModifiers(ModifiersTable, "Control + Shift + Gui +", "C+S+G+", 6400),
  withModifiers(ModifiersTable, "Alt + AltGr + Shift +", "A+AGr+S+", 3584),
  withModifiers(ModifiersTable, "Alt + AltGr + Gui +", "A+AGr+G+", 5632),
  withModifiers(ModifiersTable, "Alt + Shift + Gui +", "A+S+G+", 6656),
  withModifiers(ModifiersTable, "AltGr + Shift + Gui +", "AGr+S+G+", 7168),

  // Quad
  withModifiers(ModifiersTable, "Meh + AltGr +", "M+AGr+", 3840),
  withModifiers(
    ModifiersTable,
    "Control + Alt + AltGr + Gui +",
    "C+A+AGr+G+",
    5888
  ),
  withModifiers(ModifiersTable, "Hyper+", "Hyper+", 6912),
  withModifiers(
    ModifiersTable,
    "Control + AltGr + Shift + Gui +",
    "C+AGr+S+G+",
    7424
  ),
  withModifiers(
    ModifiersTable,
    "Alt + AltGr + Shift + Gui +",
    "A+AGr+S+G+",
    7680
  ),

  // All
  withModifiers(ModifiersTable, "Hyper + AltGr +", "H+AGr+", 7936)
];

export { ModifiersTable as default, ModifiedModifiersTables, HyperMehTable };

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

const GuiLabels: { [key: string]: string } = {
  linux: "LINUX",
  win32: "WIN",
  darwin: "⌘",
};

const GuiVerboses: { [key: string]: string } = {
  linux: "Linux",
  win32: "Windows",
  darwin: "Command",
};

const AltLabels: { [key: string]: string } = {
  linux: "ALT",
  win32: "ALT",
  darwin: "⌥",
};

const AltVerboses: { [key: string]: string } = {
  linux: "Alt",
  win32: "Alt",
  darwin: "Option",
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
        top: "LEFT",
        primary: "CTRL",
        verbose: "Left Control",
      },
    },
    {
      code: 225,
      labels: {
        top: "LEFT",
        primary: "SHIFT",
        verbose: "Left Shift",
      },
    },
    {
      code: 226,
      labels: {
        primary: `LEFT ${AltLabel}`,
        verbose: `Left ${AltVerbose}`,
      },
    },
    {
      code: 227,
      labels: {
        primary: `LEFT ${guiLabel}`,
        verbose: `Left ${guiVerbose}`,
      },
    },
    {
      code: 228,
      labels: {
        top: "RIGHT",
        primary: "CTRL",
        verbose: "Right Control",
      },
    },
    {
      code: 229,
      labels: {
        top: "RIGHT",
        primary: "SHIFT",
        verbose: "Right Shift",
      },
    },
    {
      code: 230,
      labels: {
        top: "",
        primary: `RIGHT ${AltLabel}`,
        verbose: "AltGr",
      },
    },
    {
      code: 231,
      labels: {
        primary: `RIGHT ${guiLabel}`,
        verbose: `Right ${guiVerbose}`,
      },
    },
  ],
};

const HyperMehTable = {
  groupName: "Hyper & Meh",
  keys: [
    {
      code: 2530,
      labels: {
        primary: "Meh",
      },
    },
    {
      code: 3043,
      labels: {
        primary: "Hyper",
      },
    },
  ],
};

const ModifiedModifiersTables = [
  // Single
  withModifiers(ModifiersTable, "Control +", "", 256),
  withModifiers(ModifiersTable, "Alt +", "", 512),
  withModifiers(ModifiersTable, "AltGr +", "", 1024),
  withModifiers(ModifiersTable, "Shift +", "", 2048),
  withModifiers(ModifiersTable, "Os+", "", 4096),

  // Double
  withModifiers(ModifiersTable, "Control + Alt +", "", 768),
  withModifiers(ModifiersTable, "Control + AltGr +", "", 1280),
  withModifiers(ModifiersTable, "Control + Shift +", "", 2304),
  withModifiers(ModifiersTable, "Control + Os +", "", 4352),
  withModifiers(ModifiersTable, "Alt + AltGr +", "", 1536),
  withModifiers(ModifiersTable, "Alt + Shift +", "", 2560),
  withModifiers(ModifiersTable, "Alt + Os +", "", 4608),
  withModifiers(ModifiersTable, "AltGr + Shift +", "", 3072),
  withModifiers(ModifiersTable, "AltGr + Os +", "", 5120),
  withModifiers(ModifiersTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(ModifiersTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(ModifiersTable, "Meh +", "", 2816),
  withModifiers(ModifiersTable, "Control + Alt + Os +", "", 4864),
  withModifiers(ModifiersTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(ModifiersTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(ModifiersTable, "Control + Shift + Os +", "", 6400),
  withModifiers(ModifiersTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(ModifiersTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(ModifiersTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(ModifiersTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(ModifiersTable, "Meh + AltGr +", "", 3840),
  withModifiers(ModifiersTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(ModifiersTable, "Hyper+", "Hyper+", 6912),
  withModifiers(ModifiersTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(ModifiersTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(ModifiersTable, "Hyper + AltGr +", "", 7936),
];

export default ModifiersTable;
export { ModifiedModifiersTables, HyperMehTable };

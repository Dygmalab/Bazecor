/* bazecor-keymap -- Bazecor keymap library
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

const NavigationTable = {
  groupName: "Navigation",
  keys: [
    {
      code: 75,
      labels: {
        primary: "PAGE UP",
        verbose: "Page Up",
      },
    },
    {
      code: 78,
      labels: {
        primary: "PAGE DOWN",
        verbose: "Page Down",
      },
    },
    {
      code: 74,
      labels: {
        primary: "HOME",
      },
    },
    {
      code: 77,
      labels: {
        primary: "END",
      },
    },
    {
      code: 80,
      labels: {
        primary: "←",
      },
    },
    {
      code: 81,
      labels: {
        primary: "↓",
      },
    },
    {
      code: 82,
      labels: {
        primary: "↑",
      },
    },
    {
      code: 79,
      labels: {
        primary: "→",
      },
    },
    {
      code: 101,
      labels: {
        primary: "MENU",
      },
    },
  ],
};

const ModifiedNavigationTables = [
  // Single
  withModifiers(NavigationTable, "Control +", "", 256),
  withModifiers(NavigationTable, "Alt +", "", 512),
  withModifiers(NavigationTable, "AltGr +", "", 1024),
  withModifiers(NavigationTable, "Shift +", "", 2048),
  withModifiers(NavigationTable, "Os+", "", 4096),

  // Double
  withModifiers(NavigationTable, "Control + Alt +", "", 768),
  withModifiers(NavigationTable, "Control + AltGr +", "", 1280),
  withModifiers(NavigationTable, "Control + Shift +", "", 2304),
  withModifiers(NavigationTable, "Control + Os +", "", 4352),
  withModifiers(NavigationTable, "Alt + AltGr +", "", 1536),
  withModifiers(NavigationTable, "Alt + Shift +", "", 2560),
  withModifiers(NavigationTable, "Alt + Os +", "", 4608),
  withModifiers(NavigationTable, "AltGr + Shift +", "", 3072),
  withModifiers(NavigationTable, "AltGr + Os +", "", 5120),
  withModifiers(NavigationTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(NavigationTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(NavigationTable, "Meh +", "", 2816),
  withModifiers(NavigationTable, "Control + Alt + Os +", "", 4864),
  withModifiers(NavigationTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(NavigationTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(NavigationTable, "Control + Shift + Os +", "", 6400),
  withModifiers(NavigationTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(NavigationTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(NavigationTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(NavigationTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(NavigationTable, "Meh + AltGr +", "", 3840),
  withModifiers(NavigationTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(NavigationTable, "Hyper+", "", 6912),
  withModifiers(NavigationTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(NavigationTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(NavigationTable, "Hyper + AltGr +", "", 7936),
];

export { NavigationTable as default, ModifiedNavigationTables };

/* bazecor-keymap -- Bazecor keymap library
 * Copyright (C) 2018  Keyboardio, Inc.
 * Copyright (C) 2019, 2020  DygmaLab SE
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

import React from "react";

import { IconShutdown, IconSleep } from "@Renderer/components/atoms/icons";
import { withModifiers } from "./utils";

const MiscellaneousTable = {
  groupName: "Miscellaneous",
  keys: [
    {
      code: 70,
      labels: {
        primary: "PRINT SCRN",
        verbose: "Print Screen",
      },
    },
    {
      code: 71,
      labels: {
        primary: "SCROLL LCK",
        verbose: "Scroll Lock",
      },
    },
    {
      code: 72,
      labels: {
        primary: "PAUSE",
      },
    },
    {
      code: 20865,
      labels: {
        primary: <IconShutdown size="sm" />,
        verbose: "Shut Down",
      },
    },
    {
      code: 20866,
      labels: {
        primary: <IconSleep size="sm" />,
        verbose: "Sleep",
      },
    },
    /* These are disabled for now, since we don't want to display them in
     * Bazecor. */
    /*
        {
            code: 53291,
            labels: {
                primary: "CYCLE"
            }
        },
        {
            code: 53292,
            labels: {
                primary: "SYSTER"
            }
        }
        */
  ],
};

const ModifiedMiscellaneousTables = [
  // Single
  withModifiers(MiscellaneousTable, "Control +", "", 256),
  withModifiers(MiscellaneousTable, "Alt +", "", 512),
  withModifiers(MiscellaneousTable, "AltGr +", "", 1024),
  withModifiers(MiscellaneousTable, "Shift +", "", 2048),
  withModifiers(MiscellaneousTable, "Os+", "", 4096),
  withModifiers(MiscellaneousTable, "Os+", "", 4096),

  // Double
  withModifiers(MiscellaneousTable, "Control + Alt +", "", 768),
  withModifiers(MiscellaneousTable, "Control + AltGr +", "", 1280),
  withModifiers(MiscellaneousTable, "Control + Shift +", "", 2304),
  withModifiers(MiscellaneousTable, "Control + Os +", "", 4352),
  withModifiers(MiscellaneousTable, "Alt + AltGr +", "", 1536),
  withModifiers(MiscellaneousTable, "Alt + Shift +", "", 2560),
  withModifiers(MiscellaneousTable, "Alt + Os +", "", 4608),
  withModifiers(MiscellaneousTable, "AltGr + Shift +", "", 3072),
  withModifiers(MiscellaneousTable, "AltGr + Os +", "", 5120),
  withModifiers(MiscellaneousTable, "Shift + Os +", "", 6144),

  // Triple
  withModifiers(MiscellaneousTable, "Control + Alt + AltGr +", "", 1792),
  withModifiers(MiscellaneousTable, "Meh +", "", 2816),
  withModifiers(MiscellaneousTable, "Control + Alt + Os +", "", 4864),
  withModifiers(MiscellaneousTable, "Control + AltGr + Shift +", "", 3328),
  withModifiers(MiscellaneousTable, "Control + AltGr + Os +", "", 5376),
  withModifiers(MiscellaneousTable, "Control + Shift + Os +", "", 6400),
  withModifiers(MiscellaneousTable, "Alt + AltGr + Shift +", "", 3584),
  withModifiers(MiscellaneousTable, "Alt + AltGr + Os +", "", 5632),
  withModifiers(MiscellaneousTable, "Alt + Shift + Os +", "", 6656),
  withModifiers(MiscellaneousTable, "AltGr + Shift + Os +", "", 7168),

  // Quad
  withModifiers(MiscellaneousTable, "Meh + AltGr +", "", 3840),
  withModifiers(MiscellaneousTable, "Control + Alt + AltGr + Os +", "", 5888),
  withModifiers(MiscellaneousTable, "Hyper+", "", 6912),
  withModifiers(MiscellaneousTable, "Control + AltGr + Shift + Os +", "", 7424),
  withModifiers(MiscellaneousTable, "Alt + AltGr + Shift + Os +", "", 7680),

  // All
  withModifiers(MiscellaneousTable, "Hyper + AltGr +", "", 7936),
];

export default MiscellaneousTable;
export { ModifiedMiscellaneousTables };

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

import {
  IconToolsEjectSm,
  IconMediaSoundLessSm,
  IconMediaSoundMoreSm,
  IconMediaPlayPauseSm,
  IconMediaStopSm,
  IconMediaForwardSm,
  IconMediaSoundMuteSm,
  IconMediaRewindSm,
  IconToolsCameraSm,
  IconToolsCalculatorSm,
  IconToolsBrightnessMoreSm,
  IconToolsBrightnessLessSm,
  IconMediaShuffleSm,
} from "@Renderer/component/Icon";
import React from "react";

const MediaControlTable = {
  groupName: "Media",
  keys: [
    {
      code: 18658,
      labels: {
        top: "",
        primary: <IconMediaSoundMuteSm />,
        verbose: "Mute",
      },
    },
    {
      code: 18613,
      labels: {
        top: "",
        primary: <IconMediaForwardSm />,
        verbose: "Next track",
      },
    },
    {
      code: 18614,
      labels: {
        top: "",
        primary: <IconMediaRewindSm />,
        verbose: "Prev. track",
      },
    },
    {
      code: 18615,
      labels: {
        top: "",
        primary: <IconMediaStopSm />,
        verbose: "Stop",
      },
    },
    {
      code: 18637,
      labels: {
        top: "",
        primary: <IconMediaPlayPauseSm />,
        verbose: "Play / pause",
      },
    },
    {
      code: 18665,
      labels: {
        top: "",
        primary: <IconMediaSoundMoreSm />,
        verbose: "Volume up",
      },
    },
    {
      code: 18667,
      labels: {
        top: "",
        primary: <IconMediaSoundLessSm />,
        verbose: "Volume down",
      },
    },
    {
      code: 18616,
      labels: {
        top: "",
        primary: <IconToolsEjectSm />,
        verbose: "Eject",
      },
    },
    {
      code: 18552,
      labels: {
        top: "",
        primary: <IconToolsCameraSm />,
        verbose: "Camera",
      },
    },
    {
      code: 18543,
      labels: {
        top: "Display",
        primary: <IconToolsBrightnessMoreSm />,
        verbose: "Bright +",
      },
    },
    {
      code: 18544,
      labels: {
        top: "Display",
        primary: <IconToolsBrightnessLessSm />,
        verbose: "Bright -",
      },
    },
    {
      code: 18834,
      labels: {
        top: "",
        primary: <IconToolsCalculatorSm />,
        verbose: "Calc",
      },
    },
    {
      code: 18617,
      labels: {
        top: "Shuf.",
        primary: <IconMediaShuffleSm />,
        verbose: "Shuffle",
      },
    },
  ],
};

export default MediaControlTable;

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
  IconToolsEject,
  IconMediaSoundLess,
  IconMediaSoundMore,
  IconMediaPlayPause,
  IconMediaStop,
  IconMediaForward,
  IconMediaSoundMute,
  IconMediaRewind,
  IconToolsCamera,
  IconToolsCalculator,
  IconBrightnessMore,
  IconToolsBrightnessLess,
  IconMediaShuffle,
} from "@Renderer/components/atoms/icons";
import React from "react";

const MediaControlTable = {
  groupName: "Media",
  keys: [
    {
      code: 19682,
      labels: {
        top: "",
        primary: <IconMediaSoundMute size="sm" />,
        verbose: "Mute",
      },
    },
    {
      code: 22709,
      labels: {
        top: "",
        primary: <IconMediaForward size="sm" />,
        verbose: "Next track",
      },
    },
    {
      code: 22710,
      labels: {
        top: "",
        primary: <IconMediaRewind size="sm" />,
        verbose: "Prev. track",
      },
    },
    {
      code: 22711,
      labels: {
        top: "",
        primary: <IconMediaStop size="sm" />,
        verbose: "Stop",
      },
    },
    {
      code: 22733,
      labels: {
        top: "",
        primary: <IconMediaPlayPause size="sm" />,
        verbose: "Play / pause",
      },
    },
    {
      code: 23785,
      labels: {
        top: "",
        primary: <IconMediaSoundMore size="sm" />,
        verbose: "Volume up",
      },
    },
    {
      code: 23786,
      labels: {
        top: "",
        primary: <IconMediaSoundLess size="sm" />,
        verbose: "Volume down",
      },
    },
    {
      code: 22712,
      labels: {
        top: "",
        primary: <IconToolsEject size="sm" />,
        verbose: "Eject",
      },
    },
    {
      code: 18552,
      labels: {
        top: "",
        primary: <IconToolsCamera size="sm" />,
        verbose: "Camera",
      },
    },
    {
      code: 23663,
      labels: {
        top: "Display",
        primary: <IconBrightnessMore size="sm" />,
        verbose: "Bright +",
      },
    },
    {
      code: 23664,
      labels: {
        top: "Display",
        primary: <IconToolsBrightnessLess size="sm" />,
        verbose: "Bright -",
      },
    },
    {
      code: 18834,
      labels: {
        top: "",
        primary: <IconToolsCalculator size="sm" />,
        verbose: "Calc",
      },
    },
    {
      code: 22713,
      labels: {
        top: "Shuf.",
        primary: <IconMediaShuffle size="sm" />,
        verbose: "Shuffle",
      },
    },
  ],
};

export default MediaControlTable;

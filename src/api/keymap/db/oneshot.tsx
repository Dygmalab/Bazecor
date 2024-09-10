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

import React from "react";
import OneShotTag from "@Renderer/components/molecules/KeyTags/OneShotTag";

// const GuiLabels: { [key: string]: string } = {
//   linux: "Linux",
//   win32: "Win",
//   darwin: "Cmd",
// };

// const guiLabel = GuiLabels[process.platform] || "Gui";

const OneShotModifierTable = {
  groupName: "OneShot modifiers",
  keys: [
    {
      code: 49153,
      labels: {
        top: <OneShotTag modifier="control" direction="Left" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="control" direction="Left" size="sm" />,
      },
    },
    {
      code: 49154,
      labels: {
        top: <OneShotTag modifier="shift" direction="Left" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="shift" direction="Left" size="sm" />,
      },
    },
    {
      code: 49155,
      labels: {
        top: <OneShotTag modifier="alt" direction="Left" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="alt" direction="Left" size="sm" />,
      },
    },
    {
      code: 49156,
      labels: {
        top: <OneShotTag modifier="os" direction="Left" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="os" direction="Left" size="sm" />,
      },
    },
    {
      code: 49157,
      labels: {
        top: <OneShotTag modifier="control" direction="Right" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="control" direction="Right" size="sm" />,
      },
    },
    {
      code: 49158,
      labels: {
        top: <OneShotTag modifier="shift" direction="Right" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="shift" direction="Right" size="sm" />,
      },
    },
    {
      code: 49159,
      labels: {
        top: <OneShotTag modifier="altGr" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="altGr" size="sm" />,
      },
    },
    {
      code: 49160,
      labels: {
        top: <OneShotTag modifier="os" direction="Right" size="sm" />,
        primary: "",
        verbose: <OneShotTag modifier="os" direction="Right" size="sm" />,
      },
    },
  ],
};

const OneShotLayerTable = {
  groupName: "OneShot layers",
  keys: [
    {
      code: 49161,
      labels: {
        top: <OneShotTag layerNumber={1} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49162,
      labels: {
        top: <OneShotTag layerNumber={2} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49163,
      labels: {
        top: <OneShotTag layerNumber={3} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49164,
      labels: {
        top: <OneShotTag layerNumber={4} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49165,
      labels: {
        top: <OneShotTag layerNumber={5} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49166,
      labels: {
        top: <OneShotTag layerNumber={6} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49167,
      labels: {
        top: <OneShotTag layerNumber={7} size="sm" />,
        primary: "",
      },
    },
    {
      code: 49168,
      labels: {
        top: <OneShotTag layerNumber={8} size="sm" />,
        primary: "",
      },
    },
  ],
};

export { OneShotModifierTable, OneShotLayerTable };

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
import LayerTag from "@Renderer/components/molecules/KeyTags/LayerTag";
import { BaseKeycodeTableType } from "../types";

const LockLayerTable: BaseKeycodeTableType = {
  groupName: "Lock layer to",
  keys: [
    {
      code: 17408,
      labels: {
        top: <LayerTag type="lock" layerNumber={1} />,
        primary: "",
      },
    },
    {
      code: 17409,
      labels: {
        top: <LayerTag type="lock" layerNumber={2} />,
        primary: "",
      },
    },
    {
      code: 17410,
      labels: {
        top: <LayerTag type="lock" layerNumber={3} />,
        primary: "",
      },
    },
    {
      code: 17411,
      labels: {
        top: <LayerTag type="lock" layerNumber={4} />,
        primary: "",
      },
    },
    {
      code: 17412,
      labels: {
        top: <LayerTag type="lock" layerNumber={5} />,
        primary: "",
      },
    },
    {
      code: 17413,
      labels: {
        top: <LayerTag type="lock" layerNumber={6} />,
        primary: "",
      },
    },
    {
      code: 17414,
      labels: {
        top: <LayerTag type="lock" layerNumber={7} />,
        primary: "",
      },
    },
    {
      code: 17415,
      labels: {
        top: <LayerTag type="lock" layerNumber={8} />,
        primary: "",
      },
    },
    {
      code: 17416,
      labels: {
        top: <LayerTag type="lock" layerNumber={9} />,
        primary: "",
      },
    },
    {
      code: 17417,
      labels: {
        top: <LayerTag type="lock" layerNumber={10} />,
        primary: "",
      },
    },
  ],
};

const ShiftToLayerTable: BaseKeycodeTableType = {
  groupName: "Shift to layer",
  keys: [
    {
      code: 17450,
      labels: {
        top: <LayerTag type="shift" layerNumber={1} />,
        primary: "",
      },
    },
    {
      code: 17451,
      labels: {
        top: <LayerTag type="shift" layerNumber={2} />,
        primary: "",
      },
    },
    {
      code: 17452,
      labels: {
        top: <LayerTag type="shift" layerNumber={3} />,
        primary: "",
      },
    },
    {
      code: 17453,
      labels: {
        top: <LayerTag type="shift" layerNumber={4} />,
        primary: "",
      },
    },
    {
      code: 17454,
      labels: {
        top: <LayerTag type="shift" layerNumber={5} />,
        primary: "",
      },
    },
    {
      code: 17455,
      labels: {
        top: <LayerTag type="shift" layerNumber={6} />,
        primary: "",
      },
    },
    {
      code: 17456,
      labels: {
        top: <LayerTag type="shift" layerNumber={7} />,
        primary: "",
      },
    },
    {
      code: 17457,
      labels: {
        top: <LayerTag type="shift" layerNumber={8} />,
        primary: "",
      },
    },
    {
      code: 17458,
      labels: {
        top: <LayerTag type="shift" layerNumber={9} />,
        primary: "",
      },
    },
    {
      code: 17459,
      labels: {
        top: <LayerTag type="shift" layerNumber={10} />,
        primary: "",
      },
    },
  ],
};

const MoveToLayerTable: BaseKeycodeTableType = {
  groupName: "Move to layer",
  keys: [
    {
      code: 17492,
      labels: {
        top: <LayerTag type="lock" layerNumber={1} />,
        primary: "",
      },
    },
    {
      code: 17493,
      labels: {
        top: <LayerTag type="lock" layerNumber={2} />,
        primary: "",
      },
    },
    {
      code: 17494,
      labels: {
        top: <LayerTag type="lock" layerNumber={3} />,
        primary: "",
      },
    },
    {
      code: 17495,
      labels: {
        top: <LayerTag type="lock" layerNumber={4} />,
        primary: "",
      },
    },
    {
      code: 17496,
      labels: {
        top: <LayerTag type="lock" layerNumber={5} />,
        primary: "",
      },
    },
    {
      code: 17497,
      labels: {
        top: <LayerTag type="lock" layerNumber={6} />,
        primary: "",
      },
    },
    {
      code: 17498,
      labels: {
        top: <LayerTag type="lock" layerNumber={7} />,
        primary: "",
      },
    },
    {
      code: 17499,
      labels: {
        top: <LayerTag type="lock" layerNumber={8} />,
        primary: "",
      },
    },
    {
      code: 17500,
      labels: {
        top: <LayerTag type="lock" layerNumber={9} />,
        primary: "",
      },
    },
    {
      code: 17501,
      labels: {
        top: <LayerTag type="lock" layerNumber={10} />,
        primary: "",
      },
    },
  ],
};

export { LockLayerTable, ShiftToLayerTable, MoveToLayerTable };

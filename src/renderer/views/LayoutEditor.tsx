/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-continue */
/* eslint-disable no-bitwise */
// @ts-nocheck
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

import React, { MouseEvent, useEffect, useState, useCallback, useMemo } from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";
import { ipcRenderer } from "electron";
import fs from "fs";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import customCursor from "@Assets/base/cursorBucket.png";
import { LogoLoaderCentered } from "@Renderer/component/Loader";
import ToastMessage from "@Renderer/component/ToastMessage";
import PropTypes from "prop-types";

import ConfirmationDialog from "@Renderer/component/ConfirmationDialog";
import { CopyFromDialog } from "@Renderer/component/CopyFromDialog";
import { useDevice } from "@Renderer/DeviceContext";

// Modules
import { PageHeader } from "@Renderer/modules/PageHeader";
import ColorEditor from "@Renderer/modules/ColorEditor";
import { KeyPickerKeyboard } from "@Renderer/modules/KeyPickerKeyboard";
import StandardView from "@Renderer/modules/StandardView";

// Components
import { LayerSelector } from "@Renderer/component/Select";
import { RegularButton } from "@Renderer/component/Button";
import { LayoutViewSelector } from "@Renderer/component/ToggleButtons";
import { IconArrowUpWithLine, IconArrowDownWithLine } from "@Renderer/component/Icon";
import { rgb2w, rgbw2b } from "../../api/color";

import Keymap, { KeymapDB } from "../../api/keymap";

import Backup from "../../api/backup";
import i18n from "../i18n";

import Store from "../utils/Store";

const store = Store.getStore();

const Styles = Styled.div`
&.layoutEditor {
  min=height: 100vh;
}
.keyboard-editor {
  min-height: 100vh;
  display: flex;
  flex-flow: column;
  .title-row {
    // margin-bottom: 40px;
  }

  .keyconfig {
    position: absolute;
    bottom: 0;
  }
  .centerSpinner{
    z-index: 199;
    position: absolute;
    margin-left: 40vw;
    margin-top: 25vh;
    font-size: 3em;
  }
  .cancelButton{
    float: right;
  }
}
.buttons-row {
  position: fixed;
  bottom: 20px;
  flex-flow: nowrap;
  height: fit-content;
  padding: 0;
  margin: 0px 15px;
  width: fit-content;
  padding: 4px;
  background: ${({ theme }) => theme.styles.toggleButton.background};
  border-radius: 6px;
  button.btn {
    background: transparent;
  }
  button.btn + button.btn {
    margin-left: 4px;
  }
}
.full-height {
  height: 100%;
}
.layer-col {
  display: flex;
  flex-direction: column;
}

.LayerHolder {
  display: flex;
  flex: 0 0 100%;
  margin: 0 auto;
  min-width: 680px;
  max-width: 1640px;
  svg {
    width: 100%;
  }
}
.standarViewMode .LayerHolder {
  margin-top: 24px;
}
.raiseKeyboard {
  overflow: visible;
  margin: 0 auto;
  max-width: 100%;
  height: auto;
  // max-height: 65vh;
  * {
    -webkit-backface-visibility: hidden;
    // -webkit-transform: translateZ(0) scale(1.0, 1.0);
    //transform: translateZ(0);
  }
}

.standarViewMode .raiseKeyboard {
  margin: 0 auto;
  margin-top: 24px;
  max-height: calc(100vh - 240px);
}
.singleViewMode.color .raiseKeyboard {
  margin: 0 auto;
  margin-top: 24px;
  max-height: calc(100vh - 300px);
}
.singleViewMode.keyboard .raiseKeyboard {
  margin: 0 auto;
  max-height: 45vh;
}

.NeuronLine {
  stroke: ${({ theme }) => theme.styles.neuronStatus.lineStrokeColor};
}
#neuronWrapper {
  &.keyOnFocus .keyOpacity{
    stroke-opacity: 0.4;
  }
  &.keyOnHold .keyOpacity{
    stroke-opacity: 0.2;
  }
  .neuronLights:hover {
    cursor: pointer;
  }
}


.keyBase {
  fill: ${({ theme }) => theme.styles.raiseKeyboard.keyBase};
}
.keyColorOpacity {
  fill-opacity: ${({ theme }) => theme.styles.raiseKeyboard.keyColorOpacity};
}
.keyItem {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: -0.03em;
  .keyContentLabel {
    height: inherit;
    display: flex;
    align-items: center;
    padding: 3px;
    flex-wrap: wrap;
    line-height: 1.1em;
    position: relative;
    -webkit-backface-visibility: hidden;
    -webkit-transform: translateZ(0) scale(1.0, 1.0);
    transform: translateZ(0);
    * {
      -webkit-backface-visibility: hidden;
      -webkit-transform: translateZ(0) scale(1.0, 1.0);
      transform: translateZ(0);
    }
    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      color: ${({ theme }) => theme.styles.raiseKeyboard.contentColor};
      width: 100%;
      li {
        overflow-wrap: break-word;
        word-wrap: break-word;
        hyphens: auto;
      }
    }
    .labelClass-withModifiers {
      margin-bottom: 8px;
    }
    .extraLabel {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.025em;
    }
    .hidden-extraLabel {
      display: none;
    }
    tspan {
      display: inline-block;
    }
  }
  tspan {
    text-anchor: start;
  }
  .shadowHover {
    //transition: all 300ms ease-in-out;
    filter: blur(16px);
    opacity: 0.2;
  }
  .shadowMiddle {
    filter: blur(18px);
    opacity: 0.4;
  }
  &.keyOnFocus {
    .baseShape {
      filter: drop-shadow(0px 4px 0px ${({ theme }) => theme.styles.raiseKeyboard.keyShadow});
    }
    .keyOpacityInternal {
      stroke-opacity: 0.7;
      stroke: ${({ theme }) => theme.styles.raiseKeyboard.keyOnFocusBorder};
    }
    .keyOpacity{
      stroke-opacity: 0.2;
      stroke: ${({ theme }) => theme.styles.raiseKeyboard.keyOnFocusBorder};
    }
    .shadowHover {
      filter: blur(16px);
      opacity: 0.6;
    }
    .keyAnimation {
      //animation: pulse-black 2s linear infinite;
    }
  }
  &:hover {
    cursor: pointer;
    .shadowHover {
      // filter: blur(16px);
      // opacity: 0.6;
    }
  }
}
.keyContentModifiers {
  .labelModifier {
    display: flex;
    flex-wrap: wrap;
    position: absolute;
    bottom: 6px;
    list-style: none;
    padding: 0;
    margin: 0;
    margin-left: 6px;
    margin-right: -1px;
    &.extraBottom {
      margin-left: 1px;
      li {
        margin-left: 1px;
        margin-right: 0;
      }
    }
    li {
      padding: 0px 3px;
      border-radius: 3px;

      display: inline-block;
      margin: 1px;

      font-size: 10px;
      font-weight: 600;
      letter-spacing: -0.03em;
      color: ${({ theme }) => theme.styles.raiseKeyboard.modifier.color};
      background: ${({ theme }) => theme.styles.raiseKeyboard.modifier.background};
      box-shadow: ${({ theme }) => theme.styles.raiseKeyboard.modifier.boxShadow};
    }
  }
}
.keyAnimation {
  stroke-opacity: 0;
  stroke-linecap: round;
}
// @keyframes pulse-black {
//   from {
//     stroke-opacity: 0;
//   }
//   to {
//     stroke-opacity: 0.8;
//   }
// }
.underGlowStrip {
  .underGlowStripStroke {
      stroke-opacity: 0.5;
  }
  .underGlowStripShadow {
    //transition: all 300ms ease-in-out;
    filter: blur(12px);
    opacity: 0.8;
  }
  &.keyOnFocus {
    // filter: drop-shadow(0px 1px 1px white);
    .underGlowStripShadow {
      filter: blur(4px);
      opacity: 1;
    }
    .underGlowStripStroke {
      stroke-opacity: 0.8;
      stroke: ${({ theme }) => theme.styles.raiseKeyboard.keyOnFocusBorder};
    }
  }
  &.clickAble:hover {
    cursor: pointer;
    .underGlowStripShadow {
      filter: blur(4px);
      opacity: 1;
    }
  }
}
.layoutEditor.color.colorSelected .keyItem:hover,
.layoutEditor.color.colorSelected .underGlowStrip:hover {
  cursor: url(${customCursor}) 12 12, auto;
}

.defy-t2 .keyContentLabelRotate {
  transform: rotate(3deg) translate(1px,-1px);
}
.defy-t3 .keyContentLabelRotate {
  transform: rotate(10deg) translate(9px, -1px);
}
.defy-t4 .keyContentLabelRotate {
  transform: rotate(37deg) translate(26px,-18px);
}
.defy-t6 .keyContentLabelRotate {
  transform: rotate(5deg) translate(2px,-5px);
}
.defy-t7 .keyContentLabelRotate {
  transform: rotate(15deg) translate(12px,-5px);
}
.defy-t8 .keyContentLabelRotate {
  transform: rotate(54deg) translate(52px,-77px);
}


.defy-tR2 .keyContentLabelRotate {
  transform: rotate(-5deg) translate(5px,1px);
}

.defy-tR2 .keyContentLabelRotate {
  transform: rotate(-5deg) translate(5px,1px);
}
.defy-tR3 .keyContentLabelRotate {
  transform: rotate(-25deg) translate(-2px,18px);
}
.defy-tR4 .keyContentLabelRotate {
  transform: rotate(-54deg) translate(-36px,26px);
}
.defy-tR6 .keyContentLabelRotate {
  transform: rotate(-8deg) translate(4px,4px);
}
.defy-tR7 .keyContentLabelRotate {
  transform: rotate(-46deg) translate(-24px,24px);
}
.defy-tR8 .keyContentLabelRotate {
  transform: rotate(-60deg) translate(-47px,8px)
}

`;

interface LayoutEditorProps {
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  setLoadingData: (lding: boolean) => void;
  theme: any;
  inContext: boolean;
  darkMode: boolean;
  isSending: boolean;
  setIsSending: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutEditor: React.FC<LayoutEditorProps> = (props): React.JSX.Element => {
  const defaultLayerNames = useMemo(
    () => [
      {
        id: 0,
        name: "L1",
      },
      {
        id: 1,
        name: "L2",
      },
      {
        id: 2,
        name: "L3",
      },
      {
        id: 3,
        name: "L4",
      },
      {
        id: 4,
        name: "L5",
      },
      {
        id: 5,
        name: "L6",
      },
      {
        id: 6,
        name: "L7",
      },
      {
        id: 7,
        name: "L8",
      },
      {
        id: 8,
        name: "L9",
      },
      {
        id: 9,
        name: "L10",
      },
    ],
    [],
  );

  const bkp = new Backup();

  const [currentLayer, setCurrentLayer] = useState(0);
  const [previousLayer, setPreviousLayer] = useState(0);
  const [layerNames, setLayerNames] = useState([]);
  const [neuronID, setNeuronID] = useState("");
  const [currentKeyIndex, setCurrentKeyIndex] = useState(-1);
  const [currentLedIndex, setCurrentLedIndex] = useState(-1);
  const [keymap, setKeymap] = useState({
    custom: [],
    default: [],
    onlyCustom: false,
  });
  const [palette, setPalette] = useState([]);
  const [colorMap, setColorMap] = useState([]);
  const [macros, setMacros] = useState([]);
  const [superkeys, setSuperkeys] = useState([]);

  const [modified, setModified] = useState(false);
  const [modeselect, setModeselect] = useState("keyboard");
  const [deviceName, setDeviceName] = useState("");
  const [clearConfirmationOpen, setClearConfirmationOpen] = useState(false);
  const [copyFromOpen, setCopyFromOpen] = useState(false);
  const [isMultiSelected, setIsMultiSelected] = useState(false);
  const [isColorButtonSelected, setIsColorButtonSelected] = useState(false);
  const [currentLanguageLayout, setCurrentLanguageLayout] = useState("english");
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [showNeuronModal, setShowNeuronModal] = useState(false);
  const [isStandardView, setIsStandardView] = useState(
    store.get("settings.isStandardView") !== undefined ? (store.get("settings.isStandardView") as boolean) : false,
  );
  const [showStandardView, setShowStandardView] = useState(false);
  const [layoutSelectorPosition, setLayoutSelectorPosition] = useState({
    x: 0,
    y: 0,
  });
  const [isWireless, setIsWireless] = useState(false);

  const [ledIndexStart, setLedIndexStart] = useState(69);
  const [selectedPaletteColor, setSelectedPaletteColor] = useState(-1);

  const [scanned, setScanned] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deviceState] = useDevice();
  const [layerData, setLayerData] = useState([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [keymapDB, setkeymapDB] = useState(new KeymapDB());
  const { darkMode, inContext, cancelContext, isSending, setIsSending, onDisconnect, startContext, setLoadingData, theme } =
    props;

  const onLayerNameChange = (newName: string) => {
    const slicedLayerNames = layerNames.slice();
    slicedLayerNames[currentLayer] = {
      id: currentLayer,
      name: newName,
    };
    setLayerNames(slicedLayerNames);
    const neurons = store.get("neurons") as any;
    console.log(`changed layer ${currentLayer} name to: ${newName}`, slicedLayerNames);
    neurons[neuronID].layers = slicedLayerNames;
    store.set("neurons", neurons);
  };

  const superTranslator = (raw: string | any[], sSuper: string | any[]) => {
    let superkey = [];
    const skeys = [];
    let iter = 0;
    let superindex = 0;

    if (raw === "") {
      return [];
    }
    // console.log(raw, raw.length);
    while (raw.length > iter) {
      // console.log(iter, raw[iter], superkey);
      if (raw[iter] === 0) {
        skeys[superindex] = { actions: superkey, name: "", id: superindex };
        superindex += 1;
        superkey = [];
      } else {
        superkey.push(raw[iter]);
      }
      iter += 1;
    }
    skeys[superindex] = { actions: superkey, name: "", id: superindex };
    console.log(`Got Superkeys:${JSON.stringify(skeys)} from ${raw}`);

    if (
      skeys[0].actions === undefined ||
      (skeys[0].actions.length === 1 && skeys[0].actions[0] === 0) ||
      skeys[0].actions.filter(v => v === 0).length === skeys.length - 1
    )
      return [];
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    let finalSuper = [];
    console.log("Checking superkeys and stored superkeys", skeys, sSuper);
    finalSuper = skeys.map((superk, i) => {
      if (sSuper !== undefined && sSuper.length > i && sSuper.length > 0) {
        const aux = superk;
        aux.name = sSuper[i] ? sSuper[i]?.name : "";
        return aux;
      }
      const aux = superk;
      aux.name = "";
      return aux;
    });
    console.log("final superkeys", finalSuper);
    return finalSuper;
  };

  const macroTranslator = useCallback(
    (raw: any, storeMacros: any) => {
      if (raw === "") {
        return [
          {
            actions: [
              { keyCode: 229, type: 6, id: 0 },
              { keyCode: 11, type: 8, id: 1 },
              { keyCode: 229, type: 7, id: 2 },
              { keyCode: 8, type: 8, id: 3 },
              { keyCode: 28, type: 8, id: 4 },
              { keyCode: 54, type: 8, id: 5 },
              { keyCode: 44, type: 8, id: 6 },
              { keyCode: 229, type: 6, id: 7 },
              { keyCode: 7, type: 8, id: 8 },
              { keyCode: 229, type: 7, id: 9 },
              { keyCode: 28, type: 8, id: 10 },
              { keyCode: 10, type: 8, id: 11 },
              { keyCode: 16, type: 8, id: 12 },
              { keyCode: 4, type: 8, id: 13 },
              { keyCode: 23, type: 8, id: 14 },
              { keyCode: 8, type: 8, id: 15 },
            ],
            id: 0,
            macro: "RIGHT SHIFT H RIGHT SHIFT E Y , SPACE RIGHT SHIFT D RIGHT SHIFT Y G M A T E",
            name: "Hey, Dygmate!",
          },
        ];
      }
      // Translate received macros to human readable text
      let i = 0;
      let iter = 0;
      let kcs = 0;
      let type = 0;
      let keyCode = [];
      let actions = [];
      let mcros = [];
      actions = [];
      while (raw.length > iter) {
        if (kcs > 0) {
          keyCode.push(raw[iter]);
          kcs -= 1;
          iter += 1;
          continue;
        }
        if (iter !== 0 && type !== 0) {
          actions.push({
            type,
            keyCode,
          });
          keyCode = [];
        }
        type = raw[iter];
        switch (type) {
          case 0:
            kcs = 0;
            mcros[i] = { actions, id: i, name: "", macro: "" };
            i += 1;
            actions = [];
            iter += 1;
            continue;
          case 1:
            kcs = 4;
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            kcs = 2;
            break;
          default:
            kcs = 1;
        }
        iter += 1;
      }
      actions.push({
        type,
        keyCode,
      });
      mcros[i] = {};
      mcros[i].actions = actions;
      mcros[i].id = i;
      mcros[i].name = "";
      mcros[i].macro = "";
      mcros = mcros.map(macro => {
        const aux = macro.actions.map((action: { type: any; keyCode: any[] }) => {
          switch (action.type) {
            case 1:
              return {
                type: action.type,
                keyCode: [(action.keyCode[0] << 8) + action.keyCode[1], (action.keyCode[2] << 8) + action.keyCode[3]],
              };
            case 2:
            case 3:
            case 4:
            case 5:
              return {
                type: action.type,
                keyCode: (action.keyCode[0] << 8) + action.keyCode[1],
              };
            default:
              return {
                type: action.type,
                keyCode: action.keyCode[0],
              };
          }
        });
        return { ...macro, actions: aux };
      });
      // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
      let finalMacros = [];
      console.log(mcros, storeMacros);
      if (storeMacros === undefined) {
        return mcros;
      }
      finalMacros = mcros.map((macro, idx) => {
        if (storeMacros.length > idx && storeMacros.length > 0) {
          const aux = macro;
          aux.name = storeMacros[idx].name;
          aux.macro = macro.actions.map((k: { keyCode: any }) => keymapDB.parse(k.keyCode).label).join(" ");
          return aux;
        }
        return macro;
      });

      return finalMacros;
    },
    [keymapDB],
  );

  const getColormap = useCallback(async () => {
    const { currentDevice } = deviceState;
    const layerSize = currentDevice.device.keyboardUnderglow.rows * currentDevice.device.keyboardUnderglow.columns;
    const chunk = (a: string | any[], chunkSize: number) => {
      const R = [];
      for (let i = 0; i < a.length; i += chunkSize) R.push(a.slice(i, i + chunkSize));
      return R;
    };

    const paletteData = await currentDevice.command("palette");
    const colorMapData = await currentDevice.command("colormap.map");

    const plette =
      currentDevice.device.RGBWMode !== true
        ? chunk(
            paletteData
              .split(" ")
              .filter((v: string | any[]) => v.length > 0)
              .map((k: string) => parseInt(k, 10)),
            3,
          ).map(color => ({
            r: color[0],
            g: color[1],
            b: color[2],
            rgb: `rgb(${color[0]}, ${color[1]}, ${color[2]})`,
          }))
        : chunk(
            paletteData
              .split(" ")
              .filter((v: string | any[]) => v.length > 0)
              .map((k: string) => parseInt(k, 10)),
            4,
          ).map(color => {
            const coloraux = rgbw2b({ r: color[0], g: color[1], b: color[2], w: color[3] });
            return {
              r: coloraux.r,
              g: coloraux.g,
              b: coloraux.b,
              rgb: coloraux.rgb,
            };
          });

    const colMap = chunk(
      colorMapData
        .split(" ")
        .filter((v: string | any[]) => v.length > 0)
        .map((k: string) => parseInt(k, 10)),
      layerSize,
    );

    return {
      palette: plette,
      colorMap: colMap,
    };
  }, [deviceState]);

  const flatten = (arr: any) => [].concat(...arr);

  const updatePalette = async (device: { command: (arg0: string, arg1: any) => any }, plette: any[]) => {
    let args: any[];
    if (deviceState.currentDevice.device.RGBWMode !== true) {
      args = flatten(plette.map((color: { r: any; g: any; b: any }) => [color.r, color.g, color.b])).map(v => v.toString());
    } else {
      const paletteAux = plette.map((color: { r: any; g: any; b: any }) => {
        const aux = rgb2w({ r: color.r, g: color.g, b: color.b });
        return aux;
      });
      args = flatten(paletteAux.map((color: { r: any; g: any; b: any; w: any }) => [color.r, color.g, color.b, color.w])).map(v =>
        v.toString(),
      );
      // console.log(plette, paletteAux, args);
    }

    const result = await device.command("palette", ...args);
    return result;
  };

  const updateColormap = async (device: { command: (arg0: string, arg1: any) => any }, colormap: any) => {
    const args = flatten(colormap).map(v => v.toString());
    const result = await device.command("colormap.map", ...args);
    return result;
  };

  const AnalizeChipID = useCallback(
    async (CID: any) => {
      const { currentDevice } = deviceState;
      let neurons = store.get("neurons") as any;
      let finalNeuron;
      console.log("Neuron ID", CID, neurons);
      if (neurons === undefined) {
        neurons = [];
      }
      if (neurons.some((n: { id: any }) => n.id === CID)) {
        finalNeuron = neurons.find((n: { id: any }) => n.id === CID);
      }
      const neuron = { id: "", name: "", layers: new Array<any>(), macros: new Array<any>(), superkeys: new Array<any>() };
      if (!neurons.some((n: { id: any }) => n.id === CID) && neurons.length === 0) {
        neuron.id = CID;
        neuron.name = currentDevice.device.info.product;
        neuron.layers =
          store.get("layerNames") !== undefined
            ? (store.get("layerNames") as Array<any>).map((name, id) => ({
                id,
                name,
              }))
            : defaultLayerNames;
        neuron.macros =
          store.get("macros") !== undefined
            ? (store.get("macros") as Array<any>).map((macro: { id: any; name: any }) => ({
                id: macro.id,
                name: macro.name,
              }))
            : [];
        neuron.superkeys =
          store.get("superkeys") !== undefined
            ? (store.get("superkeys") as Array<any>).map((sk: { id: any; name: any }) => ({
                id: sk.id,
                name: sk.name,
              }))
            : [];
        console.log("New neuron", neuron);
        neurons = neurons.concat(neuron);
        store.set("neurons", neurons);
        finalNeuron = neuron;
      }
      const existingDefy = neurons.some((n: { id: string | any[] }) => n.id.length < 32);
      const existingRaise = neurons.some((n: { id: string | any[] }) => n.id.length === 32);
      if (!neurons.some((n: { id: any }) => n.id === CID) && neurons.length > 0) {
        neuron.id = CID;
        neuron.name = currentDevice.device.info.product;
        neuron.layers = defaultLayerNames;
        neuron.macros = [];
        neuron.superkeys = [];
        const neuronCopy = JSON.parse(JSON.stringify(neuron));
        neuronCopy.id = CID;
        neuronCopy.name = neurons[0].name;
        neuronCopy.layers = neurons[0].layers;
        neuronCopy.macros = neurons[0].macros;
        neuronCopy.superkeys = neurons[0].superkeys;
        console.log("Additional neuron", neuron);
        let result;
        if (
          (currentDevice.device.info.product === "Defy" && !existingDefy) ||
          (currentDevice.device.info.product === "Raise" && !existingRaise)
        ) {
          result = false;
        } else {
          result = window.confirm(
            "A new Neuron was detected and new settings need to be created. The names of the layers, macros and Superkeys are empty. If you want to copy the names of your default Neuron (first in the list) click ‘Ok’. If you prefer to reset all names click ‘Cancel’.",
          );
        }
        // var result = await userAction;
        // console.log(result, neuron, neuronCopy);
        if (result === false) {
          neurons = neurons.concat(neuron);
          store.set("neurons", neurons);
          finalNeuron = neuron;
        }
        if (result === true) {
          neurons = neurons.concat(neuronCopy);
          store.set("neurons", neurons);
          finalNeuron = neuronCopy;
        }
      }
      console.log("Final neuron", finalNeuron);
      if (finalNeuron) {
        const neuronData = {
          neurons,
          neuronID: neurons.findIndex((n: { id: any }) => n.id === CID),
          layerNames: finalNeuron.layers,
          storedMacros: finalNeuron.macros,
          storedSuper: finalNeuron.superkeys,
        };
        console.log(neuronData);
        return neuronData;
      }
      setLayerNames(finalNeuron.layers);
      return finalNeuron;
    },
    [defaultLayerNames, deviceState],
  );

  const scanKeyboard = useCallback(
    async (lang: string) => {
      console.log("Scanning KEYBOARD");
      const { currentDevice } = deviceState;
      setIsSending(true);
      try {
        /**
         * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
         */
        let chipID = await currentDevice.command("hardware.chip_id");
        chipID = chipID.replace(/\s/g, "");
        const neuronData = await AnalizeChipID(chipID);
        const device = currentDevice.device.info.product;
        const wirelessChecker = currentDevice.device.info.keyboardType === "wireless";
        if (lang) {
          const deviceLang = { ...currentDevice.device, language: true };
          currentDevice.commands.keymap = new Keymap(deviceLang);
          setkeymapDB(currentDevice.commands.keymap.db);
        }

        // let defLayer = await currentDevice.command("settings.defaultLayer");
        // defLayer = parseInt(defLayer, 10) || 0;

        const defaults = await currentDevice.command("keymap.default");
        const custom = await currentDevice.command("keymap.custom");
        const onlyCustom = Boolean(parseInt(await currentDevice.command("keymap.onlyCustom"), 10));
        const KeyMap: { custom: any; default: any; onlyCustom: any } = {
          custom: undefined,
          default: undefined,
          onlyCustom: false,
        };

        const layerSize = currentDevice.device.keyboard.rows * currentDevice.device.keyboard.columns;
        KeyMap.custom = custom
          .split(" ")
          .filter((v: string | any[]) => v.length > 0)
          .map((k: string) => keymapDB.parse(parseInt(k, 10)))
          .reduce((resultArray: any[][], item: any, index: number) => {
            const localResult = resultArray;
            const chunkIndex = Math.floor(index / layerSize);

            if (!localResult[chunkIndex]) {
              localResult[chunkIndex] = []; // start a new chunk
            }
            localResult[chunkIndex].push(item);
            return localResult;
          }, []);
        KeyMap.default = defaults
          .split(" ")
          .filter((v: string | any[]) => v.length > 0)
          .map((k: string) => keymapDB.parse(parseInt(k, 10)))
          .reduce((resultArray: any[][], item: any, index: number) => {
            const localResult = resultArray;
            const chunkIndex = Math.floor(index / layerSize);

            if (!localResult[chunkIndex]) {
              localResult[chunkIndex] = []; // start a new chunk
            }
            localResult[chunkIndex].push(item);
            return localResult;
          }, []);
        KeyMap.onlyCustom = onlyCustom;

        let empty = true;
        for (const layer of KeyMap.custom) {
          for (const i of layer) {
            if (i.keyCode !== 65535) {
              empty = false;
              break;
            }
          }
        }

        // console.log("KEYMAP TEST!!", keymap, keymap.onlyCustom, onlyCustom);
        if (empty && KeyMap.custom.length > 0) {
          console.log("Custom keymap is empty, copying defaults");
          for (let i = 0; i < KeyMap.default.length; i += 1) {
            KeyMap.custom[i] = KeyMap.default[i].slice();
          }
          KeyMap.onlyCustom = true;
          await currentDevice.command("keymap", KeyMap);
        }

        const colormap = await getColormap();
        const plette = colormap.palette.slice();
        // console.log("retrieved color.map & palette", colormap, palette);
        let raw = await currentDevice.command("macros.map");
        if (raw.search(" 0 0") !== -1) {
          raw = raw.split(" 0 0")[0].split(" ").map(Number);
        } else {
          raw = "";
        }
        const parsedMacros = macroTranslator(raw, neuronData.storedMacros);
        let raw2 = await currentDevice.command("superkeys.map");
        if (raw2.search(" 0 0") !== -1) {
          raw2 = raw2.split(" 0 0")[0].split(" ").map(Number);
        } else {
          raw2 = "";
        }
        const parsedSuper = superTranslator(raw2, neuronData.storedSuper);

        if (device === "Defy") {
          setLedIndexStart(70);
        }
        let showMM = false;
        if (KeyMap.custom) {
          const oldmacro = [...Array(64).keys()].map(x => x + 24576);
          // console.log("testing", oldmacro);
          for (let index = 0; index < KeyMap.custom.length; index += 1) {
            // console.log(keymap.custom[index]);
            if (KeyMap.custom[index].some((r: { keyCode: number }) => oldmacro.includes(r.keyCode))) {
              showMM = true;
              break;
            }
          }
        }
        console.log("Saving data using SET!!!", colormap);
        setCurrentLayer(previousLayer);
        setNeuronID(chipID);
        setKeymap(KeyMap);
        setShowDefaults(!KeyMap.onlyCustom);
        setPalette(plette);
        setColorMap(colormap.colorMap);
        setMacros(parsedMacros);
        setSuperkeys(parsedSuper);
        setNeuronID(chipID);
        setDeviceName(device);
        setIsWireless(wirelessChecker);
        setLedIndexStart(ledIndexStart);
        setShowMacroModal(showMM);
        setScanned(true);
        setIsSending(false);
      } catch (e) {
        console.error(e);
        toast.error(e);
        setIsSending(false);
        onDisconnect();
      }
    },
    [
      AnalizeChipID,
      deviceState,
      getColormap,
      keymap.custom.length,
      keymapDB,
      ledIndexStart,
      macroTranslator,
      onDisconnect,
      previousLayer,
      scanned,
      setIsSending,
    ],
  );

  const onKeyChange = (keyCode: any) => {
    // Keys can only change on the custom layers
    const layer = currentLayer;
    const keyIndex = currentKeyIndex;

    if (keyIndex === -1) {
      return;
    }

    const kmap = keymap.custom.slice();
    const l = keymap.onlyCustom ? layer : layer - keymap.default.length;
    kmap[l][keyIndex] = keymapDB.parse(keyCode);

    setModified(true);
    setKeymap({
      default: keymap.default,
      onlyCustom: keymap.onlyCustom,
      custom: kmap,
    });
    startContext();
  };

  /**
   * Verify that colors in keyboard button and in color palette is equal
   * @param {number} colorIdx Number of palette index
   * @param {number} cLayer Number of current layer
   * @param {number} cLedIndex Number of current selected keyboard button
   * @return {boolean}
   */

  const onVerificationColor = (colorIdx: number, cLayer: number, cLedIndex: number): boolean => {
    const currentIndexKeyButton = colorMap[cLayer][cLedIndex];
    return currentIndexKeyButton === colorIdx;
  };

  /**
   * Change state if click control or shift button
   * @param {number} layer Number of current layer
   * @param {number} ledIndex Number of current selected keyboard button
   */
  const onCtrlShiftPress = (layer: number, ledIndex: number) => {
    setSelectedPaletteColor(colorMap[layer][ledIndex]);
    setIsMultiSelected(true);
    setIsColorButtonSelected(true);
  };

  /**
   * Change state if color buton selected
   * @param {number} layer Number of layer in attribute of keyboard button
   * @param {number} cLayer Number of current layer from state
   * @param {number} ledIndex Number of current selected keyboard button
   */
  const onButtonKeyboardColorChange = (cLayer: number, layer: number, ledIndex: number) => {
    const isEqualColor = onVerificationColor(selectedPaletteColor, cLayer, ledIndex);
    if (!(!modified && isEqualColor)) {
      const colormap = colorMap.slice();
      colormap[cLayer][ledIndex] = selectedPaletteColor;
      setSelectedPaletteColor(colorMap[layer][ledIndex]);
      setColorMap(colormap);
      setModified(true);
    }
    startContext();
  };

  const onKeySelect = (event: MouseEvent) => {
    const { currentTarget }: { currentTarget: Element } = event;
    const layer = parseInt(currentTarget.getAttribute("data-layer"), 10);
    const keyIndex = parseInt(currentTarget.getAttribute("data-key-index"), 10);
    const ledIndex = parseInt(currentTarget.getAttribute("data-led-index"), 10);

    if (isStandardView) {
      setShowStandardView(true);
      // console.log("Show Standard View IF: ", showStandardView);
    }

    if (keyIndex === currentKeyIndex && !isStandardView) {
      if (event.ctrlKey || (event.shiftKey && !isColorButtonSelected)) {
        onCtrlShiftPress(layer, ledIndex);
        return;
      }
      setSelectedPaletteColor(null);
      setIsMultiSelected(false);
      setIsColorButtonSelected(false);
      setCurrentKeyIndex(-1);
      setCurrentLedIndex(-1);
      return;
    }

    setCurrentLayer(layer);
    if (colorMap.length > 0 && layer >= 0 && layer < colorMap.length) {
      setCurrentKeyIndex(keyIndex);
      setCurrentLedIndex(ledIndex);
      setModeselect(ledIndex >= ledIndexStart ? "color" : modeselect);
    }
    setCurrentKeyIndex(keyIndex);
    if (event.ctrlKey || event.shiftKey) {
      onCtrlShiftPress(layer, ledIndex);
    } else {
      if (selectedPaletteColor !== null && isMultiSelected && isColorButtonSelected) {
        onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
      if (isColorButtonSelected && !isMultiSelected) {
        setIsMultiSelected(true);
        onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
    }
  };

  const selectLayer = (id: number) => {
    if (id === undefined) return;
    setPreviousLayer(currentLayer);
    setCurrentLayer(id);
  };

  const onApply = async () => {
    const { currentDevice } = deviceState;
    setIsSending(true);
    setIsSaving(true);
    const args = flatten(keymap.custom).map(k => keymapDB.serialize(k));
    await currentDevice.command("keymap.custom", ...args);
    await currentDevice.command("keymap.onlyCustom", keymap.onlyCustom ? 1 : 0);
    await updateColormap(currentDevice, colorMap);
    await updatePalette(currentDevice, palette);
    setCurrentLayer(currentLayer);
    setCurrentKeyIndex(currentKeyIndex);
    setCurrentLedIndex(currentLedIndex);
    setModified(false);
    setIsMultiSelected(false);
    setSelectedPaletteColor(null);
    setIsColorButtonSelected(false);
    const commands = await Backup.Commands(currentDevice);
    const backup = await bkp.DoBackup(commands, neuronID, currentDevice);
    Backup.SaveBackup(backup, currentDevice);
    cancelContext();
    toast.success(
      <ToastMessage
        title={i18n.success.changesSaved}
        content={i18n.success.changesSavedContent}
        icon={<IconArrowDownWithLine />}
      />,
      {
        autoClose: 2000,
        icon: "",
      },
    );
    setIsSending(false);
    setIsSaving(false);
    console.log("Changes saved.");
  };

  const copyFromDialog = () => {
    setCopyFromOpen(true);
  };

  const cancelCopyFrom = () => {
    setCopyFromOpen(false);
  };

  const copyFromLayer = (layer: number) => {
    let newKeymap: any[];

    if (keymap.onlyCustom) {
      newKeymap = layer < 0 ? keymap.default.slice() : keymap.custom.slice();
      newKeymap[currentLayer] = layer < 0 ? keymap.default[layer + keymap.default.length].slice() : keymap.custom[layer].slice();
    } else {
      newKeymap = layer < keymap.default.length ? keymap.default.slice() : keymap.custom.slice();
      newKeymap[currentLayer] =
        layer < keymap.default.length ? keymap.default[layer].slice() : keymap.custom[layer - keymap.default.length].slice();
    }
    const newColormap = colorMap.slice();
    if (newColormap.length > 0) newColormap[currentLayer] = colorMap[layer >= 0 ? layer : currentLayer].slice();

    startContext();
    setColorMap(newColormap);
    setCopyFromOpen(false);
    setModified(true);
    setKeymap({
      default: keymap.default,
      onlyCustom: keymap.onlyCustom,
      custom: newKeymap,
    });
  };

  const clearLayer = () => {
    const newKeymap = keymap.custom.slice();
    const idx = keymap.onlyCustom ? currentLayer : currentLayer - keymap.default.length;
    newKeymap[idx] = Array(newKeymap[0].length)
      .fill({})
      .map(() => ({ keyCode: 65535, label: "", extraLabel: "TRANS", verbose: "Transparent" }));

    const newColormap = colorMap.slice();
    if (newColormap.length > 0) {
      newColormap[idx] = Array(newColormap[0].length)
        .fill(15)
        .map(() => 15);
    }
    startContext();
    setColorMap(newColormap);
    setClearConfirmationOpen(false);
    setModified(true);
    setKeymap({
      default: keymap.default,
      onlyCustom: keymap.onlyCustom,
      custom: newKeymap,
    });
  };

  const confirmClear = () => {
    setClearConfirmationOpen(true);
  };

  const cancelClear = () => {
    setClearConfirmationOpen(false);
  };

  const onColorButtonSelect = (action: string, colorIndex: any) => {
    if (action === "one_button_click") {
      setIsMultiSelected(false);
      setIsColorButtonSelected(!isColorButtonSelected);
      return;
    }
    if (action === "another_button_click") {
      setSelectedPaletteColor(colorIndex);
      setIsColorButtonSelected(true);
    }
  };

  const onColorSelect = (colorIndex: number) => {
    const isEqualColor = onVerificationColor(colorIndex, currentLayer, currentLedIndex);

    if (currentLayer < 0 || currentLayer >= colorMap.length) return;

    if (!isEqualColor) {
      const colormap = colorMap.slice();
      colormap[currentLayer][currentLedIndex] = colorIndex;
      setIsMultiSelected(true);
      setColorMap(colorMap);
      setSelectedPaletteColor(colorIndex);
      setModified(true);
      startContext();
    } else {
      setSelectedPaletteColor(colorIndex);
    }
  };

  const onColorPick = (colorIndex: number, r: any, g: any, b: any) => {
    const newPalette = palette.slice();
    const setColors = (red: any, green: any, blue: any) => ({
      r: red,
      g: green,
      b: blue,
      rgb: `rgb(${red}, ${green}, ${blue})`,
    });
    newPalette[colorIndex] = setColors(r, g, b);
    setPalette(newPalette);
    setModified(true);
    startContext();
  };

  const importLayer = (data: {
    layerNames: string | any[];
    layerName: any;
    keymap: string | any[];
    colormap: string | any[];
  }) => {
    // if (data.palette.length > 0) state.palette = data.palette;
    const lNames = layerNames.slice();
    if (data.layerNames !== null) {
      for (let i = 0; i < data.layerNames.length; i += 1) {
        lNames[i] = data.layerNames[i];
      }
      if (data.layerName && currentLayer) {
        lNames[currentLayer] = data.layerName;
      }
      setLayerNames(lNames);
    }
    if (data.keymap.length > 0 && data.colormap.length > 0) {
      if (keymap.onlyCustom) {
        if (currentLayer >= 0) {
          const newKeymap = keymap.custom.slice();
          newKeymap[currentLayer] = data.keymap.slice();
          const newColormap = colorMap.slice();
          newColormap[currentLayer] = data.colormap.slice();
          setKeymap({
            default: keymap.default,
            custom: newKeymap,
            onlyCustom: keymap.onlyCustom,
          });
          setColorMap(newColormap);
        }
      } else if (currentLayer >= keymap.default.length) {
        const defLength = keymap.default.length;
        const newKeymap = keymap.custom.slice();
        newKeymap[currentLayer - defLength] = data.keymap;
        const newColormap = colorMap.slice();
        newColormap[currentLayer - defLength] = data.colormap.slice();

        setKeymap({
          default: keymap.default,
          custom: newKeymap,
          onlyCustom: keymap.onlyCustom,
        });
        setColorMap(newColormap);
      }
    }
    setModified(true);
    startContext();
  };

  const toChangeAllKeysColor = (colorIndex: any, start: any, end: any) => {
    const colormap = colorMap.slice();
    colormap[currentLayer] = colormap[currentLayer].fill(colorIndex, start, end);
    setColorMap(colormap);
    setModified(true);
    startContext();
  };

  const getLayout = () => {
    const { currentDevice } = deviceState;
    let Layer = {};
    let kbtype = "iso";
    if (currentDevice.device === null) return { Layer: false, kbtype: false };
    try {
      Layer = currentDevice.device.components.keymap;
      kbtype = currentDevice.device && currentDevice.device.info.keyboardType === "ISO" ? "iso" : "ansi";
    } catch (error) {
      console.error("Focus lost connection to Raise: ", error);
      return { Layer: false, kbtype: false };
    }

    return { Layer, kbtype };
  };

  const toImport = async () => {
    const options = {
      title: "Load Layer/s file",
      buttonLabel: "Load Layer/s",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };

    const resp = await ipcRenderer.invoke("open-dialog", options);
    if (!resp.canceled) {
      console.log(resp.filePaths);
      let layers;
      try {
        layers = JSON.parse(fs.readFileSync(resp.filePaths[0], "utf-8"));
        console.log(layers, Array.isArray(layers.keymap));
        if (Array.isArray(layers.keymap)) {
          console.log(layers.keymap[0]);
          importLayer(layers);
          toast.success(
            <ToastMessage
              title={i18n.editor.importSuccessCurrentLayerTitle}
              content={i18n.editor.importSuccessCurrentLayer}
              icon={<IconArrowDownWithLine />}
            />,
            {
              autoClose: 2000,
              icon: "",
            },
          );
        } else {
          console.log(layers.keymap.custom[0]);
          setLayerNames(layers.layerNames);
          setKeymap(layers.keymap);
          setColorMap(layers.colormap);
          setPalette(layers.palette);
          setSuperkeys(layers.superkeys ? layers.superkeys : []);
          setModified(true);
          startContext();
          toast.success(i18n.editor.importSuccessAllLayers, {
            autoClose: 2000,
          });
        }
      } catch (e) {
        console.error(e);
        toast.error(
          <ToastMessage
            title={i18n.errors.preferenceFailOnSave}
            content={i18n.errors.invalidLayerFile}
            icon={<IconArrowDownWithLine />}
          />,
          {
            autoClose: 2000,
            icon: "",
          },
        );
      }
    } else {
      console.log("user closed SaveDialog");
    }
  };

  const toExport = async () => {
    let localLayerData;
    let localIsReadOnly;
    if (keymap.onlyCustom) {
      localIsReadOnly = currentLayer < 0;
      localLayerData = localIsReadOnly ? keymap.default[currentLayer + keymap.default.length] : keymap.custom[currentLayer];
    } else {
      localIsReadOnly = currentLayer < keymap.default.length;
      localLayerData = localIsReadOnly ? keymap.default[currentLayer] : keymap.custom[currentLayer - keymap.default.length];
    }
    const { currentDevice } = deviceState;
    const { info } = currentDevice.device;
    const data = JSON.stringify(
      {
        device: info,
        language: currentLanguageLayout,
        layerNames,
        keymap: localLayerData,
        colormap: colorMap[currentLayer],
        palette,
      },
      null,
      2,
    );
    const options = {
      title: "Save Layer file",
      defaultPath: `${layerNames[currentLayer].name}.json`,
      buttonLabel: "Save Layer",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] },
      ],
    };

    try {
      const path = await ipcRenderer.invoke("save-dialog", options);
      if (typeof path !== "undefined") {
        console.log(path, data);
        fs.writeFileSync(path, data);
        toast.success(
          <ToastMessage
            title={i18n.editor.exportSuccessCurrentLayer}
            content={i18n.editor.exportSuccessCurrentLayerContent}
            icon={<IconArrowUpWithLine />}
          />,
          {
            autoClose: 2000,
            icon: "",
          },
        );
      } else {
        console.log("user closed SaveDialog");
      }
    } catch (error) {
      console.error(error);
      toast.error(
        <ToastMessage
          title={i18n.errors.exportFailed}
          content={i18n.errors.exportError + error}
          icon={<IconArrowUpWithLine />}
        />,
        {
          autoClose: 2000,
          icon: "",
        },
      );
    }
  };

  const toggleNeuronModal = () => {
    if (showNeuronModal) {
      // TODO: Find out why savedReject.reject("cancelled"); is not present anywhere else
    }
    setShowNeuronModal(!showNeuronModal);
  };

  const CloneExistingNeuron = () => {
    // TODO: Find out why  savedResolve.resolve("resolved"); is not present anywhere else
    toast.success("added additional neuron to this Bazecor installation");
    setShowNeuronModal(false);
  };

  const toggleMacroModal = () => {
    setShowMacroModal(!showMacroModal);
  };

  const updateOldMacros = () => {
    const localKeymap = { ...keymap };
    const layers = [];
    const oldmacro = [...Array(64).keys()].map(x => x + 24576);
    for (let index = 0; index < localKeymap.custom.length; index += 1) {
      if (localKeymap.custom[index].some((r: { keyCode: number }) => oldmacro.includes(r.keyCode))) {
        layers.push(index);
        continue;
      }
    }
    for (let index = 0; index < layers.length; index += 1) {
      for (let idx = 0; idx < localKeymap.custom[layers[index]].length; idx += 1) {
        if (oldmacro.includes(localKeymap.custom[layers[index]][idx].keyCode)) {
          localKeymap.custom[layers[index]][idx] = keymapDB.parse(localKeymap.custom[layers[index]][idx].keyCode + 29276);
        }
      }
    }
    setShowMacroModal(false);
    setModified(true);
    setKeymap(localKeymap);
    startContext();
    onApply();
  };

  const layerName = (index: number): string =>
    layerNames.length > index ? layerNames[index].name : defaultLayerNames[index].name;

  const modeSelectToggle = (data: string) => {
    if (isStandardView) {
      if (currentLedIndex > ledIndexStart) {
        setCurrentKeyIndex(-1);
      }
      setModeselect(data);
      setShowStandardView(false);
      setCurrentLedIndex(-1);
    } else {
      setModeselect(data);
      setCurrentLedIndex(-1);
      setSelectedPaletteColor(null);
    }
  };

  const onToggleStandardView = () => {
    setIsStandardView(!isStandardView);
  };

  const closeStandardViewModal = (code: any) => {
    onKeyChange(code);
    setShowStandardView(false);
  };

  const handleSaveStandardView = () => {
    setCurrentKeyIndex(-1);
    setCurrentLedIndex(-1);
    setShowStandardView(false);
    setSelectedPaletteColor(null);
    setIsMultiSelected(false);
    setIsColorButtonSelected(false);
  };

  const exportToPdf = () => {
    toast.info(
      <ToastMessage
        title="Feature not yet ready!"
        content="The feature is not yet ready. its being worked on!"
        icon={<IconArrowUpWithLine />}
      />,
      {
        autoClose: 2000,
        icon: "",
      },
    );
  };

  const refreshLayoutSelectorPosition = (x: any, y: any) => {
    setLayoutSelectorPosition({ x, y });
  };

  const configStandardView = () => {
    try {
      const preferencesStandardView = JSON.parse(store.get("settings.isStandardView", true) as string);
      console.log("preferencesStandardView: ", preferencesStandardView);
      if (preferencesStandardView !== null) {
        return preferencesStandardView;
      }
      return true;
    } catch (e) {
      console.log(e);
      return true;
    }
  };

  useEffect(() => {
    // console.log("going to RUN INITIAL USE EFFECT just ONCE");
    const scanner = async () => {
      await scanKeyboard(currentLanguageLayout);
      // setLoadingData(false);
      setScanned(true);
    };
    if (!scanned && !isSending) {
      scanner();
    }
  }, [currentLanguageLayout, scanned, isSending, scanKeyboard, setLoadingData]);

  useEffect(() => {
    // console.log("Running processAfterScan useEffect");

    const processAfterScan = () => {
      const standardView = configStandardView();
      const newLanguage = store.get("settings.language") as string;
      console.log("Language automatically set to: ", newLanguage);
      setCurrentLanguageLayout(newLanguage || "english");
      setIsStandardView(standardView);
      setLoadingData(false);
      setCurrentLayer(previousLayer !== 0 ? previousLayer : 0);
    };
    if (scanned) {
      processAfterScan();
      // setScanned(false);
    }
  }, [previousLayer, scanned, setLoadingData]);

  useEffect(() => {
    // console.log("Running Scanner on changes useEffect");
    const scanner = async () => {
      console.log("props", inContext, modified);
      if (modified === true && inContext === false) {
        setLoadingData(true);
        setCurrentLayer(previousLayer !== 0 ? previousLayer : 0);
        setCurrentKeyIndex(-1);
        setCurrentLedIndex(-1);
        setKeymap({
          custom: [],
          default: [],
          onlyCustom: false,
        });
        setPalette([]);
        await scanKeyboard(currentLanguageLayout);
        setModified(false);
        setLoadingData(false);
      }
    };
    scanner();
  }, [
    currentLanguageLayout,
    inContext,
    keymap.custom.length,
    modified,
    previousLayer,
    scanKeyboard,
    setIsSending,
    setLoadingData,
  ]);

  useEffect(() => {
    // console.log("Running StandardView useEffect", isStandardView);
    store.set("settings.isStandardView", isStandardView);
  }, [isStandardView]);

  useEffect(() => {
    // console.log("Running LayerData useEffect");
    const localShowDefaults = store.get("settings.showDefaults") as boolean;
    let cLayer = currentLayer;

    if (!localShowDefaults) {
      if (currentLayer < keymap.default.length && !keymap.onlyCustom) {
        cLayer = 0;
      }
    }

    let localLayerData;
    let localIsReadOnly;
    if (keymap.onlyCustom) {
      localIsReadOnly = cLayer < 0;
      localLayerData = localIsReadOnly ? keymap.default[cLayer + keymap.default.length] : keymap.custom[cLayer];
    } else {
      localIsReadOnly = cLayer < keymap.default.length;
      localLayerData = localIsReadOnly ? keymap.default[cLayer] : keymap.custom[cLayer - keymap.default.length];
    }

    if (localLayerData !== undefined) {
      localLayerData = localLayerData.map((key: { extraLabel: string; keyCode: number; label: string }) => {
        const newMKey = key;
        if (key.extraLabel === "MACRO") {
          const MNumber = key.keyCode - 53852;
          if (
            macros[MNumber] !== undefined &&
            macros[MNumber].name !== undefined &&
            macros[MNumber].name.substr(0, 5) !== "" &&
            !/\p{L}/u.test(key.label)
          ) {
            console.log("macros:", macros);
            newMKey.label = macros[MNumber].name.substr(0, 5);
          }
        }
        return newMKey;
      });
    }

    if (localLayerData !== undefined && superkeys.length > 0) {
      localLayerData = localLayerData.map((key: { extraLabel: string; keyCode: number; label: string }) => {
        const newSKey = key;
        if (key.extraLabel === "SUPER") {
          const SKNumber = key.keyCode - 53980;
          if (
            superkeys.length > SKNumber &&
            superkeys[SKNumber] !== undefined &&
            superkeys[SKNumber].name !== undefined &&
            superkeys[SKNumber].name !== "" &&
            !/\p{L}/u.test(key.label)
          ) {
            newSKey.label = superkeys[SKNumber].name.substr(0, 5);
          }
        }
        return newSKey;
      });
    }
    console.log("SAVING USEFFECT!!:", localLayerData, localIsReadOnly, localShowDefaults, cLayer);
    setLayerData(localLayerData);
    setIsReadOnly(localIsReadOnly);
    setShowDefaults(localShowDefaults);
    setCurrentLayer(cLayer);
  }, [keymap, currentLayer, macros, superkeys]);

  const { Layer, kbtype } = getLayout();
  if (!Layer) {
    return <div />;
  }

  const copyCustomItems = keymap.custom.map((_: any, index: number) => {
    const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
    const label = `${(idx + 1).toString()}: ${layerName(idx)}`;
    return {
      index: idx,
      label,
    };
  });

  const copyDefaultItems =
    showDefaults &&
    keymap.default.map((_, index) => {
      const idx = index - (keymap.onlyCustom ? keymap.default.length : 0);
      const label = idx.toString();
      return {
        index: idx,
        label,
      };
    });
  const copyFromLayerOptions = (copyDefaultItems || []).concat(copyCustomItems);

  const layerMenu =
    keymap && keymap.custom.length > 0
      ? keymap.custom.map((_, index) => {
          const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
          return {
            name: layerName(idx),
            id: idx,
          };
        })
      : [];

  let code: number | any = 0;
  if (currentKeyIndex !== -1 && currentLedIndex < ledIndexStart) {
    const tempkey = keymapDB.parse(layerData[currentKeyIndex].keyCode);
    // console.log("Key to be used in render", tempkey);
    code = keymapDB.keySegmentator(tempkey.keyCode);
  }
  let actions = [code !== null ? code.base + code.modified : 0, 0, 0, 0, 0];
  let superName = "";
  if (code !== null) {
    if (
      code.modified + code.base > 53980 &&
      code.modified + code.base < 54108 &&
      superkeys[code.base + code.modified - 53980] !== undefined
    ) {
      actions = superkeys[code.base + code.modified - 53980].actions;
      superName = superkeys[code.base + code.modified - 53980].name;
    }
  }

  // console.log("execution that may not render");
  if (layerData === undefined || layerData.length < 1) return <LogoLoaderCentered />;
  // console.log("GOING TO RENDER!!!");

  const layer = (
    // TODO: restore fade effect <fade in appear key={currentLayer}>
    <div className="LayerHolder">
      <Layer
        readOnly={isReadOnly}
        index={currentLayer}
        keymap={layerData}
        onKeySelect={onKeySelect}
        selectedKey={currentKeyIndex}
        selectedLED={currentLedIndex}
        palette={palette}
        colormap={colorMap[currentLayer]}
        theme={theme}
        darkMode={darkMode}
        style={{ width: "50vw" }}
        showUnderglow={modeselect !== "keyboard"}
        className="raiseKeyboard layer"
        isStandardView={isStandardView}
      />
    </div>
    // </fade>
  );

  return (
    <Styles className="layoutEditor">
      <Container
        fluid
        className={`keyboard-editor ${modeselect} ${isStandardView ? "standarViewMode" : "singleViewMode"} ${
          typeof selectedPaletteColor === "number" ? "colorSelected" : ""
        }`}
      >
        <PageHeader
          text={i18n.app.menu.editor}
          showSaving
          isSaving={isSaving}
          contentSelector={
            <LayerSelector
              onSelect={selectLayer}
              itemList={layerMenu}
              selectedItem={currentLayer}
              subtitle={i18n.editor.layers.title}
              updateItem={onLayerNameChange}
              exportFunc={toExport}
              importFunc={toImport}
              clearFunc={confirmClear}
              copyFunc={copyFromDialog}
              editModeActual={modeselect}
              editModeFunc={modeSelectToggle}
              exportToPdf={exportToPdf}
            />
          }
          colorEditor={
            <ColorEditor
              key={JSON.stringify(palette)}
              colors={palette}
              disabled={isReadOnly || currentLayer > colorMap.length}
              onColorSelect={onColorSelect}
              colorButtonIsSelected={isColorButtonSelected}
              onColorPick={onColorPick}
              colorsInUse={palette.map((color, idx) => {
                const presence = colorMap.map(lx => lx.find((x: number) => x === idx));
                if (presence.find(x => x !== undefined) !== undefined) return true;
                return false;
              })}
              selected={selectedPaletteColor}
              isColorButtonSelected={isColorButtonSelected}
              onColorButtonSelect={onColorButtonSelect}
              toChangeAllKeysColor={toChangeAllKeysColor}
              deviceName={deviceName}
            />
          }
          isColorActive={modeselect !== "keyboard"}
          saveContext={onApply}
          destroyContext={() => {
            console.log("cancelling context: ", props);
            cancelContext();
          }}
          inContext={modified}
        />
        <Row className="full-height keyboardsWrapper">
          <Col className="raise-editor layer-col">
            <Row className="dygma-keyboard-editor editor">{layer}</Row>
            {modeselect === "keyboard" && !isStandardView ? (
              <Row className="ordinary-keyboard-editor m-0">
                <KeyPickerKeyboard
                  onKeySelect={onKeyChange}
                  code={code}
                  macros={macros}
                  superkeys={superkeys}
                  actions={actions}
                  action={0}
                  superName={superName}
                  keyIndex={currentKeyIndex}
                  actTab="editor"
                  selectedlanguage={currentLanguageLayout}
                  kbtype={kbtype}
                  layoutSelectorPosition={layoutSelectorPosition}
                  refreshLayoutSelectorPosition={refreshLayoutSelectorPosition}
                  isWireless={isWireless}
                />
              </Row>
            ) : null}
          </Col>
        </Row>

        {/* WHY: We want to hide the selector when we cannot use it (e.g. when color editor is active) */}
        {modeselect === "keyboard" ? (
          <LayoutViewSelector
            onToggle={onToggleStandardView}
            isStandardView={isStandardView}
            tooltip={i18n.editor.superkeys.tooltip}
            layoutSelectorPosition={layoutSelectorPosition}
          />
        ) : null}

        <ConfirmationDialog
          title={i18n.editor.clearLayerQuestion}
          text={i18n.editor.clearLayerPrompt}
          open={clearConfirmationOpen}
          onConfirm={clearLayer}
          onCancel={cancelClear}
        >
          {i18n.editor.clearLayerPrompt}
        </ConfirmationDialog>
        <CopyFromDialog
          open={copyFromOpen}
          onCopy={copyFromLayer}
          onCancel={cancelCopyFrom}
          layers={copyFromLayerOptions}
          currentLayer={currentLayer}
        />
      </Container>

      <Modal show={showMacroModal} size="lg" onHide={toggleMacroModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.editor.oldMacroModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="body">
          <p>{i18n.editor.oldMacroModal.body}</p>
          <p className="italic">{i18n.editor.oldMacroModal.body2}</p>
        </Modal.Body>
        <Modal.Footer>
          <RegularButton
            buttonText={i18n.editor.oldMacroModal.cancelButton}
            styles="outline transp-bg"
            size="sm"
            onClick={toggleMacroModal}
          />
          <RegularButton
            buttonText={i18n.editor.oldMacroModal.applyButton}
            styles="outline gradient"
            size="sm"
            onClick={updateOldMacros}
          />
        </Modal.Footer>
      </Modal>
      <Modal show={showNeuronModal} size="lg" onHide={toggleNeuronModal} aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.editor.oldNeuronModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>{i18n.editor.oldNeuronModal.body}</p>
          <p className="italic">{i18n.editor.oldNeuronModal.body2}</p>
        </Modal.Body>
        <Modal.Footer>
          <RegularButton
            buttonText={i18n.editor.oldNeuronModal.cancelButton}
            styles="outline transp-bg"
            size="sm"
            onClick={toggleNeuronModal}
          />
          <RegularButton
            buttonText={i18n.editor.oldNeuronModal.applyButton}
            styles="outline gradient"
            size="sm"
            onClick={CloneExistingNeuron}
          />
        </Modal.Footer>
      </Modal>

      {modeselect === "keyboard" && isStandardView ? (
        <StandardView
          showStandardView={showStandardView}
          closeStandardView={closeStandardViewModal}
          handleSave={handleSaveStandardView}
          onKeySelect={onKeyChange}
          macros={macros}
          superkeys={superkeys}
          actions={actions}
          action={0}
          superName={superName}
          keyIndex={currentKeyIndex}
          code={code}
          layerData={layerData}
          actTab="editor"
          selectedlanguage={currentLanguageLayout}
          kbtype={kbtype}
          isStandardView={isStandardView}
          isWireless={isWireless}
        />
      ) : (
        ""
      )}
    </Styles>
  );
};

LayoutEditor.propTypes = {
  onDisconnect: PropTypes.func,
  startContext: PropTypes.func,
  cancelContext: PropTypes.func,
  setLoadingData: PropTypes.func,
  inContext: PropTypes.bool,
  theme: PropTypes.shape({}),
  darkMode: PropTypes.bool,
  isSending: PropTypes.bool,
  setIsSending: PropTypes.func,
};

export default LayoutEditor;

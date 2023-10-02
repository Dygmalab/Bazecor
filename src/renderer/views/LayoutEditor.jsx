/* eslint-disable no-continue */
/* eslint-disable no-bitwise */
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

import React, { useEffect, useState } from "react";
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
function LayoutEditor(props) {
  const defaultLayerNames = [
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
  ];

  const bkp = new Backup();

  const initialState = {
    currentLayer: 0,
    previousLayer: 0,
    layerNames: [],
    currentKeyIndex: -1,
    currentLedIndex: -1,
    previousKeyIndex: 0,
    previousLedIndex: 0,
    modified: false,
    saving: false,
    keymap: {
      custom: [],
      default: [],
      onlyCustom: false,
    },
    palette: [],
    colorMap: [],
    macros: [],
    superkeys: [],
    storedMacros: [],
    storedSuper: [],
    registered: false,
    chipID: "",
    modeselect: "keyboard",
    clearConfirmationOpen: false,
    copyFromOpen: false,
    shareLayerOpen: false,
    importExportDialogOpen: false,
    isMultiSelected: false,
    isColorButtonSelected: false,
    currentLanguageLayout: "",
    showMacroModal: false,
    showNeuronModal: false,
    isStandardView: store.get("settings.isStandardView"),
    showStandardView: false,
    layoutSelectorPosition: { x: 0, y: 0 },
    isWireless: false,
    inContext: false,
  };

  const [state, setState] = useState(initialState);
  const [deviceState, deviceDispatcher] = useDevice();

  let keymapDB = new KeymapDB();

  const onLayerNameChange = newName => {
    const { layerNames, currentLayer, neuronID } = state;
    const slicedLayerNames = layerNames.slice();
    slicedLayerNames[currentLayer] = {
      id: currentLayer,
      name: newName,
    };
    state.layerNames = slicedLayerNames;
    const neurons = store.get("neurons");
    console.log(`changed layer ${currentLayer} name to: ${newName}`, slicedLayerNames);
    neurons[neuronID].layers = slicedLayerNames;
    store.set("neurons", neurons);
  };

  const superTranslator = raw => {
    let superkey = [];
    const superkeys = [];
    let iter = 0;
    let superindex = 0;

    if (raw === "") {
      return [];
    }
    // console.log(raw, raw.length);
    while (raw.length > iter) {
      // console.log(iter, raw[iter], superkey);
      if (raw[iter] === 0) {
        superkeys[superindex] = { actions: superkey, name: "", id: superindex };
        superindex += 1;
        superkey = [];
      } else {
        superkey.push(raw[iter]);
      }
      iter += 1;
    }
    superkeys[superindex] = { actions: superkey, name: "", id: superindex };
    console.log(`Got Superkeys:${JSON.stringify(superkeys)} from ${raw}`);

    if (
      superkeys[0].actions === undefined ||
      (superkeys[0].actions.length === 1 && superkeys[0].actions[0] === 0) ||
      superkeys[0].actions.filter(v => v === 0).length === superkeys[0].length - 1
    )
      return [];
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    let finalSuper = [];
    let stored = [];
    // console.log(state.neurons, state.neuronID, superkeys);
    if (state.neurons !== undefined) {
      stored = state.neurons[state.neuronID].superkeys;
    }
    console.log(superkeys, stored);
    finalSuper = superkeys.map((superk, i) => {
      if (stored.length > i && stored.length > 0) {
        const aux = superk;
        aux.name = stored[i] ? stored[i]?.name : "";
        return aux;
      }
      const aux = superk;
      aux.name = "";
      return aux;
    });
    console.log("final superkeys", finalSuper);
    return finalSuper;
  };

  const macroTranslator = raw => {
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
    let macros = [];
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
          macros[i] = {};
          macros[i].actions = actions;
          macros[i].id = i;
          macros[i].name = "";
          macros[i].macro = "";
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
    macros[i] = {};
    macros[i].actions = actions;
    macros[i].id = i;
    macros[i].name = "";
    macros[i].macro = "";
    macros = macros.map(macro => {
      const aux = macro.actions.map(action => {
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
    const stored = state.storedMacros;
    console.log(macros, stored);
    if (stored === undefined) {
      return macros;
    }
    finalMacros = macros.map((macro, idx) => {
      if (stored.length > idx && stored.length > 0) {
        const aux = macro;
        aux.name = stored[idx].name;
        aux.macro = macro.actions.map(k => keymapDB.parse(k.keyCode).label).join(" ");
        return aux;
      }
      return macro;
    });

    return finalMacros;
  };

  const getColormap = async () => {
    const { currentDevice } = deviceState;
    const layerSize = currentDevice.device.keyboardUnderglow.rows * currentDevice.device.keyboardUnderglow.columns;

    const chunk = (a, chunkSize) => {
      const R = [];
      for (let i = 0; i < a.length; i += chunkSize) R.push(a.slice(i, i + chunkSize));
      return R;
    };

    const paletteData = await currentDevice.command("palette");
    const colorMapData = await currentDevice.command("colormap.map");

    const palette =
      currentDevice.device.RGBWMode !== true
        ? chunk(
            paletteData
              .split(" ")
              .filter(v => v.length > 0)
              .map(k => parseInt(k, 10)),
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
              .filter(v => v.length > 0)
              .map(k => parseInt(k, 10)),
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

    const colorMap = chunk(
      colorMapData
        .split(" ")
        .filter(v => v.length > 0)
        .map(k => parseInt(k, 10)),
      layerSize,
    );

    return {
      palette,
      colorMap,
    };
  };

  const flatten = arr => [].concat(...arr);

  const updatePalette = async (device, palette) => {
    let args;
    if (deviceState.currentDevice.device.RGBWMode !== true) {
      args = flatten(palette.map(color => [color.r, color.g, color.b])).map(v => v.toString());
    } else {
      const paletteAux = palette.map(color => {
        const aux = rgb2w({ r: color.r, g: color.g, b: color.b });
        return aux;
      });
      args = flatten(paletteAux.map(color => [color.r, color.g, color.b, color.w])).map(v => v.toString());
      console.log(palette, paletteAux, args);
    }

    const result = await device.command("palette", ...args);
    return result;
  };

  const updateColormap = async (device, colormap) => {
    const args = flatten(colormap).map(v => v.toString());
    const result = await device.command("colormap.map", ...args);
    return result;
  };

  const AnalizeChipID = async chipID => {
    const { currentDevice } = deviceState;
    let neurons = store.get("neurons");
    let finalNeuron;
    console.log("Neuron ID", chipID, neurons);
    if (neurons === undefined) {
      neurons = [];
    }
    if (neurons.some(n => n.id === chipID)) {
      finalNeuron = neurons.find(n => n.id === chipID);
    }
    if (!neurons.some(n => n.id === chipID) && neurons.length === 0) {
      const neuron = {};
      neuron.id = chipID;
      neuron.name = currentDevice.device.info.product;
      neuron.layers =
        store.get("layerNames") !== undefined
          ? store.get("layerNames").map((name, id) => ({
              id,
              name,
            }))
          : defaultLayerNames;
      neuron.macros =
        store.get("macros") !== undefined
          ? store.get("macros").map(macro => ({
              id: macro.id,
              name: macro.name,
            }))
          : [];
      neuron.superkeys =
        store.get("superkeys") !== undefined
          ? store.get("superkeys").map(sk => ({
              id: sk.id,
              name: sk.name,
            }))
          : [];
      console.log("New neuron", neuron);
      neurons = neurons.concat(neuron);
      store.set("neurons", neurons);
      finalNeuron = neuron;
    }
    const existingDefy = neurons.some(n => n.id.length < 32);
    const existingRaise = neurons.some(n => n.id.length === 32);
    if (!neurons.some(n => n.id === chipID) && neurons.length > 0) {
      const neuron = {};
      neuron.id = chipID;
      neuron.name = currentDevice.device.info.product;
      neuron.layers = defaultLayerNames;
      neuron.macros = [];
      neuron.superkeys = [];
      const neuronCopy = {};
      neuronCopy.id = chipID;
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
        result = await window.confirm(
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
    state.neurons = neurons;
    state.neuronID = neurons.findIndex(n => n.id === chipID);
    state.layerNames = finalNeuron.layers;
    state.storedMacros = finalNeuron.macros;
    state.storedSuper = finalNeuron.superkeys;
    setState({ ...state });
    return finalNeuron;
  };

  const scanKeyboard = async lang => {
    const { currentDevice } = deviceState;
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      const chipID = await currentDevice.command("hardware.chip_id");
      const registered = await AnalizeChipID(chipID.replace(/\s/g, ""));
      const device = currentDevice.device.info.product;
      const wirelessChecker = currentDevice.device.info.keyboardType === "wireless";
      if (lang) {
        const deviceLang = { ...currentDevice.device, language: true };
        currentDevice.commands.keymap = new Keymap(deviceLang);
        keymapDB = currentDevice.commands.keymap.db;
      }

      let defLayer = await currentDevice.command("settings.defaultLayer");
      defLayer = parseInt(defLayer, 10) || 0;

      const defaults = await currentDevice.command("keymap.default");
      const custom = await currentDevice.command("keymap.custom");
      const onlyCustom = Boolean(parseInt(await currentDevice.command("keymap.onlyCustom"), 10));
      const keymap = { custom: undefined, default: undefined, onlyCustom: false };

      const layerSize = currentDevice.device.keyboard.rows * currentDevice.device.keyboard.columns;
      keymap.custom = custom
        .split(" ")
        .filter(v => v.length > 0)
        .map(k => keymapDB.parse(parseInt(k, 10)))
        .reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / layerSize);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      keymap.default = defaults
        .split(" ")
        .filter(v => v.length > 0)
        .map(k => keymapDB.parse(parseInt(k, 10)))
        .reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / layerSize);

          if (!resultArray[chunkIndex]) {
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      keymap.onlyCustom = onlyCustom;

      let empty = true;
      for (const layer of keymap.custom) {
        for (const i of layer) {
          if (i.keyCode !== 65535) {
            empty = false;
            break;
          }
        }
      }

      // console.log("KEYMAP TEST!!", keymap, keymap.onlyCustom, onlyCustom);
      if (empty && keymap.custom.length > 0) {
        console.log("Custom keymap is empty, copying defaults");
        for (let i = 0; i < keymap.default.length; i += 1) {
          keymap.custom[i] = keymap.default[i].slice();
        }
        keymap.onlyCustom = true;
        await currentDevice.command("keymap", keymap);
      }

      const colormap = await getColormap(layerSize);
      const palette = colormap.palette.slice();
      // console.log("retrieved color.map & palette", colormap, palette);
      let raw = await currentDevice.command("macros.map");
      if (raw.search(" 0 0") !== -1) {
        raw = raw.split(" 0 0")[0].split(" ").map(Number);
      } else {
        raw = "";
      }
      const parsedMacros = macroTranslator(raw);
      let raw2 = await currentDevice.command("superkeys.map");
      if (raw2.search(" 0 0") !== -1) {
        raw2 = raw2.split(" 0 0")[0].split(" ").map(Number);
      } else {
        raw2 = "";
      }
      const parsedSuper = superTranslator(raw2);

      let ledIndexStart = 69;
      if (device === "Defy") {
        ledIndexStart = 70;
      }
      state.currentLayer = state.previousLayer;
      state.defaultLayer = defLayer;
      state.keymap = keymap;
      state.showDefaults = !keymap.onlyCustom;
      state.palette = palette;
      state.colorMap = colormap.colorMap;
      state.macros = parsedMacros;
      state.superkeys = parsedSuper;
      state.registered = registered;
      state.chipID = chipID;
      state.deviceName = device;
      state.isWireless = wirelessChecker;
      state.ledIndexStart = ledIndexStart;
      if (keymap.custom) {
        const oldmacro = [...Array(64).keys()].map(x => x + 24576);
        // console.log("testing", oldmacro);
        for (let index = 0; index < keymap.custom.length; index += 1) {
          // console.log(keymap.custom[index]);
          if (keymap.custom[index].some(r => oldmacro.includes(r.keyCode))) {
            state.showMacroModal = true;
            break;
          }
        }
      }
      console.log("sending State");
      setState({ ...state });
    } catch (e) {
      console.error(e);
      toast.error(e);
      props.onDisconnect();
    }
  };

  const onKeyChange = keyCode => {
    // Keys can only change on the custom layers
    const layer = state.currentLayer;
    const keyIndex = state.currentKeyIndex;

    if (keyIndex === -1) {
      return;
    }

    const keymap = state.keymap.custom.slice();
    const l = state.keymap.onlyCustom ? layer : layer - state.keymap.default.length;
    keymap[l][keyIndex] = keymapDB.parse(keyCode);
    state.keymap = {
      default: state.keymap.default,
      onlyCustom: state.keymap.onlyCustom,
      custom: keymap,
    };
    state.modified = true;
    setState({ ...state });
    props.startContext();
  };

  /**
   * Verificate that colors in keyboard button and in color palette is equal
   * @param {number} colorIndex Number of palette index
   * @param {number} currentLayer Number of current layer
   * @param {number} currentLedIndex Number of current selected keyboard button
   */

  const onVerificationColor = (colorIndex, currentLayer, currentLedIndex) => {
    const { colorMap } = state;
    const currentIndexKeyButton = colorMap[currentLayer][currentLedIndex];
    return currentIndexKeyButton === colorIndex;
  };

  /**
   * Change state if click control or shift button
   * @param {number} layer Number of current layer
   * @param {number} ledIndex Number of current selected keyboard button
   */
  const onCtrlShiftPress = (layer, ledIndex) => {
    state.selectedPaletteColor = state.colorMap[layer][ledIndex];
    state.isMultiSelected = true;
    state.isColorButtonSelected = true;
    setState({ ...state });
  };

  /**
   * Change state if color buton selected
   * @param {number} layer Number of layer in attribute of keyboard button
   * @param {number} currentLayer Number of current layer from state
   * @param {number} ledIndex Number of current selected keyboard button
   */
  const onButtonKeyboardColorChange = (currentLayer, layer, ledIndex) => {
    const { selectedPaletteColor, modified } = state;
    const isEqualColor = onVerificationColor(selectedPaletteColor, currentLayer, ledIndex);
    if (!(!modified && isEqualColor)) {
      const colormap = state.colorMap.slice();
      colormap[currentLayer][ledIndex] = state.selectedPaletteColor;
      props.startContext();
      state.selectedPaletteColor = state.colorMap[layer][ledIndex];
      state.colorMap = colormap;
      state.modified = true;
      setState({ ...state });
    }
  };

  const onKeySelect = event => {
    const {
      selectedPaletteColor,
      currentLayer,
      isMultiSelected,
      isColorButtonSelected,
      currentKeyIndex,
      isStandardView,
      showStandardView,
    } = state;
    const { currentTarget } = event;
    const layer = parseInt(currentTarget.getAttribute("data-layer"), 10);
    const keyIndex = parseInt(currentTarget.getAttribute("data-key-index"), 10);
    const ledIndex = parseInt(currentTarget.getAttribute("data-led-index"), 10);

    if (isStandardView) {
      state.showStandardView = true;
      setState({ ...state });
      // console.log("Show Standard View IF: ", showStandardView);
    }

    if (keyIndex === currentKeyIndex && !isStandardView) {
      if (event.ctrlKey || (event.shiftKey && !isColorButtonSelected)) {
        onCtrlShiftPress(layer, ledIndex);
        return;
      }
      state.currentKeyIndex = -1;
      state.currentLedIndex = -1;
      state.selectedPaletteColor = null;
      state.isMultiSelected = false;
      state.isColorButtonSelected = false;
      setState({ ...state });
      return;
    }

    if (state.colorMap.length > 0 && layer >= 0 && layer < state.colorMap.length) {
      state.currentLayer = layer;
      state.currentKeyIndex = keyIndex;
      state.currentLedIndex = ledIndex;
      state.modeselect = ledIndex >= state.ledIndexStart ? "color" : state.modeselect;
    }
    state.currentLayer = layer;
    state.currentKeyIndex = keyIndex;
    setState({ ...state });

    if (event.ctrlKey || event.shiftKey) {
      onCtrlShiftPress(layer, ledIndex);
    } else {
      if (selectedPaletteColor !== null && isMultiSelected && isColorButtonSelected) {
        onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
      if (isColorButtonSelected && !isMultiSelected) {
        state.isMultiSelected = true;
        setState({ ...state });
        onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
    }
  };

  const selectLayer = id => {
    if (id === undefined) return;
    state.currentLayer = id;
    setState({ ...state });
  };

  const onApply = async () => {
    const { keymap, colorMap, palette } = state;
    const { currentDevice } = deviceState;
    state.saving = true;
    const args = flatten(keymap.custom).map(k => keymapDB.serialize(k));
    await currentDevice.command("keymap.custom", ...args);
    await currentDevice.command("keymap.onlyCustom", keymap.onlyCustom ? 1 : 0);
    await updateColormap(currentDevice, colorMap);
    await updatePalette(currentDevice, palette);
    state.modified = false;
    state.saving = false;
    state.previousKeyIndex = state.currentKeyIndex;
    state.previousLedIndex = state.currentLedIndex;
    state.previousLayer = state.currentLayer;
    state.isMultiSelected = false;
    state.selectedPaletteColor = null;
    state.isColorButtonSelected = false;
    const commands = await Backup.Commands(currentDevice);
    const backup = await bkp.DoBackup(commands, state.neurons[state.neuronID].id, currentDevice);
    Backup.SaveBackup(backup, currentDevice);
    setState({ ...state });
    props.cancelContext();
    console.log("Changes saved.");
  };

  const copyFromDialog = () => {
    state.copyFromOpen = true;
    setState({ ...state });
  };

  const cancelCopyFrom = () => {
    state.copyFromOpen = false;
    setState({ ...state });
  };

  const copyFromLayer = layer => {
    let newKeymap;

    if (state.keymap.onlyCustom) {
      newKeymap = layer < 0 ? state.keymap.default.slice() : state.keymap.custom.slice();
      newKeymap[state.currentLayer] =
        layer < 0 ? state.keymap.default[layer + state.keymap.default.length].slice() : state.keymap.custom[layer].slice();
    } else {
      newKeymap = layer < state.keymap.default.length ? state.keymap.default.slice() : state.keymap.custom.slice();
      newKeymap[state.currentLayer] =
        layer < state.keymap.default.length
          ? state.keymap.default[layer].slice()
          : state.keymap.custom[layer - state.keymap.default.length].slice();
    }
    const newColormap = state.colorMap.slice();
    if (newColormap.length > 0) newColormap[state.currentLayer] = state.colorMap[layer >= 0 ? layer : state.currentLayer].slice();

    props.startContext();
    state.colorMap = newColormap;
    state.keymap = {
      default: state.keymap.default,
      onlyCustom: state.keymap.onlyCustom,
      custom: newKeymap,
    };
    state.copyFromOpen = false;
    state.modified = true;
    setState({ ...state });
  };

  const clearLayer = () => {
    const newKeymap = state.keymap.custom.slice();
    const idx = state.keymap.onlyCustom ? state.currentLayer : state.currentLayer - state.keymap.default.length;
    newKeymap[idx] = Array(newKeymap[0].length)
      .fill()
      .map(() => ({ keyCode: 65535, label: "", extraLabel: "TRANS", verbose: "Transparent" }));

    const newColormap = state.colorMap.slice();
    if (newColormap.length > 0) {
      newColormap[idx] = Array(newColormap[0].length)
        .fill()
        .map(() => 15);
    }
    props.startContext();
    state.keymap = {
      default: state.keymap.default,
      onlyCustom: state.keymap.onlyCustom,
      custom: newKeymap,
    };
    state.colorMap = newColormap;
    state.modified = true;
    state.clearConfirmationOpen = false;
    setState({ ...state });
  };

  const confirmClear = () => {
    state.clearConfirmationOpen = true;
    setState({ ...state });
  };

  const cancelClear = () => {
    state.clearConfirmationOpen = false;
    setState({ ...state });
  };

  const onColorButtonSelect = (action, colorIndex) => {
    const { isColorButtonSelected } = state;
    if (action === "one_button_click") {
      state.isMultiSelected = false;
      state.isColorButtonSelected = !isColorButtonSelected;
      setState({ ...state });
      return;
    }
    if (action === "another_button_click") {
      state.selectedPaletteColor = colorIndex;
      state.isColorButtonSelected = true;
      setState({ ...state });
    }
  };

  const onColorSelect = colorIndex => {
    const { currentLayer, currentLedIndex, colorMap } = state;

    const isEqualColor = onVerificationColor(colorIndex, currentLayer, currentLedIndex);

    if (currentLayer < 0 || currentLayer >= colorMap.length) return;

    if (!isEqualColor) {
      const colormap = state.colorMap.slice();
      colormap[currentLayer][currentLedIndex] = colorIndex;
      state.isMultiSelected = true;
      state.colorMap = colormap;
      state.selectedPaletteColor = colorIndex;
      state.modified = true;
      setState({ ...state });
      props.startContext();
    } else {
      state.selectedPaletteColor = colorIndex;
      setState({ ...state });
    }
  };

  const onColorPick = (colorIndex, r, g, b) => {
    const newPalette = state.palette.slice();
    const setColors = (red, green, blue) => ({
      r: red,
      g: green,
      b: blue,
      rgb: `rgb(${red}, ${green}, ${blue})`,
    });
    newPalette[colorIndex] = setColors(r, g, b);
    state.palette = newPalette;
    state.modified = true;
    setState({ ...state });
    props.startContext();
  };

  const importLayer = data => {
    if (data.palette.length > 0) state.palette = data.palette;
    setState({ ...state });
    const layerNames = state.layerNames.slice();
    const { currentLayer } = state;
    if (data.layerNames !== null) {
      for (let i = 0; i < data.layerNames.length; i += 1) {
        layerNames[i] = data.layerNames[i];
      }
      if (data.layerName && currentLayer) {
        layerNames[currentLayer] = data.layerName;
      }
      state.layerNames = layerNames;
      setState({ ...state });
    }
    if (data.keymap.length > 0 && data.colormap.length > 0) {
      if (state.keymap.onlyCustom) {
        if (currentLayer >= 0) {
          const newKeymap = state.keymap.custom.slice();
          newKeymap[currentLayer] = data.keymap.slice();
          const newColormap = state.colorMap.slice();
          newColormap[currentLayer] = data.colormap.slice();
          state.keymap = {
            default: state.keymap.default,
            custom: newKeymap,
            onlyCustom: state.keymap.onlyCustom,
          };
          state.colorMap = newColormap;
          setState({ ...state });
        }
      } else if (currentLayer >= state.keymap.default.length) {
        const defLength = state.keymap.default.length;
        const newKeymap = state.keymap.custom.slice();
        newKeymap[currentLayer - defLength] = data.keymap;
        const newColormap = state.colorMap.slice();
        newColormap[currentLayer - defLength] = data.colormap.slice();
        state.keymap = {
          default: state.keymap.default,
          custom: newKeymap,
          onlyCustom: state.keymap.onlyCustom,
        };
        state.colorMap = newColormap;
        setState({ ...state });
      }
    }
    state.modified = true;
    setState({ ...state });
    props.startContext();
    toCloseImportExportDialog();
  };

  /**
   * Close ImportExportDialog component
   */
  const toCloseImportExportDialog = () => {
    state.importExportDialogOpen = false;
    setState({ ...state });
  };

  const toChangeAllKeysColor = (colorIndex, start, end) => {
    const { currentLayer } = state;
    const colormap = state.colorMap.slice();
    colormap[currentLayer] = colormap[currentLayer].fill(colorIndex, start, end);
    state.colorMap = colormap;
    state.modified = true;
    setState({ ...state });
    props.startContext();
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
        layers = JSON.parse(fs.readFileSync(resp.filePaths[0]));
        console.log(Array.isArray(layers.keymap));
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
          state.layerNames = layers.layerNames;
          state.keymap = layers.keymap;
          state.colorMap = layers.colormap;
          state.palette = layers.palette;
          state.superkeys = layers.superkeys ? layers.superkeys : [];
          state.modified = true;
          setState({ ...state });
          props.startContext();
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
    const { layerNames, keymap, currentLayer } = state;
    let layerData;
    let isReadOnly;
    if (keymap.onlyCustom) {
      isReadOnly = currentLayer < 0;
      layerData = isReadOnly ? keymap.default[currentLayer + keymap.default.length] : keymap.custom[currentLayer];
    } else {
      isReadOnly = currentLayer < keymap.default.length;
      layerData = isReadOnly ? keymap.default[currentLayer] : keymap.custom[currentLayer - keymap.default.length];
    }
    const { currentDevice } = deviceState;
    const { info } = currentDevice.device;
    const data = JSON.stringify(
      {
        device: info,
        language: state.currentLanguageLayout,
        layerNames,
        keymap: layerData,
        colormap: state.colorMap[currentLayer],
        palette: state.palette,
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

  const toExportAll = async () => {
    const { keymap, colorMap, palette, superkeys, layerNames } = state;
    const data = JSON.stringify(
      {
        layerNames,
        keymap,
        colormap: colorMap,
        palette,
        superkeys,
      },
      null,
      2,
    );
    const options = {
      title: "Backup Layers file",
      defaultPath: "Layers.json",
      buttonLabel: "Backup Layers",
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
            title={i18n.editor.exportSuccessAllLayers}
            content={i18n.editor.exportSuccessAllLayers}
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
      toast.error(i18n.errors.exportError + error, {
        autoClose: 2000,
      });
    }
  };

  const toggleNeuronModal = () => {
    if (state.showNeuronModal) {
      state.savedReject.reject("cancelled");
    }
    state.showNeuronModal = !state.showNeuronModal;
    setState({ ...state });
  };

  const CloneExistingNeuron = () => {
    state.savedResolve.resolve("resolved");
    toast.success("added additional neuron to this Bazecor installation");
    state.showNeuornModal = false;
    setState({ ...state });
  };

  const toggleMacroModal = () => {
    state.showMacroModal = !state.showMacroModal;
    setState({ ...state });
  };

  const updateOldMacros = () => {
    const { keymap } = state;
    const layers = [];
    const oldmacro = [...Array(64).keys()].map(x => x + 24576);
    for (let index = 0; index < keymap.custom.length; index += 1) {
      if (keymap.custom[index].some(r => oldmacro.includes(r.keyCode))) {
        layers.push(index);
        continue;
      }
    }
    for (let index = 0; index < layers.length; index += 1) {
      for (let idx = 0; idx < keymap.custom[layers[index]].length; idx += 1) {
        if (oldmacro.includes(keymap.custom[layers[index]][idx].keyCode)) {
          keymap.custom[layers[index]][idx] = keymapDB.parse(keymap.custom[layers[index]][idx].keyCode + 29276);
        }
      }
    }
    state.showMacroModal = false;
    state.modified = true;
    state.keymap = keymap;
    setState({ ...state });
    props.startContext();
    onApply();
  };

  const layerName = index => (state.layerNames.length > index ? state.layerNames[index].name : defaultLayerNames[index]);

  const modeSelectToggle = data => {
    if (state.isStandardView) {
      if (state.currentLedIndex > state.ledIndexStart) {
        state.currentKeyIndex = -1;
      }
      state.modeselect = data;
      state.showStandardView = false;
      state.currentLedIndex = -1;
    } else {
      state.modeselect = data;
    }
    setState({ ...state });
  };

  const onToggle = () => {
    state.isStandardView = !state.isStandardView;
    setState({ ...state });
  };

  const closeStandardViewModal = code => {
    onKeyChange(code);
    state.showStandardView = false;
    setState({ ...state });
  };

  const handleSaveStandardView = () => {
    state.showStandardView = false;
    state.currentKeyIndex = -1;
    state.currentLedIndex = -1;
    state.selectedPaletteColor = null;
    state.isMultiSelected = false;
    state.isColorButtonSelected = false;
    setState({ ...state });
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

  const refreshLayoutSelectorPosition = (x, y) => {
    state.layoutSelectorPosition = { x, y };
    setState({ ...state });
    // console.log("Triggered function refresh position :", state.layoutSelectorPosition);
  };

  useEffect(() => {
    const configStandarView = async () => {
      try {
        const preferencesStandardView = JSON.parse(store.get("settings.isStandardView", true));
        // const preferencesStandardView = false;
        // console.log("Preferences StandardView", preferencesStandardViewJSON);
        console.log("preferencesStandardView: ", preferencesStandardView);
        // const preferencesStandardView = false;
        if (preferencesStandardView !== null) {
          state.isStandardView = preferencesStandardView;
        } else {
          state.isStandardView = true;
        }
        setState({ ...state });
      } catch (e) {
        console.log(e);
        state.isStandardView = true;
        setState({ ...state });
      }
    };
    const scanner = async () => {
      await scanKeyboard().then(() => {
        const { keymap } = state;
        const defLayer = state.defaultLayer >= 126 ? 0 : state.defaultLayer;
        let initialLayer = 0;

        if (!store.get("settings.showDefaults")) {
          if (defLayer < keymap.default.length) {
            initialLayer = keymap.onlyCustom ? 0 : keymap.default.length;
          }
        }

        state.currentLayer = state.previousLayer !== 0 ? state.previousLayer : initialLayer;
        setState({ ...state });
      });
      const newLanguage = store.get("settings.language");
      console.log("Language automatically set to: ", newLanguage);
      state.currentLanguageLayout = newLanguage || "english";
      setState({ ...state });
      await configStandarView();
    };
    scanner();
  }, []);

  useEffect(() => {
    const { inContext } = props;
    // console.log("props", inContext, state.inContext);
    if (state.inContext === true && inContext === false) {
      state.currentLayer = state.previousLayer !== 0 ? state.previousLayer : 0;
      state.currentKeyIndex = -1;
      state.currentLedIndex = -1;
      state.keymap = {
        custom: [],
        default: [],
        onlyCustom: false,
      };
      state.palette = [];
      state.modified = false;
      state.inContext = true;
      scanKeyboard();
      setState({ ...state });
    }
  }, [props]);

  useEffect(() => {
    store.set("settings.isStandardView", state.isStandardView);
    console.log("Did update: ", state.isStandardView);
  }, [state.isStandardView]);

  const {
    keymap,
    palette,
    isColorButtonSelected,
    currentLayer,
    currentKeyIndex,
    currentLedIndex,
    currentLanguageLayout,
    macros,
    superkeys,
    isStandardView,
    ledIndexStart,
    layoutSelectorPosition,
    isWireless,
  } = state;

  const { Layer, kbtype } = getLayout();
  if (!Layer) {
    return <div />;
  }
  const showDefaults = store.get("settings.showDefaults");
  let cLayer = currentLayer;

  if (!showDefaults) {
    if (currentLayer < keymap.default.length && !keymap.onlyCustom) {
      cLayer = 0;
    }
  }

  let layerData;
  let isReadOnly;
  if (keymap.onlyCustom) {
    isReadOnly = cLayer < 0;
    layerData = isReadOnly ? keymap.default[cLayer + keymap.default.length] : keymap.custom[cLayer];
  } else {
    isReadOnly = cLayer < keymap.default.length;
    layerData = isReadOnly ? keymap.default[cLayer] : keymap.custom[cLayer - keymap.default.length];
  }

  if (layerData !== undefined) {
    layerData = layerData.map(key => {
      const newMKey = key;
      if (key.extraLabel === "MACRO") {
        if (
          macros.length > parseInt(key.label, 10) &&
          macros[parseInt(key.label, 10)] !== undefined &&
          macros[parseInt(key.label, 10)].name !== undefined &&
          macros[parseInt(key.label, 10)].name.substr(0, 5) !== "" &&
          !/\p{L}/u.test(key.label)
        ) {
          newMKey.label = macros[parseInt(key.label, 10)].name.substr(0, 5);
        }
      }
      return newMKey;
    });
  }

  if (layerData !== undefined && superkeys.length > 0) {
    layerData = layerData.map(key => {
      const newSKey = key;
      if (key.extraLabel === "SUPER") {
        if (
          superkeys.length > parseInt(key.label, 10) - 1 &&
          superkeys[parseInt(key.label, 10) - 1] !== undefined &&
          superkeys[parseInt(key.label, 10) - 1].name !== undefined &&
          superkeys[parseInt(key.label, 10) - 1].name !== "" &&
          !/\p{L}/u.test(key.label)
        ) {
          newSKey.label = superkeys[parseInt(key.label, 10) - 1].name.substr(0, 5);
        }
      }
      return newSKey;
    });
  }

  const layer = (
    // TODO: restore fade effect <fade in appear key={currentLayer}>
    <div className="LayerHolder">
      <Layer
        readOnly={isReadOnly}
        index={cLayer}
        keymap={layerData}
        onKeySelect={onKeySelect}
        selectedKey={state.currentKeyIndex}
        selectedLED={state.currentLedIndex}
        palette={state.palette}
        colormap={state.colorMap[state.currentLayer]}
        theme={props.theme}
        darkMode={props.darkMode}
        style={{ width: "50vw" }}
        showUnderglow={state.modeselect !== "keyboard"}
        className="raiseKeyboard layer"
        isStandardView={isStandardView}
      />
    </div>
    // </fade>
  );

  const copyCustomItems = state.keymap.custom.map((_, index) => {
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

  const layerMenu = keymap.custom.map((_, index) => {
    const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
    return {
      name: layerName(idx),
      id: idx,
    };
  });

  let code = 0;
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
  if (!layerData) return <LogoLoaderCentered />;
  return (
    <Styles className="layoutEditor">
      <Container
        fluid
        className={`keyboard-editor ${state.modeselect} ${isStandardView ? "standarViewMode" : "singleViewMode"} ${
          typeof state.selectedPaletteColor === "number" ? "colorSelected" : ""
        }`}
      >
        <PageHeader
          text={i18n.app.menu.editor}
          showSaving
          contentSelector={
            <LayerSelector
              itemList={layerMenu}
              selectedItem={currentLayer}
              subtitle={i18n.editor.layers.title}
              onSelect={selectLayer}
              updateItem={onLayerNameChange}
              exportFunc={toExport}
              importFunc={toImport}
              clearFunc={confirmClear}
              copyFunc={copyFromDialog}
              editModeActual={state.modeselect}
              editModeFunc={modeSelectToggle}
              exportToPdf={exportToPdf}
            />
          }
          colorEditor={
            <ColorEditor
              key={palette}
              colors={palette}
              disabled={isReadOnly || currentLayer > state.colorMap.length}
              onColorSelect={onColorSelect}
              colorButtonIsSelected={state.colorButtonIsSelected}
              onColorPick={onColorPick}
              selected={state.selectedPaletteColor}
              isColorButtonSelected={isColorButtonSelected}
              onColorButtonSelect={onColorButtonSelect}
              toChangeAllKeysColor={toChangeAllKeysColor}
              deviceName={state.deviceName}
            />
          }
          isColorActive={state.modeselect !== "keyboard"}
          saveContext={onApply}
          destroyContext={() => {
            console.log("cancelling context: ", props);
            props.cancelContext();
          }}
          inContext={state.modified}
        />
        <Row className="full-height keyboardsWrapper">
          <Col className="raise-editor layer-col">
            <Row className="dygma-keyboard-editor editor">{layer}</Row>
            {state.modeselect === "keyboard" && !isStandardView ? (
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
        {state.modeselect === "keyboard" ? (
          <LayoutViewSelector
            onToggle={onToggle}
            isStandardView={isStandardView}
            tooltip={i18n.editor.superkeys.tooltip}
            layoutSelectorPosition={layoutSelectorPosition}
          />
        ) : null}

        <ConfirmationDialog
          title={i18n.editor.clearLayerQuestion}
          text={i18n.editor.clearLayerPrompt}
          open={state.clearConfirmationOpen}
          onConfirm={clearLayer}
          onCancel={cancelClear}
        >
          {i18n.editor.clearLayerPrompt}
        </ConfirmationDialog>
        <CopyFromDialog
          open={state.copyFromOpen}
          onCopy={copyFromLayer}
          onCancel={cancelCopyFrom}
          layers={copyFromLayerOptions}
          currentLayer={currentLayer}
        />
      </Container>

      <Modal
        show={state.showMacroModal}
        size="lg"
        onHide={toggleMacroModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
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
      <Modal
        show={state.showNeuronModal}
        size="lg"
        onHide={toggleNeuronModal}
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
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

      {state.modeselect === "keyboard" && isStandardView ? (
        <StandardView
          showStandardView={state.showStandardView}
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
}

export default LayoutEditor;

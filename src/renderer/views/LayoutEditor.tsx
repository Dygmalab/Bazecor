/* eslint-disable no-bitwise */
/* eslint-disable no-console */
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2020, 2024  Dygma Lab S.L.
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

import React, { MouseEvent, useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";
import { ipcRenderer } from "electron";
import fs from "fs";
import log from "electron-log/renderer";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@Renderer/components/atoms/Dialog";
import customCursor from "@Assets/base/cursorBucket.png";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import { CopyFromDialog } from "@Renderer/components/molecules/CustomModal/CopyFromDialog";
import { useDevice } from "@Renderer/DeviceContext";

// Types
import { LayerType, Neuron } from "@Renderer/types/neurons";
import { ColormapType, KeymapType, KeyType, LayoutEditorProps, PaletteType, SegmentedKeyType } from "@Renderer/types/layout";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { MacroActionsType, MacrosType } from "@Renderer/types/macros";
import { DeviceClass } from "@Renderer/types/devices";

// Modules
import { PageHeader } from "@Renderer/modules/PageHeader";
import ColorEditor from "@Renderer/modules/ColorEditor";
import { KeyPickerKeyboard } from "@Renderer/modules/KeyPickerKeyboard";
import StandardView from "@Renderer/modules/StandardView";

// Components
import LayerSelector from "@Renderer/components/organisms/Select/LayerSelector";
import { Button } from "@Renderer/components/atoms/Button";
import ToggleGroupLayoutViewMode from "@Renderer/components/molecules/CustomToggleGroup/ToggleGroupLayoutViewMode";
import { IconArrowDownWithLine, IconArrowUpWithLine, IconColorPalette } from "@Renderer/components/atoms/icons";
import LoaderLayout from "@Renderer/components/atoms/loader/loaderLayout";
import { i18n } from "@Renderer/i18n";

import Store from "@Renderer/utils/Store";
import getLanguage from "@Renderer/utils/language";
import { ClearLayerDialog } from "@Renderer/components/molecules/CustomModal/ClearLayerDialog";
import BlankTable from "../../api/keymap/db/blanks";
import Keymap, { KeymapDB } from "../../api/keymap";
import { rgb2w, rgbw2b } from "../../api/color";
import Backup from "../../api/backup";

const store = Store.getStore();

const Styles = Styled.div`
.keyboard-editor {
  // min-height: 100vh;
  height: inherit;
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
.layer-col {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // height: 100%;
}

.LayerHolder {
  display: flex;
  flex: 0 0 100%;
  margin: 0 auto;
  min-width: 680px;
  // max-width: 1640px;
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
  // height: auto;
  flex: 1;
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
  max-height: calc(100vh - 250px);
}
.singleViewMode.color .raiseKeyboard {
  margin: 0 auto;
  margin-top: 24px;
  max-height: calc(100vh - 300px);
}
.singleViewMode.keyboard .raiseKeyboard {
  margin: 0 auto;
  max-height: 40vh;
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
.keyItem foreignObject {
  overflow: visible;
}

`;

type ModeType = "keyboard" | "color";

const LayoutEditor = (props: LayoutEditorProps) => {
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
  const [keymap, setKeymap] = useState<KeymapType>({
    custom: [],
    default: [],
    onlyCustom: false,
  });
  const [palette, setPalette] = useState([]);
  const [colorMap, setColorMap] = useState([]);
  const [macros, setMacros] = useState<MacrosType[]>();
  const [superkeys, setSuperkeys] = useState<SuperkeysType[]>();

  const [modified, setModified] = useState(false);
  const [modeselect, setModeselect] = useState<ModeType>("keyboard");
  const [deviceName, setDeviceName] = useState("");
  const [clearConfirmationOpen, setClearConfirmationOpen] = useState(false);
  const [copyFromOpen, setCopyFromOpen] = useState(false);
  const [isMultiSelected, setIsMultiSelected] = useState(false);
  const [isColorButtonSelected, setIsColorButtonSelected] = useState(false);
  const [currentLanguageLayout, setCurrentLanguageLayout] = useState("english");
  const [showMacroModal, setShowMacroModal] = useState(false);
  const [showNeuronModal, setShowNeuronModal] = useState(false);
  const [leftSideModified, setLeftSideModified] = useState(false);
  const [isStandardView, setIsStandardView] = useState(
    store.get("settings.isStandardView") !== undefined ? (store.get("settings.isStandardView") as boolean) : false,
  );
  const [showStandardView, setShowStandardView] = useState(false);
  const [viewMode, setViewMode] = useState(store.get("settings.isStandardView") !== undefined ? "standard" : "single");
  const [isWireless, setIsWireless] = useState(false);

  const [selectedPaletteColor, setSelectedPaletteColor] = useState(-1);

  const scanned = useRef(false);
  const [isSaving, setIsSaving] = useState(false);
  const { state } = useDevice();
  const [layerData, setLayerData] = useState<Array<KeyType>>([]);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [showDefaults, setShowDefaults] = useState(false);
  const [ledIndexStart, setLedIndexStart] = useState(80);
  const [scanningStep, setScanningStep] = useState(0);
  const [keymapDB, setkeymapDB] = useState(new KeymapDB());
  const { darkMode, cancelContext, setLoading, onDisconnect, startContext, inContext, restoredOk, handleSetRestoredOk } = props;

  const onLayerNameChange = (newName: string) => {
    const slicedLayerNames = layerNames.slice();
    slicedLayerNames[currentLayer] = {
      id: currentLayer,
      name: newName,
    };
    setLayerNames(slicedLayerNames);
    const neurons = store.get("neurons") as Neuron[];
    log.info(`changed layer ${currentLayer} name to: ${newName}`, slicedLayerNames, neuronID, neurons);
    neurons[neurons.findIndex(x => x.id === neuronID)].layers = slicedLayerNames;
    store.set("neurons", neurons);
  };

  const superTranslator = (raw: string, sSuper: SuperkeysType[]): SuperkeysType[] => {
    const superArray = raw.split(" 0 0")[0].split(" ").map(Number);

    let skAction: number[] = [];
    const sKeys: SuperkeysType[] = [];
    let iter = 0;
    let superindex = 0;

    if (superArray.length < 1) {
      log.info("Discarded Superkeys due to short length of string", raw, raw.length);
      return [];
    }
    while (superArray.length > iter) {
      // log.info(iter, raw[iter], superkey);
      if (superArray[iter] === 0) {
        sKeys[superindex] = { actions: skAction, name: "", id: superindex };
        superindex += 1;
        skAction = [];
      } else {
        skAction.push(superArray[iter]);
      }
      iter += 1;
    }
    sKeys[superindex] = { actions: skAction, name: "", id: superindex };

    if (sKeys[0].actions.length === 0 || sKeys[0].actions.length > 5) {
      log.info(`Superkeys were empty`);
      return [];
    }
    log.info(`Got Superkeys:${JSON.stringify(sKeys)} from ${raw}`);
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    let finalSuper: SuperkeysType[] = [];
    finalSuper = sKeys.map((superky, i) => {
      const superk = superky;
      superk.id = i;
      if (sSuper.length > i && sSuper.length > 0) {
        const aux = superk;
        aux.name = sSuper[i].name;
        return aux;
      }
      return superk;
    });
    log.info("final superkeys", finalSuper);
    return finalSuper;
  };

  const macroTranslator = useCallback(
    (raw: string | number[], storeMacros: MacrosType[]) => {
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
      let actions = new Array<MacroActionsType>();
      const mcros = new Array<MacrosType>();
      actions = [];
      while (raw.length > iter) {
        if (kcs > 0) {
          keyCode.push((raw as number[])[iter]);
          kcs -= 1;
        } else {
          if (iter !== 0 && type !== 0) {
            actions.push({
              type,
              keyCode,
              id: undefined,
            });
            keyCode = [];
          }
          type = (raw as number[])[iter];
          switch (type) {
            case 0:
              kcs = 0;
              mcros[i] = { actions, id: i, name: "", macro: "" };
              i += 1;
              actions = [];
              break;
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
        }
        iter += 1;
      }
      actions.push({
        type,
        keyCode,
        id: undefined,
      });
      mcros[i] = {
        actions,
        id: i,
        name: "",
        macro: "",
      };
      const localMacros = mcros.map(m => {
        const aux: MacroActionsType[] = m.actions.map((action, idx) => {
          if (Array.isArray(action.keyCode))
            switch (action.type) {
              case 1:
                return {
                  type: action.type,
                  keyCode: [(action.keyCode[0] << 8) + action.keyCode[1], (action.keyCode[2] << 8) + action.keyCode[3]],
                  id: idx,
                };
              case 2:
              case 3:
              case 4:
              case 5:
                return {
                  type: action.type,
                  keyCode: (action.keyCode[0] << 8) + action.keyCode[1],
                  id: idx,
                };
              default:
                return {
                  type: action.type,
                  keyCode: action.keyCode[0],
                  id: idx,
                };
            }
          return action;
        });
        return { ...m, actions: aux };
      });
      // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
      let finalMacros = [];
      log.info("Checking Macros", localMacros, storeMacros);
      if (storeMacros === undefined) {
        return localMacros;
      }
      finalMacros = localMacros.map((m, idx) => {
        if (storeMacros.length > idx && storeMacros.length > 0) {
          const aux = m;
          aux.name = storeMacros[idx].name;
          aux.macro = m.actions.map(k => keymapDB.parse(k.keyCode as number).label).join(" ");
          return aux;
        }
        return m;
      });

      return finalMacros;
    },
    [keymapDB],
  );

  const getColormap = useCallback(async (): Promise<ColormapType> => {
    const { currentDevice } = state;
    const layerSize = currentDevice.device.keyboardUnderglow.rows * currentDevice.device.keyboardUnderglow.columns;
    const chunk = (a: number[], chunkSize: number) => {
      const R = [];
      for (let i = 0; i < a.length; i += chunkSize) R.push(a.slice(i, i + chunkSize));
      return R;
    };

    const paletteData = (await currentDevice?.command("palette")) as string;
    const colorMapData = (await currentDevice?.command("colormap.map")) as string;

    const plette =
      currentDevice?.device.RGBWMode !== true
        ? chunk(
            paletteData
              .split(" ")
              .filter((v: string) => v.length > 0)
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
              .filter((v: string) => v.length > 0)
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
        .filter((v: string) => v.length > 0)
        .map((k: string) => parseInt(k, 10)),
      layerSize,
    );

    return {
      palette: plette,
      colorMap: colMap,
    };
  }, [state]);

  const flatten = (arr: Array<unknown>) => [].concat(...arr);

  const updatePalette = async (device: DeviceClass, plette: PaletteType[]) => {
    let args: string[];
    if (state.currentDevice?.device.RGBWMode !== true) {
      args = flatten(plette.map(color => [color.r, color.g, color.b])).map(v => v.toString());
    } else {
      const paletteAux = plette.map(color => {
        const aux = rgb2w({ r: color.r, g: color.g, b: color.b });
        return aux;
      });
      args = flatten(paletteAux.map(color => [color.r, color.g, color.b, color.w])).map(v => v.toString());
      // log.info(plette, paletteAux, args);
    }

    const result = await device.command("palette", ...args);
    return result;
  };

  const updateColormap = async (device: DeviceClass, colormap: number[][]) => {
    const { currentDevice } = state;
    const args = flatten(colormap).map(v => v.toString());
    // check if colormap has the left side updated
    if (leftSideModified && currentDevice.type === "hid") {
      toast.warn(
        <ToastMessage
          title={i18n.success.btLeftSideColorsChanged}
          content={i18n.success.btLeftSideColorsChangedContent}
          icon={<IconColorPalette />}
        />,
        {
          autoClose: 10000,
          icon: "",
        },
      );
    }
    const result = await device.command("colormap.map", ...args);
    return result;
  };

  const AnalizeChipID = useCallback(
    async (CID: string) => {
      const { currentDevice } = state;
      let neurons = store.get("neurons") as Neuron[];
      let finalNeuron;
      log.info("Neuron ID", CID, neurons.length);
      if (neurons === undefined) {
        neurons = [];
      }
      if (neurons.some(n => n.id === CID)) {
        finalNeuron = neurons.find(n => n.id === CID);
      }
      const neuron: Neuron = {
        id: "",
        name: "",
        layers: new Array<LayerType>(),
        macros: new Array<MacrosType>(),
        superkeys: new Array<SuperkeysType>(),
      };
      setScanningStep(2);
      if (!neurons.some(n => n.id === CID) && neurons.length === 0) {
        neuron.id = CID;
        neuron.name = currentDevice?.device.info.product;
        neuron.layers = store.get("layerNames") !== undefined ? (store.get("layerNames") as Array<LayerType>) : defaultLayerNames;
        neuron.macros = store.get("macros") !== undefined ? (store.get("macros") as Array<MacrosType>) : [];
        neuron.superkeys = store.get("superkeys") !== undefined ? (store.get("superkeys") as Array<SuperkeysType>) : [];
        log.info("New neuron", neuron);
        neurons = neurons.concat(neuron);
        store.set("neurons", neurons);
        finalNeuron = neuron;
      }
      const existingDefy = neurons.some(n => n.id.length < 32);
      const existingRaise = neurons.some(n => n.id.length === 32);
      if (!neurons.some(n => n.id === CID) && neurons.length > 0) {
        neuron.id = CID;
        neuron.name = currentDevice?.device.info.product;
        neuron.layers = defaultLayerNames;
        neuron.macros = [];
        neuron.superkeys = [];
        const neuronCopy = JSON.parse(JSON.stringify(neuron));
        neuronCopy.id = CID;
        neuronCopy.name = neurons[0].name;
        neuronCopy.layers = neurons[0].layers;
        neuronCopy.macros = neurons[0].macros;
        neuronCopy.superkeys = neurons[0].superkeys;
        log.info("Additional neuron", neuron);
        let result;
        if (
          (currentDevice?.device.info.product === "Defy" && !existingDefy) ||
          (currentDevice?.device.info.product === "Raise" && !existingRaise)
        ) {
          result = false;
        } else {
          // TODO: replacethis with proper popup
          // eslint-disable-next-line no-alert
          result = window.confirm(
            "A new Neuron was detected and new settings need to be created. The names of the layers, macros and Superkeys are empty. If you want to copy the names of your default Neuron (first in the list) click ‘Ok’. If you prefer to reset all names click ‘Cancel’.",
          );
        }
        // var result = await userAction;
        // log.info(result, neuron, neuronCopy);
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
      log.info("Final neuron", finalNeuron);
      if (finalNeuron) {
        const neuronData = {
          neurons,
          neuronID: neurons.findIndex(n => n.id === CID),
          layerNames: finalNeuron.layers,
          storedMacros: finalNeuron.macros,
          storedSuper: finalNeuron.superkeys,
        };
        log.info("connected to: ", neuronData.neuronID);
        setLayerNames(finalNeuron.layers);
        return neuronData;
      }
      setLayerNames(finalNeuron.layers);
      return finalNeuron;
    },
    [defaultLayerNames, state],
  );

  const scanKeyboard = useCallback(
    async (lang: string) => {
      log.info("Scanning KEYBOARD");
      const { currentDevice } = state;
      setLoading(true);
      try {
        // Acquire ChipID from device
        let chipID = await currentDevice?.command("hardware.chip_id");
        setScanningStep(1);
        chipID = chipID.replace(/\s/g, "");
        const neuronData = await AnalizeChipID(chipID);

        // Restore backup if process failed after flashing
        setScanningStep(3);
        if (!restoredOk) {
          log.info("Error when restoring data after flash detected, repairing...");
          try {
            const backupFolder = store.get("settings.backupFolder") as string;
            const neurons = store.get("neurons") as Neuron[];
            const latestBackup = await Backup.getLatestBackup(backupFolder, chipID, currentDevice);
            await Backup.restoreBackup(neurons, chipID, latestBackup, currentDevice);
            log.info("repaired successfully");
            handleSetRestoredOk(true);
          } catch (error) {
            log.info("error when trying to restore keyboard after a bad flash");
          }
        }

        const device = currentDevice?.device.info.product;
        const wirelessChecker = currentDevice?.device.info.keyboardType === "wireless" || currentDevice?.device.wireless;
        if (lang) {
          const deviceLang = { ...currentDevice?.device, language: true };
          currentDevice.commands = {};
          currentDevice.commands.keymap = new Keymap(deviceLang);
          setkeymapDB((currentDevice?.commands.keymap as Keymap).db);
        }

        // let defLayer = await currentDevice?.command("settings.defaultLayer");
        // defLayer = parseInt(defLayer, 10) || 0;

        setScanningStep(4);
        const defaults = (await currentDevice?.command("keymap.default")) as string;
        setScanningStep(5);
        const custom = (await currentDevice?.command("keymap.custom")) as string;
        const onlycstm = (await currentDevice?.command("keymap.onlyCustom")) as string;
        const onlyCustom = Boolean(parseInt(onlycstm, 10));
        const KeyMap: KeymapType = {
          custom: undefined,
          default: undefined,
          onlyCustom: false,
        };

        const layerSize = currentDevice.device.keyboard.rows * currentDevice.device.keyboard.columns;
        KeyMap.custom = custom
          .split(" ")
          .filter(v => v.length > 0)
          .map((k: string) => keymapDB.parse(parseInt(k, 10)))
          .reduce((resultArray, item, index) => {
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
          .filter(v => v.length > 0)
          .map((k: string) => keymapDB.parse(parseInt(k, 10)))
          .reduce((resultArray, item, index) => {
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

        // log.info("KEYMAP TEST!!", keymap, keymap.onlyCustom, onlyCustom);
        if (empty && KeyMap.custom.length > 0) {
          log.info("Custom keymap is empty, copying defaults");
          for (let i = 0; i < KeyMap.default.length; i += 1) {
            KeyMap.custom[i] = KeyMap.default[i].slice();
          }
          KeyMap.onlyCustom = true;
          const args = flatten(KeyMap.custom).map(k => keymapDB.serialize(k).toString());
          await currentDevice?.command("keymap.custom", ...args);
        }

        // Loading Colors
        setScanningStep(6);
        const colormap = await getColormap();
        const plette = colormap.palette.slice();

        // loading Macros
        setScanningStep(7);
        let raw: string | number[] = (await currentDevice?.command("macros.map")) as string;
        if (raw.search(" 0 0") !== -1) {
          raw = raw.split(" 0 0")[0].split(" ").map(Number);
        } else {
          raw = "";
        }
        const parsedMacros = macroTranslator(raw, neuronData.storedMacros);

        // Loading Superkeys
        setScanningStep(8);
        const raw2: string = (await currentDevice?.command("superkeys.map")) as string;
        const parsedSuper = superTranslator(raw2, neuronData.storedSuper);

        setScanningStep(9);
        let showMM = false;
        if (KeyMap.custom) {
          const oldmacro = [...Array(64).keys()].map(x => x + 24576);
          // log.info("testing", oldmacro);
          for (let index = 0; index < KeyMap.custom.length; index += 1) {
            // log.info(keymap.custom[index]);
            if (KeyMap.custom[index].some((r: { keyCode: number }) => oldmacro.includes(r.keyCode))) {
              showMM = true;
              break;
            }
          }
        }

        setScanningStep(10);
        setLedIndexStart(currentDevice?.device.info.product === "Raise" ? 80 : 80);
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
        setShowMacroModal(showMM);
        scanned.current = true;
        setLoading(false);
        setScanningStep(0);
      } catch (e) {
        log.error(e);
        toast.error(e);
        setLoading(false);
        setScanningStep(0);
        onDisconnect();
      }
    },
    [state, setLoading, AnalizeChipID, restoredOk, getColormap, macroTranslator, handleSetRestoredOk, keymapDB, onDisconnect],
  );

  const onKeyChange = (keyCode: number) => {
    // Keys can only change on the custom layers
    const layer = currentLayer;
    const keyIndex = currentKeyIndex;

    if (keyIndex === -1) {
      return;
    }

    try {
      const kmap = keymap.custom.slice();
      const l = keymap.onlyCustom ? layer : layer - keymap.default.length;
      // log.info(kmap, l, keyIndex, keyCode, keymapDB.parse(keyCode));
      kmap[l][keyIndex] = keymapDB.parse(keyCode);
      setModified(true);
      setKeymap({
        default: keymap.default,
        onlyCustom: keymap.onlyCustom,
        custom: kmap,
      });
      startContext();
    } catch (error) {
      log.error("Error when assigning key to keymap", error);
    }
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
      setViewMode("standard");
      // log.info("Show Standard View IF: ", showStandardView);
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
    const { currentDevice } = state;
    try {
      setLoading(true);
      setIsSaving(true);
      const args = flatten(keymap.custom).map(k => keymapDB.serialize(k).toString());
      await currentDevice?.command("keymap.custom", ...args);
      await currentDevice?.command("keymap.onlyCustom", keymap.onlyCustom ? "1" : "0");
      await updateColormap(currentDevice, colorMap);
      await updatePalette(currentDevice, palette);
      setCurrentLayer(currentLayer);
      setCurrentKeyIndex(currentKeyIndex);
      setCurrentLedIndex(currentLedIndex);
      setModified(false);
      setLeftSideModified(false);
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
      setLoading(false);
      setIsSaving(false);
      log.info("Changes saved.");
    } catch (error) {
      toast.error(<ToastMessage title="Error when saving" content={error} icon={<IconArrowDownWithLine />} />, {
        autoClose: 2000,
        icon: "",
      });
      setLoading(false);
      setIsSaving(false);
    }
  };

  const copyFromDialog = () => {
    setCopyFromOpen(true);
  };

  const cancelCopyFrom = () => {
    setCopyFromOpen(false);
  };

  const copyFromLayer = (layer: number) => {
    let newKeymap: KeyType[][];

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

  const applyColorMapChangeBL = (side: string, colorIndex: number) => {
    const { currentDevice } = state;
    const idx = keymap.onlyCustom ? currentLayer : currentLayer - keymap.default.length;
    const layerMap = { keys: currentDevice.device.keyboard, underglow: currentDevice.device.keyboardUnderglow };
    const newColormap = colorMap.slice();

    log.info(newColormap[idx]);
    if (newColormap.length > 0) {
      if (side === "LEFT") {
        newColormap[idx].fill(
          colorIndex,
          layerMap.keys.ledsLeft[0],
          layerMap.keys.ledsLeft[layerMap.keys.ledsLeft.length - 1] + 1,
        );
      }

      if (side === "RIGHT") {
        newColormap[idx].fill(
          colorIndex,
          layerMap.keys.ledsRight[0],
          layerMap.keys.ledsRight[layerMap.keys.ledsRight.length - 1] + 1,
        );
      }

      if (side === "BOTH") {
        newColormap[idx].fill(
          colorIndex,
          layerMap.keys.ledsLeft[0],
          layerMap.keys.ledsLeft[layerMap.keys.ledsLeft.length - 1] + 1,
        );
        newColormap[idx].fill(
          colorIndex,
          layerMap.keys.ledsRight[0],
          layerMap.keys.ledsRight[layerMap.keys.ledsRight.length - 1] + 1,
        );
      }
      log.info(newColormap[idx]);
    }
    setColorMap(newColormap);
  };

  const applyColorMapChangeUG = (side: string, colorIndex: number) => {
    const { currentDevice } = state;
    const idx = keymap.onlyCustom ? currentLayer : currentLayer - keymap.default.length;
    const layerMap = { keys: currentDevice.device.keyboard, underglow: currentDevice.device.keyboardUnderglow };
    const newColormap = colorMap.slice();

    log.info(newColormap[idx]);
    if (newColormap.length > 0) {
      if (side === "LEFT") {
        newColormap[idx].fill(
          colorIndex,
          layerMap.underglow.ledsLeft[0],
          layerMap.underglow.ledsLeft[layerMap.underglow.ledsLeft.length - 1] + 1,
        );
      }

      if (side === "RIGHT") {
        newColormap[idx].fill(
          colorIndex,
          layerMap.underglow.ledsRight[0],
          layerMap.underglow.ledsRight[layerMap.underglow.ledsRight.length - 1] + 1,
        );
      }

      if (side === "BOTH") {
        newColormap[idx].fill(
          colorIndex,
          layerMap.underglow.ledsLeft[0],
          layerMap.underglow.ledsLeft[layerMap.underglow.ledsLeft.length - 1] + 1,
        );
        newColormap[idx].fill(
          colorIndex,
          layerMap.underglow.ledsRight[0],
          layerMap.underglow.ledsRight[layerMap.underglow.ledsRight.length - 1] + 1,
        );
      }
      log.info(newColormap[idx]);
    }
    setColorMap(newColormap);
  };

  const clearLayer = (fillKeyCode = BlankTable.keys[1].code, colorIndex = 15, chooseYourKeyboardSide = "BOTH") => {
    const { currentDevice } = state;
    const layerMap = { keys: currentDevice.device.keyboard, underglow: currentDevice.device.keyboardUnderglow };
    const newKeymap = keymap.custom.slice();
    const idx = keymap.onlyCustom ? currentLayer : currentLayer - keymap.default.length;
    const keyCodeFiller = keymapDB.parse(fillKeyCode);
    const cloneLayer = [...newKeymap[idx]];

    log.info(cloneLayer);
    if (chooseYourKeyboardSide === "LEFT") {
      layerMap.keys.left.forEach(value => {
        console.log("erasing values: ", value, value[0], value[value.length - 1] + 1);
        cloneLayer.fill(keyCodeFiller, value[0], value[value.length - 1] + 1);
      });
    }

    if (chooseYourKeyboardSide === "RIGHT") {
      layerMap.keys.right.forEach(value => {
        cloneLayer.fill(keyCodeFiller, value[0], value[value.length - 1] + 1);
      });
    }

    if (chooseYourKeyboardSide === "BOTH") {
      cloneLayer.fill(keyCodeFiller);
    }
    log.info("new clone layer", cloneLayer);
    newKeymap[idx] = cloneLayer;

    startContext();
    if (colorIndex >= 0) {
      applyColorMapChangeBL(chooseYourKeyboardSide, colorIndex);
      applyColorMapChangeUG(chooseYourKeyboardSide, colorIndex);
    }
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

  const onColorButtonSelect = (action: string, colorIndex: number) => {
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
    const { currentDevice } = state;
    const isEqualColor = onVerificationColor(colorIndex, currentLayer, currentLedIndex);
    // log.info(
    //   "data from onColorSelect",
    //   isEqualColor,
    //   currentLayer,
    //   colorMap.length,
    //   currentLedIndex,
    //   colorIndex,
    //   selectedPaletteColor,
    //   currentKeyIndex,
    // );

    if (currentLayer < 0 || currentLayer >= colorMap.length) return;

    if (!isEqualColor && currentKeyIndex > 0) {
      const colormap = colorMap.slice();
      colormap[currentLayer][currentLedIndex] = colorIndex;
      if (currentDevice.device.keyboard.ledsLeft.includes(currentLedIndex)) setLeftSideModified(true);
      setIsMultiSelected(true);
      setColorMap(colorMap);
      setSelectedPaletteColor(colorIndex);
      setModified(true);
      startContext();
    }
    if (colorIndex !== selectedPaletteColor) {
      setSelectedPaletteColor(colorIndex);
    } else {
      setSelectedPaletteColor(-1);
    }
  };

  const onColorPick = (colorIndex: number, r: number, g: number, b: number) => {
    const newPalette = palette.slice();
    const setColors = (red: number, green: number, blue: number) => ({
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
    layerNames: LayerType[];
    layerName: string;
    keymap: KeyType[];
    colormap: number[];
    palette: PaletteType[];
  }) => {
    log.info("not loading the palette: ", palette);
    // if (data.palette.length > 0) state.palette = data.palette;
    const lNames = layerNames.slice();
    if (data.layerNames !== null) {
      for (let i = 0; i < data.layerNames.length; i += 1) {
        lNames[i] = data.layerNames[i];
      }
      if (data.layerName && currentLayer) {
        lNames[currentLayer] = { name: data.layerName, id: currentLayer };
      }
      setLayerNames(lNames);
    }
    const parsedKeymap = data.keymap.map(key => {
      let localKey = key;
      if (typeof localKey.extraLabel === "object" || typeof localKey.label === "object")
        localKey = keymapDB.parse(localKey.keyCode);
      return localKey;
    });
    if (data.keymap.length > 0 && data.colormap.length > 0) {
      if (keymap.onlyCustom) {
        if (currentLayer >= 0) {
          const newKeymap = keymap.custom.slice();
          newKeymap[currentLayer] = parsedKeymap;
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
        newKeymap[currentLayer - defLength] = parsedKeymap;
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

  const toChangeAllKeysColor = (colorIndex: number, start: number, end: number) => {
    const colormap = colorMap.slice();
    colormap[currentLayer] = colormap[currentLayer].fill(colorIndex, start, end);
    setLeftSideModified(true);
    setColorMap(colormap);
    setModified(true);
    startContext();
  };

  const getLayout = () => {
    const { currentDevice } = state;
    let Layer = null;
    let kbtype = "iso";
    if (currentDevice?.device === null) return { Layer: undefined, kbtype: undefined };
    try {
      Layer = currentDevice?.device.components.keymap as React.FC<any>;
      kbtype = currentDevice?.device && currentDevice?.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      // log.info("Got Layer: ", Layer, kbtype);
    } catch (error) {
      log.error("Focus lost connection to Raise: ", error);
      return { Layer: undefined, kbtype: undefined };
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
      // log.info(resp.filePaths);
      let layers;
      try {
        layers = JSON.parse(fs.readFileSync(resp.filePaths[0], "utf-8"));
        // log.info(layers, Array.isArray(layers.keymap));
        if (Array.isArray(layers.keymap)) {
          // log.info(layers.keymap[0]);
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
          // log.info(layers.keymap.custom[0]);
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
        log.error(e);
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
      log.info("user closed SaveDialog");
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
    const { currentDevice } = state;
    const info = currentDevice?.device.info;
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
        log.info("path & data to export to: ", path, data);
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
        log.info("user closed SaveDialog");
      }
    } catch (error) {
      log.error(error);
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
    layerNames !== undefined && layerNames.length > index ? layerNames[index]?.name : defaultLayerNames[index]?.name;

  const modeSelectToggle = (data: ModeType) => {
    if (isStandardView) {
      if (currentLedIndex > ledIndexStart) {
        setCurrentKeyIndex(-1);
      }
      setShowStandardView(false);
      setViewMode("single");
    } else {
      setSelectedPaletteColor(null);
    }
    if (data === "keyboard") {
      setCurrentLedIndex(-1);
    }
    setModeselect(data);
  };

  const onToggleStandardView = () => {
    setIsStandardView(!isStandardView);
    setCurrentKeyIndex(-1);
    setCurrentLedIndex(-1);
    setViewMode(!isStandardView ? "standard" : "single");
  };

  const closeStandardViewModal = (code: number) => {
    if (code !== undefined) onKeyChange(code);
    setShowStandardView(false);
  };

  const handleSaveStandardView = () => {
    setCurrentKeyIndex(-1);
    setCurrentLedIndex(-1);
    setShowStandardView(false);
    setViewMode(isStandardView ? "standard" : "single");
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

  const configStandardView = () => {
    try {
      const preferencesStandardView = store.get("settings.isStandardView", true) as boolean;
      log.info("preferencesStandardView: ", preferencesStandardView);
      if (preferencesStandardView !== null) {
        return preferencesStandardView;
      }
      return true;
    } catch (e) {
      log.info(e);
      return true;
    }
  };

  useEffect(() => {
    // log.info("going to RUN INITIAL USE EFFECT just ONCE");
    const scanner = async () => {
      await scanKeyboard(currentLanguageLayout);
      const newLanguage = getLanguage(store.get("settings.language") as string);
      log.info("Language automatically set to: ", newLanguage);
      setCurrentLanguageLayout(newLanguage || "english");
      setIsStandardView(configStandardView());
      setViewMode(isStandardView ? "standard" : "single");
      setLoading(false);
      setCurrentLayer(0);
      scanned.current = true;
    };
    if (!scanned.current) {
      scanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // log.info("Running Scanner on changes useEffect: ", inContext, modified, !scanned, !inContext && modified && !scanned);
    if (!inContext && modified && !scanned.current) {
      const scanner = async () => {
        log.info("Resseting KB Data!!!");
        setModified(false);
        setLeftSideModified(false);
        setLoading(true);
        setCurrentLayer(previousLayer !== 0 ? previousLayer : 0);
        setPreviousLayer(0);
        setCurrentKeyIndex(-1);
        setCurrentLedIndex(-1);
        setKeymap({
          custom: [],
          default: [],
          onlyCustom: false,
        });
        setPalette([]);
        scanned.current = true;
        await scanKeyboard(currentLanguageLayout);
        setLoading(false);
      };
      scanner();
    }
  }, [currentLanguageLayout, inContext, keymap.custom, modified, previousLayer, scanKeyboard, scanned, setLoading]);

  useEffect(() => {
    // log.info("Running StandardView useEffect", isStandardView);
    store.set("settings.isStandardView", isStandardView);
  }, [isStandardView]);

  useEffect(() => {
    // log.info("Running LayerData useEffect");
    const localShowDefaults = store.get("settings.showDefaults") as boolean;
    let cLayer = currentLayer;

    if (!localShowDefaults) {
      if (currentLayer < keymap.default.length && !keymap.onlyCustom) {
        cLayer = 0;
      }
    }

    let localLayerData: KeyType[];
    let localIsReadOnly;
    if (keymap.onlyCustom) {
      localIsReadOnly = cLayer < 0;
      localLayerData = localIsReadOnly ? keymap.default[cLayer + keymap.default.length] : keymap.custom[cLayer];
    } else {
      localIsReadOnly = cLayer < keymap.default.length;
      localLayerData = localIsReadOnly ? keymap.default[cLayer] : keymap.custom[cLayer - keymap.default.length];
    }

    if (localLayerData !== undefined) {
      localLayerData = localLayerData.map(key => {
        const newMKey = key;
        if (key.extraLabel === "MACRO") {
          const MNumber = key.keyCode - 53852;
          if (
            macros[MNumber] !== undefined &&
            macros[MNumber].name !== undefined &&
            macros[MNumber].name.substr(0, 5) !== "" &&
            typeof key.label === "string" &&
            !/\p{L}/u.test(key.label)
          ) {
            log.info("macros:", macros);
            newMKey.label = macros[MNumber].name.substr(0, 5);
          }
        }
        return newMKey;
      });
    }

    if (localLayerData !== undefined && superkeys.length > 0) {
      localLayerData = localLayerData.map(key => {
        const newSKey = key;
        if (key.extraLabel === "SUPER") {
          const SKNumber = key.keyCode - 53980;
          if (
            superkeys.length > SKNumber &&
            superkeys[SKNumber] !== undefined &&
            superkeys[SKNumber].name !== undefined &&
            superkeys[SKNumber].name !== "" &&
            typeof key.label === "string" &&
            !/\p{L}/u.test(key.label)
          ) {
            newSKey.label = superkeys[SKNumber].name.substr(0, 5);
          }
        }
        return newSKey;
      });
    }
    // log.info("SAVING USEFFECT!!:", localLayerData, localIsReadOnly, localShowDefaults, cLayer);
    setLayerData(localLayerData);
    setIsReadOnly(localIsReadOnly);
    setShowDefaults(localShowDefaults);
    setCurrentLayer(cLayer);
  }, [keymap, currentLayer, macros, superkeys]);

  useLayoutEffect(() => {
    if (modeselect === "color") {
      // console.log("Is color - change position");
    } else {
      setViewMode(isStandardView ? "standard" : "single");
    }
  }, [modeselect, viewMode, isStandardView]);

  const { Layer, kbtype } = getLayout();
  if (!Layer) {
    return <div />;
  }

  const copyCustomItems = keymap
    ? keymap.custom.map((_: unknown, id: number) => {
        const idx = id + (keymap.onlyCustom ? 0 : keymap.default.length);
        const label = `${(idx + 1).toString()}: ${layerName(idx)}`;
        return {
          id: idx,
          name: label,
        };
      })
    : [];

  const copyDefaultItems =
    showDefaults && keymap
      ? keymap.default.map((_, index) => {
          const idx = index - (keymap.onlyCustom ? keymap.default.length : 0);
          const label = idx.toString();
          return {
            id: idx,
            name: label,
          };
        })
      : [];
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

  let code: SegmentedKeyType = {
    base: 0,
    modified: 0,
  };
  if (currentKeyIndex !== -1 && currentKeyIndex < ledIndexStart) {
    const tempkey = keymapDB.parse(layerData[currentKeyIndex].keyCode);
    // log.info("Key to be used in render", tempkey);
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

  // log.info("execution that may not render");
  if (layerData === undefined || layerData.length < 1) return <LoaderLayout steps={scanningStep} />;
  // log.info("GOING TO RENDER!!!");

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
        darkMode={darkMode}
        style={{ width: "50vw" }}
        showUnderglow={modeselect !== "keyboard"}
        className="raiseKeyboard layer h-auto"
        isStandardView={isStandardView}
      />
    </div>
    // </fade>
  );

  return (
    <Styles className="layoutEditor h-full">
      <div
        className={`keyboard-editor h-[inherit] px-3 ${modeselect} ${modeselect === "color" ? "[&_.raiseKeyboard]:h-auto" : ""} ${isStandardView ? "standarViewMode" : "singleViewMode"} ${
          typeof selectedPaletteColor === "number" ? "colorSelected" : ""
        }`}
      >
        <PageHeader
          text="Layout Editor"
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
              colors={palette}
              disabled={isReadOnly || currentLayer > colorMap.length}
              onColorSelect={onColorSelect}
              colorButtonIsSelected={isColorButtonSelected}
              onColorPick={onColorPick}
              selected={selectedPaletteColor}
              isColorButtonSelected={isColorButtonSelected}
              onColorButtonSelect={onColorButtonSelect}
              toChangeAllKeysColor={toChangeAllKeysColor}
              applyColorMapChangeBL={applyColorMapChangeBL}
              applyColorMapChangeUG={applyColorMapChangeUG}
              deviceName={deviceName}
            />
          }
          isColorActive={modeselect !== "keyboard"}
          saveContext={onApply}
          destroyContext={() => {
            log.info("cancelling context: ", props);
            scanned.current = false;
            cancelContext();
          }}
          inContext={modified}
        />
        <div className="w-full h-[inherit] keyboardsWrapper">
          <div className="raise-editor layer-col h-full">
            <div className="dygma-keyboard-editor editor">{layer}</div>
            {modeselect === "keyboard" && !isStandardView ? (
              <div className="ordinary-keyboard-editor m-0 pb-4">
                <ToggleGroupLayoutViewMode value={viewMode} onValueChange={onToggleStandardView} viewMode={modeselect} />
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
                  isWireless={isWireless}
                />
              </div>
            ) : null}
          </div>
        </div>

        {/* WHY: We want to hide the selector when we cannot use it (e.g. when color editor is active) */}
        {modeselect === "keyboard" && isStandardView ? (
          <ToggleGroupLayoutViewMode value={viewMode} onValueChange={onToggleStandardView} />
        ) : null}

        <ClearLayerDialog
          open={clearConfirmationOpen}
          onCancel={cancelClear}
          onConfirm={k => clearLayer(k.keyCode, k.colorIndex, k.chooseYourKeyboardSide)}
          colors={palette}
          selectedColorIndex={palette.length - 1}
          keyboardSide="BOTH"
          fillWithNoKey={false}
        />

        <CopyFromDialog
          open={copyFromOpen}
          onCopy={copyFromLayer}
          onCancel={cancelCopyFrom}
          layers={copyFromLayerOptions}
          currentLayer={currentLayer}
        />
      </div>

      <Dialog open={showMacroModal} onOpenChange={toggleMacroModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.editor.oldMacroModal.title}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-2 mt-2">
            <p>{i18n.editor.oldMacroModal.body}</p>
            <p className="italic">{i18n.editor.oldMacroModal.body2}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={toggleMacroModal}>
              {i18n.editor.oldMacroModal.cancelButton}
            </Button>
            <Button variant="secondary" size="sm" onClick={updateOldMacros}>
              {i18n.editor.oldMacroModal.cancelButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showNeuronModal} onOpenChange={toggleNeuronModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.editor.oldNeuronModal.title}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-2 mt-2">
            <p>{i18n.editor.oldNeuronModal.body}</p>
            <p className="italic">{i18n.editor.oldNeuronModal.body2}</p>
          </div>
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={toggleNeuronModal}>
              {i18n.editor.oldNeuronModal.cancelButton}
            </Button>
            <Button variant="secondary" size="sm" onClick={CloneExistingNeuron}>
              {i18n.editor.oldNeuronModal.applyButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {modeselect === "keyboard" && isStandardView ? (
        <StandardView
          showStandardView={showStandardView}
          closeStandardView={closeStandardViewModal}
          handleSave={handleSaveStandardView}
          onKeySelect={onKeyChange}
          macros={macros}
          superkeys={superkeys}
          actions={actions}
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

export default LayoutEditor;

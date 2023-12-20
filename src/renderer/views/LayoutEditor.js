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

import React from "react";
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

import Keymap, { KeymapDB } from "../../api/keymap";

import Focus from "../../api/focus";
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

class LayoutEditor extends React.Component {
  defaultLayerNames = [
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

  constructor(props) {
    super(props);
    this.bkp = new Backup();

    this.state = {
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
      isStandardView: store.get("settings.isStandardView") || true,
      showStandardView: false,
      layoutSelectorPosition: { x: 0, y: 0 },
      isWireless: false,
    };
    this.onLayerNameChange = this.onLayerNameChange.bind(this);
    this.updateMacros = this.updateMacros.bind(this);
    this.toExport = this.toExport.bind(this);
    this.toImport = this.toImport.bind(this);
    this.toExportAll = this.toExportAll.bind(this);
    this.getLayout = this.getLayout.bind(this);
    this.newSuperID = this.newSuperID.bind(this);
    this.setSuperKey = this.setSuperKey.bind(this);
    this.delSuperKey = this.delSuperKey.bind(this);
    this.toggleMacroModal = this.toggleMacroModal.bind(this);
    this.toggleNeuronModal = this.toggleNeuronModal.bind(this);
    this.CloneExistingNeuron = this.CloneExistingNeuron.bind(this);
    this.updateOldMacros = this.updateOldMacros.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  keymapDB = new KeymapDB();

  onLayerNameChange(newName) {
    const { layerNames, currentLayer, neuronID } = this.state;
    const slicedLayerNames = layerNames.slice();
    slicedLayerNames[currentLayer] = {
      id: currentLayer,
      name: newName,
    };
    this.setState({
      layerNames: slicedLayerNames,
    });
    const neurons = store.get("neurons");
    console.log(`changed layer ${currentLayer} name to: ${newName}`, slicedLayerNames);
    neurons[neuronID].layers = slicedLayerNames;
    store.set("neurons", neurons);
  }

  async AnalizeChipID(chipID) {
    const focus = new Focus();
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
      neuron.name = focus.device.info.product;
      neuron.layers =
        store.get("layerNames") !== undefined
          ? store.get("layerNames").map((name, id) => ({
              id,
              name,
            }))
          : this.defaultLayerNames;
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
      neuron.name = focus.device.info.product;
      neuron.layers = this.defaultLayerNames;
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
      if ((focus.device.info.product === "Defy" && !existingDefy) || (focus.device.info.product === "Raise" && !existingRaise)) {
        result = false;
      } else {
        result = await window.confirm(
          "A new Neuron was detected and new settings need to be created. The names of the layers, macros and Superkeys are empty. If you want to copy the names of your default Neuron (first in the list) click ‘Ok’. If you prefer to reset all names click ‘Cancel’.",
        );
      }
      // var result = await userAction;
      console.log(result, neuron, neuronCopy);
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
    this.setState({
      neurons,
      neuronID: neurons.findIndex(n => n.id === chipID),
      layerNames: finalNeuron.layers,
      storedMacros: finalNeuron.macros,
      storedSuper: finalNeuron.superkeys,
    });
    return finalNeuron;
  }

  scanKeyboard = async lang => {
    const { setLoading, onDisconnect } = this.props;
    setLoading(true);
    const focus = new Focus();
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      const chipID = await focus.command("hardware.chip_id");
      const registered = await this.AnalizeChipID(chipID.replace(/\s/g, ""));
      const device = focus.device.info.product;
      const wirelessChecker = focus.device.info.keyboardType === "wireless";
      if (lang) {
        const deviceLang = { ...focus.device, language: true };
        focus.commands.keymap = new Keymap(deviceLang);
        this.keymapDB = focus.commands.keymap.db;
      }

      let defLayer = await focus.command("settings.defaultLayer");
      defLayer = parseInt(defLayer, 10) || 0;

      const keymap = await focus.command("keymap");
      const onlyC = await focus.command("keymap.onlyCustom");
      keymap.onlyCustom = onlyC;

      let empty = true;
      for (const layer of keymap.custom) {
        for (const i of layer) {
          if (i.keyCode != 65535) {
            empty = false;
            break;
          }
        }
      }

      console.log("KEYMAP TEST!!", keymap, keymap.onlyCustom, onlyC);
      if (empty && keymap.custom.length > 0) {
        console.log("Custom keymap is empty, copying defaults");
        for (let i = 0; i < keymap.default.length; i++) {
          keymap.custom[i] = keymap.default[i].slice();
        }
        keymap.onlyCustom = true;
        await focus.command("keymap", keymap);
      }

      const colormap = await focus.command("colormap");
      const palette = colormap.palette.slice();
      console.log("retrieved color.map & palette", colormap, palette);
      let raw = await focus.command("macros.map");
      if (raw.search(" 0 0") !== -1) {
        raw = raw.split(" 0 0")[0].split(" ").map(Number);
      } else {
        raw = "";
      }
      const parsedMacros = this.macroTranslator(raw);
      let raw2 = await focus.command("superkeys.map");
      if (raw2.search(" 0 0") !== -1) {
        raw2 = raw2.split(" 0 0")[0].split(" ").map(Number);
      } else {
        raw2 = "";
      }
      const parsedSuper = this.superTranslator(raw2);

      let ledIndexStart = 69;
      if (device === "Defy") {
        ledIndexStart = 70;
      }
      this.setState({
        currentLayer: this.state.previousLayer,
        defaultLayer: defLayer,
        keymap,
        showDefaults: !keymap.onlyCustom,
        palette,
        colorMap: colormap.colorMap,
        macros: parsedMacros,
        superkeys: parsedSuper,
        registered,
        chipID,
        deviceName: device,
        isWireless: wirelessChecker,
        ledIndexStart,
      });
      if (keymap.custom) {
        const oldmacro = [...Array(64).keys()].map(x => x + 24576);
        // console.log("testing", oldmacro);
        for (let index = 0; index < keymap.custom.length; index++) {
          // console.log(keymap.custom[index]);
          if (keymap.custom[index].some(r => oldmacro.includes(r.keyCode))) {
            this.setState({ showMacroModal: true });
            break;
          }
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      toast.error(e);
      onDisconnect();
      setLoading(false);
    }
  };

  getCurrentKey() {
    if (this.state.currentKeyIndex < 0) return -1;

    let layer = parseInt(this.state.currentLayer);
    const keyIndex = parseInt(this.state.currentKeyIndex);

    if (keyIndex >= 80 || !this.state.keymap.custom) return 0;

    if (this.state.keymap.onlyCustom) {
      if (layer < 0) {
        layer += this.state.keymap.default.length;
        return this.state.keymap.default[layer][keyIndex].keyCode;
      }

      return this.state.keymap.custom[layer][keyIndex].keyCode;
    }
    const offset = this.state.keymap.default.length;
    if (layer < this.state.keymap.default.length) return this.state.keymap.default[layer][keyIndex].keyCode;

    return this.state.keymap.custom[layer - offset][keyIndex].keyCode;
  }

  onKeyChange = keyCode => {
    // Keys can only change on the custom layers
    const layer = this.state.currentLayer;
    const keyIndex = this.state.currentKeyIndex;

    if (keyIndex === -1) {
      return;
    }

    this.setState(state => {
      const keymap = state.keymap.custom.slice();
      const l = state.keymap.onlyCustom ? layer : layer - state.keymap.default.length;
      keymap[l][keyIndex] = this.keymapDB.parse(keyCode);
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: keymap,
        },
        modified: true,
      };
    });
    this.props.startContext();
  };

  dualFunction = modifier => {
    const { currentLayer, currentKeyIndex, keymap } = this.state;

    if (currentKeyIndex === -1) {
      return;
    }
    const KM = keymap.custom.slice();
    const l = keymap.onlyCustom ? currentLayer : currentLayer - keymap.default.length;
    const code = this.keymapDB.reverse(KM[l][currentKeyIndex].label);
    const keyCode = modifier + code;

    this.setState(state => {
      KM[l][currentKeyIndex] = this.keymapDB.parse(keyCode);
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: KM,
        },
        modified: true,
      };
    });
    this.props.startContext();
  };

  /**
   * Verificate that colors in keyboard button and in color palette is equal
   * @param {number} colorIndex Number of palette index
   * @param {number} currentLayer Number of current layer
   * @param {number} currentLedIndex Number of current selected keyboard button
   */

  onVerificationColor = (colorIndex, currentLayer, currentLedIndex) => {
    const { colorMap } = this.state;
    const currentIndexKeyButton = colorMap[currentLayer][currentLedIndex];
    return currentIndexKeyButton === colorIndex;
  };

  /**
   * Change state if click control or shift button
   * @param {number} layer Number of current layer
   * @param {number} ledIndex Number of current selected keyboard button
   */
  onCtrlShiftPress = (layer, ledIndex) => {
    this.setState({
      selectedPaletteColor: this.state.colorMap[layer][ledIndex],
      isMultiSelected: true,
      isColorButtonSelected: true,
    });
  };

  /**
   * Change state if color buton selected
   * @param {number} layer Number of layer in attribute of keyboard button
   * @param {number} currentLayer Number of current layer from state
   * @param {number} ledIndex Number of current selected keyboard button
   */
  onButtonKeyboardColorChange = (currentLayer, layer, ledIndex) => {
    const { selectedPaletteColor, modified } = this.state;
    const isEqualColor = this.onVerificationColor(selectedPaletteColor, currentLayer, ledIndex);
    if (!modified && isEqualColor) {
    } else {
      this.setState(state => {
        const colormap = state.colorMap.slice();
        colormap[currentLayer][ledIndex] = this.state.selectedPaletteColor;
        this.props.startContext();
        return {
          selectedPaletteColor: this.state.colorMap[layer][ledIndex],
          colorMap: colormap,
          modified: true,
        };
      });
    }
  };

  onKeySelect = event => {
    const {
      selectedPaletteColor,
      currentLayer,
      isMultiSelected,
      isColorButtonSelected,
      currentKeyIndex,
      isStandardView,
      showStandardView,
    } = this.state;
    const { currentTarget } = event;
    const layer = parseInt(currentTarget.getAttribute("data-layer"));
    const keyIndex = parseInt(currentTarget.getAttribute("data-key-index"));
    const ledIndex = parseInt(currentTarget.getAttribute("data-led-index"));

    if (isStandardView) {
      this.setState({ showStandardView: true });
      console.log("Show Standard View IF: ", showStandardView);
    }

    if (keyIndex == currentKeyIndex && !isStandardView) {
      if (event.ctrlKey || (event.shiftKey && !isColorButtonSelected)) {
        this.onCtrlShiftPress(layer, ledIndex);
        return;
      }
      this.setState({
        currentKeyIndex: -1,
        currentLedIndex: -1,
        selectedPaletteColor: null,
        isMultiSelected: false,
        isColorButtonSelected: false,
      });
      return;
    }

    this.setState(state => {
      if (state.colorMap.length > 0 && layer >= 0 && layer < state.colorMap.length) {
        return {
          currentLayer: layer,
          currentKeyIndex: keyIndex,
          currentLedIndex: ledIndex,
          modeselect: ledIndex >= this.state.ledIndexStart ? "color" : state.modeselect,
        };
      }
      return {
        currentLayer: layer,
        currentKeyIndex: keyIndex,
      };
    });

    if (event.ctrlKey || event.shiftKey) {
      this.onCtrlShiftPress(layer, ledIndex);
    } else {
      if (selectedPaletteColor !== null && isMultiSelected && isColorButtonSelected) {
        this.onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
      if (isColorButtonSelected && !isMultiSelected) {
        this.setState(
          () => ({
            isMultiSelected: true,
          }),
          () => {
            this.onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
          },
        );
      }
    }
  };

  selectLayer = id => {
    if (id === undefined) return;
    this.setState({
      currentLayer: id,
    });
  };

  onApply = async () => {
    const { setLoading } = this.props;
    setLoading(true);
    this.setState({ saving: true });
    const focus = new Focus();
    await focus.command("keymap", this.state.keymap);
    await focus.command("colormap", this.state.palette, this.state.colorMap);
    this.setState({
      modified: false,
      saving: false,
      previousKeyIndex: this.state.currentKeyIndex,
      previousLedIndex: this.state.currentLedIndex,
      previousLayer: this.state.currentLayer,
      isMultiSelected: false,
      selectedPaletteColor: null,
      isColorButtonSelected: false,
    });
    console.log("Changes saved.");
    const commands = await this.bkp.Commands();
    const backup = await this.bkp.DoBackup(commands, this.state.neurons[this.state.neuronID].id);
    this.bkp.SaveBackup(backup);
    this.props.cancelContext();
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
  };

  // Callback function to set State of new Language
  onChangeLanguageLayout = () => {
    const newLanguage = store.get("settings.language");
    console.log("Language automatically set to: ", newLanguage);
    this.setState({
      currentLanguageLayout: newLanguage || "english",
    });
  };

  async componentDidMount() {
    await this.scanKeyboard().then(() => {
      const { keymap } = this.state;
      const defLayer = this.state.defaultLayer >= 126 ? 0 : this.state.defaultLayer;
      let initialLayer = 0;

      if (!store.get("settings.showDefaults")) {
        if (defLayer < keymap.default.length) {
          initialLayer = keymap.onlyCustom ? 0 : keymap.default.length;
        }
      }

      this.setState({
        currentLayer: this.state.previousLayer != 0 ? this.state.previousLayer : initialLayer,
      });
    });
    this.onChangeLanguageLayout();
    await this.configStandarView();
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    if (this.props.inContext && !nextProps.inContext) {
      this.setState({
        currentLayer: this.state.previousLayer != 0 ? this.state.previousLayer : 0,
        currentKeyIndex: -1,
        currentLedIndex: -1,
        keymap: {
          custom: [],
          default: [],
          onlyCustom: false,
        },
        palette: [],
      });
      this.scanKeyboard();
      this.setState({ modified: false });
    }
  }

  shareLayerDialog = () => {
    this.setState({ shareLayerOpen: true });
  };

  cancelShareLayer = () => {
    this.setState({ shareLayerOpen: false });
  };

  copyFromDialog = () => {
    this.setState({ copyFromOpen: true });
  };

  cancelCopyFrom = () => {
    this.setState({ copyFromOpen: false });
  };

  copyFromLayer = layer => {
    this.setState(state => {
      let newKeymap;
      let newColormap;

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
      newColormap = state.colorMap.slice();
      if (newColormap.length > 0)
        newColormap[state.currentLayer] = state.colorMap[layer >= 0 ? layer : state.currentLayer].slice();

      this.props.startContext();
      return {
        colorMap: newColormap,
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: newKeymap,
        },
        copyFromOpen: false,
        modified: true,
      };
    });
  };

  clearLayer = () => {
    this.setState(state => {
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
      this.props.startContext();
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: newKeymap,
        },
        colorMap: newColormap,
        modified: true,
        clearConfirmationOpen: false,
      };
    });
  };

  confirmClear = () => {
    this.setState({ clearConfirmationOpen: true });
  };

  cancelClear = () => {
    this.setState({ clearConfirmationOpen: false });
  };

  onColorButtonSelect = (action, colorIndex) => {
    const { isColorButtonSelected } = this.state;
    if (action === "one_button_click") {
      this.setState({
        isMultiSelected: false,
        isColorButtonSelected: !isColorButtonSelected,
      });
      return;
    }
    if (action === "another_button_click") {
      this.setState({
        selectedPaletteColor: colorIndex,
        isColorButtonSelected: true,
      });
    }
  };

  onColorSelect = colorIndex => {
    const { currentLayer, currentLedIndex, colorMap } = this.state;

    const isEqualColor = this.onVerificationColor(colorIndex, currentLayer, currentLedIndex);

    if (currentLayer < 0 || currentLayer >= colorMap.length) return;

    if (!isEqualColor) {
      this.setState(state => {
        const colormap = state.colorMap.slice();
        colormap[currentLayer][currentLedIndex] = colorIndex;
        return {
          isMultiSelected: true,
          colorMap: colormap,
          selectedPaletteColor: colorIndex,
          modified: true,
        };
      });
      this.props.startContext();
    } else {
      this.setState({
        selectedPaletteColor: colorIndex,
      });
    }
  };

  onBacklightColorSelect = colorIndex => {
    this.setState({
      selectedPaletteColor: colorIndex,
      isColorButtonSelected: true,
    });
  };

  onColorPick = (colorIndex, r, g, b) => {
    const newPalette = this.state.palette.slice();
    const setColors = (r, g, b) => ({
      r,
      g,
      b,
      rgb: `rgb(${r}, ${g}, ${b})`,
    });
    newPalette[colorIndex] = setColors(r, g, b);
    this.setState({
      palette: newPalette,
      modified: true,
    });
    this.props.startContext();
  };

  importExportDialog = () => {
    this.setState({ importExportDialogOpen: true });
  };

  cancelImport = () => {
    this.setState({ importExportDialogOpen: false });
  };

  importLayer = data => {
    // if (data.palette.length > 0) this.setState({ palette: data.palette });
    const layerNames = this.state.layerNames.slice();
    const { currentLayer } = this.state;
    if (data.layerNames != null) {
      for (let i = 0; i < data.layerNames.length; i++) {
        layerNames[i] = data.layerNames[i];
      }
      if (data.layerName && currentLayer) {
        layerNames[currentLayer] = data.layerName;
      }
      this.setState({ layerNames });
    }
    if (data.keymap.length > 0 && data.colormap.length > 0) {
      if (this.state.keymap.onlyCustom) {
        if (currentLayer >= 0) {
          this.setState(state => {
            const newKeymap = this.state.keymap.custom.slice();
            newKeymap[currentLayer] = data.keymap.slice();
            const newColormap = this.state.colorMap.slice();
            newColormap[currentLayer] = data.colormap.slice();
            return {
              keymap: {
                default: state.keymap.default,
                custom: newKeymap,
                onlyCustom: state.keymap.onlyCustom,
              },
              colorMap: newColormap,
            };
          });
        }
      } else if (currentLayer >= this.state.keymap.default.length) {
        this.setState(state => {
          const defLength = this.state.keymap.default.length;
          const newKeymap = this.state.keymap.custom.slice();
          newKeymap[currentLayer - defLength] = data.keymap;
          const newColormap = this.state.colorMap.slice();
          newColormap[currentLayer - defLength] = data.colormap.slice();
          return {
            keymap: {
              default: state.keymap.default,
              custom: newKeymap,
              onlyCustom: state.keymap.onlyCustom,
            },
            colorMap: newColormap,
          };
        });
      }
    }
    this.setState({ modified: true });
    this.props.startContext();
    this.toCloseImportExportDialog();
  };

  /**
   * Close ImportExportDialog component
   */
  toCloseImportExportDialog = () => {
    this.setState({ importExportDialogOpen: false });
  };

  toChangeAllKeysColor = (colorIndex, start, end) => {
    const { currentLayer } = this.state;
    this.setState(state => {
      const colormap = state.colorMap.slice();
      colormap[currentLayer] = colormap[currentLayer].fill(colorIndex, start, end);
      return {
        colorMap: colormap,
        modified: true,
      };
    });
    this.props.startContext();
  };

  superTranslator(raw) {
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
        superindex++;
        superkey = [];
      } else {
        superkey.push(raw[iter]);
      }
      iter++;
    }
    superkeys[superindex] = { actions: superkey, name: "", id: superindex };
    console.log(`Got Superkeys:${JSON.stringify(superkeys)} from ${raw}`);

    if (
      superkeys[0].actions == undefined ||
      superkeys[0].actions == [0] ||
      superkeys[0].actions.filter(v => v === 0).length == superkeys[0].length - 1
    )
      return [];
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    const equal = [];
    let finalSuper = [];
    let stored = [];
    console.log(this.state.neurons, this.state.neuronID, superkeys);
    if (this.state.neurons !== undefined) {
      stored = this.state.neurons[this.state.neuronID].superkeys;
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
  }

  newSuperID() {
    return this.state.superkeys.length;
  }

  setSuperKey(superid, actions, supername) {
    const temp = this.state.superkeys;
    let tempactions = actions;
    let founddata = false;
    tempactions = tempactions
      .reverse()
      .map((elem, index, array) => {
        if (elem != 0) return elem;
        if ((index > 0 && array[index - 1] != 0) || founddata) {
          founddata = true;
          return 1;
        }
        return elem;
      })
      .reverse();
    temp[superid] = { actions: tempactions, name: supername };
    this.setState({ superkeys: temp });
  }

  delSuperKey(superid) {
    const temp = this.state.superkeys;
    const aux = this.state.keymap.custom;
    const result = this.state.keymap;
    temp.splice(superid, 1);
    if (temp.length > superid) {
      aux[this.state.currentLayer]
        .filter(key => key.keyCode > superid + 53980)
        .forEach(key => {
          const auxkey = this.keymapDB.parse(key.keyCode - 1);
          key.label = auxkey.label;
          key.extraLabel = auxkey.extraLabel;
          key.verbose = auxkey.verbose;
          key.keyCode = auxkey.keyCode;
        });
      result.custom = aux;
      this.setState({ keymap: result });
    }
    this.setState({ superkeys: temp });
  }

  macroTranslator(raw) {
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
        kcs--;
        iter++;
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
          i++;
          actions = [];
          iter++;
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
      iter++;
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
    const stored = this.state.storedMacros;
    console.log(macros, stored);
    if (stored === undefined) {
      return macros;
    }
    finalMacros = macros.map((macro, i) => {
      if (stored.length > i && stored.length > 0) {
        const aux = macro;
        aux.name = stored[i].name;
        aux.macro = macro.actions.map(k => this.keymapDB.parse(k.keyCode).label).join(" ");
        return aux;
      }
      return macro;
    });

    return finalMacros;
  }

  updateMacros(recievedMacros) {
    console.log("Updating Macros", recievedMacros);
    this.setState({ macros: recievedMacros, modified: true });
    this.props.startContext();
  }

  getLayout() {
    const focus = new Focus();
    let Layer = {};
    let kbtype = "iso";
    if (focus.device == null) return { Layer: false, kbtype: false };
    try {
      Layer = focus.device.components.keymap;
      kbtype = focus.device && focus.device.info.keyboardType === "ISO" ? "iso" : "ansi";
    } catch (error) {
      console.error("Focus lost connection to Raise: ", error);
      return { Layer: false, kbtype: false };
    }

    return { Layer, kbtype };
  }

  async toImport() {
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
        console.log(layers, Array.isArray(layers.keymap));
        if (Array.isArray(layers.keymap)) {
          console.log(layers.keymap[0]);
          this.importLayer(layers);
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
          this.setState({
            layerNames: layers.layerNames,
            keymap: layers.keymap,
            colorMap: layers.colormap,
            palette: layers.palette,
            superkeys: layers.superkeys ? layers.superkeys : [],
            modified: true,
          });
          this.props.startContext();
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
  }

  async toExport() {
    const { layerNames, keymap, currentLayer } = this.state;
    let layerData;
    let isReadOnly;
    if (keymap.onlyCustom) {
      isReadOnly = currentLayer < 0;
      layerData = isReadOnly ? keymap.default[currentLayer + keymap.default.length] : keymap.custom[currentLayer];
    } else {
      isReadOnly = currentLayer < keymap.default.length;
      layerData = isReadOnly ? keymap.default[currentLayer] : keymap.custom[currentLayer - keymap.default.length];
    }
    const focus = new Focus();
    const { info } = focus.device;
    const data = JSON.stringify(
      {
        device: info,
        language: this.state.currentLanguageLayout,
        layerNames,
        keymap: layerData,
        colormap: this.state.colorMap[currentLayer],
        palette: this.state.palette,
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
  }

  async toExportAll() {
    const { keymap, colorMap, palette, superkeys, layerNames } = this.state;
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
  }

  toggleNeuronModal() {
    if (this.state.showNeuronModal) {
      this.state.savedReject.reject("cancelled");
    }
    this.setState({ showNeuronModal: !this.state.showNeuronModal });
  }

  CloneExistingNeuron() {
    this.state.savedResolve.resolve("resolved");
    toast.success("added additional neuron to this Bazecor installation");
    this.setState({ showNeuornModal: false });
  }

  toggleMacroModal() {
    this.setState({ showMacroModal: !this.state.showMacroModal });
  }

  updateOldMacros() {
    const { keymap } = this.state;
    const layers = [];
    const oldmacro = [...Array(64).keys()].map(x => x + 24576);
    for (let index = 0; index < keymap.custom.length; index++) {
      if (keymap.custom[index].some(r => oldmacro.includes(r.keyCode))) {
        layers.push(index);
        continue;
      }
    }
    for (let index = 0; index < layers.length; index++) {
      for (let idx = 0; idx < keymap.custom[layers[index]].length; idx++) {
        if (oldmacro.includes(keymap.custom[layers[index]][idx].keyCode)) {
          keymap.custom[layers[index]][idx] = this.keymapDB.parse(keymap.custom[layers[index]][idx].keyCode + 29276);
        }
      }
    }
    this.setState({ showMacroModal: false, modified: true, keymap });
    this.props.startContext();
    this.onApply();
  }

  layerName(index) {
    return this.state.layerNames.length > index ? this.state.layerNames[index].name : this.defaultLayerNames[index];
  }

  modeSelectToggle = data => {
    if (this.state.isStandardView) {
      if (this.state.currentLedIndex > this.state.ledIndexStart) {
        this.setState({
          currentKeyIndex: -1,
        });
      }
      this.setState({
        modeselect: data,
        showStandardView: false,
        currentLedIndex: -1,
      });
    } else {
      this.setState({
        modeselect: data,
        currentLedIndex: -1,
        selectedPaletteColor: null,
      });
    }
  };

  // Manage Standard/Single view
  async configStandarView() {
    try {
      const preferencesStandardView = JSON.parse(store.get("settings.isStandardView", true));
      // const preferencesStandardView = false;
      // console.log("Preferences StandardView", preferencesStandardViewJSON);

      console.log("preferencesStandardView: ", preferencesStandardView);
      // const preferencesStandardView = false;
      if (preferencesStandardView !== null) {
        this.setState({ isStandardView: preferencesStandardView });
      } else {
        this.setState({ isStandardView: true });
      }
    } catch (e) {
      console.log(e);
      this.setState({ isStandardView: true });
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.isStandardView !== this.state.isStandardView) {
      store.set("settings.isStandardView", this.state.isStandardView);
      console.log("Did update: ", this.state.isStandardView);
    }
  }

  onToggle = () => {
    if (this.state.isStandardView) {
      this.setState({ isStandardView: false });
    } else {
      this.setState({ isStandardView: true });
    }
  };

  closeStandardViewModal = code => {
    this.onKeyChange(code);
    this.setState({ showStandardView: false });
  };

  handleSaveStandardView = () => {
    this.setState({
      showStandardView: false,
      currentKeyIndex: -1,
      currentLedIndex: -1,
      selectedPaletteColor: null,
      isMultiSelected: false,
      isColorButtonSelected: false,
    });
  };

  exportToPdf = () => {
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

  refreshLayoutSelectorPosition = (x, y) => {
    this.setState({
      layoutSelectorPosition: { x, y },
    });
    // console.log("Triggered function refresh position :", this.state.layoutSelectorPosition);
  };

  render() {
    const {
      keymap,
      palette,
      colorMap,
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
    } = this.state;

    const { Layer, kbtype } = this.getLayout();
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
        const MNumber = key.keyCode - 53852;
        if (key.extraLabel === "MACRO") {
          if (
            macros[MNumber] !== undefined &&
            macros[MNumber].name !== undefined &&
            macros[MNumber].name.substr(0, 5) !== "" &&
            !/\p{L}/u.test(key.label)
          ) {
            newMKey.label = macros[MNumber].name.substr(0, 5);
          }
        }
        return newMKey;
      });
    }

    if (layerData !== undefined && superkeys.length > 0) {
      layerData = layerData.map(key => {
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

    const layer = (
      // TODO: restore fade effect <fade in appear key={currentLayer}>
      <div className="LayerHolder">
        <Layer
          readOnly={isReadOnly}
          index={cLayer}
          keymap={layerData}
          onKeySelect={this.onKeySelect}
          selectedKey={this.state.currentKeyIndex}
          selectedLED={this.state.currentLedIndex}
          palette={this.state.palette}
          colormap={this.state.colorMap[this.state.currentLayer]}
          theme={this.props.theme}
          darkMode={this.props.darkMode}
          style={{ width: "50vw" }}
          showUnderglow={this.state.modeselect !== "keyboard"}
          className="raiseKeyboard layer"
          isStandardView={isStandardView}
        />
      </div>
      // </fade>
    );

    const copyCustomItems = this.state.keymap.custom.map((_, index) => {
      const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
      const label = `${(idx + 1).toString()}: ${this.layerName(idx)}`;
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
        name: this.layerName(idx),
        id: idx,
      };
    });

    let code = 0;
    if (currentKeyIndex !== -1 && currentLedIndex < ledIndexStart) {
      const tempkey = this.keymapDB.parse(layerData[currentKeyIndex].keyCode);
      // console.log("Key to be used in render", tempkey);
      code = this.keymapDB.keySegmentator(tempkey.keyCode);
    }
    let actions = [code !== null ? code.base + code.modified : 0, 0, 0, 0, 0];
    let superName = "";
    if (code !== null) {
      if (
        code.modified + code.base > 53980 &&
        code.modified + code.base < 54108 &&
        superkeys[code.base + code.modified - 53980] != undefined
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
          className={`keyboard-editor ${this.state.modeselect} ${isStandardView ? "standarViewMode" : "singleViewMode"} ${
            typeof this.state.selectedPaletteColor === "number" ? "colorSelected" : ""
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
                onSelect={this.selectLayer}
                updateItem={this.onLayerNameChange}
                exportFunc={this.toExport}
                importFunc={this.toImport}
                clearFunc={this.confirmClear}
                copyFunc={this.copyFromDialog}
                editModeActual={this.state.modeselect}
                editModeFunc={this.modeSelectToggle}
                exportToPdf={this.exportToPdf}
              />
            }
            colorEditor={
              <ColorEditor
                key={palette}
                colors={palette}
                colorsInUse={palette.map((color, idx) => {
                  const presence = colorMap.map(lx => lx.find(x => x === idx));
                  if (presence.find(x => x !== undefined) !== undefined) return true;
                  return false;
                })}
                disabled={isReadOnly || currentLayer > this.state.colorMap.length}
                onColorSelect={this.onColorSelect}
                colorButtonIsSelected={this.state.colorButtonIsSelected}
                onColorPick={this.onColorPick}
                selected={this.state.selectedPaletteColor}
                isColorButtonSelected={isColorButtonSelected}
                onColorButtonSelect={this.onColorButtonSelect}
                toChangeAllKeysColor={this.toChangeAllKeysColor}
                deviceName={this.state.deviceName}
              />
            }
            isColorActive={this.state.modeselect !== "keyboard"}
            saveContext={this.onApply}
            destroyContext={() => {
              this.props.cancelContext();
            }}
            inContext={this.state.modified}
          />
          <Row className="full-height keyboardsWrapper">
            <Col className="raise-editor layer-col">
              <Row className="dygma-keyboard-editor editor">{layer}</Row>
              {this.state.modeselect == "keyboard" && !isStandardView ? (
                <Row className="ordinary-keyboard-editor m-0">
                  <KeyPickerKeyboard
                    onKeySelect={this.onKeyChange}
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
                    refreshLayoutSelectorPosition={this.refreshLayoutSelectorPosition}
                    isWireless={isWireless}
                  />
                </Row>
              ) : null}
            </Col>
          </Row>

          {/* WHY: We want to hide the selector when we cannot use it (e.g. when color editor is active) */}
          {this.state.modeselect === "keyboard" ? (
            <LayoutViewSelector
              onToggle={this.onToggle}
              isStandardView={isStandardView}
              tooltip={i18n.editor.superkeys.tooltip}
              layoutSelectorPosition={layoutSelectorPosition}
            />
          ) : null}

          <ConfirmationDialog
            title={i18n.editor.clearLayerQuestion}
            text={i18n.editor.clearLayerPrompt}
            open={this.state.clearConfirmationOpen}
            onConfirm={this.clearLayer}
            onCancel={this.cancelClear}
          >
            {i18n.editor.clearLayerPrompt}
          </ConfirmationDialog>
          <CopyFromDialog
            open={this.state.copyFromOpen}
            onCopy={this.copyFromLayer}
            onCancel={this.cancelCopyFrom}
            layers={copyFromLayerOptions}
            currentLayer={currentLayer}
          />
        </Container>

        <Modal
          show={this.state.showMacroModal}
          size="lg"
          onHide={this.toggleMacroModal}
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
              onClick={this.toggleMacroModal}
            />
            <RegularButton
              buttonText={i18n.editor.oldMacroModal.applyButton}
              styles="outline gradient"
              size="sm"
              onClick={this.updateOldMacros}
            />
          </Modal.Footer>
        </Modal>
        <Modal
          show={this.state.showNeuronModal}
          size="lg"
          onHide={this.toggleNeuronModal}
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
              onClick={this.toggleNeuronModal}
            />
            <RegularButton
              buttonText={i18n.editor.oldNeuronModal.applyButton}
              styles="outline gradient"
              size="sm"
              onClick={this.CloneExistingNeuron}
            />
          </Modal.Footer>
        </Modal>

        {this.state.modeselect == "keyboard" && isStandardView ? (
          <StandardView
            showStandardView={this.state.showStandardView}
            closeStandardView={this.closeStandardViewModal}
            handleSave={this.handleSaveStandardView}
            onKeySelect={this.onKeyChange}
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
}

export default LayoutEditor;

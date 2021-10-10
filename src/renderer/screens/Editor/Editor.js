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

// Bootstrap components
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import { MdKeyboard } from "react-icons/md";
import { IoMdColorPalette } from "react-icons/io";
import { FiSave, FiTrash2 } from "react-icons/fi";

import Focus from "../../../api/focus";
import Backup from "../../../api/backup";
import Keymap, { KeymapDB } from "../../../api/keymap";
import LayerPanel from "./LayerPanel";
import ColorPanel from "./ColorPanel";
import KeyConfig from "../../components/KeyManager/";
import ConfirmationDialog from "../../components/ConfirmationDialog";
import i18n from "../../i18n";
import settings from "electron-settings";
import { CopyFromDialog } from "./CopyFromDialog";
import { undeglowDefaultColors } from "./initialUndaglowColors";

const Store = window.require("electron-store");
const store = new Store();

const Fade = Styled.div`
opacity: ${props => (props.animate ? "0" : "1")};
visibility: ${props => (props.animate ? "hidden" : "visible")};
`;

const ModalStyle = Styled.div`
background-color: ${({ theme }) => theme.card.background};
color: ${({ theme }) => theme.card.color};
.title {
  font-weight: 300;
  font-size: xx-large;
}
.body {
  font-weight: 200;
  font-size: 1.1em;
}
.noborder {
  border: none;
}
.modal-footer {
  justify-content: space-between;
}
.italic {
  font-style: italic;
}
`;

const Styles = Styled.div`
.keyboard-editor {
  .title-row {
    // margin-bottom: 40px;
  }
  .editor {
    margin-left: 210px;
    display: flex;
    justify-content: space-between;

    .raise-editor {
      text-align: center;
      align-self: center;
      padding: unset;
      margin-top: 0px;
      svg {
        max-height: 77vh;
        max-width: 80vw;
      }
    }
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
  position: absolute;
  bottom: 10px;
  width: 180px;
  margin-left: 0.5em;
  .card {
    flex-flow: nowrap;
    width: 100%;
    padding: 0;
    place-content: space-evenly;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.button.background};
  }
}
.save-row {
  position: absolute;
  right: 30px;
  top: 65px;
}
.big {
  font-size: 3em;
  margin-top: 0;
  padding-top: 0;
}
.button-large {
  font-size: 2rem;
  width: -webkit-fill-available;
  text-align: left;
}
.cancel-active{
  background-color: ${({ theme }) => theme.colors.button.cancel};
}
.save-active{
  background-color: ${({ theme }) => theme.colors.button.save};
}
.button-large:not(:disabled):not(.disabled):hover {
  color: ${({ theme }) => theme.colors.button.text};
  background-color: ${({ theme }) => theme.colors.button.active};
  border: none;
}
.save-span {
  font-size: 1.5rem;
  vertical-align: -2px;
  padding-left: 0.3rem;
}
`;

class Editor extends React.Component {
  defaultLayerNames = [
    "L1",
    "L2",
    "L3",
    "L4",
    "L5",
    "L6",
    "L7",
    "L8",
    "L9",
    "L10"
  ];

  constructor(props) {
    super(props);
    this.bkp = new Backup();

    this.state = {
      currentLayer: 0,
      previousLayer: 0,
      layerNames: store.get("layerNames") || this.defaultLayerNames,
      currentKeyIndex: -1,
      currentLedIndex: -1,
      previousKeyIndex: 0,
      previousLedIndex: 0,
      modified: false,
      saving: false,
      keymap: {
        custom: [],
        default: [],
        onlyCustom: false
      },
      palette: [],
      colorMap: [],
      macros: [],
      superkeys: [],
      storedMacros: store.get("macros"),
      storedSuper: store.get("superkeys"),
      modeselect: "keyboard",
      clearConfirmationOpen: false,
      copyFromOpen: false,
      importExportDialogOpen: false,
      isMultiSelected: false,
      isColorButtonSelected: false,
      currentLanguageLayout: "",
      undeglowColors: null,
      showMacroModal: false
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
    this.updateOldMacros = this.updateOldMacros.bind(this);
  }

  keymapDB = new KeymapDB();
  undeglowCount = 14;

  onLayerNameChange(newName) {
    const layerNames = this.state.layerNames.slice();
    layerNames[this.state.currentLayer] = newName;
    this.setState({
      layerNames: layerNames
    });
    store.set("layerNames", layerNames);
  }

  /**
   * Bottom menu never hide and automatically select a key at launch and have this shown in the bottom menu
   */
  bottomMenuNeverHide = () => {
    this.setState(state => ({
      currentKeyIndex:
        state.currentKeyIndex !== -1
          ? state.currentKeyIndex
          : state.previousKeyIndex,
      currentLedIndex:
        state.currentLedIndex !== -1
          ? state.currentLedIndex
          : state.previousLedIndex,
      selectedPaletteColor: null,
      isColorButtonSelected: false
    }));
  };

  bottomMenuNeverHideFromUnderglow = () => {
    this.setState(state => ({
      currentKeyIndex:
        state.currentKeyIndex !== -1
          ? state.currentKeyIndex
          : state.previousKeyIndex,
      currentLedIndex:
        state.currentLedIndex !== -1
          ? state.currentLedIndex
          : state.previousLedIndex
    }));
  };

  scanKeyboard = async lang => {
    let focus = new Focus();
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      if (lang) {
        let deviceLang = { ...focus.device, language: true };
        focus.commands.keymap = new Keymap(deviceLang);
        this.keymapDB = focus.commands.keymap.db;
      }

      let defLayer = await focus.command("settings.defaultLayer");
      defLayer = parseInt(defLayer) || 0;

      let keymap = await focus.command("keymap");

      let empty = true;
      for (let layer of keymap.custom) {
        for (let i of layer) {
          if (i.keyCode != 65535) {
            empty = false;
            break;
          }
        }
      }

      if (empty && !keymap.onlyCustom && keymap.custom.length > 0) {
        console.log("Custom keymap is empty, copying defaults");
        for (let i = 0; i < keymap.default.length; i++) {
          keymap.custom[i] = keymap.default[i].slice();
        }
        keymap.onlyCustom = true;
        await focus.command("keymap", keymap);
      }

      let colormap = await focus.command("colormap");
      // Point of restoration for WhiteBalance
      // let palette = this.props.revertBalance(colormap.palette.slice());
      let palette = colormap.palette.slice();
      const undeglowColors = settings.getSync("undeglowColors");
      let raw = await focus.command("macros.map");
      if (raw.search(" 0 0 ") !== -1) {
        raw = raw.split(" 0 0 ")[0].split(" ").map(Number);
      } else {
        raw = "";
      }
      const parsedMacros = this.macroTranslator(raw);
      let raw2 = await focus.command("superkeys.map");
      if (raw2.search(" 0 0 ") !== -1) {
        raw2 = raw2.split(" 0 0 ")[0].split(" ").map(Number);
      } else {
        raw2 = "";
      }
      const parsedSuper = this.superTranslator(raw2);
      this.setState(
        () => {
          if (!undeglowColors) {
            settings.set("undeglowColors", undeglowDefaultColors);
            return { undeglowColors: undeglowDefaultColors };
          } else {
            return { undeglowColors };
          }
        },
        () => {
          this.setState({
            currentLayer: this.state.previousLayer,
            defaultLayer: defLayer,
            keymap: keymap,
            showDefaults: !keymap.onlyCustom,
            palette,
            colorMap: colormap.colorMap,
            macros: parsedMacros,
            superkeys: parsedSuper
          });
        }
      );
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
      this.bottomMenuNeverHide();
    } catch (e) {
      toast.error(e);
      this.props.onDisconnect();
    }
  };

  getCurrentKey() {
    if (this.state.currentKeyIndex < 0) return -1;

    let layer = parseInt(this.state.currentLayer),
      keyIndex = parseInt(this.state.currentKeyIndex);

    if (keyIndex >= 80 || !this.state.keymap.custom) return 0;

    if (this.state.keymap.onlyCustom) {
      if (layer < 0) {
        layer += this.state.keymap.default.length;
        return this.state.keymap.default[layer][keyIndex].keyCode;
      }

      return this.state.keymap.custom[layer][keyIndex].keyCode;
    } else {
      const offset = this.state.keymap.default.length;
      if (layer < this.state.keymap.default.length)
        return this.state.keymap.default[layer][keyIndex].keyCode;

      return this.state.keymap.custom[layer - offset][keyIndex].keyCode;
    }
  }

  onKeyChange = keyCode => {
    // Keys can only change on the custom layers

    let layer = this.state.currentLayer,
      keyIndex = this.state.currentKeyIndex;

    if (keyIndex === -1) {
      return;
    }

    this.setState(state => {
      let keymap = state.keymap.custom.slice();
      const l = state.keymap.onlyCustom
        ? layer
        : layer - state.keymap.default.length;
      keymap[l][keyIndex] = this.keymapDB.parse(keyCode);
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: keymap
        },
        modified: true
      };
    });
    this.props.startContext();
  };

  dualFunction = modifier => {
    let { currentLayer, currentKeyIndex, keymap } = this.state;

    if (currentKeyIndex === -1) {
      return;
    }
    let KM = keymap.custom.slice();
    const l = keymap.onlyCustom
      ? currentLayer
      : currentLayer - keymap.default.length;
    const code = this.keymapDB.reverse(KM[l][currentKeyIndex].label);
    let keyCode = modifier + code;

    this.setState(state => {
      KM[l][currentKeyIndex] = this.keymapDB.parse(keyCode);
      return {
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: KM
        },
        modified: true
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
      isColorButtonSelected: true
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
    const isEqualColor = this.onVerificationColor(
      selectedPaletteColor,
      currentLayer,
      ledIndex
    );
    if (!modified && isEqualColor) {
      return;
    } else {
      this.setState(state => {
        let colormap = state.colorMap.slice();
        colormap[currentLayer][ledIndex] = this.state.selectedPaletteColor;
        this.props.startContext();
        return {
          selectedPaletteColor: this.state.colorMap[layer][ledIndex],
          colorMap: colormap,
          modified: true
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
      currentKeyIndex
    } = this.state;
    const currentTarget = event.currentTarget;
    let layer = parseInt(currentTarget.getAttribute("data-layer")),
      keyIndex = parseInt(currentTarget.getAttribute("data-key-index")),
      ledIndex = parseInt(currentTarget.getAttribute("data-led-index"));

    if (keyIndex == currentKeyIndex) {
      if (event.ctrlKey || (event.shiftKey && !isColorButtonSelected)) {
        this.onCtrlShiftPress(layer, ledIndex);
        return;
      } else {
        this.setState({
          currentKeyIndex: -1,
          currentLedIndex: -1,
          selectedPaletteColor: null,
          isMultiSelected: false,
          isColorButtonSelected: false
        });
        return;
      }
    }

    this.setState(state => {
      if (
        state.colorMap.length > 0 &&
        layer >= 0 &&
        layer < state.colorMap.length
      ) {
        return {
          currentLayer: layer,
          currentKeyIndex: keyIndex,
          currentLedIndex: ledIndex,
          modeselect: ledIndex >= 69 ? "color" : state.modeselect
        };
      } else {
        return {
          currentLayer: layer,
          currentKeyIndex: keyIndex
        };
      }
    });

    if (event.ctrlKey || event.shiftKey) {
      this.onCtrlShiftPress(layer, ledIndex);
      return;
    } else {
      if (
        selectedPaletteColor !== null &&
        isMultiSelected &&
        isColorButtonSelected
      ) {
        this.onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
      }
      if (isColorButtonSelected && !isMultiSelected) {
        this.setState(
          () => {
            return {
              isMultiSelected: true
            };
          },
          () => {
            this.onButtonKeyboardColorChange(currentLayer, layer, ledIndex);
          }
        );
      }
    }
  };

  selectLayer = id => {
    if (id === undefined) return;
    const { palette, undeglowColors } = this.state;
    let newPalette = palette.slice();
    newPalette[this.undeglowCount] = undeglowColors[id];
    this.setState({
      currentLayer: id,
      palette: newPalette
    });
    this.bottomMenuNeverHide();
  };

  onApply = async () => {
    this.setState({ saving: true });
    settings.set("undeglowColors", this.state.undeglowColors);
    let focus = new Focus();
    await focus.command("keymap", this.state.keymap);
    await focus.command("colormap", this.state.palette, this.state.colorMap);
    // let newMacros = this.state.macros;
    let newSuperKeys = this.state.superkeys;
    // await focus.command("macros.map", this.macrosMap(newMacros));
    console.log(newSuperKeys);
    store.set("superkeys", newSuperKeys);
    await focus.command("superkeys.map", this.superkeyMap(newSuperKeys));
    // store.set("macros", newMacros);
    this.setState({
      modified: false,
      saving: false,
      previousKeyIndex: this.state.currentKeyIndex,
      previousLedIndex: this.state.currentLedIndex,
      previousLayer: this.state.currentLayer,
      isMultiSelected: false,
      selectedPaletteColor: null,
      isColorButtonSelected: false,
      superkeys: newSuperKeys
    });
    console.log("Changes saved.");
    const commands = await this.bkp.Commands();
    const backup = await this.bkp.DoBackup(commands);
    this.bkp.SaveBackup(backup);
    this.props.cancelContext();
  };

  // Callback function to set State of new Language
  onChangeLanguageLayout = () => {
    console.log(
      "Language automatically set to: ",
      settings.getSync("keyboard.language")
    );
    this.setState({
      currentLanguageLayout: settings.getSync("keyboard.language") || "english"
    });
  };

  async componentDidMount() {
    await this.scanKeyboard().then(() => {
      const { keymap } = this.state;
      const defLayer =
        this.state.defaultLayer >= 126 ? 0 : this.state.defaultLayer;
      let initialLayer = 0;

      if (!settings.getSync("keymap.showDefaults")) {
        if (defLayer < keymap.default.length) {
          initialLayer = keymap.onlyCustom ? 0 : keymap.default.length;
        }
      }

      this.setState({
        currentLayer:
          this.state.previousLayer != 0
            ? this.state.previousLayer
            : initialLayer
      });
    });
    this.onChangeLanguageLayout();
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (this.props.inContext && !nextProps.inContext) {
      this.setState({
        currentLayer:
          this.state.previousLayer != 0 ? this.state.previousLayer : 0,
        currentKeyIndex: -1,
        currentLedIndex: -1,
        keymap: {
          custom: [],
          default: [],
          onlyCustom: false
        },
        palette: []
      });
      this.scanKeyboard();
      this.setState({ modified: false });
    }
  };

  copyFromDialog = () => {
    this.setState({ copyFromOpen: true });
  };
  cancelCopyFrom = () => {
    this.setState({ copyFromOpen: false });
  };
  copyFromLayer = layer => {
    this.setState(state => {
      let newKeymap, newColormap;

      if (state.keymap.onlyCustom) {
        newKeymap =
          layer < 0
            ? state.keymap.default.slice()
            : state.keymap.custom.slice();
        newKeymap[state.currentLayer] =
          layer < 0
            ? state.keymap.default[layer + state.keymap.default.length].slice()
            : state.keymap.custom[layer].slice();
      } else {
        newKeymap =
          layer < state.keymap.default.length
            ? state.keymap.default.slice()
            : state.keymap.custom.slice();
        newKeymap[state.currentLayer] =
          layer < state.keymap.default.length
            ? state.keymap.default[layer].slice()
            : state.keymap.custom[layer - state.keymap.default.length].slice();
      }
      newColormap = state.colorMap.slice();
      if (newColormap.length > 0)
        newColormap[state.currentLayer] =
          state.colorMap[layer >= 0 ? layer : state.currentLayer].slice();

      this.props.startContext();
      return {
        colorMap: newColormap,
        keymap: {
          default: state.keymap.default,
          onlyCustom: state.keymap.onlyCustom,
          custom: newKeymap
        },
        copyFromOpen: false,
        modified: true
      };
    });
  };

  clearLayer = () => {
    this.setState(state => {
      let newKeymap = state.keymap.custom.slice();
      const idx = state.keymap.onlyCustom
        ? state.currentLayer
        : state.currentLayer - state.keymap.default.length;
      newKeymap[idx] = Array(newKeymap[0].length)
        .fill()
        .map(() => ({ keyCode: 0xffff }));

      let newColormap = state.colorMap.slice();
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
          custom: newKeymap
        },
        colorMap: newColormap,
        modified: true,
        clearConfirmationOpen: false
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
        isColorButtonSelected: !isColorButtonSelected
      });
      return;
    }
    if (action === "another_button_click") {
      this.setState({
        selectedPaletteColor: colorIndex,
        isColorButtonSelected: true
      });
      return;
    }
  };

  onColorSelect = colorIndex => {
    const { currentLayer, currentLedIndex, colorMap } = this.state;

    const isEqualColor = this.onVerificationColor(
      colorIndex,
      currentLayer,
      currentLedIndex
    );

    if (currentLayer < 0 || currentLayer >= colorMap.length) return;

    if (!isEqualColor) {
      this.setState(state => {
        let colormap = state.colorMap.slice();
        colormap[currentLayer][currentLedIndex] = colorIndex;
        return {
          isMultiSelected: true,
          colorMap: colormap,
          selectedPaletteColor: colorIndex,
          modified: true
        };
      });
      this.props.startContext();
    } else {
      this.setState({
        selectedPaletteColor: colorIndex
      });
    }
  };

  onBacklightColorSelect = colorIndex => {
    this.setState({
      selectedPaletteColor: colorIndex,
      isColorButtonSelected: true
    });
  };

  onColorPick = (colorIndex, r, g, b) => {
    let newPalette = this.state.palette.slice();
    const setColors = (r, g, b) => ({
      r,
      g,
      b,
      rgb: `rgb(${r}, ${g}, ${b})`
    });
    newPalette[colorIndex] = setColors(r, g, b);
    this.setState({
      palette: newPalette,
      modified: true
    });
    if (colorIndex === this.undeglowCount) {
      const { currentLayer } = this.state;
      let newUndeglowColors = { ...this.state.undeglowColors };
      newUndeglowColors[currentLayer] = setColors(r, g, b);
      this.setState({
        undeglowColors: newUndeglowColors
      });
    }
    this.props.startContext();
  };

  importExportDialog = () => {
    this.setState({ importExportDialogOpen: true });
  };
  cancelImport = () => {
    this.setState({ importExportDialogOpen: false });
  };
  importLayer = data => {
    if (data.palette.length > 0) this.setState({ palette: data.palette });
    let layerNames = this.state.layerNames.slice();
    for (let i = 0; i < data.layerNames.length; i++) {
      layerNames[i] = data.layerNames[i];
    }
    const { currentLayer } = this.state;
    if (data.layerName && currentLayer) {
      layerNames[currentLayer] = data.layerName;
    }
    this.setState({ layerNames: layerNames });
    if (data.keymap.length > 0 && data.colormap.length > 0) {
      if (this.state.keymap.onlyCustom) {
        if (currentLayer >= 0) {
          this.setState(state => {
            let newKeymap = this.state.keymap.custom.slice();
            newKeymap[currentLayer] = data.keymap.slice();
            let newColormap = this.state.colorMap.slice();
            newColormap[currentLayer] = data.colormap.slice();
            return {
              keymap: {
                default: state.keymap.default,
                custom: newKeymap,
                onlyCustom: state.keymap.onlyCustom
              },
              colorMap: newColormap
            };
          });
        }
      } else {
        if (currentLayer >= this.state.keymap.default.length) {
          this.setState(state => {
            const defLength = this.state.keymap.default.length;
            let newKeymap = this.state.keymap.custom.slice();
            newKeymap[currentLayer - defLength] = data.keymap;
            let newColormap = this.state.colorMap.slice();
            newColormap[currentLayer - defLength] = data.colormap.slice();
            return {
              keymap: {
                default: state.keymap.default,
                custom: newKeymap,
                onlyCustom: state.keymap.onlyCustom
              },
              colorMap: newColormap
            };
          });
        }
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
      let colormap = state.colorMap.slice();
      colormap[currentLayer] = colormap[currentLayer].fill(
        colorIndex,
        start,
        end
      );
      return {
        colorMap: colormap,
        modified: true
      };
    });
    this.props.startContext();
  };

  superTranslator(raw) {
    let superkey = [],
      superkeys = [],
      iter = 0,
      superindex = 0;

    if (raw === "") {
      return [];
    }
    // console.log(raw, raw.length);
    while (raw.length > iter) {
      // console.log(iter, raw[iter], superkey);
      if (raw[iter] === 0) {
        superkeys[superindex] = { actions: superkey, name: "" };
        superindex++;
        superkey = [];
      } else {
        superkey.push(raw[iter]);
      }
      iter++;
    }
    superkeys[superindex] = { actions: superkey, name: "" };
    console.log("Got Superkeys:" + JSON.stringify(superkeys) + " from " + raw);

    if (
      superkeys[0].actions == undefined ||
      superkeys[0].actions == [0] ||
      superkeys[0].actions.filter(v => v === 0).length ==
        superkeys[0].length - 1
    )
      return [];
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    let equal = [];
    let finalSuper = [];
    const stored = store.get("superkeys") ? store.get("superkeys") : [];
    try {
      console.log("check data integrity", superkeys, stored, stored[0].actions);
      if (stored === undefined || stored[0].actions === undefined) {
        return superkeys;
      }
    } catch (error) {
      console.error("unable to retrieve stored superkeys, using loaded ones");
      console.error(error);
      return superkeys;
    }

    finalSuper = superkeys.map((superk, i) => {
      if (stored.length > i && stored.length > 0) {
        console.log(
          "compare between SK: ",
          superk.actions.join(","),
          stored[i].actions.filter(act => act != 0).join(",")
        );
        if (
          superk.actions.join(",") ===
          stored[i].actions.filter(act => act != 0).join(",")
        ) {
          equal[i] = true;
          let aux = superk;
          aux.name = stored[i].name;
          return aux;
        } else {
          equal[i] = false;
          return superk;
        }
      } else {
        return superk;
      }
    });
    console.log("final superkeys", finalSuper);
    this.setState({ storedSuper: stored });
    return finalSuper;
  }

  superkeyMap(superkeys) {
    if (
      superkeys.length === 0 ||
      (superkeys.length === 1 && superkeys[0].actions == []) ||
      (superkeys.length === 1 && superkeys[0].actions == [0])
    ) {
      return "65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535";
    }
    const keyMap = superkeys.map(superkey => {
      return superkey.actions.filter(act => act != 0).concat([0]);
    });
    const mapped = [].concat.apply([], keyMap.flat()).concat([0]).join(" ");
    console.log(mapped, keyMap);
    return mapped;
  }

  newSuperID() {
    return this.state.superkeys.length;
  }

  setSuperKey(superid, actions, supername) {
    let temp = this.state.superkeys;
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
    let temp = this.state.superkeys;
    let aux = this.state.keymap.custom;
    let result = this.state.keymap;
    temp.splice(superid, 1);
    if (temp.length > superid) {
      aux[this.state.currentLayer]
        .filter(key => key.keyCode > superid + 53916)
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
            { keyCode: 8, type: 8, id: 15 }
          ],
          id: 0,
          macro:
            "RIGHT SHIFT H RIGHT SHIFT E Y , SPACE RIGHT SHIFT D RIGHT SHIFT Y G M A T E",
          name: "Hey, Dygmate!"
        }
      ];
    }
    // Translate received macros to human readable text
    let i = 0,
      iter = 0,
      kcs = 0,
      type = 0,
      keyCode = [],
      actions = [],
      macros = [];
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
          type: type,
          keyCode: keyCode
        });
        keyCode = [];
      }
      type = raw[iter];
      if (type > 1 && type < 6) {
        kcs = 2;
      } else {
        kcs = 1;
      }
      if (type === 0) {
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
      }
      iter++;
    }
    actions.push({
      type: type,
      keyCode: keyCode
    });
    macros[i] = {};
    macros[i].actions = actions;
    macros[i].id = i;
    macros[i].name = "";
    macros[i].macro = "";
    macros = macros.map(macro => {
      let aux = macro.actions.map(action => {
        let aux = 0;
        if (action.keyCode.length > 1) {
          aux = (action.keyCode[0] << 8) + action.keyCode[1];
        } else {
          aux = action.keyCode[0];
        }
        return {
          type: action.type,
          keyCode: aux
        };
      });
      return { ...macro, actions: aux };
    });
    // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
    let equal = [];
    let finalMacros = [];
    const stored = this.state.storedMacros;
    console.log(macros, stored);
    if (stored === undefined) {
      return macros;
    }
    finalMacros = macros.map((macro, i) => {
      if (stored.length > i && stored.length > 0) {
        console.log("compare between MK: ", macro.actions, stored[i].actions);
        if (macro.actions.join(",") === stored[i].actions.join(",")) {
          equal[i] = true;
          let aux = macro;
          aux.name = stored[i].name;
          return aux;
        } else {
          equal[i] = false;
          return macro;
        }
      } else {
        return macro;
      }
    });

    return finalMacros;
  }

  updateMacros(recievedMacros) {
    console.log("Updating Macros", recievedMacros);
    this.setState({ macros: recievedMacros, modified: true });
    this.props.startContext();
  }

  macrosMap(macros) {
    if (macros.length === 1 && macros[0].actions === []) {
      return "255 255 255 255 255 255 255 255 255 255";
    }
    const actionMap = macros.map(macro => {
      return macro.actions
        .map(action => {
          if (action.type > 1 && action.type < 6) {
            return [
              [action.type],
              [action.keyCode >> 8],
              [action.keyCode & 255]
            ];
          } else {
            return [[action.type], [action.keyCode]];
          }
        })
        .concat([0]);
    });
    const mapped = [].concat.apply([], actionMap.flat()).concat([0]).join(" ");
    console.log(mapped);
    return mapped;
  }

  getLayout() {
    let focus = new Focus();
    let Layer = {};
    let kbtype = "iso";
    try {
      Layer = focus.device.components.keymap;
      kbtype =
        focus.device && focus.device.info.keyboardType === "ISO"
          ? "iso"
          : "ansi";
    } catch (error) {
      console.error("Focus lost connection to Raise: ", error);
      return false;
    }

    return { Layer, kbtype };
  }

  toImport() {
    let options = {
      title: "Load Layer/s file",
      buttonLabel: "Load Layer/s",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showOpenDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePaths);
          let layers;
          try {
            layers = JSON.parse(require("fs").readFileSync(resp.filePaths[0]));
            console.log(Array.isArray(layers.keymap));
            if (Array.isArray(layers.keymap)) {
              console.log(layers.keymap[0]);
              this.importLayer(layers);
              toast.success(i18n.editor.importSuccessCurrentLayer, {
                autoClose: 2000
              });
            } else {
              console.log(layers.keymap.custom[0]);
              this.setState({
                layerNames: layers.layerNames,
                keymap: layers.keymap,
                colorMap: layers.colormap,
                palette: layers.palette,
                superkeys: layers.superkeys ? layers.superkeys : [],
                modified: true
              });
              this.props.startContext();
              toast.success(i18n.editor.importSuccessAllLayers, {
                autoClose: 2000
              });
            }
          } catch (e) {
            console.error(e);
            toast.error(i18n.errors.invalidLayerFile, {
              autoClose: 2000
            });
            return;
          }
        } else {
          console.log("user closed SaveDialog");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  toExport() {
    const { layerNames, keymap, currentLayer } = this.state;
    let layerData, isReadOnly;
    if (keymap.onlyCustom) {
      isReadOnly = currentLayer < 0;
      layerData = isReadOnly
        ? keymap.default[currentLayer + keymap.default.length]
        : keymap.custom[currentLayer];
    } else {
      isReadOnly = currentLayer < keymap.default.length;
      layerData = isReadOnly
        ? keymap.default[currentLayer]
        : keymap.custom[currentLayer - keymap.default.length];
    }
    let data = JSON.stringify(
      {
        layerNames: layerNames,
        keymap: layerData,
        colormap: this.state.colorMap[currentLayer],
        palette: this.state.palette
      },
      null,
      2
    );
    let options = {
      title: "Save Layer file",
      defaultPath: "Layer" + currentLayer + ".json",
      buttonLabel: "Save Layer",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showSaveDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePath, data);
          require("fs").writeFileSync(resp.filePath, data);
          toast.success(i18n.editor.exportSuccessCurrentLayer, {
            autoClose: 2000
          });
        } else {
          console.log("user closed SaveDialog");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error(i18n.errors.exportError + err, {
          autoClose: 2000
        });
      });
  }

  toExportAll() {
    const { keymap, colorMap, palette, superkeys, layerNames } = this.state;
    let data = JSON.stringify(
      {
        layerNames,
        keymap,
        colormap: colorMap,
        palette,
        superkeys
      },
      null,
      2
    );
    let options = {
      title: "Backup Layers file",
      defaultPath: "Layers.json",
      buttonLabel: "Backup Layers",
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: "All Files", extensions: ["*"] }
      ]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showSaveDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePath, data);
          require("fs").writeFileSync(resp.filePath, data);
          toast.success(i18n.editor.exportSuccessAllLayers, {
            autoClose: 2000
          });
        } else {
          console.log("user closed SaveDialog");
        }
      })
      .catch(err => {
        console.error(err);
        toast.error(i18n.errors.exportError + err, {
          autoClose: 2000
        });
      });
  }

  toggleMacroModal() {
    this.setState({ showMacroModal: !this.state.showMacroModal });
  }
  updateOldMacros() {
    let keymap = this.state.keymap;
    let layers = [];
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
          keymap.custom[layers[index]][idx] = this.keymapDB.parse(
            keymap.custom[layers[index]][idx].keyCode + 29276
          );
        }
      }
    }
    this.setState({ showMacroModal: false, modified: true, keymap });
    this.props.startContext();
    this.onApply();
  }

  layerName(index) {
    return this.state?.layerNames?.length >= index
      ? this.state.layerNames[index]
      : this.defaultLayerNames[index];
  }

  render() {
    const {
      keymap,
      palette,
      isColorButtonSelected,
      currentLayer,
      currentKeyIndex,
      currentLedIndex,
      currentLanguageLayout,
      macros,
      superkeys
    } = this.state;

    let { Layer, kbtype } = this.getLayout();
    if (Layer === false) {
      return <div></div>;
    }
    const showDefaults = settings.getSync("keymap.showDefaults");
    let cLayer = currentLayer;

    if (!showDefaults) {
      if (currentLayer < keymap.default.length && !keymap.onlyCustom) {
        cLayer = 0;
      }
    }

    let layerData, isReadOnly;
    if (keymap.onlyCustom) {
      isReadOnly = cLayer < 0;
      layerData = isReadOnly
        ? keymap.default[cLayer + keymap.default.length]
        : keymap.custom[cLayer];
    } else {
      isReadOnly = cLayer < keymap.default.length;
      layerData = isReadOnly
        ? keymap.default[cLayer]
        : keymap.custom[cLayer - keymap.default.length];
    }

    if (layerData != undefined) {
      layerData = layerData.map(key => {
        let newKey = key;
        if (key.extraLabel == "MACRO") {
          if (
            macros.length > parseInt(key.label) &&
            macros[parseInt(key.label)].name.substr(0, 5) != ""
          ) {
            newKey.label = macros[parseInt(key.label)].name
              .substr(0, 5)
              .toLowerCase();
          }
        }
        return newKey;
      });
    }

    if (layerData != undefined && superkeys.length > 0) {
      layerData = layerData.map(key => {
        let newKey = key;
        if (key.extraLabel == "SUPER") {
          if (
            superkeys.length > parseInt(key.label) &&
            superkeys[parseInt(key.label)].name != ""
          ) {
            newKey.label = superkeys[parseInt(key.label)].name
              .substr(0, 5)
              .toLowerCase();
          }
        }
        return newKey;
      });
    }

    const layer = (
      //TODO: restore fade effect <fade in appear key={currentLayer}>
      <div className="">
        <Layer
          readOnly={isReadOnly}
          index={cLayer}
          keymap={layerData}
          onKeySelect={this.onKeySelect}
          selectedKey={this.state.currentKeyIndex}
          palette={this.state.palette}
          colormap={this.state.colorMap[this.state.currentLayer]}
          theme={this.props.theme}
          darkMode={this.props.darkMode}
          style={{ width: "50vw" }}
          showUnderglow={this.state.modeselect != "keyboard"}
        />
      </div>
      // </fade>
    );

    const copyCustomItems = this.state.keymap.custom.map((_, index) => {
      const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
      const label = (idx + 1).toString() + ": " + this.layerName(idx);
      return {
        index: idx,
        label: label
      };
    });
    const copyDefaultItems =
      showDefaults &&
      keymap.default.map((_, index) => {
        const idx = index - (keymap.onlyCustom ? keymap.default.length : 0),
          label = idx.toString();
        return {
          index: idx,
          label: label
        };
      });
    const copyFromLayerOptions = (copyDefaultItems || []).concat(
      copyCustomItems
    );

    const layerMenu = keymap.custom.map((_, index) => {
      const idx = index + (keymap.onlyCustom ? 0 : keymap.default.length);
      return {
        name: this.layerName(idx),
        id: idx
      };
    });

    let code = 0;
    if (currentKeyIndex !== -1 && currentLedIndex < 69) {
      const tempkey = this.keymapDB.parse(layerData[currentKeyIndex].keyCode);
      code = {
        base:
          tempkey.keyCode > 255
            ? tempkey.keyCode > 49160
              ? tempkey.keyCode == 65535
                ? this.keymapDB.reverse(tempkey.label)
                : parseInt(tempkey.label)
              : this.keymapDB.reverse(tempkey.label)
            : tempkey.keyCode < 20480 || tempkey.keyCode > 20561
            ? this.keymapDB.reverseSub(tempkey.label, tempkey.extraLabel)
            : this.keymapDB.reverse(tempkey.label),
        modified:
          tempkey.keyCode > 255 &&
          (tempkey.keyCode < 20480 || tempkey.keyCode > 20561)
            ? tempkey.keyCode > 49160
              ? tempkey.keyCode == 65535
                ? 0
                : this.keymapDB.reverseSub(tempkey.label, tempkey.extraLabel) -
                  parseInt(tempkey.label)
              : this.keymapDB.reverseSub(tempkey.label, tempkey.extraLabel) -
                this.keymapDB.reverse(tempkey.label)
            : 0
      };
    }
    console.log(JSON.stringify(code));
    let actions = [code !== null ? code.base + code.modified : 0, 0, 0, 0, 0];
    let superName = "";
    if (code !== null) {
      if (
        code.modified + code.base > 53915 &&
        code.modified + code.base < 53980 &&
        this.state.superkeys[code.base + code.modified - 53916] != undefined
      ) {
        actions =
          this.state.superkeys[code.base + code.modified - 53916].actions;
        superName = this.state.superkeys[
          code.base + code.modified - 53916
        ].name.substr(0, 5);
      }
    }
    // console.log("final actions: " + actions, superName, this.state.superkeys);

    return (
      <Styles>
        <Container fluid className="keyboard-editor">
          <Row className="title-row">
            <h4 className="section-title">{i18n.app.menu.editor}</h4>
          </Row>
          <Row>
            <Col>
              <LayerPanel
                layers={layerMenu}
                selectLayer={this.selectLayer}
                currentLayer={currentLayer}
                isReadOnly={isReadOnly}
                importTitle={i18n.editor.layers.importTitle}
                exportTitle={i18n.editor.layers.exportTitle}
                exportAllTitle={i18n.editor.layers.exportAllTitle}
                importFunc={this.toImport}
                exportFunc={this.toExport}
                exportAllFunc={this.toExportAll}
                copyTitle={i18n.editor.layers.copyFrom}
                copyFunc={this.copyFromDialog}
                clearTitle={i18n.editor.layers.clearLayer}
                clearFunc={this.confirmClear}
                changeLayerName={this.onLayerNameChange}
              />
            </Col>
          </Row>
          <Row>
            <Col>
              <Fade animate={this.state.modeselect != "color"}>
                <ColorPanel
                  key={palette}
                  colors={palette}
                  disabled={
                    isReadOnly || currentLayer > this.state.colorMap.length
                  }
                  onColorSelect={this.onColorSelect}
                  colorButtonIsSelected={this.state.colorButtonIsSelected}
                  onColorPick={this.onColorPick}
                  selected={this.state.selectedPaletteColor}
                  isColorButtonSelected={isColorButtonSelected}
                  onColorButtonSelect={this.onColorButtonSelect}
                  toChangeAllKeysColor={this.toChangeAllKeysColor}
                />
              </Fade>
            </Col>
          </Row>
          {this.state.keymap.custom.length == 0 &&
            this.state.keymap.default.length == 0 && (
              <div className="centerSpinner">
                <Spinner
                  className="spinner-border text-danger"
                  role="status"
                  animation="grow"
                />
              </div>
            )}
          <Row className="editor">
            <Col className="raise-editor">{layer}</Col>
          </Row>
          <Row className="keyconfig">
            {this.state.modeselect != "keyboard" ? (
              ""
            ) : (
              <Fade animate={this.state.modeselect != "keyboard"}>
                <KeyConfig
                  id="keyboard-fade"
                  onKeySelect={this.onKeyChange}
                  code={code}
                  macros={macros}
                  actions={actions}
                  superName={superName}
                  newSuperID={this.newSuperID}
                  setSuperKey={this.setSuperKey}
                  delSuperKey={this.delSuperKey}
                  keyIndex={currentKeyIndex}
                  selectedlanguage={currentLanguageLayout}
                  kbtype={kbtype}
                />
              </Fade>
            )}
          </Row>
          <Row className="buttons-row">
            <Card>
              <Button
                active={this.state.modeselect == "keyboard"}
                onClick={() => {
                  this.setState({ modeselect: "keyboard" });
                }}
                className="keyboardbutton big"
                aria-controls="keyboard-fade"
              >
                <MdKeyboard />
              </Button>
              <Button
                active={this.state.modeselect == "color"}
                onClick={() => {
                  this.setState({ modeselect: "color" });
                }}
                className="colorsbutton big"
              >
                <IoMdColorPalette />
              </Button>
            </Card>
          </Row>
          <Row className="save-row">
            <Container fluid>
              <Row>
                <Button
                  disabled={!this.state.modified}
                  onClick={this.onApply}
                  className={`button-large pt-0 mt-0 mb-2 ${
                    this.state.modified ? "save-active" : ""
                  }`}
                  aria-controls="save-changes"
                >
                  <FiSave />
                </Button>
              </Row>
              <Row>
                <Button
                  disabled={!this.state.modified}
                  onClick={() => {
                    this.props.cancelContext();
                  }}
                  className={`button-large pt-0 mt-0 mb-2 ${
                    this.state.modified ? "cancel-active" : ""
                  }`}
                  aria-controls="discard-changes"
                >
                  <FiTrash2 />
                </Button>
              </Row>
            </Container>
          </Row>
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
          onHide={this.toggleMacroModal}
          style={{ marginTop: "300px" }}
        >
          <ModalStyle>
            <Modal.Header closeButton className="title noborder">
              <Modal.Title>{i18n.editor.oldMacroModal.title}</Modal.Title>
            </Modal.Header>
            <Modal.Body className="body">
              <p>{i18n.editor.oldMacroModal.body}</p>
              <p className="italic">{i18n.editor.oldMacroModal.body2}</p>
            </Modal.Body>
            <Modal.Footer className="noborder">
              <Button variant="secondary" onClick={this.toggleMacroModal}>
                {i18n.editor.oldMacroModal.cancelButton}
              </Button>
              <Button variant="primary" onClick={this.updateOldMacros}>
                {i18n.editor.oldMacroModal.applyButton}
              </Button>
            </Modal.Footer>
          </ModalStyle>
        </Modal>
      </Styles>
    );
  }
}

export default Editor;

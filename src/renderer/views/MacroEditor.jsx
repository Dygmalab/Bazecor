/* eslint-disable no-bitwise */
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Styled from "styled-components";
import PropTypes from "prop-types";

import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

import { LogoLoaderCentered } from "@Renderer/component/Loader";

import { RegularButton } from "@Renderer/component/Button";
import Callout from "@Renderer/component/Callout";
import { IconFloppyDisk } from "@Renderer/component/Icon";
import { MacroSelector } from "@Renderer/component/Select";
import ToastMessage from "@Renderer/component/ToastMessage";
import { PageHeader } from "@Renderer/modules/PageHeader";

import MacroCreator from "@Renderer/modules/Macros/MacroCreator";
import TimelineEditorManager from "@Renderer/modules/Macros/TimelineEditorManager";
import { useDevice } from "@Renderer/DeviceContext";

import Backup from "../../api/backup";
import Keymap, { KeymapDB } from "../../api/keymap";
import i18n from "../i18n";

import Store from "../utils/Store";

const store = Store.getStore();

const Styles = Styled.div`
  .toggle-button{
    text-align: center;
    padding-bottom: 8px;
  }
  .list-group-item {
    border: none !important;
    background-color: ${({ theme }) => theme.card.background};
  }
  .save-button {
    text-align: center;
  }
  .macrocontainer {
    margin-right: auto;
    margin-left: auto;
    /* width: inherit; */
    max-width: 1350px;
  }
  .save-row {
    position: absolute;
    right: 30px;
    top: 65px;
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
`;

const defaultMacro = [
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

const defaultMacroString =
  "255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255";

function MacroEditor(props) {
  let keymapDB = new KeymapDB();
  const bkp = new Backup();

  const initialState = {
    keymap: [],
    macros: [],
    superkeys: [],
    storedMacros: [],
    maxMacros: 128,
    modified: false,
    selectedMacro: 0,
    showDeleteModal: false,
    listToDelete: [],
    listToDeleteS: [],
    selectedList: -1,
    usedMemory: 0,
    totalMemory: 0,
    loading: true,
    currentLanguageLayout: store.get("settings.language") || "english",
  };
  const [state, setState] = useState(initialState);
  const [deviceState] = useDevice();

  function superTranslator(raw) {
    if (raw.search(" 0 0 ") === -1) {
      return [];
    }
    const supersArray = raw.split(" 0 0")[0].split(" ").map(Number);

    const superkeys = [];
    let superkey = [];
    for (let iter = 0; iter < supersArray.length; iter += 1) {
      if (supersArray[iter] === 0) {
        superkeys.push(superkey);
        superkey = [];
      } else {
        superkey.push(supersArray[iter]);
      }
    }
    superkeys.push(superkey);

    if (
      (Array.isArray(superkeys[0]) && superkeys[0][0] === 0) ||
      superkeys[0].filter(v => v === 0).length === superkeys[0].length - 1
    )
      return [];
    return superkeys;
  }

  function macrosMap(macros) {
    if (macros.length === 0 || (macros.length === 1 && Array.isArray(macros[0].actions))) {
      return defaultMacroString;
    }
    const mapAction = action => {
      switch (action.type) {
        case 1:
          return [
            [action.type],
            [action.keyCode[0] >> 8],
            [action.keyCode[0] & 255],
            [action.keyCode[1] >> 8],
            [action.keyCode[1] & 255],
          ];
        case 2:
        case 3:
        case 4:
        case 5:
          return [[action.type], [action.keyCode >> 8], [action.keyCode & 255]];
        default:
          return [[action.type], [action.keyCode]];
      }
    };
    return macros
      .map(macro => macro.actions.map(action => mapAction(action)).concat([0]))
      .concat([0])
      .flat()
      .join(" ")
      .replaceAll(",", " ");
  }

  const macroTranslator = raw => {
    const { storedMacros } = state;
    if (raw.search(" 0 0") === -1) {
      return defaultMacro;
    }
    const macrosArray = raw.split(" 0 0")[0].split(" ").map(Number);

    // Translate received macros to human readable text
    const macros = [];
    let iter = 0;
    // macros are `0` terminated or when end of macrosArray has been reached, the outer loop
    // must cycle once more than the inner
    while (iter <= macrosArray.length) {
      const actions = [];
      while (iter < macrosArray.length) {
        const type = macrosArray[iter];
        if (type === 0) {
          break;
        }

        switch (type) {
          case 1:
            actions.push({
              type,
              keyCode: [
                (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)],
                (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)],
              ],
            });
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            actions.push({ type, keyCode: (macrosArray[(iter += 1)] << 8) + macrosArray[(iter += 1)] });
            break;
          case 6:
          case 7:
          case 8:
            actions.push({ type, keyCode: macrosArray[(iter += 1)] });
            break;
          default:
            break;
        }

        iter += 1;
      }
      macros.push({
        actions,
        name: "",
        macro: "",
      });
      iter += 1;
    }
    macros.forEach((m, idx) => {
      const aux = m;
      aux.id = idx;
      macros[idx] = aux;
    });

    // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
    const stored = storedMacros;
    if (stored === undefined || stored.length === 0) {
      return macros;
    }
    return macros.map((macro, i) => {
      if (stored.length < i) {
        return macro;
      }

      return {
        ...macro,
        name: stored[i]?.name,
        macro: macro.actions.map(k => keymapDB.parse(k.keyCode).label).join(" "),
      };
    });
  };

  const loadMacros = async () => {
    const { onDisconnect } = props;
    const { currentDevice } = deviceState;
    console.log("Loading macros!");
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      let chipID = await currentDevice.command("hardware.chip_id");
      chipID = chipID.replace(/\s/g, "");
      const neurons = store.get("neurons");
      const neuron = neurons.find(n => n.id === chipID) || {};
      state.neurons = neurons;
      state.neuronID = neurons.findIndex(n => n.id === chipID);
      state.storedMacros = neuron.macros;
      setState({ ...state });
      console.log("Looking for Bug!");
      const deviceLang = { ...currentDevice.device, language: true };
      currentDevice.commands.keymap = new Keymap(deviceLang);
      keymapDB = currentDevice.commands.keymap.db;
      let kbtype = "iso";
      try {
        kbtype = currentDevice.device && currentDevice.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      } catch (error) {
        return false;
      }
      let tMem = await currentDevice.command("macros.memory");
      tMem = parseInt(tMem, 10);
      if (tMem === undefined || tMem < 100) tMem = 2048;
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
      const macrosRaw = await currentDevice.command("macros.map");
      const parsedMacros = macroTranslator(macrosRaw);
      const supersRaw = await currentDevice.command("superkeys.map");
      const parsedSuper = superTranslator(supersRaw);
      state.macros = parsedMacros;
      state.superkeys = parsedSuper;
      state.keymap = keymap;
      state.kbtype = kbtype;
      state.modified = false;
      state.usedMemory = parsedMacros.map(m => m.actions).flat().length;
      state.totalMemory = tMem;
      state.loading = false;
      setState({ ...state });
      return true;
    } catch (e) {
      toast.error(<ToastMessage title={e} icon={<IconFloppyDisk />} />, { icon: "" });
      onDisconnect();
      return false;
    }
  };

  useEffect(() => {
    const macrosLoader = async () => {
      await loadMacros();
    };
    macrosLoader();
  }, []);

  const updateMacros = recievedMacros => {
    const { startContext } = props;
    state.macros = recievedMacros;
    state.modified = true;
    state.usedMemory = recievedMacros.map(m => m.actions).flat().length;
    setState({ ...state });
    startContext();
  };

  const updateKeyboard = keyboardIdx => {
    const { macros, keymap, selectedList } = state;
    let customKeymapList = [];
    for (let i = keyboardIdx; i < macros.length; i += 1) {
      const macroID = macros[i].id + 53852;
      const newKey = i === keyboardIdx ? selectedList : i - 1;
      const filteredKeys = keymap.custom
        ? keymap.custom
            .map((layer, layerIdx) =>
              layer.map((key, pos) => ({ layer: layerIdx, key, pos, newKey })).filter(elem => elem.key.keyCode === macroID),
            )
            .flat()
        : [];
      customKeymapList = customKeymapList.concat(filteredKeys);
    }
    state.listToDelete = customKeymapList;
    state.listToDeleteS = [];
    state.showDeleteModal = true;
    setState({ ...state });
  };

  const changeSelected = id => {
    state.selectedMacro = id < 0 ? 0 : id;
    setState({ ...state });
  };

  const deleteMacro = () => {
    const { macros, selectedMacro } = state;
    if (macros.length === 0) {
      return;
    }
    const selected = selectedMacro;
    let localMacros = [...macros];
    localMacros.splice(selected, 1);
    localMacros = localMacros.map((macro, idx) => {
      const item = { ...macro };
      item.id = idx;
      return item;
    });
    if (selected >= macros.length - 1) {
      changeSelected(macros.length - 2);
    }
    updateMacros(localMacros);
    updateKeyboard(selected);
  };

  const addMacro = name => {
    const { macros, maxMacros } = state;
    if (macros.length >= maxMacros) {
      return;
    }
    const aux = macros;
    const newID = aux.length;
    aux.push({
      actions: [],
      name,
      id: newID,
      macro: "",
    });
    updateMacros(aux);
    changeSelected(newID);
  };

  const addToActions = actions => {
    const { macros, selectedMacro } = state;

    const macrosList = [...macros];
    macrosList[selectedMacro].actions = actions;
    state.macros = macrosList;
    state.modified = true;
    setState({ ...state });
  };

  const duplicateMacro = () => {
    const { macros, maxMacros, selectedMacro } = state;
    if (macros.length >= maxMacros) {
      return;
    }
    const selected = selectedMacro;
    const aux = { ...macros[selected] };
    aux.id = macros.length;
    aux.name = `Copy of ${aux.name}`;
    macros.push(aux);
    updateMacros(macros);
    changeSelected(aux.id);
  };

  // Define updateActions function to update the actions of the selected macro
  const updateActions = actions => {
    const { macros, selectedMacro } = state;

    const macrosList = macros;
    macrosList[selectedMacro].actions = actions;
    state.macros = macrosList;
    state.modified = true;
    setState({ ...state });
  };

  const saveName = data => {
    const { macros, selectedMacro } = state;
    const localMacros = [...macros];
    localMacros[selectedMacro].name = data;
    state.macros = localMacros;
    state.modified = true;
    setState({ ...state });
  };

  const writeMacros = async () => {
    const { macros, neurons, neuronID, keymap } = state;
    const { currentDevice } = deviceState;
    const newMacros = macros;
    state.modified = false;
    state.macros = newMacros;
    state.storedMacros = newMacros;
    const localNeurons = [...neurons];
    localNeurons[neuronID].macros = newMacros;
    store.set("neurons", localNeurons);
    try {
      await currentDevice.command("macros.map", macrosMap(newMacros));
      await currentDevice.command("keymap", keymap);
      const commands = await Backup.Commands(currentDevice);
      const backup = await bkp.DoBackup(commands, neurons[neuronID].id, currentDevice);
      Backup.SaveBackup(backup, currentDevice);
      toast.success(<ToastMessage title={i18n.editor.macros.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
    } catch (error) {
      toast.error(<ToastMessage title={error} icon={<IconFloppyDisk />} />, { icon: "" });
    }
  };

  const toggleDeleteModal = () => {
    state.showDeleteModal = false;
    setState({ ...state });
  };

  const ActUponDelete = () => {
    const { selectedList, listToDelete, listToDeleteS, keymap, superkeys } = state;
    for (let i = 0; i < listToDelete.length; i += 1) {
      if (listToDelete[i].newKey === -1) {
        keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = keymapDB.parse(0);
      } else {
        keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = keymapDB.parse(listToDelete[i].newKey + 53852);
      }
    }
    for (let i = 0; i < listToDeleteS.length; i += 1) {
      if (selectedList === -1) {
        superkeys[listToDeleteS[i].i][listToDeleteS[i].pos] = 1;
      } else {
        superkeys[listToDeleteS[i].i][listToDeleteS[i].pos] = selectedList + 53852;
      }
    }
    state.keymap = keymap;
    state.superkeys = superkeys;
    setState({ ...state });
    toggleDeleteModal();
  };

  const UpdateList = data => {
    state.selectedList = data;
    setState({ ...state });
  };

  const {
    macros,
    maxMacros,
    modified,
    selectedList,
    selectedMacro,
    listToDelete,
    usedMemory,
    totalMemory,
    showDeleteModal,
    kbtype,
    currentLanguageLayout,
    loading,
  } = state;
  const ListOfMacros = listToDelete.map(({ layer, pos, key, newKey }) => {
    if (newKey === -1) {
      return (
        <Row key={`${key.keyCode}-${layer}-${pos}-${newKey}`}>
          <Col xs={12} className="px-0 text-center gridded">
            <p className="titles alignvert">{`Key in layer ${layer} and pos ${pos}`}</p>
          </Col>
        </Row>
      );
    }
    return "";
  });
  const ListCombo = (
    <DropdownButton
      id="Selectlayers"
      className="selectButton"
      // drop={"up"}
      title={macros.length > 0 && selectedList > -1 ? macros[selectedList]?.name : "No Key"}
      value={selectedList}
      onSelect={UpdateList}
    >
      <Dropdown.Item eventKey={-1} key={`macro-${-1}`} disabled={false}>
        No Key
      </Dropdown.Item>
      {macros.map(macro => (
        <Dropdown.Item eventKey={macro.id} key={`macro-${macro.id}`} disabled={macro.id === -1}>
          {macro?.name}
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
  if (loading) return <LogoLoaderCentered />;
  return (
    <Styles className="macroEditor">
      <Container fluid>
        <PageHeader
          text={i18n.app.menu.macros}
          contentSelector={
            <MacroSelector
              itemList={macros}
              selectedItem={selectedMacro}
              subtitle="Macros"
              onSelect={changeSelected}
              addItem={addMacro}
              deleteItem={deleteMacro}
              updateItem={saveName}
              cloneItem={duplicateMacro}
              maxMacros={maxMacros}
              mem={usedMemory}
              tMem={totalMemory}
            />
          }
          showSaving
          saveContext={writeMacros}
          destroyContext={loadMacros}
          inContext={modified}
        />
        <Callout
          content={i18n.editor.macros.callout}
          className="mt-md"
          size="sm"
          hasVideo
          media="MfTUvFrHLsE"
          videoTitle="13 Time-saving MACROS For Your Keyboard"
          videoDuration="5:24"
        />
        {macros[selectedMacro] === undefined || macros[selectedMacro].actions === undefined ? (
          <div />
        ) : (
          <>
            <TimelineEditorManager
              macro={macros[selectedMacro]}
              macros={macros}
              keymapDB={keymapDB}
              updateActions={updateActions}
            />
            <MacroCreator
              macro={JSON.parse(JSON.stringify(macros[selectedMacro]))}
              macros={macros}
              selected={selectedMacro}
              addToActions={addToActions}
              changeSelected={changeSelected}
              keymapDB={keymapDB}
              selectedlanguage={currentLanguageLayout}
              kbtype={kbtype}
            />
          </>
        )}
      </Container>
      <Modal show={showDeleteModal} onHide={toggleDeleteModal} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title>{i18n.editor.macros.deleteModal.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ListOfMacros}
          <p>{i18n.editor.macros.deleteModal.body}</p>
          {ListCombo}
        </Modal.Body>
        <Modal.Footer>
          <RegularButton
            buttonText={i18n.editor.macros.deleteModal.cancelButton}
            styles="outline transp-bg"
            size="sm"
            onClick={toggleDeleteModal}
          />
          <RegularButton
            buttonText={i18n.editor.macros.deleteModal.applyButton}
            styles="outline gradient"
            size="sm"
            onClick={ActUponDelete}
          />
        </Modal.Footer>
      </Modal>
    </Styles>
  );
}

MacroEditor.propTypes = {
  startContext: PropTypes.func,
  onDisconnect: PropTypes.func,
};

export default MacroEditor;

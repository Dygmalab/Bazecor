/* eslint-disable react/jsx-no-bind */
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
import { IconFloppyDisk, IconLoader } from "@Renderer/component/Icon";
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

function MacroEditor(props) {
  let keymapDB = new KeymapDB();
  const bkp = new Backup();
  const [isSaving, setIsSaving] = useState(false);

  const flatten = arr => [].concat(...arr);

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
    listToDeleteM: [],
    selectedList: -1,
    usedMemory: 0,
    totalMemory: 0,
    macrosEraser: [],
    loading: true,
    currentLanguageLayout: store.get("settings.language") || "english",
    kbtype: "ansi",
    scrollPos: 0,
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

  function superkeyMap(superkeys) {
    // console.log(superkeys);
    // console.log(superkeys[0].length);
    if (
      superkeys.length === 0 ||
      (superkeys.length === 1 && superkeys[0].length === 0) ||
      (superkeys.length === 1 && superkeys[0].length === 1 && superkeys[0] === 0)
    ) {
      return Array(512).fill("65535").join(" ");
    }
    let keyMap = [...superkeys];
    // console.log("First", keyMap);
    keyMap = keyMap.map(sky => {
      let sk = sky;
      sk = sk.map(act => {
        if (act === 0 || act == null) return 1;
        return act;
      });
      return sk;
    });
    // console.log("Third", keyMap);
    keyMap = keyMap.map(superkey => superkey.concat([0]));
    // console.log("Fifth", keyMap);
    const mapped = []
      .concat(...keyMap.flat())
      .concat([0])
      .join(" ")
      .replaceAll(",", " ");
    // console.log(mapped, keyMap);
    return mapped;
  }

  function macrosMap(macros) {
    const { macrosEraser } = state;
    console.log(
      "Macros map function",
      macros,
      macrosEraser,
      macros.length === 0,
      macros.length === 1 && Array.isArray(macros[0].actions),
    );
    if (macros.length === 0 || (macros.length === 1 && !Array.isArray(macros[0].actions))) {
      return macrosEraser;
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
    const result = macros
      .map(macro => macro.actions.map(action => mapAction(action)).concat([0]))
      .concat([0])
      .flat()
      .join(" ")
      .replaceAll(",", " ");
    console.log("MACROS GOING TO BE SAVED", result);
    return result;
  }

  function addToActions(actions) {
    const { startContext } = props;
    const { macros, selectedMacro } = state;

    const macrosList = [...macros];
    macrosList[selectedMacro].actions = actions;
    state.macros = macrosList;
    state.modified = true;
    setState({ ...state });
    startContext();
  }

  // Define updateActions function to update the actions of the selected macro
  function updateActions(actions) {
    const { startContext } = props;
    const { macros, selectedMacro, modified } = state;

    const macrosList = macros;
    macrosList[selectedMacro].actions = actions;
    if (!modified) {
      state.macros = macrosList;
      state.modified = true;
      setState({ ...state });
      startContext();
    } else {
      state.macros = macrosList;
      setState({ ...state });
    }
  }

  function saveName(data) {
    const { startContext } = props;
    const { macros, selectedMacro } = state;
    const localMacros = [...macros];
    localMacros[selectedMacro].name = data;
    state.macros = localMacros;
    state.modified = true;
    setState({ ...state });
    startContext();
  }

  function updateScroll(scrollPos) {
    state.scrollPos = scrollPos;
    setState({ ...state });
  }

  function changeSelected(id) {
    state.selectedMacro = id < 0 ? 0 : id;
    setState({ ...state });
  }

  function updateMacros(recievedMacros) {
    const { startContext } = props;
    state.macros = recievedMacros;
    state.modified = true;
    state.usedMemory = recievedMacros.map(m => m.actions).flat().length;
    setState({ ...state });
    startContext();
  }

  function duplicateMacro() {
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
  }

  async function writeMacros() {
    const { macros, neurons, neuronID, keymap, superkeys } = state;
    const { setLoading, cancelContext } = props;
    const { currentDevice } = deviceState;
    setIsSaving(true);
    setLoading(true);
    console.log("saving Macros:", macros, keymap, superkeys);
    const newMacros = macros;
    const localNeurons = [...neurons];
    localNeurons[neuronID].macros = newMacros;
    store.set("neurons", localNeurons);
    try {
      await currentDevice.command("macros.map", macrosMap(newMacros));
      const args = flatten(keymap.custom).map(k => keymapDB.serialize(k));
      await currentDevice.command("keymap.custom", ...args);
      await currentDevice.command("superkeys.map", superkeyMap(superkeys));
      const commands = await Backup.Commands(currentDevice);
      const backup = await bkp.DoBackup(commands, neurons[neuronID].id, currentDevice);
      Backup.SaveBackup(backup, currentDevice);
      toast.success(<ToastMessage title={i18n.editor.macros.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
      state.modified = false;
      state.macros = newMacros;
      state.storedMacros = newMacros;
      setState({ ...state });
      cancelContext();
      setLoading(false);
      setIsSaving(false);
    } catch (error) {
      console.log("error when writing macros");
      console.error(error);
      toast.error(<ToastMessage title="Error when sending macros to the device" icon={<IconFloppyDisk />} />, { icon: "" });
      cancelContext();
      setLoading(false);
      setIsSaving(false);
    }
  }

  function toggleDeleteModal() {
    state.showDeleteModal = false;
    setState({ ...state });
  }

  function ActUponDelete() {
    const { selectedList, listToDelete, listToDeleteS, listToDeleteM, keymap, superkeys } = state;
    let { macros } = state;
    console.log("Checking list to delete macros", listToDeleteM, macros);
    for (let i = 0; i < listToDelete.length; i += 1) {
      if (listToDelete[i].newKey === -1) {
        keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = keymapDB.parse(
          selectedList === -1 ? 0 : selectedList + 53852,
        );
      } else {
        keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = keymapDB.parse(listToDelete[i].newKey + 53852);
      }
    }
    for (let i = 0; i < listToDeleteS.length; i += 1) {
      if (listToDeleteS[i].newKey === -1) {
        superkeys[listToDeleteS[i].superIdx][listToDeleteS[i].pos] = selectedList === -1 ? 1 : selectedList + 53852;
      } else {
        superkeys[listToDeleteS[i].superIdx][listToDeleteS[i].pos] = listToDeleteS[i].newKey + 53852;
      }
    }
    for (let i = 0; i < listToDeleteM.length; i += 1) {
      if (listToDeleteM[i].newKey === -1) {
        if (selectedList === -1) {
          macros[listToDeleteM[i].macroIdx].actions[listToDeleteM[i].pos] = undefined;
        } else {
          macros[listToDeleteM[i].macroIdx].actions[listToDeleteM[i].pos].keyCode = selectedList + 53852;
        }
      } else {
        macros[listToDeleteM[i].macroIdx].actions[listToDeleteM[i].pos].keyCode = listToDeleteM[i].newKey + 53852;
      }
    }
    macros = macros.map(macro => {
      const newMacro = { ...macro };
      newMacro.actions = macro.actions.filter(x => x !== undefined);
      return newMacro;
    });
    console.log("result!", macros);
    state.keymap = keymap;
    state.superkeys = superkeys;
    state.macros = macros;
    setState({ ...state });
    toggleDeleteModal();
  }

  function UpdateList(data) {
    state.selectedList = parseInt(data, 10);
    setState({ ...state });
  }

  function updateKeyboard(keyboardIdx) {
    const { macros, superkeys, keymap } = state;
    let customKeymapList = [];
    let customSuperList = [];
    let customMacrosList = [];
    for (let i = keyboardIdx; i < macros.length; i += 1) {
      const macroID = macros[i].id + 53852;
      const newKey = i === keyboardIdx ? -1 : i - 1;
      const filteredKeys = keymap.custom
        ? keymap.custom
            .map((layer, layerIdx) =>
              layer.map((key, pos) => ({ layer: layerIdx, key, pos, newKey })).filter(elem => elem.key.keyCode === macroID),
            )
            .flat()
        : [];
      const superkeyList = superkeys
        ? superkeys
            .map((supers, superIdx) =>
              supers.map((action, pos) => ({ superIdx, pos, newKey, action })).filter(elem => elem.action === macroID),
            )
            .flat()
        : [];
      const macrosList = macros
        ? macros
            .map((macro, macroIdx) =>
              macro.actions
                .map((action, pos) => ({ macroIdx: macroIdx - 1, pos, newKey, actions: macro.actions }))
                .filter(elem => elem.actions[elem.pos].keyCode === macroID),
            )
            .flat()
        : [];
      customKeymapList = customKeymapList.concat(filteredKeys);
      customSuperList = customSuperList.concat(superkeyList);
      customMacrosList = customMacrosList.concat(macrosList);
    }

    state.listToDelete = customKeymapList;
    state.listToDeleteS = customSuperList;
    state.listToDeleteM = customMacrosList;
    state.showDeleteModal = customKeymapList.length > 0 || customSuperList.length > 0 || customMacrosList.length > 0;
    setState({ ...state });
  }

  function deleteMacro() {
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
  }

  function addMacro(name) {
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
  }

  function clearMacro() {
    const { macros, selectedMacro } = state;
    if (macros.length === 0) {
      return;
    }
    const localMacros = [...macros];
    localMacros[selectedMacro].actions = [];
    updateMacros(localMacros);
  }

  function macroTranslator(raw) {
    const { storedMacros } = state;
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
  }

  const loadMacros = async () => {
    const { onDisconnect, cancelContext, setLoading } = props;
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
        console.log("error when reading focus.device and kbType for Macros");
        console.error(error);
        setLoading(false);
        throw Error(error);
      }
      let tMem = await currentDevice.command("macros.memory");
      if (tMem === "") {
        tMem = 2048;
      } else {
        tMem = parseInt(tMem, 10);
      }
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
      state.macrosEraser = Array(tMem).fill("255").join(" ");
      state.loading = false;
      setState({ ...state });
      cancelContext();
      setLoading(false);
      return true;
    } catch (error) {
      console.log("error when loading macros");
      console.error(error);
      toast.error(<ToastMessage title="Error when loading macros from the device" icon={<IconLoader />} />, { icon: "" });
      cancelContext();
      setLoading(false);
      onDisconnect();
      return false;
    }
  };

  const destroyThisContext = async () => {
    const { setLoading } = props;
    state.loading = true;
    setState({ ...state });
    await loadMacros();
    state.loading = false;
    setState({ ...state });
    setLoading(state.loading);
  };

  useEffect(() => {
    const macrosLoader = async () => {
      const { setLoading } = props;
      await loadMacros();
      state.loading = false;
      setState({ ...state });
      setLoading(state.loading);
    };
    macrosLoader();
  }, []);

  const {
    macros,
    maxMacros,
    modified,
    selectedList,
    selectedMacro,
    listToDelete,
    listToDeleteS,
    listToDeleteM,
    usedMemory,
    totalMemory,
    showDeleteModal,
    kbtype,
    currentLanguageLayout,
    loading,
    scrollPos,
  } = state;

  let ListOfDeletes = listToDelete.map(({ layer, pos, key, newKey }) => {
    if (newKey === -1) {
      return (
        <Row key={`${key.keyCode}-${layer}-${pos}-${newKey}`}>
          <Col xs={12} className="px-0 text-center gridded">
            <p className="titles alignvert">{`Key in layer ${layer + 1} and pos ${pos + 1}`}</p>
          </Col>
        </Row>
      );
    }
    return "";
  });
  ListOfDeletes = ListOfDeletes.concat(
    listToDeleteS.map(({ superIdx, pos, newKey }) => {
      const actions = ["Tap", "Hold", "Tap & hold", "2Tap", "2Tap & hold"];
      if (newKey === -1) {
        return (
          <Row key={`${superIdx}-${pos}-${newKey}`}>
            <Col xs={12} className="px-0 text-center gridded">
              <p className="titles alignvert">{`Key in Superkey ${superIdx + 1} and action ${actions[pos]}`}</p>
            </Col>
          </Row>
        );
      }
      return "";
    }),
  );
  ListOfDeletes = ListOfDeletes.concat(
    listToDeleteM.map(({ macroIdx, pos, newKey }) => {
      if (newKey === -1) {
        return (
          <Row key={`${macroIdx}-${pos}-${newKey}`}>
            <Col xs={12} className="px-0 text-center gridded">
              <p className="titles alignvert">{`Key in Macro ${macroIdx + 1} and action ${pos}`}</p>
            </Col>
          </Row>
        );
      }
      return "";
    }),
  );

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
          isSaving={isSaving}
          saveContext={writeMacros}
          destroyContext={destroyThisContext}
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
              clearMacro={clearMacro}
              keymapDB={keymapDB}
              updateActions={updateActions}
              updateScroll={updateScroll}
              scrollPos={scrollPos}
            />
            <MacroCreator
              macro={{ ...macros[selectedMacro] }}
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
          {ListOfDeletes}
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
  setLoading: PropTypes.func,
  setLoading: PropTypes.func,
  cancelContext: PropTypes.func,
};

export default MacroEditor;

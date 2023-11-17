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

import React from "react";
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

import Backup from "../../api/backup";
import Focus from "../../api/focus";
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

class MacroEditor extends React.Component {
  static superTranslator(raw) {
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

  static superkeyMap(superkeys) {
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

  constructor(props) {
    super(props);

    this.keymapDB = new KeymapDB();
    this.bkp = new Backup();

    this.state = {
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
      scrollPos: 0,
      currentLanguageLayout: store.get("settings.language") || "english",
    };
    this.updateMacros = this.updateMacros.bind(this);
    this.changeSelected = this.changeSelected.bind(this);
    this.loadMacros = this.loadMacros.bind(this);
    this.writeMacros = this.writeMacros.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.UpdateList = this.UpdateList.bind(this);
    this.ActUponDelete = this.ActUponDelete.bind(this);
  }

  async componentDidMount() {
    await this.loadMacros();
  }

  deleteMacro = () => {
    const { macros, selectedMacro } = this.state;
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
      this.changeSelected(macros.length - 2);
    }
    this.updateMacros(localMacros);
    this.updateKeyboard(selected);
  };

  addMacro = name => {
    const { macros, maxMacros } = this.state;
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
    this.updateMacros(aux);
    this.changeSelected(newID);
  };

  addToActions = actions => {
    const { startContext } = this.props;
    const { macros, selectedMacro } = this.state;

    const macrosList = JSON.parse(JSON.stringify(macros));
    macrosList[selectedMacro].actions = actions;
    this.setState({ macros: macrosList, modified: true });
    startContext();
  };

  duplicateMacro = () => {
    const { macros, maxMacros, selectedMacro } = this.state;
    if (macros.length >= maxMacros) {
      return;
    }
    const selected = selectedMacro;
    const aux = { ...macros[selected] };
    aux.id = macros.length;
    aux.name = `Copy of ${aux.name}`;
    macros.push(aux);
    this.updateMacros(macros);
    this.changeSelected(aux.id);
  };

  // Define updateActions function to update the actions of the selected macro
  updateActions = actions => {
    const { startContext } = this.props;
    const { macros, selectedMacro, modified } = this.state;

    const macrosList = macros;
    macrosList[selectedMacro].actions = actions;
    if (!modified) {
      this.setState({ macros: macrosList, modified: true });
      startContext();
    } else {
      this.setState({ macros: macrosList });
    }
  };

  saveName = data => {
    const { startContext } = this.props;
    const { macros, selectedMacro } = this.state;
    const localMacros = JSON.parse(JSON.stringify(macros));
    localMacros[selectedMacro].name = data;
    this.setState({ macros: localMacros, modified: true });
    startContext();
  };

  updateScroll = scrollPos => {
    this.setState({ scrollPos });
  };

  macrosMap = macros => {
    const { macrosEraser } = this.state;
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
  };

  updateMacros(recievedMacros) {
    const { startContext } = this.props;
    this.setState({
      macros: recievedMacros,
      modified: true,
      usedMemory: recievedMacros.map(m => m.actions).flat().length,
    });
    startContext();
  }

  async writeMacros() {
    const { macros, neurons, neuronID, keymap, superkeys } = this.state;
    const { setLoading, cancelContext } = this.props;
    setLoading(true);
    console.log("saving Macros:", macros, keymap, superkeys);
    const focus = new Focus();
    const newMacros = macros;
    const localNeurons = JSON.parse(JSON.stringify(neurons));
    localNeurons[neuronID].macros = newMacros;
    store.set("neurons", localNeurons);
    try {
      await focus.command("macros.map", this.macrosMap(newMacros));
      await focus.command("keymap", keymap);
      await focus.command("superkeys.map", MacroEditor.superkeyMap(superkeys));
      const commands = await this.bkp.Commands();
      const backup = await this.bkp.DoBackup(commands, neurons[neuronID].id);
      this.bkp.SaveBackup(backup);
      toast.success(<ToastMessage title={i18n.editor.macros.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
      this.setState({
        modified: false,
        macros: newMacros,
        storedMacros: newMacros,
      });
      cancelContext();
      setLoading(false);
    } catch (error) {
      console.log("error when writing macros");
      console.error(error);
      toast.error(<ToastMessage title="Error when sending macros to the device" icon={<IconFloppyDisk />} />, { icon: "" });
      cancelContext();
      setLoading(false);
    }
  }

  changeSelected(id) {
    this.setState({
      selectedMacro: id < 0 ? 0 : id,
    });
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: false });
  }

  ActUponDelete() {
    const { selectedList, listToDelete, listToDeleteS, listToDeleteM, keymap, superkeys } = this.state;
    let { macros } = this.state;
    console.log("Checking list to delete macros", listToDeleteM, macros);
    for (let i = 0; i < listToDelete.length; i += 1) {
      if (listToDelete[i].newKey === -1) {
        keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = this.keymapDB.parse(
          selectedList === -1 ? 0 : selectedList + 53852,
        );
      } else {
        keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = this.keymapDB.parse(listToDelete[i].newKey + 53852);
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
    this.setState({ keymap, superkeys, macros });
    this.toggleDeleteModal();
  }

  UpdateList(data) {
    this.setState({ selectedList: parseInt(data, 10) });
  }

  updateKeyboard(keyboardIdx) {
    const { macros, superkeys, keymap } = this.state;
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

    this.setState({
      listToDelete: customKeymapList,
      listToDeleteS: customSuperList,
      listToDeleteM: customMacrosList,
      showDeleteModal: customKeymapList.length > 0 || customSuperList.length > 0 || customMacrosList.length > 0,
    });
  }

  macroTranslator(raw) {
    const { storedMacros } = this.state;
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
        macro: macro.actions.map(k => this.keymapDB.parse(k.keyCode).label).join(" "),
      };
    });
  }

  async loadMacros() {
    const { onDisconnect, setLoading, cancelContext } = this.props;
    setLoading(true);
    const focus = new Focus();
    try {
      const chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
      const neurons = store.get("neurons");
      const neuron = neurons.find(n => n.id === chipID) || {};
      this.setState({
        neurons,
        neuronID: neurons.findIndex(n => n.id === chipID),
        storedMacros: neuron.macros,
      });
      focus.commands.keymap = new Keymap({ ...focus.device, language: true });
      this.keymapDB = focus.commands.keymap.db;
      let kbtype = "iso";
      try {
        kbtype = focus.device && focus.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      } catch (error) {
        console.log("error when reading focus.device and kbType for Macros");
        console.error(error);
        setLoading(false);
        throw Error(error);
      }

      let tMem = await focus.command("macros.memory");
      tMem = parseInt(tMem, 10);
      if (tMem === undefined || tMem < 100) tMem = 2048;
      const keymap = await focus.command("keymap");
      const macrosRaw = await focus.command("macros.map");
      const parsedMacros = this.macroTranslator(macrosRaw);
      const supersRaw = await focus.command("superkeys.map");
      const parsedSuper = MacroEditor.superTranslator(supersRaw);
      this.setState({
        macros: parsedMacros,
        superkeys: parsedSuper,
        keymap,
        kbtype,
        modified: false,
        usedMemory: parsedMacros.map(m => m.actions).flat().length,
        totalMemory: tMem,
        macrosEraser: Array(tMem).fill("255").join(" "),
        loading: false,
      });
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
  }

  render() {
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
    } = this.state;
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
        onSelect={this.UpdateList}
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
                onSelect={this.changeSelected}
                addItem={this.addMacro}
                deleteItem={this.deleteMacro}
                updateItem={this.saveName}
                cloneItem={this.duplicateMacro}
                maxMacros={maxMacros}
                mem={usedMemory}
                tMem={totalMemory}
              />
            }
            showSaving
            saveContext={this.writeMacros}
            destroyContext={this.loadMacros}
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
                keymapDB={this.keymapDB}
                updateActions={this.updateActions}
                updateScroll={this.updateScroll}
                scrollPos={scrollPos}
              />
              <MacroCreator
                macro={JSON.parse(JSON.stringify(macros[selectedMacro]))}
                macros={macros}
                selected={selectedMacro}
                addToActions={this.addToActions}
                changeSelected={this.changeSelected}
                keymapDB={this.keymapDB}
                selectedlanguage={currentLanguageLayout}
                kbtype={kbtype}
              />
            </>
          )}
        </Container>
        <Modal
          show={showDeleteModal}
          onHide={this.toggleDeleteModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
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
              onClick={this.toggleDeleteModal}
            />
            <RegularButton
              buttonText={i18n.editor.macros.deleteModal.applyButton}
              styles="outline gradient"
              size="sm"
              onClick={this.ActUponDelete}
            />
          </Modal.Footer>
        </Modal>
      </Styles>
    );
  }
}

MacroEditor.propTypes = {
  startContext: PropTypes.func,
  onDisconnect: PropTypes.func,
  setLoading: PropTypes.func,
  cancelContext: PropTypes.func,
};

export default MacroEditor;

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
import PageHeader from "@Renderer/modules/PageHeader";

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

class MacroEditor extends React.Component {
  constructor(props) {
    super(props);

    this.keymapDB = new KeymapDB();
    this.bkp = new Backup();

    this.state = {
      keymap: [],
      macros: [],
      superkeys: [],
      storedMacros: [],
      storedSuper: [],
      maxMacros: 128,
      modified: false,
      selectedMacro: 0,
      showDeleteModal: false,
      listToDelete: [],
      listToDeleteS: [],
      selectedList: 0,
      usedMemory: 0,
      totalMemory: 0,
      loading: true,
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

  async loadMacros() {
    const focus = new Focus();
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      const chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
      const neurons = store.get("neurons");
      const neuron = neurons.find(n => n.id === chipID) || {};
      this.setState({
        neurons,
        neuronID: neurons.findIndex(n => n.id === chipID),
        storedMacros: neuron.macros,
        storedSuper: neuron.superkeys,
      });
      focus.commands.keymap = new Keymap({ ...focus.device, language: true });
      this.keymapDB = focus.commands.keymap.db;
      let kbtype = "iso";
      try {
        kbtype = focus.device && focus.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      } catch (error) {
        return false;
      }

      let tMem = await focus.command("macros.memory");
      tMem = parseInt(tMem);
      if (tMem === undefined || tMem < 100) tMem = 2048;
      const keymap = await focus.command("keymap");
      const macrosRaw = await focus.command("macros.map");
      const parsedMacros = this.macroTranslator(macrosRaw);
      const supersRaw = await focus.command("superkeys.map");
      const parsedSuper = this.superTranslator(supersRaw);
      this.setState({
        macros: parsedMacros,
        superkeys: parsedSuper,
        keymap,
        kbtype,
        modified: false,
        usedMemory: parsedMacros.map(m => m.actions).flat().length,
        totalMemory: tMem,
        loading: false,
      });
    } catch (e) {
      toast.error(<ToastMessage title={e} icon={<IconFloppyDisk />} />, { icon: "" });
      this.props.onDisconnect();
    }
  }

  macroTranslator(raw) {
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
              keyCode: [(macrosArray[++iter] << 8) + macrosArray[++iter], (macrosArray[++iter] << 8) + macrosArray[++iter]],
            });
            break;
          case 2:
          case 3:
          case 4:
          case 5:
            actions.push({ type, keyCode: (macrosArray[++iter] << 8) + macrosArray[++iter] });
            break;
          case 6:
          case 7:
          case 8:
            actions.push({ type, keyCode: macrosArray[++iter] });
            break;
          default:
            break;
        }

        iter++;
      }
      macros.push({
        actions,
        name: "",
        macro: "",
      });
      iter++;
    }
    macros.forEach((m, idx) => (m.id = idx));

    // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
    const stored = this.state.storedMacros;
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

  duplicateMacro = () => {
    if (this.state.macros.length >= this.state.maxMacros) {
      return;
    }
    const { macros } = this.state;
    const selected = this.state.selectedMacro;
    const aux = { ...this.state.macros[selected] };
    aux.id = this.state.macros.length;
    aux.name = `Copy of ${aux.name}`;
    macros.push(aux);
    this.updateMacros(macros);
    this.changeSelected(aux.id);
  };

  superTranslator(raw) {
    if (raw.search(" 0 0 ") === -1) {
      return [];
    }
    const supersArray = raw.split(" 0 0")[0].split(" ").map(Number);

    const superkeys = [];
    let superkey = [];
    for (let iter = 0; iter < supersArray.length; iter++) {
      if (supersArray[iter] === 0) {
        superkeys.push(superkey);
        superkey = [];
      } else {
        superkey.push(supersArray[iter]);
      }
    }
    superkeys.push(superkey);

    if (superkeys[0] == [0] || superkeys[0].filter(v => v === 0).length == superkeys[0].length - 1) return [];
    return superkeys;
  }

  updateKeyboard(keyboardIdx) {
    const macroID = this.state.macros[keyboardIdx].id + 53852;
    const customKeymapList = this.state.keymap.custom
      .map((layer, layerIdx) =>
        layer.map((key, pos) => ({ layer: layerIdx, key, pos })).filter(elem => elem.key.keyCode === macroID),
      )
      .flat();
    const superkeyList = this.state.superkey
      .map((supers, i) => supers.map((action, pos) => ({ i, pos, action })).filter(elem => elem.action === macroID))
      .flat();
    this.setState({
      listToDelete: customKeymapList,
      listToDeleteS: superkeyList,
      showDeleteModal: true,
    });
  }

  updateMacros(recievedMacros) {
    this.setState({
      macros: recievedMacros,
      modified: true,
      usedMemory: recievedMacros.map(m => m.actions).flat().length,
    });
    this.props.startContext();
  }

  async writeMacros() {
    const focus = new Focus();
    const newMacros = this.state.macros;
    this.setState({
      modified: false,
      macros: newMacros,
      storedMacros: newMacros,
    });
    const neurons = JSON.parse(JSON.stringify(this.state.neurons));
    neurons[this.state.neuronID].macros = newMacros;
    store.set("neurons", neurons);
    try {
      await focus.command("macros.map", this.macrosMap(newMacros));
      await focus.command("keymap", this.state.keymap);
      const commands = await this.bkp.Commands();
      const backup = await this.bkp.DoBackup(commands, this.state.neurons[this.state.neuronID].id);
      this.bkp.SaveBackup(backup);
      toast.success(<ToastMessage title={i18n.editor.macros.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
    } catch (error) {
      toast.error(<ToastMessage title={error} icon={<IconFloppyDisk />} />, { icon: "" });
    }
  }

  macrosMap(macros) {
    if (macros.length === 0 || (macros.length === 1 && macros[0].actions === [])) {
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

  changeSelected(id) {
    this.setState({
      selectedMacro: id < 0 ? 0 : id,
    });
  }

  toggleDeleteModal() {
    this.setState({ showDeleteModal: false });
  }

  ActUponDelete() {
    const { selectedList, listToDelete, listToDeleteS, keymap, superkeys } = this.state;
    for (let i = 0; i < listToDelete.length; i += 1) {
      if (selectedList === -1) {
        keymap[listToDelete[i].layer][listToDelete[i].pos] = this.keymapDB.parse(0);
      } else {
        keymap[listToDelete[i].layer][listToDelete[i].pos] = this.keymapDB.parse(selectedList + 53852);
      }
    }
    for (let i = 0; i < listToDeleteS.length; i += 1) {
      if (selectedList === -1) {
        superkeys[listToDeleteS[i].i][listToDeleteS[i].pos] = 1;
      } else {
        superkeys[listToDeleteS[i].i][listToDeleteS[i].pos] = selectedList + 53852;
      }
    }
    this.setState({ keymap, superkeys });
    this.toggleDeleteModal();
  }

  UpdateList(data) {
    this.setState({ selectedList: data });
  }

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

  deleteMacro = () => {
    const { macros, selectedMacro } = this.state;
    if (macros.length === 0) {
      return;
    }
    const aux = JSON.parse(JSON.stringify(macros));
    const selected = selectedMacro;
    aux.splice(selected, 1);
    aux.forEach((item, idx) => {
      aux.id = idx;
    });
    if (selected >= macros.length - 1) {
      this.changeSelected(macros.length - 2);
    }
    this.updateMacros(aux);
    this.updateKeyboard(selected);
  };

  saveName = data => {
    const { macros, selectedMacro } = this.state;
    const localMacros = JSON.parse(JSON.stringify(macros));
    localMacros[selectedMacro].name = data;
    this.setState({ macros: localMacros, modified: true });
  };

  // Define updateActions function to update the actions of the selected macro
  updateActions = actions => {
    const { macros, selectedMacro } = this.state;

    const macrosList = macros;
    macrosList[selectedMacro].actions = actions;
    this.setState({ macros: macrosList, modified: true });
  };

  addToActions = actions => {
    const { macros, selectedMacro } = this.state;

    const macrosList = JSON.parse(JSON.stringify(macros));
    macrosList[selectedMacro].actions = actions;
    this.setState({ macros: macrosList, modified: true });
  };

  render() {
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
    } = this.state;
    const ListOfMacros = listToDelete.map(({ layer, pos, key }, id) => (
      <Row key={id}>
        <Col xs={12} className="px-0 text-center gridded">
          <p className="titles alignvert">{`Key in layer ${layer} and pos ${pos}`}</p>
        </Col>
      </Row>
    ));
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
        {macros.map((macro, id) => (
          <Dropdown.Item eventKey={macro.id} key={`macro-${id}`} disabled={macro.id === -1}>
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
            <p>{i18n.editor.macros.deleteModal.body}</p>
            {ListOfMacros}
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

export default MacroEditor;

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

// Styling and elements
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";

// Components
import Callout from "@Renderer/component/Callout";
import { LayoutViewSelector } from "@Renderer/component/ToggleButtons";
import { SuperkeysSelector } from "@Renderer/component/Select";
import { RegularButton } from "@Renderer/component/Button";
import { LogoLoaderCentered } from "@Renderer/component/Loader";

import ToastMessage from "@Renderer/component/ToastMessage";
import { IconFloppyDisk } from "@Renderer/component/Icon";

// Modules
import { PageHeader } from "@Renderer/modules/PageHeader";
import { SuperKeysFeatures, SuperkeyActions } from "@Renderer/modules/Superkeys";
import { KeyPickerKeyboard } from "@Renderer/modules/KeyPickerKeyboard";
import StandardView from "@Renderer/modules/StandardView";

// API's
import i18n from "../i18n";
import Keymap, { KeymapDB } from "../../api/keymap";
import Focus from "../../api/focus";
import Backup from "../../api/backup";

import Store from "../utils/Store";

const store = Store.getStore();

const Styles = Styled.div`
&.superkeys {
  display: flex;
  min-height: 100%;
  .layoutSelector {
    margin-left: 15px;
  }
}
height: -webkit-fill-available;
display: flex;
flex-direction: column;
  .toggle-button{
    text-align: center;
    padding-bottom: 8px;
  }
  .save-button {
    text-align: center;
  }
  .supercontainer {
    margin-right: auto;
    margin-left: auto;
    margin-top: 0.4rem;
    width: inherit;
  }
.button-large {
  font-size: 2rem;
  width: -webkit-fill-available;
  text-align: left;
}
`;

const ModalStyle = Styled.div`
  .modalcol {
    color: ${({ theme }) => theme.colors.text};
    background-color: ${({ theme }) => theme.colors.button.deselected};
  }
  .modal-footer {
    justify-content: space-between;
  }
  .titles {
    margin-bottom: 0;
  }
  .alignvert {
    padding-top: 10px;
    float: left;
  }
  .selectButton {
    float: left;
    .dropdown-toggle{
      font-size: 0.97rem;
    }
  }
  .gridded {
    display: grid;
  }
`;

class SuperkeysEditor extends React.Component {
  constructor(props) {
    super(props);

    this.keymapDB = new KeymapDB();
    this.bkp = new Backup();

    this.state = {
      keymap: [],
      macros: [],
      storedMacros: [],
      superkeys: [],
      maxSuperKeys: 128,
      modified: false,
      modifiedKeymap: false,
      selectedSuper: 0,
      selectedAction: -1,
      showDeleteModal: false,
      listToDelete: [],
      futureSK: [],
      futureSSK: 0,
      currentLanguageLayout: store.get("settings.language") || "english",
      isStandardViewSuperkeys: store.get("settings.isStandardViewSuperkeys") || true,
      showStandardView: false,
    };
    this.changeSelected = this.changeSelected.bind(this);
    this.updateSuper = this.updateSuper.bind(this);
    this.changeAction = this.changeAction.bind(this);
    this.updateAction = this.updateAction.bind(this);
    this.loadSuperkeys = this.loadSuperkeys.bind(this);
    this.onKeyChange = this.onKeyChange.bind(this);
    this.saveName = this.saveName.bind(this);
    this.writeSuper = this.writeSuper.bind(this);
    this.checkKBSuperkeys = this.checkKBSuperkeys.bind(this);
    this.toggleDeleteModal = this.toggleDeleteModal.bind(this);
    this.RemoveDeletedSK = this.RemoveDeletedSK.bind(this);
    this.onToggle = this.onToggle.bind(this);
  }

  async componentDidMount() {
    await this.loadSuperkeys();
    await this.configStandarView();
  }

  handleSaveStandardView = () => {
    this.setState({ showStandardView: false, selectedAction: -1 });
  };

  closeStandardViewModal = code => {
    this.onKeyChange(code);
    this.setState({ showStandardView: false, selectedAction: -1 });
  };

  onToggle = () => {
    const { isStandardViewSuperkeys } = this.state;
    if (isStandardViewSuperkeys) {
      this.setState({ isStandardViewSuperkeys: false, selectedAction: -1 });
    } else {
      this.setState({ isStandardViewSuperkeys: true, selectedAction: -1 });
    }
  };

  deleteSuperkey = () => {
    const { superkeys, selectedSuper } = this.state;
    if (superkeys.length > 0) {
      let aux = JSON.parse(JSON.stringify(superkeys));
      const selected = selectedSuper;
      aux.splice(selected, 1);
      aux = aux.map((item, index) => {
        const newItem = item;
        newItem.id = index;
        return newItem;
      });
      if (selected >= superkeys.length - 1) {
        this.checkKBSuperkeys(aux, aux.length - 1, aux.length + 53980);
      } else {
        this.checkKBSuperkeys(aux, selected, selected + 53980);
      }
    }
  };

  duplicateSuperkey = () => {
    const { superkeys, selectedSuper } = this.state;
    const aux = { ...superkeys[selectedSuper] };
    aux.id = superkeys.length;
    aux.name = `Copy of ${aux.name}`;
    aux.actions = [...aux.actions];
    superkeys.push(aux);
    this.updateSuper(superkeys, -1);
    this.changeSelected(aux.id);
  };

  addSuperkey = SKname => {
    const { superkeys, maxSuperKeys } = this.state;
    console.log("TEST", superkeys.length, maxSuperKeys);
    if (superkeys.length < maxSuperKeys) {
      const aux = superkeys;
      const newID = aux.length;
      aux.push({
        actions: [],
        name: SKname,
        id: newID,
        superkey: "",
      });
      this.updateSuper(aux, newID);
    }
  };

  componentDidUpdate(prevProps, prevState) {
    const { isStandardViewSuperkeys } = this.state;
    if (prevState.isStandardViewSuperkeys !== isStandardViewSuperkeys) {
      store.set("settings.isStandardViewSuperkeys", isStandardViewSuperkeys);
    }
  }

  onKeyChange(keyCode) {
    const { startContext } = this.props;
    const { superkeys, selectedSuper, selectedAction } = this.state;
    const newData = superkeys;
    newData[selectedSuper].actions[selectedAction] = keyCode;
    console.log("keyCode: ", keyCode);
    this.setState({
      superkeys: newData,
      modified: true,
    });
    startContext();
  }

  async loadSuperkeys() {
    const { onDisconnect, setLoading, cancelContext } = this.props;
    setLoading(true);
    const focus = new Focus();
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      const chipID = (await focus.command("hardware.chip_id")).replace(/\s/g, "");
      const neurons = store.get("neurons");
      let neuron = {};
      if (neurons.some(n => n.id === chipID)) {
        console.log(neurons.filter(n => n.id === chipID));
        [neuron] = neurons.filter(n => n.id === chipID);
      }
      this.setState({
        neurons,
        neuronID: neurons.findIndex(n => n.id === chipID),
        storedMacros: neuron.macros,
      });
      const deviceLang = { ...focus.device, language: true };
      focus.commands.keymap = new Keymap(deviceLang);
      this.keymapDB = focus.commands.keymap.db;
      let kbtype = "iso";
      try {
        kbtype = focus.device && focus.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      } catch (error) {
        console.error("Focus lost connection to Raise: ", error);
        return false;
      }

      const keymap = await focus.command("keymap");
      console.log(keymap);
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
      let parsedSuper = this.superTranslator(raw2);
      if (!Array.isArray(parsedSuper) || parsedSuper.length === 0) {
        parsedSuper = [
          {
            actions: [],
            name: "Empty Superkey",
            id: 0,
            superkey: "",
          },
        ];
      }
      this.setState({
        modified: false,
        macros: parsedMacros,
        superkeys: parsedSuper,
        selectedSuper: 0,
        keymap,
        kbtype,
      });
      cancelContext();
      setLoading(false);
    } catch (e) {
      console.log("error when loading SuperKeys");
      console.error(e);
      toast.error(e);
      cancelContext();
      setLoading(false);
      onDisconnect();
    }
    return true;
  }

  macroTranslator(raw) {
    const { storedMacros, macros } = this.state;
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
    let localMacros = [];
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
      if (type > 1 && type < 6) {
        kcs = 2;
      } else {
        kcs = 1;
      }
      if (type === 0) {
        kcs = 0;
        localMacros[i] = {};
        localMacros[i].actions = actions;
        localMacros[i].id = i;
        localMacros[i].name = "";
        localMacros[i].macro = "";
        i += 1;
        actions = [];
        iter += 1;
        continue;
      }
      iter += 1;
    }
    actions.push({
      type,
      keyCode,
    });
    localMacros[i] = {};
    localMacros[i].actions = actions;
    localMacros[i].id = i;
    localMacros[i].name = "";
    localMacros[i].macro = "";
    localMacros = localMacros.map(macro => {
      const aux = macro.actions.map(action => {
        let act = 0;
        if (action.keyCode.length > 1) {
          act = (action.keyCode[0] << 8) + action.keyCode[1];
        } else {
          [act] = action.keyCode;
        }
        return {
          type: action.type,
          keyCode: act,
        };
      });
      return { ...macro, actions: aux };
    });
    // TODO: Check if stored macros match the received ones, if they match, retrieve name and apply it to current macros
    const equal = [];
    let finalMacros = [];
    const stored = storedMacros;
    console.log(localMacros, stored);
    if (stored === undefined) {
      return localMacros;
    }
    finalMacros = localMacros.map((macro, idx) => {
      if (stored.length > idx && stored.length > 0) {
        console.log("compare between: ", macro.actions, stored[idx].actions);
        const aux = macro;
        aux.name = stored[idx].name;
        aux.macro = macro.actions.map(k => this.keymapDB.parse(k.keyCode).label).join(" ");
        return aux;
      }
      return macro;
    });
    this.setState({ equalMacros: equal });
    console.log("Checking differences", macros, finalMacros);
    return finalMacros;
  }

  superTranslator(raw) {
    const { neurons, neuronID } = this.state;
    let superkey = [];
    const superkeys = [];
    let iter = 0;
    let superindex = 0;

    if (raw === "") {
      return [{ actions: [53, 2101, 1077, 41, 0], name: "Welcome to superkeys", id: superindex }];
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
      superkeys[0].actions === [0] ||
      superkeys[0].actions.filter(v => v === 0).length === superkeys[0].length - 1
    )
      return [];
    // TODO: Check if stored superKeys match the received ones, if they match, retrieve name and apply it to current superKeys
    let finalSuper = [];
    const stored = neurons[neuronID].superkeys;
    finalSuper = superkeys.map((superky, i) => {
      const superk = superky;
      superk.id = i;
      if (stored.length > i && stored.length > 0) {
        const aux = superk;
        aux.name = stored[i].name;
        return aux;
      }
      return superk;
    });
    console.log("final superkeys", finalSuper);
    return finalSuper;
  }

  superkeyMap(superkeys) {
    if (
      superkeys.length === 0 ||
      (superkeys.length === 1 && superkeys[0].actions.length === 0) ||
      (superkeys.length === 1 && superkeys[0].actions.length === 1 && superkeys[0].actions[0] === 0)
    ) {
      return Array.from({ length: 512 }, 65535).join(" ");
    }
    let keyMap = JSON.parse(JSON.stringify(superkeys));
    console.log("First", JSON.parse(JSON.stringify(keyMap)));
    keyMap = keyMap.map(sky => {
      const sk = sky;
      sk.actions = sk.actions.map(act => {
        if (act === 0 || act === null || act === undefined) return 1;
        return act;
      });
      if (sk.actions.length < 5) sk.actions = sk.actions.concat(Array(5 - sk.actions.length).fill("1"));
      return sk;
    });
    console.log("Third", JSON.parse(JSON.stringify(keyMap)));
    keyMap = keyMap.map(superkey => superkey.actions.filter(act => act !== 0).concat([0]));
    console.log("Fifth", JSON.parse(JSON.stringify(keyMap)));
    const mapped = [].concat.apply([], keyMap.flat()).concat([0]).join(" ").replaceAll(",", " ");
    console.log(mapped, keyMap);
    return mapped;
  }

  macrosMap(macros) {
    if (macros.length === 0 || (macros.length === 1 && macros[0].actions === [])) {
      return "255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255 255";
    }
    const actionMap = macros.map(macro =>
      macro.actions
        .map(action => {
          if (action.type > 1 && action.type < 6) {
            return [[action.type], [action.keyCode >> 8], [action.keyCode & 255]];
          }
          return [[action.type], [action.keyCode]];
        })
        .concat([0]),
    );
    const mapped = [].concat.apply([], actionMap.flat()).concat([0]).join(" ").replaceAll(",", " ");
    console.log(mapped);
    return mapped;
  }

  changeSelected(id) {
    this.setState({
      selectedSuper: id < 0 ? 0 : id,
      selectedAction: -1,
    });
  }

  changeAction(id) {
    const { isStandardViewSuperkeys, selectedAction } = this.state;
    if (isStandardViewSuperkeys) {
      this.setState({
        selectedAction: id < 0 ? 0 : id,
        showStandardView: true,
      });
    } else {
      if (id === selectedAction) {
        // Some action is already selected
        this.setState({
          selectedAction: -1,
        });
        return;
      }
      this.setState({
        selectedAction: id < 0 ? 0 : id,
        showStandardView: false,
      });
    }
  }

  updateSuper(newSuper, newID) {
    const { startContext } = this.props;
    // console.log("launched update super using data:", newSuper, newID);

    this.setState({
      superkeys: newSuper,
      selectedSuper: newID,
      modified: true,
    });
    startContext();
  }

  updateAction(actionNumber, newAction) {
    const { startContext } = this.props;
    const { superkeys, selectedSuper } = this.state;
    // console.log("launched update action using data:", newAction);
    const newData = superkeys;
    newData[selectedSuper].actions[actionNumber] = newAction;
    this.setState({
      superkeys: newData,
      selectedAction: actionNumber,
      modified: true,
    });
    startContext();
  }

  saveName(name) {
    const { startContext } = this.props;
    const { superkeys, selectedSuper } = this.state;
    superkeys[selectedSuper].name = name;
    this.setState({ superkeys, modified: true });
    startContext();
  }

  async writeSuper() {
    const { superkeys, modifiedKeymap, keymap, neurons, neuronID } = this.state;
    const { setLoading, cancelContext } = this.props;
    setLoading(true);
    const focus = new Focus();
    const localNeurons = JSON.parse(JSON.stringify(neurons));
    localNeurons[neuronID].superkeys = superkeys;
    console.log(JSON.stringify(localNeurons));
    store.set("neurons", localNeurons);
    try {
      await focus.command("superkeys.map", this.superkeyMap(superkeys));
      if (modifiedKeymap) {
        await focus.command("keymap", keymap);
      }
      console.log("Changes saved.");
      const commands = await this.bkp.Commands();
      const backup = await this.bkp.DoBackup(commands, neurons[neuronID].id);
      this.bkp.SaveBackup(backup);
      toast.success(<ToastMessage title={i18n.editor.superkeys.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
      this.setState({
        modified: false,
        modifiedKeymap: false,
      });
      cancelContext();
      setLoading(false);
    } catch (error) {
      toast.error(error);
      cancelContext();
      setLoading(false);
    }
  }

  checkKBSuperkeys(newSuper, newID, SKC) {
    const { keymap, selected, superkeys } = this.state;
    if (newSuper.length === 0) {
      newSuper = [{ actions: [53, 2101, 1077, 41, 0], name: "Welcome to superkeys", id: 0 }];
      newID = 0;
    }
    const LOK = keymap.custom
      .map((l, c) =>
        l
          .map((k, i) => {
            if (k.keyCode === SKC) return { layer: c, pos: i, sk: SKC };
          })
          .filter(x => x !== undefined),
      )
      .flat();
    if (LOK.length > 0) {
      this.setState({
        showDeleteModal: true,
        listToDelete: LOK,
        futureSK: newSuper,
        futureSSK: newID,
      });
    } else if (selected !== superkeys.length - 1) {
      this.SortSK(newSuper, newID);
    } else {
      this.updateSuper(newSuper, newID);
    }
  }

  toggleDeleteModal() {
    this.setState({
      showDeleteModal: false,
      listToDelete: [],
      futureSK: [],
      futureSSK: 0,
    });
  }

  RemoveDeletedSK() {
    const { startContext } = this.props;
    const { keymap, selectedSuper, superkeys, listToDelete, futureSK, futureSSK } = this.state;
    let listToDecrease = [];
    for (const key of superkeys.slice(selectedSuper + 1)) {
      listToDecrease.push(
        keymap.custom
          .map((l, c) =>
            l
              .map((k, i) => {
                if (k.keyCode === key.id + 53980) return { layer: c, pos: i, sk: key.id + 53980 };
              })
              .filter(x => x !== undefined),
          )
          .flat(),
      );
    }
    for (let i = 0; i < listToDelete.length; i += 1) {
      keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = this.keymapDB.parse(0);
    }
    console.log("now decreasing... ", listToDecrease.flat());
    listToDecrease = listToDecrease.flat();
    for (let i = 0; i < listToDecrease.length; i += 1) {
      keymap.custom[listToDecrease[i].layer][listToDecrease[i].pos] = this.keymapDB.parse(listToDecrease[i].sk - 1);
    }
    this.setState({
      keymap,
      superkeys: futureSK,
      selectedSuper: futureSSK,
      modified: true,
      modifiedKeymap: true,
    });
    startContext();
    this.toggleDeleteModal();
  }

  SortSK(newSuper, newID) {
    const { startContext } = this.props;
    const { keymap, selectedSuper, superkeys } = this.state;
    let listToDecrease = [];
    for (const key of superkeys.slice(selectedSuper + 1)) {
      listToDecrease.push(
        keymap.custom
          .map((l, c) =>
            l
              .map((k, i) => {
                if (k.keyCode === key.id + 53980) return { layer: c, pos: i, sk: key.id + 53980 };
              })
              .filter(x => x !== undefined),
          )
          .flat(),
      );
    }
    console.log("now decreasing... ", listToDecrease.flat());
    listToDecrease = listToDecrease.flat();
    for (let i = 0; i < listToDecrease.length; i += 1) {
      keymap.custom[listToDecrease[i].layer][listToDecrease[i].pos] = this.keymapDB.parse(listToDecrease[i].sk - 1);
    }
    this.setState({
      keymap,
      superkeys: newSuper,
      selectedSuper: newID,
      modified: true,
      modifiedKeymap: true,
    });
    startContext();
    this.toggleDeleteModal();
  }

  // Manage Standard/Single view
  async configStandarView() {
    try {
      const preferencesStandardView = JSON.parse(store.get("settings.isStandardViewSuperkeys"));
      // const preferencesStandardView = false;
      // console.log("Preferences StandardView", preferencesStandardViewJSON);
      if (preferencesStandardView !== null) {
        this.setState({ isStandardViewSuperkeys: preferencesStandardView });
      } else {
        this.setState({ isStandardViewSuperkeys: true });
      }
    } catch (e) {
      console.log("error to set isStandardView");
    }
  }

  render() {
    const {
      currentLanguageLayout,
      kbtype,
      selectedSuper,
      superkeys,
      macros,
      selectedAction,
      isStandardViewSuperkeys,
      listToDelete,
      modified,
      showStandardView,
      showDeleteModal,
    } = this.state;

    let code = 0;
    const tempkey = this.keymapDB.parse(
      superkeys[selectedSuper] !== undefined ? superkeys[selectedSuper].actions[selectedAction] : 0,
    );
    code = this.keymapDB.keySegmentator(tempkey.keyCode);
    // console.log(selectedSuper, JSON.stringify(code), JSON.stringify(superkeys));
    const actions = superkeys.length > 0 && superkeys.length > selectedSuper ? superkeys[selectedSuper].actions : [];
    const superName = superkeys.length > 0 && superkeys.length > selectedSuper ? superkeys[selectedSuper].name : "";

    const listOfSKK = listToDelete.map(({ layer, pos, sk }, id) => (
      <Row key={id}>
        <Col xs={12} className="px-0 text-center gridded">
          <p className="titles alignvert">{`Key in layer ${layer + 1} and pos ${pos}`}</p>
        </Col>
      </Row>
    ));
    if (superkeys.length === 0 || !Array.isArray(superkeys)) return <LogoLoaderCentered />;
    return (
      <Styles className="superkeys">
        <Container fluid className={`${isStandardViewSuperkeys ? "standarViewMode" : "singleViewMode"}`}>
          <PageHeader
            text={i18n.app.menu.superkeys}
            showSaving
            contentSelector={
              <SuperkeysSelector
                itemList={superkeys}
                selectedItem={selectedSuper}
                subtitle="Superkeys"
                onSelect={this.changeSelected}
                addItem={this.addSuperkey}
                deleteItem={this.deleteSuperkey}
                updateItem={this.saveName}
                cloneItem={this.duplicateSuperkey}
              />
            }
            saveContext={this.writeSuper}
            destroyContext={this.loadSuperkeys}
            inContext={modified}
          />

          <Callout
            content={i18n.editor.superkeys.callout}
            className="mt-md"
            size="sm"
            hasVideo
            media="6Az05_Yl6AU"
            videoTitle="The Greatest Keyboard Feature Of All Time: SUPERKEYS! 🦹‍♀️"
            videoDuration="5:34"
          />

          <SuperkeyActions
            isStandardViewSuperkeys={isStandardViewSuperkeys}
            superkeys={superkeys}
            selected={selectedSuper}
            selectedAction={selectedAction}
            macros={macros}
            changeSelected={this.changeSelected}
            updateSuper={this.updateSuper}
            updateAction={this.updateAction}
            changeAction={this.changeAction}
            keymapDB={this.keymapDB}
          />

          {isStandardViewSuperkeys && <SuperKeysFeatures />}
        </Container>
        {!isStandardViewSuperkeys ? (
          <Container fluid className="keyboardcontainer" hidden={selectedAction < 0}>
            <KeyPickerKeyboard
              key={JSON.stringify(superkeys) + selectedAction}
              onKeySelect={this.onKeyChange}
              code={code}
              macros={macros}
              superkeys={superkeys}
              actions={actions}
              action={selectedAction}
              actTab="super"
              superName={superName}
              selectedlanguage={currentLanguageLayout}
              kbtype={kbtype}
            />
          </Container>
        ) : (
          ""
        )}
        <LayoutViewSelector
          onToggle={this.onToggle}
          isStandardView={isStandardViewSuperkeys}
          tooltip={i18n.editor.superkeys.tooltip}
        />
        {isStandardViewSuperkeys ? (
          <StandardView
            showStandardView={showStandardView}
            closeStandardView={this.closeStandardViewModal}
            handleSave={this.handleSaveStandardView}
            onKeySelect={this.onKeyChange}
            macros={macros}
            superkeys={superkeys}
            actions={selectedAction > -1 ? superkeys[selectedSuper].actions : []}
            action={selectedAction > -1 ? superkeys[selectedSuper].actions[selectedAction] : 0}
            superName={superName}
            keyIndex={selectedAction}
            code={code}
            layerData={selectedAction > -1 ? superkeys[selectedSuper].actions : []}
            actTab="super"
            selectedlanguage={currentLanguageLayout}
            kbtype={kbtype}
            isStandardView={isStandardViewSuperkeys}
          />
        ) : (
          ""
        )}

        <Modal
          show={showDeleteModal}
          onHide={this.toggleDeleteModal}
          size="lg"
          aria-labelledby="contained-modal-title-vcenter"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>{i18n.editor.superkeys.deleteModal.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{i18n.editor.superkeys.deleteModal.body}</p>
            {listOfSKK}
          </Modal.Body>
          <Modal.Footer>
            <RegularButton
              buttonText={i18n.editor.superkeys.deleteModal.cancelButton}
              styles="outline transp-bg"
              size="sm"
              onClick={this.toggleDeleteModal}
            />
            <RegularButton
              buttonText={i18n.editor.superkeys.deleteModal.applyButton}
              styles="outline gradient"
              size="sm"
              onClick={this.RemoveDeletedSK}
            />
          </Modal.Footer>
        </Modal>
      </Styles>
    );
  }
}

export default SuperkeysEditor;

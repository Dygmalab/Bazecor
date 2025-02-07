/* eslint-disable no-bitwise */
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2022  DygmaLab SE
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

import React, { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Styled from "styled-components";
import log from "electron-log/renderer";

// Styling and elements
import Heading from "@Renderer/components/atoms/Heading";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@Renderer/components/atoms/Dialog";

// Components
import Callout from "@Renderer/components/molecules/Callout/Callout";
import SuperkeysSelector from "@Renderer/components/organisms/Select/SuperkeysSelector";
import { Button } from "@Renderer/components/atoms/Button";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import { IconFloppyDisk } from "@Renderer/components/atoms/icons";

// Modules
import { PageHeader } from "@Renderer/modules/PageHeader";
import { SuperKeysFeatures, SuperkeyActions } from "@Renderer/modules/Superkeys";
import { KeyPickerKeyboard } from "@Renderer/modules/KeyPickerKeyboard";

// Types
import { SuperkeysEditorInitialStateType, SuperkeysEditorProps } from "@Renderer/types/superkeyseditor";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { Neuron } from "@Renderer/types/neurons";
import { KeymapType } from "@Renderer/types/layout";

// API's
import { useDevice } from "@Renderer/DeviceContext";
import { i18n } from "@Renderer/i18n";
import Store from "@Renderer/utils/Store";
import getLanguage from "@Renderer/utils/language";
import Keymap, { KeymapDB } from "../../api/keymap";
import Backup from "../../api/backup";
import { parseMacrosRaw, parseSuperkeysRaw, serializeKeymap, serializeSuperkeys } from "../../api/parsers";

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

function SuperkeysEditor(props: SuperkeysEditorProps) {
  let keymapDB = new KeymapDB();
  const bkp = new Backup();
  const [isSaving, setIsSaving] = useState(false);
  const [mouseWheel, setMouseWheel] = useState(0);

  const initialState: SuperkeysEditorInitialStateType = {
    keymap: undefined,
    macros: [],
    superkeys: [],
    storedMacros: [],
    storedSuper: [],
    neurons: [],
    neuronID: "",
    kbtype: "iso",
    maxSuperKeys: 128,
    modified: false,
    modifiedKeymap: false,
    selectedSuper: 0,
    selectedAction: -1,
    showDeleteModal: false,
    listToDelete: [],
    futureSK: [],
    futureSSK: 0,
    currentLanguageLayout: getLanguage(store.get("settings.language") as string),
    showStandardView: false,
    loading: true,
  };
  const [state, setState] = useState(initialState);
  const { state: deviceState } = useDevice();

  const onKeyChange = (keyCode: number) => {
    const { superkeys, selectedSuper, selectedAction } = state;
    const { startContext } = props;
    const newData = superkeys;
    newData[selectedSuper].actions[selectedAction] = keyCode;
    log.info("keyCode: ", keyCode);
    state.superkeys = newData;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const loadSuperkeys = async () => {
    const { currentDevice } = deviceState;
    const { onDisconnect, setLoading, cancelContext } = props;
    try {
      /**
       * Create property language to the object 'options', to call KeymapDB in Keymap and modify languagu layout
       */
      let chipID = await currentDevice.command("hardware.chip_id");
      chipID = chipID.replace(/\s/g, "");
      const neurons = store.get("neurons") as Neuron[];
      let neuron: Neuron;
      if (neurons.some(n => n.id === chipID)) {
        log.info(neurons.filter(n => n.id === chipID));
        [neuron] = neurons.filter(n => n.id === chipID);
      }
      state.neurons = neurons;
      state.neuronID = chipID;
      state.storedMacros = neuron.macros;
      state.storedSuper = neuron.superkeys;
      setState({ ...state });
      const deviceLang = { ...currentDevice.device, language: true };
      currentDevice.commands.keymap = new Keymap(deviceLang);
      keymapDB = (currentDevice.commands.keymap as Keymap).db;
      let kbtype = "iso";
      try {
        kbtype = currentDevice.device && currentDevice.device.info.keyboardType === "ISO" ? "iso" : "ansi";
      } catch (error) {
        return false;
      }
      // Keymap
      const defaults = await currentDevice.command("keymap.default");
      const custom = await currentDevice.command("keymap.custom");
      const onlyCustom = Boolean(parseInt(await currentDevice.command("keymap.onlyCustom"), 10));
      const keymap: KeymapType = { custom: undefined, default: undefined, onlyCustom: false };
      const layerSize = currentDevice.device.keyboard.rows * currentDevice.device.keyboard.columns;
      keymap.custom = custom
        .split(" ")
        .filter(v => v.length > 0)
        .map(k => keymapDB.parse(parseInt(k, 10)))
        .reduce((resultArray, item, index) => {
          const chunkIndex = Math.floor(index / layerSize);

          if (!resultArray[chunkIndex]) {
            // eslint-disable-next-line no-param-reassign
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
            // eslint-disable-next-line no-param-reassign
            resultArray[chunkIndex] = []; // start a new chunk
          }
          resultArray[chunkIndex].push(item);
          return resultArray;
        }, []);
      keymap.onlyCustom = onlyCustom;
      // Macros
      const macrosRaw = await currentDevice.command("macros.map");
      const parsedMacros = parseMacrosRaw(macrosRaw, state.storedMacros);
      const supersRaw = await currentDevice.command("superkeys.map");
      const parsedSuper = parseSuperkeysRaw(supersRaw, state.storedSuper);
      state.modified = false;
      state.macros = parsedMacros;
      state.superkeys = parsedSuper;
      state.selectedSuper = 0;
      state.keymap = keymap;
      state.kbtype = kbtype;
      setState({ ...state });
      cancelContext();
      setLoading(false);
    } catch (e) {
      log.info("error when loading SuperKeys");
      log.error(e);
      toast.error(e);
      cancelContext();
      setLoading(false);
      onDisconnect();
    }
    return true;
  };

  const changeSelected = (id: number) => {
    state.selectedSuper = id < 0 ? 0 : id;
    state.selectedAction = -1;
    setState({ ...state });
  };

  const changeAction = (id: number) => {
    const { selectedAction } = state;

    if (id === selectedAction) {
      // Some action is already selected
      state.selectedAction = -1;
      setState({ ...state });
      return;
    }
    state.selectedAction = id < 0 ? 0 : id;
    state.showStandardView = false;
    setState({ ...state });
  };

  const updateSuper = (newSuper: SuperkeysType[], newID: number) => {
    const { startContext } = props;
    // log.info("launched update super using data:", newSuper, newID);
    state.superkeys = newSuper;
    state.selectedSuper = newID;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const updateAction = (actionNumber: number, newAction: number) => {
    const { startContext } = props;
    const { superkeys, selectedSuper } = state;
    // log.info("launched update action using data:", newAction);
    const newData = superkeys;
    newData[selectedSuper].actions[actionNumber] = newAction;
    state.superkeys = newData;
    state.selectedAction = actionNumber;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const saveName = (name: string) => {
    const { startContext } = props;
    const { superkeys, selectedSuper } = state;
    superkeys[selectedSuper].name = name;
    state.superkeys = superkeys;
    state.modified = true;
    setState({ ...state });
    startContext();
  };

  const writeSuper = async () => {
    const { setLoading, cancelContext } = props;
    const { superkeys, modifiedKeymap, keymap, neurons, neuronID } = state;
    setIsSaving(true);
    const { currentDevice } = deviceState;
    const localNeurons = [...neurons];
    const nIdx = localNeurons.findIndex(n => n.id === neuronID);
    localNeurons[nIdx].superkeys = superkeys;
    log.info("Loaded neurons: ", JSON.stringify(localNeurons));
    try {
      store.set("neurons", localNeurons);
      const sendSK = serializeSuperkeys(superkeys);
      log.info("Mod superK", sendSK);
      await currentDevice.command("superkeys.map", sendSK);
      if (modifiedKeymap) {
        await currentDevice.command("keymap.custom", serializeKeymap(keymap.custom));
      }
      state.modified = false;
      state.modifiedKeymap = false;
      setState({ ...state });
      log.info("Changes saved.");
      const commands = await Backup.Commands(currentDevice);
      const backup = await bkp.DoBackup(commands, neurons[nIdx].id, currentDevice);
      Backup.SaveBackup(backup, currentDevice);
      toast.success(<ToastMessage title={i18n.editor.superkeys.successFlashTitle} content="" icon={<IconFloppyDisk />} />, {
        autoClose: 2000,
        icon: "",
      });
      cancelContext();
      setLoading(false);
    } catch (error) {
      toast.error(error);
      cancelContext();
      setLoading(false);
    }
    setIsSaving(false);
  };

  const toggleDeleteModal = () => {
    state.showDeleteModal = false;
    state.listToDelete = [];
    state.futureSK = [];
    state.futureSSK = 0;
    setState({ ...state });
  };

  const SortSK = (newSuper: SuperkeysType[], newID: number) => {
    const { startContext } = props;
    const { keymap, selectedSuper, superkeys } = state;
    let listToDecrease = [];
    for (const key of superkeys.slice(selectedSuper + 1)) {
      listToDecrease.push(
        keymap.custom
          .map((l, c) =>
            l
              .map((k, i) => {
                if (k.keyCode === key.id + 53980) return { layer: c, pos: i, sk: key.id + 53980 };
                return undefined;
              })
              .filter(x => x !== undefined),
          )
          .flat(),
      );
    }
    log.info("now decreasing... ", listToDecrease.flat());
    listToDecrease = listToDecrease.flat();
    for (let i = 0; i < listToDecrease.length; i += 1) {
      keymap.custom[listToDecrease[i].layer][listToDecrease[i].pos] = keymapDB.parse(listToDecrease[i].sk - 1);
    }
    state.keymap = keymap;
    state.superkeys = newSuper;
    state.selectedSuper = newID;
    state.modified = true;
    state.modifiedKeymap = true;
    setState({ ...state });
    startContext();
    toggleDeleteModal();
  };

  const checkKBSuperkeys = (newSuper: SuperkeysType[], newID: number, SKC: number) => {
    const { keymap, selectedSuper, superkeys } = state;
    let localNewSuper = newSuper;
    let localNewID = newID;
    if (localNewSuper.length === 0) {
      localNewSuper = [{ actions: [53, 2101, 1077, 41, 0], name: "Welcome to superkeys", id: 0 }];
      localNewID = 0;
    }
    const LOK = keymap.custom
      .map((l, c) =>
        l
          .map((k, i) => {
            if (k.keyCode === SKC) return { layer: c, pos: i, superIdx: SKC, newKey: 0 };
            return undefined;
          })
          .filter(x => x !== undefined),
      )
      .flat();
    if (LOK.length > 0) {
      state.showDeleteModal = true;
      state.listToDelete = LOK;
      state.futureSK = localNewSuper;
      state.futureSSK = localNewID;
      setState({ ...state });
    } else if (selectedSuper !== superkeys.length - 1) {
      SortSK(localNewSuper, localNewID);
    } else {
      updateSuper(localNewSuper, localNewID);
    }
  };

  const RemoveDeletedSK = () => {
    const { startContext } = props;
    const { keymap, selectedSuper, superkeys, listToDelete, futureSK, futureSSK } = state;
    let listToDecrease = [];
    for (const key of superkeys.slice(selectedSuper + 1)) {
      listToDecrease.push(
        keymap.custom
          .map((l, c) =>
            l
              .map((k, i) => {
                if (k.keyCode === key.id + 53980) return { layer: c, pos: i, superIdx: key.id + 53980 };
                return undefined;
              })
              .filter(x => x !== undefined),
          )
          .flat(),
      );
    }
    for (let i = 0; i < listToDelete.length; i += 1) {
      keymap.custom[listToDelete[i].layer][listToDelete[i].pos] = keymapDB.parse(0);
    }
    listToDecrease = listToDecrease.flat();
    log.info("now decreasing... ", listToDecrease);
    for (let i = 0; i < listToDecrease.length; i += 1) {
      keymap.custom[listToDecrease[i].layer][listToDecrease[i].pos] = keymapDB.parse(listToDecrease[i].superIdx - 1);
    }
    state.keymap = keymap;
    state.superkeys = futureSK;
    state.selectedSuper = futureSSK;
    state.modified = true;
    state.modifiedKeymap = true;
    setState({ ...state });
    startContext();
    toggleDeleteModal();
  };

  const deleteSuperkey = () => {
    const { superkeys, selectedSuper } = state;
    if (!Array.isArray(superkeys) || superkeys.length <= 0 || selectedSuper < 0) {
      return;
    }
    let aux = JSON.parse(JSON.stringify(superkeys));
    const selected = selectedSuper;
    aux.splice(selected, 1);
    aux = aux.map((item: SuperkeysType, index: number) => {
      const newItem = item;
      newItem.id = index;
      return newItem;
    });
    if (selected >= superkeys.length - 1) {
      checkKBSuperkeys(aux, aux.length - 1, aux.length + 53980);
    } else {
      checkKBSuperkeys(aux, selected, selected + 53980);
    }
  };

  const duplicateSuperkey = () => {
    const { superkeys, selectedSuper } = state;
    const aux = { ...superkeys[selectedSuper] };
    aux.id = superkeys.length;
    aux.name = `Copy of ${aux.name}`;
    aux.actions = [...aux.actions];
    superkeys.push(aux);
    updateSuper(superkeys, -1);
    changeSelected(aux.id);
  };

  const addSuperkey = (SKname: string) => {
    const { superkeys, maxSuperKeys } = state;
    // log.info("TEST", superkeys.length, maxSuperKeys);
    if (superkeys.length < maxSuperKeys) {
      const aux: SuperkeysType[] = JSON.parse(JSON.stringify(superkeys));
      const newID = aux.length;
      aux.push({
        actions: [0, 0, 0, 0, 0],
        name: SKname,
        id: newID,
        superkey: "",
      });
      updateSuper(aux, newID);
    }
  };

  const resetScroll = () => {
    setMouseWheel(0);
  };

  const updateScroll = useCallback((e: WheelEvent) => {
    // log.info("Scroll WHEEL event!", e);
    const direction = e.deltaY > 0 ? 1 : -1;
    if (!(e.target as HTMLElement).outerHTML.includes('<div role="option"')) setMouseWheel(direction);
  }, []);

  useEffect(() => {
    window.addEventListener("mousewheel", updateScroll);

    const getInitialData = async () => {
      const { setLoading } = props;
      log.info("initial load of superkeys", setLoading);
      await loadSuperkeys();
      setState({ ...state, loading: false });
      setLoading(false);
    };
    getInitialData();

    return () => {
      window.removeEventListener("mousewheel", updateScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const destroyThisContext = async () => {
    const { setLoading } = props;
    setState({ ...state, loading: true });
    await loadSuperkeys();
    setState({ ...state, loading: false });
    setLoading(false);
  };

  const { saveButtonRef, discardChangesButtonRef } = props;

  const {
    currentLanguageLayout,
    selectedSuper,
    superkeys,
    macros,
    selectedAction,
    listToDelete,
    modified,
    showDeleteModal,
    loading,
  } = state;

  const tempKC = superkeys[selectedSuper] !== undefined ? superkeys[selectedSuper].actions[selectedAction] : -1;
  const tempkey = tempKC === -1 ? keymapDB.parse(0) : keymapDB.parse(tempKC);
  const code = keymapDB.keySegmentor(tempkey.keyCode);

  const listOfSKK = listToDelete.map(({ layer, pos, superIdx }) => (
    <li key={`${layer}-${pos}-${superIdx}`} className="titles alignvert">{`Key in layer ${layer + 1} and pos ${pos}`}</li>
  ));
  // if (loading || !Array.isArray(superkeys)) return <LogoLoaderCentered />;
  if (loading || !Array.isArray(superkeys)) return <LogoLoader centered />;
  return (
    <Styles className="superkeys px-3">
      <div className="singleViewMode">
        <PageHeader
          text="Superkeys Editor"
          showSaving
          contentSelector={
            <SuperkeysSelector
              itemList={superkeys}
              selectedItem={selectedSuper}
              subtitle="Superkeys"
              onSelect={changeSelected}
              addItem={addSuperkey}
              deleteItem={deleteSuperkey}
              updateItem={saveName}
              cloneItem={duplicateSuperkey}
            />
          }
          saveContext={writeSuper}
          destroyContext={destroyThisContext}
          inContext={modified}
          isSaving={isSaving}
          saveButtonRef={saveButtonRef}
          discardChangesButtonRef={discardChangesButtonRef}
        />

        <Callout
          size="sm"
          className="mt-4"
          hasVideo
          media="6Az05_Yl6AU"
          videoTitle="The Greatest Keyboard Feature Of All Time: SUPERKEYS! 🦹‍♀️"
          videoDuration="5:34"
        >
          <p>{i18n.editor.superkeys.callout1}</p>
          <p>{i18n.editor.superkeys.callout2}</p>
        </Callout>

        <SuperkeyActions
          superkeys={superkeys}
          selected={selectedSuper}
          selectedAction={selectedAction}
          macros={macros}
          changeSelected={changeSelected}
          updateSuper={updateSuper}
          updateAction={updateAction}
          changeAction={changeAction}
          keymapDB={keymapDB}
        />
      </div>

      <div className="keyboardcontainer" hidden={selectedAction < 0}>
        <KeyPickerKeyboard
          onKeySelect={onKeyChange}
          code={code}
          macros={macros}
          superkeys={superkeys}
          actTab="super"
          selectedlanguage={currentLanguageLayout}
          keyIndex={tempKC}
          isWireless={false}
          mouseWheel={mouseWheel}
          resetScroll={resetScroll}
        />
      </div>
      <SuperKeysFeatures />

      <Dialog open={showDeleteModal} onOpenChange={toggleDeleteModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{i18n.editor.superkeys.deleteModal.title}</DialogTitle>
          </DialogHeader>
          <div className="px-6 pb-2 mt-2">
            {listOfSKK && (
              <>
                <Heading headingLevel={4} renderAs="h4">
                  The superkey you want to delete is currently in use on:
                </Heading>
                <div className="mt-1 mb-4">
                  <ul className="mb-[4px] text-ssm list-disc pl-[24px] text-gray-500 dark:text-gray-100">{listOfSKK}</ul>
                </div>
              </>
            )}
            <p className="text-sm text-gray-500 dark:text-gray-25">
              By pressing <strong>Remove</strong> you will replace those superkeys with <strong>NO KEY</strong> on the keyboard
              layout.
            </p>
          </div>
          <DialogFooter>
            <Button size="sm" variant="outline" onClick={toggleDeleteModal}>
              {i18n.editor.superkeys.deleteModal.cancelButton}
            </Button>
            <Button size="sm" variant="secondary" onClick={RemoveDeletedSK}>
              {i18n.editor.superkeys.deleteModal.applyButton}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Styles>
  );
}

export default SuperkeysEditor;

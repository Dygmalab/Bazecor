// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2026  DygmaLab SE.
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

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Styled from "styled-components";

import { keyboardCanvasStyles } from "@Renderer/modules/KeyboardCanvas/keyboardCanvasStyles";
import log from "electron-log/renderer";
import { toast } from "react-toastify";

import { i18n } from "@Renderer/i18n";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import { IconClose, IconDelete, IconPlus } from "@Renderer/components/atoms/icons";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { KeyPickerKeyboard } from "@Renderer/modules/KeyPickerKeyboard";
import SuperkeysSelector from "@Renderer/components/organisms/Select/SuperkeysSelector";
import MacrosMemoryUsage from "@Renderer/modules/Macros/MacrosMemoryUsage";

import { useDevice } from "@Renderer/DeviceContext";
import Store from "@Renderer/utils/Store";
import getLanguage from "@Renderer/utils/language";
import { KeymapType, KeyType, PaletteType, SegmentedKeyType } from "@Renderer/types/layout";
import { Neuron } from "@Renderer/types/neurons";
import { MacrosType } from "@Renderer/types/macros";
import {
  COMBO_FLAG_ENABLED,
  COMBO_POSITION_UNUSED,
  ComboEditorProps,
  ComboType,
  MAX_COMBO_MEMBERS,
  MAX_COMBOS,
  MIN_COMBO_MEMBERS,
} from "@Renderer/types/combos";

import { KeymapDB } from "../../api/keymap";
import Backup from "../../api/backup";
import {
  comboMembers,
  duplicateComboIndex,
  emptyCombo,
  isLegacyCombosReply,
  overlappingComboIndexes,
  parseCombosRaw,
  serializeCombos,
} from "../../api/parsers/combos";
import { parseColormapRaw, parseKeymapRaw, parseMacrosRaw, parsePaletteRaw } from "../../api/parsers";

const store = Store.getStore();
const bkp = new Backup();

/* The very same rules the Layout Editor uses, so the board renders identically
 * in both views. The device SVGs emit bare class names and carry no styling of
 * their own, so without this block the keyboard comes out unstyled. */
const Styles = Styled.div`
  ${keyboardCanvasStyles}

  /* The Layout Editor gives the board the full width of the page; here it
   * shares the view with the slot row above it, so cap it. The min-width reset
   * overrides the shared fragment's 680px floor, which would otherwise force
   * horizontal scrolling on a narrow window. */
  .LayerHolder {
    min-width: 0;
    max-width: 1170px;
  }
`;

/* Fixed identities for the member slots. The slot count is a firmware
 * constant, so these are stable keys rather than array indexes. */
const SLOT_KEYS = ["slot-a", "slot-b", "slot-c", "slot-d", "slot-e", "slot-f"];

/** Which slot of the selected combo the keyboard below is currently feeding. */
type PickTarget = { kind: "member"; slot: number } | { kind: "action" } | null;

function ComboEditor(props: ComboEditorProps) {
  const { darkMode, startContext, cancelContext, setLoading, saveButtonRef, discardChangesButtonRef } = props;
  const { state } = useDevice();

  const [combos, setCombos] = useState<ComboType[]>([]);
  const [selected, setSelected] = useState<number>(0);
  const [pickTarget, setPickTarget] = useState<PickTarget>(null);
  /* How many slots the user has opened from the hover "+", including ones that
   * do not hold a key yet. Slots that hold a key are always shown. */
  const [openSlots, setOpenSlots] = useState(0);
  const [keymap, setKeymap] = useState<KeymapType>({ custom: [], default: [], onlyCustom: true });
  const [palette, setPalette] = useState<PaletteType[]>([]);
  /* One colormap per custom layer, so the board shows the colours of the
   * layer the selected combo lives on. */
  const [colormaps, setColormaps] = useState<number[][]>([]);
  const [layerNames, setLayerNames] = useState<string[]>([]);
  const [macros, setMacros] = useState<MacrosType[]>([]);
  const [isWireless, setIsWireless] = useState(false);
  const [deviceName, setDeviceName] = useState("");
  const [neuronID, setNeuronID] = useState("");
  const [modified, setModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [loadingData, setLoadingData] = useState(true);
  const [supported, setSupported] = useState(true);
  /* The first combos firmware: four keys per combo and combos on every layer.
   * Its blob has a different shape, so it is not edited at all. */
  const [legacyFirmware, setLegacyFirmware] = useState(false);

  const keymapDB = useMemo(() => new KeymapDB(), []);
  const currentLanguageLayout = getLanguage(store.get("settings.language") as string) || "en-US";

  /* ---------------------------------------------------------------------- */
  /* Load                                                                    */
  /* ---------------------------------------------------------------------- */

  const loadCombos = useCallback(async () => {
    const { currentDevice } = state;
    if (!currentDevice) return;

    try {
      setLoadingData(true);

      const raw = (await currentDevice.command("combos.map")) as string;
      log.info("[Combos] combos.map ->", JSON.stringify(raw));

      if (!raw || raw.trim().length === 0) {
        /* The command is unknown to this firmware. Say so rather than showing
         * an editor that silently cannot save. */
        log.warn("[Combos] empty reply: this firmware does not support combos.map");
        setSupported(false);
        setLoadingData(false);
        return;
      }

      if (isLegacyCombosReply(raw)) {
        log.warn("[Combos] combos.map has the 4-key format of an older firmware; not editing it");
        setLegacyFirmware(true);
        setSupported(false);
        setLoadingData(false);
        return;
      }

      setSupported(true);
      setLegacyFirmware(false);
      setDeviceName(currentDevice.device.info.product ?? "");
      setIsWireless(currentDevice.device.info.keyboardType === "wireless" || Boolean(currentDevice.device.wireless));

      /* Names live in the neuron store, keyed by chip id, exactly as superkey
       * names do -- the firmware blob has no room for them. */
      let chipID = (await currentDevice.command("hardware.chip_id")) as string;
      chipID = chipID.replace(/\s/g, "");
      setNeuronID(chipID);

      const neurons = (store.get("neurons") as Neuron[]) ?? [];
      const neuron = neurons.find(n => n.id === chipID);

      setCombos(parseCombosRaw(raw, neuron?.combos ?? []));
      setLayerNames((neuron?.layers ?? []).map(layer => layer?.name ?? ""));

      /* Macros, so the result picker can offer them. Names come from the
       * neuron store, as in the Macro Editor. */
      const macrosRaw = (await currentDevice.command("macros.map")) as string;
      setMacros(macrosRaw ? parseMacrosRaw(macrosRaw, neuron?.macros ?? []) : []);

      const keymapRaw = (await currentDevice.command("keymap.custom")) as string;
      const keymapDefault = (await currentDevice.command("keymap.default")) as string;
      const onlyCustom = Boolean(parseInt((await currentDevice.command("keymap.onlyCustom")) as string, 10));

      /* The board SVG wants parsed keys, not raw codes, so it can render each
       * label. Same shape the Layout Editor builds. */
      const layerSize = currentDevice.device.keyboard.rows * currentDevice.device.keyboard.columns;

      setKeymap({
        custom: parseKeymapRaw(keymapRaw, layerSize).map(l => l.map((k: number) => keymapDB.parse(k))),
        default: parseKeymapRaw(keymapDefault, layerSize).map(l => l.map((k: number) => keymapDB.parse(k))),
        onlyCustom,
      });

      /* Colours, so the board reads exactly as it does in the Layout Editor.
       * The LED count has to be worked out the same way, or parseColormapRaw
       * chunks the blob into the wrong per-layer stride. */
      const keyboardLEDs = currentDevice.device.keyboard.ledsLeft.length + currentDevice.device.keyboard.ledsRight.length;
      const underglow = currentDevice.device.keyboardUnderglow;
      const underglowLEDs =
        (underglow.ledsLeft?.length ?? 0) + (underglow.ledsRight?.length ?? 0) || underglow.rows * underglow.columns;

      const paletteRaw = (await currentDevice.command("palette")) as string;
      const colormapRaw = (await currentDevice.command("colormap.map")) as string;

      const parsedPalette = parsePaletteRaw(paletteRaw, currentDevice.device.RGBWMode);
      const parsedColormap = parseColormapRaw(colormapRaw, keyboardLEDs + underglowLEDs);

      setPalette(parsedPalette);
      setColormaps(parsedColormap);
    } catch (error) {
      log.error("[Combos] failed to load", error);
      setSupported(false);
    } finally {
      setLoadingData(false);
      setLoading(false);
    }
  }, [state, setLoading, keymapDB]);

  useEffect(() => {
    loadCombos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------------------------------------------------------------------- */
  /* Save                                                                    */
  /* ---------------------------------------------------------------------- */

  const onApply = async () => {
    const { currentDevice } = state;
    if (!currentDevice) return;

    try {
      setIsSaving(true);

      const payload = serializeCombos(combos);
      log.info(`[Combos] saving ${combos.length} combo(s)`);
      await currentDevice.command("combos.map", payload);

      /* Names go to the neuron store in the same commit, so a save never
       * leaves the labels describing a different set of combos. */
      const neurons = (store.get("neurons") as Neuron[]) ?? [];
      const index = neurons.findIndex(n => n.id === neuronID);
      if (index >= 0) {
        neurons[index].combos = combos;
        store.set("neurons", neurons);
      }

      /* Same as the other editors: a backup after every save. Lens reads the
       * combos it badges from the newest backup, and is told to reload by it. */
      const commands = await Backup.Commands(currentDevice);
      const backup = await bkp.DoBackup(commands, neuronID, currentDevice);
      Backup.SaveBackup(backup, currentDevice);

      setModified(false);
      cancelContext();
      toast.success(<ToastMessage title="Combos saved" content="Your combos are now on the keyboard." />, { autoClose: 2000 });
    } catch (error) {
      log.error("[Combos] failed to save", error);
      toast.error(<ToastMessage title="Could not save combos" content={String(error)} />, { autoClose: 4000 });
    } finally {
      setIsSaving(false);
    }
  };

  const destroyContext = async () => {
    setModified(false);
    cancelContext();
    await loadCombos();
  };

  /* ---------------------------------------------------------------------- */
  /* Editing                                                                 */
  /* ---------------------------------------------------------------------- */

  /* Combo ids double as list positions, so anything that reorders the list has
   * to renumber it. */
  const renumber = (list: ComboType[]): ComboType[] => list.map((item, index) => ({ ...item, id: index }));

  const commit = (list: ComboType[], nextSelected?: number) => {
    setCombos(list);
    if (nextSelected !== undefined) setSelected(nextSelected);
    setModified(true);
    startContext();
  };

  const updateCombo = (index: number, next: ComboType) => {
    const list = combos.slice();
    list[index] = next;
    commit(list);
  };

  const overLimit = () => {
    if (combos.length < MAX_COMBOS) return false;
    toast.warn(
      <ToastMessage title="No more combos" content={`This keyboard holds ${MAX_COMBOS} combos. Delete one to make room.`} />,
      { autoClose: 3000 },
    );
    return true;
  };

  const addCombo = (name?: string) => {
    if (overLimit()) return;
    /* A new combo starts on the layer the user is looking at. */
    const layer = combos[selected]?.layer ?? 0;
    const list = renumber(combos.concat([emptyCombo(combos.length, name || i18n.editor.combos.newCombo, layer)]));
    commit(list, list.length - 1);
    setPickTarget(null);
  };

  const cloneCombo = () => {
    if (overLimit()) return;
    const source = combos[selected];
    if (!source) return;

    /* Everything is copied, keys included. The usual reason to clone is the
     * same chord on another layer: change the copy's layer and it is done.
     * Until then it duplicates the source, which the editor points out. */
    const copy: ComboType = {
      ...emptyCombo(combos.length, `Copy of ${source.name}`),
      positions: source.positions.slice(),
      layer: source.layer,
      flags: source.flags,
      action: source.action,
    };

    const list = renumber(combos.concat([copy]));
    commit(list, list.length - 1);
    setPickTarget(null);
  };

  const deleteCombo = (index: number) => {
    const list = renumber(combos.filter((_, i) => i !== index));
    commit(list, Math.max(0, Math.min(index, list.length - 1)));
    setPickTarget(null);
  };

  const renameCombo = (name: string) => {
    const combo = combos[selected];
    if (!combo) return;
    updateCombo(selected, { ...combo, name });
  };

  const changeSelected = (id: number) => {
    setSelected(id < 0 ? 0 : id);
    setPickTarget(null);
  };

  /* Opened empty slots belong to the combo being edited, not to the next one. */
  useEffect(() => {
    setOpenSlots(0);
  }, [selected, combos.length]);

  const changeLayer = (layer: number) => {
    const combo = combos[selected];
    if (!combo || combo.layer === layer) return;
    updateCombo(selected, { ...combo, layer });
  };

  const clearSlot = (slot: number) => {
    const combo = combos[selected];
    if (!combo) return;
    const positions = combo.positions.slice();
    positions[slot] = COMBO_POSITION_UNUSED;
    updateCombo(selected, { ...combo, positions });
  };

  /* A key may belong to any number of combos, so nothing is greyed out for
   * being used elsewhere. The firmware resolves overlaps itself: while a longer
   * combo can still complete it waits, so pressing every key of the longer one
   * fires the longer one. The one conflict it cannot resolve is the same keys
   * on the same layer twice -- the first listed always wins -- and that is
   * pointed out below the slots instead of being prevented. */
  const duplicateOf = useMemo(() => duplicateComboIndex(combos, selected), [combos, selected]);
  const overlapsWith = useMemo(() => overlappingComboIndexes(combos, selected), [combos, selected]);

  /* Two slots always, more once opened or filled, up to the firmware's six. A
   * combo read back from the keyboard with a key in a later slot keeps it
   * visible, so nothing the firmware holds is ever hidden from the user. */
  const visibleSlots = useMemo(() => {
    const positions = combos[selected]?.positions ?? [];
    let lastUsed = -1;
    positions.forEach((position, slot) => {
      if (position !== COMBO_POSITION_UNUSED) lastUsed = slot;
    });
    return Math.min(MAX_COMBO_MEMBERS, Math.max(MIN_COMBO_MEMBERS, lastUsed + 1, openSlots));
  }, [combos, selected, openSlots]);

  const addSlot = () => {
    setOpenSlots(visibleSlots + 1);
    setPickTarget({ kind: "member", slot: visibleSlots });
  };

  /* Drops the slot entirely rather than just emptying it, shifting any later
   * keys up so the combo never ends up with a gap. */
  const removeSlot = (slot: number) => {
    const combo = combos[selected];
    if (!combo) return;
    const positions = combo.positions.filter((_, i) => i !== slot).concat([COMBO_POSITION_UNUSED]);
    updateCombo(selected, { ...combo, positions });
    setOpenSlots(Math.max(0, visibleSlots - 1));
    if (pickTarget?.kind === "member" && pickTarget.slot >= slot) setPickTarget(null);
  };

  const onKeyboardKeySelect = (event: React.MouseEvent<Element>) => {
    if (!pickTarget || pickTarget.kind !== "member") return;

    const { currentTarget } = event;
    const keyIndex = parseInt(currentTarget.getAttribute("data-key-index"), 10);
    if (Number.isNaN(keyIndex)) return;

    const combo = combos[selected];
    if (!combo) return;

    const positions = combo.positions.slice();

    /* The same key twice in one combo would never be satisfiable. */
    if (positions.includes(keyIndex)) return;

    positions[pickTarget.slot] = keyIndex;
    updateCombo(selected, { ...combo, positions });

    /* Advance to the next slot instead of clearing the selection: a combo is
     * several keys, and picking them is one continuous gesture. Stops at the
     * last slot rather than wrapping, so a two-key combo does not quietly
     * re-arm the slot the user just filled. */
    const nextSlot = pickTarget.slot + 1;
    setPickTarget(nextSlot < visibleSlots ? { kind: "member", slot: nextSlot } : null);
  };

  const onActionKeySelect = (keyCode: number) => {
    const combo = combos[selected];
    if (!combo) return;
    log.info(`[Combos] combo ${selected} action -> ${keyCode}`);
    updateCombo(selected, { ...combo, action: keyCode, flags: combo.flags || COMBO_FLAG_ENABLED });
  };

  /* ---------------------------------------------------------------------- */
  /* Render helpers                                                          */
  /* ---------------------------------------------------------------------- */

  /* Layers are numbered the way the firmware numbers them, which is also how
   * the Layout Editor does: the default layers first unless only custom
   * layers are in use. Only custom layers are offered, as in the Layout
   * Editor's layer list. */
  const customOffset = keymap.onlyCustom ? 0 : keymap.default.length;

  const layerLabel = useCallback((layer: number) => `${layer + 1}: ${layerNames[layer] || `L${layer + 1}`}`, [layerNames]);

  const layerOptions = useMemo(() => {
    const options = keymap.custom.map((_, index) => index + customOffset);
    /* Never hide what the keyboard holds: a combo stored on a layer that is
     * not in the list still shows its own layer. */
    const current = combos[selected]?.layer;
    if (current !== undefined && !options.includes(current)) options.push(current);
    return options;
  }, [keymap, customOffset, combos, selected]);

  const comboLayer = combos[selected]?.layer ?? customOffset;

  const layerData = useMemo((): KeyType[] => {
    if (keymap.onlyCustom) return keymap.custom[comboLayer] ?? keymap.custom[0] ?? [];
    if (comboLayer < keymap.default.length) return keymap.default[comboLayer] ?? [];
    return keymap.custom[comboLayer - keymap.default.length] ?? keymap.custom[0] ?? keymap.default[0] ?? [];
  }, [keymap, comboLayer]);

  const colormap = colormaps[comboLayer - customOffset] ?? colormaps[0] ?? [];

  const labelForPosition = (position: number): string => {
    if (position === COMBO_POSITION_UNUSED || !layerData[position]) return "";
    return String(layerData[position].label ?? "");
  };

  const actionLabel = (item: ComboType): string => {
    if (!item || !item.action) return "";
    const key = keymapDB.parse(item.action);
    return String(key.label ?? "");
  };

  const combo = combos[selected];
  const memberCount = combo ? comboMembers(combo).length : 0;
  const incomplete = combo && (memberCount < MIN_COMBO_MEMBERS || !combo.action);

  /* Greying is done with CSS keyed on data-key-index, which the shared
   * api/hardware/Key component puts on every key of every board. That keeps
   * this working across all eight device SVGs without touching any of them.
   * Only this combo's own keys are greyed: the same key twice in one combo
   * could never be satisfied. Keys used by other combos stay available. */
  const unavailableStyles = useMemo(() => {
    if (!pickTarget || pickTarget.kind !== "member") return "";
    const own = combos[selected] ? comboMembers(combos[selected]) : [];
    return own
      .map(
        position => `.comboKeyboard [data-key-index="${position}"] { opacity: 0.3; pointer-events: none; filter: grayscale(1); }`,
      )
      .join("\n");
  }, [pickTarget, combos, selected]);

  const KeyboardComponent = state.currentDevice?.device?.components?.keymap as React.FC<any> | undefined;

  if (loadingData) return <LogoLoader centered />;

  if (!supported) {
    return (
      <div className="px-3">
        <PageHeader text="Combo Editor" contentSelector={false} showSaving={false} />
        <Callout size="sm" className="mt-4">
          {legacyFirmware ? (
            <p>
              This keyboard runs an early version of combos, with up to four keys and combos shared by every layer. Update the
              firmware to edit combos with up to six keys, one layer each.
            </p>
          ) : (
            <p>
              This keyboard&apos;s firmware does not support combos yet. Update the firmware to a build that includes the Combos
              plugin and reconnect.
            </p>
          )}
        </Callout>
      </div>
    );
  }

  /* Deliberately NOT carrying the Layout Editor's `keyboard singleViewMode`
   * classes. Those pin the board to `height: 100%`, which only resolves
   * because that view gives its container an explicit height; here the board
   * sits in normal flow and would collapse. `.LayerHolder` plus
   * `.raiseKeyboard` are what centre it and let the SVG fill the width. */
  return (
    <Styles className="comboEditor px-3">
      <style>{unavailableStyles}</style>

      <PageHeader
        text="Combo Editor"
        showSaving
        contentSelector={
          <>
            <SuperkeysSelector
              itemList={combos}
              selectedItem={selected}
              subtitle="Combos"
              itemLabel="combo"
              createTitle={i18n.editor.combos.createModal.createNew}
              renameTitle={i18n.editor.combos.createModal.rename}
              inputLabel={i18n.editor.combos.createModal.inputLabel}
              onSelect={changeSelected}
              addItem={addCombo}
              deleteItem={() => deleteCombo(selected)}
              updateItem={renameCombo}
              cloneItem={cloneCombo}
              checkLimit={overLimit}
            />
            {/* warningOffset defaults to 20, which is sized for the macro buffer;
             * against 32 combo slots that would raise the "out of space"
             * error at 12. */}
            <MacrosMemoryUsage context="combos" mem={combos.length} tMem={MAX_COMBOS} warningOffset={2} />
          </>
        }
        saveContext={onApply}
        destroyContext={destroyContext}
        inContext={modified}
        isSaving={isSaving}
        saveButtonRef={saveButtonRef}
        discardChangesButtonRef={discardChangesButtonRef}
      />

      <Callout size="sm" className="mt-4">
        <p>
          A combo fires a single action when you press several keys at once. Pick the keys on the keyboard below, then choose what
          they should do.
        </p>
        <p>
          Each combo belongs to one layer, so the same keys can do something different on each layer. A key can be part of several
          combos: when every key of a longer combo is pressed, the longer one fires.
        </p>
      </Callout>

      {/* ---------------------------------------------------------------- */}
      {/* [k1] + [k2] + ... = [action]                                      */}
      {/* ---------------------------------------------------------------- */}
      {combo ? (
        <div className="group mt-6 rounded-regular bg-gray-25/50 dark:bg-gray-400/15 p-4">
          {/* Equal side columns keep the slot row centred whatever the Delete
           * button on the right measures. */}
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="justify-self-start">
              <Heading headingLevel={4} renderAs="paragraph-sm" className="mb-1">
                Layer
              </Heading>
              <Select value={String(comboLayer)} onValueChange={value => changeLayer(parseInt(value, 10))}>
                <SelectTrigger className="min-w-40">
                  <SelectValue placeholder="Layer" />
                </SelectTrigger>
                <SelectContent>
                  {layerOptions.map(layer => (
                    <SelectItem value={String(layer)} key={`combo-layer-${layer}`}>
                      {layerLabel(layer)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              {combo.positions.slice(0, visibleSlots).map((position, slot) => (
                <React.Fragment key={SLOT_KEYS[slot]}>
                  {slot > 0 && <span className="text-lg text-gray-400 dark:text-gray-300">+</span>}
                  <span className="relative">
                    <Button
                      variant="config"
                      size="sm"
                      selected={pickTarget?.kind === "member" && pickTarget.slot === slot}
                      className="min-w-20 h-12 text-ssm"
                      onClick={() => setPickTarget({ kind: "member", slot })}
                      onContextMenu={event => {
                        event.preventDefault();
                        clearSlot(slot);
                      }}
                    >
                      {position === COMBO_POSITION_UNUSED ? <IconPlus size="xs" /> : labelForPosition(position)}
                    </Button>
                    {slot >= MIN_COMBO_MEMBERS && (
                      <button
                        type="button"
                        title="Remove this key"
                        aria-label="Remove this key"
                        className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 hover:bg-primary hover:text-white dark:bg-gray-500 dark:text-gray-25 dark:hover:bg-primary transition-colors"
                        onClick={() => removeSlot(slot)}
                      >
                        <IconClose />
                      </button>
                    )}
                    {/* The add button rides on the last slot's corner, out of
                     * the flow, so revealing it never shifts the row. */}
                    {slot === visibleSlots - 1 && visibleSlots < MAX_COMBO_MEMBERS && (
                      <button
                        type="button"
                        title="Add another key"
                        aria-label="Add another key"
                        className="absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-gray-100 text-gray-600 hover:bg-purple-200 hover:text-white dark:bg-gray-500 dark:text-gray-25 dark:hover:bg-purple-200 opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-all"
                        onClick={addSlot}
                      >
                        <IconPlus size="xs" />
                      </button>
                    )}
                  </span>
                </React.Fragment>
              ))}

              <span className="text-lg text-gray-400 dark:text-gray-300">=</span>

              <Button
                variant="config"
                size="sm"
                selected={pickTarget?.kind === "action"}
                className="min-w-24 h-12 text-ssm"
                onClick={() => setPickTarget({ kind: "action" })}
              >
                {combo.action ? actionLabel(combo) : <IconPlus size="xs" />}
              </Button>
            </div>

            <div className="justify-self-end">
              <Button variant="config" size="sm" onClick={() => deleteCombo(selected)}>
                <IconDelete size="sm" /> Delete
              </Button>
            </div>
          </div>

          {duplicateOf >= 0 ? (
            <div className="mt-3 text-center text-ssm font-semibold text-orange-200">
              C{duplicateOf + 1}
              {combos[duplicateOf]?.name ? ` · ${combos[duplicateOf].name}` : ""} uses exactly these keys on this layer. Only the
              one listed first can fire: change the keys or the layer of one of them.
            </div>
          ) : (
            overlapsWith.length > 0 && (
              <div className="mt-3 text-center text-ssm text-gray-400 dark:text-gray-300">
                Shares keys with {overlapsWith.map(index => `C${index + 1}`).join(", ")} on this layer. When all the keys of a
                longer combo are down, the longer one fires.
              </div>
            )
          )}

          <div className="mt-3 text-center text-ssm text-gray-400 dark:text-gray-300">
            {incomplete ? (
              <span>
                A combo needs at least {MIN_COMBO_MEMBERS} keys and a resulting key before it does anything. Right-click a slot to
                clear it.
              </span>
            ) : (
              <span>Right-click a slot to clear it.</span>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-6 text-center text-ssm text-gray-400 dark:text-gray-300">No combos yet. Add one to get started.</div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* The keyboard, in one of its two roles                             */}
      {/* ---------------------------------------------------------------- */}
      <div className="mt-6">
        {pickTarget?.kind === "action" ? (
          <>
            <Heading headingLevel={4} renderAs="paragraph-sm" className="mb-2">
              Choose what the combo types
            </Heading>
            <KeyPickerKeyboard
              onKeySelect={onActionKeySelect}
              code={{ base: combo?.action ?? 0, modified: 0 } as SegmentedKeyType}
              macros={macros}
              superkeys={[]}
              action={0}
              actTab="super"
              selectedlanguage={currentLanguageLayout}
              keyIndex={0}
              isWireless={isWireless}
              mouseWheel={0}
              resetScroll={() => {}}
              allowAutoshift={false}
              fullMouse
            />
          </>
        ) : (
          <>
            <Heading headingLevel={4} renderAs="paragraph-sm" className="mb-2 text-center">
              {pickTarget?.kind === "member"
                ? "Pick a key for the highlighted slot"
                : "Click a slot above, then pick its key here"}
            </Heading>
            <p className="mb-2 text-center text-ssm font-semibold text-gray-400 dark:text-gray-200">
              This combo only works on layer {combo ? layerLabel(combo.layer) : ""}, shown below. It uses where the keys sit on
              the keyboard, not what they type.
            </p>
            {KeyboardComponent && layerData.length > 0 ? (
              <div
                className={`comboKeyboard LayerHolder ${pickTarget?.kind === "member" ? "" : "opacity-60 pointer-events-none"}`}
              >
                <KeyboardComponent
                  readOnly={false}
                  index={0}
                  keymap={layerData}
                  onKeySelect={onKeyboardKeySelect}
                  selectedKey={-1}
                  selectedLED={-1}
                  palette={palette}
                  colormap={colormap}
                  darkMode={darkMode}
                  style={{ width: "100%" }}
                  showUnderglow={false}
                  className={`svg-${deviceName.toLowerCase()} raiseKeyboard layer h-auto`}
                  isStandardView={false}
                />
              </div>
            ) : null}
          </>
        )}
      </div>
    </Styles>
  );
}

export default ComboEditor;

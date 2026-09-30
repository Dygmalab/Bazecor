/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2026  Dygma Lab S.L.
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
import log from "electron-log/renderer";

import {
  COMBO_FLAG_ENABLED,
  COMBO_LAYER_ANY,
  COMBO_POSITION_UNUSED,
  ComboType,
  MAX_COMBO_MEMBERS,
  MAX_COMBOS,
} from "@Renderer/types/combos";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { OverlayCodes } from "../../hw/overlay";

/* Wire format of `combos.map`, matching CombosDygma::onFocusEvent:
 *
 *     count, then MAX_COMBOS records of
 *     [ p0, p1, p2, p3, layer, flags, action ]
 *
 * The record count is fixed so the firmware can write straight into its array
 * without tracking how much of the blob it has consumed. */
const FIELDS_PER_COMBO = MAX_COMBO_MEMBERS + 3;

export const emptyCombo = (id = 0, name = ""): ComboType => ({
  id,
  name,
  positions: new Array<number>(MAX_COMBO_MEMBERS).fill(COMBO_POSITION_UNUSED),
  layer: COMBO_LAYER_ANY,
  flags: COMBO_FLAG_ENABLED,
  action: 0,
});

/**
 * `stored` carries the names, which the firmware blob has no room for. Same
 * arrangement superkeys use: the keyboard owns the behaviour, the neuron store
 * owns the labels, and they are matched by index.
 */
export const parseCombosRaw = (raw: string, stored: ComboType[] = []): ComboType[] => {
  if (!raw || raw.trim().length === 0) {
    log.warn("Discarded combos: empty reply. This firmware may predate the feature.");
    return [];
  }

  const values = raw
    .trim()
    .split(" ")
    .filter(v => v.length > 0)
    .map(v => parseInt(v, 10));

  if (values.length < 1 || Number.isNaN(values[0])) {
    log.warn("Discarded combos: unparseable reply", raw);
    return [];
  }

  const count = Math.min(values[0], MAX_COMBOS);
  const combos: ComboType[] = [];

  for (let i = 0; i < count; i += 1) {
    const base = 1 + i * FIELDS_PER_COMBO;

    /* A truncated reply is not an error worth throwing over: keep whatever
     * arrived whole and drop the rest. */
    if (base + FIELDS_PER_COMBO > values.length) {
      log.warn(`Combos reply truncated at combo ${i}; keeping the ones already read.`);
      break;
    }

    combos.push({
      id: i,
      name: stored.length > i ? (stored[i].name ?? "") : "",
      positions: values.slice(base, base + MAX_COMBO_MEMBERS),
      layer: values[base + MAX_COMBO_MEMBERS],
      flags: values[base + MAX_COMBO_MEMBERS + 1],
      action: values[base + MAX_COMBO_MEMBERS + 2],
    });
  }

  return combos;
};

export const serializeCombos = (combos: ComboType[]): string => {
  const values: number[] = [Math.min(combos.length, MAX_COMBOS)];

  for (let i = 0; i < MAX_COMBOS; i += 1) {
    const combo = combos[i] ?? emptyCombo(i);

    for (let m = 0; m < MAX_COMBO_MEMBERS; m += 1) {
      values.push(combo.positions[m] ?? COMBO_POSITION_UNUSED);
    }

    values.push(combo.layer ?? COMBO_LAYER_ANY);
    values.push(combo.flags ?? 0);
    values.push(combo.action ?? 0);
  }

  return values.join(" ");
};

/** The member slots of a combo that actually hold a key. */
export const comboMembers = (combo: ComboType): number[] =>
  combo.positions.filter(p => p !== COMBO_POSITION_UNUSED && p !== undefined);

/**
 * Every physical key claimed by any combo, optionally ignoring one of them.
 *
 * A key may belong to at most one combo. Beyond avoiding an ambiguous chord,
 * this is what keeps one combo from being a subset of another: the firmware
 * fires on match, so a subset would always win and the longer combo could
 * never trigger.
 */
export const claimedPositions = (combos: ComboType[], exceptIndex?: number): Set<number> => {
  const claimed = new Set<number>();

  combos.forEach((combo, index) => {
    if (index === exceptIndex) return;
    comboMembers(combo).forEach(position => claimed.add(position));
  });

  return claimed;
};

/* ------------------------------------------------------------------------ */
/* Keys a combo member cannot be                                             */
/* ------------------------------------------------------------------------ */

const LENS_KEYS: number[] = [OverlayCodes.OVERLAY_KEY, OverlayCodes.OVERLAY_TAP, OverlayCodes.OVERLAY_HOLD];

const SUPERKEY_FIRST = 53980;
const SUPERKEY_COUNT = 128;

/* Lock, Shift and Move to layer: ten layers each, same bases as KeymapDB. */
const LAYER_KEY_BASES = [17408, 17450, 17492];
const LAYER_KEY_COUNT = 10;

/* Modifier keycodes: the eight HID modifiers, optionally carrying more
 * modifiers in the flag bits above them (Hyper, Meh, Ctrl+Shift...). */
const MODIFIER_FIRST = 224;
const MODIFIER_LAST = 231;
const MODIFIER_FLAGS_LIMIT = 0x2000;

const isModifierKey = (code: number) => {
  const base = code % 256;
  return code < MODIFIER_FLAGS_LIMIT && base >= MODIFIER_FIRST && base <= MODIFIER_LAST;
};

const isLayerKey = (code: number) => LAYER_KEY_BASES.some(base => code >= base && code < base + LAYER_KEY_COUNT);

/* What an unset superkey action reads as: 0 in the editor, 1 once serialised,
 * 65535 on a blank EEPROM. */
const isUnsetAction = (action: number | undefined) => !action || action === 1 || action === 65535;

/**
 * A superkey the firmware runs as a Qukey: TAP and HOLD set, the other three
 * actions empty, and a modifier or a layer change on HOLD.
 */
export const isQukeySuperkey = (superkey: SuperkeysType | undefined): boolean => {
  if (!superkey) return false;
  const [tap, hold, ...rest] = superkey.actions;
  if (isUnsetAction(tap) || isUnsetAction(hold)) return false;
  if (!rest.every(isUnsetAction)) return false;
  return isModifierKey(hold) || isLayerKey(hold);
};

export type ComboBreakReason = "lens" | "superkey";

/**
 * Why `keyCode` would stop a combo it sits in from firing, or null if it
 * would not.
 *
 * Lens keys and superkeys break a combo, except a superkey that behaves as a
 * Qukey. Qukeys, autoshift and CapsWord are fine.
 */
export const comboBreakReason = (keyCode: number, superkeys: SuperkeysType[] = []): ComboBreakReason | null => {
  if (LENS_KEYS.includes(keyCode)) return "lens";

  if (keyCode >= SUPERKEY_FIRST && keyCode < SUPERKEY_FIRST + SUPERKEY_COUNT) {
    return isQukeySuperkey(superkeys[keyCode - SUPERKEY_FIRST]) ? null : "superkey";
  }

  return null;
};

/** Indexes of the combos that use `position` on `layer`. */
export const combosAtPosition = (combos: ComboType[], position: number, layer: number): number[] =>
  combos.reduce<number[]>((found, combo, index) => {
    const onLayer = combo.layer === COMBO_LAYER_ANY || combo.layer === layer;
    if (onLayer && comboMembers(combo).includes(position)) found.push(index);
    return found;
  }, []);

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
  COMBO_POSITION_UNUSED,
  ComboType,
  LEGACY_COMBO_MEMBERS,
  MAX_COMBO_MEMBERS,
  MAX_COMBOS,
} from "@Renderer/types/combos";
import { SuperkeysType } from "@Renderer/types/superkeys";
import { OverlayCodes } from "../../hw/overlay";

/* Wire format of `combos.map`, matching CombosDygma::onFocusEvent:
 *
 *     count, then MAX_COMBOS records of
 *     [ p0, p1, p2, p3, p4, p5, layer, flags, action ]
 *
 * The record count is fixed so the firmware can write straight into its array
 * without tracking how much of the blob it has consumed. That also makes the
 * record size recoverable from the reply length, which is how the 4-member
 * format of the first combos firmware is told apart. */
const FIELDS_PER_COMBO = MAX_COMBO_MEMBERS + 3;
const LEGACY_FIELDS_PER_COMBO = LEGACY_COMBO_MEMBERS + 3;
const LEGACY_COMBO_LAYER_ANY = 255;

const toNumbers = (raw: string): number[] =>
  raw
    .trim()
    .split(/\s+/)
    .filter(v => v.length > 0)
    .map(v => parseInt(v, 10));

/**
 * True when `raw` is a `combos.map` reply from the first combos firmware: four
 * members per combo and a layer value of 255 meaning "every layer". Writing
 * the current format to it would misalign every record, so the editor refuses
 * to and asks for a firmware update instead.
 */
export const isLegacyCombosReply = (raw: string): boolean => {
  if (!raw || raw.trim().length === 0) return false;
  return toNumbers(raw).length === 1 + MAX_COMBOS * LEGACY_FIELDS_PER_COMBO;
};

/**
 * Rewrites a 4-key `combos.map` reply into the current 6-key format, so a
 * backup taken on the first combos firmware can be restored onto the current
 * one. The firmware update flow does exactly that -- backup, flash, restore --
 * and sending the old blob verbatim would misalign every record.
 *
 * The old "every layer" value has no equivalent any more: such a combo is
 * placed on layer 0, where most of them were meant to be used. Anything that
 * is not a legacy reply is returned untouched.
 */
export const upgradeLegacyCombosReply = (raw: string): string => {
  if (!isLegacyCombosReply(raw)) return raw;

  const values = toNumbers(raw);
  const out: number[] = [values[0]];

  for (let i = 0; i < MAX_COMBOS; i += 1) {
    const base = 1 + i * LEGACY_FIELDS_PER_COMBO;
    const positions = values.slice(base, base + LEGACY_COMBO_MEMBERS);
    const layer = values[base + LEGACY_COMBO_MEMBERS];
    const flags = values[base + LEGACY_COMBO_MEMBERS + 1];
    const action = values[base + LEGACY_COMBO_MEMBERS + 2];

    out.push(
      ...positions,
      ...new Array<number>(MAX_COMBO_MEMBERS - LEGACY_COMBO_MEMBERS).fill(COMBO_POSITION_UNUSED),
      layer === LEGACY_COMBO_LAYER_ANY ? 0 : layer,
      flags,
      action,
    );
  }

  return out.join(" ");
};

export const emptyCombo = (id = 0, name = "", layer = 0): ComboType => ({
  id,
  name,
  positions: new Array<number>(MAX_COMBO_MEMBERS).fill(COMBO_POSITION_UNUSED),
  layer,
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

  const values = toNumbers(raw);

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

    values.push(combo.layer ?? 0);
    values.push(combo.flags ?? 0);
    values.push(combo.action ?? 0);
  }

  return values.join(" ");
};

/** The member slots of a combo that actually hold a key. */
export const comboMembers = (combo: ComboType): number[] =>
  combo.positions.filter(p => p !== COMBO_POSITION_UNUSED && p !== undefined);

/**
 * The other combo on the same layer with exactly the same keys as combo
 * `index`, or -1.
 *
 * A key may belong to any number of combos, and one combo may even be a subset
 * of another: the firmware waits while a longer combo could still complete,
 * so pressing all the keys fires the longer one. The only conflict left is an
 * exact duplicate -- the same keys on the same layer -- where the firmware
 * always fires the one listed first and the other can never trigger.
 */
export const duplicateComboIndex = (combos: ComboType[], index: number): number => {
  const combo = combos[index];
  if (!combo) return -1;

  const members = comboMembers(combo);
  if (members.length === 0) return -1;

  const key = members
    .slice()
    .sort((a, b) => a - b)
    .join(",");

  return combos.findIndex((other, otherIndex) => {
    if (otherIndex === index || other.layer !== combo.layer) return false;
    const otherMembers = comboMembers(other);
    return (
      otherMembers.length === members.length &&
      otherMembers
        .slice()
        .sort((a, b) => a - b)
        .join(",") === key
    );
  });
};

/**
 * Indexes of the other combos on the same layer that share at least one key
 * with combo `index`. Purely informative: sharing keys is allowed.
 */
export const overlappingComboIndexes = (combos: ComboType[], index: number): number[] => {
  const combo = combos[index];
  if (!combo) return [];

  const members = comboMembers(combo);

  return combos.reduce<number[]>((found, other, otherIndex) => {
    if (otherIndex === index || other.layer !== combo.layer) return found;
    if (comboMembers(other).some(position => members.includes(position))) found.push(otherIndex);
    return found;
  }, []);
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

/** Indexes of the combos that use `position` on `layer`. A combo works on its
 * own layer only, so a key can be in different combos on different layers. */
export const combosAtPosition = (combos: ComboType[], position: number, layer: number): number[] =>
  combos.reduce<number[]>((found, combo, index) => {
    if (combo.layer === layer && comboMembers(combo).includes(position)) found.push(index);
    return found;
  }, []);

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

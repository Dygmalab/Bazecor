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

/** Slot value meaning "no key assigned here yet". */
export const COMBO_POSITION_UNUSED = 255;

export const COMBO_FLAG_ENABLED = 0x01;

/** Firmware limits, mirrored from CombosDygma.h. */
export const MAX_COMBOS = 32;
export const MAX_COMBO_MEMBERS = 6;
export const MIN_COMBO_MEMBERS = 2;

/** Member slots per record in the first combos firmware, which also had a
 * "every layer" value (255) that no longer exists. Kept only to recognise
 * that firmware's `combos.map` reply. */
export const LEGACY_COMBO_MEMBERS = 4;

/** Match window bounds, mirrored from CombosDygma::MIN/MAX_MATCH_WINDOW_MS. */
export const MIN_COMBO_WINDOW = 5;
export const MAX_COMBO_WINDOW = 500;
export const DEFAULT_COMBO_WINDOW = 10;

/** Idle time bounds, mirrored from CombosDygma::DEFAULT/MAX_IDLE_TIME_MS. 0
 * turns the requirement off. */
export const MAX_COMBO_IDLE_TIME = 1000;
export const DEFAULT_COMBO_IDLE_TIME = 100;

export interface ComboType {
  /** Position in the list, and the value the selector dropdown works with. */
  id: number;
  /** Shown in the selector. Host-side only -- the firmware blob has no room
   * for it, so like superkey names it lives in the neuron store. */
  name: string;
  /** Physical key offsets (KeyAddr::toInt()); COMBO_POSITION_UNUSED for empty. */
  positions: number[];
  /** The one layer the combo works on, as the firmware numbers layers. The
   * same keys can be a different combo on another layer. */
  layer: number;
  flags: number;
  /** The resulting key, as a raw Bazecor keycode. */
  action: number;
}

export interface ComboEditorProps {
  darkMode: boolean;
  onDisconnect: () => void;
  startContext: () => void;
  cancelContext: () => void;
  setLoading: (loading: boolean) => void;
  saveButtonRef?: React.RefObject<HTMLButtonElement>;
  discardChangesButtonRef?: React.RefObject<HTMLButtonElement>;
}

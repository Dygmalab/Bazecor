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

/** `layer` value meaning "this combo works on every layer". */
export const COMBO_LAYER_ANY = 255;

export const COMBO_FLAG_ENABLED = 0x01;

/** Firmware limits, mirrored from CombosDygma.h. */
export const MAX_COMBOS = 32;
export const MAX_COMBO_MEMBERS = 4;
export const MIN_COMBO_MEMBERS = 2;

export interface ComboType {
  /** Position in the list, and the value the selector dropdown works with. */
  id: number;
  /** Shown in the selector. Host-side only -- the firmware blob has no room
   * for it, so like superkey names it lives in the neuron store. */
  name: string;
  /** Physical key offsets (KeyAddr::toInt()); COMBO_POSITION_UNUSED for empty. */
  positions: number[];
  /** Layer filter, or COMBO_LAYER_ANY. */
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

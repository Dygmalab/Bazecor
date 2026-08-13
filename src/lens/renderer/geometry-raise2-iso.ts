/* Raise2 ISO key geometry for the Lens overlay, ported from Bazecor's
 * KeymapISO (src/api/hardware-dygma-raise2-iso/components/Keymap-ISO.jsx).
 *
 * ISO's LED map (LedMap) is byte-identical to ANSI's — every key shares the
 * same keymap/LED index as its ANSI counterpart — so this reuses
 * RAISE2_ANSI_TUPLES and patches in just the handful of keys that actually
 * differ between the two physical layouts:
 *   - row1,col15: a plain 57x57 Enter in ANSI becomes ISO's tall L-shaped
 *     Enter (69x124, keyType "enterKey" in Key.tsx) spanning down into row2.
 *   - row2,col15: narrows from 115 to 57 (ISO's backslash key moves out from
 *     under the taller Enter).
 *   - row3,col1: ANSI's single wide (130) key splits into two: a new
 *     col0 key (67 wide, the extra ISO key next to left Shift) plus a
 *     narrower col1 (57 wide, shifted right to x=162).
 *   - row3,col2-6: shift 5px right to make room for the wider two-key group.
 * Everything else (all thumb-row keys included) is pixel-identical to ANSI. */

import { RAISE2_ANSI_TUPLES, buildRaise2Keys, type Raise2Key } from "./geometry-raise2-ansi";

export type { Raise2Key };

const ISO_ROW3_OVERRIDES = new Set([1, 2, 3, 4, 5, 6]);

const RAISE2_ISO_TUPLES: typeof RAISE2_ANSI_TUPLES = [
  // row3,col0: new key, no ANSI equivalent (LedMap[3][0] = 19).
  [3, 0, 84, 236, 67, 19],
  ...RAISE2_ANSI_TUPLES.filter(([row, col]) => !(row === 3 && ISO_ROW3_OVERRIDES.has(col))).map(
    ([row, col, x, y, w, ledIndex, thumbType, h]): (typeof RAISE2_ANSI_TUPLES)[number] => {
      if (row === 1 && col === 15) return [1, 15, 1069, 102, 69, ledIndex, "raise2-iso-enter", 124];
      if (row === 2 && col === 15) return [2, 15, 1023, 169, 57, ledIndex];
      return [row, col, x, y, w, ledIndex, thumbType, h];
    },
  ),
  [3, 1, 162, 236, 57, 20],
  [3, 2, 229, 236, 57, 21],
  [3, 3, 296, 236, 57, 22],
  [3, 4, 363, 236, 57, 23],
  [3, 5, 430, 236, 57, 24],
  [3, 6, 497, 236, 57, 25],
];

export const RAISE2_ISO_KEYS: Raise2Key[] = buildRaise2Keys(RAISE2_ISO_TUPLES);

// Same canvas as ANSI (Keymap-ISO.jsx uses the identical 1222x430 viewBox).
export const RAISE2_ISO_SVG_W = 1222;
export const RAISE2_ISO_VIEW_Y = 15;
export const RAISE2_ISO_VIEW_H = 430;

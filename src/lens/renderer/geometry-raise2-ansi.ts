/* Raise2 ANSI key geometry for the Lens overlay, ported from Bazecor's
 * KeymapANSI (src/api/hardware-dygma-raise2-ansi/components/Keymap-ANSI.jsx):
 * the same per-key x/y/width/height, LED map and thumb-key positions — but
 * rendered with Lens' own clean SVG pipeline (rounded rects) instead of
 * dragging the editor's styled component into the overlay window.
 *
 * `index` is the keymap index (row*16 + col, 80 per layer); `ledIndex` maps the
 * key to its colormap slot (0-68 for keys, matching Keymap-ANSI's LedMap). Keys
 * whose matrix slot has no physical key in the source component (LedMap value
 * of XX, or an LED index that is never wired to a visible <Key>) are omitted
 * here too, same as the editor. See geometry-raise2-iso.ts for the ISO variant
 * (same LED map, but a handful of keys near Enter/left-Shift differ). */

export interface Raise2Key {
  index: number;
  ledIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  group: "left" | "right";
  /** For keys with a non-rect silhouette (thumb wings, ISO Enter): the Key.tsx
   * keyType whose SVG path to draw (see raise2-thumb-paths.ts /
   * raise2-iso-enter-path.ts). Absent for regular keys, which render as
   * rounded rects. */
  thumbType?: string;
}

const H = 57;

// [row, col, x, y, w, ledIndex, thumbType?, h?]. Coordinates/widths/LED indices
// are copied verbatim from each <Key> in Keymap-ANSI.jsx; row/col gaps (no <Key>
// element in the source, e.g. the physical split between halves) are simply
// not listed. `h` defaults to 57 when omitted.
export const RAISE2_ANSI_TUPLES: [
  row: number,
  col: number,
  x: number,
  y: number,
  w: number,
  ledIndex: number,
  thumbType?: string,
  h?: number,
][] = [
  // Row 0 (y=35)
  [0, 0, 84, 35, 57, 0],
  [0, 1, 151, 35, 57, 1],
  [0, 2, 218, 35, 57, 2],
  [0, 3, 285, 35, 57, 3],
  [0, 4, 352, 35, 57, 4],
  [0, 5, 419, 35, 57, 5],
  [0, 6, 486, 35, 57, 6],
  [0, 9, 624, 35, 57, 39],
  [0, 10, 691, 35, 57, 38],
  [0, 11, 758, 35, 57, 37],
  [0, 12, 825, 35, 57, 36],
  [0, 13, 892, 35, 57, 35],
  [0, 14, 959, 35, 57, 34],
  [0, 15, 1026, 35, 112, 33],

  // Row 1 (y=102)
  [1, 0, 84, 102, 94, 7],
  [1, 1, 188, 102, 57, 8],
  [1, 2, 255, 102, 57, 9],
  [1, 3, 322, 102, 57, 10],
  [1, 4, 389, 102, 57, 11],
  [1, 5, 456, 102, 57, 12],
  [1, 8, 600, 102, 57, 47],
  [1, 9, 667, 102, 57, 46],
  [1, 10, 734, 102, 57, 45],
  [1, 11, 801, 102, 57, 44],
  [1, 12, 868, 102, 57, 43],
  [1, 13, 935, 102, 57, 42],
  [1, 14, 1002, 102, 57, 41],
  [1, 15, 1069, 102, 69, 40],

  // Row 2 (y=169)
  [2, 0, 84, 169, 112, 13],
  [2, 1, 206, 169, 57, 14],
  [2, 2, 273, 169, 57, 15],
  [2, 3, 340, 169, 57, 16],
  [2, 4, 407, 169, 57, 17],
  [2, 5, 474, 169, 57, 18],
  [2, 9, 621, 169, 57, 54],
  [2, 10, 688, 169, 57, 53],
  [2, 11, 755, 169, 57, 52],
  [2, 12, 822, 169, 57, 51],
  [2, 13, 889, 169, 57, 50],
  [2, 14, 956, 169, 57, 49],
  [2, 15, 1023, 169, 115, 48],

  // Row 3 (y=236). Col 1's key is the wide (130) key that visually spans the
  // col0/col1 slot in the source; col0 has an LED index but no rendered key.
  [3, 1, 84, 236, 130, 20],
  [3, 2, 224, 236, 57, 21],
  [3, 3, 291, 236, 57, 22],
  [3, 4, 358, 236, 57, 23],
  [3, 5, 425, 236, 57, 24],
  [3, 6, 492, 236, 57, 25],
  [3, 10, 652, 236, 57, 60],
  [3, 11, 719, 236, 57, 59],
  [3, 12, 786, 236, 57, 58],
  [3, 13, 853, 236, 57, 57],
  [3, 14, 920, 236, 57, 56],
  [3, 15, 987, 236, 151, 55],

  // Row 4 (thumb row). Cols 0-4 and 10-15 sit at y=303; cols 5, 6, 8, 9 sit at
  // y=370 (the source's keysRowsPosition.row6). Col 7 has no physical key.
  [4, 0, 84, 303, 67, 26],
  [4, 1, 162, 303, 67, 27],
  [4, 2, 239, 303, 67, 28],
  [4, 3, 316, 303, 115, 29],
  [4, 4, 441, 303, 81, 30],
  [4, 5, 334, 370, 123, 31, "raise2-t5"],
  [4, 6, 464, 370, 57, 32],
  [4, 8, 644, 370, 57, 68],
  [4, 9, 710, 370, 113, 67, "raise2-t8"],
  [4, 10, 645, 303, 66, 66],
  [4, 11, 719, 303, 115, 65],
  [4, 12, 844, 303, 66, 64],
  [4, 13, 920, 303, 66, 63],
  [4, 14, 996, 303, 66, 62],
  [4, 15, 1072, 303, 66, 61],
];

export function buildRaise2Keys(tuples: typeof RAISE2_ANSI_TUPLES): Raise2Key[] {
  return tuples.map(([row, col, x, y, w, ledIndex, thumbType, h]) => ({
    index: row * 16 + col,
    ledIndex,
    x,
    y,
    w,
    h: h ?? H,
    group: col <= 7 ? "left" : "right",
    thumbType,
  }));
}

export const RAISE2_ANSI_KEYS: Raise2Key[] = buildRaise2Keys(RAISE2_ANSI_TUPLES);

// SVG coordinate space / crop for the overlay (keys span y≈35..427, x≈84..1138,
// within Keymap-ANSI's 1222-wide canvas).
export const RAISE2_ANSI_SVG_W = 1222;
export const RAISE2_ANSI_VIEW_Y = 15;
export const RAISE2_ANSI_VIEW_H = 430;

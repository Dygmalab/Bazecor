/* eslint-disable no-plusplus, no-continue -- ported key-grid generation loops */
/* Defy key geometry for the Lens overlay, ported from Bazecor's KeymapDEFY
 * (src/api/hardware-dygma-defy-wired/components/Keymap.jsx): the same column x
 * positions, per-column row staggers, LED map and thumb-key coordinates — but
 * rendered with Lens' own clean SVG pipeline (rounded rects) instead of dragging
 * the editor's styled component into the overlay window.
 *
 * `index` is the keymap index (row*16 + col, 80 per layer); `ledIndex` maps the
 * key to its colormap slot (0-69 for keys). Coordinates are in KeymapDEFY's
 * 1270x560 space. Thumb keys keep their real widths/heights (t1 is wide, t8/tR8
 * are double-height) but are drawn as rects rather than the editor's arc paths. */

export interface DefyKey {
  index: number;
  ledIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  group: "left" | "right";
  /** For thumb keys: the Key.tsx keyType whose SVG silhouette to draw (see
   * DEFY_THUMB_PATHS). Absent for regular keys, which render as rounded rects. */
  thumbType?: string;
}

// Column x-positions (keysColumnsPosition x0..x13). Index by the entries below.
const X = [105, 171, 236, 301, 366, 431, 497, 718, 783, 848, 913, 978, 1043, 1107] as const;

// Per-column: which X entry and which row stagger level (0..3). Columns 7 and 8
// are the physical gap between halves (no keys). Cols 0-6 are the left half,
// cols 9-15 the right half.
const COL_X: (number | null)[] = [
  X[0],
  X[1],
  X[2],
  X[3],
  X[4],
  X[5],
  X[6],
  null,
  null,
  X[7],
  X[8],
  X[9],
  X[10],
  X[11],
  X[12],
  X[13],
];
const COL_STAGGER: (number | null)[] = [0, 0, 1, 2, 1, 1, 3, null, null, 3, 1, 1, 2, 1, 0, 0];

// Row y-positions by stagger level [y0, y1, y2, y3] (keysRowsDefyPosition row1-4).
const ROW_Y: readonly number[][] = [
  [111, 88, 71, 121], // keymap row 0
  [176, 153, 137, 186], // keymap row 1
  [241, 217, 203, 252], // keymap row 2
  [306, 282, 268, 306], // keymap row 3 (no stagger-3 keys; y3 unused)
];

// LED index per [row][col]; 255 = no key at that matrix slot (led_map in KeymapDEFY).
const XX = 255;
const L = 35; // LEDS_LEFT_KEYS
// prettier-ignore
const LED_MAP: number[][] = [
  [0, 1, 2, 3, 4, 5, 6, XX, XX, 6 + L, 5 + L, 4 + L, 3 + L, 2 + L, 1 + L, 0 + L],
  [7, 8, 9, 10, 11, 12, 13, XX, XX, 13 + L, 12 + L, 11 + L, 10 + L, 9 + L, 8 + L, 7 + L],
  [14, 15, 16, 17, 18, 19, 20, XX, XX, 20 + L, 19 + L, 18 + L, 17 + L, 16 + L, 15 + L, 14 + L],
  [21, 22, 23, 24, 25, 26, XX, XX, XX, XX, 26 + L, 25 + L, 24 + L, 23 + L, 22 + L, 21 + L],
];

const KEY_W = 57;
const KEY_H = 57;

// Thumb keys (keymap row 4): [col, x, y, w, h]. Positions/sizes come straight from
// KeymapDEFY's defy-t* / defy-tR* <Key> elements. keymap index = 64 + col,
// ledIndex = LED_MAP row 4 = [27..34, 69,68,67,66,65,64,63,62].
const THUMB_LED = [27, 28, 29, 30, 31, 32, 33, 34, 69, 68, 67, 66, 65, 64, 63, 62];
// [col, x, y, w, h, keyType] — keyType selects the silhouette from DEFY_THUMB_PATHS.
const THUMBS: [col: number, x: number, y: number, w: number, h: number, keyType: string][] = [
  [0, 302, 350, 82, 57, "defy-t1"],
  [1, 390, 350, 57, 57, "defy-t2"],
  [2, 449, 351, 57, 57, "defy-t3"],
  [3, 497, 373, 57, 57, "defy-t4"],
  [4, 477, 434, 57, 116, "defy-t8"], // double height
  [5, 441, 421, 57, 57, "defy-t7"],
  [6, 387, 411, 57, 57, "defy-t6"],
  [7, 305, 411, 65, 57, "defy-t5"],
  [8, 889, 411, 57, 57, "defy-tR5"],
  [9, 823, 410, 57, 57, "defy-tR6"],
  [10, 754, 420, 57, 57, "defy-tR7"],
  [11, 686, 434, 57, 116, "defy-tR8"], // double height
  [12, 698, 372, 57, 57, "defy-tR4"],
  [13, 748, 350, 57, 57, "defy-tR3"],
  [14, 817, 349, 57, 57, "defy-tR2"],
  [15, 886, 349, 65, 57, "defy-tR1"],
];

function buildKeys(): DefyKey[] {
  const keys: DefyKey[] = [];

  // Regular keys, rows 0-3.
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 16; col++) {
      const led = LED_MAP[row][col];
      const x = COL_X[col];
      const stagger = COL_STAGGER[col];
      if (led === XX || x === null || stagger === null) continue;
      keys.push({
        index: row * 16 + col,
        ledIndex: led,
        x,
        y: ROW_Y[row][stagger],
        w: KEY_W,
        h: KEY_H,
        group: col <= 6 ? "left" : "right",
      });
    }
  }

  // Thumb keys, row 4.
  for (const [col, x, y, w, h, keyType] of THUMBS) {
    keys.push({
      index: 64 + col,
      ledIndex: THUMB_LED[col],
      x,
      y,
      w,
      h,
      group: col <= 7 ? "left" : "right",
      thumbType: keyType,
    });
  }

  return keys;
}

export const DEFY_KEYS: DefyKey[] = buildKeys();

// SVG coordinate space / crop for the overlay (keys span y≈71..550, x≈105..1164).
export const DEFY_SVG_W = 1270;
export const DEFY_VIEW_Y = 50;
export const DEFY_VIEW_H = 515;

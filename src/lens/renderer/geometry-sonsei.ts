/* eslint-disable no-plusplus -- ported key-grid generation loops */
export interface SonseiKey {
  index: number;
  ledIndex: number;
  x: number;
  y: number;
  w: number;
  h: number;
  group: "left" | "right";
}

const W = 57;
const H = 57;

// Column x-positions from Bazecor KeymapSONSEI
const X = [105, 171, 236, 301, 366, 431, 783, 848, 913, 978, 1043, 1107] as const;

// Row y-positions by stagger level (from keysRowsDefyPosition in Bazecor)
// [y0, y1, y2] per row index 0-3
const ROW_Y: readonly [number, number, number][] = [
  [111, 88, 71], // row 0
  [176, 153, 137], // row 1
  [241, 217, 203], // row 2
  [306, 282, 268], // row 3
];

// Stagger level per column (0 = lowest/outer, 1 = mid, 2 = highest/index)
// Left cols 0-5
const LEFT_STAGGER = [0, 0, 1, 2, 1, 1] as const;
// Right cols 6-11 (mapped to X[6]-X[11])
const RIGHT_STAGGER = [1, 1, 2, 1, 0, 0] as const;

// Thumb key (row 4) positions are hardcoded absolute coordinates
// (these come directly from the Bazecor JSX, pre-transform)
const LEFT_THUMBS: [number, number][] = [
  [327, 347], // R4C0, keyIndex=48, ledIndex=48
  [390, 350], // R4C1, keyIndex=49, ledIndex=49
  [449, 351], // R4C2, keyIndex=50, ledIndex=50
  [497, 373], // R4C3, keyIndex=51, ledIndex=51
];

const RIGHT_THUMBS: [number, number][] = [
  [698, 372], // R4C8, keyIndex=56, ledIndex=52
  [748, 350], // R4C9, keyIndex=57, ledIndex=53
  [817, 349], // R4C10, keyIndex=58, ledIndex=54
  [886, 349], // R4C11, keyIndex=59, ledIndex=55
];

function buildKeys(): SonseiKey[] {
  const keys: SonseiKey[] = [];

  // Rows 0-3, columns 0-5 (left group)
  for (let row = 0; row < 4; row++) {
    for (let col = 0; col < 6; col++) {
      const stagger = LEFT_STAGGER[col];
      keys.push({
        index: row * 12 + col,
        ledIndex: row * 12 + col,
        x: X[col],
        y: ROW_Y[row][stagger],
        w: W,
        h: H,
        group: "left",
      });
    }
  }

  // Row 4, columns 0-3 (left thumbs)
  LEFT_THUMBS.forEach(([x, y], i) => {
    keys.push({
      index: 48 + i,
      ledIndex: 48 + i,
      x,
      y,
      w: W,
      h: H,
      group: "left",
    });
  });

  // Rows 0-3, columns 6-11 (right group, X[6]-X[11])
  for (let row = 0; row < 4; row++) {
    for (let col = 6; col < 12; col++) {
      const stagger = RIGHT_STAGGER[col - 6];
      keys.push({
        index: row * 12 + col,
        ledIndex: row * 12 + col,
        x: X[col],
        y: ROW_Y[row][stagger],
        w: W,
        h: H,
        group: "right",
      });
    }
  }

  // Row 4, columns 8-11 (right thumbs, keyIndex 56-59, ledIndex 52-55)
  RIGHT_THUMBS.forEach(([x, y], i) => {
    keys.push({
      index: 56 + i,
      ledIndex: 52 + i,
      x,
      y,
      w: W,
      h: H,
      group: "right",
    });
  });

  return keys;
}

export const SONSEI_KEYS: SonseiKey[] = buildKeys();

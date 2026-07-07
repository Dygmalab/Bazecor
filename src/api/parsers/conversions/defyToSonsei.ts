// Defy keymap layer size: 5 rows × 16 cols = 80 positions per layer
// Sonsei keymap layer size: 5 rows × 12 cols = 60 positions per layer
//
// Column mapping per row (Defy col → Sonsei col):
//   Rows 0-2: Defy cols 0-5 → Sonsei cols 0-5
//             Defy col 6 → dropped (inner LHS key)
//             Defy col 7,8 → XX (gap between halves)
//             Defy col 9 → dropped (inner RHS key)
//             Defy cols 10-15 → Sonsei cols 6-11
//   Row 3:    Defy cols 0-5 → Sonsei cols 0-5
//             Defy cols 6-9 → XX (gap in Defy)
//             Defy cols 10-15 → Sonsei cols 6-11
//   Row 4:    Defy cols 0-3 → Sonsei cols 0-3
//             Defy cols 4-7 → dropped
//             Defy cols 8-11 → dropped (bottom row: ENTER, arrows)
//             Defy cols 12-15 → Sonsei cols 8-11 (top row: SPACE, SPACE, ↑, SUPER)
//             Sonsei cols 4-7 → 65535 (no equivalent)

const DEFY_COLS = 16;
const SONSEI_COLS = 12;
const NO_KEY = 65535;

// For each Sonsei position (row * 12 + col_s), what is the Defy source position (row * 16 + col_d)?
// -1 means no source (fill with NO_KEY)
const buildKeymapIndexMap = (): number[] => {
  const map: number[] = new Array(5 * SONSEI_COLS).fill(-1);

  // Rows 0-3: same mapping (cols 0-5 LHS, cols 10-15 RHS)
  for (let row = 0; row < 4; row++) {
    for (let colS = 0; colS < 6; colS++) {
      // Sonsei cols 0-5 ← Defy cols 0-5
      map[row * SONSEI_COLS + colS] = row * DEFY_COLS + colS;
    }
    for (let colS = 6; colS < 12; colS++) {
      // Sonsei cols 6-11 ← Defy cols 10-15
      const defyCol = colS + 4; // colS=6→defyCol=10, colS=11→defyCol=15
      map[row * SONSEI_COLS + colS] = row * DEFY_COLS + defyCol;
    }
  }

  // Row 4 (thumbcluster)
  {
    const row = 4;
    for (let colS = 0; colS < 4; colS++) {
      // Sonsei cols 0-3 ← Defy cols 0-3
      map[row * SONSEI_COLS + colS] = row * DEFY_COLS + colS;
    }
    // Sonsei cols 4-7 → no equivalent, stay -1
    for (let colS = 8; colS < 12; colS++) {
      // Sonsei cols 8-11 ← Defy cols 12-15 (top row of RHS thumbcluster)
      const defyCol = colS + 4; // colS=8→defyCol=12, colS=11→defyCol=15
      map[row * SONSEI_COLS + colS] = row * DEFY_COLS + defyCol;
    }
  }

  return map;
};

const KEYMAP_INDEX_MAP = buildKeymapIndexMap();

export const convertKeymapDefyToSonsei = (layer: number[]): number[] => {
  return KEYMAP_INDEX_MAP.map(defyIdx => (defyIdx === -1 ? NO_KEY : layer[defyIdx]));
};

// Colormap LED mapping: Defy LED index → Sonsei LED index
// Defy led_map (from Keymap.jsx), cols → LED indices:
//   Row 0: c0=0, c1=1, c2=2, c3=3, c4=4, c5=5, c6=6, c7=XX, c8=XX, c9=41, c10=40, c11=39, c12=38, c13=37, c14=36, c15=35
//   Row 1: c0=7, c1=8, c2=9, c3=10, c4=11, c5=12, c6=13, c7=XX, c8=XX, c9=48, c10=47, c11=46, c12=45, c13=44, c14=43, c15=42
//   Row 2: c0=14, c1=15, c2=16, c3=17, c4=18, c5=19, c6=20, c7=XX, c8=XX, c9=55, c10=54, c11=53, c12=52, c13=51, c14=50, c15=49
//   Row 3: c0=21, c1=22, c2=23, c3=24, c4=25, c5=26, c6-9=XX, c10=61, c11=60, c12=59, c13=58, c14=57, c15=56
//   Row 4: c0=27, c1=28, c2=29, c3=30, c4=31, c5=32, c6=33, c7=34, c8=69, c9=68, c10=67, c11=66, c12=65, c13=64, c14=63, c15=62
//
// Sonsei led_map (from Keymap.jsx):
//   Row 0: LEDs 0-11
//   Row 1: LEDs 12-23
//   Row 2: LEDs 24-35
//   Row 3: LEDs 36-47
//   Row 4: LEDs 48,49,50,51,XX,XX,XX,XX,52,53,54,55
//
// Mapping: Sonsei cols 0-5 ← Defy cols 0-5, Sonsei cols 6-11 ← Defy cols 10-15
// For each Sonsei LED (0-55), what is the source Defy LED index?
// -1 means no source (fill with 0 = first palette color)

const buildColormapIndexMap = (): number[] => {
  const map: number[] = new Array(56).fill(-1);

  // Row 0 (Sonsei LEDs 0-11)
  // Sonsei 0-5 ← Defy LHS cols 0-5: LEDs 0-5
  for (let i = 0; i < 6; i++) map[i] = i;
  // Sonsei 6-11 ← Defy RHS cols 10-15: LEDs 40,39,38,37,36,35
  map[6] = 40;
  map[7] = 39;
  map[8] = 38;
  map[9] = 37;
  map[10] = 36;
  map[11] = 35;

  // Row 1 (Sonsei LEDs 12-23)
  // Sonsei 12-17 ← Defy LHS cols 0-5: LEDs 7-12
  for (let i = 0; i < 6; i++) map[12 + i] = 7 + i;
  // Sonsei 18-23 ← Defy RHS cols 10-15: LEDs 47,46,45,44,43,42
  map[18] = 47;
  map[19] = 46;
  map[20] = 45;
  map[21] = 44;
  map[22] = 43;
  map[23] = 42;

  // Row 2 (Sonsei LEDs 24-35)
  // Sonsei 24-29 ← Defy LHS cols 0-5: LEDs 14-19
  for (let i = 0; i < 6; i++) map[24 + i] = 14 + i;
  // Sonsei 30-35 ← Defy RHS cols 10-15: LEDs 54,53,52,51,50,49
  map[30] = 54;
  map[31] = 53;
  map[32] = 52;
  map[33] = 51;
  map[34] = 50;
  map[35] = 49;

  // Row 3 (Sonsei LEDs 36-47)
  // Sonsei 36-41 ← Defy LHS cols 0-5: LEDs 21-26
  for (let i = 0; i < 6; i++) map[36 + i] = 21 + i;
  // Sonsei 42-47 ← Defy RHS cols 10-15: LEDs 61,60,59,58,57,56
  map[42] = 61;
  map[43] = 60;
  map[44] = 59;
  map[45] = 58;
  map[46] = 57;
  map[47] = 56;

  // Row 4 thumbcluster (Sonsei LEDs: 48,49,50,51,XX,XX,XX,XX,52,53,54,55)
  // Sonsei 48-51 ← Defy LHS cols 0-3: LEDs 27-30
  map[48] = 27;
  map[49] = 28;
  map[50] = 29;
  map[51] = 30;
  // Sonsei 52-55 ← Defy RHS cols 12-15 (top row): LEDs 65,64,63,62
  map[52] = 65;
  map[53] = 64;
  map[54] = 63;
  map[55] = 62;

  return map;
};

const COLORMAP_INDEX_MAP = buildColormapIndexMap();

export const convertColormapDefyToSonsei = (layer: number[]): number[] => {
  return COLORMAP_INDEX_MAP.map(defyLed => (defyLed === -1 ? 0 : layer[defyLed]));
};

import { PaletteType } from "@Renderer/types/layout";

export const convertKeymapR2toR = (layer: number[], keyboardType: string) => {
  let localLayer = [...layer];
  // restoring thumbcluster
  const preT = localLayer.slice(0, 69);
  const movT = localLayer.slice(69, 71);
  const remT = localLayer[71];
  const restT = localLayer.slice(72);
  localLayer = preT.concat([remT].concat(movT)).concat(restT);

  // if ansi
  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const enterK = localLayer[31];
    const symbolK = localLayer[47];

    localLayer[31] = symbolK;
    localLayer[47] = enterK;
    // Move shift (48<>49)
    const extraK = localLayer[48];
    const shiftK = localLayer[49];

    localLayer[48] = shiftK;
    localLayer[49] = extraK;
  }

  // if layout !== layout, solve shift & enter
  return localLayer;
};

export const convertColormapR2toR = (layer: number[], keyboardType: string, backupKeyboardType: string) => {
  const rest = layer.slice(0, 132);
  const result = rest;

  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const enterC = result[40];
    const symbolC = result[48];

    result[40] = symbolC;
    result[48] = enterC;
  }

  if (keyboardType === "ANSI" && backupKeyboardType === "ISO") {
    // Move shift (48<>49)
    const extraC = result[19];
    const shiftC = result[20];

    result[19] = shiftC;
    result[20] = extraC;
  }

  return result;
};

export const convertPaletteR2toR = (color: PaletteType) => {
  return {
    r: color.r,
    g: color.g,
    b: color.b,
    rgb: `rgb(${color.r}, ${color.g}, ${color.b})`,
  };
};

// Keys the Raise 2 firmware has and the Raise 1 firmware does not: wireless
// (battery, Bluetooth, energy, RF; 54108-54111), Layer Lens (54112-54114),
// Autoshift (54115-54370) and CapsWord (54371). They sit in one contiguous block,
// see src/hw/. The Raise 1 can't run them, so a Raise 2 backup must not hand
// them to it. The commands behind these features (combos.*, autoshift.*,
// capsword.*, wireless.*) are skipped at restore time, as the Raise 1 doesn't
// list them in `help`.
const RAISE2_ONLY_FIRST = 54108;
const RAISE2_ONLY_LAST = 54371;

export const isRaise2OnlyKey = (keyCode: number) => keyCode >= RAISE2_ONLY_FIRST && keyCode <= RAISE2_ONLY_LAST;

/** A keymap layer with every Raise 2-only key blanked (0, no key). */
export const stripRaise2OnlyKeys = (layer: number[]): number[] => layer.map(k => (isRaise2OnlyKey(k) ? 0 : k));

/**
 * A `superkeys.map` reply with every Raise 2-only action unset. Unset is 1 here,
 * not 0: 0 separates one superkey from the next in this format, so writing it
 * would split the superkey in two and shift every later one.
 */
export const stripRaise2OnlySuperkeyActions = (raw: string): string =>
  raw
    .split(" ")
    .map(v => (v.length > 0 && isRaise2OnlyKey(Number(v)) ? "1" : v))
    .join(" ");

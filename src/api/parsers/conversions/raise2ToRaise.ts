import { PaletteType } from "@Renderer/types/layout";

/**
 * Converts a keymap layer from a Raise 2 keyboard layout to a Raise 1 layout.
 * This involves rearranging the thumb cluster keys and handling layout-specific differences
 * for ANSI keyboards, such as the Enter and Left Shift keys.
 *
 * @param {number[]} layer - An array of numbers representing a keymap layer from a Raise 2.
 * @param {string} keyboardType - The keyboard type of the target device (e.g., "ANSI"), used to handle layout-specific key swaps.
 * @returns {number[]} The converted keymap layer compatible with a Raise 1 keyboard.
 */
export const convertKeymapR2toR = (layer: number[], keyboardType: string): number[] => {
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

/**
 * Converts a colormap layer from a Raise 2 keyboard layout to a Raise 1 layout.
 * It truncates the layer to the appropriate size and performs specific color index swaps
 * to match the physical layout differences, especially for ANSI keyboards.
 *
 * @param {number[]} layer - An array of numbers representing a colormap layer from a Raise 2.
 * @param {string} keyboardType - The keyboard type of the target device (e.g., "ANSI").
 * @param {string} backupKeyboardType - The keyboard type of the source backup device (e.g., "ISO").
 * @returns {number[]} The converted colormap layer compatible with a Raise 1 keyboard.
 */
export const convertColormapR2toR = (layer: number[], keyboardType: string, backupKeyboardType: string): number[] => {
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

/**
 * Converts a single color object from a Raise 2 palette to the array format used by Raise 1.
 *
 * @param {PaletteType} color - A color object with `r`, `g`, and `b` properties.
 * @returns {number[]} An array containing the `r`, `g`, and `b` values: `[r, g, b]`.
 */
export const convertPaletteR2toR = (color: PaletteType): number[] => {
  const rgb = color;
  return [rgb.r, rgb.g, rgb.b];
};

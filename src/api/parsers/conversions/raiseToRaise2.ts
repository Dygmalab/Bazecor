import { PaletteType } from "@Renderer/types/layout";
import { rgb2w } from "../../color";

/**
 * Converts a keymap layer from a Raise 1 keyboard layout to a Raise 2 layout.
 * This involves rearranging the thumb cluster keys and handling layout-specific differences
 * for ANSI keyboards, such as the Enter and Left Shift keys.
 *
 * @param {number[]} layer - An array of numbers representing a keymap layer from a Raise 1.
 * @param {string} keyboardType - The keyboard type of the target device (e.g., "ANSI"), used to handle layout-specific key swaps.
 * @returns {number[]} The converted keymap layer compatible with a Raise 2 keyboard.
 */
export const convertKeymapRtoR2 = (layer: number[], keyboardType: string): number[] => {
  let localLayer = [...layer];
  // restoring thumbcluster
  const preT = localLayer.slice(0, 69);
  const remT = localLayer[69];
  const movT = localLayer.slice(70, 72);
  const restT = localLayer.slice(72);
  localLayer = preT.concat(movT.concat(remT)).concat(restT);

  // if ansi
  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const symbolK = localLayer[31];
    const enterK = localLayer[47];

    localLayer[31] = enterK;
    localLayer[47] = symbolK;
    // Move shift (48<>49)
    const shiftK = localLayer[48];
    const extraK = localLayer[49];

    localLayer[48] = extraK;
    localLayer[49] = shiftK;
  }

  // if layout !== layout, solve shift & enter
  return localLayer;
};

/**
 * Converts a colormap layer from a Raise 1 keyboard layout to a Raise 2 layout.
 * It expands the colormap to fit the Raise 2's larger LED count and performs specific
 * color index swaps to match the physical layout differences, especially for ANSI keyboards.
 *
 * @param {number[]} layer - An array of numbers representing a colormap layer from a Raise 1.
 * @param {string} keyboardType - The keyboard type of the target device (e.g., "ANSI").
 * @param {string} backupKeyboardType - The keyboard type of the source backup device (e.g., "ISO").
 * @returns {number[]} The converted colormap layer compatible with a Raise 2 keyboard.
 */
export const convertColormapRtoR2 = (layer: number[], keyboardType: string, backupKeyboardType: string): number[] => {
  const color = layer[130];
  const rest = layer.slice(0, -1);
  const result = rest.concat(new Array(45).fill(color));

  if (keyboardType === "ANSI") {
    // Move enter (31<>47)
    const symbolC = result[40];
    const enterC = result[48];

    result[40] = enterC;
    result[48] = symbolC;
  }

  if (keyboardType === "ANSI" && backupKeyboardType === "ISO") {
    // Move shift (48<>49)
    const shiftC = result[19];
    const extraC = result[20];

    result[19] = extraC;
    result[20] = shiftC;
  }

  return result;
};

/**
 * Converts a single RGB color object from a Raise 1 palette to the RGBW array format used by Raise 2.
 *
 * @param {PaletteType} color - An RGB color object with `r`, `g`, and `b` properties.
 * @returns {number[]} An array containing the `r`, `g`, `b`, and `w` values: `[r, g, b, w]`.
 */
export const convertPaletteRtoR2 = (color: PaletteType): number[] => {
  const rgbw = rgb2w(color);
  return [rgbw.r, rgbw.g, rgbw.b, rgbw.w];
};

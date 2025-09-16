import { PaletteType } from "@Renderer/types/layout";

/**
 * Converts a keymap layer from Raise 2 format to the original Raise format.
 * It adjusts the thumb cluster and handles layout differences for ANSI keyboards.
 * @param {number[]} layer The keymap layer to convert.
 * @param {string} keyboardType The type of keyboard layout (e.g., 'ANSI', 'ISO').
 * @returns {number[]} The converted keymap layer.
 */
export const convertKeymapR2toR = (layer: number[], keyboardType: string): number[] => {
  let localLayer = [...layer];
  // restoring thumb cluster
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
 * Converts a colormap layer from Raise 2 format to the original Raise format.
 * It truncates the color map and adjusts colors for ANSI layouts.
 * @param {number[]} layer The colormap layer to convert.
 * @param {string} keyboardType The primary keyboard layout type.
 * @param {string} backupKeyboardType The backup keyboard layout type.
 * @returns {number[]} The converted colormap layer.
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
 * Converts a palette color from Raise 2 format (RGB) to the original Raise format.
 * This function essentially extracts the RGB values.
 * @param {PaletteType} color The color object to convert.
 * @returns {number[]} An array containing the [r, g, b] values.
 */
export const convertPaletteR2toR = (color: PaletteType): number[] => {
  const rgb = color;
  return [rgb.r, rgb.g, rgb.b];
};

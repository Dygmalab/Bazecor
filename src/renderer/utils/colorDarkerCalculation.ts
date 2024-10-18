import { parseColor, RgbColor } from "./parseColor";

/**
 * Darken the supplied color
 * @param {string} color A color in Hex or Rgb format
 * @param {RgbColor} fallback The color to use if the supplied color cannot be parsed
 * @returns {string} A darker version of the supplied color in rgb(#, #, #) format.
 */
export default function colorDarkerCalculation(color: string, fallback: RgbColor = { r: 0, g: 0, b: 0 }): string {
  const parsedColor = parseColor(color, fallback);
  return `rgb(${(parsedColor.r * 0.25).toFixed(0)}, ${(parsedColor.g * 0.5).toFixed(0)}, ${(parsedColor.b * 0.75).toFixed(0)})`;
}

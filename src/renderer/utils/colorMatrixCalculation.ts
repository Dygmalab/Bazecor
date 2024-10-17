import { parseColor, RgbColor } from "./parseColor";

/**
 * Darken the supplied color
 * @param {string} color A color in Hex or Rgb format
 * @param {number} opacity The opacity level of the color [0..1]
 * @param {RgbColor} fallback The color to use if the supplied color cannot be parsed
 * @returns {string} A matric version of the supplied color
 */
export default function colorMatrixCalc(color: string, opacity: number, fallback: RgbColor = { r: 0, g: 0, b: 0 }): string {
  const parsedColor = parseColor(color, fallback);
  return (
    `0 0 0 0 ${(parsedColor.r / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.g / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.b / 255).toFixed(2)} ` +
    `0 0 0 ${opacity} 0`
  );
}

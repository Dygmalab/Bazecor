import { parseColor, RgbColor } from "./parseColor";

// Converts a given color to the matrix representation
// Input:
//  color - string representation of a color either in hex or rgb
//  opacity - opacity level of the string [0..1]
//  fallback - a color to be used if the color string cannot be parsed
// Result:
//  A color in the matrix format
export default function colorMatrixCalc(color: string, opacity: number, fallback: RgbColor = { r: 0, g: 0, b: 0 }) {
  const parsedColor = parseColor(color, fallback);
  return (
    `0 0 0 0 ${(parsedColor.r / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.g / 255).toFixed(2)} ` +
    `0 0 0 0 ${(parsedColor.b / 255).toFixed(2)} ` +
    `0 0 0 ${opacity} 0`
  );
}

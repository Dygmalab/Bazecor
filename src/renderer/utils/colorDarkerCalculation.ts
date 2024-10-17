import { parseColor, RgbColor } from "./parseColor";

// Makes a color a little darker
// Input:
//  color - string representation of a color either in hex or rgb
//  fallback - a color to be used if the color string cannot be parsed
// Result:
//  A color in rgb(#, #, #) format that is darker
export default function colorDarkerCalculation(color: string, fallback: RgbColor = { r: 0, g: 0, b: 0 }): string {
  const parsedColor = parseColor(color, fallback);
  return `rgb(${(parsedColor.r * 0.25).toFixed(0)}, ${(parsedColor.g * 0.5).toFixed(0)}, ${(parsedColor.b * 0.75).toFixed(0)})`;
}

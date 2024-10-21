export interface RgbColor {
  r: number;
  g: number;
  b: number;
}

/**
 * Parse the supplied color to it's component R, G, B values.
 * @param {string} color A color in Hex or Rgb format
 * @param {RgbColor} fallback The color to use if the supplied color cannot be parsed.
 * @returns {RgbColor} The color converted to an object containing the three color values.
 */
export function parseColor(color: string, fallback: RgbColor): RgbColor {
  const hexRegex = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
  const rgbRegex = /^rgb\(([\d]+), ([\d]+), ([\d]+)\)$/i;

  function parseRgbColor(input: string, regex: RegExp, numberBase: number) {
    const result = regex.exec(input);
    return {
      r: parseInt(result[1], numberBase),
      g: parseInt(result[2], numberBase),
      b: parseInt(result[3], numberBase),
    };
  }

  let result: RgbColor;
  if (hexRegex.test(color)) {
    result = parseRgbColor(color, hexRegex, 16);
  } else if (rgbRegex.test(color)) {
    result = parseRgbColor(color, rgbRegex, 10);
  } else {
    // Supplied color could not be parsed
    return fallback;
  }

  if (result.r < 0 || result.r > 255 || result.g < 0 || result.g > 255 || result.b < 0 || result.b > 255) {
    // Some color values are out of bounds
    return fallback;
  }

  return result;
}

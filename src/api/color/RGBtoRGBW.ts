import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Converts an RGB color object to an RGBW color object.
 *
 * This function calculates the white (W) component by finding the minimum
 * value among the R, G, and B components. This minimum value represents
 * the amount of "whiteness" that can be extracted. The R, G, and B
 * components are then reduced by this minimum value to produce the final
 * RGBW color. Input color component values are first sanitized to be
 * within the 0-255 range.
 *
 * @param {RGB} color - The input RGB color object, with r, g, and b properties.
 * @returns {RGBW} The color converted to an RGBW object, with r, g, b, and w properties.
 *
 * @example
 * rgb2w({ r: 100, g: 150, b: 200 })
 * // returns { r: 0, g: 50, b: 100, w: 100 }
 *
 * rgb2w({ r: 255, g: 255, b: 255 })
 * // returns { r: 0, g: 0, b: 0, w: 255 }
 *
 * rgb2w({ r: 50, g: 0, b: 0 })
 * // returns { r: 50, g: 0, b: 0, w: 0 }
 */
export function rgb2w(color: RGB): RGBW {
  const sanitizedR = sanitizeIntensity(color.r);
  const sanitizedG = sanitizeIntensity(color.g);
  const sanitizedB = sanitizeIntensity(color.b);

  const minVal = Math.min(sanitizedR, Math.min(sanitizedG, sanitizedB));

  return {
    r: sanitizedR - minVal,
    b: sanitizedB - minVal,
    g: sanitizedG - minVal,
    w: minVal,
  };
}

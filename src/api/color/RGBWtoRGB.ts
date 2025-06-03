import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Converts an RGBW color object to an RGB color object.
 *
 * This function blends the white (W) component back into the R, G, and B
 * components. Each of the output R, G, and B values is calculated by
 * adding the input W value to the corresponding input R, G, or B value.
 * All input color components (r, g, b, w) are first sanitized to be
 * within the 0-255 range. The final R, G, and B values are also
 * sanitized to ensure they remain within the 0-255 range after the
 * white component is added.
 *
 * The function also returns a CSS `rgb()` string representation.
 *
 * @param {RGBW} color - The input RGBW color object, with r, g, b, and w properties.
 * @returns {RGB} The color converted to an RGB object. This object includes
 *                r, g, b numeric properties and an `rgb` string property
 *                (e.g., "rgb(255, 100, 50)").
 *
 * @example
 * rgbw2b({ r: 0, g: 50, b: 100, w: 100 })
 * // returns { r: 100, g: 150, b: 200, rgb: "rgb(100, 150, 200)" }
 *
 * rgbw2b({ r: 200, g: 200, b: 200, w: 100 }) // Output values will be capped at 255
 * // returns { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" }
 *
 * rgbw2b({ r: 10, g: 20, b: 30, w: 0 })
 * // returns { r: 10, g: 20, b: 30, rgb: "rgb(10, 20, 30)" }
 */
export function rgbw2b(color: RGBW): RGB {
  const sanitizedR = sanitizeIntensity(color.r);
  const sanitizedG = sanitizeIntensity(color.g);
  const sanitizedB = sanitizeIntensity(color.b);
  const sanitizedW = sanitizeIntensity(color.w);

  const r = sanitizeIntensity(sanitizedW + sanitizedR);
  const g = sanitizeIntensity(sanitizedW + sanitizedG);
  const b = sanitizeIntensity(sanitizedW + sanitizedB);

  return { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` };
}

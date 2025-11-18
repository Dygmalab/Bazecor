import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Converts an RGBW color object to an RGB color object.
 *
 * This is achieved by adding the white component (W) to each of the
 * R, G, and B channels. The resulting values are then sanitized to ensure
 * they are within the valid intensity range (0-255).
 *
 * @param {RGBW} color - An object representing the RGBW color with `r`, `g`, `b`, and `w` properties.
 * @returns {RGB} The resulting RGB color object with `r`, `g`, `b`, and a CSS `rgb` string property.
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

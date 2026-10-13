import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Converts an RGB color object to an RGBW color object.
 *
 * This is achieved by calculating the white component (W) as the minimum
 * intensity value among the R, G, and B channels. This white component is
 * then subtracted from each of the original channels to produce the new
 * R, G, and B values.
 *
 * @param {RGB} color - An object representing the RGB color with `r`, `g`, and `b` properties.
 * @returns {RGBW} The resulting RGBW color object with `r`, `g`, `b`, and `w` properties.
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

import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Convert a RGBW color to RGB
 * @param {RGBW} color - A RGBW color from the
 * @returns {RGB} - The color converted to RGB
 */
export function rgbw2b(color: RGBW): RGB {
  const sanitizedR = sanitizeIntensity(color.r);
  const sanitizedG = sanitizeIntensity(color.g);
  const sanitizedB = sanitizeIntensity(color.b);
  const sanitizedW = sanitizeIntensity(color.w);

  const r = sanitizeIntensity(sanitizedR + sanitizedW);
  const g = sanitizeIntensity(sanitizedG + sanitizedW);
  const b = sanitizeIntensity(sanitizedB + sanitizedW);

  return { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` };
}

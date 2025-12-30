import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Convert a RGBW color to RGB .
 * @param {RGBW} color - A RGBW color from the hardware (0-255 each channel)
 * @returns {RGB} - The color converted to RGB for UI display
 */
export function rgbw2b(color: RGBW): RGB {
  const rIn = sanitizeIntensity(color.r);
  const gIn = sanitizeIntensity(color.g);
  const bIn = sanitizeIntensity(color.b);
  const wIn = sanitizeIntensity(color.w);

  // Add white contribution back to each RGB channel
  const r = sanitizeIntensity(rIn + wIn);
  const g = sanitizeIntensity(gIn + wIn);
  const b = sanitizeIntensity(bIn + wIn);

  return { r, g, b, rgb: `rgb(${r}, ${g}, ${b})` };
}

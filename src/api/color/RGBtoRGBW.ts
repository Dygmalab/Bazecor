import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Base extraction factor - how much of the gray component goes to white LED. Scaled based on saturation.
 */
const BASE_WHITE_EXTRACTION = 0.5;

/**
 * For low-saturation colors (white, gray), we extract to the white LED.
 * This ensures pure white uses the white LED for clean, efficient white light.
 * Value of 1.0 means 100% extraction for maximum brightness and efficiency.
 * Examples:
 * - Pure white (#FFFFFF) with 1.0 factor will be translated to RGBW(0, 0, 0, 255)
 * - Pure white (#FFFFFF) with 0.95 factor will be translated to RGBW(13, 13, 13, 242)
 */
const WHITE_EXTRACTION_FOR_GRAYS = 0.95;

/**
 * Saturation threshold below which we treat the color as "gray/white" and use higher white extraction.
 */
const GRAY_SATURATION_THRESHOLD = 0.15;

/**
 * Convert an RGB color to RGBW.
 *
 * This algorithm extracts a portion of the common "gray" component
 * to the white LED. For gray/white colors, it uses mostly the white LED
 * to ensure clean white. For saturated colors, it preserves more color
 * in the RGB channels.
 *
 * @param {RGB} color - A RGB color
 * @returns {RGBW} - The color converted to RGBW
 */
export function rgb2w(color: RGB): RGBW {
  const sanitizedR = sanitizeIntensity(color.r);
  const sanitizedG = sanitizeIntensity(color.g);
  const sanitizedB = sanitizeIntensity(color.b);
  const minVal = Math.min(sanitizedR, sanitizedG, sanitizedB);
  const maxVal = Math.max(sanitizedR, sanitizedG, sanitizedB);

  const saturation = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;

  // Determine a white extraction factor based on saturation:
  // - Low saturation (gray/white): use high extraction (mostly white LED)
  // - High saturation (colors): use lower extraction (preserve RGB color)
  let extractionFactor: number;
  if (saturation <= GRAY_SATURATION_THRESHOLD) {
    extractionFactor = WHITE_EXTRACTION_FOR_GRAYS;
  } else {
    const saturationScale = 1 - (saturation - GRAY_SATURATION_THRESHOLD) / (1 - GRAY_SATURATION_THRESHOLD);
    extractionFactor = BASE_WHITE_EXTRACTION + (WHITE_EXTRACTION_FOR_GRAYS - BASE_WHITE_EXTRACTION) * saturationScale * 0.3;
  }

  const w = Math.round(minVal * extractionFactor);

  return {
    r: sanitizedR - w,
    g: sanitizedG - w,
    b: sanitizedB - w,
    w: w,
  };
}

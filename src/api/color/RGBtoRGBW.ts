import { sanitizeIntensity } from "./sanitizeIntensity";
import { RGB, RGBW } from "./types";

/**
 * Base extraction factor - how much of the gray component goes to white LED.
 * This is scaled based on saturation.
 */
const BASE_WHITE_EXTRACTION = 0.5;

/**
 * For low-saturation colors (white, gray), we extract to the white LED.
 * This ensures pure white uses the white LED for clean, efficient white light.
 * Value of 1.0 means 100% extraction for maximum brightness and efficiency.
 * Examples:
 * - Pure white (#FFFFFF) will be translated to RGBW(0, 0, 0, 255)
 * - Gray 50% (#808080) will be translated to RGBW(0, 0, 0, 128)
 */
const WHITE_EXTRACTION_FOR_GRAYS = 1.0;

/**
 * Saturation threshold below which we treat the color as "gray/white"
 * and use higher white extraction.
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
 * @param {RGB} color - A RGB color in sRGB space (0-255)
 * @returns {RGBW} - The color converted to RGBW for LED hardware
 */
export function rgb2w(color: RGB): RGBW {
  const r = sanitizeIntensity(color.r);
  const g = sanitizeIntensity(color.g);
  const b = sanitizeIntensity(color.b);
  const minVal = Math.min(r, g, b);
  const maxVal = Math.max(r, g, b);

  const saturation = maxVal > 0 ? (maxVal - minVal) / maxVal : 0;

  // Determine white extraction factor based on saturation:
  // - Low saturation (gray/white): use high extraction (mostly white LED)
  // - High saturation (colors): use lower extraction (preserve RGB color)
  let extractionFactor: number;
  if (saturation <= GRAY_SATURATION_THRESHOLD) {
    // Gray/white colors - use mostly white LED for clean appearance
    extractionFactor = WHITE_EXTRACTION_FOR_GRAYS;
  } else {
    // Colored light - scale extraction based on saturation
    // More saturated = less white extraction
    const saturationScale = 1 - (saturation - GRAY_SATURATION_THRESHOLD) / (1 - GRAY_SATURATION_THRESHOLD);
    extractionFactor = BASE_WHITE_EXTRACTION + (WHITE_EXTRACTION_FOR_GRAYS - BASE_WHITE_EXTRACTION) * saturationScale * 0.3;
  }

  const w = Math.round(minVal * extractionFactor);
  return {
    r: r - w,
    g: g - w,
    b: b - w,
    w: w,
  };
}

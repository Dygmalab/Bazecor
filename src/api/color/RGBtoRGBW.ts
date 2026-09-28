import { rgbwProfiles } from "./profiles";
import type { RGBWConversionProfile } from "./profiles";
import { sanitizeIntensity } from "./sanitizeIntensity";
import type { RGB, RGBW } from "./types";

/**
 * Convert an RGB color to RGBW.
 *
 * This algorithm extracts a portion of the common "gray" component
 * to the white LED. For gray/white colors, it uses mostly the white LED
 * to ensure clean white. For saturated colors, it preserves more color
 * in the RGB channels.
 *
 * @param {RGB} color - A RGB color
 * @param {RGBWConversionProfile} profile - White extraction settings
 * @returns {RGBW} - The color converted to RGBW
 */
export function rgb2w(color: RGB, profile: RGBWConversionProfile = rgbwProfiles.efficient): RGBW {
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
  if (saturation <= profile.graySaturationThreshold) {
    extractionFactor = profile.whiteExtractionForGrays;
  } else {
    // Start at the gray extraction factor so crossing the threshold does not cause a jump.
    const saturationScale = 1 - (saturation - profile.graySaturationThreshold) / (1 - profile.graySaturationThreshold);
    extractionFactor =
      profile.baseWhiteExtraction + (profile.whiteExtractionForGrays - profile.baseWhiteExtraction) * saturationScale;
  }

  const w = Math.round(minVal * extractionFactor);

  return {
    r: sanitizedR - w,
    g: sanitizedG - w,
    b: sanitizedB - w,
    w,
  };
}

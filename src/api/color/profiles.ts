export interface RGBWConversionProfile {
  readonly baseWhiteExtraction: number;
  readonly whiteExtractionForGrays: number;
  readonly graySaturationThreshold: number;
}

/**
 * Supported profiles contain finite values where
 * 0 <= baseWhiteExtraction <= whiteExtractionForGrays <= 1 and
 * 0 <= graySaturationThreshold < 1.
 */
const efficient: RGBWConversionProfile = Object.freeze({
  baseWhiteExtraction: 1,
  whiteExtractionForGrays: 1,
  graySaturationThreshold: 0.15,
});

const balanced: RGBWConversionProfile = Object.freeze({
  baseWhiteExtraction: 0.6,
  whiteExtractionForGrays: 1,
  graySaturationThreshold: 0.18,
});

const vivid: RGBWConversionProfile = Object.freeze({
  baseWhiteExtraction: 0.5,
  whiteExtractionForGrays: 0.95,
  graySaturationThreshold: 0.15,
});

export const rgbwProfiles = Object.freeze({ efficient, balanced, vivid });
export type RGBWProfileId = keyof typeof rgbwProfiles;

export const defaultRgbwProfileId: RGBWProfileId = "efficient";

export type RGBWProfileResolution = Readonly<{
  id: RGBWProfileId;
  status: "known" | "missing" | "invalid";
}>;

export const resolveRgbwProfileId = (value: unknown): RGBWProfileResolution => {
  if (value === undefined || value === null) return { id: defaultRgbwProfileId, status: "missing" };
  if (typeof value === "string" && Object.prototype.hasOwnProperty.call(rgbwProfiles, value)) {
    return { id: value as RGBWProfileId, status: "known" };
  }
  return { id: defaultRgbwProfileId, status: "invalid" };
};

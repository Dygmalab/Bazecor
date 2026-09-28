import { describe, expect, test } from "vitest";
import {
  defaultRgbwProfileId as exportedDefaultRgbwProfileId,
  resolveRgbwProfileId as exportedResolveRgbwProfileId,
  rgbwProfiles as exportedRgbwProfiles,
} from "./index";
import { defaultRgbwProfileId, resolveRgbwProfileId, rgbwProfiles } from "./profiles";
import type { RGBWConversionProfile, RGBWProfileId } from "./index";

describe("rgbwProfiles", () => {
  test("contains the three frozen production profiles", () => {
    expect(Object.keys(rgbwProfiles)).toEqual(["efficient", "balanced", "vivid"]);
    expect(rgbwProfiles.efficient).toEqual({
      baseWhiteExtraction: 1,
      whiteExtractionForGrays: 1,
      graySaturationThreshold: 0.15,
    });
    expect(rgbwProfiles.balanced).toEqual({
      baseWhiteExtraction: 0.6,
      whiteExtractionForGrays: 1,
      graySaturationThreshold: 0.18,
    });
    expect(rgbwProfiles.vivid).toEqual({
      baseWhiteExtraction: 0.5,
      whiteExtractionForGrays: 0.95,
      graySaturationThreshold: 0.15,
    });
    expect(Object.isFrozen(rgbwProfiles)).toBe(true);
    for (const profile of Object.values(rgbwProfiles)) expect(Object.isFrozen(profile)).toBe(true);
  });

  test("is exported by the color API", () => {
    const exportedProfile: RGBWConversionProfile = exportedRgbwProfiles.efficient;
    const profileId: RGBWProfileId = exportedDefaultRgbwProfileId;

    expect(exportedProfile).toBe(rgbwProfiles.efficient);
    expect(profileId).toBe("efficient");
    expect(exportedResolveRgbwProfileId("vivid")).toEqual({ id: "vivid", status: "known" });
  });

  test("keeps every production profile in the supported domain", () => {
    for (const profile of Object.values(rgbwProfiles)) {
      expect(Number.isFinite(profile.baseWhiteExtraction)).toBe(true);
      expect(Number.isFinite(profile.whiteExtractionForGrays)).toBe(true);
      expect(Number.isFinite(profile.graySaturationThreshold)).toBe(true);
      expect(profile.baseWhiteExtraction).toBeGreaterThanOrEqual(0);
      expect(profile.baseWhiteExtraction).toBeLessThanOrEqual(profile.whiteExtractionForGrays);
      expect(profile.whiteExtractionForGrays).toBeLessThanOrEqual(1);
      expect(profile.graySaturationThreshold).toBeGreaterThanOrEqual(0);
      expect(profile.graySaturationThreshold).toBeLessThan(1);
    }
  });

  test.each(["efficient", "balanced", "vivid"] as const)("resolves the known %s profile", id => {
    expect(resolveRgbwProfileId(id)).toEqual({ id, status: "known" });
  });

  test.each([undefined, null])("falls back missing values to Efficient", value => {
    expect(resolveRgbwProfileId(value)).toEqual({ id: "efficient", status: "missing" });
  });

  test.each(["", "future", 1, {}, [], "constructor", "__proto__"])("rejects invalid profile identity %#", value => {
    expect(resolveRgbwProfileId(value)).toEqual({ id: "efficient", status: "invalid" });
  });

  test("uses Efficient as the declared default", () => {
    expect(defaultRgbwProfileId).toBe("efficient");
  });
});

import { expect, test, describe } from "vitest";
import { rgb2w } from "./RGBtoRGBW";
import { rgbw2b } from "./RGBWtoRGB";
import { rgbwProfiles } from "./profiles";
import type { RGBWConversionProfile } from "./profiles";

const zeroExtractionProfile: RGBWConversionProfile = Object.freeze({
  baseWhiteExtraction: 0,
  whiteExtractionForGrays: 0,
  graySaturationThreshold: 0.15,
});

const fullExtractionProfile: RGBWConversionProfile = Object.freeze({
  baseWhiteExtraction: 1,
  whiteExtractionForGrays: 1,
  graySaturationThreshold: 0.15,
});

describe("rgb2w", () => {
  test.each([
    { input: { r: 0, g: 0, b: 0 }, expected: { r: 0, g: 0, b: 0, w: 0 } },
    { input: { r: 255, g: 255, b: 255 }, expected: { r: 13, g: 13, b: 13, w: 242 } },
    { input: { r: 128, g: 128, b: 128 }, expected: { r: 6, g: 6, b: 6, w: 122 } },
    { input: { r: 255, g: 0, b: 0 }, expected: { r: 255, g: 0, b: 0, w: 0 } },
    { input: { r: 0, g: 255, b: 0 }, expected: { r: 0, g: 255, b: 0, w: 0 } },
    { input: { r: 0, g: 0, b: 255 }, expected: { r: 0, g: 0, b: 255, w: 0 } },
    { input: { r: 186, g: 0, b: 255 }, expected: { r: 186, g: 0, b: 255, w: 0 } },
    { input: { r: 255, g: 128, b: 0 }, expected: { r: 255, g: 128, b: 0, w: 0 } },
    { input: { r: 180, g: 0, b: 0 }, expected: { r: 180, g: 0, b: 0, w: 0 } },
    { input: { r: 153, g: 255, b: 204 }, expected: { r: 28, g: 130, b: 79, w: 125 } },
    { input: { r: 255, g: 204, b: 204 }, expected: { r: 67, g: 16, b: 16, w: 188 } },
    { input: { r: 100, g: 200, b: 250 }, expected: { r: 29, g: 129, b: 179, w: 71 } },
    { input: { r: -100, g: 100, b: 200 }, expected: { r: 0, g: 100, b: 200, w: 0 } },
    { input: { r: 100, g: -100, b: 200 }, expected: { r: 100, g: 0, b: 200, w: 0 } },
    { input: { r: 100, g: 200, b: -100 }, expected: { r: 100, g: 200, b: 0, w: 0 } },
    { input: { r: 300, g: 300, b: 300 }, expected: { r: 13, g: 13, b: 13, w: 242 } },
    { input: { r: 300, g: 204, b: 204 }, expected: { r: 67, g: 16, b: 16, w: 188 } },
    { input: { r: 200, g: 171, b: 171 }, expected: { r: 38, g: 9, b: 9, w: 162 } },
    { input: { r: 200, g: 170, b: 170 }, expected: { r: 38, g: 8, b: 8, w: 162 } },
    { input: { r: 200, g: 169, b: 169 }, expected: { r: 40, g: 9, b: 9, w: 160 } },
    { input: { r: 255, g: 217, b: 217 }, expected: { r: 49, g: 11, b: 11, w: 206 } },
    { input: { r: 255, g: 216, b: 216 }, expected: { r: 50, g: 11, b: 11, w: 205 } },
  ])("rgb2w($input) = $expected", ({ input, expected }) => {
    expect(rgb2w(input, rgbwProfiles.vivid)).toEqual(expected);
  });

  test.each([
    { below: { r: 255, g: 217, b: 217 }, above: { r: 255, g: 216, b: 216 } },
    { below: { r: 217, g: 255, b: 217 }, above: { r: 216, g: 255, b: 216 } },
    { below: { r: 217, g: 217, b: 255 }, above: { r: 216, g: 216, b: 255 } },
  ])("keeps LED changes small across the gray threshold for $below", ({ below, above }) => {
    const belowThreshold = rgb2w(below, rgbwProfiles.vivid);
    const aboveThreshold = rgb2w(above, rgbwProfiles.vivid);

    for (const channel of ["r", "g", "b", "w"] as const) {
      expect(Math.abs(belowThreshold[channel] - aboveThreshold[channel])).toBeLessThanOrEqual(2);
    }
  });

  test("reconstructs all RGB channels across the color range", () => {
    const levels = [0, 1, 64, 128, 169, 170, 171, 216, 217, 254, 255];
    for (const r of levels) {
      for (const g of levels) {
        for (const b of levels) {
          expect(rgbw2b(rgb2w({ r, g, b }))).toEqual({ r, g, b, rgb: `rgb(${r}, ${g}, ${b})` });
        }
      }
    }
  });

  test("pure black returns all zeros", () => {
    expect(rgb2w({ r: 0, g: 0, b: 0 })).toEqual({ r: 0, g: 0, b: 0, w: 0 });
  });

  test("pure white uses mostly white LED for clean white", () => {
    const result = rgb2w({ r: 255, g: 255, b: 255 });

    // Should use mostly white LED (>90%)
    expect(result.w).toBeGreaterThan(230);

    // RGB should be minimal
    expect(result.r).toBeLessThan(25);
    expect(result.g).toBeLessThan(25);
    expect(result.b).toBeLessThan(25);

    // All RGB channels equal for white
    expect(result.r).toBe(result.g);
    expect(result.g).toBe(result.b);
  });

  test("gray uses mostly white LED", () => {
    const gray128 = rgb2w({ r: 128, g: 128, b: 128 });

    // Gray should use mostly white LED
    expect(gray128.w).toBeGreaterThan(100);

    // RGB should be minimal
    expect(gray128.r).toBeLessThan(20);

    // All RGB channels equal for gray
    expect(gray128.r).toBe(gray128.g);
    expect(gray128.g).toBe(gray128.b);
  });

  test("saturated colors have zero white", () => {
    // Pure red - fully saturated, should have no white (min=0)
    const pureRed = rgb2w({ r: 255, g: 0, b: 0 });
    expect(pureRed.w).toBe(0);
    expect(pureRed.r).toBe(255);
    expect(pureRed.g).toBe(0);
    expect(pureRed.b).toBe(0);

    // Pure green
    const pureGreen = rgb2w({ r: 0, g: 255, b: 0 });
    expect(pureGreen.w).toBe(0);
    expect(pureGreen.g).toBe(255);

    // Pure blue
    const pureBlue = rgb2w({ r: 0, g: 0, b: 255 });
    expect(pureBlue.w).toBe(0);
    expect(pureBlue.b).toBe(255);

    // BA00FF - saturated purple, should have no white (min=0)
    const purple = rgb2w({ r: 186, g: 0, b: 255 });
    expect(purple.w).toBe(0);
    expect(purple.r).toBe(186);
    expect(purple.g).toBe(0);
    expect(purple.b).toBe(255);
  });

  test("mint green preserves color with moderate white", () => {
    // #99FFCC = rgb(153, 255, 204) - a mint green (40% saturation)
    const mint = rgb2w({ r: 153, g: 255, b: 204 }, rgbwProfiles.vivid);

    // Should have moderate white
    expect(mint.w).toBeGreaterThan(50);
    expect(mint.w).toBeLessThan(153);

    // Green should remain dominant
    expect(mint.g).toBeGreaterThan(mint.r);
    expect(mint.g).toBeGreaterThan(mint.b);

    // Roundtrip should work: r + w = original r
    expect(mint.r + mint.w).toBe(153);
    expect(mint.g + mint.w).toBe(255);
    expect(mint.b + mint.w).toBe(204);
  });

  test("orange and red remain distinguishable", () => {
    const red = rgb2w({ r: 255, g: 0, b: 0 });
    const orange = rgb2w({ r: 255, g: 128, b: 0 });
    const deepRed = rgb2w({ r: 180, g: 0, b: 0 });

    // All saturated, no white
    expect(red.w).toBe(0);
    expect(orange.w).toBe(0);
    expect(deepRed.w).toBe(0);

    // Orange has green component
    expect(orange.g).toBe(128);
    expect(red.g).toBe(0);
  });

  test("light pink has some white but keeps pink tint", () => {
    const lightPink = rgb2w({ r: 255, g: 204, b: 204 }, rgbwProfiles.vivid);
    // Should have moderate white
    expect(lightPink.w).toBeGreaterThan(80);
    // Red should be higher than green/blue
    expect(lightPink.r).toBeGreaterThan(lightPink.g);
    expect(lightPink.g).toBe(lightPink.b);
  });

  test("negative input values are sanitized to 0", () => {
    const result = rgb2w({ r: -100, g: 100, b: 200 });
    expect(result.r).toBeGreaterThanOrEqual(0);
    expect(result.g).toBeGreaterThanOrEqual(0);
    expect(result.b).toBeGreaterThanOrEqual(0);
    expect(result.w).toBeGreaterThanOrEqual(0);
  });

  test("values over 255 are sanitized", () => {
    const result = rgb2w({ r: 300, g: 300, b: 300 });
    expect(result.r).toBeLessThanOrEqual(255);
    expect(result.g).toBeLessThanOrEqual(255);
    expect(result.b).toBeLessThanOrEqual(255);
    expect(result.w).toBeLessThanOrEqual(255);
  });

  test("the omitted profile matches explicit Efficient conversion across a grid", () => {
    const levels = [0, 64, 128, 216, 255];
    const gridInputs = levels.flatMap(r => levels.flatMap(g => levels.map(b => ({ r, g, b }))));

    for (const input of gridInputs) {
      const implicit = rgb2w(input);
      const explicit = rgb2w(input, rgbwProfiles.efficient);

      expect(explicit).toEqual(implicit);
    }
  });

  test.each([
    {
      profile: zeroExtractionProfile,
      mint: { r: 153, g: 255, b: 204, w: 0 },
      white: { r: 255, g: 255, b: 255, w: 0 },
    },
    {
      profile: fullExtractionProfile,
      mint: { r: 0, g: 102, b: 51, w: 153 },
      white: { r: 0, g: 0, b: 0, w: 255 },
    },
  ])("uses a synthetic extraction profile", ({ profile, mint, white }) => {
    expect(rgb2w({ r: 153, g: 255, b: 204 }, profile)).toEqual(mint);
    expect(rgb2w({ r: 255, g: 255, b: 255 }, profile)).toEqual(white);
  });

  test("uses base and gray extraction independently", () => {
    const profile: RGBWConversionProfile = {
      baseWhiteExtraction: 0,
      whiteExtractionForGrays: 0.95,
      graySaturationThreshold: 0.15,
    };

    expect(rgb2w({ r: 153, g: 255, b: 204 }, profile)).toEqual({ r: 50, g: 152, b: 101, w: 103 });
  });

  test("uses the profile saturation threshold", () => {
    const profile: RGBWConversionProfile = {
      baseWhiteExtraction: 0.5,
      whiteExtractionForGrays: 0.95,
      graySaturationThreshold: 0.5,
    };
    const input = { r: 200, g: 120, b: 120 };

    expect(rgb2w(input, rgbwProfiles.vivid)).toEqual({ r: 102, g: 22, b: 22, w: 98 });
    expect(rgb2w(input, profile)).toEqual({ r: 86, g: 6, b: 6, w: 114 });
  });

  test("profile calls are order-independent and do not mutate caller inputs", () => {
    const input = Object.freeze({ r: 153, g: 255, b: 204 });
    const zeroBefore = { ...zeroExtractionProfile };
    const fullBefore = { ...fullExtractionProfile };

    expect(rgb2w(input, zeroExtractionProfile)).toEqual({ r: 153, g: 255, b: 204, w: 0 });
    expect(rgb2w(input, rgbwProfiles.vivid)).toEqual({ r: 28, g: 130, b: 79, w: 125 });
    expect(rgb2w(input, fullExtractionProfile)).toEqual({ r: 0, g: 102, b: 51, w: 153 });
    expect(rgb2w(input, rgbwProfiles.vivid)).toEqual({ r: 28, g: 130, b: 79, w: 125 });
    expect(zeroExtractionProfile).toEqual(zeroBefore);
    expect(fullExtractionProfile).toEqual(fullBefore);
    expect(input).toEqual({ r: 153, g: 255, b: 204 });
  });

  test.each([zeroExtractionProfile, fullExtractionProfile])(
    "keeps explicit-profile outputs integral, in range, and reversible",
    profile => {
      const levels = [0, 1, 64, 128, 254, 255];
      for (const r of levels) {
        for (const g of levels) {
          for (const b of levels) {
            const output = rgb2w({ r, g, b }, profile);
            for (const channel of Object.values(output)) {
              expect(Number.isInteger(channel)).toBe(true);
              expect(channel).toBeGreaterThanOrEqual(0);
              expect(channel).toBeLessThanOrEqual(255);
            }
            expect(rgbw2b(output)).toEqual({ r, g, b, rgb: `rgb(${r}, ${g}, ${b})` });
          }
        }
      }
    },
  );

  test.each([
    { input: { r: 255, g: 255, b: 255 }, efficient: [0, 0, 0, 255], balanced: [0, 0, 0, 255], vivid: [13, 13, 13, 242] },
    { input: { r: 128, g: 128, b: 128 }, efficient: [0, 0, 0, 128], balanced: [0, 0, 0, 128], vivid: [6, 6, 6, 122] },
    { input: { r: 153, g: 255, b: 204 }, efficient: [0, 102, 51, 153], balanced: [16, 118, 67, 137], vivid: [28, 130, 79, 125] },
    { input: { r: 255, g: 204, b: 229 }, efficient: [51, 0, 25, 204], balanced: [53, 2, 27, 202], vivid: [67, 16, 41, 188] },
    { input: { r: 200, g: 120, b: 120 }, efficient: [80, 0, 0, 120], balanced: [93, 13, 13, 107], vivid: [102, 22, 22, 98] },
  ])("uses the exact production profile outputs for $input", ({ input, efficient, balanced, vivid }) => {
    const asTuple = (profile: RGBWConversionProfile) => {
      const result = rgb2w(input, profile);
      return [result.r, result.g, result.b, result.w];
    };
    expect(asTuple(rgbwProfiles.efficient)).toEqual(efficient);
    expect(asTuple(rgbwProfiles.balanced)).toEqual(balanced);
    expect(asTuple(rgbwProfiles.vivid)).toEqual(vivid);
  });
});

import { expect, test, describe } from "vitest";
import { rgb2w } from "./RGBtoRGBW";

describe("rgb2w", () => {
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
    const mint = rgb2w({ r: 153, g: 255, b: 204 });

    // Should have moderate white
    expect(mint.w).toBeGreaterThan(50);
    expect(mint.w).toBeLessThan(120);

    // Green should remain dominant
    expect(mint.g).toBeGreaterThan(mint.r);
    expect(mint.g).toBeGreaterThan(mint.b);

    // Roundtrip should work: r + w = original r
    expect(mint.r + mint.w).toBe(153);
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
    const lightPink = rgb2w({ r: 255, g: 204, b: 204 });
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
});

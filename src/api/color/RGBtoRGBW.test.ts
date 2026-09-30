import { describe, it, expect } from "vitest";
import { rgb2w } from "./RGBtoRGBW";

describe("rgb2w", () => {
  it.each([
    {
      description: "should convert a standard RGB color to RGBW",
      input: { r: 100, g: 150, b: 200 },
      expected: { r: 0, g: 50, b: 100, w: 100 },
    },
    {
      description: "should handle a color with a zero component",
      input: { r: 0, g: 100, b: 200 },
      expected: { r: 0, g: 100, b: 200, w: 0 },
    },
    {
      description: "should convert a grayscale color correctly",
      input: { r: 120, g: 120, b: 120 },
      expected: { r: 0, g: 0, b: 0, w: 120 },
    },
    {
      description: "should handle pure white",
      input: { r: 255, g: 255, b: 255 },
      expected: { r: 0, g: 0, b: 0, w: 255 },
    },
    {
      description: "should handle pure black",
      input: { r: 0, g: 0, b: 0 },
      expected: { r: 0, g: 0, b: 0, w: 0 },
    },
    {
      description: "should sanitize negative values to 0 before converting",
      input: { r: -10, g: 50, b: 100 },
      expected: { r: 0, g: 50, b: 100, w: 0 },
    },
    {
      description: "should sanitize values greater than 255 to 255 before converting",
      input: { r: 300, g: 100, b: 150 },
      expected: { r: 155, g: 0, b: 50, w: 100 },
    },
    {
      description: "should handle a mix of out-of-range values",
      input: { r: -50, g: 300, b: 125 },
      expected: { r: 0, g: 255, b: 125, w: 0 },
    },
  ])("$description", ({ input, expected }) => {
    expect(rgb2w(input)).toEqual(expected);
  });
});

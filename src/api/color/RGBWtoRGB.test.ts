import { describe, it, expect } from "vitest";
import { rgbw2b } from "./RGBWtoRGB";

describe("rgbw2b", () => {
  it.each([
    {
      description: "should convert a standard RGBW color to RGB",
      input: { r: 10, g: 20, b: 30, w: 40 },
      expected: { r: 50, g: 60, b: 70, rgb: "rgb(50, 60, 70)" },
    },
    {
      description: "should handle a white component of zero",
      input: { r: 50, g: 100, b: 150, w: 0 },
      expected: { r: 50, g: 100, b: 150, rgb: "rgb(50, 100, 150)" },
    },
    {
      description: "should correctly convert a grayscale color from RGBW",
      input: { r: 0, g: 0, b: 0, w: 120 },
      expected: { r: 120, g: 120, b: 120, rgb: "rgb(120, 120, 120)" },
    },
    {
      description: "should handle pure white from an RGBW input",
      input: { r: 0, g: 0, b: 0, w: 255 },
      expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" },
    },
    {
      description: "should handle pure black",
      input: { r: 0, g: 0, b: 0, w: 0 },
      expected: { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)" },
    },
    {
      description: "should sanitize negative values to 0 before converting",
      input: { r: -10, g: 20, b: -30, w: 40 },
      expected: { r: 40, g: 60, b: 40, rgb: "rgb(40, 60, 40)" },
    },
    {
      description: "should sanitize values greater than 255 to 255 before converting",
      input: { r: 300, g: 20, b: 30, w: 400 },
      expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" },
    },
    {
      description: "should cap the final RGB values at 255",
      input: { r: 100, g: 20, b: 30, w: 200 },
      expected: { r: 255, g: 220, b: 230, rgb: "rgb(255, 220, 230)" },
    },
  ])("$description", ({ input, expected }) => {
    expect(rgbw2b(input)).toEqual(expected);
  });
});

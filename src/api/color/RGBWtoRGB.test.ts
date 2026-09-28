import { describe, expect, test } from "vitest";
import { rgbw2b } from "./RGBWtoRGB";

describe("rgbw2b", () => {
  test.each([
    {
      name: "returns black for all zeroes",
      input: { r: 0, g: 0, b: 0, w: 0 },
      expected: { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)" },
    },
    {
      name: "adds white to every RGB channel",
      input: { r: 10, g: 20, b: 30, w: 40 },
      expected: { r: 50, g: 60, b: 70, rgb: "rgb(50, 60, 70)" },
    },
    {
      name: "sanitizes negative white to zero",
      input: { r: 10, g: 20, b: 30, w: -40 },
      expected: { r: 10, g: 20, b: 30, rgb: "rgb(10, 20, 30)" },
    },
    {
      name: "clips every channel at 255",
      input: { r: 200, g: 200, b: 200, w: 100 },
      expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" },
    },
    {
      name: "clips an oversized white channel",
      input: { r: 10, g: 20, b: 30, w: 1000 },
      expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" },
    },
    {
      name: "clips only channels that exceed 255",
      input: { r: 100, g: 20, b: 30, w: 200 },
      expected: { r: 255, g: 220, b: 230, rgb: "rgb(255, 220, 230)" },
    },
    {
      name: "passes red through when white is zero",
      input: { r: 255, g: 0, b: 0, w: 0 },
      expected: { r: 255, g: 0, b: 0, rgb: "rgb(255, 0, 0)" },
    },
    {
      name: "passes green through when white is zero",
      input: { r: 0, g: 255, b: 0, w: 0 },
      expected: { r: 0, g: 255, b: 0, rgb: "rgb(0, 255, 0)" },
    },
    {
      name: "passes blue through when white is zero",
      input: { r: 0, g: 0, b: 255, w: 0 },
      expected: { r: 0, g: 0, b: 255, rgb: "rgb(0, 0, 255)" },
    },
    {
      name: "formats the converted channels as an RGB string",
      input: { r: 100, g: 50, b: 25, w: 10 },
      expected: { r: 110, g: 60, b: 35, rgb: "rgb(110, 60, 35)" },
    },
  ])("$name", ({ input, expected }) => {
    expect(rgbw2b(input)).toEqual(expected);
  });
});

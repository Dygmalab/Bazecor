import { expect, test } from "vitest";
import { rgbw2b } from "./RGBWtoRGB";

test.each([
  { input: { r: 10, g: 20, b: 30, w: 40 }, expected: { r: 50, g: 60, b: 70, rgb: "rgb(50, 60, 70)" } },
  { input: { r: 10, g: 20, b: 30, w: -40 }, expected: { r: 10, g: 20, b: 30, rgb: "rgb(10, 20, 30)" } }, // W sanitized to 0
  { input: { r: 10, g: 20, b: 30, w: 1000 }, expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" } }, // W sanitized to 255, then added
  { input: { r: 100, g: 20, b: 30, w: 200 }, expected: { r: 255, g: 220, b: 230, rgb: "rgb(255, 220, 230)" } }, // R hits 255 cap
  { input: { r: 0, g: 0, b: 0, w: 0 }, expected: { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)" } },
  { input: { r: 50, g: 100, b: 150, w: 0 }, expected: { r: 50, g: 100, b: 150, rgb: "rgb(50, 100, 150)" } },
  { input: { r: 255, g: 255, b: 255, w: 50 }, expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" } },
  { input: { r: -10, g: 20, b: 30, w: 40 }, expected: { r: 40, g: 60, b: 70, rgb: "rgb(40, 60, 70)" } },
  { input: { r: 10, g: 300, b: 30, w: 40 }, expected: { r: 50, g: 255, b: 70, rgb: "rgb(50, 255, 70)" } },
  { input: { r: 10.5, g: 20.2, b: 30.8, w: 40.3 }, expected: { r: 50, g: 60, b: 70, rgb: "rgb(50, 60, 70)" } },
  { input: { r: 200.1, g: 210.9, b: 180.5, w: 80.6 }, expected: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" } },
  { input: { r: 100.6, g: 50.2, b: 120.9, w: 20 }, expected: { r: 120, g: 70, b: 140, rgb: "rgb(120, 70, 140)" } },
  { input: { r: 10, g: 20, b: 30, w: 40.7 }, expected: { r: 50, g: 60, b: 70, rgb: "rgb(50, 60, 70)" } },
])("rgbw2b($input) = $expected", ({ input, expected }) => {
  expect(rgbw2b(input)).toEqual(expected);
});

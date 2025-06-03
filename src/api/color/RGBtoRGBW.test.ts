import { expect, test } from "vitest";
import { rgb2w } from "./RGBtoRGBW";

test.each([
  { input: { r: 0, g: 0, b: 0 }, expected: { r: 0, g: 0, b: 0, w: 0 } },
  { input: { r: 100, g: 200, b: 250 }, expected: { r: 0, g: 100, b: 150, w: 100 } },
  { input: { r: -100, g: 100, b: 200 }, expected: { r: 0, g: 100, b: 200, w: 0 } },
  { input: { r: 300, g: 150, b: 50 }, expected: { r: 205, g: 100, b: 0, w: 50 } },
  { input: { r: 10, g: 300, b: 50 }, expected: { r: 0, g: 245, b: 40, w: 10 } },
  { input: { r: 10, g: 50, b: 300 }, expected: { r: 0, g: 40, b: 245, w: 10 } },
  { input: { r: 255, g: 255, b: 255 }, expected: { r: 0, g: 0, b: 0, w: 255 } },
  { input: { r: 0, g: 100, b: 200 }, expected: { r: 0, g: 100, b: 200, w: 0 } },
  { input: { r: 50.5, g: 100.2, b: 150.7 }, expected: { r: 0, g: 50, b: 100, w: 50 } },
  { input: { r: 200.1, g: 150.9, b: 100.3 }, expected: { r: 100, g: 50, b: 0, w: 100 } },
  { input: { r: 75.6, g: 75.6, b: 75.6 }, expected: { r: 0, g: 0, b: 0, w: 75 } },
  { input: { r: 120.0, g: 60.5, b: 180.9 }, expected: { r: 60, g: 0, b: 120, w: 60 } },
])("rgb2w($input) should return $expected", ({ input, expected }) => {
  expect(rgb2w(input)).toEqual(expected);
});

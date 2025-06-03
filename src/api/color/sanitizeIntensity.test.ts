import { expect, test } from "vitest";
import { sanitizeIntensity } from "./sanitizeIntensity";

test.each([
  { input: -100, expected: 0 },
  { input: 0, expected: 0 },
  { input: 100, expected: 100 },
  { input: 255, expected: 255 },
  { input: 1000, expected: 255 },
  { input: -10.5, expected: 0 },
  { input: 0.0, expected: 0 },
  { input: 127.5, expected: 127 },
  { input: 255.0, expected: 255 },
  { input: 280.8, expected: 255 },
  { input: NaN, expected: 0 },
  { input: Infinity, expected: 255 },
  { input: -Infinity, expected: 0 },
  { input: Number.MIN_VALUE, expected: 0 },
  { input: Number.MAX_VALUE, expected: 255 },
])("sanitizeIntensity($input) = $expected", ({ input, expected }) => {
  expect(sanitizeIntensity(input)).toEqual(expected);
});

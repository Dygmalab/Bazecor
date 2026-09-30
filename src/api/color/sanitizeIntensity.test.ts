import { describe, it, expect } from "vitest";
import { sanitizeIntensity } from "./sanitizeIntensity";

describe("sanitizeIntensity", () => {
  it.each([
    {
      description: "should return 0 for a negative value",
      value: -100,
      expected: 0,
    },
    {
      description: "should return 0 for zero",
      value: 0,
      expected: 0,
    },
    {
      description: "should return the value itself if it is within the [0, 255] range",
      value: 128,
      expected: 128,
    },
    {
      description: "should return 255 for 255",
      value: 255,
      expected: 255,
    },
    {
      description: "should return 255 for a value greater than 255",
      value: 1000,
      expected: 255,
    },
    {
      description: "GAP: should handle floating point numbers by clamping them",
      value: 150.7,
      expected: 150.7, // should be 150 or 151, if rounding is desired
    },
    {
      description: "should handle floating point numbers outside the range",
      value: 300.5,
      expected: 255,
    },
    {
      description: "should handle negative floating point numbers",
      value: -0.5,
      expected: 0,
    },
  ])("$description", ({ value, expected }) => {
    expect(sanitizeIntensity(value)).toBe(expected);
  });
});

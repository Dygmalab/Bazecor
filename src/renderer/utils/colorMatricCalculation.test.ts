import { expect, test } from "vitest";
import colorMatrixCalc from "./colorMatrixCalculation";

test.each([
  { color: "#aABbcC", opacity: 1, expected: "0 0 0 0 0.67 0 0 0 0 0.73 0 0 0 0 0.80 0 0 0 1 0" },
  { color: "aABbcC", opacity: 1, expected: "0 0 0 0 0.67 0 0 0 0 0.73 0 0 0 0 0.80 0 0 0 1 0" },
  { color: "rGb(170, 187, 204)", opacity: 1, expected: "0 0 0 0 0.67 0 0 0 0 0.73 0 0 0 0 0.80 0 0 0 1 0" },
  { color: "rGb(255, 255, 0)", opacity: 0.65, expected: "0 0 0 0 1.00 0 0 0 0 1.00 0 0 0 0 0.00 0 0 0 0.65 0" },
  { color: "qwerty", opacity: 0, expected: "0 0 0 0 0.00 0 0 0 0 0.00 0 0 0 0 0.00 0 0 0 0 0" },
])("colorMatrixCalc($color, $opacity) -> $expected", ({ color, opacity, expected }) => {
  expect(colorMatrixCalc(color, opacity)).toBe(expected);
});

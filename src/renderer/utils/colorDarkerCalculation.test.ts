import { expect, test } from "vitest";
import colorDarkerCalculation from "./colorDarkerCalculation";

test.each([
  { color: "#aABbcC", expected: "rgb(43, 94, 153)" },
  { color: "aABbcC", expected: "rgb(43, 94, 153)" },
  { color: "rGb(170, 187, 204)", expected: "rgb(43, 94, 153)" },
  { color: "rGb(255, 255, 0)", expected: "rgb(64, 128, 0)" },
  { color: "qwerty", expected: "rgb(0, 0, 0)" },
])("colorDarkerCalculation($color) -> $expected", ({ color, expected }) => {
  expect(colorDarkerCalculation(color)).toBe(expected);
});

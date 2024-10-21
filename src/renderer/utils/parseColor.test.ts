import { expect, test } from "vitest";
import { parseColor } from "./parseColor";

const fallback = { r: 1, g: 1, b: 1 };

test.each([
  { color: "#qqqqqq" },
  { color: "rGb(-1, 0, 0)" },
  { color: "rGb(0, -1, 0)" },
  { color: "rGb(0, 0, -1)" },
  { color: "rGb(256, 0, 0)" },
  { color: "rGb(0, 256, 0)" },
  { color: "rGb(0, 0, 256)" },
])("invalid input to parseColor($color) returns fallback", ({ color }) => {
  expect(parseColor(color, fallback)).toStrictEqual(fallback);
});

test.each([
  { color: "#aABbcC", expected: { r: 170, g: 187, b: 204 } },
  { color: "aABbcC", expected: { r: 170, g: 187, b: 204 } },
  { color: "rGb(170, 187, 204)", expected: { r: 170, g: 187, b: 204 } },
])("valid input to parseColor($color) returns color", ({ color, expected }) => {
  expect(parseColor(color, fallback)).toStrictEqual(expected);
});

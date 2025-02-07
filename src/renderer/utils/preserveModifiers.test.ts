import { expect, test } from "vitest";
import { preserveModifiers } from "./preserveModifiers";

test.each([
  { input: 0b1110_0000_1111_1111, expected: 0 },
  { input: 0b1110_0001_1111_1111, expected: 0b0000_0001_0000_0000 },
  { input: 0b1110_0010_1111_1111, expected: 0b0000_0010_0000_0000 },
  { input: 0b1110_0100_1111_1111, expected: 0b0000_0100_0000_0000 },
  { input: 0b1110_1000_1111_1111, expected: 0b0000_1000_0000_0000 },
  { input: 0b1111_0000_1111_1111, expected: 0b0001_0000_0000_0000 },
])("$input -> $expected", ({ input, expected }) => {
  expect(preserveModifiers(input)).toStrictEqual(expected);
});

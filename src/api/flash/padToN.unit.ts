import { expect, it } from "vitest";
import { padToN } from "./padToN";

it("pads number to N digit string", () => {
  expect(padToN("1", 8)).toEqual("00000001");
});

it("does not add additional digits if number already has N", () => {
  expect(padToN("1234", 4)).toEqual("1234");
});

// Behavior does not match function name.
// Suggest fixing this.ts
it("trims to N digit string", () => {
  expect(padToN("1234", 3)).toEqual("234");
});

it("number to pad is optional", () => {
  expect(padToN("123")).toEqual("123");
});

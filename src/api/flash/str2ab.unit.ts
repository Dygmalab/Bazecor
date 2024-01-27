import { expect, it } from "vitest";
import { str2ab } from "./str2ab";

it("converts input string to an ArrayBuffer", () => {
  const r = str2ab("");
  expect(r).instanceOf(ArrayBuffer);
});

it("returns an empty array buffer when the input string is empty", () => {
  const r = str2ab("");
  expect(r.byteLength).toBe(0);
});

it("converts ASCII to byte array", () => {
  const r = str2ab("ABC");
  expect(r.byteLength).toBe(3);
  const dec = new TextDecoder();
  expect(dec.decode(r)).toEqual("ABC");
});

// TODO: this is the current behavior, not sure if this causes any limitations.ts
it("trims unicode to 2 bytes", () => {
  const r = str2ab("あ");
  const dec = new TextDecoder();
  expect(dec.decode(r)).not.toEqual("あ");
});

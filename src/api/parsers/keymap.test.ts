import { expect, describe, it } from "vitest";
import { parseKeymapRaw, serializeKeymap } from "./keymap";

describe("parseKeymapRaw", () => {
  it("should handle an empty string", () => {
    expect(parseKeymapRaw("", 2)).toEqual([]);
  });

  it("should handle 3 whitespace characters", () => {
    expect(parseKeymapRaw("  ", 2)).toEqual([]);
  });

  it("GAP: places NaN into result if given non-decimal numbers", () => {
    expect(parseKeymapRaw("9 F", 2)).toEqual([[9, NaN]]);
  });

  it("GAP: does not produce an array of the correct length if not enough numbers ", () => {
    expect(parseKeymapRaw("9", 2)).toEqual([[9]]);
  });

  it("should split into multiple groups", () => {
    expect(parseKeymapRaw("10 20 30 40", 2)).toEqual([
      [10, 20],
      [30, 40],
    ]);
  });

  it("GAP: allows negative numbers", () => {
    expect(parseKeymapRaw("-10 2", 2)).toEqual([[-10, 2]]);
  });

  it("GAP: allows numbers larger than the palette", () => {
    expect(parseKeymapRaw("400 10", 2)).toEqual([[400, 10]]);
  });

  it("should not care about extra whitespace", () => {
    expect(parseKeymapRaw("  10   20 30  40  ", 4)).toEqual([[10, 20, 30, 40]]);
  });
});

describe("serializeKeymap", () => {
  it("should serialize []", () => {
    expect(serializeKeymap([])).toEqual("");
  });

  it("should serialize [[],[]]", () => {
    expect(serializeKeymap([[], []])).toEqual("");
  });

  it("should serialize a numeric keymap with one key", () => {
    expect(serializeKeymap([[{ keyCode: 10, label: "test" }]])).toEqual("10");
  });

  it("should serialize a single nested keymap with 2 keys", () => {
    expect(
      serializeKeymap([
        [
          { keyCode: 10, label: "test" },
          { keyCode: 20, label: "test_2" },
        ],
      ]),
    ).toEqual("10 20");
  });

  it("should serialize two nested arrays with one key each", () => {
    expect(serializeKeymap([[{ keyCode: 10, label: "test" }], [{ keyCode: 20, label: "test_2" }]])).toEqual("10 20");
  });
});

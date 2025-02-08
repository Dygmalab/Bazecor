import { expect, describe, it } from "vitest";
import { parseColormapRaw } from "./colormap";

describe("parseColormapRaw", () => {
  it("should handle an empty string", () => {
    expect(parseColormapRaw("", 2)).toEqual([]);
  });

  it("should handle 3 whitespace characters", () => {
    expect(parseColormapRaw("  ", 2)).toEqual([]);
  });

  it("GAP: places NaN into result if given non-decimal numbers", () => {
    expect(parseColormapRaw("9 F", 2)).toEqual([
      [9, NaN],
    ]);
  });

  it("GAP: does not produce an array of the correct length if not enough numbers ", () => {
    expect(parseColormapRaw("9", 2)).toEqual([
      [9],
    ]);
  });

  it("should split into multiple groups", () => {
    expect(parseColormapRaw("10 20 30 40", 2)).toEqual([
      [10, 20],
      [30, 40],
    ]);
  });

  it("GAP: allows negative numbers", () => {
    expect(parseColormapRaw("-10 2", 2)).toEqual([
      [-10, 2],
    ]);
  });

  it("GAP: allows numbers larger than the palette", () => {
    expect(parseColormapRaw("400 10", 2)).toEqual([
      [400, 10],
    ]);
  });

  it("should not care about extra whitespace", () => {
    expect(parseColormapRaw("  10   20 30  40  ", 4)).toEqual([[10, 20, 30, 40]]);
  });
});

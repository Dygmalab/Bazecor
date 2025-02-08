import { expect, describe, it } from "vitest";
import { parsePaletteRaw } from "./palette";

describe("parsePaletteRaw", () => {
  describe("rgb", () => {
    it("should handle an empty string", () => {
      expect(parsePaletteRaw("", false)).toEqual([]);
    });

    it("should handle 3 whitespace characters", () => {
      expect(parsePaletteRaw("  ", false)).toEqual([]);
    });

    it("GAP: places NaN into result if given non-decimal numbers", () => {
      expect(parsePaletteRaw("9 F 3", false)).toEqual([
        {r:9, g:NaN, b:3, rgb: "rgb(9, NaN, 3)"},
      ]);
    });

    it("GAP: does not produce a valid color if there are not enough numbers ", () => {
      expect(parsePaletteRaw("9", false)).toEqual([
        {r:9, g: undefined, b: undefined, rgb: "rgb(9, undefined, undefined)"},
      ]);
    });

    it("should split into multiple groups", () => {
      expect(parsePaletteRaw("10 20 30 40 50 60", false)).toEqual([
        {r:10, g:20, b:30, rgb: "rgb(10, 20, 30)"},
        {r:40, g:50, b:60, rgb: "rgb(40, 50, 60)"},
      ]);
    });

    it("GAP: allows negative numbers", () => {
      expect(parsePaletteRaw("-10 2 3", false)).toEqual([
        {r:-10, g:2, b:3, rgb: "rgb(-10, 2, 3)"},
      ]);
    });

    it("GAP: allows numbers larger than 255", () => {
      expect(parsePaletteRaw("400 10 20", false)).toEqual([
        {r: 400, g: 10, b: 20, rgb: "rgb(400, 10, 20)"},
      ]);
    });

    it("should not care about extra whitespace", () => {
      expect(parsePaletteRaw("  10   20  30  ", false)).toEqual([
        {r: 10, g: 20, b:30, rgb: "rgb(10, 20, 30)"},
      ]);
    });
  });

  describe("rgbw", () => {
    it("should handle an empty string", () => {
      expect(parsePaletteRaw("", true)).toEqual([]);
    });

    it("should handle 3 whitespace characters", () => {
      expect(parsePaletteRaw("  ", true)).toEqual([]);
    });

    it("GAP: places NaN into result if given non-decimal numbers", () => {
      expect(parsePaletteRaw("9 F 3 4", true)).toEqual([
        {r:13, g:NaN, b:7, rgb: "rgb(13, NaN, 7)"},
      ]);
    });

    it("GAP: does not produce a valid color if there are not enough numbers ", () => {
      expect(parsePaletteRaw("9", true)).toEqual([
        {r:NaN, g: NaN, b: NaN, rgb: "rgb(NaN, NaN, NaN)"},
      ]);
    });

    it("should split into multiple groups", () => {
      expect(parsePaletteRaw("10 20 30 40 50 60 70 80", true)).toEqual([
        {r:50, g:60, b:70, rgb: "rgb(50, 60, 70)"},
        {r:130, g:140, b:150, rgb: "rgb(130, 140, 150)"},
      ]);
    });

    it("should handle negative numbers as 0", () => {
      expect(parsePaletteRaw("-10 2 3 4", true)).toEqual([
        {r:4, g:6, b:7, rgb: "rgb(4, 6, 7)"},
      ]);
    });

    it("should handle numbers larger than 255 as 255", () => {
      expect(parsePaletteRaw("400 10 20 30", true)).toEqual([
        {r: 255, g: 40, b: 50, rgb: "rgb(255, 40, 50)"},
      ]);
    });

    it("should not care about extra whitespace", () => {
      expect(parsePaletteRaw("  10   20  30   40    ", true)).toEqual([
        {r: 50, g: 60, b:70, rgb: "rgb(50, 60, 70)"},
      ]);
    });
  });
});

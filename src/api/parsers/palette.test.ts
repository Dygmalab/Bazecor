import { describe, expect, test } from "vitest";
import { fitPaletteToFormat } from "./palette";

const values = (palette: string) => palette.split(" ").map(Number);
const rgbw = (colors: number[][]) => colors.flat().join(" ");
const sixteen = <T>(color: T) => Array.from({ length: 16 }, () => color);

describe("fitPaletteToFormat()", () => {
  test("converts an RGBW palette for an RGB keyboard", () => {
    const palette = rgbw(sixteen([0, 0, 0, 255]));
    const out = values(fitPaletteToFormat(palette, false));
    expect(out).toHaveLength(48);
    // Pure white in RGBW comes out as white in RGB.
    expect(out.slice(0, 3)).toEqual([255, 255, 255]);
  });

  test("converts an RGB palette for an RGBW keyboard", () => {
    const palette = rgbw(sixteen([255, 0, 0]));
    const out = values(fitPaletteToFormat(palette, true));
    expect(out).toHaveLength(64);
    expect(out.slice(0, 4)).toEqual([255, 0, 0, 0]);
  });

  test("leaves a palette already in the target format alone", () => {
    const rgb = rgbw(sixteen([1, 2, 3]));
    const rgbwPalette = rgbw(sixteen([1, 2, 3, 4]));
    expect(fitPaletteToFormat(rgb, false)).toBe(rgb);
    expect(fitPaletteToFormat(rgbwPalette, true)).toBe(rgbwPalette);
  });

  test("leaves a palette of unknown length alone", () => {
    expect(fitPaletteToFormat("1 2 3", false)).toBe("1 2 3");
    expect(fitPaletteToFormat("", true)).toBe("");
  });
});

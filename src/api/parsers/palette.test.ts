import { describe, it, expect } from "vitest";
import { parsePaletteRaw } from "./palette";

describe("parsePaletteRaw", () => {
  it.each([
    {
      description: "should parse a simple RGB palette string",
      palette: "255 0 0 0 255 0",
      isRGBW: false,
      expected: [
        { r: 255, g: 0, b: 0, rgb: "rgb(255, 0, 0)" },
        { r: 0, g: 255, b: 0, rgb: "rgb(0, 255, 0)" },
      ],
    },
    {
      description: "should parse a simple RGBW palette string",
      palette: "200 0 0 55 0 200 0 55",
      isRGBW: true,
      expected: [
        { r: 255, g: 55, b: 55, rgb: "rgb(255, 55, 55)" },
        { r: 55, g: 255, b: 55, rgb: "rgb(55, 255, 55)" },
      ],
    },
    {
      description: "should handle empty string for RGB",
      palette: "",
      isRGBW: false,
      expected: [],
    },
    {
      description: "should handle empty string for RGBW",
      palette: "",
      isRGBW: true,
      expected: [],
    },
    {
      description: "should handle extra spaces for RGB",
      palette: " 255  0  0   0 255 0 ",
      isRGBW: false,
      expected: [
        { r: 255, g: 0, b: 0, rgb: "rgb(255, 0, 0)" },
        { r: 0, g: 255, b: 0, rgb: "rgb(0, 255, 0)" },
      ],
    },
    {
      description: "should handle extra spaces for RGBW",
      palette: " 200  0  0  55   0 200 0 55 ",
      isRGBW: true,
      expected: [
        { r: 255, g: 55, b: 55, rgb: "rgb(255, 55, 55)" },
        { r: 55, g: 255, b: 55, rgb: "rgb(55, 255, 55)" },
      ],
    },
    {
      description: "should handle incomplete data for RGB",
      palette: "255 0",
      isRGBW: false,
      expected: [{ r: 255, g: 0, b: undefined, rgb: "rgb(255, 0, undefined)" }],
    },
    {
      description: "should handle incomplete data for RGBW",
      palette: "200 0 0",
      isRGBW: true,
      expected: [
        {
          r: NaN,
          g: NaN,
          b: NaN,
          rgb: "rgb(NaN, NaN, NaN)",
        },
      ],
    },
  ])("$description", ({ palette, isRGBW, expected }) => {
    const result = parsePaletteRaw(palette, isRGBW);
    expect(result).toEqual(expected);
  });
});

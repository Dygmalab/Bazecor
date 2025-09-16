import { describe, it, expect, vi, Mock } from "vitest";
import { convertKeymapRtoR2, convertColormapRtoR2, convertPaletteRtoR2 } from "./raiseToRaise2";
import { rgb2w } from "../../color";

vi.mock("../../color/RGBtoRGBW", () => ({
  rgb2w: vi.fn(),
}));

describe("raiseToRaise2", () => {
  describe("convertKeymapRtoR2", () => {
    it("should convert keymap for ANSI keyboard", () => {
      const layer = Array.from({ length: 100 }, (_, i) => i);
      const result = convertKeymapRtoR2(layer, "ANSI");

      // Test thumb cluster restoration
      expect(result.slice(69, 72)).toEqual([70, 71, 69]);

      // Test enter swap
      expect(result[31]).toBe(layer[47]);
      expect(result[47]).toBe(layer[31]);

      // Test shift swap
      expect(result[48]).toBe(layer[49]);
      expect(result[49]).toBe(layer[48]);
    });

    it("should convert keymap for non-ANSI keyboard", () => {
      const layer = Array.from({ length: 100 }, (_, i) => i);
      const result = convertKeymapRtoR2(layer, "ISO");

      // Test thumb cluster restoration
      expect(result.slice(69, 72)).toEqual([70, 71, 69]);

      // Should not perform ANSI swaps
      expect(result[31]).toBe(layer[31]);
      expect(result[47]).toBe(layer[47]);
      expect(result[48]).toBe(layer[48]);
      expect(result[49]).toBe(layer[49]);
    });
  });

  describe("convertColormapRtoR2", () => {
    it("should convert colormap for ANSI keyboard", () => {
      const layer = Array.from({ length: 131 }, (_, i) => i);
      const result = convertColormapRtoR2(layer, "ANSI", "other");
      expect(result[40]).toBe(layer[48]);
      expect(result[48]).toBe(layer[40]);
    });

    it("should convert colormap for ANSI keyboard with ISO backup", () => {
      const layer = Array.from({ length: 131 }, (_, i) => i);
      const result = convertColormapRtoR2(layer, "ANSI", "ISO");
      expect(result[19]).toBe(layer[20]);
      expect(result[20]).toBe(layer[19]);
    });
  });

  describe("convertPaletteRtoR2", () => {
    it("should convert palette using rgb2w", () => {
      const color = { r: 10, g: 20, b: 30, rgb: "rgb(10, 20, 30)" };
      const mockedRgbw = { r: 5, g: 15, b: 25, w: 5 };
      (rgb2w as Mock).mockReturnValue(mockedRgbw);

      const result = convertPaletteRtoR2(color);

      expect(rgb2w).toHaveBeenCalledWith(color);
      expect(result).toEqual([mockedRgbw.r, mockedRgbw.g, mockedRgbw.b, mockedRgbw.w]);
    });
  });
});

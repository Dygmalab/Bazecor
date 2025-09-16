import { describe, it, expect } from "vitest";
import { convertKeymapR2toR, convertColormapR2toR, convertPaletteR2toR } from "./raise2ToRaise";

describe("raise2ToRaise", () => {
  describe("convertKeymapR2toR", () => {
    it("should convert keymap for ANSI keyboard", () => {
      const layer = Array.from({ length: 100 }, (_, i) => i);
      const result = convertKeymapR2toR(layer, "ANSI");

      // Test thumb cluster restoration
      expect(result.slice(69, 72)).toEqual([71, 69, 70]);

      // Test enter swap
      expect(result[31]).toBe(layer[47]);
      expect(result[47]).toBe(layer[31]);

      // Test shift swap
      expect(result[48]).toBe(layer[49]);
      expect(result[49]).toBe(layer[48]);
    });

    it("should convert keymap for non-ANSI keyboard", () => {
      const layer = Array.from({ length: 100 }, (_, i) => i);
      const result = convertKeymapR2toR(layer, "ISO");

      // Test thumb cluster restoration
      expect(result.slice(69, 72)).toEqual([71, 69, 70]);

      // Should not perform ANSI swaps
      expect(result[31]).toBe(layer[31]);
      expect(result[47]).toBe(layer[47]);
      expect(result[48]).toBe(layer[48]);
      expect(result[49]).toBe(layer[49]);
    });
  });

  describe("convertColormapR2toR", () => {
    it("should convert colormap for ANSI keyboard", () => {
      const layer = Array.from({ length: 132 }, (_, i) => i);
      const result = convertColormapR2toR(layer, "ANSI", "other");
      expect(result[40]).toBe(layer[48]);
      expect(result[48]).toBe(layer[40]);
    });

    it("should convert colormap for ANSI keyboard with ISO backup", () => {
      const layer = Array.from({ length: 132 }, (_, i) => i);
      const result = convertColormapR2toR(layer, "ANSI", "ISO");
      expect(result[19]).toBe(layer[20]);
      expect(result[20]).toBe(layer[19]);
    });

    it("should return the first 132 elements", () => {
      const layer = Array.from({ length: 150 }, (_, i) => i);
      const result = convertColormapR2toR(layer, "ISO", "other");
      expect(result.length).toBe(132);
      expect(result).toEqual(layer.slice(0, 132));
    });
  });

  describe("convertPaletteR2toR", () => {
    it("should convert palette color to an array of RGB values", () => {
      const color = { r: 10, g: 20, b: 30, rgb: "rgb(10, 20, 30)" };
      const result = convertPaletteR2toR(color);
      expect(result).toEqual([10, 20, 30]);
    });
  });
});

import { describe, it, expect } from "vitest";
import { convertKeymapRtoR2, convertColormapRtoR2, convertPaletteRtoR2 } from "./raiseToRaise2";

describe("convertKeymapRtoR2", () => {
  const baseLayer = Array.from({ length: 80 }, (_, i) => i + 1); // Sample layer with 80 keys

  it.each([
    {
      description: "should only swap thumb cluster keys for non-ANSI layouts",
      keyboardType: "ISO",
      input: [...baseLayer],
      expected: (() => {
        const expectedLayer = [...baseLayer];
        // Thumb cluster swap: [70, 71, 72] -> [71, 72, 70]
        const val69 = expectedLayer[69]; // 70
        const val70 = expectedLayer[70]; // 71
        const val71 = expectedLayer[71]; // 72
        expectedLayer[69] = val70;
        expectedLayer[70] = val71;
        expectedLayer[71] = val69;
        return expectedLayer;
      })(),
    },
    {
      description: "should swap thumb cluster and ANSI-specific keys for ANSI layout",
      keyboardType: "ANSI",
      input: [...baseLayer],
      expected: (() => {
        const expectedLayer = [...baseLayer];
        // Thumb cluster swap
        const val69 = expectedLayer[69];
        const val70 = expectedLayer[70];
        const val71 = expectedLayer[71];
        expectedLayer[69] = val70;
        expectedLayer[70] = val71;
        expectedLayer[71] = val69;

        // Enter swap (31<>47)
        const val31 = expectedLayer[31];
        const val47 = expectedLayer[47];
        expectedLayer[31] = val47;
        expectedLayer[47] = val31;

        // Shift swap (48<>49)
        const val48 = expectedLayer[48];
        const val49 = expectedLayer[49];
        expectedLayer[48] = val49;
        expectedLayer[49] = val48;

        return expectedLayer;
      })(),
    },
  ])("$description", ({ keyboardType, input, expected }) => {
    const result = convertKeymapRtoR2(input, keyboardType);
    expect(result).toEqual(expected);
  });
});

describe("convertColormapRtoR2", () => {
  // A Raise 1 colormap has 132 elements
  const baseColormap = Array.from({ length: 132 }, (_, i) => i + 1);
  const expansionColor = baseColormap[130]; // Color from index 130 is used for expansion
  const baseSlice = baseColormap.slice(0, -1); // First 131 elements
  const expandedPart = new Array(45).fill(expansionColor);

  it.each([
    {
      description: "should expand colormap for non-ANSI layouts",
      keyboardType: "ISO",
      backupKeyboardType: "ISO",
      input: [...baseColormap],
      expected: [...baseSlice, ...expandedPart],
    },
    {
      description: "should expand and swap enter key for ANSI layout",
      keyboardType: "ANSI",
      backupKeyboardType: "ANSI",
      input: [...baseColormap],
      expected: (() => {
        const expectedLayer = [...baseSlice, ...expandedPart];
        // Swap enter (40<>48)
        const val40 = expectedLayer[40];
        const val48 = expectedLayer[48];
        expectedLayer[40] = val48;
        expectedLayer[48] = val40;
        return expectedLayer;
      })(),
    },
    {
      description: "should expand and swap enter and shift keys for ANSI from ISO backup",
      keyboardType: "ANSI",
      backupKeyboardType: "ISO",
      input: [...baseColormap],
      expected: (() => {
        const expectedLayer = [...baseSlice, ...expandedPart];
        // Swap enter (40<>48)
        const val40 = expectedLayer[40];
        const val48 = expectedLayer[48];
        expectedLayer[40] = val48;
        expectedLayer[48] = val40;
        // Swap shift (19<>20)
        const val19 = expectedLayer[19];
        const val20 = expectedLayer[20];
        expectedLayer[19] = val20;
        expectedLayer[20] = val19;
        return expectedLayer;
      })(),
    },
  ])("$description", ({ keyboardType, backupKeyboardType, input, expected }) => {
    const result = convertColormapRtoR2(input, keyboardType, backupKeyboardType);
    expect(result).toEqual(expected);
  });
});

describe("convertPaletteRtoR2", () => {
  it.each([
    {
      description: "should convert a standard RGB color to RGBW",
      color: { r: 100, g: 150, b: 200, rgb: "rgb(100, 150, 200)" },
      expected: [0, 50, 100, 100], // w = min(100,150,200) = 100
    },
    {
      description: "should convert a color with a zero component",
      color: { r: 0, g: 100, b: 200, rgb: "rgb(0, 100, 200)" },
      expected: [0, 100, 200, 0], // w = min(0,100,200) = 0
    },
    {
      description: "should convert a grayscale color",
      color: { r: 120, g: 120, b: 120, rgb: "rgb(120, 120, 120)" },
      expected: [0, 0, 0, 120], // w = min(120,120,120) = 120
    },
    {
      description: "should handle pure white",
      color: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" },
      expected: [0, 0, 0, 255], // w = 255
    },
    {
      description: "should handle pure black",
      color: { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)" },
      expected: [0, 0, 0, 0], // w = 0
    },
  ])("$description", ({ color, expected }) => {
    const result = convertPaletteRtoR2(color);
    expect(result).toEqual(expected);
  });
});

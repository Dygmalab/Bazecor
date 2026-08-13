import { describe, it, expect } from "vitest";
import { convertKeymapR2toR, convertColormapR2toR, convertPaletteR2toR } from "./raise2ToRaise";

describe("convertKeymapR2toR", () => {
  const baseLayer = Array.from({ length: 80 }, (_, i) => i + 1); // Sample R2 layer

  it.each([
    {
      description: "should only swap thumb cluster keys for non-ANSI layouts",
      keyboardType: "ISO",
      input: [...baseLayer],
      expected: (() => {
        const expectedLayer = [...baseLayer];
        // Thumb cluster swap: [key69, key70, key71] -> [key71, key69, key70]
        const val69 = expectedLayer[69]; // 70
        const val70 = expectedLayer[70]; // 71
        const val71 = expectedLayer[71]; // 72
        expectedLayer[69] = val71;
        expectedLayer[70] = val69;
        expectedLayer[71] = val70;
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
        expectedLayer[69] = val71;
        expectedLayer[70] = val69;
        expectedLayer[71] = val70;

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
    const result = convertKeymapR2toR(input, keyboardType);
    expect(result).toEqual(expected);
  });
});

describe("convertColormapR2toR", () => {
  // A Raise 2 colormap has 176 elements, Raise 1 has 132
  const baseColormap = Array.from({ length: 176 }, (_, i) => i + 1);
  const truncatedColormap = baseColormap.slice(0, 132);

  it.each([
    {
      description: "should truncate colormap for non-ANSI layouts",
      keyboardType: "ISO",
      backupKeyboardType: "ISO",
      input: [...baseColormap],
      expected: [...truncatedColormap],
    },
    {
      description: "should truncate and swap enter key for ANSI layout",
      keyboardType: "ANSI",
      backupKeyboardType: "ANSI",
      input: [...baseColormap],
      expected: (() => {
        const expectedLayer = [...truncatedColormap];
        // Swap enter (40<>48)
        const val40 = expectedLayer[40];
        const val48 = expectedLayer[48];
        expectedLayer[40] = val48;
        expectedLayer[48] = val40;
        return expectedLayer;
      })(),
    },
    {
      description: "should truncate and swap enter and shift keys for ANSI from ISO backup",
      keyboardType: "ANSI",
      backupKeyboardType: "ISO",
      input: [...baseColormap],
      expected: (() => {
        const expectedLayer = [...truncatedColormap];
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
    {
      description: "should only truncate for ISO layout even if backup is ANSI",
      keyboardType: "ISO",
      backupKeyboardType: "ANSI",
      input: [...baseColormap],
      expected: [...truncatedColormap],
    },
  ])("$description", ({ keyboardType, backupKeyboardType, input, expected }) => {
    const result = convertColormapR2toR(input, keyboardType, backupKeyboardType);
    expect(result).toEqual(expected);
  });
});

describe("convertPaletteR2toR", () => {
  it.each([
    {
      description: "should convert a standard color object to an array",
      color: { r: 100, g: 150, b: 200, rgb: "rgb(100, 150, 200)" },
      expected: [100, 150, 200],
    },
    {
      description: "should handle zero values",
      color: { r: 0, g: 50, b: 255, rgb: "rgb(0, 50, 255)" },
      expected: [0, 50, 255],
    },
    {
      description: "should handle all zero values (black)",
      color: { r: 0, g: 0, b: 0, rgb: "rgb(0, 0, 0)" },
      expected: [0, 0, 0],
    },
    {
      description: "should handle all max values (white)",
      color: { r: 255, g: 255, b: 255, rgb: "rgb(255, 255, 255)" },
      expected: [255, 255, 255],
    },
  ])("$description", ({ color, expected }) => {
    const result = convertPaletteR2toR(color);
    // This means that the method does nothing but copy the object
    expect(result).toEqual(color);
  });
});

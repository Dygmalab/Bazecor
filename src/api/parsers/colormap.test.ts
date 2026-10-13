import { describe, it, expect } from "vitest";
import { parseColormapRaw } from "./colormap";

describe("parseColormapRaw", () => {
  it.each([
    {
      description: "should parse a simple colormap string into a single layer",
      colormap: "1 2 3 4",
      layerSize: 4,
      expected: [[1, 2, 3, 4]],
    },
    {
      description: "should parse a colormap string into multiple layers",
      colormap: "1 2 3 4 5 6 7 8",
      layerSize: 4,
      expected: [
        [1, 2, 3, 4],
        [5, 6, 7, 8],
      ],
    },
    {
      description: "should handle an empty string",
      colormap: "",
      layerSize: 4,
      expected: [],
    },
    {
      description: "should handle strings with extra spaces",
      colormap: " 1  2   3 4  ",
      layerSize: 4,
      expected: [[1, 2, 3, 4]],
    },
    {
      description: "should handle a layer size that does not perfectly divide the data",
      colormap: "1 2 3 4 5",
      layerSize: 3,
      expected: [
        [1, 2, 3],
        [4, 5],
      ],
    },
  ])("$description", ({ colormap, layerSize, expected }) => {
    const result = parseColormapRaw(colormap, layerSize);
    expect(result).toEqual(expected);
  });
});

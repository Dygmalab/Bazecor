import { describe, expect, test } from "vitest";
import { rgbwProfiles } from "../../color";
import { convertPaletteRtoR2 } from "./raiseToRaise2";

describe("convertPaletteRtoR2", () => {
  const mint = { r: 153, g: 255, b: 204, rgb: "rgb(153, 255, 204)" };

  test("defaults to Efficient", () => {
    expect(convertPaletteRtoR2(mint)).toEqual([0, 102, 51, 153]);
  });

  test("uses an explicit target profile", () => {
    expect(convertPaletteRtoR2(mint, rgbwProfiles.vivid)).toEqual([28, 130, 79, 125]);
    expect(convertPaletteRtoR2(mint, rgbwProfiles.balanced)).toEqual([16, 118, 67, 137]);
  });
});

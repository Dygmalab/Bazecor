import { describe, expect, test } from "vitest";
import { languagesDB } from "../../api/keymap/languages/languageLayouts";
import { decodeKey, layoutOverrides, symbolOverrides } from "./keycodes";

const SHIFT = 2048;
const ALTGR = 1024;
const CTRL_ALT = 768;
const CTRL = 256;

const decode = (code: number, layout: string) => decodeKey(code, layoutOverrides(layout), [], [], symbolOverrides(layout));

describe("Lens layouts", () => {
  test("covers every language Bazecor offers", () => {
    for (const layout of Object.keys(languagesDB).filter(l => l !== "en-US")) {
      expect(Object.keys(layoutOverrides(layout)).length + Object.keys(symbolOverrides(layout)).length).toBeGreaterThan(0);
    }
  });

  test("relabels the base layer like Bazecor does", () => {
    expect(decode(51, "es-ES").primary).toBe("Ñ");
    expect(decode(28, "de-DE").primary).toBe("Z");
    expect(decode(4, "fr-FR").primary).toBe("Q");
    expect(decode(16, "fr-FR").primary).toBe(",");
    expect(decode(135, "ja-JP").primary).toBe("\\ろ");
    expect(decode(144, "ko-KR").primary).toBe("한/영");
    expect(decode(8, "fr-XX-bepo").primary).toBe("p");
  });

  test("keeps plain US labels for en-US and unknown layouts", () => {
    expect(layoutOverrides("en-US")).toEqual({});
    expect(decode(51, "us").primary).toBe(";");
    expect(decode(51, "xx-XX").primary).toBe(";");
  });

  test("keeps the Num tag when a language relabels a numpad key", () => {
    expect(decode(99, "de-DE")).toEqual({ primary: "Num", subtitle: ",", hold: "" });
    expect(decode(99, "en-US")).toEqual({ primary: "Num", subtitle: ".", hold: "" });
  });

  test("shows the character Shift produces", () => {
    expect(decode(SHIFT + 31, "en-US").primary).toBe("@");
    expect(decode(SHIFT + 31, "es-ES").primary).toBe('"');
    expect(decode(SHIFT + 31, "de-DE").primary).toBe('"');
    // Absent from the Spanish table, so Bazecor falls through to the US symbol.
    expect(decode(SHIFT + 30, "es-ES").primary).toBe("!");
  });

  test("shows the character AltGr and Ctrl+Alt produce", () => {
    expect(decode(ALTGR + 8, "es-ES").primary).toBe("€");
    expect(decode(CTRL_ALT + 8, "es-ES").primary).toBe("€");
    expect(decode(ALTGR + 4, "pl-PL").primary).toBe("Ą");
  });

  test("keeps shortcuts as the base key plus modifier chips", () => {
    expect(decode(CTRL + 6, "es-ES")).toEqual({ primary: "C", hold: "", modifiers: ["Ctrl"] });
    expect(decode(ALTGR + 8, "en-US")).toEqual({ primary: "E", hold: "", modifiers: ["AltGr"] });
  });
});

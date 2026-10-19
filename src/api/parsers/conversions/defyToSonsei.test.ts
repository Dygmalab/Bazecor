import { describe, expect, test, vi } from "vitest";
import { COMBO_POSITION_UNUSED, MAX_COMBO_MEMBERS, MAX_COMBOS } from "@Renderer/types/combos";
import {
  convertColormapDefyToSonsei,
  convertColormapSonseiToDefy,
  convertKeymapDefyToSonsei,
  convertKeymapSonseiToDefy,
  convertKeyPositionDefyToSonsei,
  convertKeyPositionSonseiToDefy,
  DEFY_KEYS_PER_LAYER,
  DEFY_LEDS_PER_LAYER,
  SONSEI_KEYS_PER_LAYER,
  SONSEI_LEDS_PER_LAYER,
} from "./defyToSonsei";
import { remapComboPositions, serializeCombos } from "../combos";

vi.mock("electron-log/renderer", () => ({
  default: { error: vi.fn(), warn: vi.fn(), info: vi.fn(), verbose: vi.fn(), debug: vi.fn() },
}));

const NO_KEY = 65535;
const range = (n: number) => Array.from({ length: n }, (_, i) => i);
// Sonsei row 4, cols 4-7: the gap between the thumb clusters, no physical key.
const SONSEI_GAP = [52, 53, 54, 55];
const SONSEI_KEYS = range(SONSEI_KEYS_PER_LAYER).filter(i => !SONSEI_GAP.includes(i));

describe("Sonsei -> Defy", () => {
  test("produces full Defy layers", () => {
    expect(convertKeymapSonseiToDefy(range(SONSEI_KEYS_PER_LAYER))).toHaveLength(DEFY_KEYS_PER_LAYER);
    expect(convertColormapSonseiToDefy(range(SONSEI_LEDS_PER_LAYER))).toHaveLength(DEFY_LEDS_PER_LAYER);
  });

  test("every Sonsei key lands on a Defy key", () => {
    const sonsei = range(SONSEI_KEYS_PER_LAYER).map(i => 1000 + i);
    const defy = convertKeymapSonseiToDefy(sonsei);
    expect(defy.filter(k => k !== NO_KEY).sort((a, b) => a - b)).toEqual(SONSEI_KEYS.map(i => 1000 + i));
    // Defy keys the Sonsei lacks are left transparent, like the other direction.
    expect(defy.filter(k => k === NO_KEY)).toHaveLength(DEFY_KEYS_PER_LAYER - SONSEI_KEYS.length);
  });

  test("round trips back to the same Sonsei layer", () => {
    const keys = range(SONSEI_KEYS_PER_LAYER).map(i => (SONSEI_GAP.includes(i) ? NO_KEY : 2000 + i));
    expect(convertKeymapDefyToSonsei(convertKeymapSonseiToDefy(keys))).toEqual(keys);
    const leds = range(SONSEI_LEDS_PER_LAYER).map(i => i % 16);
    expect(convertColormapDefyToSonsei(convertColormapSonseiToDefy(leds))).toEqual(leds);
  });
});

describe("combo key positions", () => {
  test("map both ways consistently", () => {
    SONSEI_KEYS.forEach(sonsei => {
      const defy = convertKeyPositionSonseiToDefy(sonsei);
      expect(defy).not.toBeNull();
      expect(convertKeyPositionDefyToSonsei(defy as number)).toBe(sonsei);
    });
    SONSEI_GAP.forEach(gap => expect(convertKeyPositionSonseiToDefy(gap)).toBeNull());
  });

  test("a Defy key with no Sonsei counterpart maps to null", () => {
    // Row 0, col 6: the inner left key the Sonsei drops.
    expect(convertKeyPositionDefyToSonsei(6)).toBeNull();
    expect(convertKeyPositionDefyToSonsei(DEFY_KEYS_PER_LAYER)).toBeNull();
    expect(convertKeyPositionSonseiToDefy(SONSEI_KEYS_PER_LAYER)).toBeNull();
  });

  test("remapComboPositions moves members and clears combos that can't move", () => {
    const blank = (id: number) => ({
      id,
      name: "",
      positions: new Array<number>(MAX_COMBO_MEMBERS).fill(COMBO_POSITION_UNUSED),
      layer: 0,
      flags: 1,
      action: 0,
    });
    const withKeys = (id: number, keys: number[], action: number) => {
      const c = blank(id);
      keys.forEach((k, i) => {
        c.positions[i] = k;
      });
      return { ...c, action };
    };
    // Defy row 0 cols 1+2 -> Sonsei 1+2; Defy row 1 col 10 -> Sonsei row 1 col 6 (18).
    const raw = serializeCombos([withKeys(0, [1, 2], 29), withKeys(1, [26, 6], 30), withKeys(2, [16, 26], 31)]);
    const out = remapComboPositions(raw, convertKeyPositionDefyToSonsei).split(" ").map(Number);
    const fields = MAX_COMBO_MEMBERS + 3;
    const record = (i: number) => out.slice(1 + i * fields, 1 + (i + 1) * fields);

    expect(out).toHaveLength(1 + MAX_COMBOS * fields);
    expect(out[0]).toBe(3);
    expect(record(0).slice(0, 2)).toEqual([1, 2]);
    // Uses Defy key 6, which the Sonsei does not have: keys cleared, the rest kept.
    expect(
      record(1)
        .slice(0, MAX_COMBO_MEMBERS)
        .every(p => p === COMBO_POSITION_UNUSED),
    ).toBe(true);
    expect(record(1)[fields - 1]).toBe(30);
    expect(record(2).slice(0, 2)).toEqual([12, 18]);
  });

  test("remapComboPositions leaves unrecognised replies alone", () => {
    expect(remapComboPositions("", convertKeyPositionDefyToSonsei)).toBe("");
    expect(remapComboPositions("1 2 3", convertKeyPositionDefyToSonsei)).toBe("1 2 3");
  });
});

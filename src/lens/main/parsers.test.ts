import { describe, expect, test } from "vitest";
import { COMBO_LAYER_ANY } from "../shared/types";
import { comboNumbersForLayer } from "../renderer/key-label";
import { parseCombos } from "./parsers";

const MAX_COMBOS = 32;

const reply = (records: number[][], fieldsPerRecord: number): string => {
  const values = [records.length];
  for (let i = 0; i < MAX_COMBOS; i += 1) {
    values.push(...(records[i] ?? new Array<number>(fieldsPerRecord).fill(0)));
  }
  return values.join(" ");
};

describe("Lens combos", () => {
  test("parses the six-key format", () => {
    const combos = parseCombos(reply([[48, 49, 50, 51, 52, 53, 2, 1, 29]], 9));

    expect(combos).toEqual([{ positions: [48, 49, 50, 51, 52, 53], layer: 2 }]);
  });

  test("parses a backup from the first firmware, where 255 meant every layer", () => {
    const combos = parseCombos(
      reply(
        [
          [48, 49, 255, 255, 255, 1, 29],
          [50, 51, 255, 255, 1, 1, 30],
        ],
        7,
      ),
    );

    expect(combos).toEqual([
      { positions: [48, 49], layer: COMBO_LAYER_ANY },
      { positions: [50, 51], layer: 1 },
    ]);
  });

  test("a disabled combo keeps its number but badges nothing", () => {
    const combos = parseCombos(reply([[48, 49, 255, 255, 255, 255, 0, 0, 29]], 9));

    expect(combos).toEqual([{ positions: [], layer: 0 }]);
  });

  test("a key in several combos gets every number, on its layer only", () => {
    const combos = [
      { positions: [48, 49], layer: 0 },
      { positions: [49, 50], layer: 0 },
      { positions: [49], layer: 1 },
    ];

    expect(comboNumbersForLayer(combos, 0).get(49)).toBe("C1 C2");
    expect(comboNumbersForLayer(combos, 1).get(49)).toBe("C3");
    expect(comboNumbersForLayer(combos, 1).get(48)).toBeUndefined();
  });
});

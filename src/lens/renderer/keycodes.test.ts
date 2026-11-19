import { describe, expect, test } from "vitest";
import { decodeKey } from "./keycodes";

describe("decodeKey blanks", () => {
  test("NO KEY is drawn as an empty key", () => {
    const key = decodeKey(0);
    expect(key.primary).toBe("");
    expect(key.subtitle).toBeUndefined();
    expect(key.icon).toBeUndefined();
  });

  test("transparent keeps its TRANS label", () => {
    expect(decodeKey(65535).primary).toBe("TRANS");
  });
});

import { describe, expect, test } from "vitest";
import { decodeHexLine } from "./decodeHexLine";

describe(`${decodeHexLine.name}()`, () => {
  test("decode hex line", () => {
    const data = "AB1234";
    const i = `03123401${data}`;
    const r = decodeHexLine(i);
    expect(r.str).toEqual(i);
    expect(r.len).toEqual(3);
    expect(r.address).toEqual(0x1234);
    expect(r.type).toEqual(1);
    expect(r.data).toEqual(Uint8Array.from([0xab, 0x12, 0x34]));
  });
});

import { describe, expect, test } from "vitest";
import { decodeKey } from "../../../lens/renderer/keycodes";
import { MouseSpeedTable } from "./mousecontrols";

/* Keycodes of the firmware's MouseKeysDygma: SYNTHETIC | IS_MOUSE_KEY flags (0x50) and
 * bit 7 of the keycode set, then Slow / Medium / Fast / Boost. */
const MOUSE_KEY_BASE = 0x5000;
const KEY_MOUSE_DYGMA = 0x80;

describe("mouse speed keys", () => {
  test("match the firmware keycodes", () => {
    expect(MouseSpeedTable.keys.map(k => k.code)).toEqual(
      [0x01, 0x02, 0x04, 0x08].map(c => MOUSE_KEY_BASE + KEY_MOUSE_DYGMA + c),
    );
  });

  test("Layer Lens labels them like Bazecor", () => {
    MouseSpeedTable.keys.forEach(({ code, labels }) => {
      expect(decodeKey(code)).toEqual({ primary: labels.top, subtitle: labels.primary, hold: "" });
    });
  });
});

import { describe, expect, test } from "vitest";
import { OverlayCodes } from "../../../hw/overlay";
import { AutoshiftCodes } from "../../../hw/autoshift";
import { CapsWordCodes } from "../../../hw/capsword";
import { BatteryCodes } from "../../../hw/battery";
import { isRaise2OnlyKey, stripRaise2OnlyKeys, stripRaise2OnlySuperkeyActions } from "./raise2ToRaise";

const RAISE2_ONLY = [
  BatteryCodes.STATUS,
  OverlayCodes.OVERLAY_KEY,
  OverlayCodes.OVERLAY_TAP,
  OverlayCodes.OVERLAY_HOLD,
  AutoshiftCodes.AUTOSHIFT_FIRST,
  AutoshiftCodes.AUTOSHIFT_LAST,
  CapsWordCodes.CAPS_WORD,
];

describe("Raise 2 -> Raise 1", () => {
  test("flags the keys the Raise 1 firmware lacks", () => {
    RAISE2_ONLY.forEach(k => expect(isRaise2OnlyKey(k)).toBe(true));
    // Neighbours stay: the superkey block below, a plain key, transparent.
    [53980, 54107, 54372, 4, 0, 65535].forEach(k => expect(isRaise2OnlyKey(k)).toBe(false));
  });

  test("blanks them in a keymap layer and keeps everything else", () => {
    expect(stripRaise2OnlyKeys([4, OverlayCodes.OVERLAY_TAP, 65535, CapsWordCodes.CAPS_WORD, 53980])).toEqual([
      4, 0, 65535, 0, 53980,
    ]);
  });

  test("unsets them in superkeys without touching the 0 separators", () => {
    const raw = `4 ${OverlayCodes.OVERLAY_HOLD} 1 1 1 0 ${AutoshiftCodes.AUTOSHIFT_FIRST + 4} 5 1 1 1 0 0 65535`;
    expect(stripRaise2OnlySuperkeyActions(raw)).toBe("4 1 1 1 1 0 1 5 1 1 1 0 0 65535");
  });
});

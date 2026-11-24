import { expect, test } from "vitest";
import isSuperkeyHoldLimited from "./superkeyLayerLimit";

test.each([
  { slot: "Tap", action: 0, limited: false },
  { slot: "Hold", action: 1, limited: true },
  { slot: "Tap & hold", action: 2, limited: true },
  { slot: "2Tap", action: 3, limited: false },
  { slot: "2Tap & hold", action: 4, limited: true },
  { slot: "none selected", action: -1, limited: false },
])("superkey slot $slot -> limited: $limited", ({ action, limited }) => {
  expect(isSuperkeyHoldLimited("super", action)).toBe(limited);
});

test.each(["editor", "macro", undefined])("%s is never limited", tab => {
  expect(isSuperkeyHoldLimited(tab, undefined)).toBe(false);
  expect(isSuperkeyHoldLimited(tab, 1)).toBe(false);
});

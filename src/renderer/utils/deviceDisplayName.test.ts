import { expect, test } from "vitest";
import deviceDisplayName from "./deviceDisplayName";
import { DefyWired, enumerator } from "../../api/hardware-virtual";

test.each([
  { name: "Dygma Defy wireless", expected: "Dygma Defy" },
  { name: "Dygma Defy wired", expected: "Dygma Defy" },
  { name: "Dygma Defy Wireless ", expected: "Dygma Defy" },
  { name: "Dygma Raise ANSI", expected: "Dygma Raise ANSI" },
  { name: "Dygma Raise 2 ISO", expected: "Dygma Raise 2 ISO" },
  { name: "Dygma Sonsei", expected: "Dygma Sonsei" },
  { name: "", expected: "" },
  { name: undefined, expected: "" },
])("deviceDisplayName($name) -> $expected", ({ name, expected }) => {
  expect(deviceDisplayName(name)).toBe(expected);
});

test("no keyboard model is shown with a connection type", () => {
  [...enumerator, DefyWired].forEach(vk => expect(deviceDisplayName(vk.device.info.displayName)).not.toMatch(/wire(d|less)/i));
});

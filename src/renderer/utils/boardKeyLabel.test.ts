import { expect, test } from "vitest";
import boardKeyLabel from "./boardKeyLabel";
import { KeymapDB } from "../../api/keymap";

const db = new KeymapDB();

test("NO KEY is drawn as an empty key", () => {
  const key = db.parse(0);
  expect(boardKeyLabel(key)).toMatchObject({ keyCode: 0, label: "", extraLabel: "" });
  // The keymap entry itself keeps its label: pickers still say "NO KEY".
  expect(key.label).toBe("KEY");
  expect(key.extraLabel).toBe("NO");
});

test.each([4, 65535, 17450, 22709, 53852])("key %i is left as the keymap DB labels it", code => {
  const key = db.parse(code);
  expect(boardKeyLabel(key)).toBe(key);
});

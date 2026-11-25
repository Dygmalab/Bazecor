import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { expect, test, vi } from "vitest";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { KeymapDB } from "../../../api/keymap";
import LayersTab from "./LayersTab";

vi.mock("@Renderer/utils/Store", () => ({ default: { getStore: () => ({ get: (): unknown => undefined }) } }));
vi.mock("../KeyPickerKeyboard", () => ({ Picker: (): null => null }));
vi.mock("electron-log/renderer", () => ({ default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() } }));

const keymapDB = new KeymapDB();

const pickLayer = (activeTab: string, current: number, layer: number) => {
  const onKeySelect = vi.fn();
  const keyCode = keymapDB.keySegmentor(current) as SegmentedKeyType;
  const view = render(<LayersTab onKeySelect={onKeySelect} activeTab={activeTab} action={0} keyCode={keyCode} />);
  fireEvent.click(screen.getByRole("button", { name: String(layer) }));
  view.unmount();
  return onKeySelect.mock.calls.at(-1)?.[0];
};

test.each([
  { name: "empty combo", current: 0, layer: 2, code: 17451 },
  { name: "combo with a plain key", current: 4, layer: 10, code: 17459 },
  { name: "combo with a layer shift", current: 17451, layer: 3, code: 17452 },
  { name: "combo with a layer lock keeps locking", current: 17493, layer: 3, code: 17494 },
])("$name: layer $layer -> $code", ({ current, layer, code }) => {
  expect(pickLayer("combo", current, layer)).toBe(code);
});

test("the Tap slot of a superkey still gets a layer lock", () => {
  expect(pickLayer("super", 0, 2)).toBe(17493);
});

test("a combo's layer lock can be turned into a layer shift", () => {
  const onKeySelect = vi.fn();
  const keyCode = keymapDB.keySegmentor(17493) as SegmentedKeyType;
  render(<LayersTab onKeySelect={onKeySelect} activeTab="combo" action={0} keyCode={keyCode} />);
  fireEvent.click(screen.getByRole("checkbox"));
  expect(onKeySelect).toHaveBeenLastCalledWith(17451);
});

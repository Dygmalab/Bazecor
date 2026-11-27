import React from "react";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ThemeProvider } from "styled-components";
import { MemoryRouter } from "react-router-dom";
import Light from "@Renderer/theme/LightTheme";
import { DeviceClass } from "@Renderer/types/devices";
import Raise2ANSI from "../../api/hardware-dygma-raise2-ansi/components/Keymap-ANSI";
import getLanguage from "../modules/KeyPickerKeyboard/KeyPickerLanguage";
import LayoutEditor from "./LayoutEditor";
import ToggleGroupKeyboardViewMode from "../components/molecules/CustomToggleGroup/ToggleGroupKeyboardViewMode";

const fixture = vi.hoisted(() => ({
  state: { currentDevice: undefined as unknown as DeviceClass },
  command: vi.fn(),
  store: new Map<string, unknown>(),
}));

vi.mock("@Renderer/DeviceContext", () => ({ useDevice: () => ({ state: fixture.state }) }));
vi.mock("@Renderer/utils/Store", () => ({
  default: {
    getStore: () => ({
      get: (key: string) => fixture.store.get(key),
      set: (key: string, value: unknown) => fixture.store.set(key, value),
    }),
  },
}));
vi.mock("electron", () => ({ ipcRenderer: { invoke: vi.fn() } }));
vi.mock("electron-log/renderer", () => ({
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));
vi.mock("../../api/backup", () => ({
  default: class {
    static Commands = vi.fn().mockResolvedValue([]);
    static SaveBackup = vi.fn();
    DoBackup = vi.fn().mockResolvedValue({});
  },
}));
vi.mock("@Renderer/modules/PageHeader", () => ({
  PageHeader: ({
    contentSelector,
    colorEditor,
    isColorActive,
    saveContext,
  }: {
    contentSelector: React.ReactNode;
    colorEditor: React.ReactNode;
    isColorActive: boolean;
    saveContext: () => void;
  }) => (
    <header>
      {contentSelector}
      {isColorActive && colorEditor}
      <button type="button" onClick={saveContext}>
        Save fixture
      </button>
    </header>
  ),
}));
// Keep the real color controls while avoiding legacy .js files containing JSX.
vi.mock("@Renderer/component/Button", async () => {
  const { default: ColorPicker } = await import("../component/Button/ColorPicker");
  const { default: ColorButton } = await import("../component/Button/ColorButton");
  return { ColorPicker, ColorButton, ButtonMouse: (): null => null, SuperkeyPicker: (): null => null };
});
vi.mock("@Renderer/components/organisms/Select/LayerSelector", () => ({
  default: ({
    onSelect,
    selectedItem,
    editModeFunc,
    editModeActual,
  }: {
    onSelect: (index: number) => void;
    selectedItem: number;
    editModeFunc: (mode: "keys" | "keyboard") => void;
    editModeActual: "keys" | "keyboard";
  }) => (
    <>
      <select aria-label="Fixture layer" value={selectedItem} onChange={event => onSelect(Number(event.target.value))}>
        <option value={0}>Layer 1</option>
        <option value={1}>Layer 2</option>
      </select>
      <ToggleGroupKeyboardViewMode value={editModeActual} onValueChange={editModeFunc} />
    </>
  ),
}));
vi.mock("@Renderer/components/molecules/CustomModal/ClearLayerDialog", () => ({ ClearLayerDialog: (): null => null }));
vi.mock("@Renderer/components/molecules/CustomModal/CopyFromDialog", () => ({ CopyFromDialog: (): null => null }));

const initialKeys = [4, 5, 4, ...Array<number>(77).fill(6), ...Array<number>(80).fill(7)];
const initialColors = Array<number>(354).fill(0);

beforeEach(() => {
  vi.clearAllMocks();
  initialColors.fill(0);
  fixture.store.clear();
  fixture.store.set("settings.language", "en-US");
  fixture.store.set("neurons", [{ id: "fixture", layers: [], macros: [], superkeys: [] }]);
  fixture.store.set("capabilities.combos", true);
  fixture.store.set("capabilities.lens", true);
  fixture.command.mockImplementation(async (command: string) => {
    const replies: Record<string, string> = {
      "hardware.chip_id": "fixture",
      "keymap.default": initialKeys.join(" "),
      "keymap.custom": initialKeys.join(" "),
      "keymap.onlyCustom": "1",
      palette: Array<number>(48).fill(128).join(" "),
      "colormap.map": initialColors.join(" "),
      "macros.map": "0 0",
      "superkeys.map": "",
      "combos.map": "1 0 1 255 255 255 255 0 0 4",
    };
    return replies[command] ?? "";
  });
  fixture.state.currentDevice = {
    type: "virtual",
    command: fixture.command,
    device: {
      info: { product: "Raise2", keyboardType: "ANSI" },
      keyboard: { rows: 5, columns: 16, ledsLeft: Array(33).fill(0), ledsRight: Array(36).fill(0) },
      keyboardUnderglow: { rows: 1, columns: 108, ledsLeft: Array(54).fill(0), ledsRight: Array(54).fill(0) },
      components: { keymap: Raise2ANSI },
    },
  } as unknown as DeviceClass;
});

afterEach(cleanup);

async function renderEditor() {
  const startContext = vi.fn();
  const onDisconnect = vi.fn();
  const view = render(
    <ThemeProvider theme={Light}>
      <MemoryRouter>
        <LayoutEditor
          darkMode={false}
          cancelContext={vi.fn()}
          setLoading={vi.fn()}
          onDisconnect={onDisconnect}
          startContext={startContext}
          inContext
          restoredOk
          handleSetRestoredOk={vi.fn()}
          saveButtonRef={React.createRef<HTMLButtonElement>()}
          discardChangesButtonRef={React.createRef<HTMLButtonElement>()}
        />
      </MemoryRouter>
    </ThemeProvider>,
  );
  await waitFor(() => expect(view.container.querySelector('.dygma-keyboard-editor [data-key-index="0"]')).not.toBeNull());
  expect(onDisconnect).not.toHaveBeenCalled();
  return { ...view, startContext };
}

function boardKey(container: HTMLElement, index: number) {
  const key = container.querySelector(`.dygma-keyboard-editor .keyItem[data-key-index="${index}"]`);
  if (!key) throw new Error(`Missing physical key ${index}`);
  return key;
}

function clickPickerKey(container: HTMLElement, keyCode: number) {
  const index = getLanguage("en-US").findIndex(key => key.id === keyCode);
  fireEvent.click(container.querySelector(`.keycap.id-${index} .shapeKey`));
}

function paletteButton(container: HTMLElement, index: number) {
  return container.querySelectorAll(".colorPalette .colorPickerButton")[index];
}

function clickColor(container: HTMLElement, index: number) {
  fireEvent.click(paletteButton(container, index));
}

function underglowKey(container: HTMLElement, index: number) {
  return container.querySelector(`.underGlowStrip[data-key-index="${index}"]`);
}

async function savedKeys(view: Awaited<ReturnType<typeof renderEditor>>) {
  fireEvent.click(view.getByRole("button", { name: "Save fixture" }));
  await waitFor(() => expect(fixture.command).toHaveBeenCalledWith("keymap.custom", expect.any(String)));
  const saved = fixture.command.mock.calls.find(call => call[0] === "keymap.custom" && call.length > 1);
  return String(saved[1]).split(" ").map(Number);
}

async function savedColors(view: Awaited<ReturnType<typeof renderEditor>>) {
  await savedKeys(view);
  await waitFor(() => expect(fixture.command.mock.calls.some(call => call[0] === "colormap.map" && call.length > 1)).toBe(true));
  const saved = fixture.command.mock.calls.find(call => call[0] === "colormap.map" && call.length > 1);
  return saved.slice(1).map(Number);
}

describe("Layout Editor multi-selection", () => {
  test("Ctrl+click selects multiple keys and a picker assignment updates all of them", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    expect(boardKey(view.container, 0)).toHaveClass("keyOnFocus");
    expect(boardKey(view.container, 1)).toHaveClass("keyOnFocus");
    expect(view.container.querySelectorAll(".keycap.active")).toHaveLength(0);
    expect(view.getByRole("button", { name: /^No key$/i })).toHaveAttribute("aria-pressed", "false");

    clickPickerKey(view.container, 22); // S applies to both different assignments.
    expect(view.startContext).toHaveBeenCalledTimes(1);
    expect(view.container.querySelectorAll(".keycap.active")).toHaveLength(1);
    clickPickerKey(view.container, 224); // Then Ctrl+S applies to both.
    const expected = initialKeys.slice();
    expected[0] = 278;
    expected[1] = 278;
    expect(await savedKeys(view)).toEqual(expected);
  });

  test("Ctrl+click removes a key from selection and plain click returns to a single selection", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    fireEvent.click(boardKey(view.container, 0), { ctrlKey: true });
    expect(boardKey(view.container, 0)).not.toHaveClass("keyOnFocus");
    expect(boardKey(view.container, 1)).toHaveClass("keyOnFocus");
    fireEvent.click(boardKey(view.container, 0), { ctrlKey: true });
    fireEvent.click(boardKey(view.container, 1));
    expect(boardKey(view.container, 0)).not.toHaveClass("keyOnFocus");
    clickPickerKey(view.container, 22);
    const expected = initialKeys.slice();
    expected[1] = 22;
    expect(await savedKeys(view)).toEqual(expected);
  });

  test("matching assignments show their common selection and changing layers clears the selection", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 2), { ctrlKey: true });
    expect(view.container.querySelectorAll(".keycap.active")).toHaveLength(1);
    fireEvent.change(view.getByRole("combobox", { name: "Fixture layer" }), { target: { value: "1" } });
    expect(view.container.querySelectorAll(".dygma-keyboard-editor .keyOnFocus.keyItem")).toHaveLength(0);
    expect(view.getByRole("tab", { name: /Keys & Shortcuts/ })).toBeDisabled();
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    clickPickerKey(view.container, 22);
    const expected = initialKeys.slice();
    expected[81] = 22;
    expect(await savedKeys(view)).toEqual(expected);
  });

  test("Undo on a combo warning restores every assignment in the batch", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    // Select a Lens key through the shared picker callback.
    fireEvent.mouseDown(view.getByRole("tab", { name: /Layer Lens/ }), { button: 0, ctrlKey: false });
    fireEvent.click(view.getByRole("button", { name: "LENS TAP" }));
    const undo = await view.findByRole("button", { name: /Undo/i });
    fireEvent.click(undo);
    expect(await savedKeys(view)).toEqual(initialKeys);
  });

  test("switching layers in Keyboard view keeps the selected key and LED", async () => {
    const view = await renderEditor();
    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.change(view.getByRole("combobox", { name: "Fixture layer" }), { target: { value: "1" } });
    expect(boardKey(view.container, 0)).toHaveClass("keyOnFocus");
    clickColor(view.container, 1);
    await savedKeys(view);
    await waitFor(() =>
      expect(fixture.command.mock.calls.some(call => call[0] === "colormap.map" && call.length > 1)).toBe(true),
    );
    const saved = fixture.command.mock.calls.find(call => call[0] === "colormap.map" && call.length > 1);
    const colors = saved.slice(1).map(Number);
    expect(colors[0]).toBe(0);
    expect(colors[177]).toBe(1);
  });
});

describe("Layout Editor views and picker", () => {
  test("the palette edits keys and underglow, and hidden underglow cannot remain selected", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    clickColor(view.container, 1);
    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    // Raise 2's first underglow has key index 80 but LED index 69.
    const underglow = view.container.querySelector('.underGlowStrip[data-key-index="80"]');
    expect(underglow).toHaveAttribute("data-led-index", "69");
    fireEvent.click(underglow);
    expect(underglow).toHaveClass("keyOnFocus");
    fireEvent.click(view.getByRole("button", { name: "Expand key picker" }));
    expect(view.getByRole("button", { name: /^No key$/i })).toBeDisabled();
    clickColor(view.container, 1);
    fireEvent.click(view.getByRole("radio", { name: "Keys" }));
    expect(view.container.querySelector(".underGlowStrip")).toBeNull();
    expect(view.getByRole("button", { name: /^No key$/i })).toBeDisabled();
    expect(await savedKeys(view)).toEqual(initialKeys);
    const saved = fixture.command.mock.calls.find(call => call[0] === "colormap.map" && call.length > 1);
    const colors = saved.slice(1).map(Number);
    expect(colors[0]).toBe(1);
    expect(colors[69]).toBe(1);
  });

  test("the palette stays visible and view buttons automatically collapse and expand the picker", async () => {
    const view = await renderEditor();
    const picker = view.container.querySelector("#layout-key-picker");
    const board = view.container.querySelector("svg.raiseKeyboard");
    expect(view.container.querySelector(".colorPalette")).toBeVisible();
    expect(picker).toBeVisible();
    expect(board).toHaveAttribute("viewBox", "0 0 1222 430");

    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    expect(board).toHaveAttribute("viewBox", "0 0 1222 705");
    expect(picker).not.toBeVisible();
    expect(view.getByRole("button", { name: "Expand key picker" })).toHaveAttribute("aria-expanded", "false");
    expect(view.container.querySelector(".colorPalette")).toBeVisible();

    fireEvent.click(view.getByRole("button", { name: "Expand key picker" }));
    expect(picker).toBeVisible();
    expect(board).toHaveAttribute("viewBox", "0 0 1222 705");
    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    expect(picker).not.toBeVisible();

    fireEvent.click(view.getByRole("radio", { name: "Keys" }));
    expect(picker).toBeVisible();
    expect(board).toHaveAttribute("viewBox", "0 0 1222 430");
    fireEvent.click(view.getByRole("button", { name: "Collapse key picker" }));
    expect(picker).not.toBeVisible();
    fireEvent.click(view.getByRole("radio", { name: "Keys" }));
    expect(picker).toBeVisible();
    expect(view.getByRole("button", { name: "Collapse key picker" })).toHaveAttribute("aria-expanded", "true");
  });

  test("Keyboard view supports batch assignments with the picker expanded", async () => {
    const view = await renderEditor();
    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    fireEvent.click(view.getByRole("button", { name: "Expand key picker" }));
    expect(view.container.querySelectorAll(".keycap.active")).toHaveLength(0);
    clickPickerKey(view.container, 23);
    const expected = initialKeys.slice();
    expected[0] = 23;
    expected[1] = 23;
    expect(await savedKeys(view)).toEqual(expected);
  });

  test("manual collapse preserves the selection and active picker tab", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 2));
    fireEvent.mouseDown(view.getByRole("tab", { name: /Layer Lens/ }), { button: 0, ctrlKey: false });
    fireEvent.click(view.getByRole("button", { name: "Collapse key picker" }));
    fireEvent(boardKey(view.container, 2), new WheelEvent("mousewheel", { bubbles: true, deltaY: 100 }));
    fireEvent.click(view.getByRole("button", { name: "Expand key picker" }));
    expect(boardKey(view.container, 2)).toHaveClass("keyOnFocus");
    expect(view.getByRole("tab", { name: /Layer Lens/ })).toHaveAttribute("aria-selected", "true");
    await waitFor(() => expect(view.getByRole("button", { name: "LENS TAP" })).toBeVisible());
  });
});

describe("Layout Editor color selection", () => {
  test("clicking a color applies it to every selected LED, including keys whose LED index differs", async () => {
    initialColors[0] = 2;
    initialColors[39] = 3;
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 9), { ctrlKey: true });
    expect(boardKey(view.container, 9)).toHaveAttribute("data-led-index", "39");
    expect(view.container.querySelectorAll(".colorPickerButton.active")).toHaveLength(0);
    expect(view.startContext).not.toHaveBeenCalled();
    clickColor(view.container, 1);
    expect(paletteButton(view.container, 1)).toHaveClass("active");
    expect(view.startContext).toHaveBeenCalledTimes(1);
    const expected = initialColors.slice();
    expected[0] = 1;
    expected[39] = 1;
    expect(await savedColors(view)).toEqual(expected);
  });

  test("Ctrl removes a key and a regular click replaces the color selection without painting", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    fireEvent.click(boardKey(view.container, 0), { ctrlKey: true });
    clickColor(view.container, 2);
    expect(boardKey(view.container, 0)).not.toHaveClass("keyOnFocus");
    expect(boardKey(view.container, 1)).toHaveClass("keyOnFocus");
    fireEvent.click(boardKey(view.container, 2));
    // Selecting another key after coloring only reads its current color.
    expect(paletteButton(view.container, 0)).toHaveClass("active");
    expect(view.startContext).toHaveBeenCalledTimes(1);
    clickColor(view.container, 3);
    const expected = initialColors.slice();
    expected[1] = 2;
    expected[2] = 3;
    expect(await savedColors(view)).toEqual(expected);
  });

  test("selecting a swatch with no keys selected never paints later selections", async () => {
    const view = await renderEditor();
    clickColor(view.container, 1);
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    expect(view.startContext).not.toHaveBeenCalled();
    expect(await savedColors(view)).toEqual(initialColors);
  });

  test("repeatedly clicking the same color is a no-op and keeps the color selected", async () => {
    const view = await renderEditor();
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(boardKey(view.container, 1), { ctrlKey: true });
    clickColor(view.container, 1);
    clickColor(view.container, 1);
    expect(paletteButton(view.container, 1)).toHaveClass("active");
    expect(view.startContext).toHaveBeenCalledTimes(1);
    expect(boardKey(view.container, 0)).toHaveClass("keyOnFocus");
    expect(boardKey(view.container, 1)).toHaveClass("keyOnFocus");
    const expected = initialColors.slice();
    expected[0] = 1;
    expected[1] = 1;
    expect(await savedColors(view)).toEqual(expected);
  });

  test("keys and multiple underglow segments share selection and can be colored together", async () => {
    const view = await renderEditor();
    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(underglowKey(view.container, 80), { ctrlKey: true });
    fireEvent.click(underglowKey(view.container, 81), { ctrlKey: true });
    expect(boardKey(view.container, 0)).toHaveClass("keyOnFocus");
    expect(underglowKey(view.container, 80)).toHaveClass("keyOnFocus");
    expect(underglowKey(view.container, 81)).toHaveClass("keyOnFocus");
    clickColor(view.container, 4);
    // Removing one segment must remove its highlight and leave other selections.
    fireEvent.click(underglowKey(view.container, 80), { ctrlKey: true });
    expect(underglowKey(view.container, 80)).not.toHaveClass("keyOnFocus");
    expect(underglowKey(view.container, 81)).toHaveClass("keyOnFocus");
    clickColor(view.container, 5);
    const expected = initialColors.slice();
    expected[0] = 5;
    expected[69] = 4;
    expected[70] = 5;
    expect(await savedColors(view)).toEqual(expected);
  });

  test("returning to Keys keeps selected keys and drops underglow from later color changes", async () => {
    const view = await renderEditor();
    fireEvent.click(view.getByRole("radio", { name: "Keyboard" }));
    fireEvent.click(boardKey(view.container, 0));
    fireEvent.click(underglowKey(view.container, 80), { ctrlKey: true });
    fireEvent.click(view.getByRole("radio", { name: "Keys" }));
    expect(boardKey(view.container, 0)).toHaveClass("keyOnFocus");
    clickColor(view.container, 1);
    const expected = initialColors.slice();
    expected[0] = 1;
    expect(await savedColors(view)).toEqual(expected);
  });
});

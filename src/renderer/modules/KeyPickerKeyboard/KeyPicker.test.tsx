import React, { useState } from "react";
import { afterEach, describe, expect, test, vi } from "vitest";
import { cleanup, fireEvent, render } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ThemeProvider } from "styled-components";
import Light from "@Renderer/theme/LightTheme";
import KeyPicker from "./KeyPicker";
import getLanguage from "./KeyPickerLanguage";

afterEach(cleanup);

function PickerHarness({ initialCode = 0 }: { initialCode?: number }) {
  const [keyCode, setKeyCode] = useState(initialCode);
  return (
    <ThemeProvider theme={Light}>
      <output data-testid="assignment">{keyCode}</output>
      <KeyPicker
        code={{ base: keyCode % 256, modified: keyCode - (keyCode % 256) }}
        onKeySelect={setKeyCode}
        disableMods={false}
        disableAll={false}
        selectedlanguage="en-US"
        toggleModifiers
      />
    </ThemeProvider>
  );
}

function keycap(container: HTMLElement, keyCode: number) {
  const index = getLanguage("en-US").findIndex(key => key.id === keyCode);
  const key = container.querySelector(`.keycap.id-${index}`);
  if (!key) throw new Error(`Missing key ${keyCode}`);
  return key;
}

function clickKey(container: HTMLElement, keyCode: number) {
  fireEvent.click(keycap(container, keyCode).querySelector(".shapeKey"));
}

describe("modifier selection on the keyboard", () => {
  test.each([
    { left: 224, right: 228 },
    { left: 225, right: 229 },
    { left: 227, right: 231 },
  ])("keeps standalone modifiers $left and $right distinct", ({ left, right }) => {
    const { container, getByTestId } = render(<PickerHarness initialCode={left} />);
    expect(keycap(container, left)).toHaveClass("active");
    expect(keycap(container, right)).not.toHaveClass("active");
    clickKey(container, right);
    expect(getByTestId("assignment").textContent).toBe(String(right));
    expect(keycap(container, left)).not.toHaveClass("active");
    expect(keycap(container, right)).toHaveClass("active");
    clickKey(container, left);
    expect(getByTestId("assignment").textContent).toBe(String(left));
    clickKey(container, left);
    expect(getByTestId("assignment").textContent).toBe("0");
  });

  test.each([
    { modifier: 224, expected: 260, highlighted: 224 },
    { modifier: 225, expected: 2052, highlighted: 225 },
    { modifier: 226, expected: 516, highlighted: 226 },
    { modifier: 227, expected: 4100, highlighted: 227 },
    { modifier: 228, expected: 260, highlighted: 224 },
    { modifier: 229, expected: 2052, highlighted: 225 },
    { modifier: 230, expected: 1028, highlighted: 230 },
    { modifier: 231, expected: 4100, highlighted: 227 },
  ])("toggles modifier $modifier on an existing A assignment", ({ modifier, expected, highlighted }) => {
    const { container, getByTestId } = render(<PickerHarness initialCode={4} />);
    clickKey(container, modifier);
    expect(getByTestId("assignment").textContent).toBe(String(expected));
    expect(keycap(container, highlighted)).toHaveClass("active");
    if ([224, 225, 227].includes(highlighted)) {
      expect(keycap(container, highlighted + 4)).not.toHaveClass("active");
    }
    clickKey(container, modifier);
    expect(getByTestId("assignment").textContent).toBe("4");
    expect(keycap(container, highlighted)).not.toHaveClass("active");
  });

  test("builds Ctrl+Alt+A, replaces only A, and toggles modifiers off", () => {
    const { container, getByTestId } = render(<PickerHarness />);

    clickKey(container, 224); // Ctrl
    clickKey(container, 226); // Alt
    clickKey(container, 4); // A
    expect(getByTestId("assignment")).toHaveTextContent("772");
    expect(keycap(container, 224)).toHaveClass("active");
    expect(keycap(container, 226)).toHaveClass("active");
    expect(keycap(container, 4)).toHaveClass("active");

    clickKey(container, 22); // S
    expect(getByTestId("assignment")).toHaveTextContent("790");
    expect(keycap(container, 4)).not.toHaveClass("active");
    expect(keycap(container, 22)).toHaveClass("active");

    clickKey(container, 224);
    expect(getByTestId("assignment")).toHaveTextContent("534"); // Alt+S
    expect(keycap(container, 224)).not.toHaveClass("active");
    clickKey(container, 226);
    expect(getByTestId("assignment")).toHaveTextContent("22");
    expect(keycap(container, 226)).not.toHaveClass("active");
  });

  test("can toggle every modifier off before choosing an ordinary key", () => {
    const { container, getByTestId } = render(<PickerHarness />);
    clickKey(container, 224);
    clickKey(container, 226);
    clickKey(container, 224);
    expect(getByTestId("assignment")).toHaveTextContent("226");
    clickKey(container, 226);
    expect(getByTestId("assignment").textContent).toBe("0");
    clickKey(container, 4);
    expect(getByTestId("assignment").textContent).toBe("4");
  });

  test.each([
    { initialCode: 260, modifierOnly: 224, nextAssignment: 278 }, // Ctrl+A
    { initialCode: 772, modifierOnly: 736, nextAssignment: 790 }, // Ctrl+Alt+A
    { initialCode: 1028, modifierOnly: 230, nextAssignment: 1046 }, // AltGr+A
  ])("clicking A again on $initialCode leaves only modifiers", ({ initialCode, modifierOnly, nextAssignment }) => {
    const { container, getByTestId } = render(<PickerHarness initialCode={initialCode} />);
    clickKey(container, 4);
    expect(getByTestId("assignment").textContent).toBe(String(modifierOnly));
    expect(keycap(container, 4)).not.toHaveClass("active");
    clickKey(container, 22); // Selecting S keeps those modifiers.
    expect(getByTestId("assignment").textContent).toBe(String(nextAssignment));
    expect(keycap(container, 22)).toHaveClass("active");
  });

  test("clicking an unmodified key again keeps its assignment", () => {
    const { container, getByTestId } = render(<PickerHarness initialCode={4} />);
    clickKey(container, 4);
    expect(getByTestId("assignment").textContent).toBe("4");
    expect(keycap(container, 4)).toHaveClass("active");
  });

  test("reads the selected assignment when switching physical keys", () => {
    const onKeySelect = vi.fn();
    const picker = (keyCode: number) => (
      <ThemeProvider theme={Light}>
        <KeyPicker
          code={{ base: keyCode % 256, modified: keyCode - (keyCode % 256) }}
          onKeySelect={onKeySelect}
          disableMods={false}
          disableAll={false}
          selectedlanguage="en-US"
          toggleModifiers
        />
      </ThemeProvider>
    );
    const { container, rerender } = render(picker(772));
    rerender(picker(5)); // Switch from Ctrl+Alt+A to a plain B assignment.
    expect(keycap(container, 224)).not.toHaveClass("active");
    clickKey(container, 22);
    expect(onKeySelect).toHaveBeenLastCalledWith(22);
    rerender(picker(65535)); // Transparent must not supply modifier flags.
    clickKey(container, 4);
    expect(onKeySelect).toHaveBeenLastCalledWith(4);
  });
});

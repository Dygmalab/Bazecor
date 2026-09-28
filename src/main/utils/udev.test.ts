import { describe, expect, it, vi } from "vitest";
import { udevRulesToWrite } from "./udev";

vi.mock("electron", () => ({
  BrowserWindow: vi.fn(),
  dialog: { showMessageBox: vi.fn() },
}));
vi.mock("electron-log/main", () => ({ default: { error: vi.fn(), verbose: vi.fn() } }));
vi.mock("sudo-prompt", () => ({ exec: vi.fn() }));

// A single udev rule line is a comma-separated list of "KEY<op>VALUE" clauses,
// e.g. SUBSYSTEMS=="usb", ATTRS{idVendor}=="1209", TAG+="uaccess". This is a
// coarse sanity check, not a full udev grammar parser: it catches the kind of
// typo (stray comma, unquoted value, unknown operator) that would silently
// break device detection, without needing udevadm (Linux-only) to validate.
const RULE_CLAUSE = /^[A-Z]+(\{[^}]+\})?(==|!=|\+=|=)"[^"]*"$/;

function ruleLines(): string[] {
  return udevRulesToWrite
    .split("\n")
    .map(line => line.trim())
    .filter(line => line.length > 0 && !line.startsWith("#"));
}

describe("udevRulesToWrite", () => {
  it("only contains syntactically well-formed udev rule lines", () => {
    const lines = ruleLines();
    expect(lines.length).toBeGreaterThan(0);
    lines.forEach(line => {
      const clauses = line.split(",").map(c => c.trim());
      clauses.forEach(clause => {
        expect(clause).toMatch(RULE_CLAUSE);
      });
    });
  });

  it("does not grant uaccess to the keyboard's raw input (evdev) subsystem for the broad vendor/product matches", () => {
    // These are the rules that match on ATTRS{idVendor}/ATTRS{idProduct} of an
    // ancestor USB device without otherwise restricting the current device's
    // own subsystem. Without SUBSYSTEM!="input" they also tag the evdev node
    // (/dev/input/eventX) created for the keyboard's HID interface, letting
    // any local process read raw keystrokes. See Dygmalab/Bazecor#1148.
    const broadUsbMatchLines = ruleLines().filter(line => line.includes('SUBSYSTEMS=="usb"'));

    expect(broadUsbMatchLines.length).toBe(4);
    broadUsbMatchLines.forEach(line => {
      expect(line).toContain('SUBSYSTEM!="input"');
    });
  });

  it("still restricts hidraw access to the Dygma vendor ID, unaffected by the input-subsystem guard", () => {
    const hidrawLines = ruleLines().filter(line => line.startsWith('KERNEL=="hidraw*"'));

    expect(hidrawLines.length).toBe(2);
    hidrawLines.forEach(line => {
      expect(line).toContain('ATTRS{idVendor}=="35ef"');
      expect(line).toContain('TAG+="uaccess"');
    });
  });

  it("keeps the existing vendor/product IDs so device detection is unaffected", () => {
    expect(udevRulesToWrite).toContain('ATTRS{idProduct}=="2200"');
    expect(udevRulesToWrite).toContain('ATTRS{idProduct}=="2201"');
    expect(udevRulesToWrite).toContain('ATTRS{idVendor}=="1209"');
    expect(udevRulesToWrite).toContain('ATTRS{idVendor}=="35ef"');
  });
});

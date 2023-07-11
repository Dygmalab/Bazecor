import { test, vi, expect } from "vitest";
import { configureUSB, getDevices } from "../setup/configureUSB";

test("get list of USB devices", async () => {
  vi.mock("electron", async () => {
    const mockIpcMain = {
      handle: vi.fn().mockReturnThis(),
    };
    return {
      ipcMain: mockIpcMain,
    };
  });
  await configureUSB();
  const devices = getDevices();
  if (!process.env.GITHUB_ACTIONS) {
    expect(devices.length).toBeGreaterThan(0);
  }
});

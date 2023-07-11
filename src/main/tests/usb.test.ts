import { test, vi } from "vitest";
import { configureUSB, getDevices } from "../setup/configureUSB";
import { ipcRenderer, ipcMain } from "electron";

test("get list of USB devices", async () => {
  vi.mock("electron", async () => {
    const realStuff = await vi.importActual("electron");
    const mockIpcMain = {
      handle: vi.fn().mockReturnThis(),
    };
    return {
      ipcMain: mockIpcMain,
    };
  });
  await configureUSB();
  const devices = getDevices({});
  console.log(devices);
});

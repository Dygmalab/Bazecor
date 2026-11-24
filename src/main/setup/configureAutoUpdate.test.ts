import { beforeEach, describe, expect, test, vi } from "vitest";
import { makeUserNotifier, updateElectronApp } from "update-electron-app";
import configureAutoUpdate from "./configureAutoUpdate";

const notifier = vi.hoisted(() => () => {});

vi.mock("electron-log/main", () => ({ default: {} }));
vi.mock("../managers/Store", () => ({ default: { getStore: () => ({ get: () => true }) } }));
vi.mock("update-electron-app", () => ({
  UpdateSourceType: { ElectronPublicUpdateService: 0 },
  updateElectronApp: vi.fn(),
  makeUserNotifier: vi.fn(() => notifier),
}));

describe.skipIf(process.platform === "linux")("update dialog", () => {
  beforeEach(() => vi.clearAllMocks());

  test("names Bazecor in the title, the text and the restart button", () => {
    configureAutoUpdate();
    const [{ title, detail, restartButtonText }] = vi.mocked(makeUserNotifier).mock.calls[0];
    [title, detail, restartButtonText].forEach(text => expect(text).toContain("Bazecor"));
    expect(vi.mocked(updateElectronApp).mock.calls[0][0]).toMatchObject({ notifyUser: true, onNotifyUser: notifier });
  });
});

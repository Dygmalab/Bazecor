import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import DeviceMap from "./DeviceMap";
import log from "electron-log/renderer";


describe('DeviceMap', () => {
  beforeEach(() => {
    vi.mock("electron-log/renderer", () => ({
      default: {
        error: vi.fn(),
        warn: vi.fn(),
        info: vi.fn(),
        verbose: vi.fn(),
        debug: vi.fn(),
        silly: vi.fn(),
      },
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should return false with new key', async () => {
    const map = new DeviceMap();
    expect(map.isUpdated("key", "value")).toBe(false);

    expect(log.warn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith("comparison between keys", false, undefined, "value");
  });
  it('should return false with differing values', async () => {
    const map = new DeviceMap();
    map.set("key", "original");
    expect(map.isUpdated("key", "value")).toBe(false);

    expect(log.warn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith("comparison between keys", false, "original", "value");

  });
  it('should return true with same value', async () => {
    const map = new DeviceMap();
    map.set("key", "value");
    expect(map.isUpdated("key", "value")).toBe(true);

    expect(log.warn).toHaveBeenCalledTimes(1);
    expect(log.warn).toHaveBeenCalledWith("comparison between keys", true, "value", "value");
  });
});

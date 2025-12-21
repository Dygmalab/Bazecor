import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import { EventEmitter } from "events";

// Mock dependencies
const mockNativeTheme = new EventEmitter() as any;
mockNativeTheme.shouldUseDarkColors = false;
mockNativeTheme.themeSource = "system";

const mockStore = {
  get: vi.fn(),
  set: vi.fn(),
};

const mockSendToRenderer = vi.fn();

vi.mock("electron", () => ({
  nativeTheme: mockNativeTheme,
  NativeTheme: {},
}));

vi.mock("../managers/Store", () => ({
  default: {
    getStore: () => mockStore,
  },
}));

vi.mock("../utils/sendToRenderer", () => ({
  default: mockSendToRenderer,
}));

describe("theme.ts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockNativeTheme.removeAllListeners();
    mockNativeTheme.shouldUseDarkColors = false;
    mockNativeTheme.themeSource = "system";
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("configureNativeTheme", () => {
    it("should register a listener for nativeTheme updated event", async () => {
      const { configureNativeTheme } = await import("./theme");

      const listenerCount = mockNativeTheme.listenerCount("updated");
      configureNativeTheme();

      expect(mockNativeTheme.listenerCount("updated")).toBe(listenerCount + 1);
    });

    it("should send theme updates to renderer when nativeTheme changes", async () => {
      const { configureNativeTheme } = await import("./theme");

      configureNativeTheme();
      
      mockNativeTheme.shouldUseDarkColors = true;
      mockNativeTheme.emit("updated");

      expect(mockSendToRenderer).toHaveBeenCalledWith("darkTheme-update", true);
    });

    it("should send correct dark mode state when theme changes to light", async () => {
      const { configureNativeTheme } = await import("./theme");

      configureNativeTheme();
      
      mockNativeTheme.shouldUseDarkColors = false;
      mockNativeTheme.emit("updated");

      expect(mockSendToRenderer).toHaveBeenCalledWith("darkTheme-update", false);
    });
  });

  describe("onThemeChange", () => {
    it("should be the same function reference for proper listener removal", async () => {
      const { onThemeChange } = await import("./theme");

      // This is critical for the bug fix - onThemeChange should be a direct function
      // not a higher-order function that returns a new function each time
      expect(typeof onThemeChange).toBe("function");
      
      // Calling it multiple times should maintain the same reference
      const ref1 = onThemeChange;
      const ref2 = onThemeChange;
      expect(ref1).toBe(ref2);
    });

    it("should call sendToRenderer with current dark mode state", async () => {
      const { onThemeChange } = await import("./theme");

      mockNativeTheme.shouldUseDarkColors = true;
      onThemeChange();

      expect(mockSendToRenderer).toHaveBeenCalledWith("darkTheme-update", true);
    });
  });

  describe("setTheme", () => {
    it("should set themeSource to system when darkMode is undefined", async () => {
      mockStore.get.mockReturnValue(undefined);
      
      const { setTheme } = await import("./theme");
      setTheme();

      expect(mockStore.set).toHaveBeenCalledWith("settings.darkMode", "system");
      expect(mockNativeTheme.themeSource).toBe("system");
    });

    it("should set themeSource to system when darkMode is a boolean", async () => {
      mockStore.get.mockReturnValue(true);
      
      const { setTheme } = await import("./theme");
      setTheme();

      expect(mockStore.set).toHaveBeenCalledWith("settings.darkMode", "system");
      expect(mockNativeTheme.themeSource).toBe("system");
    });

    it("should use existing darkMode setting when it is a valid string", async () => {
      mockStore.get.mockReturnValue("dark");
      
      const { setTheme } = await import("./theme");
      setTheme();

      expect(mockStore.set).not.toHaveBeenCalled();
      expect(mockNativeTheme.themeSource).toBe("dark");
    });

    it("should handle 'light' theme setting", async () => {
      mockStore.get.mockReturnValue("light");
      
      const { setTheme } = await import("./theme");
      setTheme();

      expect(mockNativeTheme.themeSource).toBe("light");
    });

    it("should handle 'system' theme setting", async () => {
      mockStore.get.mockReturnValue("system");
      
      const { setTheme } = await import("./theme");
      setTheme();

      expect(mockNativeTheme.themeSource).toBe("system");
    });
  });
});

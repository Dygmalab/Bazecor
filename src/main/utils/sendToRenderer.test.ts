import { describe, expect, it, vi, beforeEach } from "vitest";
import { BrowserWindow } from "electron";

// Mock dependencies
const mockWindow = {
  webContents: {
    send: vi.fn(),
  },
  isDestroyed: vi.fn(),
} as unknown as BrowserWindow;

const mockWindowManager = {
  getWindow: vi.fn(),
};

vi.mock("../managers/Window", () => ({
  default: mockWindowManager,
}));

describe("sendToRenderer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockWindow.webContents.send = vi.fn();
    mockWindow.isDestroyed = vi.fn().mockReturnValue(false);
    mockWindowManager.getWindow.mockReturnValue(mockWindow);
  });

  it("should send message to renderer when window exists and is not destroyed", async () => {
    const sendToRenderer = (await import("./sendToRenderer")).default;

    sendToRenderer("test-channel", "arg1", "arg2");

    expect(mockWindow.webContents.send).toHaveBeenCalledWith("test-channel", "arg1", "arg2");
  });

  it("should send message with multiple arguments", async () => {
    const sendToRenderer = (await import("./sendToRenderer")).default;

    sendToRenderer("multi-arg-channel", 1, "two", { three: 3 }, [4, 5]);

    expect(mockWindow.webContents.send).toHaveBeenCalledWith(
      "multi-arg-channel",
      1,
      "two",
      { three: 3 },
      [4, 5]
    );
  });

  it("should send message with no additional arguments", async () => {
    const sendToRenderer = (await import("./sendToRenderer")).default;

    sendToRenderer("no-args-channel");

    expect(mockWindow.webContents.send).toHaveBeenCalledWith("no-args-channel");
  });

  it("should not crash when window is null", async () => {
    mockWindowManager.getWindow.mockReturnValue(null);
    const sendToRenderer = (await import("./sendToRenderer")).default;

    expect(() => {
      sendToRenderer("test-channel", "data");
    }).not.toThrow();

    expect(mockWindow.webContents.send).not.toHaveBeenCalled();
  });

  it("should not send message when window is destroyed", async () => {
    mockWindow.isDestroyed = vi.fn().mockReturnValue(true);
    const sendToRenderer = (await import("./sendToRenderer")).default;

    sendToRenderer("test-channel", "data");

    expect(mockWindow.webContents.send).not.toHaveBeenCalled();
  });

  it("should handle window becoming null after initial check", async () => {
    mockWindowManager.getWindow.mockReturnValue(null);
    const sendToRenderer = (await import("./sendToRenderer")).default;

    // Should not throw even if window is null
    expect(() => {
      sendToRenderer("test-channel");
    }).not.toThrow();
  });

  it("should send darkTheme-update messages correctly", async () => {
    const sendToRenderer = (await import("./sendToRenderer")).default;

    sendToRenderer("darkTheme-update", true);

    expect(mockWindow.webContents.send).toHaveBeenCalledWith("darkTheme-update", true);
  });

  it("should handle multiple sequential sends", async () => {
    const sendToRenderer = (await import("./sendToRenderer")).default;

    sendToRenderer("channel1", "data1");
    sendToRenderer("channel2", "data2");
    sendToRenderer("channel3", "data3");

    expect(mockWindow.webContents.send).toHaveBeenCalledTimes(3);
    expect(mockWindow.webContents.send).toHaveBeenNthCalledWith(1, "channel1", "data1");
    expect(mockWindow.webContents.send).toHaveBeenNthCalledWith(2, "channel2", "data2");
    expect(mockWindow.webContents.send).toHaveBeenNthCalledWith(3, "channel3", "data3");
  });

  describe("race condition protection", () => {
    it("should safely handle window being destroyed between getWindow and send", async () => {
      // Simulate window being destroyed after getWindow but before send
      mockWindow.isDestroyed = vi.fn().mockReturnValue(true);
      const sendToRenderer = (await import("./sendToRenderer")).default;

      expect(() => {
        sendToRenderer("test-channel", "data");
      }).not.toThrow();

      expect(mockWindow.webContents.send).not.toHaveBeenCalled();
    });

    it("should check both null and isDestroyed states", async () => {
      // First call with null window
      mockWindowManager.getWindow.mockReturnValueOnce(null);
      const sendToRenderer = (await import("./sendToRenderer")).default;

      sendToRenderer("test1");
      expect(mockWindow.webContents.send).not.toHaveBeenCalled();

      // Second call with destroyed window
      mockWindowManager.getWindow.mockReturnValueOnce(mockWindow);
      mockWindow.isDestroyed = vi.fn().mockReturnValue(true);

      sendToRenderer("test2");
      expect(mockWindow.webContents.send).not.toHaveBeenCalled();

      // Third call with valid window
      mockWindow.isDestroyed = vi.fn().mockReturnValue(false);
      mockWindowManager.getWindow.mockReturnValueOnce(mockWindow);

      sendToRenderer("test3");
      expect(mockWindow.webContents.send).toHaveBeenCalledWith("test3");
      expect(mockWindow.webContents.send).toHaveBeenCalledTimes(1);
    });
  });
});

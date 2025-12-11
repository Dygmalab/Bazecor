import React from "react";
import { describe, expect, test, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { KeyLabelsProvider, useKeyLabels } from "./KeyLabelsContext";

// Mock electron ipcRenderer
vi.mock("electron", () => ({
  ipcRenderer: {
    invoke: vi.fn(),
  },
}));

describe("KeyLabelsContext", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <KeyLabelsProvider deviceId="test-device">{children}</KeyLabelsProvider>
  );

  test("getLabel returns undefined for unlabeled key", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    // Wait for loading to complete
    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(0, 0)).toBeUndefined();
  });

  test("setLabel adds a new label", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({ version: 1, deviceId: "test-device", labels: [] });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setLabel(5, 0, "Test Label", false);
    });

    expect(result.current.getLabel(5, 0)).toBe("Test Label");
  });

  test("getLabel returns global label as fallback", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [{ keyPosition: 5, layer: -1, label: "Global Label" }],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    // Should return global label for any layer
    expect(result.current.getLabel(5, 0)).toBe("Global Label");
    expect(result.current.getLabel(5, 3)).toBe("Global Label");
  });

  test("layer-specific label takes precedence over global", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [
        { keyPosition: 5, layer: -1, label: "Global Label" },
        { keyPosition: 5, layer: 0, label: "Layer 0 Label" },
      ],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(5, 0)).toBe("Layer 0 Label");
    expect(result.current.getLabel(5, 1)).toBe("Global Label");
  });

  test("removeLabel removes the label", async () => {
    const { ipcRenderer } = await import("electron");
    vi.mocked(ipcRenderer.invoke).mockResolvedValue({
      version: 1,
      deviceId: "test-device",
      labels: [{ keyPosition: 5, layer: 0, label: "Test Label" }],
    });

    const { result } = renderHook(() => useKeyLabels(), { wrapper });

    await vi.waitFor(() => expect(result.current.isLoading).toBe(false));

    expect(result.current.getLabel(5, 0)).toBe("Test Label");

    act(() => {
      result.current.removeLabel(5, 0);
    });

    expect(result.current.getLabel(5, 0)).toBeUndefined();
  });
});

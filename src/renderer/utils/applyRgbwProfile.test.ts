import { describe, expect, it, vi } from "vitest";
import type { Neuron } from "@Renderer/types/neurons";
import { applyRgbwProfile } from "./applyRgbwProfile";

const previousPalette = "10 20 30 4 40 50 60 7";
const convertedPalette = ["3", "13", "23", "11", "3", "13", "23", "44"];

function setup() {
  const calls: string[] = [];
  let readCount = 0;
  const device = {
    serialNumber: "serial-a",
    path: "/dev/a",
    isClosed: false,
    device: { RGBWMode: true, info: { product: "Raise 2" } },
    noCacheCommand: vi.fn(async (command: string, ...args: string[]) => {
      calls.push(args.length ? `write:${command}` : `read:${command}`);
      if (args.length) return "";
      readCount += 1;
      return readCount === 1 ? previousPalette : convertedPalette.join(" ");
    }),
  };
  let currentDevice: typeof device | undefined = device;
  let neurons: Neuron[] = [{ id: "neuron-a", name: "A", layers: [], macros: [], superkeys: [], rgbwProfileId: "vivid" }];
  const setNeurons = vi.fn((next: typeof neurons) => {
    calls.push("store");
    neurons = next;
  });

  return {
    calls,
    device,
    getCurrentDevice: () => currentDevice,
    setCurrentDevice: (next: typeof device | undefined) => {
      currentDevice = next;
    },
    getNeurons: () => neurons,
    setNeurons,
    args: {
      device,
      getCurrentDevice: () => currentDevice,
      targetNeuronId: "neuron-a",
      previousProfileId: "vivid",
      profileId: "balanced" as const,
      getNeurons: () => neurons,
      setNeurons,
    },
  };
}

describe("applyRgbwProfile", () => {
  it("reads, writes, verifies, then commits only the target profile", async () => {
    const test = setup();

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({ ok: true });

    expect(test.calls).toEqual(["read:palette", "write:palette", "read:palette", "store"]);
    expect(test.getNeurons()[0].rgbwProfileId).toBe("balanced");
    expect(test.device.noCacheCommand).toHaveBeenNthCalledWith(2, "palette", ...convertedPalette);
  });

  it("normalizes palette whitespace within the profile apply boundary", async () => {
    const test = setup();
    test.device.noCacheCommand
      .mockResolvedValueOnce("10  20\n30\t4 40 50 60 7")
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce(convertedPalette.join(" "));

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({ ok: true });
    expect(test.device.noCacheCommand).toHaveBeenNthCalledWith(2, "palette", ...convertedPalette);
  });

  it("recovers after a rejected write", async () => {
    const test = setup();
    test.device.noCacheCommand
      .mockResolvedValueOnce(previousPalette)
      .mockRejectedValueOnce(new Error("transport"))
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce(previousPalette);

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({ ok: false, reason: "write-failed", recovery: "restored" });
  });

  it("recovers after a rejected verification read", async () => {
    const test = setup();
    test.device.noCacheCommand
      .mockResolvedValueOnce(previousPalette)
      .mockResolvedValueOnce("")
      .mockRejectedValueOnce(new Error("transport"))
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce(previousPalette);

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({
      ok: false,
      reason: "readback-failed",
      recovery: "restored",
    });
  });

  it("recovers after Store access fails", async () => {
    const test = setup();
    test.args.getNeurons = vi.fn(() => {
      throw new Error("store failed");
    });
    test.device.noCacheCommand
      .mockResolvedValueOnce(previousPalette)
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce(convertedPalette.join(" "))
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce(previousPalette);

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({
      ok: false,
      reason: "metadata-failed",
      recovery: "restored",
    });
  });

  it.each([undefined, new Error("transport")])(
    "rejects a returned %s write result and restores the raw palette",
    async result => {
      const test = setup();
      test.device.noCacheCommand
        .mockResolvedValueOnce(previousPalette)
        .mockResolvedValueOnce(result as unknown as string)
        .mockResolvedValueOnce("")
        .mockResolvedValueOnce(previousPalette);

      await expect(applyRgbwProfile(test.args)).resolves.toEqual({ ok: false, reason: "write-failed", recovery: "restored" });
      expect(test.setNeurons).not.toHaveBeenCalled();
      expect(test.device.noCacheCommand).toHaveBeenNthCalledWith(3, "palette", ...previousPalette.split(" "));
    },
  );

  it("restores the captured device when selection changes after the write", async () => {
    const test = setup();
    const replacement = { ...test.device, serialNumber: "serial-b", noCacheCommand: vi.fn() };
    test.device.noCacheCommand
      .mockImplementationOnce(async () => previousPalette)
      .mockImplementationOnce(async () => {
        test.setCurrentDevice(replacement);
        return "";
      });

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({ ok: false, reason: "stale-session", recovery: "restored" });
    expect(replacement.noCacheCommand).not.toHaveBeenCalled();
    expect(test.device.noCacheCommand).toHaveBeenCalledWith("palette", ...previousPalette.split(" "));
  });

  it("rejects a concurrent metadata change and restores hardware", async () => {
    const test = setup();
    test.device.noCacheCommand
      .mockImplementationOnce(async () => previousPalette)
      .mockImplementationOnce(async () => "")
      .mockImplementationOnce(async () => {
        test.getNeurons()[0].rgbwProfileId = "efficient";
        return convertedPalette.join(" ");
      });

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({
      ok: false,
      reason: "metadata-conflict",
      recovery: "restored",
    });
    expect(test.setNeurons).not.toHaveBeenCalled();
  });

  it("reports unknown hardware state when rollback readback does not match", async () => {
    const test = setup();
    test.device.noCacheCommand
      .mockResolvedValueOnce(previousPalette)
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce("0 0 0 0 0 0 0 0")
      .mockResolvedValueOnce("")
      .mockResolvedValueOnce("1 1 1 1 1 1 1 1");

    await expect(applyRgbwProfile(test.args)).resolves.toEqual({
      ok: false,
      reason: "readback-mismatch",
      recovery: "failed",
    });
    expect(test.setNeurons).not.toHaveBeenCalled();
  });
});

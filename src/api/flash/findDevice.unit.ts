import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { DeviceTools } from "@Renderer/DeviceContext";
import { findDevice } from "./findDevice";
import { DefyWired, DefyWiredBootloader } from "../hardware-dygma-defy-wired";
import { Raise2ANSI } from "../hardware-dygma-raise2-ansi";

const connectedDevices = [
  {
    manufacturer: "",
    serialNumber: "",
    pnpId: "",
    locationId: "",
    vendorId: "35ef",
    path: "Defy-Wired",
    productId: "0010",
    device: { ...DefyWired },
  },
  {
    manufacturer: "",
    serialNumber: "",
    pnpId: "",
    locationId: "",
    vendorId: "35ef",
    path: "Defy-Wired-Bootloader",
    productId: "0011",
    device: { ...DefyWiredBootloader },
  },
  {
    manufacturer: "",
    serialNumber: "",
    pnpId: "",
    locationId: "",
    vendorId: "35ef",
    path: "Dygma-Raise-2-ANSI",
    productId: "0021",
    device: { ...Raise2ANSI },
  },
];

describe("findDevices", () => {
  beforeEach(() => {
    vi.mock("../../renderer/DeviceContext.tsx", async importOriginal => {
      const data = await importOriginal<typeof import("../../renderer/DeviceContext.tsx")>();
      const val = {
        ...data,
      };
      val.DeviceTools.enumerateSerial = vi.fn();
      return val;
    });

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

  it("should find no device when none connected", async () => {
    vi.mocked(DeviceTools).enumerateSerial.mockResolvedValue({ foundDevices: [], validDevices: [] });

    expect(await findDevice("serial", undefined)).toBeUndefined();

    expect(log.info).toHaveBeenCalledTimes(2);
    expect(log.info).toHaveBeenCalledWith("Going to list devices for type: serial");
    expect(log.info).toHaveBeenCalledWith("keyboard detected", undefined);

    expect(log.verbose).toHaveBeenCalledTimes(1);
    expect(log.verbose).toHaveBeenCalledWith("List of Devices: ", []);
  });

  it("should find a device", async () => {
    vi.mocked(DeviceTools).enumerateSerial.mockResolvedValue({
      foundDevices: connectedDevices,
      validDevices: [],
    });

    expect(await findDevice("serial", undefined)).toEqual(connectedDevices[0]);

    expect(log.info).toHaveBeenCalledTimes(5);
    expect(log.info).toHaveBeenCalledWith("Going to list devices for type: serial");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: false & HW: undefined | KBType - Lookup: ISO & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: false & HW: undefined | KBType - Lookup: ANSI & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: false & HW: undefined | KBType - Lookup: wired & HW: wired");
    expect(log.info).toHaveBeenCalledWith("keyboard detected", connectedDevices[0]);

    expect(log.verbose).toHaveBeenCalledTimes(1);
    expect(log.verbose).toHaveBeenCalledWith("List of Devices: ", connectedDevices);
  });

  it("should find a wireless device", async () => {
    vi.mocked(DeviceTools).enumerateSerial.mockResolvedValue({
      foundDevices: connectedDevices,
      validDevices: [],
    });

    expect(await findDevice("serial", connectedDevices[2].device)).toEqual(connectedDevices[2]);

    expect(log.info).toHaveBeenCalledTimes(5);
    expect(log.info).toHaveBeenCalledWith("Going to list devices for type: serial");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: false & HW: undefined | KBType - Lookup: ANSI & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: false & HW: true | KBType - Lookup: ANSI & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: false & HW: false | KBType - Lookup: ANSI & HW: ANSI");
    expect(log.info).toHaveBeenCalledWith("keyboard detected", connectedDevices[2]);

    expect(log.verbose).toHaveBeenCalledTimes(1);
    expect(log.verbose).toHaveBeenCalledWith("List of Devices: ", connectedDevices);
  });

  it("should finds a bootloader", async () => {
    vi.mocked(DeviceTools).enumerateSerial.mockResolvedValue({
      foundDevices: connectedDevices,
      validDevices: [],
    });

    expect(await findDevice("bootloader", undefined)).toEqual(connectedDevices[1]);

    expect(log.info).toHaveBeenCalledTimes(11);
    expect(log.info).toHaveBeenCalledWith("Going to list devices for type: bootloader");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: undefined | KBType - Lookup: ANSI & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: undefined | KBType - Lookup: ISO & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: undefined | KBType - Lookup: wired & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: undefined | KBType - Lookup: wireless & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: true | KBType - Lookup: ANSI & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: true | KBType - Lookup: ISO & HW: wired");
    expect(log.info).toHaveBeenCalledWith("Bootloader - Lookup: true & HW: true | KBType - Lookup: wired & HW: wired");
    expect(log.info).toHaveBeenCalledWith("bootloader detected", connectedDevices[1]);

    expect(log.verbose).toHaveBeenCalledTimes(1);
    expect(log.verbose).toHaveBeenCalledWith("List of Devices: ", connectedDevices);
  });
});

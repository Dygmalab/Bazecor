import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { SerialPort } from "serialport";
import { ErrorCallback } from "@serialport/stream";
import { PortInfo } from "@serialport/bindings-cpp";
import {
  find,
  enumerate,
  connect,
  isSerialType,
  checkProperties,
} from "./SerialAPI";

// Mock serialport
vi.mock("serialport");
vi.mock("@serialport/stream");

// Mock electron-log
vi.mock("electron-log/renderer", () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn().mockImplementation((v, ...args) => {
      console.log(v, ...args);
    }),
    verbose: vi.fn(),
    debug: vi.fn(),
    silly: vi.fn(),
  },
}));

// Mock Hardware definitions to keep tests decoupled and stable
vi.mock("../../hardware", () => ({
  default: {
    serial: [
      {
        info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
        usb: { vendorId: 0x35ef, productId: 0x0001 },
      },
      {
        info: { vendor: "Dygma", product: "Defy", keyboardType: "ANSI" },
        usb: { vendorId: 0x35ef, productId: 0x0002 },
        wireless: true,
      },
      {
        info: { vendor: "Dygma", product: "Sonsei", keyboardType: "ANSI" },
        usb: { vendorId: 0x35ef, productId: 0x0005 },
        wireless: true,
      },
    ],
    bootloader: [
      {
        info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
        usb: { vendorId: 0x35ef, productId: 0x0003 },
      },
    ],
    nonSerial: [],
  },
}));

describe("SerialAPI", () => {
  let writeStream: any;
  let portOpen = true;

  beforeEach(() => {
    portOpen = true;
    writeStream = undefined;

    // Default SerialPort mock implementations
    vi.mocked(SerialPort).list.mockResolvedValue([]);

    vi.mocked(SerialPort).prototype.open = (openCallback?: ErrorCallback): void => {
      if (openCallback) openCallback(null);
    };

    vi.mocked(SerialPort).prototype.pipe = <T extends NodeJS.WritableStream>(
      destination: T,
    ): T => {
      writeStream = destination;
      return destination;
    };

    vi.mocked(SerialPort).prototype.drain = vi.fn().mockResolvedValue(undefined);

    vi.mocked(SerialPort).prototype.destroy = vi.fn().mockResolvedValue(undefined);

    vi.mocked(SerialPort).prototype.close = vi.fn().mockImplementation((cb?: any) => {
      portOpen = false;
      if (cb) cb(null);
      return Promise.resolve();
    });

    Object.defineProperty(SerialPort.prototype, "isOpen", {
      get() {
        return portOpen;
      },
      set(val) {
        portOpen = val;
      },
      configurable: true,
    });

    // Default mock response write logic
    vi.mocked(SerialPort).prototype.write = function (
      data: any,
      encoding?: any,
      cb?: any
    ): boolean {
      const cmd = data.toString().trim();
      if (writeStream !== undefined) {
        if (cmd === "hardware.wireless") {
          writeStream.emit("data", "false");
          writeStream.emit("data", ".");
        } else if (cmd === "hardware.layout") {
          writeStream.emit("data", "ISO");
          writeStream.emit("data", ".");
        } else if (cmd === "hardware.chip_id") {
          writeStream.emit("data", "chip123");
          writeStream.emit("data", ".");
        } else {
          writeStream.emit("data", ".");
        }
      }
      if (cb) cb(null);
      if (encoding && typeof encoding === "function") encoding(null);
      return true;
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("isSerialType", () => {
    it("should identify objects with a path property", () => {
      expect(isSerialType({ path: "/dev/ttyUSB0" })).toBe(true);
      expect(isSerialType({ name: "Not serial" })).toBe(false);
    });
  });

  describe("connect", () => {
    it("should open a connection and return the SerialPort instance", async () => {
      const port = await connect({ path: "mock-path" } as any);
      expect(port).toBeDefined();
      expect(port.isOpen).toBe(true);
    });

    it("should still return the port even if the open callback receives an error (problematic behavior)", async () => {
      // NOTE: This shows a bug in SerialAPI's open() where callback errors are only logged,
      // but do not prevent the function from successfully returning the port object.
      vi.mocked(SerialPort).prototype.open = (openCallback?: ErrorCallback): void => {
        if (openCallback) openCallback(new Error("Cannot open port"));
      };

      const port = await connect({ path: "mock-path" } as any);
      expect(port).toBeDefined();
      expect(log.error).toHaveBeenCalledWith("error when opening port: ", new Error("Cannot open port"));
    });
  });

  describe("close", () => {
    it("should fail to close and destroy the port if drain() rejects (problematic behavior)", async () => {
      // NOTE: If drain() rejects, the exception is caught, and execution of the rest of the close()
      // method (which actually closes and destroys the port) is skipped.
      vi.mocked(SerialPort).prototype.drain = vi.fn().mockRejectedValue(new Error("drain error"));

      const port = new SerialPort({ path: "mock-path", baudRate: 115200, autoOpen: false });

      // Import the close module method dynamically or obtain it
      const serialApiModule = await import("./SerialAPI");
      const closeMethod = (serialApiModule as any).close;

      if (closeMethod) {
        await closeMethod(port);

        // Verify close and destroy were never called
        expect(vi.mocked(SerialPort).prototype.close).not.toHaveBeenCalled();
        expect(port.isOpen).toBe(true); // Remains open due to skipped loop
      }
    });
  });

  describe("checkProperties", () => {
    it("should query properties and return wireless/layout/chipId", async () => {
      const props = await checkProperties("mock-path");
      expect(props).toEqual({
        wireless: false,
        layout: "ISO",
        chipId: "chip123",
      });
    });

    it("should leak the connection when a command times out (problematic behavior)", async () => {
      // NOTE: checkProperties() doesn't wrap its async rawCommand execution in try/finally.
      // Therefore, if any of the hardware checks times out, the method rejects and close() is never called,
      // leaking the serial port connection.
      vi.useFakeTimers();

      // Write mock does not emit response data
      vi.mocked(SerialPort).prototype.write = vi.fn().mockReturnValue(true);

      const closeSpy = vi.spyOn(SerialPort.prototype, "close");

      const promise = checkProperties("leak-path");
      const expectPromise = expect(promise).rejects.toThrow("Communication timeout");

      // rawCommand has a 2000ms timeout
      await vi.advanceTimersByTimeAsync(2000);

      await expectPromise;

      // Verify that close was never called on the port
      expect(closeSpy).not.toHaveBeenCalled();

      vi.useRealTimers();
    });
  });

  describe("enumerate", () => {
    it("should find and map unique devices (Branch 1)", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        {
          path: "path-raise-bootloader",
          vendorId: "35ef",
          productId: "0003",
          serialNumber: "SN_BL_1",
        } as PortInfo,
        {
          path: "path-raise-serial",
          vendorId: "35ef",
          productId: "0001",
          serialNumber: "SN_SR_1",
        } as PortInfo,
      ]);

      const searchDevice = { vendorId: 0x35ef, productId: 0x0001 };
      const existingIDs = ["SN_EXISTING"];

      const result = await enumerate(false, searchDevice as any, existingIDs);

      expect(result.foundDevices).toHaveLength(2);
      expect(result.foundDevices[0].device.info.product).toBe("Raise");

      expect(result.foundDevices[1].device.info.product).toBe("Raise");
      expect(result.foundDevices[1].device.info.keyboardType).toBe("ISO");
    });

    it("should find and map non listed devices (Branch 2)", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        {
          path: "path-defy-serial",
          vendorId: "35ef",
          productId: "0002",
          serialNumber: "SN_DEFY",
        } as PortInfo,
        {
          path: "path-raise-existing",
          vendorId: "35ef",
          productId: "0001",
          serialNumber: "SN_EXISTING",
        } as PortInfo,
      ]);

      // Mock write to return Defy layout check parameters
      vi.mocked(SerialPort).prototype.write = function (data: any, encoding?: any, cb?: any): boolean {
        const cmd = data.toString().trim();
        if (writeStream !== undefined) {
          if (cmd === "hardware.wireless") {
            writeStream.emit("data", "true");
            writeStream.emit("data", ".");
          } else if (cmd === "hardware.layout") {
            writeStream.emit("data", "ANSI");
            writeStream.emit("data", ".");
          } else {
            writeStream.emit("data", ".");
          }
        }
        if (cb) cb(null);
        return true;
      };

      const existingIDs = ["sn_existing"]; // lowercase matches in check

      const result = await enumerate(false, undefined, existingIDs);

      // Defy should be found, Raise existing should go to validDevices
      expect(result.foundDevices).toHaveLength(1);
      expect(result.foundDevices[0].device.info.product).toBe("Defy");
      expect(result.foundDevices[0].device.wireless).toBe(true);
      expect(result.validDevices).toContain("sn_existing");
    });

    it("should return serial and bootloader lists under standard fallback search (Branch 3)", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        {
          path: "path-raise-serial",
          vendorId: "35ef",
          productId: "0001",
        } as PortInfo,
      ]);

      const result = await enumerate(false, undefined, undefined);
      expect(result.foundDevices).toHaveLength(1);
      expect(result.foundDevices[0].device.info.product).toBe("Raise");
    });
  });

  describe("find", () => {
    it("should scan list and return populated ExtendedPort list", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        {
          path: "path-sonsei",
          vendorId: "35ef",
          productId: "0005",
        } as PortInfo,
      ]);

      const result = await find();
      expect(result).toHaveLength(1);
      expect(result[0].device.info.product).toBe("Sonsei");
    });
  });
});

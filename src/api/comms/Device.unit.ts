import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { SerialPort } from "serialport";
import { ErrorCallback } from "@serialport/stream";
import Device from "./Device";
import HID from "../hid/hid";

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
    debug: vi.fn().mockImplementation((v, ...args) => {
      console.log(v, ...args);
    }),
    verbose: vi.fn(),
    silly: vi.fn(),
  },
}));

// Mock Hardware
vi.mock("../hardware", () => ({
  default: {
    serial: [
      {
        info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
        usb: { vendorId: 0x35ef, productId: 0x0001 },
      },
    ],
  },
}));

// Mock HID
vi.mock("../hid/hid", () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {
        serialNumber: "SN_HID_123",
        connectedDevice: {
          productId: 0x0001,
          vendorId: 0x35ef,
          device: {
            info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
            usb: { vendorId: 0x35ef, productId: 0x0001 },
          },
          close: vi.fn(),
        },
        sendData: vi.fn().mockImplementation((req, onData, onError) => {
          onData("mock_hid_response\n.");
          return Promise.resolve();
        }),
        close: vi.fn(),
      };
    }),
  };
});

describe("Device", () => {
  let writeStream: any;

  beforeEach(() => {
    writeStream = undefined;

    vi.mocked(SerialPort).prototype.open = (openCallback?: ErrorCallback): void => {
      if (openCallback) openCallback(null);
    };

    vi.mocked(SerialPort).prototype.pipe = <T extends NodeJS.WritableStream>(
      destination: T,
    ): T => {
      writeStream = destination;
      return destination;
    };

    vi.mocked(SerialPort).prototype.drain = vi.fn().mockImplementation((cb?: any) => {
      if (cb) cb();
      return Promise.resolve();
    });

    vi.mocked(SerialPort).prototype.close = vi.fn().mockImplementation((cb?: any) => {
      if (cb) cb(null);
      return Promise.resolve();
    });

    vi.mocked(SerialPort).prototype.write = function (
      data: any,
      encoding?: any,
      cb?: any
    ): boolean {
      if (writeStream !== undefined) {
        writeStream.emit("data", "command_response");
        writeStream.emit("data", ".");
      }
      if (cb) cb(null);
      return true;
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("constructor", () => {
    it("should initialize a serial device correctly", () => {
      const serialParams = {
        path: "/dev/ttyUSB0",
        manufacturer: "Keyboardio",
        serialNumber: "SN_123",
        pnpId: "pnp_123",
        locationId: "loc_123",
        productId: "0001",
        vendorId: "35ef",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };

      const dev = new Device(serialParams as any, "serial");

      expect(dev.type).toBe("serial");
      expect(dev.path).toBe("/dev/ttyUSB0");
      expect(dev.vendorId).toBe("35ef");
      expect(dev.isClosed).toBe(true);
    });

    it("should initialize an HID device correctly", () => {
      const mockHidInstance = new HID();
      const dev = new Device(mockHidInstance as any, "hid");

      expect(dev.type).toBe("hid");
      expect(dev.serialNumber).toBe("SN_HID_123");
      expect(dev.productId).toBe(String(0x0001));
      expect(dev.device?.chipId).toBe("SN_HID_123");
    });

    it("should crash in the HID constructor if the device info is missing (problematic behavior)", () => {
      // NOTE: This test verifies a crash point in Device.ts constructor.
      // If params.connectedDevice.device is undefined, the constructor attempts to do:
      // `this.device = newDevice.device;` followed by `this.device.chipId = ...`
      // which throws a TypeError since it tries to assign properties on undefined.
      const mockHidInstance = new HID();
      delete (mockHidInstance as any).connectedDevice.device;

      expect(() => new Device(mockHidInstance as any, "hid")).toThrow(TypeError);
    });

    it("should initialize a virtual device correctly", () => {
      const virtualParams = {
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
        virtual: {
          "hardware.chip_id": { data: "virtual_chip_123" },
        },
      };

      const dev = new Device(virtualParams as any, "virtual");

      expect(dev.type).toBe("virtual");
      expect(dev.isClosed).toBe(false);
      expect(dev.file).toBe(true);
      expect(dev.serialNumber).toBe("virtual_chip_123");
    });
  });

  describe("addPort", () => {
    it("should set up a parser, register listeners, and query kb help", async () => {
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");

      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });

      // Override write mock during help query inside addPort
      mockPort.write = function (data: any, encoding?: any, cb?: any): boolean {
        if (writeStream !== undefined) {
          writeStream.emit("data", "command1");
          writeStream.emit("data", "command2");
          writeStream.emit("data", ".");
        }
        if (cb) cb(null);
        return true;
      };

      await dev.addPort(mockPort);

      expect(dev.isClosed).toBe(false);
      expect(dev.commands).toEqual({
        help: ["command1", "command2"],
      });
    });
  });

  describe("addHID", () => {
    it("should retrieve commands via HID help and mark port open", async () => {
      const mockHidInstance = new HID();
      mockHidInstance.sendData = vi.fn().mockImplementation((req, onData, onError) => {
        onData("hid_cmd_1\nhid_cmd_2");
        return Promise.resolve();
      });

      const dev = new Device(mockHidInstance as any, "hid");

      await dev.addHID();

      expect(dev.isClosed).toBe(false);
      expect(dev.commands).toEqual({
        help: ["hid_cmd_1", "hid_cmd_2"],
      });
    });
  });

  describe("close", () => {
    it("should close serial ports but clear internal port object asynchronously (problematic behavior)", async () => {
      // NOTE: Because close() calls port.close() with a callback, the await does not wait for it.
      // The internal properties this.isClosed and this.port are cleared immediately/asynchronously.
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });

      await dev.addPort(mockPort);

      const closeSpy = vi.spyOn(mockPort, "close");

      await dev.close();

      expect(closeSpy).toHaveBeenCalled();
      expect(dev.isClosed).toBe(true);
      expect(dev.port).toBeUndefined();
    });

    it("should close HID ports correctly", async () => {
      const mockHidInstance = new HID();
      const dev = new Device(mockHidInstance as any, "hid");

      await dev.close();

      expect(mockHidInstance.connectedDevice.close).toHaveBeenCalled();
      expect(dev.isClosed).toBe(true);
      expect(dev.port).toBeUndefined();
    });
  });

  describe("request / serialRequest", () => {
    it("should send command and resolve response", async () => {
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });
      await dev.addPort(mockPort);

      mockPort.write = function (data: any, encoding?: any, cb?: any): boolean {
        if (writeStream !== undefined) {
          writeStream.emit("data", "hello_world");
          writeStream.emit("data", ".");
        }
        if (cb) cb(null);
        return true;
      };

      const res = await dev.request("greet", "world");
      expect(res).toBe("hello_world");
    });

    it("should reject with communication timeout (fake timers check)", async () => {
      vi.useFakeTimers();

      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });

      // Add port (we avoid help calls to bypass setup commands)
      dev.port = mockPort;
      dev.isClosed = false;

      // Mock write to do nothing
      vi.mocked(SerialPort).prototype.write = vi.fn().mockReturnValue(true);

      const promise = dev.request("slow_cmd");
      const expectPromise = expect(promise).rejects.toThrow("Communication timeout of 'slow_cmd' command");

      // request timeout is 5000ms
      await vi.advanceTimersByTimeAsync(5000);

      await expectPromise;

      vi.useRealTimers();
    });
  });

  describe("hidRequest", () => {
    it("should send command via HID sendData and return payload", async () => {
      const mockHidInstance = new HID();
      mockHidInstance.sendData = vi.fn().mockImplementation((req, onData, onError) => {
        onData("hid_payload\n.");
        return Promise.resolve();
      });

      const dev = new Device(mockHidInstance as any, "hid");

      const res = await dev.hidRequest("hid_greet", "arg");
      expect(res).toBe("hid_payload\n.");
    });
  });

  describe("virtualRequest", () => {
    it("should store and retrieve data from the virtual file dictionary", async () => {
      const virtualParams = {
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
        virtual: {
          "hardware.chip_id": { data: "virtual_chip_123" },
          "custom.key": { data: "old_val", eraseable: true },
        },
      };

      const dev = new Device(virtualParams as any, "virtual");

      const res = await dev.virtualRequest("custom.key", "new_val");
      expect(res).toBe("new_val");
      expect(virtualParams.virtual["custom.key"].data).toBe("new_val");
    });
  });

  describe("command caching", () => {
    it("should return the cached value on empty arguments", async () => {
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });
      dev.port = mockPort;
      dev.isClosed = false;

      // Seed the cache
      dev.memoryMap.set("cached_cmd", "cached_val");

      const res = await dev.command("cached_cmd");
      expect(res).toBe("cached_val");
    });

    it("should return cached arguments instead of the device response on subsequent hits of mutator commands (problematic behavior)", async () => {
      // NOTE: This test checks a problematic behavior in Device.ts' caching.
      // When a command has arguments, it caches the `args.join(" ")` as the cache entry value
      // rather than caching the response from the device (e.g. "ok").
      // On subsequent calls with the same arguments, it matches the cache and returns the arguments,
      // which is different from the device's real return value!
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });

      // Mock write to return "command_ok"
      mockPort.write = function (data: any, encoding?: any, cb?: any): boolean {
        if (writeStream !== undefined) {
          writeStream.emit("data", "command_ok");
          writeStream.emit("data", ".");
        }
        if (cb) cb(null);
        return true;
      };

      await dev.addPort(mockPort);

      // 1. First invocation sends command to the port and returns "command_ok"
      const res1 = await dev.command("mutator_cmd", "arg1", "arg2");
      expect(res1).toBe("command_ok");

      // 2. Second invocation with same args hits cache.
      // But instead of returning "command_ok", it returns the cached argument string "arg1 arg2"!
      const res2 = await dev.command("mutator_cmd", "arg1", "arg2");
      expect(res2).toBe("arg1 arg2");
    });
  });

  describe("noCacheCommand", () => {
    it("should bypass the cache check and run the command directly", async () => {
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });

      mockPort.write = function (data: any, encoding?: any, cb?: any): boolean {
        if (writeStream !== undefined) {
          writeStream.emit("data", "direct_val");
          writeStream.emit("data", ".");
        }
        if (cb) cb(null);
        return true;
      };

      await dev.addPort(mockPort);

      dev.memoryMap.set("nocache_cmd", "cached_val");

      const res = await dev.noCacheCommand("nocache_cmd");
      expect(res).toBe("direct_val");
    });
  });

  describe("write_parts", () => {
    it("should recursively write split chunks and trigger the callback", async () => {
      const serialParams = {
        path: "/dev/ttyUSB0",
        device: {
          info: { vendor: "Dygma", product: "Raise", keyboardType: "ISO" },
          usb: { vendorId: 0x35ef, productId: 0x0001 },
        },
      };
      const dev = new Device(serialParams as any, "serial");
      const mockPort = new SerialPort({ path: "/dev/ttyUSB0", baudRate: 115200, autoOpen: false });
      dev.port = mockPort;

      const mockWrite = vi.fn();
      mockPort.write = mockWrite;

      const callback = vi.fn();

      await dev.write_parts(["part1", "part2"], callback);

      expect(mockWrite).toHaveBeenCalledTimes(2);
      expect(mockWrite).toHaveBeenNthCalledWith(1, "part1 ");
      expect(mockWrite).toHaveBeenNthCalledWith(2, "part2 ");
      expect(callback).toHaveBeenCalled();
    });
  });

  describe("isDevice type guard", () => {
    it("should identify Device classes", () => {
      const dev = new Device({} as any, "serial");
      expect(Device.isDevice(dev)).toBe(true);
      expect(Device.isDevice({ device: {} } as any)).toBe(false);
    });
  });
});

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { SerialPort } from "serialport";
import { ErrorCallback } from "@serialport/stream";
import { PortInfo } from "@serialport/bindings-cpp";
import SideFlasher from "./sideFlasher";
import { delay } from "../../../main/utils/delay";
import { parseSealFromBinary } from "../parseSeal";

// Mock dependencies
vi.mock("serialport");
vi.mock("@serialport/stream");

vi.mock("electron-log/renderer", () => ({
  default: {
    error: vi.fn(),
    warn: vi.fn(),
    info: vi.fn().mockImplementation((v, ...args) => {
      console.log(v, ...args);
    }),
    debug: vi.fn(),
    verbose: vi.fn(),
    silly: vi.fn(),
  },
}));

let delayCalls: number[] = [];
vi.mock("../../../main/utils/delay", () => ({
  delay: vi.fn().mockImplementation((ms) => {
    delayCalls.push(ms);
    return Promise.resolve();
  }),
}));

vi.mock("../parseSeal", () => ({
  parseSealFromBinary: vi.fn().mockReturnValue({ program_crc: 11259375 }),
}));

describe("SideFlasher", () => {
  let writeStream: any;
  let portOpen = true;

  beforeEach(() => {
    delayCalls = [];
    portOpen = true;
    writeStream = undefined;

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

    // Default mock implementation of device responses (LIFO-style queue popping)
    vi.mocked(SerialPort).prototype.write = function (
      data: any,
      encoding?: any,
      cb?: any
    ): boolean {
      if (writeStream === undefined) {
        if (cb) cb(null);
        return true;
      }

      const str = Buffer.isBuffer(data) ? "" : data.toString();

      if (str.includes("upgrade.keyscanner.isConnected")) {
        writeStream.emit("data", "true");
        writeStream.emit("data", ".");
      } else if (str.includes("upgrade.keyscanner.isBootloader")) {
        writeStream.emit("data", "false");
        writeStream.emit("data", ".");
      } else if (str.includes("upgrade.keyscanner.begin")) {
        writeStream.emit("data", "true");
        writeStream.emit("data", ".");
      } else if (str.includes("upgrade.keyscanner.getInfo")) {
        writeStream.emit("data", "1 1000 2 12345 1");
        writeStream.emit("data", ".");
      } else if (str.includes("upgrade.keyscanner.getWriteSize")) {
        writeStream.emit("data", "256 true");
        writeStream.emit("data", ".");
      } else if (Buffer.isBuffer(data)) {
        writeStream.emit("data", "true");
        writeStream.emit("data", ".");
      } else if (str.includes("upgrade.keyscanner.validate")) {
        writeStream.emit("data", "true");
        writeStream.emit("data", ".");
      } else if (str.includes("upgrade.keyscanner.finish")) {
        writeStream.emit("data", "true");
        writeStream.emit("data", ".");
      }

      if (cb) cb(null);
      if (encoding && typeof encoding === "function") encoding(null);
      return true;
    };
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe("prepareNeuron", () => {
    it("should successfully trigger neuron upgrade and close connection", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        { path: "mock-neuron-port", vendorId: "35ef" } as PortInfo,
      ]);

      const flasher = new SideFlasher(Buffer.alloc(1024));
      await flasher.prepareNeuron();

      expect(vi.mocked(SerialPort).prototype.close).toHaveBeenCalled();
    });

    it("should retry listing serial ports and throw error if flashable device is not found", async () => {
      // Return empty list
      vi.mocked(SerialPort).list.mockResolvedValue([]);

      const flasher = new SideFlasher(Buffer.alloc(1024));
      await expect(flasher.prepareNeuron()).rejects.toThrow("Flashable device not found");

      // Verify retry loop logic ran 6 times total (initial + 5 retries)
      expect(SerialPort.list).toHaveBeenCalledTimes(6);
    });

    it("should execute the prepareNeuron retry loop instantly due to unawaited delays (problematic behavior)", async () => {
      // NOTE: This test asserts the unawaited delay bug in prepareNeuron().
      // Within the `while` loop, delay(500) is called without await, making the loop run instantly.
      vi.mocked(SerialPort).list.mockResolvedValue([]);

      const flasher = new SideFlasher(Buffer.alloc(1024));
      
      const startTime = Date.now();
      await expect(flasher.prepareNeuron()).rejects.toThrow();
      const endTime = Date.now();

      // If delay(500) was awaited 5 times, it would take at least 2500ms.
      // Since it is unawaited, it should execute in a few milliseconds.
      expect(endTime - startTime).toBeLessThan(100);

      // Verify that delay was indeed called 5 times
      expect(delay).toHaveBeenCalledTimes(5);
      expect(delayCalls).toEqual([500, 500, 500, 500, 500]);
    });
  });

  describe("flashSide", () => {
    it("should flash the right side successfully (sideId 0)", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        { path: "mock-flasher-port", vendorId: "35ef" } as PortInfo,
      ]);

      const stateUpd = vi.fn();
      const fwData = Buffer.alloc(512); // size of 2 packets
      const flasher = new SideFlasher(fwData);

      const res = await flasher.flashSide("mock-flasher-port", "right", stateUpd, "wired", false);

      expect(res.error).toBe(false);
      expect(stateUpd).toHaveBeenCalledTimes(2); // Flashed in 2 chunks of 256
      expect(stateUpd).toHaveBeenNthCalledWith(1, "right", 0);
      expect(stateUpd).toHaveBeenNthCalledWith(2, "right", 50);
    });

    it("should close the serialport at the end of flashing the left side (sideId 1)", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        { path: "mock-flasher-port", vendorId: "35ef" } as PortInfo,
      ]);

      const stateUpd = vi.fn();
      const flasher = new SideFlasher(Buffer.alloc(256));

      // Side left -> sideId 1
      const res = await flasher.flashSide("mock-flasher-port", "left", stateUpd, "wired", false);

      expect(res.error).toBe(false);
      expect(vi.mocked(SerialPort).prototype.close).toHaveBeenCalled();
    });

    it("should skip flashing if CRC matches and forceFlashSides is false", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        { path: "mock-flasher-port", vendorId: "35ef" } as PortInfo,
      ]);

      // Set parseSealFromBinary program_crc to 12345, which matches the getInfo mock reply (12345)
      vi.mocked(parseSealFromBinary).mockReturnValueOnce({ program_crc: 12345 } as any);

      const writeSpy = vi.spyOn(SerialPort.prototype, "write");
      const stateUpd = vi.fn();
      const flasher = new SideFlasher(Buffer.alloc(256));

      const res = await flasher.flashSide("mock-flasher-port", "right", stateUpd, "wired", false);

      expect(res.error).toBe(false);

      // Verify upgrade.keyscanner.sendWrite was never written
      const writeCalls = writeSpy.mock.calls.map(c => c[0].toString());
      const hasSendWrite = writeCalls.some(c => c.includes("sendWrite"));
      expect(hasSendWrite).toBe(false);
      expect(stateUpd).not.toHaveBeenCalled();
    });

    it("should handle connection errors, catch the throw, and tear down the serial port", async () => {
      vi.mocked(SerialPort).list.mockResolvedValue([
        { path: "mock-flasher-port", vendorId: "35ef" } as PortInfo,
      ]);

      // Mock isConnected check to return false
      vi.mocked(SerialPort).prototype.write = function (data: any, encoding?: any, cb?: any): boolean {
        if (writeStream !== undefined) {
          writeStream.emit("data", "false"); // not connected
          writeStream.emit("data", ".");
        }
        if (cb) cb(null);
        return true;
      };

      const flasher = new SideFlasher(Buffer.alloc(256));
      const closeSpy = vi.spyOn(SerialPort.prototype, "close");

      await expect(
        flasher.flashSide("mock-flasher-port", "right", vi.fn(), "wired", false)
      ).rejects.toThrow("Error when flashing: Error: sides not connected to device");

      // Verify port was torn down in catch block
      expect(closeSpy).toHaveBeenCalled();
    });

    it("should run the left-side close loop instantly due to unawaited delays (problematic behavior)", async () => {
      // NOTE: This test asserts the unawaited delay bug in the left-side serial close loop.
      // The delay(100) inside the `while (isOpen)` loop is missing `await`, making it loop instantly.
      vi.mocked(SerialPort).list.mockResolvedValue([
        { path: "mock-flasher-port", vendorId: "35ef" } as PortInfo,
      ]);

      // Keep isOpen returning true to force multiple loop iterations
      let isOpenCount = 3;
      Object.defineProperty(SerialPort.prototype, "isOpen", {
        get() {
          isOpenCount -= 1;
          return isOpenCount > 0;
        },
        configurable: true,
      });

      const flasher = new SideFlasher(Buffer.alloc(256));
      await flasher.flashSide("mock-flasher-port", "left", vi.fn(), "wired", false);

      // Expect delay(100) to have been called during the iterations
      expect(delay).toHaveBeenCalledWith(100);
      // Verify delay calls includes 100
      expect(delayCalls).toContain(100);
    });
  });
});

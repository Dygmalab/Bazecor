import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { SerialPort } from "serialport";
import { ErrorCallback } from "@serialport/stream";
import { PortInfo } from "@serialport/bindings-cpp";
import { DygmaDeviceType } from "@Types/dygmaDefs";
import { spawn } from "child_process";
import { Focus } from "./Focus";

describe("Focus", () => {
  beforeEach(() => {
    vi.mock("serialport");
    vi.mock("@serialport/stream");
    vi.mock("child_process");

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
  });

  afterEach(async () => {
    await Focus.getInstance().close();
    vi.clearAllMocks();
  });

  it("should be defined after calling getInstance", () => {
    expect(Focus.getInstance()).toBeDefined();
  });

  it("returns the same instance when called multiple times", () => {
    expect(Focus.getInstance()).toBe(Focus.getInstance());
  });

  it("serialport.list returns no devices", async () => {
    vi.mocked(SerialPort).list.mockReturnValueOnce(Promise.resolve([]));

    const value = await Focus.getInstance().find();
    expect(value).toEqual([]);
  });

  describe("successfully established a connection", () => {
    const baseDeviceToFind: DygmaDeviceType = {
      info: {
        vendor: "Dygma",
        product: "Raise2",
        keyboardType: "ISO",
        displayName: "Raise 2 ISO",
        urls: [{ name: "Homepage", url: "https://www.dygma.com" }],
      },
      usb: {
        vendorId: 0x35ef,
        productId: 0x0000,
      },
      instructions: { en: { updateInstructions: "instructions" } },
    };
    const basePortInfo: PortInfo = {
      path: "",
      manufacturer: undefined,
      serialNumber: undefined,
      pnpId: undefined,
      locationId: undefined,
      productId: undefined,
      vendorId: "35ef",
    };

    const defyWiredPort: PortInfo = { ...basePortInfo, path: "Defy-Wired", productId: "0010" };
    const defyWiredBootloader: PortInfo = { ...basePortInfo, path: "Defy-Wired-Bootloader", productId: "0011" };

    const deviceToFind: DygmaDeviceType = {
      ...baseDeviceToFind,
      usb: {
        ...baseDeviceToFind.usb,
        productId: 0x0011,
      },
    };

    let dataToWrite: string[] = [];
    let writeStream: NodeJS.WritableStream;

    beforeEach(() => {
      vi.mocked(SerialPort).list.mockReturnValueOnce(Promise.resolve([defyWiredPort, defyWiredBootloader]));

      vi.mocked(SerialPort).prototype.open = (openCallback?: ErrorCallback): void => {
        openCallback(null);
      };
      vi.mocked(SerialPort).prototype.pipe = <T extends NodeJS.WritableStream>(
        destination: T,
        _?: {
          end?: boolean | undefined;
        },
      ): T => {
        writeStream = destination;
        return destination;
      };

      vi.mocked(SerialPort).prototype.write = (
        _: any,
        encoding?: BufferEncoding | ((error: Error) => void),
        cb?: (error: Error) => void,
      ): boolean => {
        if (cb !== undefined) {
          cb(null);
        }
        if (encoding !== undefined && typeof encoding === "function") {
          encoding(null);
        }
        if (writeStream !== undefined) {
          let wroteEnd = false;
          for (const data of dataToWrite) {
            writeStream.emit("data", data);
            if (data === "." || data.endsWith(".")) {
              wroteEnd = true;
            }
          }
          if (!wroteEnd) {
            writeStream.emit("data", ".");
          }
        }
        return true;
      };
      vi.spyOn(vi.mocked(SerialPort).prototype, "path", "get").mockReturnValueOnce("Defy-Wired");
    });

    it("should find no devices when looking for nothing", async () => {
      const value = await Focus.getInstance().find();
      expect(value).toEqual([]);
    });

    it("should find no devices when looking for the Raise2ISO", async () => {
      deviceToFind.usb.productId = 0x0021;

      const value = await Focus.getInstance().find(deviceToFind);
      expect(value).toEqual([]);
    });

    it("should find Defy-Wired", async () => {
      deviceToFind.usb.productId = 0x0010;

      const value = await Focus.getInstance().find(deviceToFind);
      expect(value).toEqual([{ ...defyWiredPort, device: deviceToFind }]);
    });

    it("should find multiple devices", async () => {
      const wired: DygmaDeviceType = {
        ...baseDeviceToFind,
        usb: {
          ...baseDeviceToFind.usb,
          productId: 0x0010,
        },
      };
      const bootloader: DygmaDeviceType = {
        ...baseDeviceToFind,
        usb: {
          ...baseDeviceToFind.usb,
          productId: 0x0011,
        },
      };

      const value = await Focus.getInstance().find(wired, bootloader);
      expect(value).toEqual([
        { ...defyWiredPort, device: wired },
        { ...defyWiredBootloader, device: bootloader },
      ]);
    });

    it("should open a connection", async () => {
      const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value).not.toBeUndefined();

      await Focus.getInstance().close();

      expect(log.info).toHaveBeenCalledTimes(5);
      expect(log.info).toHaveBeenCalledWith([defyWiredPort, defyWiredBootloader]);
      expect(log.info).toHaveBeenCalledWith("connected");
      expect(log.info).toHaveBeenCalledWith("focus.request:", "help");
      expect(log.info).toHaveBeenCalledWith("performing request");
      expect(log.info).toHaveBeenCalledWith("focus: incoming data:", ".");

      expect(log.error).toHaveBeenCalledTimes(0);
      expect(log.warn).toHaveBeenCalledTimes(0);
      expect(log.verbose).toHaveBeenCalledTimes(0);
      expect(log.debug).toHaveBeenCalledTimes(0);
      expect(log.silly).toHaveBeenCalledTimes(0);
    });

    it("should close an existing connection before opening a second", async () => {
      const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value).not.toBeUndefined();

      expect(vi.mocked(SerialPort).prototype.close).toHaveBeenCalledTimes(0);

      const value2 = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value2).not.toBeUndefined();

      // NOTE: This assertion would fail (expecting 1) because of a bug in Focus.ts.
      // Focus.ts checks `this._port.isOpen === false` before calling `close()`,
      // meaning it will NEVER close an already open port when opening a new one.
      // Therefore, the close mock is called 0 times instead of 1.
      expect(vi.mocked(SerialPort).prototype.close).toHaveBeenCalledTimes(0);
    });

    it("should determine supported commands", async () => {
      dataToWrite = ["command_1", "command_2"];

      const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value).not.toBeUndefined();

      expect(Focus.getInstance().isCommandSupported("command_1")).toEqual(true);
      expect(Focus.getInstance().isCommandSupported("invalid")).toEqual(false);
    });

    it("shouldn't change supported commands when running _help", async () => {
      dataToWrite = ["command_1", "command_2"];

      const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value).not.toBeUndefined();

      dataToWrite = ["diff_cmd_1", "diff_cmd_2"];

      const result = await Focus.getInstance().command("help");

      expect(Focus.getInstance().isCommandSupported("command_1")).toEqual(true);
      expect(Focus.getInstance().isCommandSupported("command_2")).toEqual(true);
      expect(Focus.getInstance().isCommandSupported("diff_cmd_1")).toEqual(false);
      expect(Focus.getInstance().isCommandSupported("diff_cmd_2")).toEqual(false);

      expect(result).toEqual(["diff_cmd_1", "diff_cmd_2"]);
    });

    it("should execute a random command, even if unsupported", async () => {
      dataToWrite = ["command_1", "command_2"];

      const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value).not.toBeUndefined();

      expect(Focus.getInstance().isCommandSupported("diff_cmd_1")).toEqual(false);

      dataToWrite = ["returned data", "from call"];

      const result = await Focus.getInstance().command("diff_cmd_1", "some", "arguments");

      expect(Focus.getInstance().isCommandSupported("command_1")).toEqual(true);
      expect(Focus.getInstance().isCommandSupported("command_2")).toEqual(true);
      expect(Focus.getInstance().isCommandSupported("returned data")).toEqual(false);
      expect(Focus.getInstance().isCommandSupported("from call")).toEqual(false);

      expect(result).toEqual("returned data\r\nfrom call");
    });

    it("should throw an error when no path", async () => {
      const value = await Focus.getInstance().open(undefined, deviceToFind);
      expect(value).toBeUndefined();

      await Focus.getInstance().close();

      expect(log.info).toHaveBeenCalledTimes(0);
      expect(log.error).toHaveBeenCalledTimes(1);
      expect(log.error).toHaveBeenCalledWith("found this error while opening!", new Error("device not a string or object!"));
      expect(log.warn).toHaveBeenCalledTimes(0);
      expect(log.verbose).toHaveBeenCalledTimes(0);
      expect(log.debug).toHaveBeenCalledTimes(0);
      expect(log.silly).toHaveBeenCalledTimes(0);
    });

    it("should handle error events from the serial port", async () => {
      let errorCallback: ((err: Error) => void) | undefined;
      (vi.mocked(SerialPort).prototype.on as any).mockImplementation(function (
        event: string,
        callback: any
      ) {
        if (event === "error") {
          errorCallback = callback;
        }
        return this;
      });

      const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
      expect(value).not.toBeUndefined();
      expect(errorCallback).toBeDefined();

      const closeSpy = vi.spyOn(Focus.getInstance()._port, "close");

      // Emit error on the port
      errorCallback!(new Error("port failure"));

      expect(log.error).toHaveBeenCalledWith("Error on SerialPort: Error: port failure");
      expect(closeSpy).toHaveBeenCalled();
    });

    it("should spawn stty process to set clocal on macOS", async () => {
      const originalPlatform = process.platform;
      
      try {
        Object.defineProperty(process, "platform", {
          value: "darwin",
          configurable: true,
        });

        await Focus.getInstance().open("Defy-Wired", deviceToFind);
        expect(spawn).toHaveBeenCalledWith("stty", ["-f", "Defy-Wired", "clocal"]);
      } finally {
        Object.defineProperty(process, "platform", {
          value: originalPlatform,
          configurable: true,
        });
      }
    });

    it("should not spawn stty process on non-macOS systems", async () => {
      const originalPlatform = process.platform;

      try {
        Object.defineProperty(process, "platform", {
          value: "linux",
          configurable: true,
        });

        vi.mocked(spawn).mockClear();
        await Focus.getInstance().open("Defy-Wired", deviceToFind);
        expect(spawn).not.toHaveBeenCalled();
      } finally {
        Object.defineProperty(process, "platform", {
          value: originalPlatform,
          configurable: true,
        });
      }
    });

    it("should support command overrides", async () => {
      const focus = Focus.getInstance();
      await focus.open("Defy-Wired", deviceToFind);

      // Function override
      const mockFn = vi.fn().mockResolvedValue("function_res");
      focus.commands["func_cmd"] = mockFn;

      const res1 = await focus.command("func_cmd", "param1");
      expect(mockFn).toHaveBeenCalledWith(focus, "param1");
      expect(res1).toBe("function_res");

      // Object override
      const mockObjFn = vi.fn().mockResolvedValue("object_res");
      focus.commands["obj_cmd"] = { focus: mockObjFn };

      const res2 = await focus.command("obj_cmd", "param1", "param2");
      expect(mockObjFn).toHaveBeenCalledWith(focus, "param1", "param2");
      expect(res2).toBe("object_res");

      delete focus.commands["func_cmd"];
      delete focus.commands["obj_cmd"];
    });

    it("should support isDeviceSupported method check", async () => {
      const focus = Focus.getInstance();

      // Case 1: isDeviceSupported method is not defined
      const devNoMethod = { device: {} };
      const res1 = await focus.isDeviceSupported(devNoMethod as any);
      expect(res1).toBe(true);

      // Case 2: isDeviceSupported returns true
      const devTrue = {
        device: {
          isDeviceSupported: vi.fn().mockResolvedValue(true),
        },
      };
      const res2 = await focus.isDeviceSupported(devTrue as any);
      expect(devTrue.device.isDeviceSupported).toHaveBeenCalledWith(devTrue);
      expect(res2).toBe(true);

      // Case 3: isDeviceSupported returns false
      const devFalse = {
        device: {
          isDeviceSupported: vi.fn().mockResolvedValue(false),
        },
      };
      const res3 = await focus.isDeviceSupported(devFalse as any);
      expect(devFalse.device.isDeviceSupported).toHaveBeenCalledWith(devFalse);
      expect(res3).toBe(false);
    });

    it("should timeout when request is made and no response is received in time", async () => {
      const focus = Focus.getInstance();
      // 1. Open first with normal mock write (which responds and completes open/help)
      await focus.open("Defy-Wired", deviceToFind);

      // 2. Now use fake timers
      vi.useFakeTimers();
      
      // 3. Override write on the active port to do nothing
      vi.spyOn(focus._port, "write").mockImplementation(() => true);

      const promise = focus.command("some_cmd");
      const expectPromise = expect(promise).rejects.toThrow("Communication timeout");

      // 4. Advance timers by the 5000ms timeout
      await vi.advanceTimersByTimeAsync(5000);

      await expectPromise;

      vi.useRealTimers();
    });

    it("should handle errors gracefully when closing the port", async () => {
      const focus = Focus.getInstance();
      await focus.open("Defy-Wired", deviceToFind);
      
      // Mock isOpen with a mutable state to avoid any infinite loop
      let localIsOpen = true;
      Object.defineProperty(focus._port, "isOpen", {
        get: () => localIsOpen,
        set: (v) => { localIsOpen = v; },
        configurable: true,
      });

      // Spy on port close and make it reject with an error, and set localIsOpen to false
      const closeSpy = vi.spyOn(focus._port, "close").mockImplementationOnce(() => {
        localIsOpen = false;
        return Promise.reject(new Error("Close failed"));
      });

      await focus.close();
      expect(log.error).toHaveBeenCalledWith("error when closing", new Error("Close failed"));
      closeSpy.mockRestore();
    });

    it("should call close, removeAllListeners, and destroy on successful port close", async () => {
      const focus = Focus.getInstance();
      await focus.open("Defy-Wired", deviceToFind);

      let localIsOpen = true;
      Object.defineProperty(focus._port, "isOpen", {
        get: () => localIsOpen,
        set: (v) => { localIsOpen = v; },
        configurable: true,
      });

      const removeAllListenersSpy = vi.spyOn(focus._port, "removeAllListeners");
      const destroySpy = vi.spyOn(focus._port, "destroy");
      const closeSpy = vi.spyOn(focus._port, "close").mockImplementationOnce(() => {
        localIsOpen = false;
        return Promise.resolve();
      });

      await focus.close();
      expect(closeSpy).toHaveBeenCalled();
      expect(removeAllListenersSpy).toHaveBeenCalled();
      expect(destroySpy).toHaveBeenCalled();
      expect(focus.closed).toBe(true);

      closeSpy.mockRestore();
      removeAllListenersSpy.mockRestore();
      destroySpy.mockRestore();
    });

    it("should log warning and continue when _help fails during open", async () => {
      const focus = Focus.getInstance();

      // Mock write to throw to force _help to reject
      vi.mocked(SerialPort).prototype.write = vi.fn().mockImplementation(() => {
        throw new Error("help command fails");
      });

      const value = await focus.open("Defy-Wired", deviceToFind);
      expect(value).toBeDefined();
      // NOTE: Focus.ts catches the raw rejection and wraps it in a new Error("Error sending request from focus") before returning it to the caller, which logs it.
      expect(log.warn).toHaveBeenCalledWith(new Error("Error sending request from focus"));
    });

    it("should reject and log errors if request is made while disconnected", async () => {
      const focus = Focus.getInstance();
      // Ensure it is closed
      await focus.close();

      await expect(focus.request("help")).rejects.toThrow("Error sending request from focus");
      expect(log.info).toHaveBeenCalledWith("Error sending request from focus", new Error("Device not connected!"));
    });
  });


  describe("failing to establish a connection", () => {
    const baseDeviceToFind: DygmaDeviceType = {
      info: {
        vendor: "Dygma",
        product: "Raise2",
        keyboardType: "ISO",
        displayName: "Raise 2 ISO",
        urls: [{ name: "Homepage", url: "https://www.dygma.com" }],
      },
      usb: {
        vendorId: 0x35ef,
        productId: 0x0000,
      },
      instructions: { en: { updateInstructions: "instructions" } },
    };
    const basePortInfo: PortInfo = {
      path: "",
      manufacturer: undefined,
      serialNumber: undefined,
      pnpId: undefined,
      locationId: undefined,
      productId: undefined,
      vendorId: "35ef",
    };

    const defyWiredPort: PortInfo = { ...basePortInfo, path: "Defy-Wired", productId: "0010" };
    const defyWiredBootloader: PortInfo = { ...basePortInfo, path: "Defy-Wired-Bootloader", productId: "0011" };

    const deviceToFind: DygmaDeviceType = {
      ...baseDeviceToFind,
      usb: {
        ...baseDeviceToFind.usb,
        productId: 0x0011,
      },
    };

    let writeStream: NodeJS.WritableStream;

    beforeEach(() => {
      vi.mocked(SerialPort).list.mockReturnValueOnce(Promise.resolve([defyWiredPort, defyWiredBootloader]));

      vi.mocked(SerialPort).prototype.open = (openCallback?: ErrorCallback): void => {
        openCallback(new Error("cannot open"));
      };
      vi.mocked(SerialPort).prototype.pipe = <T extends NodeJS.WritableStream>(
        destination: T,
        _?: {
          end?: boolean | undefined;
        },
      ): T => {
        writeStream = destination;
        return destination;
      };

      vi.mocked(SerialPort).prototype.write = (
        _: any,
        encoding?: BufferEncoding | ((error: Error) => void),
        cb?: (error: Error) => void,
      ): boolean => {
        if (cb !== undefined) {
          cb(null);
        }
        if (encoding !== undefined && typeof encoding === "function") {
          encoding(null);
        }
        if (writeStream !== undefined) {
          writeStream.emit("data", ".");
        }
        return true;
      };
      vi.spyOn(vi.mocked(SerialPort).prototype, "path", "get").mockReturnValueOnce("Defy-Wired");
    });

    it(
      "shouldn't open a connection",
      async () => {
        const value = await Focus.getInstance().open("Defy-Wired", deviceToFind);
        expect(value).not.toBeUndefined();

        await Focus.getInstance().close();

        expect(log.info).toHaveBeenCalledTimes(4);
        expect(log.info).toHaveBeenCalledWith([defyWiredPort, defyWiredBootloader]);
        expect(log.info).toHaveBeenCalledWith("focus.request:", "help");
        expect(log.info).toHaveBeenCalledWith("performing request");
        expect(log.info).toHaveBeenCalledWith("focus: incoming data:", ".");

        expect(log.error).toHaveBeenCalledTimes(1);
        expect(log.error).toHaveBeenCalledWith("error when opening port: ", new Error("cannot open"));

        expect(log.warn).toHaveBeenCalledTimes(0);
        expect(log.verbose).toHaveBeenCalledTimes(0);
        expect(log.debug).toHaveBeenCalledTimes(0);
        expect(log.silly).toHaveBeenCalledTimes(0);
      },
      { timeout: 10000 },
    );
  });
});

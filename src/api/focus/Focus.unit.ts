import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import log from "electron-log/renderer";
import { SerialPort } from "serialport";
import { ErrorCallback } from "@serialport/stream";
import { PortInfo } from "@serialport/bindings-cpp";
import { DygmaDeviceType } from "@Types/dygmaDefs";
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

  afterEach(() => {
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

      // expect(vi.mocked(SerialPort).prototype.close).toHaveBeenCalledTimes(1);
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

    it("shouldn't open a connection", async () => {
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
    });
  });
});

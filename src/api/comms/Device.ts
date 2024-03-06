/* eslint-disable no-console */
import { SerialPort } from "serialport";
import { DeviceClass, DeviceType, DygmaDeviceType, VirtualType } from "@Renderer/types/devices";
import HID from "../hid/hid";
import DeviceMap from "./deviceMap";
import { ExtHIDInterface } from "./types";
// eslint-disable-next-line no-eval
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

class Device implements DeviceClass {
  type: string;
  path: string;
  manufacturer: string;
  serialNumber: string;
  pnpId: string;
  locationId: string;
  productId: string;
  vendorId: string;
  timeout: number;
  result: string;
  callbacks: Array<(value: unknown) => void>;
  device: DygmaDeviceType;
  port?: HID | SerialPort;
  commands?: { [key: string]: unknown; help: Array<string> };
  file?: boolean;
  isClosed: boolean;
  isSending: boolean;
  memoryMap: DeviceMap;
  fileData: VirtualType;

  constructor(parameters: DeviceType | HID | VirtualType, type: string) {
    // constructor for Device
    this.type = type;
    this.timeout = 5000;
    this.port = undefined;
    this.callbacks = [];
    this.result = "";
    this.commands = undefined;
    this.file = false;
    this.isClosed = true;
    this.isSending = false;
    this.memoryMap = new DeviceMap();

    // Handling differences between object types
    let params;
    if (type === "serial") {
      params = parameters as DeviceType;
      this.path = params.path;
      this.manufacturer = params.manufacturer;
      this.serialNumber = params.serialNumber;
      this.pnpId = params.pnpId;
      this.locationId = params.locationId;
      this.productId = params.productId;
      this.vendorId = params.vendorId;
      this.device = params.device;
    }
    if (type === "hid") {
      params = parameters as HID;
      this.path = undefined;
      this.manufacturer = "Dygma";
      this.serialNumber = params.serialNumber;
      this.pnpId = undefined;
      this.locationId = "";
      this.productId = String(params.connectedDevice.productId);
      this.vendorId = String(params.connectedDevice.vendorId);
      const newDevice = params.connectedDevice as ExtHIDInterface;
      this.device = newDevice.device;
      this.port = params as HID;
    }
    if (type === "virtual") {
      params = parameters as VirtualType;
      this.isClosed = false;
      this.path = undefined;
      this.manufacturer = params.device.info.vendor;
      this.serialNumber = params.virtual["hardware.chip_id"].data;
      this.pnpId = undefined;
      this.locationId = undefined;
      this.productId = params.device.usb.productId.toString(16);
      this.vendorId = params.device.usb.vendorId.toString(16);
      this.device = params.device;
      this.file = true;
      this.fileData = params;
    }
  }

  static delay = (ms: number) =>
    new Promise(res => {
      setTimeout(res, ms);
    });

  static help = async (dev: Device) => {
    const data = await dev.request("help");
    const result = data.split(/\r?\n/).filter(v => v.length > 0);
    // console.log("requesting to fill help: ", dev, result);
    return result;
  };

  static HIDhelp = async (dev: Device) => {
    const data = await dev.hidRequest("help");
    const result = data.split(/\r?\n/).filter(v => v.length > 0);
    // console.log("requesting to fill help: ", dev, result);
    return result;
  };

  async addPort(serialport: SerialPort) {
    this.port = serialport;
    this.type = "serial";
    this.isClosed = false;
    serialport.pipe(new DelimiterParser({ delimiter: "\r\n" }));
    // Port is loaded, creating message handler
    const parser = this.port.pipe(new DelimiterParser({ delimiter: "\r\n" }));
    parser.on("data", (data: Buffer) => {
      const utfData = data.toString("utf-8");
      console.log("addport: incoming data:", utfData);

      if (utfData === "." || utfData.endsWith(".")) {
        const { result } = this;
        const resolve = this.callbacks.shift();

        this.result = "";
        if (resolve) {
          resolve(result.trim());
        }
      } else if (this.result.length === 0) {
        this.result = utfData;
      } else {
        this.result += `\r\n${utfData}`;
      }
    });
    const kbCommands = await Device.help(this);
    console.log("these are the commands", kbCommands);
    this.commands = {
      help: kbCommands,
    };
  }

  async addHID() {
    const kbCommands = await Device.HIDhelp(this);
    this.isClosed = false;
    console.log("these are the commands", kbCommands);
    this.commands = {
      help: kbCommands,
    };
  }

  async close() {
    try {
      if (this.type === "serial") await this.port.close();
      if (this.type === "hid") await (this.port as HID).connectedDevice.close();
      this.memoryMap = new DeviceMap();
      this.isClosed = true;
    } catch (error) {
      console.error(error);
    }
  }

  request(command: string, ...args: Array<string>) {
    console.log("device.request:", command, ...args);
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Communication timeout"));
      }, this.timeout);
      this.serialRequest(command, ...args)
        .then((data: string) => {
          clearTimeout(timer);
          resolve(data as string);
        })
        .catch((err: Error) => {
          console.log("Error sending request from focus", err);
          reject(new Error("Error sending request from focus"));
        });
    });
  }

  async serialRequest(cmd: string, ...args: string[]) {
    console.log("performing request");
    if (!this.port) throw new Error("Device not connected!");

    let request = cmd;
    if (args && args.length > 0) {
      request = `${request} ${args.join(" ")}`;
    }
    request += "\n";

    return new Promise<string>(resolve => {
      this.callbacks.push(resolve);
      (this.port as SerialPort).write(request);
    });
  }

  async hidRequest(cmd: string, ...args: Array<string>) {
    if (this.port === undefined) throw new Error("Device not connected!");

    let request = cmd;
    if (args && args.length > 0) {
      request = `${request} ${args.join(" ")}`;
    }
    request += "\n";

    let returnValue = "";
    await (this.port as HID).sendData(
      request,
      (rxData: string) => {
        returnValue = rxData;
      },
      (err: Error) => {
        console.error(err);
        console.log("now closing device");
        try {
          (this.port as HID).close();
        } catch (error) {
          console.log("error when closing the device: ", error);
        }
      },
    );
    console.log("device.hid.request:", cmd, ...args, "retured: ", returnValue);
    return returnValue;
  }

  async virtualRequest(cmd: string, ...args: string[]) {
    console.log("performing virtual request");
    if (args.length > 0 && this.fileData.virtual[cmd].eraseable) {
      this.fileData.virtual[cmd].data = args.join(" ");
    }
    console.log(`reading virtual data from ${cmd}: `, this.fileData.virtual[cmd]);
    let result = "";
    if (this.fileData.virtual[cmd] !== undefined) {
      result = this.fileData.virtual[cmd].data;
    }
    console.log(result);
    return new Promise<string>(resolve => {
      resolve(result);
    });
  }

  async command(cmd: string, ...args: Array<string>) {
    if (this.isClosed || (this.port === undefined && !this.file)) return undefined;

    // HashMap cache to improve performance
    if (!args || args.length === 0) {
      // if no args and it hits the cache, return the cache
      if (this.memoryMap.has(cmd)) return this.memoryMap.get(cmd);
    }
    if (args || args.length > 0) {
      // if args and no changes with cache, return cache instead of sending the command to the keyboard
      if (this.memoryMap.isUpdated(cmd, args.join(" "))) return this.memoryMap.get(cmd);
    }

    let result: string;
    this.isSending = true;
    try {
      if (this.type === "serial") result = await this.request(cmd, ...args);
      if (this.type === "hid") result = await this.hidRequest(cmd, ...args);
      if (this.type === "virtual") result = await this.virtualRequest(cmd, ...args);
    } catch (error) {
      console.log("Error when handling request", error);
      result = error;
    }
    if (!args || args.length === 0) {
      // if no args and it hits the cache, return the cache
      this.memoryMap.set(cmd, result);
    } else {
      this.memoryMap.set(cmd, args.join(" "));
    }
    this.isSending = false;
    return result;
  }

  async noCacheCommand(cmd: string, ...args: Array<string>) {
    if (this.isClosed || (this.port === undefined && !this.file)) return undefined;

    let result: string;
    this.isSending = true;
    try {
      if (this.type === "serial") result = await this.request(cmd, ...args);
      if (this.type === "hid") result = await this.hidRequest(cmd, ...args);
      if (this.type === "virtual") result = await this.virtualRequest(cmd, ...args);
    } catch (error) {
      console.log("Error when handling request", error);
      result = error;
    }
    if (!args || args.length === 0) {
      // if no args and it hits the cache, return the cache
      this.memoryMap.set(cmd, result);
    } else {
      this.memoryMap.set(cmd, args.join(" "));
    }
    this.isSending = false;
    return result;
  }

  async write_parts(parts: Array<string>, cb: () => void) {
    if (!parts || parts.length === 0) {
      cb();
      return;
    }

    let part = parts.shift();
    part += " ";
    (this.port as SerialPort).write(part);
    (this.port as SerialPort).drain(async () => {
      await this.write_parts(parts, cb);
    });
  }

  addCommands(cmds: string) {
    Object.assign(this.commands, cmds);
  }

  static isDevice = (device: any): device is DeviceClass => "type" in device;
}

export default Device;

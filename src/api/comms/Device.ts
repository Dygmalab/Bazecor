import { DeviceType } from "../../renderer/types/devices";
import HID from "../hid/hid";
// eslint-disable-next-line no-eval
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

interface Device {
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
  callbacks: Array<any>;
  device: any;
  port?: any;
  commands?: any;
  file?: boolean;
  isClosed: boolean;
}

class Device {
  constructor(parameters: DeviceType | HID, type: string) {
    // constructor for Device
    this.type = type;
    this.timeout = 5000;
    this.port = undefined;
    this.callbacks = [];
    this.result = "";
    this.commands = undefined;
    this.file = false;
    this.isClosed = true;

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
      this.path = "";
      this.manufacturer = "Dygma";
      this.serialNumber = params.serialNumber;
      this.pnpId = "";
      this.locationId = "";
      this.productId = String(params.connectedDevice.productId);
      this.vendorId = String(params.connectedDevice.vendorId);
      const newDevice = params.connectedDevice as any;
      this.device = newDevice.device;
      this.port = params;
    }
  }

  static delay = (ms: number) =>
    new Promise(res => {
      setTimeout(res, ms);
    });

  static help = async (dev: any) => {
    const data = await dev.request("help");
    const result = data.split(/\r?\n/).filter((v: any) => v.length > 0);
    // console.log("requesting to fill help: ", dev, result);
    return result;
  };

  static HIDhelp = async (dev: any) => {
    const data = await dev.hidRequest("help");
    const result = data.split(/\r?\n/).filter((v: any) => v.length > 0);
    // console.log("requesting to fill help: ", dev, result);
    return result;
  };

  addPort = async (serialport: any) => {
    this.port = serialport;
    this.type = "serial";
    this.isClosed = false;
    // Port is loaded, creating message handler
    const parser = this.port.pipe(new DelimiterParser({ delimiter: "\r\n" }));
    parser.on("data", (data: any) => {
      const utfData = data.toString("utf-8");
      console.log("focus: incoming data:", utfData);

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
  };

  addHID = async (device: any) => {
    const kbCommands = await Device.HIDhelp(this);
    this.isClosed = false;
    console.log("these are the commands", kbCommands, device);
    this.commands = {
      help: kbCommands,
    };
  };

  close = async () => {
    try {
      await this.port.close();
      this.isClosed = true;
    } catch (error) {
      console.error(error);
    }
  };

  request(command: string, ...args: Array<any>) {
    console.log("focus.request:", command, ...args);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Communication timeout"));
      }, this.timeout);
      this.serialRequest(command, ...args)
        .then(data => {
          clearTimeout(timer);
          resolve(data);
        })
        .catch(err => {
          console.log("Error sending request from focus", err);
          reject(new Error("Error sending request from focus"));
        });
    });
  }

  async serialRequest(cmd: string, ...args: any[]) {
    console.log("performing request");
    if (!this.port) throw new Error("Device not connected!");

    let request = cmd;
    if (args && args.length > 0) {
      request = `${request} ${args.join(" ")}`;
    }
    request += "\n";

    return new Promise(resolve => {
      this.callbacks.push(resolve);
      this.port.write(request);
    });
  }

  hidRequest = async (cmd: string, ...args: Array<string>) => {
    if (this.port === undefined) throw new Error("Device not connected!");
    console.log("focus.request:", cmd, ...args, this.port);

    let request = cmd;
    if (args && args.length > 0) {
      request = `${request} ${args.join(" ")}`;
    }
    request += "\n";

    let returnValue = "";
    await this.port.sendData(
      request,
      (rxData: any) => {
        returnValue = rxData;
      },
      (err: Error) => {
        console.log(err);
      },
    );
    console.log("return value of request: ", returnValue);
    return returnValue;
  };

  command = async (command: string, ...args: Array<string>) => {
    if (this.port === undefined) return false;
    // if (typeof this.commands[command] === "function") {
    //   return this.commands[command](this, ...args);
    // }
    // if (typeof this.commands[command] === "object") {
    //   return this.commands[command].focus(this, ...args);
    // }
    if (this.type === "serial") return this.request(command, ...args);
    return this.hidRequest(command, ...args);
  };

  write_parts = async (parts: Array<any>, cb: () => void) => {
    if (!parts || parts.length === 0) {
      cb();
      return;
    }

    let part = parts.shift();
    part += " ";
    this.port.write(part);
    this.port.drain(async () => {
      await this.write_parts(parts, cb);
    });
  };

  addCommands = (cmds: string) => {
    Object.assign(this.commands, cmds);
  };

  // addMethod = (methodName: string, command: string) => {
  //   const keyedMethodName = methodName as keyof Device;
  //   if (this[keyedMethodName]) {
  //     const tmp = this[keyedMethodName];
  //     this[keyedMethodName as any] = (...args: Array<any>) => {
  //       tmp(...args);
  //       this.commands[command][methodName](...args);
  //     };
  //   } else {
  //     this[keyedMethodName as never] = (...args: Array<any>) => {
  //       this.commands[command][methodName](...args);
  //     };
  //   }
  // };
}

export default Device;

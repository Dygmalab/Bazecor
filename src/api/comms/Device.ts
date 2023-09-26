import { DeviceType } from "../../renderer/types/devices";

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
  device: any;
  port?: any;
  data?: any;
}

class Device {
  constructor(parameters: DeviceType, type: string) {
    // constructor for Device
    this.type = type;
    this.path = parameters.path;
    this.manufacturer = parameters.manufacturer;
    this.serialNumber = parameters.serialNumber;
    this.pnpId = parameters.pnpId;
    this.locationId = parameters.locationId;
    this.productId = parameters.productId;
    this.vendorId = parameters.vendorId;
    this.device = parameters.device;
    this.port = undefined;
    this.data = [];
  }

  addPort = (serialport: any) => {
    this.port = serialport;
    this.type = "serial";
    // Port is loaded, creating message handler
    const parser = this.port.pipe(new DelimiterParser({ delimiter: "\r\n" }));
    parser.on("data", (data: any) => {
      this.data.push(data.toString("utf-8"));
    });
  };

  command = async (command: string, data: string) => {
    if (this.port === undefined) return false;
    let payload = command;
    if (data !== undefined) {
      payload = `${payload} ${data}`;
    }
    const response = await this.port.write(payload);
    return response;
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
}

export default Device;

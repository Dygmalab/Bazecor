/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-bitwise */
import fs from "fs";
import log from "electron-log/renderer";
import Hardware from "../../hardware";
import { DeviceType } from "../../../renderer/types/devices";

const { SerialPort } = eval('require("serialport")');
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');
// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const find = async () => {
  const serialDevices = await SerialPort.list();

  const foundDevices = [];

  log.info("SerialPort devices find:", serialDevices);
  for (const device of serialDevices) {
    for (const Hdevice of Hardware.serial) {
      if (
        parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
        parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId
      ) {
        const newPort = { ...device };
        newPort.device = Hdevice;
        foundDevices.push(newPort);
      }
    }
    for (const Hdevice of Hardware.bootloader) {
      if (
        parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
        parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId
      ) {
        const newPort = { ...device };
        newPort.device = Hdevice;
        foundDevices.push(newPort);
      }
    }
  }
  log.info("Usable found devices:", foundDevices);

  return foundDevices;
};

const checkProperties = async (path: string) => {
  const callbacks: any[] = [];
  let result = "";

  async function rawCommand(cmd: string, serialPort: typeof SerialPort): Promise<string> {
    const req = async (c: string) => {
      if (!serialPort) throw new Error("Device not connected!");
      return new Promise<string>(resolve => {
        callbacks.push(resolve);
        // eslint-disable-next-line no-param-reassign
        serialPort.write((c += "\n"));
      });
    };
    return new Promise<string>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Communication timeout"));
      }, 2000);
      req(cmd).then((data: string) => {
        clearTimeout(timer);
        resolve(data);
      });
    });
  }

  log.info("receivedDevice: ", path);

  const serialport = new SerialPort({
    path,
    baudRate: 115200,
    autoOpen: false,
    endOnClose: true,
  });
  const parser = serialport.pipe(new DelimiterParser({ delimiter: "\r\n" }));

  parser.on("data", (data: Buffer) => {
    const utfData = data.toString("utf-8");
    log.info("data:", utfData);

    if (utfData === "." || utfData.endsWith(".")) {
      const resolve = callbacks.shift();

      if (resolve) {
        resolve(result.trim());
      }
      result = "";
    } else if (result.length === 0) {
      result = utfData;
    } else {
      result += `\r\n${utfData}`;
    }
  });

  await serialport.open((err: Error) => {
    if (err) log.error("error when opening port: ", err);
    else log.info("connected");
  });

  const wless = await rawCommand("hardware.wireless", serialport);
  const lay = await rawCommand("hardware.layout", serialport);

  await serialport.close();

  return { wireless: wless.includes("true"), layout: lay.includes("ISO") ? "ISO" : "ANSI" };
};

const open = async (device: DeviceType) => {
  const serialport = new SerialPort({
    path: device.path,
    baudRate: 115200,
    autoOpen: false,
    endOnClose: true,
  });
  serialport.open((err: Error) => {
    if (err) log.error("error when opening port: ", err);
    else log.info("connected");
  });
  return serialport;
};

const connect = async (device: DeviceType) => {
  const dev = await open(device);
  return dev;
};

const isDeviceConnected = (device: DeviceType) => {
  if (process.platform !== "linux") return true;

  try {
    fs.accessSync(device.path, fs.constants.R_OK | fs.constants.W_OK);
  } catch (e) {
    return false;
  }
  return true;
};

const isDeviceSupported = async (device: DeviceType) => {
  if (!device.device.isDeviceSupported) {
    return true;
  }
  const supported = await device.device.isDeviceSupported(device.path);
  // log.info("focus.isDeviceSupported: port=", device, "supported=", supported);
  return supported;
};

const isSerialType = (device: any): device is any => "path" in device;

export { find, connect, isDeviceConnected, isDeviceSupported, DeviceType, checkProperties, isSerialType };

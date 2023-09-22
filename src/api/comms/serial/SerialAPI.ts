/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-bitwise */
import fs from "fs";
// import { SerialPort } from "serialport";
import Hardware from "../../hardware";
import { DeviceType } from "../../../renderer/types/devices";

const { SerialPort } = eval('require("serialport")');
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

// const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

const find = async () => {
  const serialDevices = await SerialPort.list();

  const foundDevices = [];

  console.log("SerialPort devices find:", serialDevices);
  for (const device of serialDevices) {
    for (const Hdevice of Hardware.serial) {
      if (
        parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
        parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId
      ) {
        const newPort: DeviceType = { ...device };
        newPort.device = Hdevice;
        foundDevices.push(newPort);
      }
    }
  }
  console.log("Usable found devices:", foundDevices);

  return foundDevices;
};

const open = async (device: any) => {
  const serialport = new SerialPort({
    path: device.path,
    baudRate: 115200,
    autoOpen: false,
    endOnClose: true,
  });
  serialport.open((err: Error) => {
    if (err) console.error("error when opening port: ", err);
    else console.log("connected");
  });
  const parser = serialport.pipe(new DelimiterParser({ delimiter: "\r\n" }));
  const receivedData = [];
  parser.on("data", (data: any) => {
    receivedData.push(data.toString("utf-8"));
  });
  return serialport;
};

const connect = async (device: any) => {
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
  const supported = await device.device.isDeviceSupported(device);
  console.log("focus.isDeviceSupported: port=", device, "supported=", supported);
  return supported;
};

const isSerialType = (device: any): device is DeviceType => "path" in device;

export { find, connect, isDeviceConnected, isDeviceSupported, DeviceType, isSerialType };

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-eval */
/* eslint-disable no-bitwise */
import fs from "fs";
import Hardware from "../../hardware";

const { SerialPort } = eval('require("serialport")');
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

interface DeviceType {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
  device?: any | undefined;
}

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

const connect = () => {};

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

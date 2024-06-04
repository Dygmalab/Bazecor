/* eslint-disable no-await-in-loop */
/* eslint-disable no-eval */
import log from "electron-log/renderer";
import type { SerialPort as SP } from "serialport";
import Hardware from "../../hardware";
import { DeviceType } from "../../../renderer/types/devices";

const { SerialPort } = eval('require("serialport")');
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

const open = async (path: string) => {
  const serialport: SP = new SerialPort({
    path,
    baudRate: 115200,
    autoOpen: false,
    endOnClose: true,
  });
  try {
    await serialport.open((error: Error) => {
      if (error) log.error("error when opening port: ", error);
    });
  } catch (error) {
    log.info("error when opening port", error);
  }
  return serialport;
};

const close = async (serialport: SP) => {
  try {
    // destroy connection
    await serialport.drain();
    if (serialport) {
      while (serialport.isOpen === true) {
        log.info("Closing device port!!");
        await serialport.close();
        await serialport.removeAllListeners();
        await serialport.destroy();
      }
    }
  } catch (error) {
    log.info("catched error when closing", error);
  }
};

const checkProperties = async (path: string) => {
  let callbacks: any[] = [];
  let result = "";

  function rawCommand(cmd: string, serialPort: SP): Promise<string> {
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

  const serialport = await open(path);
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

  const wless = await rawCommand("hardware.wireless", serialport);
  const lay = await rawCommand("hardware.layout", serialport);

  log.info("data when received", wless, lay);

  await close(serialport);
  callbacks = [];

  return { wireless: wless.includes("true"), layout: lay.includes("ISO") ? "ISO" : "ANSI" };
};

const find = async () => {
  const serialDevices = await SerialPort.list();

  const foundDevices = [];

  log.info("SerialPort devices find:", serialDevices);
  for (const device of serialDevices) {
    if (device.vendorId === "35ef" || device.vendorId === "1209") {
      const supported = await checkProperties(device.path);
      for (const Hdevice of Hardware.serial) {
        if (
          parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
          parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId &&
          (Hdevice.info.product === "Defy" || Hdevice.info.keyboardType === supported.layout)
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
  }
  log.info("Usable found devices:", foundDevices);

  return foundDevices;
};

const connect = async (device: DeviceType) => {
  const dev = await open(device.path);
  return dev;
};

const isSerialType = (device: any): device is any => "path" in device;

export { find, connect, DeviceType, checkProperties, isSerialType };

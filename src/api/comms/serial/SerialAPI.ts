/* eslint-disable no-await-in-loop */
/* eslint-disable no-eval */
import log from "electron-log/renderer";
import type { SerialPort as SP } from "serialport";
import type { PortInfo } from "@serialport/bindings-cpp";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { DeviceType } from "@Types/devices";
import Hardware from "../../hardware";

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

interface SerialProperties {
  wireless: boolean;
  layout: string;
  chipId: string;
}

const checkProperties = async (path: string): Promise<SerialProperties> => {
  let callbacks: ((value: string | PromiseLike<string>) => void)[] = [];
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
  const chipId = await rawCommand("hardware.chip_id", serialport);

  log.info("data when received", wless, lay, chipId);

  await close(serialport);
  callbacks = [];

  return { wireless: wless.includes("true"), layout: lay.includes("ISO") ? "ISO" : "ANSI", chipId };
};

interface ExtendedPort extends PortInfo {
  device: DygmaDeviceType;
}

const enumerate = async (
  bootloader: boolean,
  searchDevice?: USBDevice,
  existingIDs?: string[],
): Promise<{ foundDevices: ExtendedPort[]; validDevices: string[] }> => {
  const serialDevices: PortInfo[] = await SerialPort.list();

  const foundDevices = [];
  const validDevices: string[] = [];
  const hw = bootloader ? Hardware.bootloader : Hardware.serial;

  if (searchDevice !== undefined && existingIDs !== undefined) {
    log.info("Enumerating unique device:", searchDevice, serialDevices);

    for (const device of serialDevices) {
      const vID = parseInt(`0x${device.vendorId}`, 16);
      const pID = parseInt(`0x${device.productId}`, 16);
      const Bdevice = Hardware.bootloader.find(h => h.usb.productId === pID && h.usb.vendorId === vID);
      if (Bdevice) {
        // Special treatment for Raise Bootloader
        const newPort: ExtendedPort = { ...device, device: { ...Bdevice } };
        log.info("Detected Bootloader: ", newPort, Bdevice, true);
        foundDevices.push(newPort);
        // eslint-disable-next-line no-continue
        continue;
      }
      if (vID === searchDevice.vendorId && pID === searchDevice.productId && !existingIDs.includes(device.serialNumber)) {
        const supported = await checkProperties(device.path);
        const Hdevice = Hardware.serial.find(
          h =>
            h.usb.productId === pID &&
            h.usb.vendorId === vID &&
            (h.info.keyboardType === supported.layout || h.info.product === "Defy"),
        );
        const newPort: ExtendedPort = { ...device, device: { ...Hdevice } };
        log.info("Newly created port: ", newPort, Hdevice, supported);
        newPort.device.wireless = newPort.device.info.product === "Defy" ? newPort.device.wireless : supported.wireless;
        newPort.device.chipId = supported.chipId;
        foundDevices.push(newPort);
      }
    }
    return { foundDevices, validDevices };
  }

  if (searchDevice === undefined && existingIDs !== undefined) {
    log.info("Enumerating non listed devices:", existingIDs, serialDevices);

    for (const device of serialDevices) {
      const vID = parseInt(`0x${device.vendorId}`, 16);
      const pID = parseInt(`0x${device.productId}`, 16);
      const Bdevice = Hardware.bootloader.find(h => h.usb.productId === pID && h.usb.vendorId === vID);
      if (Bdevice) {
        // Special treatment for Raise Bootloader
        const newPort: ExtendedPort = { ...device, device: { ...Bdevice } };
        log.info("Detected Bootloader: ", newPort, Bdevice, true);
        foundDevices.push(newPort);
        // eslint-disable-next-line no-continue
        continue;
      }
      if ([0x35ef, 0x1209].includes(vID) && !existingIDs.includes(device.serialNumber.toLowerCase())) {
        const supported = await checkProperties(device.path);
        const Hdevice = Hardware.serial.find(
          h =>
            h.usb.productId === pID &&
            h.usb.vendorId === vID &&
            (h.info.keyboardType === supported.layout || h.info.product === "Defy"),
        );
        const newPort: ExtendedPort = { ...device, device: { ...Hdevice } };
        log.info("Newly created port: ", newPort, Hdevice, supported);
        newPort.device.wireless = newPort.device.info.product === "Defy" ? newPort.device.wireless : supported.wireless;
        newPort.device.chipId = supported.chipId;
        foundDevices.push(newPort);
      }
      if ([0x35ef, 0x1209].includes(vID) && existingIDs.includes(device.serialNumber.toLowerCase()))
        validDevices.push(device.serialNumber.toLowerCase());
    }
    return { foundDevices, validDevices };
  }

  log.info("SerialPort enumerating devices:", serialDevices);

  for (const device of serialDevices) {
    if ([0x35ef, 0x1209].includes(parseInt(`0x${device.vendorId}`, 16))) {
      for (const Hdevice of hw) {
        if (
          parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
          parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId
        ) {
          const newPort: ExtendedPort = { ...device, device: { ...Hdevice } };
          foundDevices.push(newPort);
        }
      }
    }
  }
  return { foundDevices, validDevices };
};

const find = async (): Promise<ExtendedPort[]> => {
  const serialDevices: PortInfo[] = await SerialPort.list();

  const foundDevices: ExtendedPort[] = [];

  log.info("SerialPort devices find:", serialDevices);
  for (const device of serialDevices) {
    if ([0x35ef, 0x1209].includes(parseInt(`0x${device.vendorId}`, 16))) {
      let foundBootloader = false;
      for (const Hdevice of Hardware.bootloader) {
        if (
          parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
          parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId
        ) {
          const newPort = { ...device, device: { ...Hdevice } };
          foundDevices.push(newPort);
          foundBootloader = true;
        }
      }
      if (foundBootloader) break;
      const supported = await checkProperties(device.path);
      for (const Hdevice of Hardware.serial) {
        if (
          parseInt(`0x${device.productId}`, 16) === Hdevice.usb.productId &&
          parseInt(`0x${device.vendorId}`, 16) === Hdevice.usb.vendorId &&
          (Hdevice.info.product === "Defy" || Hdevice.info.keyboardType === supported.layout)
        ) {
          const newPort = { ...device, device: { ...Hdevice } };
          newPort.device.wireless = supported.wireless;
          newPort.device.chipId = supported.chipId;
          foundDevices.push(newPort);
        }
      }
    }
  }
  log.info("Usable found devices:", foundDevices);

  return foundDevices;
};

type ConnectType = (device: DeviceType) => Promise<SP>;

const connect: ConnectType = async device => {
  const dev = await open(device.path);
  return dev;
};

const isSerialType = (device: any): device is any => "path" in device;

export { find, ExtendedPort, enumerate, ConnectType, connect, DeviceType, SerialProperties, checkProperties, isSerialType };

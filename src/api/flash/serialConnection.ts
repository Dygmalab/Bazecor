/* eslint-disable @typescript-eslint/no-loop-func */
/* eslint-disable prefer-destructuring */
/* eslint-disable no-buffer-constructor */
/* eslint-disable no-eval */
/* eslint-disable no-await-in-loop */
import type { PortInfo } from "@serialport/bindings-cpp";
import log from "electron-log/renderer";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import type { SerialPort as SP } from "serialport";
import { delay } from "../../main/utils/delay";
import { InfoType } from "./types";
import Hardware from "../hardware";

const { SerialPort } = eval("require('serialport')");
const callbacks: Array<(value: unknown) => void> = [];

function infoFromDevice(convertedData: Uint8Array) {
  const block: InfoType = {
    bldr_info_header_t: {
      device_id: "",
      bldr_version: "",
    },
    seal_version: 0,
    hw_version: 0,
    fw_version: "",
    flash_start: 0,
    program_space_start: 0,
    seal_address: 0,
    flash_size: 0,
    erase_alignment: 0,
    write_alignment: 0,
    max_data_length: 0,
  };

  block.bldr_info_header_t.device_id = new Buffer(convertedData).toString("utf-8", 0, 4);
  block.bldr_info_header_t.bldr_version = convertedData.slice(4, 7).join(".");
  block.seal_version = convertedData[8];
  block.hw_version = convertedData[12];
  block.fw_version = convertedData.slice(16, 19).join(".");
  block.flash_start = new Buffer(convertedData.slice(20, 24)).readInt32LE(); // convert 4 8 bit values to 32 bit
  block.program_space_start = new Buffer(convertedData.slice(24, 28)).readInt32LE(); // convert 4 8 bit values to 32 bit
  block.seal_address = new Buffer(convertedData.slice(28, 32)).readInt32LE(); // convert 4 8 bit values to 32 bit
  block.flash_size = new Buffer(convertedData.slice(32, 36)).readInt32LE(); // convert 4 8 bit values to 32 bit
  block.erase_alignment = new Buffer(convertedData.slice(36, 40)).readInt32LE(); // convert 4 8 bit values to 32 bit
  block.write_alignment = new Buffer(convertedData.slice(40, 44)).readInt32LE(); // convert 4 8 bit values to 32 bit
  block.max_data_length = new Buffer(convertedData.slice(44, 48)).readInt32LE(); // convert 4 8 bit values to 32 bit

  return block;
}

export const serialConnection = async () => {
  log.info("starting NRF52XXX serial connection");

  let deviceList: PortInfo[];
  let selectedDev: PortInfo;
  let retry = 5;

  while (selectedDev === undefined && retry > 0) {
    await delay(500);
    deviceList = await SerialPort.list();
    for (let i = 0; i < deviceList.length; i += 1) {
      const result = Hardware.bootloader.findIndex(
        (hw: DygmaDeviceType) =>
          parseInt(deviceList[i].vendorId, 16) === hw.usb.vendorId && parseInt(deviceList[i].productId, 16) === hw.usb.productId,
      );
      log.info("hardware check for bootloaders: ", result);
      if (result >= 0) {
        selectedDev = deviceList[i];
        break;
      }
    }
    retry -= 1;
  }
  log.info("SerialConnection Found this device:", selectedDev);

  const serialport = new SerialPort({
    path: selectedDev.path,
    baudRate: 115200,
    autoOpen: true,
    endOnClose: true,
  });
  // Switches the port into "flowing mode"
  serialport.on("data", async (data: Buffer) => {
    if (data.length > 40) {
      log.info("Data:", data);
      log.info("Data length", data.length);
      const convertedData = new Uint8Array(data);

      const instantResolve = callbacks.shift();
      const block = infoFromDevice(convertedData);
      let count = 0;
      while (typeof instantResolve !== "function" && count < 5) {
        await delay(10);
        count += 1;
      }
      if (typeof instantResolve === "function") instantResolve(block);
    } else {
      // log.info('Data:', data);
      const instantResolve = callbacks.shift();
      let count = 0;
      while (typeof instantResolve !== "function" && count < 5) {
        await delay(10);
        count += 1;
      }
      if (typeof instantResolve === "function") instantResolve(new Uint8Array(data));
    }
  });

  return serialport;
};

export async function rawCommand(
  cmd: string | Buffer,
  serialPort: typeof SerialPort,
  timeout: number,
  ...args: unknown[]
): Promise<any> {
  const req = (c: string | Buffer, ...args2: unknown[]) => {
    log.info(c, args2);
    if (!serialPort) throw new Error("Device not connected!");
    return new Promise(resolve => {
      callbacks.push(resolve);
      serialPort.write(c);
    });
  };
  const result: Buffer = await new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error("Communication timeout"));
    }, timeout);
    req(cmd, ...args).then((data: any) => {
      log.info("draining");
      serialPort.drain((err: Error) => {
        if (err) throw err;
        clearTimeout(timer);
        resolve(data);
      });
    });
  });

  return result;
}

export function noWaitCommand(cmd: string | Buffer | ArrayBuffer, serialPort: SP) {
  if (!(cmd instanceof ArrayBuffer)) {
    log.info("not InstanceOf ArrayBuffer");
    serialPort.write(cmd);
  } else {
    log.info("it is!!", cmd);
    const buf = new Uint8Array(cmd);

    let total = buf.length;

    let bufferTotal = 0;

    while (bufferTotal < buf.length) {
      const bufferSize = total < 200 ? total : 200;

      // closure to ensure our buffer is local.
      (buf2send => {
        serialPort.write(Buffer.from(buf2send));
      })(cmd.slice(bufferTotal, bufferTotal + bufferSize));

      bufferTotal += bufferSize;
      total -= bufferSize;
    }
  }
}

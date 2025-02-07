/* eslint-disable no-eval */
/* eslint-disable no-await-in-loop */
/* eslint-disable class-methods-use-this */
/* bazecor-focus -- Bazecor Focus protocol library
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019, 2020 DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */
import log from "electron-log/renderer";
import { spawn } from "child_process";
import type { SerialPort, SerialPortOpenOptions } from "serialport";
import type { AutoDetectTypes, PortInfo } from "@serialport/bindings-cpp";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { delay } from "../../main/utils/delay";

// TODO: any reason we can't import directly?
const sp = eval('require("serialport")');
const { DelimiterParser } = eval('require("@serialport/parser-delimiter")');

type AnyFunction = (...args: unknown[]) => unknown;

type CommandOverrides = Record<string, AnyFunction | { focus: AnyFunction; [k: string]: AnyFunction }>;

export class Focus {
  private static instance: Focus;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  public static getInstance() {
    if (!Focus.instance) {
      Focus.instance = new Focus();
    }
    return Focus.instance;
  }

  public timeout = 5000;
  public debug = false;
  closed = true;
  commands: CommandOverrides = { help: this._help };

  protected async listSerialPorts(): Promise<PortInfo[]> {
    return sp.SerialPort.list();
  }

  protected createSerialPort<T extends AutoDetectTypes>(
    options: SerialPortOpenOptions<T>,
    openCallback?: ErrorCallback,
  ): SerialPort<T> {
    return new sp.SerialPort(options, openCallback);
  }

  async find(...devices: DygmaDeviceType[]) {
    const portList = await this.listSerialPorts();

    const foundDevices = [];

    log.info("focus.find: portList:", portList, "devices:", devices);
    for (const port of portList) {
      for (const device of devices) {
        if (
          parseInt(`0x${port.productId}`, 16) === device.usb.productId &&
          parseInt(`0x${port.vendorId}`, 16) === device.usb.vendorId
        ) {
          foundDevices.push({ ...port, device });
        }
      }
    }

    log.info("focus.find: foundDevices:", foundDevices);

    return foundDevices;
  }

  device: DygmaDeviceType;
  result: string;
  callbacks: Array<(value: unknown) => void>;
  supportedCommands: Array<string>;
  _port: SerialPort;
  parser: typeof DelimiterParser;

  async open(path: string, info: DygmaDeviceType): Promise<SerialPort> {
    if (this._port !== undefined && this._port.isOpen === false) {
      await this.close();
    }

    try {
      if (path !== undefined) {
        const testingDevices = await this.listSerialPorts();
        log.info(testingDevices);
        this._port = this.createSerialPort({ path, baudRate: 115200, autoOpen: false, endOnClose: true });
        await this._port.open((err: Error) => {
          if (err) log.error("error when opening port: ", err);
          else log.info("connected");
        });
      } else {
        throw Error("device not a string or object!");
      }

      this.device = info;
      this.parser = this._port.pipe(new DelimiterParser({ delimiter: "\r\n" }));
      this.result = "";
      this.callbacks = [];
      this.supportedCommands = [];
      this.parser.on("data", (data: Buffer) => {
        // eslint-disable-next-line no-param-reassign
        const localData = data.toString("utf-8");
        log.info("focus: incoming data:", localData);

        if (localData === "." || localData.endsWith(".")) {
          const { result } = this;
          const resolve = this.callbacks.shift();

          this.result = "";
          if (resolve) {
            resolve(result.trim());
          }
        } else if (this.result.length === 0) {
          this.result = localData;
        } else {
          this.result += `\r\n${localData}`;
        }
      });

      if (process.platform === "darwin") {
        spawn("stty", ["-f", this._port.path, "clocal"]);
      }

      // It's not necessary to retrieve the supported commands in bootloader mode
      if (!this.device.bootloader) {
        try {
          this.supportedCommands = await this._help(this);
        } catch (e) {
          log.warn(e);
          // Ignore
        }
      }
    } catch (error) {
      log.error("found this error while opening!", error);
      // throw new Error("Unable to connect");
    }

    if (this._port !== undefined) {
      // Setup error port alert
      this._port.on("error", async (err: Error) => {
        log.error(`Error on SerialPort: ${err}`);
        await this._port.close();
      });
    }
    this.closed = false;
    return this._port;
  }

  private clearContext() {
    this.result = "";
    this.callbacks = [];
    this.device = null;
    this.supportedCommands = [];
  }

  async close() {
    let result;
    try {
      if (this._port) {
        while (this._port.isOpen === true) {
          log.info("Closing device port!!");
          result = await this._port.close();
          await this._port.removeAllListeners();
          await this._port.destroy();
        }
        delete this._port;
        this.closed = true;
        await delay(200);
      }
    } catch (error) {
      log.error("error when closing", error);
    }

    this.clearContext();
    return result;
  }

  async isDeviceSupported(device: { device: { isDeviceSupported?: (device: unknown) => Promise<boolean> } }) {
    if (!device.device.isDeviceSupported) {
      return true;
    }
    const supported = await device.device.isDeviceSupported(device);
    log.info("focus.isDeviceSupported: port=", device, "supported=", supported);
    return supported;
  }

  isCommandSupported(cmd: string) {
    return this.supportedCommands.indexOf(cmd) !== -1;
  }

  request<T>(cmd: string, ...args: unknown[]) {
    log.info("focus.request:", cmd, ...args);
    return new Promise<T>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Communication timeout"));
      }, this.timeout);
      this._request(cmd, ...args)
        .then((data: T) => {
          clearTimeout(timer);
          resolve(data);
        })
        .catch(err => {
          log.info("Error sending request from focus", err);
          reject(new Error("Error sending request from focus"));
        });
    });
  }

  private async _request(cmd: string, ...args: unknown[]) {
    log.info("performing request");
    if (!this._port) throw new Error("Device not connected!");

    let request = cmd;
    if (args && args.length > 0) {
      request = `${request} ${args.join(" ")}`;
    }
    request += "\n";

    return new Promise(resolve => {
      this.callbacks.push(resolve);
      this._port.write(request);
    });
  }

  async command(cmd: string, ...args: unknown[]) {
    const override = this.commands[cmd];
    if (typeof override === "function") {
      return override(this, ...args);
    }
    if (typeof override === "object") {
      return override.focus(this, ...args);
    }
    return this.request(cmd, ...args);
  }

  private async _help(s: Focus) {
    const data = await s.request<string>("help");
    return data.split(/\r?\n/).filter((v: string) => v.length > 0);
  }
}

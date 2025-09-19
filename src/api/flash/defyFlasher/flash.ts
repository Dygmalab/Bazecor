/* eslint-disable class-methods-use-this */
/* eslint-disable no-async-promise-executor */
/* eslint-disable no-await-in-loop */
/* bazecor-flash-raise -- Dygma Raise flash helper for Bazecor
 * Copyright (C) 2019, 2020  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the GNU General Public License along with
 * this program. If not, see <http://www.gnu.org/licenses/>.
 */

import log from "electron-log/renderer";
import { DeviceClass } from "@Renderer/types/devices";
import { DeviceTools } from "@Renderer/DeviceContext";
import Device, { State } from "src/api/comms/Device";
import Hardware from "../../hardware";
import { delay } from "../../../main/utils/delay";
import NRf52833 from "./NRf52833-flasher";

/**
 * Handles the firmware flashing process for the Dygma Defy Wireless keyboard.
 */
class FlashDefyWireless {
  device: any;
  currentPort: any;
  currentPath: string | null;
  backupFileName: string | null;
  backupFileData: {
    backup: any;
    log: string[];
    serialNumber: string;
    firmwareFile: string;
  };
  backup: string[];
  currentDevice: DeviceClass;

  /**
   * Creates an instance of FlashDefyWireless.
   * @param {*} device - The device to be flashed.
   * @param {State} deviceState - The current state of the device.
   */
  constructor(device: any, deviceState: State) {
    this.device = device;
    this.currentPort = null;
    this.currentPath = null;
    this.backupFileName = null;
    this.backupFileData = {
      backup: {},
      log: ["Neuron detected"],
      serialNumber: device.serialNumber,
      firmwareFile: "File has not being selected",
    };
    this.backup = [];
    this.currentDevice = deviceState.currentDevice;
  }

  /**
   * Finds a connected device that matches the specified hardware and bootloader state.
   * @param {*} hardware - The hardware information to match.
   * @param {string} message - A message to log.
   * @param {boolean} bootloader - Whether to look for a device in bootloader mode.
   * @returns {Promise<boolean>} A promise that resolves to true if a matching device is found.
   */
  async foundDevices(hardware: any, message: string, bootloader: boolean): Promise<boolean> {
    let isFindDevice = false;
    log.info("Going to list devices");
    const list = (await DeviceTools.enumerateSerial(true)).foundDevices as Device[];
    log.verbose("List of Devices: ", list);
    const detected = list.find(device => {
      log.info(
        "DATA CHECKER: ",
        device,
        this.device,
        device.device.bootloader,
        bootloader,
        this.device.info.keyboardType,
        device.device.info.keyboardType,
      );
      if (
        bootloader
          ? device.device.bootloader !== undefined &&
            device.device.bootloader === bootloader &&
            this.device.info.keyboardType === device.device.info.keyboardType
          : this.device.info.keyboardType === device.device.info.keyboardType
      ) {
        log.info("found intended device");
        this.currentPort = { ...device };
        this.currentPath = device.path;
        isFindDevice = true;
        return device;
      }
      return false;
    });
    log.info(isFindDevice, detected);
    return isFindDevice;
  }

  /**
   * Sets the DTR (Data Terminal Ready) flag on the serial port.
   * @param {*} port - The port to set the DTR flag on.
   * @param {*} state - The state to set the DTR flag to.
   * @returns {Promise<boolean>} A promise that resolves when the DTR flag has been set.
   */
  setDTR = (port: any, state: any): Promise<boolean> =>
    new Promise(resolve => {
      port.set({ dtr: state }, () => {
        log.info(`DTR set to ${state} at ${new Date(Date.now()).toISOString()}`);
        resolve(true);
      });
    });

  /**
   * Updates the baud rate of the serial port.
   * @param {*} port - The port to update.
   * @param {number} baud - The new baud rate.
   * @returns {Promise<any>} A promise that resolves when the port has been updated.
   */
  updatePort = (port: any, baud: number): Promise<any> =>
    new Promise(resolve => {
      port.update({ baudRate: baud }, () => {
        log.info(`Port update started at: ${new Date(Date.now()).toISOString()}`);
        resolve(true);
      });
    });
  /**
   * Updates the firmware of the bootloader.
   * @param {string[]} firmware - An array of paths to the firmware files.
   * @param {boolean} bootloader - Whether the device is in bootloader mode.
   * @param {*} stateUpdate - A function to call with state updates.
   * @returns {Promise<boolean>}
   */
  async updateFirmware(firmware: string[], bootloader: boolean, stateUpdate: any): Promise<boolean> {
    log.info("Begin update firmware with NRf52833", bootloader);
    return new Promise(async (resolve, reject) => {
      const finished = async (err: any, result: any) => {
        if (err) throw new Error(`Flash error ${result}`);
        else {
          stateUpdate("neuron", 100);
          log.info("End update firmware with NRf52833");
          resolve(true);
        }
      };
      try {
        stateUpdate("neuron", 0);
        await NRf52833.flash(firmware, stateUpdate, finished, true);
      } catch (e) {
        stateUpdate("neuron", 100);
        reject(e);
      }
    });
  }

  /**
   * Detects the keyboard after a firmware update.
   * @returns {Promise<void>}
   */
  async detectKeyboard(): Promise<void> {
    const timeouts = 2500; // time to wait for keyboard
    const findTimes = 5;
    const errorMessage =
      "The firmware update has failed during the flashing process. Please unplug and replug the keyboard and try again";
    log.info("Waiting for keyboard");
    // wait until the bootloader serial port disconnects and the keyboard serial port reconnects
    const findKeyboard = async () =>
      new Promise(async resolve => {
        await delay(timeouts);
        if (await this.foundDevices(Hardware.serial, "Keyboard detected", false)) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    try {
      await this.runnerFindKeyboard(findKeyboard, findTimes, errorMessage);
    } catch (e) {
      log.error(`Detect keyboard: Error: ${e.message}`);
      throw e;
    }
  }

  /**
   * Runs a function multiple times until it succeeds or the timeout is reached.
   * @param {function} findKeyboard - The function to run.
   * @param {number} times - The number of times to run the function.
   * @param {string} errorMessage - The error message to log if the function fails.
   * @returns {Promise<boolean>}
   */
  async runnerFindKeyboard(
    findKeyboard: { (): Promise<unknown>; (): any },
    times: number,
    errorMessage: string,
  ): Promise<boolean> {
    if (!times) {
      log.error(errorMessage);
      return false;
    }
    if (await findKeyboard()) {
      log.info("Ready to restore");
      return true;
    }
    log.info(`Keyboard not detected, trying again for ${times} times`);
    const result: any = await this.runnerFindKeyboard(findKeyboard, times - 1, errorMessage);
    return result;
  }
}

export default FlashDefyWireless;

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

  async foundDevices(hardware: any, message: string, bootloader: boolean) {
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
   * Returns a Promise to be awaited that sets the DTR flag of the port
   * @param {*} port Port to be used on the set dtr function
   * @param {*} state State of the DTR flag to be set on the port
   * @returns {promise} that will resolve when the function has successfully setted the DTR flag
   */
  setDTR = (port: any, state: any) =>
    new Promise(resolve => {
      port.set({ dtr: state }, () => {
        log.info(`DTR set to ${state} at ${new Date(Date.now()).toISOString()}`);
        resolve(true);
      });
    });

  /**
   * Update the baud rate of the port with a Promise
   * @param {*} port Port to be updated
   * @param {*} baud BaudRate to be set
   * @returns {promise} Promise to be returned, that will resolve when the operation is done
   */
  updatePort = (port: any, baud: number): Promise<any> =>
    new Promise(resolve => {
      port.update({ baudRate: baud }, () => {
        log.info(`Port update started at: ${new Date(Date.now()).toISOString()}`);
        resolve(true);
      });
    });

  /**
   * Resets keyboard at the baud rate of 1200bps. Keyboard is restarted with the bootloader
   * @param {object} port - serial port object for the "path".
   * @returns {promise}
   */
  async resetKeyboard(currentDevice: Device, stateUpdate: any) {
    log.info("reset start");
    const errorMessage =
      "The firmware update couldn't start because the Defy Bootloader wasn't found. Please check our Help Center for more details or schedule a video call with us.";
    return new Promise(async (resolve, reject) => {
      stateUpdate("reset", 10);
      try {
        currentDevice.command("upgrade.neuron");
      } catch (error) {
        log.info("answer after shutdown not received");
      }
      log.info("waiting for bootloader");
      await delay(1000);
      stateUpdate("reset", 30);
      try {
        let bootCount = 10;
        while (bootCount > 0) {
          if (await this.foundDevices(Hardware.bootloader, "Bootloader detected", true)) {
            stateUpdate("reset", 100);
            bootCount = -1;
            resolve("Detected Bootloader mode");
            break;
          }
          await delay(300);
          bootCount -= 1;
        }
        if (bootCount === 0) {
          stateUpdate("reset", 100);
          reject(errorMessage);
        }
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Updates firmware of bootloader
   * @param {object} port - serial port object for the "path".
   * @param {string} firmware - path to file with firmware.
   * @returns {promise}
   */
  async updateFirmware(firmware: string[], bootloader: boolean, stateUpdate: any) {
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
   * Detects keyboard after firmware of bootloader
   */
  async detectKeyboard() {
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
   * Runs the function several times
   * @param {function} findKeyboard - function that will run several times.
   * @param {number} times - how many times function runs.
   * @param {string} errorMessage - error message if error is.
   */
  async runnerFindKeyboard(findKeyboard: { (): Promise<unknown>; (): any }, times: number, errorMessage: string) {
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

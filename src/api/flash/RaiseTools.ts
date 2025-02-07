/* eslint-disable no-await-in-loop */
import log from "electron-log/renderer";
import type { SerialPort as SP } from "serialport";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { delay } from "../../main/utils/delay";
import { findDevice } from "./findDevice";
import Device from "../comms/Device";
import { arduino } from "./raiseFlasher/arduino-flasher";
import Focus from "../focus";

/**
 * Update the baud rate of the port with a Promise
 */
const updatePort = (port: SP, baud: number) =>
  new Promise(resolve => {
    port.update({ baudRate: baud }, () => {
      log.info(`Port update started at: ${new Date(Date.now()).toISOString()}`);
      resolve(true);
    });
  });

/**
 * Resets keyboard at the baud rate of 1200bps. Keyboard is restarted with the bootloader
 */
const setDTR = (port: SP, state: boolean) =>
  new Promise(resolve => {
    port.set({ dtr: state }, () => {
      log.info(`DTR set to ${state} at ${new Date(Date.now()).toISOString()}`);
      resolve(true);
    });
  });

/**
 * Resets keyboard at the baud rate of 1200bps. Keyboard is restarted with the bootloader
 */
export const RaiseResetKeyboard = async (port: SP, stateUpdate: (state: string, percentage: number) => void) => {
  stateUpdate("reset", 5);
  log.info("reset start", port);
  const errorMessage =
    "The firmware update couldn't start because the Raise Bootloader wasn't found. Please check our Help Center for more details or schedule a video call with us.";
  const timeouts = {
    dtrToggle: 1000, // Time to wait (ms) between toggling DTR
    waitingClose: 2000, // Time to wait for boot loader
    bootLoaderUp: 2000, // Time to wait for the boot loader to come up
  };

  let result;

  stateUpdate("reset", 10);
  await updatePort(port, 1200);
  log.info("resetting neuron");
  await setDTR(port, true);
  await delay(timeouts.dtrToggle);
  await setDTR(port, false);
  stateUpdate("reset", 20);
  log.info("waiting for bootloader");
  try {
    await delay(timeouts.waitingClose);
    let bootCount = 6;
    while (bootCount > 0) {
      stateUpdate("reset", 20 + (10 - bootCount) * 8);
      const newPort = await findDevice("bootloader");
      if (newPort) {
        stateUpdate("reset", 100);
        result = newPort;
        break;
      }
      await delay(timeouts.bootLoaderUp);
      bootCount -= 1;
    }
    if (bootCount < 0) {
      stateUpdate("reset", 100);
      result = undefined;
      throw new Error(errorMessage);
    }
  } catch (e) {
    log.error(e);
  }

  return result;
};

/**
 * Resets keyboard at the baud rate of 1200bps. Keyboard is restarted with the bootloader
 */
export const resetKeyboard = async (currentDevice: Device, stateUpdate: any) => {
  log.info("reset start");
  const errorMessage =
    "The firmware update couldn't start because the Defy Bootloader wasn't found. Please check our Help Center for more details or schedule a video call with us.";
  // eslint-disable-next-line no-async-promise-executor
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
        if (await findDevice("bootloader")) {
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
};

/**
 * Detects keyboard after firmware of bootloader
 */
export const detectKeyboard = async (stateUpdate: any, device: DygmaDeviceType) => {
  log.info("Waiting for keyboard");

  let result;
  try {
    let searchFor = 10;
    while (searchFor > 0) {
      const newPort = await findDevice("serial", device);
      if (newPort) {
        stateUpdate("reset", 100);
        searchFor = -1;
        result = newPort;
        break;
      }
      await delay(1000);
      searchFor -= 1;
    }
    if (searchFor === 0) {
      stateUpdate("reset", 100);
    }
  } catch (e) {
    log.error(`Detect keyboard: Error: ${e.message}`);
    throw e;
  }
  return result;
};

/**
 * Updates firmware of bootloader
 */
export const updateFirmware = async (filename: string[], stateUpdate: any, path: string, device: DygmaDeviceType) => {
  log.info("Begin update firmware with Raise-flasher");
  stateUpdate("neuron", 0);

  const focus = Focus.getInstance();
  if (focus.closed || focus._port === undefined) {
    await focus.open(path, device);
  }
  await new Promise((resolve, reject) => {
    arduino.flash(filename, stateUpdate, async (err: any, result: any) => {
      if (err) reject(new Error(`Flash error ${result}`));
      else {
        stateUpdate("neuron", 100);
        log.info("End update firmware with arduino-flasher");
        resolve(true);
      }
    });
  });

  await delay(3000);
  log.info("going to search for: ", device);
  const result = await detectKeyboard(stateUpdate, device);
  return result;
};

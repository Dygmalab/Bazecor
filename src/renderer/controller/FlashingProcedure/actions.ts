/* eslint-disable no-await-in-loop */
import fs from "fs";
import path from "path";
import log from "electron-log/renderer";
import { ipcRenderer } from "electron";
import { SerialPort } from "serialport";
import { DeviceTools } from "@Renderer/DeviceContext";
import { BackupType } from "@Renderer/types/backups";
import Device, { State } from "../../../api/comms/Device";
import { resetKeyboard } from "../../../api/flash/RaiseTools";
import NRf52833 from "../../../api/flash/defyFlasher/NRf52833-flasher";
import SideFlaser from "../../../api/flash/defyFlasher/sideFlasher";
import Raise2Flash from "../../../api/flash/raise2Flasher/Raise2-flasher";
import { FlashRaise } from "../../../api/flash";
import * as Context from "./context";

const delay = (ms: number) =>
  new Promise(res => {
    setTimeout(res, ms);
  });

const stateUpdate = (stage: string, percentage: number, context: Context.ContextType) => {
  log.info(stage, percentage);
  let { globalProgress } = context;
  let { leftProgress } = context;
  let { rightProgress } = context;
  let { resetProgress } = context;
  let { neuronProgress } = context;
  let { restoreProgress } = context;
  switch (stage) {
    case "right":
      rightProgress = percentage;
      break;
    case "left":
      leftProgress = percentage;
      break;
    case "reset":
      resetProgress = percentage;
      break;
    case "neuron":
      neuronProgress = percentage;
      break;
    case "restore":
      restoreProgress = percentage;
      break;

    default:
      break;
  }
  if (context.device?.info.product === "Raise") {
    globalProgress = leftProgress * 0 + rightProgress * 0 + resetProgress * 0.33 + neuronProgress * 0.33 + restoreProgress * 0.33;
  } else {
    globalProgress =
      leftProgress * 0.2 + rightProgress * 0.2 + resetProgress * 0.2 + neuronProgress * 0.2 + restoreProgress * 0.2;
  }
  context.stateUpdate({
    type: "increment_event",
    data: {
      globalProgress,
      leftProgress,
      rightProgress,
      resetProgress,
      neuronProgress,
      restoreProgress,
    },
  });
};

const restoreSettings = async (
  context: Context.ContextType,
  backup: BackupType,
  stateUpd: (state: string, progress: number) => void,
) => {
  stateUpd("restore", 0);
  log.info(backup);
  try {
    let device: Device | undefined;
    const list = (await DeviceTools.list()) as Device[];
    log.info(list);
    const selected = list.find(x => parseInt(x.productId, 16) === context.originalDevice?.device?.usb.productId);
    if (selected !== undefined) device = await DeviceTools.connect(selected);
    for (let i = 0; i < backup.backup.length; i += 1) {
      const val = backup.backup[i].data;
      log.info(`Going to send ${backup.backup[i].command} to keyboard`);
      await device?.command(`${backup.backup[i].command} ${val}`.trim());
      stateUpd("restore", (i / backup.backup.length) * 90);
    }
    await device?.command("led.mode 0");
    stateUpd("restore", 100);
    await DeviceTools.disconnect(selected as Device);
    return true;
  } catch (e) {
    return false;
  }
};

export const reconnect = async (context: Context.ContextType) => {
  let reconnected = false;
  try {
    const foundDevices = async (isBootloader: boolean) => {
      let result: Device | undefined;
      const devices = (await DeviceTools.enumerateSerial(false)).foundDevices;

      for (const device of devices) {
        if (
          isBootloader
            ? device.device?.bootloader !== undefined &&
              context.originalDevice?.device?.info.product === device.device.info.product
            : context.originalDevice?.device?.info.keyboardType === device.device?.info.keyboardType &&
              context.originalDevice?.device?.info.product === device.device.info.product
        ) {
          result = new Device(device, "serial");
          log.info("found device: ", device);
          break;
        }
      }
      return result;
    };
    const findKeyboard = async () => {
      await delay(2500);
      const result = await foundDevices(false);
      return result;
    };

    const runnerFindKeyboard = async (functionFindKB: () => Promise<Device>, times: number) => {
      if (!times) {
        log.error("Keyboard not found!");
        return false;
      }
      if (await functionFindKB()) {
        log.info("Ready to restore");
        return true;
      }
      log.info(`Keyboard not detected, trying again for ${times} times`);
      stateUpdate("reconnect", 10 + 100 * (1 / (5 - times)), context);
      await runnerFindKeyboard(functionFindKB, times - 1);
      return true;
    };
    stateUpdate("reconnect", 10, context);
    reconnected = await runnerFindKeyboard(findKeyboard, 5);
    stateUpdate("reconnect", 100, context);
  } catch (error) {
    log.warn("error when flashing Sides");
    log.error(error);
    throw new Error(error);
  }
  return reconnected;
};

export const flashSide = async (side: string, context: Context.ContextType) => {
  let result = false;
  try {
    const { currentDevice } = context.deviceState as State;
    if (context.flashSides === undefined) {
      context.bootloader = context.device?.bootloader;
      context.comPath = (currentDevice.port as SerialPort).path;
      context.flashSides = new SideFlaser(context.firmwares?.fwSides);
      context.originalDevice = currentDevice;
    }
    // Flashing procedure for each side
    const forceFlashSides = false;
    await DeviceTools.disconnect(currentDevice);
    log.info("done closing serial");
    log.info("Going to flash side:", side);
    await context.flashSides.flashSide(
      context.comPath as string,
      side,
      (stage, percentage) => {
        stateUpdate(stage, percentage, context);
      },
      context.device?.info.keyboardType as string,
      forceFlashSides,
    );
    stateUpdate(side, 100, context);
    await delay(1000);
    result = true;
  } catch (error) {
    log.warn("error when flashing Sides");
    log.error(error);
    throw new Error(error);
  }
  if (side === "right") {
    context.rightResult = result;
  } else {
    context.leftResult = result;
  }
  return context;
};

export const uploadDefyWired = async (context: Context.ContextType) => {
  try {
    const { currentDevice } = context.deviceState as State;
    if (context.flashSides === undefined) {
      context.bootloader = context.device?.bootloader;
      context.comPath = (currentDevice?.port as SerialPort).path;
      context.flashSides = new SideFlaser(context.firmwares?.fwSides);
      context.originalDevice = currentDevice;
    }
    await DeviceTools.disconnect(currentDevice);
    stateUpdate("neuron", 10, context);
    await context.flashSides.prepareNeuron();
    stateUpdate("neuron", 30, context);
    await ipcRenderer.invoke("list-drives", true).then(rsl => {
      stateUpdate("neuron", 60, context);
      const finalPath = path.join(rsl, "default.uf2");
      // log.info("RESULTS!!!", rsl, context.firmwares.fw, " to ", finalPath);
      fs.writeFileSync(finalPath, Buffer.from(new Uint8Array(context.firmwares?.fw)));
      stateUpdate("neuron", 80, context);
    });
    stateUpdate("neuron", 100, context);
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return context;
};

export const resetDefy = async (context: Context.ContextType) => {
  let { currentDevice } = context.deviceState as State;
  log.info(`Checking ${currentDevice.device.info.product} bootloader: `, currentDevice.device.bootloader, context.bootloader);
  log.info(`Checking ${currentDevice.device.info.product} compath: `, currentDevice.device.path, context.comPath);
  try {
    if (context.comPath === undefined) {
      log.info("when creating comPath", context.originalDevice?.device);
      context.bootloader = currentDevice.device?.bootloader;
      context.comPath = (currentDevice.port as SerialPort).path;
    }
    if (!currentDevice.device.bootloader) {
      try {
        log.info("reset PORT check", currentDevice.port, currentDevice.isClosed);
        if (currentDevice.port === undefined && currentDevice.isClosed) {
          context.deviceState.currentDevice = (await DeviceTools.connect(currentDevice)) as Device;
          currentDevice = context.deviceState.currentDevice;
        }
        await resetKeyboard(currentDevice, (stage: string, percentage: number) => {
          stateUpdate(stage, percentage, context);
        });
      } catch (error) {
        log.error("Bootloader Not found: ", error);
        throw new Error(error);
      }
    } else {
      context.comPath = context.device?.path as string;
    }
  } catch (error) {
    log.warn("error when resetting Neuron");
    log.error(error);
    throw new Error(error);
  }
  return context;
};

export const uploadDefyWireless = async (context: Context.ContextType) => {
  let result = false;
  try {
    const { currentDevice } = context.deviceState as State;
    await DeviceTools.disconnect(currentDevice);

    log.info("Begin update firmware with NRf52833", context.bootloader);
    const finished = async (err: any, rslt: any) => {
      if (err) throw new Error(`Flash error ${rslt}`);
      else {
        stateUpdate("neuron", 100, context);
        log.info("End update firmware with NRf52833");
        result = true;
      }
    };
    try {
      stateUpdate("neuron", 0, context);
      await NRf52833.flash(
        context.firmwares?.fw,
        (stage: string, percentage: number) => {
          stateUpdate(stage, percentage, context);
        },
        finished,
        context.erasePairings,
      );
    } catch (e) {
      stateUpdate("neuron", 100, context);
      result = false;
    }
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const uploadRaise2 = async (context: Context.ContextType) => {
  let result = false;
  try {
    const { currentDevice } = context.deviceState as State;
    await DeviceTools.disconnect(currentDevice);

    log.info("Begin update firmware with Raise2Flash", context.bootloader);
    const finished = async (err: any, rslt: any) => {
      if (err) throw new Error(`Flash error ${rslt}`);
      else {
        stateUpdate("neuron", 100, context);
        log.info("End update firmware with Raise2Flash");
        result = true;
      }
    };
    try {
      stateUpdate("neuron", 0, context);
      await Raise2Flash.flash(
        context.firmwares?.fw,
        (stage: string, percentage: number) => {
          stateUpdate(stage, percentage, context);
        },
        finished,
        context.erasePairings,
      );
    } catch (e) {
      stateUpdate("neuron", 100, context);
      result = false;
    }
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const restoreDefies = async (context: Context.ContextType) => {
  let result = false;
  if (context.bootloader || context.backup === undefined) {
    return true;
  }
  try {
    result = await restoreSettings(context, context.backup, (stage, percentage) => {
      stateUpdate(stage, percentage, context);
    });
  } catch (error) {
    log.warn("error when restoring Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const resetRaise = async (context: Context.ContextType) => {
  try {
    const { currentDevice } = context.deviceState as State;
    if (context.flashRaise === undefined) {
      context.flashRaise = new FlashRaise(context.originalDevice?.device);
      context.comPath = (currentDevice.port as SerialPort).path;
      context.bootloader = context.device?.bootloader;
    }
    if (!context.bootloader) {
      try {
        log.info("reset indicators", currentDevice.device, context.flashRaise, context.originalDevice?.device);
        if (currentDevice.isClosed) {
          await DeviceTools.disconnect(currentDevice);
          await DeviceTools.connect(context.originalDevice as Device);
        }
        await context.flashRaise.resetKeyboard(currentDevice.port as SerialPort, (stage: string, percentage: number) => {
          stateUpdate(stage, percentage, context);
        });
      } catch (error) {
        log.error("Bootloader Not found: ", error);
        throw new Error(error);
      }
    } else {
      // context.flashRaise.currentPort?.path = context.device?.path as string;
    }
  } catch (error) {
    log.warn("error when resetting Neuron");
    log.error(error);
    throw new Error(error);
  }
  return context;
};

export const uploadRaise = async (context: Context.ContextType) => {
  let result = false;
  try {
    const { currentDevice } = context.deviceState as State;
    if (context.flashRaise === undefined) {
      context.flashRaise = new FlashRaise(context.originalDevice?.device);
      context.comPath = (currentDevice.port as SerialPort).path;
      context.bootloader = context.device?.bootloader;
    }
    await DeviceTools.disconnect(currentDevice);
    log.info(context.originalDevice?.device, context.flashRaise !== undefined);
    result = await context.flashRaise?.updateFirmware(context.firmwares?.fw, (stage: string, percentage: number) => {
      stateUpdate(stage, percentage, context);
    });
    log.info("Result after flashing Raise: ", result);
    // context.comPath = result.path;
    // context.bootloader = result.device.bootloader;
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return context;
};

export const restoreRaise = async (context: Context.ContextType) => {
  let result = false;
  if (context.bootloader || context.backup === undefined) {
    return true;
  }
  try {
    result = await restoreSettings(context, context.backup, (stage, percentage) => {
      stateUpdate(stage, percentage, context);
    });
  } catch (error) {
    log.warn("error when restoring Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

import fs from "fs";
import path from "path";
import log from "electron-log/renderer";
import { emit } from "xstate";
import { ipcRenderer } from "electron";
import { BackupType } from "@Renderer/types/backups";
import { FlashRaise, FlashDefyWireless } from "../../../api/flash";
import SideFlaser from "../../../api/flash/defyFlasher/sideFlasher";
import Hardware from "../../../api/hardware";
import Focus from "../../../api/focus";
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
  if (context.device.info.product === "Raise") {
    globalProgress = leftProgress * 0 + rightProgress * 0 + resetProgress * 0.33 + neuronProgress * 0.33 + restoreProgress * 0.33;
  } else {
    globalProgress =
      leftProgress * 0.2 + rightProgress * 0.2 + resetProgress * 0.2 + neuronProgress * 0.2 + restoreProgress * 0.2;
  }
  emit({
    type: "INC",
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
  if (bootloader) {
    stateUpd("restore", 100);
    return true;
  }
  const focus = Focus.getInstance();
  log.info(backup);
  if (backup === undefined || backup.length === 0) {
    await focus.open(comPath, context.originalDevice.device.info, null);
    return true;
  }
  try {
    await focus.open(comPath, context.originalDevice.device.info, null);
    for (let i = 0; i < backup.length; i += 1) {
      let val = backup[i].data;
      // Boolean values need to be sent as int
      if (typeof val === "boolean") {
        val = +val;
      }
      log.info(`Going to send ${backup[i].command} to keyboard`);
      await focus.command(`${backup[i].command} ${val}`.trim());
      stateUpd("restore", (i / backup.length) * 90);
    }
    await focus.command("led.mode 0");
    stateUpd("restore", 100);
    await focus.close();
    return true;
  } catch (e) {
    return false;
  }
};

export const reconnect = async (context: Context.ContextType) => {
  let result;
  try {
    const foundDevices = async (hardware: any, message: string, isBootloader: boolean) => {
      const focus = Focus.getInstance();
      let isFindDevice = false;
      let currentPort;
      let currentPath;
      await focus.find(...hardware).then(devices => {
        for (const device of devices) {
          if (
            isBootloader
              ? device.device.bootloader !== undefined &&
                device.device.bootloader === isBootloader &&
                context.originalDevice.device.info.keyboardType === device.device.info.keyboardType
              : context.originalDevice.device.info.keyboardType === device.device.info.keyboardType
          ) {
            log.info(message);
            currentPort = { ...device };
            currentPath = device.path;
            isFindDevice = true;
          }
        }
      });
      result = { isFindDevice, currentPort, currentPath };
      return isFindDevice;
    };
    const runnerFindKeyboard = async (findKeyboard: { (): Promise<unknown>; (): any }, times: number) => {
      if (!times) {
        log.error("Keyboard not found!");
        return false;
      }
      if (await findKeyboard()) {
        log.info("Ready to restore");
        return true;
      }
      log.info(`Keyboard not detected, trying again for ${times} times`);
      stateUpdate("reconnect", 10 + 100 * (1 / (5 - times)), context);
      await runnerFindKeyboard(findKeyboard, times - 1);
      return true;
    };
    const findKeyboard = async () =>
      // eslint-disable-next-line no-async-promise-executor
      new Promise(async resolve => {
        await delay(2500);
        if (await foundDevices(Hardware.serial, "Keyboard detected", false)) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    stateUpdate("reconnect", 10, context);
    await runnerFindKeyboard(findKeyboard, 5);
    stateUpdate("reconnect", 100, context);
  } catch (error) {
    log.warn("error when flashing Sides");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const flashSide = async (side: string, context: Context.ContextType) => {
  let result = false;
  try {
    const focus = Focus.getInstance();
    if (context.flashSides === undefined) {
      context.bootloader = context.device.bootloader;
      context.comPath = focus._port?.port?.openOptions?.path;
      context.flashSides = new SideFlaser(context.firmwares.fwSides);
    }
    // Flashing procedure for each side
    await focus.close();
    log.info("done closing focus");
    log.info("Going to flash side:", side);
    const forceFlashSides = false;
    await context.flashSides.flashSide(
      side,
      (stage, percentage) => {
        stateUpdate(stage, percentage, context);
      },
      context.device.info.keyboardType,
      forceFlashSides,
    );
    stateUpdate(side, 100, context);
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
  let result = false;
  try {
    const focus = Focus.getInstance();
    if (flashSides === undefined) {
      bootloader = context.device.bootloader;
      comPath = focus._port?.port?.openOptions?.path;
      flashSides = new SideFlaser(context.firmwares.fwSides);
    }
    stateUpdate("neuron", 10, context);
    await flashSides.prepareNeuron();
    stateUpdate("neuron", 30, context);
    await ipcRenderer.invoke("list-drives", true).then(rsl => {
      stateUpdate("neuron", 60, context);
      const finalPath = path.join(rsl, "default.uf2");
      // log.info("RESULTS!!!", rsl, context.firmwares.fw, " to ", finalPath);
      fs.writeFileSync(finalPath, Buffer.from(new Uint8Array(context.firmwares.fw)));
      stateUpdate("neuron", 80, context);
    });
    stateUpdate("neuron", 100, context);
    result = true;
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const resetDefy = async (context: Context.ContextType) => {
  const { currentDevice } = context.deviceState;
  let result;
  try {
    const focus = Focus.getInstance();
    if (flashDefyWireless === undefined) {
      log.info("when creating FDW", context.originalDevice.device);
      flashDefyWireless = new FlashDefyWireless(context.originalDevice.device, context.deviceState);
      if (flashSides === undefined && bootloader === false) {
        comPath = focus._port?.port?.openOptions?.path;
        bootloader = currentDevice.bootloader;
      }
    }
    if (!bootloader) {
      try {
        log.info("reset indicators", focus, flashDefyWireless, context.originalDevice.device);
        if (focus._port === null || focus.closed) {
          const { info } = context.originalDevice.device;
          await focus.close();
          await focus.open(currentDevice.path, info, null);
        }
        result = await flashDefyWireless.resetKeyboard(focus._port, (stage: string, percentage: number) => {
          stateUpdate(stage, percentage, context);
        });
      } catch (error) {
        log.error("Bootloader Not found: ", error);
        throw new Error(error);
      }
    } else {
      flashDefyWireless.currentPort = { ...context.device };
    }
  } catch (error) {
    log.warn("error when resetting Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const uploadDefyWireles = async (context: Context.ContextType) => {
  let result = false;
  try {
    const focus = Focus.getInstance();
    if (!context.device.bootloader) {
      await focus.close();
    }
    // log.info(context.originalDevice.device, focus, focus._port, flashDefyWireless);
    result = await context.originalDevice.device.flash(
      focus._port,
      context.firmwares.fw,
      bootloader,
      flashDefyWireless,
      (stage: string, percentage: number) => {
        stateUpdate(stage, percentage, context);
      },
    );
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const restoreDefies = async (context: Context.ContextType) => {
  let result = false;
  if (bootloader || context.backup === undefined) {
    return true;
  }
  try {
    result = await restoreSettings(context, context.backup.backup, (stage, percentage) => {
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
  let result = false;

  try {
    const focus = Focus.getInstance();
    if (flashRaise === undefined) {
      flashRaise = new FlashRaise(context.originalDevice.device);
      comPath = focus._port?.port?.openOptions?.path;
      bootloader = context.device.bootloader;
    }
    if (!bootloader) {
      try {
        log.info("reset indicators", focus, flashRaise, context.originalDevice.device);
        if (focus._port.closed) {
          const { info } = context.originalDevice.device;
          await focus.close();
          await focus.open(comPath, info, null);
        }
        result = await flashRaise.resetKeyboard(focus._port, (stage: string, percentage: number) => {
          stateUpdate(stage, percentage, context);
        });
      } catch (error) {
        log.error("Bootloader Not found: ", error);
        throw new Error(error);
      }
    } else {
      flashRaise.currentPort = { ...context.device };
    }
  } catch (error) {
    log.warn("error when resetting Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const uploadRaise = async (context: Context.ContextType) => {
  let result = false;
  try {
    const focus = Focus.getInstance();
    if (!context.device.bootloader) {
      await focus.close();
    }
    log.info(context.originalDevice.device, focus, focus._port, flashRaise);
    result = await context.originalDevice.device.flash(
      focus._port,
      context.firmwares.fw,
      flashRaise,
      (stage: string, percentage: number) => {
        stateUpdate(stage, percentage, context);
      },
    );
  } catch (error) {
    log.warn("error when flashing Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const restoreRaise = async (context: Context.ContextType) => {
  let result = false;
  if (bootloader || context.backup === undefined) {
    return true;
  }
  try {
    result = await restoreSettings(context, context.backup.backup, (stage, percentage) => {
      stateUpdate(stage, percentage, context);
    });
  } catch (error) {
    log.warn("error when restoring Neuron");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const integrateCommsToFocus = async (context: Context.ContextType): Promise<boolean | undefined> => {
  let result;
  try {
    const { currentDevice } = context.deviceState;
    result = currentDevice.device.bootloader;
    const { path: localPath } = currentDevice;
    const { device } = currentDevice;

    await currentDevice.close();
    log.info("closed currentDevice", currentDevice);

    await delay(100);

    const focus = Focus.getInstance();
    await focus.open(localPath, device, null);
    log.info("opened using focus currentDevice", focus);
  } catch (error) {
    log.warn("error detected on comms integration: ", error);
  }

  return result;
};

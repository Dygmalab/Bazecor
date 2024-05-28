import log from "electron-log/renderer";
import { BackupType } from "@Renderer/types/backups";
import { State } from "src/api/comms/Device";
import Backup from "../../../api/backup";
import * as Context from "./context";

export const keyboardSetup = async (context: Context.ContextType) => {
  let result;
  if (context.deviceState === undefined || context.device.bootloader) return result;
  try {
    const { currentDevice } = context.deviceState;
    log.info("CHECKING DEVICE:", context.device);
    if (context.device.info.product === "Raise") {
      await currentDevice.noCacheCommand("led.mode", "1");
      const brightness = await currentDevice.noCacheCommand("led.brightness");
      await currentDevice.noCacheCommand("led.brightness", "255");
      result = brightness;
    }
    await currentDevice.noCacheCommand("upgrade.start");
  } catch (error) {
    log.warn("error when querying the device");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const GetLSideData = async (context: Context.ContextType) => {
  const result = { leftSideConn: false, leftSideBoot: false };
  if (context.deviceState === undefined) return result;
  try {
    const { currentDevice } = context.deviceState;
    result.leftSideConn = String(await currentDevice.noCacheCommand("upgrade.keyscanner.isConnected", "1")).includes("true");
    result.leftSideBoot = String(await currentDevice.noCacheCommand("upgrade.keyscanner.isBootloader", "1")).includes("true");
  } catch (error) {
    log.warn("error when querying the device");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const GetRSideData = async (context: Context.ContextType) => {
  const result = { rightSideConn: false, rightSideBoot: false };
  if (context.deviceState === undefined) return result;
  try {
    const { currentDevice } = context.deviceState;
    result.rightSideConn = String(await currentDevice.noCacheCommand("upgrade.keyscanner.isConnected", "0")).includes("true");
    result.rightSideBoot = String(await currentDevice.noCacheCommand("upgrade.keyscanner.isBootloader", "0")).includes("true");
  } catch (error) {
    log.warn("error when querying the device");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

export const CreateBackup = async (context: Context.ContextType) => {
  let backup: BackupType;
  if (context.deviceState === undefined) return undefined;
  try {
    const { currentDevice } = context.deviceState as State;
    const bkp = new Backup();
    const commands = await Backup.Commands(currentDevice);
    backup = (await bkp.DoBackup(commands, context.device.chipID, currentDevice)) as BackupType;
    await Backup.SaveBackup(backup, currentDevice);
    const keymap = await currentDevice.noCacheCommand("keymap.custom");
    const newKeymap = keymap.split(" ");
    newKeymap[0] = "41";
    await currentDevice.noCacheCommand("keymap.custom", newKeymap.join(" "));
  } catch (error) {
    log.warn("error when creating Backup of the device");
    log.error(error);
    throw new Error(error);
  }
  return backup;
};

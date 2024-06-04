import log from "electron-log/renderer";
import { DeviceTools } from "@Renderer/DeviceContext";
import * as Context from "./context";

export const RestoreESCKey = async (context: Context.ContextType): Promise<Context.ContextType> => {
  // log.info("Going to restore topmost left key", context.backup, context.deviceState);
  try {
    if (context.backup === undefined || context.deviceState?.currentDevice === undefined) return context;
    const { currentDevice } = context.deviceState;
    // log.info("Checking connected status: ", currentDevice.isClosed);
    if (currentDevice.isClosed) {
      await DeviceTools.connect(currentDevice);
    }
    const keymap = context.backup.backup.find((c: { command: string }) => c.command === "keymap.custom").data;
    await currentDevice.noCacheCommand("led.mode 0");
    await currentDevice.noCacheCommand("keymap.custom", keymap);
    context.deviceState.currentDevice = currentDevice;
    return context;
  } catch (error) {
    log.warn("error when restoring Backup of the device after error");
    log.error(error);
    throw new Error(error);
  }
};

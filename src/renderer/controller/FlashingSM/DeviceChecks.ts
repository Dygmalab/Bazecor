import log from "electron-log/renderer";
import { createMachine, assign, raise, fromPromise } from "xstate";
import { BackupType } from "@Renderer/types/backups";
import Backup from "../../../api/backup";

interface ContextType {
  stateblock: number;
  device: {
    bootloader: boolean;
    chipID: string;
    info: {
      keyboardType: string;
      product: string;
    };
  };
  sideLeftOk: boolean;
  sideLeftBL: boolean;
  sideRightOK: boolean;
  sideRightBL: boolean;
  firmwares: Array<unknown>;
  backup: BackupType | undefined;
  deviceState: any;
  isUpdated: unknown;
  RaiseBrightness: string | undefined;
  error: unknown;
}

const keyboardSetup = async (context: ContextType) => {
  const result: { RaiseBrightness: string | undefined } = { RaiseBrightness: undefined };
  if (context.device.bootloader) return result;
  try {
    const { currentDevice } = context.deviceState;
    if (context.device.info.product === "Raise") {
      await currentDevice.noCacheCommand("led.mode", "1");
      const brightness = await currentDevice.noCacheCommand("led.brightness");
      await currentDevice.noCacheCommand("led.brightness", "255");
      result.RaiseBrightness = brightness;
    }
    await currentDevice.noCacheCommand("upgrade.start");
  } catch (error) {
    log.warn("error when querying the device");
    log.error(error);
    throw new Error(error);
  }
  return result;
};

const GetLSideData = async (context: ContextType) => {
  const result = { leftSideConn: false, leftSideBoot: false };
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

const GetRSideData = async (context: ContextType) => {
  const result = { rightSideConn: false, rightSideBoot: false };
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

const CreateBackup = async (context: ContextType) => {
  let backup: BackupType;
  try {
    const { currentDevice } = context.deviceState;
    const bkp = new Backup();
    const commands = await Backup.Commands(currentDevice);
    backup = (await bkp.DoBackup(commands, context.device.chipID, currentDevice)) as BackupType;
    await Backup.SaveBackup(backup, currentDevice);
    let keymap = await currentDevice.noCacheCommand("keymap.custom");
    keymap = keymap.split(" ");
    keymap[0] = "41";
    await currentDevice.noCacheCommand("keymap.custom", keymap.join(" "));
  } catch (error) {
    log.warn("error when creating Backup of the device");
    log.error(error);
    throw new Error(error);
  }
  return { backup };
};

const DeviceChecks = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6QsYgMwGUwAXAVwAcBiCUvMNXwA3UgGtBEgJ4AjUumIQWHTgG0ADAF1EoTqVysc-HSAAeiAMzqArNQCcANgCMAdifqATNYAc1u74AaEClEJw9qbw87dScHABY7OPU4i2snawBfDKC0LFwCEgoqWnpmNi5uejJiak4MVgZSYgBbamk5BSVytS0TPQMjPBNzBCckhwjolxS49I8xoJCEKNsXDws7VMcnfzisnIxsfCIySlgaABkmHAgwAGFMMHIxXn5BEXFBAHE2K5uwAAi6FY6A02iQIH6OEMxghIw8CPsLmsLgcyI2LjcXkWiESdmoTnca1RHgczjS+xAuSOBVOxT+tweTxeVSatXqjRa1B+rAZgOBoN6EKhMKGcNCUQJFgc1hsaTCUXULhxCDi3nUBJskTsYRlyOse2yVMO+RORXO1AAStdGY9nq8BEI8KIJNy2Nb-kCQWC+vpoYNhohrPEImFrNYLOsEmE7CrURNSSkPMl1BZvGjMkbqabCmcaB7bczKsRquzgZzWjyC-zvULdH7RYGEMG4qGvBGozqoir3PMIjLEhY09MDQ5KdnjrniixUE9WACwMIcGcACqkACqnAgwLADvezs+1CZz2QAHUAGr0XD8H3ChsB8UIVH45xK8MeOKolIOFUOdPUBEuxlMYEhSccTUnOkLRnOcFyXVcNy3Hdi1LOpyyaVpjzEM9L2Ia88FvesBlhUARn8bxqBiFENgNWJMWsFVwycah0UHGJPHTcC8kg80aBg8h50XZc4DXTdt1YXd10IAEAEEVwAUUIyF7xIsxcW8CiqJcGjZjRZEVW8NMIgSGJ0kcFw7EzA5uNpXjqGEdBUBuHcmBBDhYD3J0XUEO5iDAHcACF0GeLglJFB9SNCHZ8VJYM7DsaYFTiX8XA1fwnHVRJSVSg0uJpM083sxznIk1zgXYDzWRqNCGgwo8-MC4KxFCutlOIsVItGDYLAiZF1G8JJIymH9gkQVE0vjdx1ESOIPzHLMINswqHKc8SwDK9zuEIS15KYJh5IBMKVI6tSus2XrZQG1NFVRAyDUoiwYwceLZVmFw8pzKCaAYdAcFQdg-O4HaV0tABNI72qbMZDJYuIEh8FE4tmlV5hcADUjcHwyQseMsiNPBSFueAIQnJaqF9SHHwAWhGpYqemagZSovUY08d6FpsgrijoRhlC4Cn-VUkYxmYx6+o07xphlD8e38FisusDxtKcNN3G8D6eMKvksIFxtH2R0aEESNGESVlXNjiMlco5-KpwtasdbvSnOqSDVMQcfrLfUGJ1UllVHFWRxNke-rZTcDWyegsBZwEuDhNgUSkIk3WItO8bqHDT8LL8bwww8OMBoAwzc4sWZ5TGCOuYtFaSvWtyKpToWJTCewQ+e03LZxgzEVitE0RTHVK7t77fv+vzG5O4XyWoNMmNldxHD9w2DXxTFS4s5xfFSiwh6+6hYHYcg8wnqHp9ntJ5+mv9lUNyWJiVWa7A-eYMvUeasiAA */
    id: "FlahsingProcess",
    initial: "PerfSetup",
    context: {
      stateblock: 0,
      device: {
        bootloader: false,
        chipID: "",
        info: {
          product: "",
          keyboardType: "",
        },
      },
      sideLeftOk: true,
      sideLeftBL: false,
      sideRightOK: true,
      sideRightBL: false,
      firmwares: [],
      backup: undefined,
      deviceState: undefined,
      isUpdated: undefined,
      RaiseBrightness: undefined,
      error: undefined,
    } as ContextType,
    states: {
      PerfSetup: {
        id: "PerfSetup",
        entry: [
          () => {
            log.info("Performing setup");
          },
        ],
        invoke: {
          id: "keyboardSetup",
          src: fromPromise(({ input }) => keyboardSetup(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            actions: [
              assign({
                RaiseBrightness: ({ event }) => {
                  if (event.output.RaiseBrightness) {
                    return event.output.RaiseBrightness;
                  }
                  return undefined;
                },
              }),
              assign({
                stateblock: () => 1,
              }),
              raise({ type: "internal" }),
            ],
          },
          onError: {
            target: "failure",
            actions: assign({ error: ({ event }) => event.error }),
          },
        },
        on: {
          "*": [
            { target: "validateStatus", guard: "doNotRequireSideCheck" },
            { target: "success", guard: "bootloaderMode" },
            { target: "LSideCheck", guard: "requireSideCheck" },
          ],
        },
      },
      LSideCheck: {
        id: "LSideCheck",
        entry: [
          () => {
            log.info("Checking left side");
          },
        ],
        invoke: {
          id: "GetLSideData",
          src: fromPromise(({ input }) => GetLSideData(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "RSideCheck",
            actions: [
              assign(({ event }) => {
                log.info(event);
                return {
                  sideLeftOk: event.output.leftSideConn,
                  sideLeftBL: event.output.leftSideBoot,
                };
              }),
              assign({
                stateblock: () => 2,
              }),
            ],
          },
          onError: "failure",
        },
      },
      RSideCheck: {
        id: "RSideCheck",
        entry: [
          () => {
            log.info("Checking right side");
          },
        ],
        invoke: {
          id: "GetRSideData",
          src: fromPromise(({ input }) => GetRSideData(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "validateStatus",
            actions: [
              assign(({ event }) => {
                log.info(event);
                return {
                  sideRightOK: event.output.rightSideConn,
                  sideRightBL: event.output.rightSideBoot,
                };
              }),
              assign({
                stateblock: () => 3,
              }),
            ],
          },
          onError: "failure",
        },
      },
      validateStatus: {
        id: "validateStatus",
        entry: [
          () => {
            log.info("Validating status, waiting for UPDATE");
          },
        ],
        invoke: {
          id: "CreateBackup",
          src: fromPromise(({ input }) => CreateBackup(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            actions: [
              assign(({ event }) => {
                log.info(event);
                return {
                  backup: event.output.backup,
                };
              }),
              assign({
                stateblock: ({ context }) => (context.device.info.product === "Raise" ? 0 : 5),
              }),
              () => {
                log.info("Backup ready");
              },
              raise({ type: "AUTOPRESSED" }),
            ],
          },
          onError: {
            target: "failure",
            actions: assign({ error: ({ event }) => event.error }),
          },
        },
        on: {
          PRESSED: {
            target: "success",
            guard: "allStepsClear",
            actions: [
              assign({
                stateblock: () => 6,
              }),
            ],
          },
          AUTOPRESSED: {
            target: "success",
            guard: "RaiseStepsClear",
          },
          RETRY: {
            target: "PerfSetup",
          },
          CANCEL: { target: "success" },
        },
      },
      failure: {
        on: {
          RETRY: "PerfSetup",
        },
      },
      success: {
        type: "final",
      },
    },
  },
  {
    guards: {
      requireSideCheck: ({ context }) => !context.device.bootloader === true && context.device.info.product !== "Raise",
      doNotRequireSideCheck: ({ context }) => !context.device.bootloader === true && context.device.info.product === "Raise",
      bootloaderMode: ({ context }) => context.device.bootloader === true,
      allStepsClear: ({ context }) => context.sideLeftOk === true && context.sideRightOK === true && context.backup !== undefined,
      RaiseStepsClear: ({ context }) => context.device.info.product === "Raise" && context.backup !== undefined,
    },
  },
);

export default DeviceChecks;

import { createMachine, assign, raise } from "xstate";
import Focus from "../../../api/focus";
import Backup from "../../../api/backup";

const keyboardSetup = async context => {
  if (context.device.bootloader) return { RaiseBrightness: undefined };
  try {
    const focus = new Focus();
    if (context.device.info.product === "Raise") {
      await focus.command("led.mode 1");
      const brightness = await focus.command("led.brightness");
      await focus.command("led.brightness 255");
      return { RaiseBrightness: brightness };
    }
    await focus.command("upgrade.start");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return { RaiseBrightness: undefined };
};

const GetLSideData = async () => {
  const result = {};
  try {
    const focus = new Focus();
    result.leftSideConn = String(await focus.command("upgrade.keyscanner.isConnected 1")).includes("true");
    result.leftSideBoot = String(await focus.command("upgrade.keyscanner.isBootloader 1")).includes("true");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const GetRSideData = async () => {
  const result = {};
  try {
    const focus = new Focus();
    result.rightSideConn = String(await focus.command("upgrade.keyscanner.isConnected 0")).includes("true");
    result.rightSideBoot = String(await focus.command("upgrade.keyscanner.isBootloader 0")).includes("true");
  } catch (error) {
    console.warn("error when querying the device");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const CreateBackup = async context => {
  let backup;
  try {
    const bkp = new Backup();
    const commands = await bkp.Commands();
    backup = await bkp.DoBackup(commands, context.device.chipID);
    await bkp.SaveBackup(backup);
    const focus = new Focus();
    let keymap = await focus.command("keymap.custom");
    keymap = keymap.split(" ");
    keymap[0] = "41";
    await focus.command(`keymap.custom ${keymap.join(" ")}`);
  } catch (error) {
    console.warn("error when creating Backup of the device");
    console.error(error);
    throw new Error(error);
  }
  return { backup };
};

const DeviceChecks = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6QsYgMwGUwAXAVwAcBiCUvMNXwA3UgGtBEgJ4AjUumIQWHTgG0ADAF1EoTqVysc-HSAAeiAMzqArNQCcANgCMAdifqATNYAc1u74AaEClEJw9qbw87dScHABY7OPU4i2snawBfDKC0LFwCEgoqWnpmNi5uejJiak4MVgZSYgBbamk5BSVytS0TPQMjPBNzBCckhwjolxS49I8xoJCEKNsXDws7VMcnfzisnIxsfCIySlgaABkmHAgwAGFMMHIxXn5BEXFBAHE2K5uwAAi6FY6A02iQIH6OEMxghIw8CPsLmsLgcyI2LjcXkWiESdmoTnca1RHgczjS+xAuSOBVOxT+tweTxeVSatXqjRa1B+rAZgOBoN6EKhMKGcNCUQJFgc1hsaTCUXULhxCDi3nUBJskTsYRlyOse2yVMO+RORXO1AAStdGY9nq8BEI8KIJNy2Nb-kCQWC+vpoYNhohrPEImFrNYLOsEmE7CrURNSSkPMl1BZvGjMkbqabCmcaB7bczKsRquzgZzWjyC-zvULdH7RYGEMG4qGvBGozqoir3PMIjLEhY09MDQ5KdnjrniixUE9WACwMIcGcACqkACqnAgwLADvezs+1CZz2QAHUAGr0XD8H3ChsB8UIVH45xK8MeOKolIOFUOdPUBEuxlMYEhSccTUnOkLRnOcFyXVcNy3Hdi1LOpyyaVpjzEM9L2Ia88FvesBlhUARn8bxqBiFENgNWJMWsFVwycah0UHGJPHTcC8kg80aBg8h50XZc4DXTdt1YXd10IAEAEEVwAUUIyF7xIsxcW8CiqJcGjZjRZEVW8NMIgSGJ0kcFw7EzA5uNpXjqGEdBUBuHcmBBDhYD3J0XUEO5iDAHcACF0GeLglJFB9SNCHZ8VJYM7DsaYFTiX8XA1fwnHVRJSVSg0uJpM083sxznIk1zgXYDzWRqNCGgwo8-MC4KxFCutlOIsVItGDYLAiZF1G8JJIymH9gkQVE0vjdx1ESOIPzHLMINswqHKc8SwDK9zuEIS15KYJh5IBMKVI6tSus2XrZQG1NFVRAyDUoiwYwceLZVmFw8pzKCaAYdAcFQdg-O4HaV0tABNI72qbMZDJYuIEh8FE4tmlV5hcADUjcHwyQseMsiNPBSFueAIQnJaqF9SHHwAWhGpYqemagZSovUY08d6FpsgrijoRhlC4Cn-VUkYxmYx6+o07xphlD8e38FisusDxtKcNN3G8D6eMKvksIFxtH2R0aEESNGESVlXNjiMlco5-KpwtasdbvSnOqSDVMQcfrLfUGJ1UllVHFWRxNke-rZTcDWyegsBZwEuDhNgUSkIk3WItO8bqHDT8LL8bwww8OMBoAwzc4sWZ5TGCOuYtFaSvWtyKpToWJTCewQ+e03LZxgzEVitE0RTHVK7t77fv+vzG5O4XyWoNMmNldxHD9w2DXxTFS4s5xfFSiwh6+6hYHYcg8wnqHp9ntJ5+mv9lUNyWJiVWa7A-eYMvUeasiAA */
    predictableActionArguments: true,
    id: "FlahsingProcess",
    initial: "PerfSetup",
    context: {
      stateblock: 0,
      device: {},
      sideLeftOk: true,
      sideLeftBL: false,
      sideRightOK: true,
      sideRightBL: false,
      backup: undefined,
    },
    states: {
      PerfSetup: {
        id: "PerfSetup",
        entry: [
          () => {
            console.log("Performing setup");
          },
        ],
        invoke: {
          id: "keyboardSetup",
          src: context => keyboardSetup(context),
          onDone: {
            actions: [
              assign((context, event) => {
                if (event.data.RaiseBrightness) {
                  return {
                    RaiseBrightness: event.data.RaiseBrightness,
                  };
                }
              }),
              assign({
                stateblock: () => 1,
              }),
              raise("internal"),
            ],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: [
          { event: "*", target: "validateStatus", cond: "doNotRequireSideCheck" },
          { event: "*", target: "success", cond: "bootloaderMode" },
          { event: "*", target: "LSideCheck", cond: "requireSideCheck" },
        ],
      },
      LSideCheck: {
        id: "LSideCheck",
        entry: [
          () => {
            console.log("Checking left side");
          },
        ],
        invoke: {
          id: "GetLSideData",
          src: GetLSideData,
          onDone: {
            target: "RSideCheck",
            actions: [
              assign((context, event) => {
                console.log(event);
                return {
                  sideLeftOk: event.data.leftSideConn,
                  sideLeftBL: event.data.leftSideBoot,
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
            console.log("Checking right side");
          },
        ],
        invoke: {
          id: "GetRSideData",
          src: GetRSideData,
          onDone: {
            target: "validateStatus",
            actions: [
              assign((context, event) => {
                console.log(event);
                return {
                  sideRightOK: event.data.rightSideConn,
                  sideRightBL: event.data.rightSideBoot,
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
            console.log("Validating status, waiting for UPDATE");
          },
        ],
        invoke: {
          id: "CreateBackup",
          src: context => CreateBackup(context),
          onDone: {
            actions: [
              assign((context, event) => {
                console.log(event);
                return {
                  backup: event.data.backup,
                };
              }),
              assign({
                stateblock: context => (context.device.info.product === "Raise" ? 0 : 5),
              }),
              () => {
                console.log("Backup ready");
              },
              raise("AUTOPRESSED"),
            ],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          PRESSED: {
            target: "success",
            cond: "allStepsClear",
            actions: [
              assign({
                stateblock: () => 6,
              }),
            ],
          },
          AUTOPRESSED: {
            target: "success",
            cond: "RaiseStepsClear",
          },
          RETRY: {
            target: "PerfSetup",
          },
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
      requireSideCheck: context => !context.device.bootloader === true && context.device.info.product !== "Raise",
      doNotRequireSideCheck: context => !context.device.bootloader === true && context.device.info.product === "Raise",
      bootloaderMode: context => context.device.bootloader === true,
      allStepsClear: context => context.sideLeftOk === true && context.sideRightOK === true && context.backup !== undefined,
      RaiseStepsClear: context => context.device.info.product === "Raise" && context.backup !== undefined,
    },
  },
);

export default DeviceChecks;

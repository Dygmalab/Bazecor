import { createMachine, assign, raise } from "xstate";
import fs from "fs";
import path from "path";
import { ipcRenderer } from "electron";
import SideFlaser from "../../../api/flash/defyFlasher/sideFlasher";
import Focus from "../../../api/focus";
import Hardware from "../../../api/hardware";
import { FlashRaise, FlashDefyWireless } from "../../../api/flash";

let flashRaise;
let flashDefyWireless;
let flashSides;
let bootloader;
let comPath;

/**
 * Waits for N miliseconds, uses promises resolution to achieve this effect.
 * @param {Number} ms - time to delay in miliseconds.
 * @returns {Promise} if no error, promise resolved, if not, rejected
 */
const delay = ms =>
  new Promise(res => {
    setTimeout(res, ms);
  });

const stateUpdate = (stage, percentage, context, callback) => {
  console.log(stage, percentage);
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
  callback({
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

const restoreSettings = async (context, backup, stateUpd) => {
  stateUpd("restore", 0);
  const focus = new Focus();
  console.log(backup);
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
      console.log(`Going to send ${backup[i].command} to keyboard`);
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

const reconnect = async (context, callback) => {
  let result = false;
  try {
    const foundDevices = async (hardware, message, isBootloader) => {
      const focus = new Focus();
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
            console.log(message);
            currentPort = { ...device };
            currentPath = device.path;
            isFindDevice = true;
          }
        }
      });
      result = { isFindDevice, currentPort, currentPath };
      return isFindDevice;
    };
    const runnerFindKeyboard = async (findKeyboard, times, errorMessage) => {
      if (!times) {
        console.error("Keyboard not found!");
        return false;
      }
      if (await findKeyboard()) {
        console.log("Ready to restore");
        return true;
      }
      console.log(`Keyboard not detected, trying again for ${times} times`);
      stateUpdate("reconnect", 10 + 100 * (1 / (5 - times)), context, callback);
      await runnerFindKeyboard(findKeyboard, times - 1, errorMessage);
    };
    const findKeyboard = async () =>
      new Promise(async resolve => {
        await delay(2500);
        if (await foundDevices(Hardware.serial, "Keyboard detected", false)) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
    stateUpdate("reconnect", 10, context, callback);
    await runnerFindKeyboard(findKeyboard, 5);
    stateUpdate("reconnect", 100, context, callback);
  } catch (error) {
    console.warn("error when flashing Sides");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const flashSide = async (side, context, callback) => {
  let result = false;
  try {
    const focus = new Focus();
    if (flashSides === undefined) {
      bootloader = context.device.bootloader;
      comPath = focus._port.port.openOptions.path;
      flashSides = new SideFlaser(comPath, context.firmwares.fwSides);
    }
    // Flashing procedure for each side
    await focus.close();
    console.log("done closing focus");
    console.log("Going to flash side:", side);
    result = await flashSides.flashSide(
      side,
      (stage, percentage) => {
        stateUpdate(stage, percentage, context, callback);
      },
      context.device.info.keyboardType,
    );
    if (result.error) throw new Error(result.error);
    stateUpdate(side, 100, context, callback);
  } catch (error) {
    console.warn("error when flashing Sides");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const uploadDefyWired = async (context, callback) => {
  const result = false;
  try {
    const focus = new Focus();
    if (flashSides === undefined) {
      bootloader = context.device.bootloader;
      comPath = focus._port.port.openOptions.path;
      flashSides = new SideFlaser(comPath, context.firmwares.fwSides);
    }
    stateUpdate("neuron", 10, context, callback);
    await flashSides.prepareNeuron();
    stateUpdate("neuron", 30, context, callback);
    await ipcRenderer.invoke("list-drives", true).then(rsl => {
      stateUpdate("neuron", 60, context, callback);
      const finalPath = path.join(rsl, "default.uf2");
      // console.log("RESULTS!!!", rsl, context.firmwares.fw, " to ", finalPath);
      fs.writeFileSync(finalPath, Buffer.from(new Uint8Array(context.firmwares.fw)));
      stateUpdate("neuron", 80, context, callback);
    });

    if (result.error) throw new Error(result.error);
    stateUpdate("neuron", 100, context, callback);
  } catch (error) {
    console.warn("error when flashing Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const resetDefy = async (context, callback) => {
  let result = false;
  try {
    const focus = new Focus();
    if (flashDefyWireless === undefined) {
      console.log("when creating FDW", context.originalDevice.device);
      flashDefyWireless = new FlashDefyWireless(context.originalDevice.device);
      if (flashSides === undefined) {
        comPath = focus._port.port.openOptions.path;
        bootloader = context.device.bootloader;
      }
    }
    if (!bootloader) {
      try {
        console.log("reset indicators", focus, flashDefyWireless, context.originalDevice.device);
        if (focus._port === null || focus._port.closed) {
          const { info } = context.originalDevice.device;
          await focus.close();
          await focus.open(comPath, info, null);
        }
        result = await flashDefyWireless.resetKeyboard(focus._port, (stage, percentage) => {
          stateUpdate(stage, percentage, context, callback);
        });
      } catch (error) {
        console.error("Bootloader Not found: ", error);
        throw new Error(error);
      }
    } else {
      flashDefyWireless.currentPort = { ...context.device };
    }
  } catch (error) {
    console.warn("error when resetting Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const uploadDefyWireles = async (context, callback) => {
  let result = false;
  try {
    const focus = new Focus();
    if (!context.device.bootloader) {
      await focus.close();
    }
    // console.log(context.originalDevice.device, focus, focus._port, flashDefyWireless);
    result = await context.originalDevice.device.flash(
      focus._port,
      context.firmwares.fw,
      bootloader,
      flashDefyWireless,
      (stage, percentage) => {
        stateUpdate(stage, percentage, context, callback);
      },
    );
  } catch (error) {
    console.warn("error when flashing Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const restoreDefies = async (context, callback) => {
  let result = false;
  if (bootloader) {
    return true;
  }
  try {
    result = await restoreSettings(context, context.backup.backup, (stage, percentage) => {
      stateUpdate(stage, percentage, context, callback);
    });
  } catch (error) {
    console.warn("error when restoring Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const resetRaise = async (context, callback) => {
  let result = false;

  try {
    const focus = new Focus();
    if (flashRaise === undefined) {
      flashRaise = new FlashRaise(context.originalDevice.device);
      comPath = focus._port.port.openOptions.path;
      bootloader = context.device.bootloader;
    }
    if (!bootloader) {
      try {
        console.log("reset indicators", focus, flashRaise, context.originalDevice.device);
        if (focus._port.closed) {
          const { info } = context.originalDevice.device;
          await focus.close();
          await focus.open(comPath, info, null);
        }
        result = await flashRaise.resetKeyboard(focus._port, (stage, percentage) => {
          stateUpdate(stage, percentage, context, callback);
        });
      } catch (error) {
        console.error("Bootloader Not found: ", error);
        throw new Error(error);
      }
    } else {
      flashRaise.currentPort = { ...context.device };
    }
  } catch (error) {
    console.warn("error when resetting Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const uploadRaise = async (context, callback) => {
  let result = false;
  try {
    if (!context.device.bootloader) {
      const focus = new Focus();
      await focus.close();
    }
    console.log(context.originalDevice.device, focus, focus._port, flashRaise);
    result = await context.originalDevice.device.flash(focus._port, context.firmwares.fw, flashRaise, (stage, percentage) => {
      stateUpdate(stage, percentage, context, callback);
    });
  } catch (error) {
    console.warn("error when flashing Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const restoreRaise = async (context, callback) => {
  let result = false;
  if (bootloader) {
    return true;
  }
  try {
    result = await restoreSettings(context, context.backup.backup, (stage, percentage) => {
      stateUpdate(stage, percentage, context, callback);
    });
  } catch (error) {
    console.warn("error when restoring Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
};

const integrateCommsToFocus = async context => {
  const { currentDevice } = context.deviceState;
  const focus = new Focus();

  const { path } = currentDevice;
  const { device } = currentDevice;

  await currentDevice.close();
  console.log("closed currentDevice", currentDevice);

  await delay(100);

  await focus.open(path, device, null);
  console.log("opened using focus currentDevice", focus);
};

const FlashDevice = createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6Ad3RwBcBRWcgYmYGUBhQgJW5dmAEQDaABgC6iUAAdSuRjlJ5ZIAB6IATAA4ArNQkB2bQE4zxgIzbz+gCxWANCACeiAGz7t1KxI8AzB4S+pYeZtoeAL5RLmhYuAQkFFTUAGYYsJj8OFCYjFw4EGDsXACqPDxCkjJIIApKKmp1Wgh6hibmljZ2ji7ubdoB1NrGuh66Elb6umb60-YxcRjY+ERklLA0GehZOXkFRSXM-PwA8vw16g1MTeqt7UamFta2c31uiPa6PgG6s5FdAF7KZvEsQPFVkkNqkdlkADJgNKHYqlCpVLhcK51G7KVT3TzmaihKxWMz+AzGay6fo6CT2ajGen2YKkrx+YzgyGJdYpLbpTKYRHIwqok7nS7Sa6KW74lqEszEsyk8kTfRUqw0z4IIJWaheazeMwg-QBKzRWIQlY85KbbaCgByYAArmQ8GjKtUpTiZXjmqBWhFhlYAgEJCEzcZvKTaQgyRJqCzNWb2nNSdouda1rbYY6XW7OKcLtj5L67vKEEHfKHw6arFHtDHtdp7AmIqbjKqJKHO-pMwlszD+cQ4IxSCP4ehXGBiLAPRisd7S405QHEDZzfrjN8ycaIkz7LHtCFiQEqQYph5zzZ+1DeXbqCPYGOJ1OZ3PxcWl-Uy6vNOuJCBEZ6y8cIAkbMxgVjXQ9RBZUvDCb59AkMxbxtIdtgYVBXRKQQABV+AATRLH8V39f82gMJ4uleXpnG1H4Ex+M9jSCfwLUtPBSGKeA6m5Qc+V45dZXI1oAFoPFjCS0IEh96CYVhyGlMiCQQextFjdVjGrPw5g8IZZgCPtLX46FBIFXZMEIdBGEwLgwFQMByBfZSRNU+wWSMIZ7G8cDjxBDxJO1YJg2PJlOjJTVUJMrMzIfOFslyfJRTAVy-VUmxDAcetAPDVsPG+Q9mxPcZjxDMwPBsQJzRkuLc0s4UUVSn0VIrFkEzGbt7DMAx7GBbtY01bS9CpSDlX+CCAlq+96qyJ1XT-XFyzXBBjAKkZw0q8DvCGGZBpgxlAOBKMbAkbQHGM5YBzq-kZzIYg0uWii-HVRl1PUsYgR6-RY1DXR9Uq+kurDFkLSuu8c2HUdxzASdp1nR6-1aF7tO3FtRn+AJvv2nxsvCDUrG6qZpshzCcGwkdEdE9cqK8f4r2CD61WgxtqDNExgX0U1AhMEmMOoWBnXIO0qYyoy9T0d7zumYxgSKgZ-MZGC9CGaYwyMxYYiiIA */
    predictableActionArguments: true,
    id: "FlahsingProcess",
    initial: "waitEsc",
    context: {
      stateblock: 1,
      globalProgress: 0,
      leftProgress: 0,
      rightProgress: 0,
      resetProgress: 0,
      neuronProgress: 0,
      restoreProgress: 0,
      retriesRight: 0,
      retriesLeft: 0,
      retriesNeuron: 0,
      retriesDefyWired: 0,
      firwmares: [],
    },
    states: {
      waitEsc: {
        id: "waitEsc",
        entry: [
          (context, event) => {
            console.log("Wait for esc!");
          },
          assign({ stateblock: (context, event) => 1 }),
          context => integrateCommsToFocus(context),
          "addEscListener",
        ],
        on: {
          // Go to flashPathSelector automatically when no esc key can be pressed
          "": [{ target: "flashPathSelector", cond: "doNotWaitForESC" }],
          // Esc key listener will send this event
          ESCPRESSED: "flashPathSelector",
        },
        exit: ["removeEscListener"],
      },
      flashPathSelector: {
        id: "flashPathSelector",
        entry: [
          (context, event) => {
            console.log("Selecting upgrade path");
            console.log("context of device", context.device);
          },
          assign({
            stateblock: (context, event) => 1,
          }),
          "toggleFlashing",
          raise("flashingPath"),
        ],
        on: [
          { event: "*", target: "flashDefyWired", cond: "doNotFlashSidesW" },
          { event: "*", target: "resetDefyWireless", cond: "doNotFlashSidesWi" },
          { event: "*", target: "resetRaiseNeuron", cond: "flashRaise" },
          { event: "*", target: "flashRightSide", cond: "flashSides" },
        ],
      },
      flashRightSide: {
        id: "flashRightSide",
        entry: [
          (context, event) => {
            console.log(`Flashing Right Side! for ${context.retriesRight} times`);
          },
          assign((context, event) => ({
            retriesRight: context.retriesRight + 1,
            stateblock: 2,
          })),
        ],
        invoke: {
          id: "flashRightSide",
          src: (context, event) => (callback, onReceive) => flashSide("right", context, callback),
          onDone: {
            target: "flashLeftSide",
            actions: [assign({ rightResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      flashLeftSide: {
        id: "flashLeftSide",
        entry: [
          (context, event) => {
            console.log(`Flashing Left Side! for ${context.retriesLeft} times`);
          },
          assign((context, event) => ({
            retriesLeft: context.retriesLeft + 1,
            stateblock: 3,
          })),
        ],
        invoke: {
          id: "flashLeftSide",
          src: (context, event) => (callback, onReceive) => flashSide("left", context, callback),
          onDone: {
            actions: [
              assign({ leftResult: (context, event) => event.data }),
              assign((context, event) => ({
                DefyVariant: `${context.device.info.product}${context.device.info.keyboardType}`,
              })),
              raise("internal"),
            ],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: [
          {
            event: "INC",
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
          { event: "*", target: "flashDefyWired", cond: "isDefywired" },
          { event: "*", target: "resetDefyWireless", cond: "isDefywireless" },
        ],
      },
      flashDefyWired: {
        id: "flashDefyWired",
        entry: [
          (context, event) => {
            console.log(`Flashing Neuron! for ${context.retriesDefyWired} times`);
          },
          assign((context, event) => ({
            retriesDefyWired: context.retriesDefyNeuron + 1,
            stateblock: 5,
          })),
        ],
        invoke: {
          id: "flashRP2040",
          src: (context, event) => (callback, onReceive) => uploadDefyWired(context, callback),
          onDone: {
            target: "reconnectDefy",
            actions: [assign({ rightResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      resetDefyWireless: {
        id: "resetDefyWireless",
        entry: [
          (context, event) => {
            console.log(`Resetting Neuron!`);
          },
          assign({ stateblock: (context, event) => 4 }),
        ],
        invoke: {
          id: "resetDefyWireless",
          src: (context, event) => (callback, onReceive) => resetDefy(context, callback),
          onDone: {
            target: "flashDefyWireless",
            actions: [assign({ resetResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      flashDefyWireless: {
        id: "flashDefyWireless",
        entry: [
          (context, event) => {
            console.log(`Flashing Neuron! for ${context.retriesNeuron} times`);
          },
          assign({ stateblock: (context, event) => 5 }),
          assign({ retriesNeuron: (context, event) => context.retriesNeuron + 1 }),
        ],
        invoke: {
          id: "uploadDefyWireless",
          src: (context, event) => (callback, onReceive) => uploadDefyWireles(context, callback),
          onDone: {
            target: "reconnectDefy",
            actions: [assign({ flashResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      reconnectDefy: {
        id: "reconnectDefy",
        entry: [
          (context, event) => {
            console.log(`Reconnecting to Neuron!`);
          },
          assign({ stateblock: (context, event) => 5 }),
        ],
        invoke: {
          id: "reconnectDefy",
          src: (context, event) => (callback, onReceive) => reconnect(context, callback),
          onDone: {
            target: "restoreDefy",
            actions: [assign({ flashResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      restoreDefy: {
        id: "restoreDefy",
        entry: [
          (context, event) => {
            console.log(`Restoring Neuron!`);
          },
          assign({ stateblock: (context, event) => 6 }),
        ],
        invoke: {
          id: "restoreDefy",
          src: (context, event) => (callback, onReceive) => restoreDefies(context, callback),
          onDone: {
            target: "reportSucess",
            actions: [assign({ restoreResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      resetRaiseNeuron: {
        id: "resetRaiseNeuron",
        entry: [
          (context, event) => {
            console.log(`Resetting Neuron!`);
          },
          assign({ stateblock: (context, event) => 4 }),
        ],
        invoke: {
          id: "resetRaise",
          src: (context, event) => (callback, onReceive) => resetRaise(context, callback),
          onDone: {
            target: "flashRaiseNeuron",
            actions: [assign({ resetResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      flashRaiseNeuron: {
        id: "flashRaiseNeuron",
        entry: [
          (context, event) => {
            console.log(`Flashing Neuron! for ${context.retriesNeuron} times`);
          },
          assign({ stateblock: (context, event) => 5 }),
          assign({ retriesNeuron: (context, event) => context.retriesNeuron + 1 }),
        ],
        invoke: {
          id: "uploadRaise",
          src: (context, event) => (callback, onReceive) => uploadRaise(context, callback),
          onDone: {
            target: "restoreRaiseNeuron",
            actions: [assign({ flashResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      restoreRaiseNeuron: {
        id: "restoreRaiseNeuron",
        entry: [
          (context, event) => {
            console.log(`Restoring Neuron!`);
          },
          assign({ stateblock: (context, event) => 6 }),
        ],
        invoke: {
          id: "restoreRaise",
          src: (context, event) => (callback, onReceive) => restoreRaise(context, callback),
          onDone: {
            target: "reportSucess",
            actions: [assign({ flashResult: (context, event) => event.data })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign((context, event) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
        },
      },
      reportSucess: {
        id: "reportSucess",
        entry: [
          (context, event) => {
            console.log("Reporting Sucess");
          },
          assign({
            stateblock: (context, event) => 7,
          }),
        ],
        after: {
          3000: { target: "success", actions: ["finishFlashing"] },
        },
      },
      failure: {
        entry: [
          (context, event) => {
            console.log("Failure state");
          },
          assign({
            stateblock: (context, event) => 8,
          }),
        ],
        on: {
          RETRY: "#FlahsingProcess",
          CANCEL: { target: "success", actions: ["finishFlashing"] },
        },
      },
      success: {
        type: "final",
      },
    },
  },
  {
    guards: {
      flashSides: (context, event) => context.device.bootloader !== true && context.device.info.product !== "Raise",
      flashRaise: (context, event) => context.device.info.product === "Raise",
      doNotFlashSidesW: (context, event) =>
        context.device.bootloader === true &&
        context.device.info.product !== "Raise" &&
        context.device.info.keyboardType === "wired",
      doNotFlashSidesWi: (context, event) =>
        context.device.bootloader === true &&
        context.device.info.product !== "Raise" &&
        context.device.info.keyboardType === "wireless",
      doNotWaitForESC: (context, event) => context.device.bootloader === true || context.sideLeftBL === true,
      isDefywired: (context, event) => context.DefyVariant === "Defywired",
      isDefywireless: (context, event) => context.DefyVariant === "Defywireless",
    },
  },
);

export default FlashDevice;

import { createMachine, assign, raise } from "xstate";
import Focus from "../../../api/focus";
import { FlashRaise, FlashDefyWired, FlashDefyWireless } from "../../../api/flash";
import Backup from "../../../api/backup";

let flashRaise = undefined,
  bootloader = undefined,
  path = undefined;
const delay = ms => new Promise(res => setTimeout(res, ms));

const stateUpdate = (stage, percentage, context, callback) => {
  console.log(stage, percentage);
  let globalProgress = context.globalProgress,
    leftProgress = context.leftProgress,
    rightProgress = context.rightProgress,
    resetProgress = context.resetProgress,
    neuronProgress = context.neuronProgress,
    restoreProgress = context.restoreProgress;
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
  globalProgress = leftProgress * 0 + rightProgress * 0 + resetProgress * 0.2 + neuronProgress * 0.6 + restoreProgress * 0.2;
  callback({
    type: "INC",
    data: {
      globalProgress: globalProgress,
      leftProgress: leftProgress,
      rightProgress: rightProgress,
      resetProgress: resetProgress,
      neuronProgress: neuronProgress,
      restoreProgress: restoreProgress
    }
  });
};

const resetRaise = async (context, callback) => {
  let result = false;

  try {
    let focus = new Focus();
    if (flashRaise == undefined) {
      flashRaise = new FlashRaise(context.originalDevice.device);
      path = focus._port.port.openOptions.path;
      bootloader = context.device.bootloader;
    }
    if (!bootloader) {
      try {
        console.log("reset indicators", focus, flashRaise, context.originalDevice.device);
        if (focus._port.closed) {
          const info = context.originalDevice.device.info;
          await focus.close();
          await focus.open(path, info, null);
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
      let focus = new Focus();
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
    result = await flashRaise.restoreSettings(context.backup.backup, (stage, percentage) => {
      stateUpdate(stage, percentage, context, callback);
    });
  } catch (error) {
    console.warn("error when restoring Neuron");
    console.error(error);
    throw new Error(error);
  }
  return result;
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
      retriesDefyNeuron: 0,
      firwmares: []
    },
    states: {
      waitEsc: {
        id: "waitEsc",
        entry: [
          (context, event) => {
            console.log("Wait for esc!");
          },
          assign({ stateblock: (context, event) => 1 }),
          "addEscListener"
        ],
        on: {
          // Go to flashPathSelector automatically when no esc key can be pressed
          "": [{ target: "flashPathSelector", cond: "isBootloader" }],
          // Esc key listener will send this event
          ESCPRESSED: "flashPathSelector"
        },
        exit: ["removeEscListener"]
      },
      flashPathSelector: {
        id: "flashPathSelector",
        entry: [
          (context, event) => {
            console.log("Selecting upgrade path");
          },
          assign({
            stateblock: (context, event) => 1
          }),
          "toggleFlashing",
          raise("flashingPath")
        ],
        on: [
          { event: "*", target: "flashDefyNeuron", cond: "doNotFlashSides" },
          { event: "*", target: "resetRaiseNeuron", cond: "flashRaise" },
          { event: "*", target: "flashRightSide", cond: "flashSides" }
        ]
      },
      flashRightSide: {
        id: "flashRightSide",
        entry: [
          (context, event) => {
            console.log(`Flashing Right Side! for ${context.retriesRight} times`);
          },
          assign((context, event) => {
            return {
              retriesRight: context.retriesRight + 1,
              stateblock: 2
            };
          })
        ],
        on: {
          SUCCESS: "flashLeftSide",
          ERROR: "failure"
        }
      },
      flashLeftSide: {
        id: "flashLeftSide",
        entry: [
          (context, event) => {
            console.log(`Flashing Left Side! for ${context.retriesLeft} times`);
          },
          assign((context, event) => {
            return {
              retriesLeft: context.retriesLeft + 1,
              stateblock: 3
            };
          })
        ],
        on: {
          SUCCESS: "flashDefyNeuron",
          ERROR: "failure"
        }
      },
      flashDefyNeuron: {
        id: "flashDefyNeuron",
        entry: [
          (context, event) => {
            console.log(`Flashing Neuron! for ${context.retriesDefyNeuron} times`);
          },
          assign((context, event) => {
            return {
              retriesDefyNeuron: context.retriesDefyNeuron + 1,
              stateblock: 5
            };
          })
        ],
        on: {
          SUCCESS: "reportSucess",
          ERROR: "failure"
        }
      },
      resetRaiseNeuron: {
        id: "resetRaiseNeuron",
        entry: [
          (context, event) => {
            console.log(`Resetting Neuron!`);
          },
          assign({ stateblock: (context, event) => 2 })
        ],
        invoke: {
          id: "resetRaise",
          src: (context, event) => (callback, onReceive) => resetRaise(context, callback),
          onDone: {
            target: "flashRaiseNeuron",
            actions: [assign({ resetResult: (context, event) => event.data })]
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event })
          }
        },
        on: {
          INC: {
            actions: assign((context, event) => {
              return {
                ...context,
                globalProgress: event.data.globalProgress,
                leftProgress: event.data.leftProgress,
                rightProgress: event.data.rightProgress,
                resetProgress: event.data.resetProgress,
                neuronProgress: event.data.neuronProgress,
                restoreProgress: event.data.restoreProgress
              };
            })
          }
        }
      },
      flashRaiseNeuron: {
        id: "flashRaiseNeuron",
        entry: [
          (context, event) => {
            console.log(`Flashing Neuron! for ${context.retriesNeuron} times`);
          },
          assign({ stateblock: (context, event) => 3 }),
          assign({ retriesNeuron: (context, event) => context.retriesNeuron + 1 })
        ],
        invoke: {
          id: "uploadRaise",
          src: (context, event) => (callback, onReceive) => uploadRaise(context, callback),
          onDone: {
            target: "restoreRaiseNeuron",
            actions: [assign({ flashResult: (context, event) => event.data })]
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event })
          }
        },
        on: {
          INC: {
            actions: assign((context, event) => {
              return {
                ...context,
                globalProgress: event.data.globalProgress,
                leftProgress: event.data.leftProgress,
                rightProgress: event.data.rightProgress,
                resetProgress: event.data.resetProgress,
                neuronProgress: event.data.neuronProgress,
                restoreProgress: event.data.restoreProgress
              };
            })
          }
        }
      },
      restoreRaiseNeuron: {
        id: "restoreRaiseNeuron",
        entry: [
          (context, event) => {
            console.log(`Restoring Neuron!`);
          },
          assign({ stateblock: (context, event) => 4 })
        ],
        invoke: {
          id: "restoreRaise",
          src: (context, event) => (callback, onReceive) => restoreRaise(context, callback),
          onDone: {
            target: "reportSucess",
            actions: [assign({ flashResult: (context, event) => event.data })]
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event })
          }
        },
        on: {
          INC: {
            actions: assign((context, event) => {
              return {
                ...context,
                globalProgress: event.data.globalProgress,
                leftProgress: event.data.leftProgress,
                rightProgress: event.data.rightProgress,
                resetProgress: event.data.resetProgress,
                neuronProgress: event.data.neuronProgress,
                restoreProgress: event.data.restoreProgress
              };
            })
          }
        }
      },
      reportSucess: {
        id: "reportSucess",
        entry: [
          (context, event) => {
            console.log("Reporting Sucess");
          },
          assign({
            stateblock: (context, event) => 7
          })
        ],
        after: {
          4000: { target: "success", actions: ["finishFlashing"] }
        }
      },
      failure: {
        entry: [
          (context, event) => {
            console.log("Failure state");
          },
          assign({
            stateblock: (context, event) => 8
          })
        ],
        on: {
          RETRY: "#FlahsingProcess",
          CANCEL: { target: "success", actions: ["finishFlashing"] }
        }
      },
      success: {
        type: "final"
      }
    }
  },
  {
    guards: {
      flashSides: (context, event) => {
        return !context.device.bootloader && context.device.info.product !== "Raise";
      },
      flashRaise: (context, event) => {
        return context.device.info.product === "Raise";
      },
      doNotFlashSides: (context, event) => {
        return context.device.bootloader && context.device.info.product !== "Raise";
      },
      isBootloader: (context, event) => {
        return context.device.bootloader;
      }
    }
  }
);

export default FlashDevice;

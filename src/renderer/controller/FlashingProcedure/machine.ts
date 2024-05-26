/* eslint-disable no-await-in-loop */
import { setup, assign, raise, fromPromise } from "xstate";
import log from "electron-log/renderer";

import * as Actions from "./actions";
import * as Context from "./context";
import type * as Events from "./events";
import * as Input from "./input";

const FlashDevice = setup({
  types: {
    input: {} as Input.InputType,
    context: {} as Context.ContextType,
    events: {} as Events.Events,
  },
  actors: {
    /// Create actors using `fromPromise`
    onInit: fromPromise<Context.ContextType, Input.InputType>(({ input }) => Input.Input(input)),
    integrateCommsToFocus: fromPromise<boolean, Context.ContextType>(({ input }) => Actions.integrateCommsToFocus(input)),
    flashRSide: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.flashSide("right", input)),
    flashLSide: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.flashSide("left", input)),
    uploadDefyWired: fromPromise<{ rightSideConn: boolean; rightSideBoot: boolean }, Context.ContextType>(({ input }) =>
      Actions.GetRSideData(input),
    ),
    resetDefy: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
    uploadDefyWireles: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
    reconnect: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
    restoreDefies: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
    resetRaise: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
    uploadRaise: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
    restoreRaise: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
  },
  actions: {
    /// Execute `Actions`
  },
}).createMachine(
  {
    /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6Ad3RwBcBRWcgYmYGUBhQgJW5dmAEQDaABgC6iUAAdSuRjlJ5ZIAB6IATAA4ArNQkB2bQE4zxgIzbz+gCxWANCACeiAGz7t1KxI8AzB4S+pYeZtoeAL5RLmhYuAQkFFTUAGYYsJj8OFCYjFw4EGDsXACqPDxCkjJIIApKKmp1Wgh6hibmljZ2ji7ubdoB1NrGuh66Elb6umb60-YxcRjY+ERklLA0GehZOXkFRSXM-PwA8vw16g1MTeqt7UamFta2c31uiPa6PgG6s5FdAF7KZvEsQPFVkkNqkdlkADJgNKHYqlCpVLhcK51G7KVT3TzmaihKxWMz+AzGay6fo6CT2ajGen2YKkrx+YzgyGJdYpLbpTKYRHIwqok7nS7Sa6KW74lqEszEsyk8kTfRUqw0z4IIJWaheazeMwg-QBKzRWIQlY85KbbaCgByYAArmQ8GjKtUpTiZXjmqBWhFhlYAgEJCEzcZvKTaQgyRJqCzNWb2nNSdouda1rbYY6XW7OKcLtj5L67vKEEHfKHw6arFHtDHtdp7AmIqbjKqJKHO-pMwlszD+cQ4IxSCP4ehXGBiLAPRisd7S405QHEDZzfrjN8ycaIkz7LHtCFiQEqQYph5zzZ+1DeXbqCPYGOJ1OZ3PxcWl-Uy6vNOuJCBEZ6y8cIAkbMxgVjXQ9RBZUvDCb59AkMxbxtIdtgYVBXRKQQABV+AATRLH8V39f82gMJ4uleXpnG1H4Ex+M9jSCfwLUtPBSGKeA6m5Qc+V45dZXI1oAFoPFjCS0IEh96CYVhyGlMiCQQextFjdVjGrPw5g8IZZgCPtLX46FBIFXZMEIdBGEwLgwFQMByBfZSRNU+wWSMIZ7G8cDjxBDxJO1YJg2PJlOjJTVUJMrMzIfOFslyfJRTAVy-VUmxDAcetAPDVsPG+Q9mxPcZjxDMwPBsQJzRkuLc0s4UUVSn0VIrFkEzGbt7DMAx7GBbtY01bS9CpSDlX+CCAlq+96qyJ1XT-XFyzXBBjAKkZw0q8DvCGGZBpgxlAOBKMbAkbQHGM5YBzq-kZzIYg0uWii-HVRl1PUsYgR6-RY1DXR9Uq+kurDFkLSuu8c2HUdxzASdp1nR6-1aF7tO3FtRn+AJvv2nxsvCDUrG6qZpshzCcGwkdEdE9cqK8f4r2CD61WgxtqDNExgX0U1AhMEmMOoWBnXIO0qYyoy9T0d7zumYxgSKgZ-MZGC9CGaYwyMxYYiiIA */
    id: "FlahsingProcess",
    invoke: {
      input: ({ event }) => {
        if (event.type === "xstate.init") {
          return event.input;
        }

        throw new Error("Unexpected event type");
      },
      onError: {
        target: ".waitEsc",
      },
      onDone: {
        target: ".waitEsc",
        actions: [
          assign(({ event }) => ({
            firmwares: event.output.firmwares,
            device: event.output.device,
            deviceState: event.output.deviceState,
          })),
        ],
      },
      src: "onInit",
    },
    initial: "wait",
    context: Context.Context,
    states: {
      wait: {},
      waitEsc: {
        id: "waitEsc",
        entry: [
          () => {
            log.info("Wait for esc! & clearing globals");
          },
          assign({
            stateblock: 1,
            flashRaise: undefined,
            flashDefyWireless: undefined,
            flashSides: undefined,
            bootloader: undefined,
            comPath: undefined,
          }),
          "addEscListener",
        ],
        invoke: {
          src: "integrateCommsToFocus",
          input: ({ context }) => context,
          onDone: {
            actions: assign(({ event }) => {
              log.info(event);
              if (event.output !== undefined) {
                return {
                  bootloader: event.output,
                  loadedComms: true,
                };
              }
              return {
                bootloader: event.output,
                loadedComms: false,
              };
            }),
          },
          onError: {
            target: "failure",
            actions: assign({ error: ({ event }) => event.error }),
          },
        },
        on: {
          // Go to flashPathSelector automatically when no esc key can be pressed
          // Esc key listener will send this event
          ESCPRESSED: "flashPathSelector",
        },
        always: [{ target: "flashPathSelector", guard: "doNotWaitForESC" }],
        exit: ["removeEscListener"],
      },
      flashPathSelector: {
        id: "flashPathSelector",
        entry: [
          ({ context }) => {
            log.info("Selecting upgrade path");
            log.info("context of device", context.device);
          },
          assign({
            stateblock: () => 1,
          }),
          "toggleFlashing",
          raise({ type: "internal-event" }),
        ],
        on: {
          "*": [
            { target: "flashDefyWired", guard: "doNotFlashSidesW" },
            { target: "resetDefyWireless", guard: "doNotFlashSidesWi" },
            { target: "resetRaiseNeuron", guard: "flashRaise" },
            { target: "flashRightSide", guard: "flashSides" },
          ],
        },
      },
      flashRightSide: {
        id: "flashRightSide",
        entry: [
          ({ context }) => {
            log.info(`Flashing Right Side! for ${context.retriesRight} times`);
          },
          assign(({ context }) => ({
            retriesRight: context.retriesRight + 1,
            stateblock: 2,
          })),
        ],
        invoke: {
          src: "flashRSide",
          input: ({ context }) => context,
          onDone: {
            target: "flashLeftSide",
            actions: assign(({ event }) => ({
              bootloader: event.output.bootloader,
              comPath: event.output.comPath,
              flashSides: event.output.flashSides,
              rightResult: event.output.rightResult,
              leftResult: event.output.leftResult,
            })),
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
              ...context,
              globalProgress: event.output.globalProgress,
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
          ({ context }) => {
            log.info(`Flashing Left Side! for ${context.retriesLeft} times`);
          },
          assign(({ context }) => ({
            retriesLeft: context.retriesLeft + 1,
            stateblock: 3,
          })),
        ],
        invoke: {
          src: "flashLSide",
          input: ({ context }) => context,
          onDone: {
            actions: [
              assign({ leftResult: ({ event }) => event.output }),
              assign({ DefyVariant: ({ context }) => `${context.device.info.product}${context.device.info.keyboardType}` }),
              raise({ type: "internal-event" }),
            ],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
              ...context,
              globalProgress: event.data.globalProgress,
              leftProgress: event.data.leftProgress,
              rightProgress: event.data.rightProgress,
              resetProgress: event.data.resetProgress,
              neuronProgress: event.data.neuronProgress,
              restoreProgress: event.data.restoreProgress,
            })),
          },
          "*": [
            { target: "flashDefyWired", guard: "isDefywired" },
            { target: "resetDefyWireless", guard: "isDefywireless" },
          ],
        },
      },
      flashDefyWired: {
        id: "flashDefyWired",
        entry: [
          ({ context }) => {
            log.info(`Flashing Neuron! for ${context.retriesDefyWired} times`);
          },
          assign(({ context }) => ({
            retriesDefyWired: context.retriesNeuron + 1,
            stateblock: 5,
          })),
        ],
        invoke: {
          id: "flashRP2040",
          src: fromPromise(({ input }) => uploadDefyWired(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "reconnectDefy",
            actions: [assign({ rightResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          () => {
            log.info(`Resetting Neuron!`);
          },
          assign({ stateblock: () => 4 }),
        ],
        invoke: {
          id: "resetDefyWireless",
          src: fromPromise(({ input }) => resetDefy(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "flashDefyWireless",
            actions: [assign({ resetResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          ({ context }) => {
            log.info(`Flashing Neuron! for ${context.retriesNeuron} times`);
          },
          assign({ stateblock: () => 5 }),
          assign({ retriesNeuron: ({ context }) => context.retriesNeuron + 1 }),
        ],
        invoke: {
          id: "uploadDefyWireless",
          src: fromPromise(({ input }) => uploadDefyWireles(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "reconnectDefy",
            actions: [assign({ flashResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          () => {
            log.info(`Reconnecting to Neuron!`);
          },
          assign({ stateblock: () => 5 }),
        ],
        invoke: {
          id: "reconnectDefy",
          src: fromPromise(({ input }) => reconnect(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "restoreDefy",
            actions: [assign({ flashResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          () => {
            log.info(`Restoring Neuron!`);
          },
          assign({ stateblock: () => 6 }),
        ],
        invoke: {
          id: "restoreDefy",
          src: fromPromise(({ input }) => restoreDefies(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "reportSucess",
            actions: [assign({ restoreResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          () => {
            log.info(`Resetting Neuron!`);
          },
          assign({ stateblock: () => 4 }),
        ],
        invoke: {
          id: "resetRaise",
          src: fromPromise(({ input }) => resetRaise(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "flashRaiseNeuron",
            actions: [assign({ resetResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          ({ context }) => {
            log.info(`Flashing Neuron! for ${context.retriesNeuron} times`);
          },
          assign({ stateblock: () => 5 }),
          assign({ retriesNeuron: ({ context }) => context.retriesNeuron + 1 }),
        ],
        invoke: {
          id: "uploadRaise",
          src: fromPromise(({ input }) => uploadRaise(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "restoreRaiseNeuron",
            actions: [assign({ flashResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          () => {
            log.info(`Restoring Neuron!`);
          },
          assign({ stateblock: () => 6 }),
        ],
        invoke: {
          id: "restoreRaise",
          src: fromPromise(({ input }) => restoreRaise(input.context)),
          input: ({ context }) => ({ context }),
          onDone: {
            target: "reportSucess",
            actions: [assign({ restoreResult: ({ event }) => event.output })],
          },
          onError: {
            target: "failure",
            actions: assign({ error: (context, event) => event }),
          },
        },
        on: {
          INC: {
            actions: assign(({ context, event }) => ({
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
          () => {
            log.info("Reporting Sucess");
          },
          assign({
            stateblock: () => 7,
          }),
        ],
        after: {
          3000: { target: "success", actions: ["finishFlashing"] },
        },
      },
      failure: {
        entry: [
          () => {
            log.info("Failure state");
          },
          assign({
            stateblock: () => 8,
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
      flashSides: ({ context }) => context.device.bootloader !== true && context.device.info.product !== "Raise",
      flashRaise: ({ context }) => context.device.info.product === "Raise",
      doNotFlashSidesW: ({ context }) =>
        context.device.bootloader === true &&
        context.device.info.product !== "Raise" &&
        context.device.info.keyboardType === "wired",
      doNotFlashSidesWi: ({ context }) =>
        context.device.bootloader === true &&
        context.device.info.product !== "Raise" &&
        context.device.info.keyboardType === "wireless",
      doNotWaitForESC: ({ context }) =>
        (context.device.bootloader === true || context.sideLeftBL === true) && context.loadedComms === true,
      isDefywired: ({ context }) => context.DefyVariant === "Defywired",
      isDefywireless: ({ context }) => context.DefyVariant === "Defywireless",
    },
  },
);

export default FlashDevice;

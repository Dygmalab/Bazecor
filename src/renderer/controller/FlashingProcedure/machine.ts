/* eslint-disable no-await-in-loop */
import { setup, assign, raise, fromPromise } from "xstate";
import log from "electron-log/renderer";

import * as Actions from "./actions";
import * as Context from "./context";
import type * as Events from "./events";
import * as Input from "./input";

const addEscListener = () => {};
const removeEscListener = () => {};
const toggleFlashing = () => {};
const finishFlashing = () => {};

const FlashDevice = setup({
  types: {
    input: {} as Input.InputType,
    context: {} as Context.ContextType,
    events: {} as Events.Events,
  },
  actors: {
    /// Create actors using `fromPromise`
    onInit: fromPromise<Context.ContextType, Input.InputType>(({ input }) => Input.Input(input)),
    flashRSide: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.flashSide("right", input)),
    flashLSide: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.flashSide("left", input)),
    uploadDefyWired: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.uploadDefyWired(input)),
    resetDefy: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.resetDefy(input)),
    uploadDefyWireless: fromPromise<boolean, Context.ContextType>(({ input }) => Actions.uploadDefyWireless(input)),
    uploadRaise2: fromPromise<boolean, Context.ContextType>(({ input }) => Actions.uploadRaise2(input)),
    reconnect: fromPromise<boolean, Context.ContextType>(({ input }) => Actions.reconnect(input)),
    restoreDefies: fromPromise<boolean, Context.ContextType>(({ input }) => Actions.restoreDefies(input)),
    resetRaise: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.resetRaise(input)),
    uploadRaise: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.uploadRaise(input)),
    restoreRaise: fromPromise<boolean, Context.ContextType>(({ input }) => Actions.restoreRaise(input)),
  },
  actions: {
    /// Execute `Actions`
    addEscListener,
    removeEscListener,
    toggleFlashing,
    finishFlashing,
  },
  guards: {
    flashSides: ({ context }) => context.device?.bootloader !== true && context.device?.info.product !== "Raise",
    flashRaise: ({ context }) => context.device?.info.product === "Raise",
    doNotFlashSidesW: ({ context }) =>
      context.device?.bootloader === true &&
      context.device.info.product !== "Raise" &&
      context.device.info.keyboardType === "wired",
    doNotFlashSidesWi: ({ context }) =>
      context.device?.bootloader === true &&
      context.device.info.product !== "Raise" &&
      (context.device.info.keyboardType === "wireless" || context.device.info.product === "Raise2"),
    doNotWaitForESC: ({ context }) =>
      (context.device?.bootloader === true || context.sideLeftBL === true) && context.loadedComms === true,
    isDefywired: ({ context }) => context.DeviceVariant === "Defywired",
    isDefywireless: ({ context }) => context.DeviceVariant === "Defywireless",
    isRaise2: ({ context }) => context.DeviceVariant === "Raise2ISO" || context.DeviceVariant === "Raise2ANSI",
  },
}).createMachine({
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
      actions: [assign(({ event }) => event.output)],
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
        ({ context }) => {
          log.info(
            `Wait for esc! & clearing globals, Bootloader: ${context.device.bootloader}, loadedComms: ${context.loadedComms}`,
          );
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
      on: {
        // Go to flashPathSelector automatically when no esc key can be pressed
        // Esc key listener will send this event
        "escpressed-event": "flashPathSelector",
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
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
            assign(({ event }) => event.output),
            assign({ DeviceVariant: ({ context }) => `${context.device?.info.product}${context.device?.info.keyboardType}` }),
            raise({ type: "internal-event" }),
          ],
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
          })),
        },
        "*": [
          { target: "flashDefyWired", guard: "isDefywired" },
          { target: "resetDefyWireless", guard: "isDefywireless" },
          { target: "resetRaise2", guard: "isRaise2" },
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
        src: "uploadDefyWired",
        input: ({ context }) => context,
        onDone: {
          target: "reconnectDefy",
          actions: assign(({ event }) => event.output),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
        src: "resetDefy",
        input: ({ context }) => context,
        onDone: {
          target: "flashDefyWireless",
          actions: assign(({ event }) => event.output),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
        src: "uploadDefyWireless",
        input: ({ context }) => context,
        onDone: {
          target: "reconnectDefy",
          actions: assign({
            resetResult: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: [
            assign(({ event }) => ({
              globalProgress: event.globalProgress,
              leftProgress: event.leftProgress,
              rightProgress: event.rightProgress,
              resetProgress: event.resetProgress,
              neuronProgress: event.neuronProgress,
              restoreProgress: event.restoreProgress,
            })),
          ],
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
        src: "reconnect",
        input: ({ context }) => context,
        onDone: {
          target: "restoreDefy",
          actions: [assign({ flashResult: ({ event }) => event.output })],
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
        src: "restoreDefies",
        input: ({ context }) => context,
        onDone: {
          target: "reportSucess",
          actions: assign({
            restoreResult: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any }), assign({ restoreResult: false })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
          })),
        },
      },
    },
    resetRaise2: {
      id: "resetRaise2",
      entry: [
        () => {
          log.info(`Resetting Neuron!`);
        },
        assign({ stateblock: () => 4 }),
      ],
      invoke: {
        src: "resetDefy",
        input: ({ context }) => context,
        onDone: {
          target: "flashRaise2",
          actions: assign(({ event }) => event.output),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
          })),
        },
      },
    },
    flashRaise2: {
      id: "flashRaise2",
      entry: [
        ({ context }) => {
          log.info(`Flashing Neuron! for ${context.retriesNeuron} times`);
        },
        assign({ stateblock: () => 5 }),
        assign({ retriesNeuron: ({ context }) => context.retriesNeuron + 1 }),
      ],
      invoke: {
        src: "uploadRaise2",
        input: ({ context }) => context,
        onDone: {
          target: "reconnectDefy",
          actions: assign({
            resetResult: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: [
            assign(({ event }) => ({
              globalProgress: event.globalProgress,
              leftProgress: event.leftProgress,
              rightProgress: event.rightProgress,
              resetProgress: event.resetProgress,
              neuronProgress: event.neuronProgress,
              restoreProgress: event.restoreProgress,
            })),
          ],
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
        src: "resetRaise",
        input: ({ context }) => context,
        onDone: {
          target: "flashRaiseNeuron",
          actions: assign(({ event }) => event.output),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
        src: "uploadRaise",
        input: ({ context }) => context,
        onDone: {
          target: "restoreRaiseNeuron",
          actions: assign(({ event }) => event.output),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
        src: "restoreRaise",
        input: ({ context }) => context,
        onDone: {
          target: "reportSucess",
          actions: assign({
            restoreResult: ({ event }) => event.output,
          }),
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "increment-event": {
          actions: assign(({ event }) => ({
            globalProgress: event.globalProgress,
            leftProgress: event.leftProgress,
            rightProgress: event.rightProgress,
            resetProgress: event.resetProgress,
            neuronProgress: event.neuronProgress,
            restoreProgress: event.restoreProgress,
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
        "retry-event": "waitEsc",
        "cancel-event": { target: "success", actions: ["finishFlashing"] },
      },
    },
    success: {
      type: "final",
    },
  },
});

export default FlashDevice;

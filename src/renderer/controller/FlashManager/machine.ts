import { setup, assign, fromPromise } from "xstate";
import log from "electron-log/renderer";

import * as Actions from "./actions";
import * as Context from "./context";
import type * as Events from "./events";
import * as Input from "./input";

const FlashManager = setup({
  types: {
    input: {} as Input.InputType,
    context: {} as Context.ContextType,
    events: {} as Events.Events,
  },
  actors: {
    /// Create actors using `fromPromise`
    onInit: fromPromise<Context.ContextType, Input.InputType>(({ input }) => Input.Input(input)),
    RestoreESCKey: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.RestoreESCKey(input)),
  },
  actions: {
    /// Execute `Actions`
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YAZUqHcgOmQHUBlMVMcgFx1LwBhdMQgBiAHIBRABoAVANoAGALqJQAB1K4+A9SAAeiAEwAWY4wCsATgAc1gMzXT1gOxLnDgGwAaEAE9EV1cLJVsvS3cnY1dbMIBfeL80LFwCEgoqWnomVg4uXn4hEXEAJSk5UoBNZTUkEC0dIv0jBFtTRgclUy92pSUzLwBGS1s-QIQvY2tGM2NjIdtLU1t3S2NE5IxsfCIySlgaOgZmdk5uXWLRMSlS0oB5Utr9RpxLlpNzKztHZzcPUzecaIWxDTrzaxDBztIamSzeVybEApHbpfZZY5MAAiYAAbgwwIJMNwANawYTXaTyZ71V7veqtSyjRhKEZeJSuKYOVwOUxDYGTYy2RjWUZ2VbWLycplIlFpPaZQ7ZE44-GUImk8klMTlSo1VQvbRvZoMxBM4WsyzsznGbm8-kBRDQ4WuUVW0HhW1TWXbeUZA5HHKMVUEjXkMkU8S3B5PA20o300CM5mW61cnl8gWumbWMLtJbGSxKbxDH2pXb+jFBlKwTAV9EQACuxEJ2qpijjmgTJqTiFzlk6DiHxi87LhkrGjoQTJmrPMkJ5o36DjLqIVAeVuQwtfrmSbLcjOoq1RpXaaelNCH7g+Ho+6Nl6AqLM2MrLiji8zjmq796KVmOYbc6zRPdm1ba5o0eU8Gm7C9eyvJQByHW8xwfScJgiLxGFiIYzFcUxEKLIZrB-XcNwAlseGIfwxAgAQwEYfBcVIEkGJbWAeFIFspDYQQAGkwH8aC6R7Qw+0Qm8HBHVCJwFeYB1FUxzBiSEpm6UiQPIoNKOosQwGIMhiEYDQMB4AAzLiAFtGHYzjuN4gShM7GDzzwD4EFw-CRWmXpImfGIBScJRZmsaYmRGLooSGREkmRX0yKrE59MMo89WE2C3MvKEvAcRhouI4tFgiFZAoIxgVm6EJYlHblSyRPBSAgOB9DlBL-xyQ1XPcgBaB0Jm6rD+n6Yj1gcSwCumDT10S3IzgKS5I06404LEhBTFcLNpnKtxzA5VZgicKbK3alU8VDYlwy1UQlsTVaxo6VSpn7PkVj6oJmStSURjwuIeiOv9AxOGtgOm-dwIgG7RNaKVguQ6ZXEWPbYgFYYByU18Qk-WxbBiSx-sVQGmB0iYz2WzL4KGIYJNzKZ1r5KrosCpkWUiaYFnG0VovxrSkoMrjIZW1pYXaPLhjpqVVmIwLgmwkIhi8HpHGHP7YtazSZsYWBG3IAMBfJ1bKeppRafw6KYkZqcmVcEUpIWHlcOcYtEkSIA */
  id: "FlahsingProcessLogic",
  context: Context.Context,
  invoke: {
    input: ({ event }) => {
      if (event.type === "xstate.init") {
        return event.input;
      }

      throw new Error("Unexpected event type");
    },
    onError: {
      target: ".FWSelectionCard",
    },
    onDone: {
      target: ".FWSelectionCard",
      actions: assign(({ event }) => event.output),
    },
    src: "onInit",
  },
  initial: "FWSelectionCard",
  states: {
    FWSelectionCard: {
      id: "FWSelectionCard",
      entry: [
        () => {
          // This will error at .flag
          log.info("First Block");
        },
        assign({ Block: 1 }),
      ],
      on: {
        "next-event": {
          target: "DeviceChecksCard",
          actions: assign(({ event }) => ({
            firmwareList: event.firmwareList,
            firmwares: event.firmwares,
            device: event.device,
            isUpdated: event.isUpdated,
            isBeta: event.isBeta,
          })),
        },
        "retry-event": { target: "FWSelectionCard", actions: assign({ Block: () => 0 }) },
        "error-event": { target: "error", actions: assign({ error: ({ event }) => event.error }) },
      },
    },
    DeviceChecksCard: {
      id: "DeviceChecksCard",
      entry: [
        () => {
          // This will error at .flag
          log.info("Second Block");
        },
        assign({ Block: () => 2 }),
      ],
      on: {
        "next-event": {
          target: "FlashingProcedureCard",
          actions: assign(({ event }) => ({
            backup: event.backup,
            sideLeftOk: event.sideLeftOk,
            sideLeftBL: event.sideLeftBL,
            sideRightOK: event.sideRightOK,
            sideRightBL: event.sideRightBL,
            RaiseBrightness: event.RaiseBrightness,
          })),
        },
        "retry-event": {
          actions: assign(({ event }) => ({
            backup: event.backup,
          })),
          target: "retry",
        },
        "error-event": { target: "error", actions: [assign({ error: ({ event }) => event.error })] },
      },
    },
    FlashingProcedureCard: {
      id: "FlashingProcedureCard",
      entry: [
        () => {
          // This will error at .flag
          log.info("Third Block");
        },
        assign({ Block: () => 3 }),
      ],
      on: {
        "next-event": ["success"],
        "retry-event": ["retry"],
        "error-event": { target: "error", actions: [assign({ error: ({ event }) => event.error })] },
      },
    },
    retry: {
      entry: [
        () => {
          log.info("Retry Card entry");
        },
      ],
      invoke: {
        src: "RestoreESCKey",
        input: ({ context, event }) => {
          if (event.type === "next-event" || event.type === "retry-event") {
            return context;
          }

          log.info("Unexpected event type", event.type);
          throw new Error("Unexpected event type");
        },
        onDone: {
          target: "FWSelectionCard",
          actions: [assign({ Block: () => 0 })],
        },
        onError: {
          target: "error",
          actions: [assign({ error: (context, event) => event })],
        },
      },
    },
    error: {
      id: "error",
      entry: [
        () => {
          log.info("Error Card entry");
        },
        assign({ Block: () => -1 }),
      ],
      on: {
        "retry-event": ["retry"],
      },
    },
    success: { type: "final" },
  },
});

export default FlashManager;

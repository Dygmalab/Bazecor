import { createMachine, assign, fromPromise } from "xstate";
import log from "electron-log/renderer";
import { DeviceTools } from "@Renderer/DeviceContext";
import Focus from "../../../api/focus";

interface MainProcessSMType {
  Block: number;
  deviceState: any;
  backup?: any;
  error: unknown;
  errorCause: unknown;
  firmwareList: any;
  firmwares: any;
  device: any;
  isUpdated: any;
  isBeta: any;
}

const RestoreESCKey = async (context: MainProcessSMType) => {
  // log.info("Going to restore topmost left key", context.backup, context.deviceState);
  try {
    if (context.backup === undefined || context.deviceState?.currentDevice === undefined) return;
    const { currentDevice } = context.deviceState;
    // log.info("Checking connected status: ", currentDevice.isClosed);
    if (currentDevice.isClosed) {
      const focus = Focus.getInstance();
      // log.info("Checking focus status: ", focus.closed);
      await focus.close();
      await DeviceTools.connect(currentDevice);
    }
    const keymap = context.backup.backup.find((c: { command: string }) => c.command === "keymap.custom").data;
    await currentDevice.noCacheCommand("led.mode 0");
    await currentDevice.noCacheCommand("keymap.custom", keymap);
  } catch (error) {
    log.warn("error when restoring Backup of the device after error");
    log.error(error);
    throw new Error(error);
  }
};

const MainProcessSM = createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YAZUqHcgOmQHUBlMVMcgFx1LwBhdMQgBiAHIBRABoAVANoAGALqJQAB1K4+A9SAAeiAEwAWY4wCsATgAc1gMzXT1gOxLnDgGwAaEAE9EV1cLJVsvS3cnY1dbMIBfeL80LFwCEgoqWnomVg4uXn4hEXEAJSk5UoBNZTUkEC0dIv0jBFtTRgclUy92pSUzLwBGS1s-QIQvY2tGM2NjIdtLU1t3S2NE5IxsfCIySlgaOgZmdk5uXWLRMSlS0oB5Utr9RpxLlpNzKztHZzcPUzecaIWxDTrzaxDBztIamSzeVybEApHbpfZZY5MAAiYAAbgwwIJMNwANawYTXaTyZ71V7veqtSyjRhKEZeJSuKYOVwOUxDYGTYy2RjWUZ2VbWLycplIlFpPaZQ7ZE44-GUImk8klMTlSo1VQvbRvZoMxBM4WsyzsznGbm8-kBRDQ4WuUVW0HhW1TWXbeUZA5HHKMVUEjXkMkU8S3B5PA20o300CM5mW61cnl8gWumbWMLtJbGSxKbxDH2pXb+jFBlKwTAV9EQACuxEJ2qpijjmgTJqTiFzlk6DiHxi87LhkrGjoQTJmrPMkJ5o36DjLqIVAeVuQwtfrmSbLcjOoq1RpXaaelNCH7g+Ho+6Nl6AqLM2MrLiji8zjmq796KVmOYbc6zRPdm1ba5o0eU8Gm7C9eyvJQByHW8xwfScJgiLxGFiIYzFcUxEKLIZrB-XcNwAlseGIfwxAgAQwEYfBcVIEkGJbWAeFIFspDYQQAGkwH8aC6R7Qw+0Qm8HBHVCJwFeYB1FUxzBiSEpm6UiQPIoNKOosQwGIMhiEYDQMB4AAzLiAFtGHYzjuN4gShM7GDzzwD4EFw-CRWmXpImfGIBScJRZmsaYmRGLooSGREkmRX0yKrE59MMo89WE2C3MvKEvAcRhouI4tFgiFZAoIxgVm6EJYlHblSyRPBSAgOB9DlBL-xyQ1XPcgBaB0Jm6rD+n6Yj1gcSwCumDT10S3IzgKS5I06404LEhBTFcLNpnKtxzA5VZgicKbK3alU8VDYlwy1UQlsTVaxo6VSpn7PkVj6oJmStSURjwuIeiOv9AxOGtgOm-dwIgG7RNaKVguQ6ZXEWPbYgFYYByU18Qk-WxbBiSx-sVQGmB0iYz2WzL4KGIYJNzKZ1r5KrosCpkWUiaYFnG0VovxrSkoMrjIZW1pYXaPLhjpqVVmIwLgmwkIhi8HpHGHP7YtazSZsYWBG3IAMBfJ1bKeppRafw6KYkZqcmVcEUpIWHlcOcYtEkSIA */
  id: "FlahsingProcessLogic",
  initial: "FWSelectionCard",
  context: {
    Block: 0,
    deviceState: {},
    error: undefined,
    errorCause: undefined,
    firmwareList: undefined,
    firmwares: undefined,
    device: undefined,
    isUpdated: undefined,
    isBeta: undefined,
  } as MainProcessSMType,
  states: {
    FWSelectionCard: {
      id: "FWSelectionCard",
      entry: [
        () => {
          // This will error at .flag
          log.info("First Block");
        },
        assign({ Block: () => 1 }),
      ],
      on: {
        NEXT: {
          target: "DeviceChecksCard",
          actions: assign(({ event }) => {
            log.info(event);
            return {
              firmwareList: event.output.firmwareList,
              firmwares: event.output.firmwares,
              device: event.output.device,
              isUpdated: event.output.isUpdated,
              isBeta: event.output.isBeta,
            };
          }),
        },
        RETRY: { target: "FWSelectionCard", actions: assign({ Block: () => 0 }) },
        ERROR: { target: "error", actions: assign({ errorCause: ({ event }) => event.output }) },
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
        NEXT: {
          target: "FlashingProcedureCard",
          actions: assign(({ event }) => ({
            backup: event.output.backup,
            sideLeftOk: event.output.sideLeftOk,
            sideLeftBL: event.output.sideLeftBL,
            sideRightOK: event.output.sideRightOK,
            sideRightBL: event.output.sideRightBL,
            RaiseBrightness: event.output.RaiseBrightness,
          })),
        },
        RETRY: {
          actions: assign(({ event }) => ({
            backup: event.output.backup,
          })),
          target: "retry",
        },
        ERROR: { target: "error", actions: [assign({ errorCause: ({ event }) => event.output })] },
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
        NEXT: ["success"],
        RETRY: ["retry"],
        ERROR: { target: "error", actions: [assign({ errorCause: ({ event }) => event.output })] },
      },
    },
    retry: {
      id: "retry",
      entry: [
        () => {
          log.info("Retry Card entry");
        },
      ],
      invoke: {
        id: "restoreESCKey",
        src: fromPromise(({ input }) => RestoreESCKey(input.context)),
        input: ({ context }) => ({ context }),
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
        RETRY: ["retry"],
      },
    },
    success: { type: "final" },
  },
});

export default MainProcessSM;

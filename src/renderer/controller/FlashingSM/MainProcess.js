import { createMachine, assign } from "xstate";

const MainProcessSM = createMachine({
  predictableActionArguments: true,
  id: "FlahsingProcessLogic",
  initial: "FWSelectionCard",
  context: {
    Block: 0,
  },
  states: {
    FWSelectionCard: {
      id: "FWSelectionCard",
      entry: [
        () => {
          // This will error at .flag
          console.log("First Block");
        },
        assign({ Block: () => 1 }),
      ],
      on: {
        NEXT: {
          target: "DeviceChecksCard",
          actions: assign((context, event) => ({
            firmwareList: event.data.firmwareList,
            firmwares: event.data.firmwares,
            device: event.data.device,
            isUpdated: event.data.isUpdated,
            isBeta: event.data.isBeta,
          })),
        },
        RETRY: { target: "FWSelectionCard", actions: assign({ Block: (context, event) => (context.Block = 0) }) },
        ERROR: { target: "error", actions: [assign({ errorCause: (context, event) => event.data })] },
      },
    },
    DeviceChecksCard: {
      id: "DeviceChecksCard",
      entry: [
        () => {
          // This will error at .flag
          console.log("Second Block");
        },
        assign({ Block: () => 2 }),
      ],
      on: {
        NEXT: {
          target: "FlashingProcedureCard",
          actions: assign((context, event) => ({
            backup: event.data.backup,
            sideLeftOk: event.data.sideLeftOk,
            sideLeftBL: event.data.sideLeftBL,
            sideRightOK: event.data.sideRightOK,
            sideRightBL: event.data.sideRightBL,
            RaiseBrightness: event.data.RaiseBrightness,
          })),
        },
        RETRY: ["FWSelectionCard", assign({ Block: (context, event) => (context.Block = 0) })],
        ERROR: { target: "error", actions: [assign({ errorCause: (context, event) => event.data })] },
      },
    },
    FlashingProcedureCard: {
      id: "FlashingProcedureCard",
      entry: [
        () => {
          // This will error at .flag
          console.log("Third Block");
        },
        assign({ Block: () => 3 }),
      ],
      on: {
        NEXT: ["success"],
        RETRY: ["FWSelectionCard", assign({ Block: (context, event) => (context.Block = 0) })],
        ERROR: { target: "error", actions: [assign({ errorCause: (context, event) => event.data })] },
      },
    },
    error: {
      id: "error",
      entry: [
        () => {
          console.log("Error Card entry");
        },
        assign({ Block: () => -1 }),
      ],
      on: {
        RETRY: ["FWSelectionCard", assign({ Block: (context, event) => (context.Block = 0) })],
      },
    },
    success: { type: "final" },
  },
});

export default MainProcessSM;

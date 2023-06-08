import { createMachine, assign, raise } from "xstate";

const MainProcessSM = createMachine({
  predictableActionArguments: true,
  id: "FlahsingProcessLogic",
  initial: "FWSelectionCard",
  context: {
    Block: 0
  },
  states: {
    FWSelectionCard: {
      id: "FWSelectionCard",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("First Block");
        },
        assign({ Block: (context, event) => 1 })
      ],
      on: {
        NEXT: {
          target: "DeviceChecksCard",
          actions: assign((context, event) => {
            return {
              firmwareList: event.data.firmwareList,
              firmwares: event.data.firmwares,
              device: event.data.device,
              isUpdated: event.data.isUpdated,
              isBeta: event.data.isBeta
            };
          })
        },
        RETRY: { target: "FWSelectionCard", actions: assign({ Block: (context, event) => (context.Block = 0) }) }
      }
    },
    DeviceChecksCard: {
      id: "DeviceChecksCard",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Second Block");
        },
        assign({ Block: (context, event) => 2 })
      ],
      on: {
        NEXT: {
          target: "FlashingProcedureCard",
          actions: assign((context, event) => {
            return {
              backup: event.data.backup,
              sideLeftOk: event.data.sideLeftOk,
              sideLeftBL: event.data.sideLeftBL,
              sideRightOK: event.data.sideRightOK,
              sideRightBL: event.data.sideRightBL,
              RaiseBrightness: event.data.RaiseBrightness
            };
          })
        },
        RETRY: ["FWSelectionCard", assign({ Block: (context, event) => (context.Block = 0) })]
      }
    },
    FlashingProcedureCard: {
      id: "FlashingProcedureCard",
      entry: [
        (context, event) => {
          // This will error at .flag
          console.log("Third Block");
        },
        assign({ Block: (context, event) => 3 })
      ],
      on: {
        NEXT: ["success"],
        RETRY: ["FWSelectionCard", assign({ Block: (context, event) => (context.Block = 0) })]
      }
    },
    success: { type: "final" }
  }
});

export default MainProcessSM;

import log from "electron-log/renderer";
import { setup, assign, raise, fromPromise } from "xstate";

import { BackupType } from "@Renderer/types/backups";

import * as Actions from "./actions";
import * as Context from "./context";
import type * as Events from "./events";
import * as Input from "./input";

// eslint-disable-next-line no-eval

const DeviceChecks = setup({
  types: {
    input: {} as Input.InputType,
    context: {} as Context.ContextType,
    events: {} as Events.Events,
  },
  actors: {
    /// Create actors using `fromPromise`
    onInit: fromPromise<Context.ContextType, Input.InputType>(({ input }) => Input.Input(input)),
    keyboardSetup: fromPromise<string | undefined, Context.ContextType>(({ input }) => Actions.keyboardSetup(input)),
    GetLSideData: fromPromise<{ leftSideConn: boolean; leftSideBoot: boolean }, Context.ContextType>(({ input }) =>
      Actions.GetLSideData(input),
    ),
    GetRSideData: fromPromise<{ rightSideConn: boolean; rightSideBoot: boolean }, Context.ContextType>(({ input }) =>
      Actions.GetRSideData(input),
    ),
    CreateBackup: fromPromise<BackupType | undefined, Context.ContextType>(({ input }) => Actions.CreateBackup(input)),
  },
  actions: {
    /// Execute `Actions`
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QBEwDcCWBjMBhAFmFgNawDEEA9gHZgB0G1alx9qmOBRpCjzWAQwAuGGgG0ADAF1JUxKAAOlWBhE15IAB6IALACYANCACeiAIxmJAZjpW9enQHY7zgKx6AHAF8vR9tjxCEnIwACdQylC6BQAbYQAzSIBbOn9OIJ4+SkE1allZDSUVXI1tBH0jUwRLV0c6CQA2Bo8dCzMdDw89Hz90AK5gugAFMPiAZTAhAFcFChp6LNZUvvTuWGHRiemFXiZs4VE86QKkECLVQ9LzAE4POkczJvtaqw9Ha4qTRGvXumvHCTXCRtIESN49EBpQJrDahcaTGZkMIRKKxBLJZYcaGDEZwrYzXb8A7iY7SQrKC7qU5lHSuHR0Dp6Rx6CSuCQ6BpWQGuSrmdr0nS0hxWCyuVxWVwQqEDUiw+HbMgAKhOigpJWpujpDK6zNZ7M53N5CDsDQZj2sH0cDQsgKlK2xstx8sRyrMclO53VoBpWsZurZHK51x5XwQrjMrjobNqTNeXKstLtWJl6yd+Nmyr07tVxUuGvKvp1LIDBuDRreEjoDlcTVejTsOiT-Qy6wAMmMMBAHXNaAw9ktpS26O3Ow7CftcvkyR61XnvYg3mYo5z-mYda5biGqg1-lGRTprsGIw0HN5fJD7Snhx2uzKkeFItE4kJEqEUoOYSPbxlxzlDlPszOWcqXnBBF2XKxV3XTdy06e4dxrflmWDRwm1WQYACUb27Khe0WNhLyHLDRxlX9iSOGRpxzSlqCuapPD0OhOisFiJAkAFhQ8I1OXpMwWPFDpmKsTk0IddZiO-bh7xRJ90TfTFmxhCSxyyP8SUowDPTnLRzAYpiPBYrl2IkTijUccN7j0MxmQaZkOjFbpzw-QY0AEGJO2EMAxiEYQpnIXCFn7AjkyHVz3IgTzvN82AyMnUlNOA2j83aa4lzpKydEaDwBPMo0zCZJi2Vsjxa08SxrlEq8wo8oQvJ86YQgfVFn1fd9CJhaqItqqKGti-94vJXMQJ06oHkjAzrAsTpXDebKjQlJcStS65PEcDxrBFSrQrcmq6uisgFFCOBYEgABadAwGoIQVSAoaktA6yIyY+Mpuy2at3MDc6EsDxgyBfK+N+xsnPalydq6vaGrIAQpiEShDuOs6Lqum6tOGspHvGl61zetaPoQPRxVsZoEysRwrQjPQGmB3oQo68HIvqvyyCOoRQmMc60Eu66qNumi6L4ux9LsdjXgaOkuNDFl6XeBMGmBRDxcTEG6bB8LGf2wRqBwGJOe51HEoFsbnsmnGZrx+aTLoa03hJplASsLaYXiAQMBiKYjpZyZ2b1lHebR+6RrXMmo2y-5-kBJwrDykz6RF6wwUyxoDx8c9qEoLt4FOZzSEG-n81OhojULp2cU2BEFDzr0g5aUOgXJ5pOTsQxQx+upOiZNbzXFLpS9lL8HSr7SyiV+5zPeAFgXr8sha5R4WRPWz7AaPvxOwmUh-R8xGkjQEd1Zf50p0bjgyrcVHA5QM8cc2nFLV3aer8zfA4xpw6laWk+I6B5-iL0N43qCVTKYoRQmWpivFWd9ZQuzdh7MAz8BaHkYhYZkb1LD5QcLBek4thLZUBC0H4Z5b7oVlLAKYWAcCwCztRauGMkHfWsp4Ga6D7DHyltcU0St2g7itK0awqcvBAA */
  id: "DeviceChecks",
  invoke: {
    input: ({ event }) => {
      if (event.type === "xstate.init") {
        return event.input;
      }

      throw new Error("Unexpected event type");
    },
    onError: {
      target: ".PerfSetup",
    },
    onDone: {
      target: ".PerfSetup",
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
    PerfSetup: {
      entry: [
        () => {
          log.info("Performing setup");
        },
      ],
      invoke: {
        src: "keyboardSetup",
        input: ({ context }) => context,
        onDone: {
          actions: [
            assign({
              RaiseBrightness: ({ event }) => event.output,
            }),
            assign({
              stateblock: () => 1,
            }),
            raise({ type: "internal" }),
          ],
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "*": [
          {
            target: "validateStatus",
            guard: ({ context }) => !context.device.bootloader === true && context.device.info.product === "Raise",
          },
          { target: "success", guard: ({ context }) => context.device.bootloader === true },
          {
            target: "LSideCheck",
            guard: ({ context }) => !context.device.bootloader === true && context.device.info.product !== "Raise",
          },
        ],
      },
    },
    LSideCheck: {
      entry: [
        () => {
          log.info("Checking left side");
        },
      ],
      invoke: {
        src: "GetLSideData",
        input: ({ context }) => context,
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
        actions: [assign({ error: event => event as any })],
      },
    },
    RSideCheck: {
      entry: [
        () => {
          log.info("Checking right side");
        },
      ],
      invoke: {
        src: "GetRSideData",
        input: ({ context }) => context,
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
        actions: [assign({ error: event => event as any })],
      },
    },
    validateStatus: {
      entry: [
        () => {
          log.info("Validating status, waiting for UPDATE");
        },
      ],
      invoke: {
        src: "CreateBackup",
        input: ({ context }) => context,
        onDone: {
          actions: [
            assign(({ event }) => {
              log.info(event);
              return {
                backup: event.output,
              };
            }),
            assign({
              stateblock: ({ context }) => (context.device.info.product === "Raise" ? 0 : 5),
            }),
            () => {
              log.info("Backup ready");
            },
            raise({ type: "autopressed-event" }),
          ],
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
      on: {
        "pressed-event": {
          target: "success",
          guard: ({ context }) => context.sideLeftOk === true && context.sideRightOK === true && context.backup !== undefined,
          actions: [
            assign({
              stateblock: () => 6,
            }),
          ],
        },
        "autopressed-event": {
          target: "success",
          guard: ({ context }) => context.device.info.product === "Raise" && context.backup !== undefined,
        },
        "retry-event": {
          target: "PerfSetup",
        },
        "cancel-event": { target: "success" },
      },
    },
    failure: {
      on: {
        "retry-event": "PerfSetup",
      },
    },
    success: {
      type: "final",
    },
  },
});

export default DeviceChecks;

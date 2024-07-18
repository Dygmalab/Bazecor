import { setup, assign, fromPromise } from "xstate";
import log from "electron-log/renderer";

import * as Actions from "./actions";
import * as Context from "./context";
import type * as Events from "./events";
import * as Input from "./input";

const FirmwareSelection = setup({
  types: {
    input: {} as Input.InputType,
    context: {} as Context.ContextType,
    events: {} as Events.Events,
  },
  actors: {
    /// Create actors using `fromPromise`
    onInit: fromPromise<Context.ContextType, Input.InputType>(({ input }) => Input.Input(input)),
    FocusAPIRead: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.FocusAPIRead(input)),
    GitHubRead: fromPromise<Context.ContextType, Context.ContextType>(({ input }) => Actions.GitHubRead(input)),
    downloadFirmware: fromPromise<{ fw: Array<string>; fwSides: Uint8Array }, Context.ContextType>(({ input }) =>
      Actions.downloadFirmware(
        input.typeSelected,
        input.device.info,
        input.firmwareList,
        input.selectedFirmware,
        input.customFirmwareFolder,
      ),
    ),
  },
  actions: {
    /// Execute `Actions`
  },
}).createMachine({
  /** @xstate-layout N4IgpgJg5mDOIC5QDEA2BDAFrAlgOygAUAnAewGM5YA6ZAdQGUxUxyAXHUvagGVPQgARMADcclQejboAxBC5hq+EaQDWi5BQCusAIKEAkgCUwAgNoAGALqJQAB1K4OXWyAAeiAEwA2C9QsAHACsAJxBAIyengGeACwhAMwA7AA0IACeiN7eSdThSSFJngkh4SGeIRbeAL7VaWhYuAQkFFS0jMysztx8AsJiElKyYMRkxNR2GGwAZqTEALa02nqGJubWrg5OnHiuHgg+foGhEVEx8clpmQgJ4QHU3kHePrHZnvlJj7X1GNj4RGRKLAaPQmCx2DtePwIABxHBsTBaABG9DkCiUeBU6mocLYAAlkZJpJYbEgQFt4Ts9ll3tRgjkgkkAiUnt5wlcssFqEkgiVYoykrEkuFIt8QA0-s1AW1QZ0IVwoQJcYiUXQZCMxhMprMFjj4QSkUT0CTNo5KS4yftnuE6U8eUyWdl2RlEK8-N5mb4Et4ShZ3iExRKmgDWsD2mCupDYHK2MgcAsAO7oYhgGQAOQAogANAAqJrJFO61IQIW8IQeYU8gtingigWd1ySJW53li3vCQo7FiCgd+wZaQJBHXB3Wo0ZHccTydTAGE8bo0zCM-R8-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-opebU6AsVPTSYTaUiu10U7nyNeV9-Jymsj9PkbyRtj2iNwQjW6G9rPvXKk82zjnbhMJCNrG0flbxRxDi22+XbRV+YzrwLOCNgtVwTgg4KFUdkxEzYgSo7pGHLJiEEQIRaUv-rSxdTO+Mstexrb7EoNomEJzbAeeB0XQkJ3uEyd4hUfSkVCL5nB6XX79zHpPaes9ss7zZGOyKmyyzNPpqWZDFxgjbkPTUMzoL6uXXwYQr+YASFSB0ItxAkXcj5RIlUYOxXuHXhbIChjTI-SYcreZ47CSTKcbADdg4nwbRClWwUdbIUSrlF1oxqs3l0W7ePeS+JIPC3MnAe8Vk3ksJ6zWui3WzwPSFG8naZLWGJXiv-dYtgtjyAY95DacoUdsh45k8OlyHYdGFBqWpzSNZUc0-M90wZ2Ss4Y+wuA-k14tmlO9Ni+43kyblB9DWYowuoXU6hTCi5wOWvrpKUDfw-zGQPirFHcOTDymkT2+8Io9otfJP-ZKmlZB+2KpQvyYom0ihx1CExz5Ud3PbiBsUeIgpnc9PMxqOYIOIe8pbSHWOC18IihxSFYoV5qwPgfMeyNVqY3rwT5w1ZzIEHbgqoEtku8-THsU4OEHjIFLvGbD4UsS1QgVAO7UIAA */
  id: "FlahsingProcess",
  context: Context.Context,
  invoke: {
    input: ({ event }) => {
      if (event.type === "xstate.init") {
        return event.input;
      }

      throw new Error("Unexpected event type");
    },
    onError: {
      target: ".LoadDeviceData",
    },
    onDone: {
      target: ".LoadDeviceData",
      actions: assign(({ event }) => event.output),
    },
    src: "onInit",
  },
  initial: "wait",
  states: {
    wait: {},
    LoadDeviceData: {
      id: "LoadDeviceData",
      entry: [
        () => {
          log.info("Getting device info");
        },
        assign({
          stateblock: () => 1,
        }),
      ],
      invoke: {
        src: "FocusAPIRead",
        input: ({ context }) => context,
        onDone: {
          target: "LoadGithubFW",
          actions: [
            assign(({ event }) => event.output),
            ({ context }) => {
              log.info("Success: ", context.device);
            },
          ],
        },
        onError: {
          target: "failure",
          actions: [
            () => {
              log.warn("error");
            },
            assign({ error: event => event as any }),
          ],
        },
      },
    },
    LoadGithubFW: {
      id: "LoadGitHubData",
      entry: [
        () => {
          log.info("Loading Github data!");
        },
        assign({
          stateblock: () => 2,
        }),
      ],
      invoke: {
        src: "GitHubRead",
        input: ({ context }) => context,
        onDone: {
          target: "selectFirmware",
          actions: [
            assign(({ event }) => ({
              firmwareList: event.output.firmwareList,
              isUpdated: event.output.isUpdated,
              isBeta: event.output.isBeta,
            })),
          ],
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
    },
    selectFirmware: {
      id: "selectFirmware",
      entry: [
        () => {
          log.info("select Firmware!");
        },
        assign({
          stateblock: () => 3,
        }),
      ],
      on: {
        "next-event": ["loadingFWFiles"],
        "changeFW-event": {
          actions: [
            assign(({ event }) => ({
              selectedFirmware: event.selected,
              typeSelected: "default",
            })),
          ],
        },
        "customFW-event": {
          actions: [
            assign(({ event }) => ({
              customFirmwareFolder: event.selected,
              typeSelected: "custom",
            })),
          ],
        },
      },
    },
    loadingFWFiles: {
      id: "loadingFWFiles",
      entry: [
        () => {
          log.info("Download Firmware!");
        },
        assign({
          stateblock: () => 4,
        }),
      ],
      invoke: {
        src: "downloadFirmware",
        input: ({ context }) => context,
        onDone: {
          target: "success",
          actions: [assign({ firmwares: ({ event }) => event.output })],
        },
        onError: {
          target: "failure",
          actions: [assign({ error: event => event as any })],
        },
      },
    },
    failure: {
      id: "failure",
      entry: [
        () => {
          log.info("Failed state!");
        },
      ],
      on: {
        "retry-event": {
          target: "LoadDeviceData",
          actions: [
            assign({
              stateblock: () => 0,
            }),
          ],
        },
      },
    },
    success: { type: "final" },
  },
});

export default FirmwareSelection;

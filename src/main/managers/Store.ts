import { StorageType } from "@Renderer/types/store";
import ElectronStore, { Schema } from "electron-store";

// Define your schema per the ajv/JSON spec
// But you also need to create a mirror of that spec in TS
// And use the type here
const schema: Schema<StorageType> = {
  settings: {
    type: "object",
    properties: {
      backupFolder: { type: "string" },
      backupFrequency: { type: "number" },
      language: { type: "string" },
      darkMode: { type: "string" },
      showDefaults: { type: "boolean" },
      isStandardView: { type: "boolean" },
      autoUpdate: { type: "boolean" },
    },
    default: {
      backupFolder: "",
      backupFrequency: 0,
      language: "english",
      darkMode: "system",
      showDefaults: false,
      isStandardView: true,
      autoUpdate: undefined,
    },
    required: ["backupFolder", "language", "darkMode", "showDefaults"],
  },
  neurons: {
    type: "array",
    items: {
      type: "object",
      properties: {
        id: { type: "string" },
        name: { type: "string" },
        layers: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
            },
          },
        },
        macros: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              macro: { type: "string" },
              actions: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    keyCode: {
                      type: ["number", "array"],
                      items: { type: "number" },
                    },
                    id: { type: "number" },
                  },
                },
              },
            },
          },
        },
        superkeys: {
          type: "array",
          items: {
            type: "object",
            properties: {
              id: { type: "number" },
              name: { type: "string" },
              superkey: { type: "string" },
              actions: {
                type: "array",
                // added null for backward compatibility, should be removed in the future
                items: { type: ["number", "null"] },
              },
            },
          },
        },
        device: {
          type: "object",
          properties: {
            info: {
              type: "object",
              properties: {
                vendor: { type: "string" },
                product: { type: "string" },
                keyboardType: { type: "string" },
                displayName: { type: "string" },
                urls: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      url: { type: "string" },
                    },
                  },
                },
              },
            },
            usb: {
              type: "object",
              properties: {
                vendorId: { type: "number" },
                productId: { type: "number" },
              },
            },
            keyboard: {
              type: "object",
              properties: {
                rows: { type: "number" },
                columns: { type: "number" },
              },
            },
            keyboardUnderglow: {
              type: "object",
              properties: {
                rows: { type: "number" },
                columns: { type: "number" },
              },
            },
            RGBWMode: { type: "boolean" },
            components: {
              type: "object",
              properties: {
                keymap: { type: "array" },
              },
            },
            instructions: {
              type: "object",
              properties: {
                en: {
                  type: "object",
                  properties: {
                    updateInstructions: { type: "string" },
                  },
                },
              },
            },
            bootloader: { type: "boolean" },
            path: { type: "string" },
            filePath: { type: "string" },
          },
        },
      },
    },
    default: [],
  },
};

export const STORE_KEYS: { [key: string]: keyof StorageType } = {
  settings: "settings",
  neurons: "neurons",
};

class Store {
  private static instance: ElectronStore<StorageType>;

  private constructor() {
    // this comment is here so TS stays quiet
  }

  public static getStore() {
    if (!Store.instance) {
      Store.instance = new ElectronStore<StorageType>({ schema });
    }
    return Store.instance;
  }
}

export default Store;

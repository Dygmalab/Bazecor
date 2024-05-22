import { State } from "@Renderer/types/devices";
import { ReleaseType } from "@Renderer/types/releases";

export interface ContextType {
  stateblock: number;
  device: {
    info: {
      vendor: string;
      product: string;
      keyboardType: string;
      displayName: string;
    };
    bootloader: boolean;
    version: any;
    chipID: string;
  };
  version: any;
  firmwareList: ReleaseType[];
  firmwares: {
    fw: any;
    fwSides: any;
  };
  typeSelected: string;
  selectedFirmware: number;
  isUpdated: boolean;
  isBeta: boolean;
  allowBeta: boolean;
  deviceState: State | undefined;
  error: unknown;
}

export const Context: ContextType = {
  stateblock: 0,
  device: {
    info: {
      vendor: "",
      product: "",
      keyboardType: "",
      displayName: "",
    },
    bootloader: false,
    version: "",
    chipID: "",
  },
  version: {},
  firmwareList: [],
  firmwares: {
    fw: undefined,
    fwSides: undefined,
  },
  typeSelected: "default",
  selectedFirmware: 0,
  isUpdated: false,
  isBeta: false,
  allowBeta: false,
  deviceState: undefined,
  error: undefined,
};

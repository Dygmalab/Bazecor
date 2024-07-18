import { ReleaseType } from "@Renderer/types/releases";
import { State } from "src/api/comms/Device";
import { ErrorActorEvent } from "xstate";

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
    version: string;
    chipID: string;
  };
  firmwareList: ReleaseType[];
  firmwares: {
    fw: any;
    fwSides: any;
  };
  typeSelected: string;
  selectedFirmware: number;
  customFirmwareFolder: string;
  isUpdated: boolean;
  isBeta: boolean;
  allowBeta: boolean;
  deviceState: State | undefined;
  error: ErrorActorEvent;
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
  firmwareList: [],
  firmwares: {
    fw: undefined,
    fwSides: undefined,
  },
  typeSelected: "default",
  customFirmwareFolder: undefined,
  selectedFirmware: 0,
  isUpdated: false,
  isBeta: false,
  allowBeta: false,
  deviceState: undefined,
  error: undefined,
};

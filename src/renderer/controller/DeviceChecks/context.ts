import { BackupType } from "@Renderer/types/backups";
import { State } from "src/api/comms/Device";

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
  sideLeftOk: boolean;
  sideLeftBL: boolean;
  sideRightOK: boolean;
  sideRightBL: boolean;
  firmwares: {
    fw: any;
    fwSides: any;
  };
  backup: BackupType | undefined;
  deviceState: State | undefined;
  isUpdated: unknown;
  RaiseBrightness: string | undefined;
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
  sideLeftOk: true,
  sideLeftBL: false,
  sideRightOK: true,
  sideRightBL: false,
  firmwares: {
    fw: undefined,
    fwSides: undefined,
  },
  backup: undefined,
  deviceState: undefined,
  isUpdated: undefined,
  RaiseBrightness: undefined,
  error: undefined,
};

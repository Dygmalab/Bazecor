import { State } from "src/api/comms/Device";
import type * as Context from "./context";

export interface InputType {
  readonly device: {
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
  readonly deviceState: State;
  readonly firmwares: {
    fw: any;
    fwSides: any;
  };
}

export const Input = async (input: InputType): Promise<Context.ContextType> => {
  const result: Context.ContextType = {
    stateblock: 0,
    deviceState: input.deviceState,
    device: input.device,
    error: undefined,
    firmwares: input.firmwares,
    isUpdated: false,
    sideLeftOk: false,
    sideLeftBL: false,
    sideRightOK: false,
    sideRightBL: false,
    backup: undefined,
    RaiseBrightness: undefined,
  };

  return result;
};

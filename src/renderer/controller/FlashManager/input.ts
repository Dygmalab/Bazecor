import { State } from "src/api/comms/Device";
import type * as Context from "./context";

export interface InputType {
  readonly Block: number;
  readonly deviceState: State;
}

export const Input = async (input: InputType): Promise<Context.ContextType> => {
  const result: Context.ContextType = {
    Block: input.Block,
    deviceState: input.deviceState,
    error: undefined,
    firmwareList: [],
    firmwares: undefined,
    device: undefined,
    isUpdated: undefined,
    isBeta: undefined,
    sideLeftBL: false,
    sideLeftOk: false,
    sideRightBL: false,
    sideRightOK: false,
    RaiseBrightness: "",
  };

  return result;
};

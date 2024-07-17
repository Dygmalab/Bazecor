import { State } from "src/api/comms/Device";
import type * as Context from "./context";

export interface InputType {
  readonly allowBeta: boolean;
  readonly deviceState: State;
}

export const Input = async (input: InputType): Promise<Context.ContextType> => {
  const result: Context.ContextType = {
    stateblock: 0,
    deviceState: input.deviceState,
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
    error: undefined,
    firmwareList: [],
    firmwares: {
      fw: undefined,
      fwSides: undefined,
    },
    isUpdated: false,
    isBeta: false,
    typeSelected: "default",
    customFirmwareFolder: undefined,
    selectedFirmware: 0,
    allowBeta: input.allowBeta,
  };

  return result;
};

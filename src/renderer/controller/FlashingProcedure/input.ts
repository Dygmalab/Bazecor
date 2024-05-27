import { DygmaDeviceType, State } from "@Renderer/types/devices";
import { BackupType } from "@Renderer/types/backups";
import type * as Context from "./context";

export interface InputType {
  readonly deviceState: State;
  readonly device: DygmaDeviceType;
  readonly firmwares: {
    fw: any;
    fwSides: any;
  };
  readonly backup: BackupType;
  readonly isUpdated: boolean;
  readonly RaiseBrightness: string;
  readonly sideLeftOk: boolean;
  readonly sideLeftBL: boolean;
  readonly sideRightOK: boolean;
  readonly sideRightBL: boolean;
}

export const Input = async (input: InputType): Promise<Context.ContextType> => {
  const result: Context.ContextType = {
    stateblock: 0,
    deviceState: input.deviceState,
    device: input.device,
    originalDevice: input.deviceState.currentDevice,
    error: undefined,
    firmwares: input.firmwares,
    backup: input.backup,
    isUpdated: input.isUpdated,
    RaiseBrightness: input.RaiseBrightness,
    sideLeftOk: input.sideLeftOk,
    sideLeftBL: input.sideLeftBL,
    sideRightOK: input.sideRightOK,
    sideRightBL: input.sideRightBL,
    loadedComms: false,
    globalProgress: 0,
    leftProgress: 0,
    rightProgress: 0,
    resetProgress: 0,
    neuronProgress: 0,
    restoreProgress: 0,
    retriesRight: 0,
    retriesLeft: 0,
    retriesNeuron: 0,
    retriesDefyWired: 0,
    restoreResult: undefined,
    rightResult: undefined,
    leftResult: undefined,
    resetResult: undefined,
    flashResult: undefined,
    DefyVariant: undefined,
    flashRaise: undefined,
    flashDefyWireless: undefined,
    flashSides: undefined,
    bootloader: undefined,
    comPath: undefined,
  };

  return result;
};

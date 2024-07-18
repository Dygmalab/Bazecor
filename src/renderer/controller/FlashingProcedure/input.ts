import { BackupType } from "@Renderer/types/backups";
import { State } from "src/api/comms/Device";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
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
  readonly stateUpdate: (data: {
    type: string;
    data: {
      globalProgress: number;
      leftProgress: number;
      rightProgress: number;
      resetProgress: number;
      neuronProgress: number;
      restoreProgress: number;
    };
  }) => void;
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
    loadedComms: true,
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
    erasePairings: true,
    restoreResult: undefined,
    rightResult: undefined,
    leftResult: undefined,
    resetResult: undefined,
    flashResult: undefined,
    DeviceVariant: undefined,
    flashRaise: undefined,
    flashDefyWireless: undefined,
    flashSides: undefined,
    bootloader: undefined,
    comPath: undefined,
    stateUpdate: input.stateUpdate,
  };

  return result;
};

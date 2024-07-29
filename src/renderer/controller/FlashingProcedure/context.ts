import { BackupType } from "@Renderer/types/backups";
import Device, { State } from "src/api/comms/Device";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { FlashRaise, FlashDefyWireless } from "../../../api/flash";
import SideFlaser from "../../../api/flash/defyFlasher/sideFlasher";

export interface ContextType {
  [x: string]: any;
  deviceState: State | undefined;
  loadedComms: boolean;
  stateblock: number;
  erasePairings: boolean;
  globalProgress: number;
  leftProgress: number;
  rightProgress: number;
  resetProgress: number;
  neuronProgress: number;
  restoreProgress: number;
  restoreResult: boolean | undefined;
  retriesRight: number;
  retriesLeft: number;
  retriesNeuron: number;
  retriesDefyWired: number;
  sideLeftOk: boolean | undefined;
  sideLeftBL: boolean | undefined;
  isUpdated: boolean | undefined;
  sideRightOK: boolean | undefined;
  sideRightBL: boolean | undefined;
  rightResult: boolean | undefined;
  leftResult: boolean | undefined;
  resetResult: boolean | undefined;
  flashResult: boolean | undefined;
  firmwares:
    | {
        fw: any;
        fwSides: any;
      }
    | undefined;
  device: DygmaDeviceType | undefined;
  originalDevice: Device | undefined;
  backup: BackupType | undefined;
  error: unknown;
  DeviceVariant: string | undefined;
  flashRaise: FlashRaise | undefined;
  flashDefyWireless: FlashDefyWireless | undefined;
  RaiseBrightness: string | undefined;
  flashSides: SideFlaser | undefined;
  bootloader: boolean | undefined;
  comPath: string | undefined;
  stateUpdate: (data: {
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

export const Context: ContextType = {
  deviceState: undefined,
  loadedComms: false,
  stateblock: 1,
  erasePairings: true,
  globalProgress: 0,
  leftProgress: 0,
  rightProgress: 0,
  resetProgress: 0,
  neuronProgress: 0,
  restoreProgress: 0,
  restoreResult: undefined,
  retriesRight: 0,
  retriesLeft: 0,
  retriesNeuron: 0,
  retriesDefyWired: 0,
  RaiseBrightness: undefined,
  isUpdated: undefined,
  sideLeftBL: undefined,
  sideLeftOk: undefined,
  sideRightBL: undefined,
  sideRightOK: undefined,
  rightResult: undefined,
  leftResult: undefined,
  resetResult: undefined,
  flashResult: undefined,
  firmwares: undefined,
  device: undefined,
  originalDevice: undefined,
  backup: undefined,
  error: undefined,
  DeviceVariant: undefined,
  flashRaise: undefined,
  flashDefyWireless: undefined,
  flashSides: undefined,
  bootloader: undefined,
  comPath: undefined,
  stateUpdate: undefined,
};

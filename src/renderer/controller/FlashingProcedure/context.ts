import { State } from "@Renderer/types/devices";
import { BackupType } from "@Renderer/types/backups";
import { FlashRaise, FlashDefyWireless } from "../../../api/flash";
import SideFlaser from "../../../api/flash/defyFlasher/sideFlasher";

export interface ContextType {
  deviceState: State;
  loadedComms: boolean;
  stateblock: number;
  globalProgress: number;
  leftProgress: number;
  rightProgress: number;
  resetProgress: number;
  neuronProgress: number;
  restoreProgress: number;
  restoreResult: number | undefined;
  retriesRight: number;
  retriesLeft: number;
  retriesNeuron: number;
  retriesDefyWired: number;
  sideLeftBL: boolean | undefined;
  rightResult: any;
  leftResult: any;
  resetResult: any;
  flashResult: any;
  firmwares: any;
  device: any;
  originalDevice: any;
  backup: BackupType | undefined;
  error: unknown;
  DefyVariant: string;
  flashRaise: FlashRaise | undefined;
  flashDefyWireless: FlashDefyWireless | undefined;
  flashSides: SideFlaser | undefined;
  bootloader: boolean | undefined;
  comPath: string | Buffer | undefined;
}

export const Context = {
  loadedComms: false,
  stateblock: 1,
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
  sideLeftBL: undefined,
  rightResult: undefined,
  leftResult: undefined,
  resetResult: undefined,
  flashResult: undefined,
  firmwares: [],
  device: undefined,
  originalDevice: undefined,
  backup: undefined,
  error: undefined,
  DefyVariant: undefined,
  flashRaise: undefined,
  flashDefyWireless: undefined,
  flashSides: undefined,
  bootloader: undefined,
  comPath: undefined,
};

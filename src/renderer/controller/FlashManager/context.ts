import { ReleaseType } from "@Renderer/types/releases";
import { State } from "src/api/comms/Device";

export interface ContextType {
  Block: number;
  deviceState: State | undefined;
  backup?: any;
  error: any;
  firmwareList: ReleaseType[];
  firmwares: any;
  device: any;
  isUpdated: any;
  isBeta: any;
  sideLeftOk: boolean;
  sideLeftBL: boolean;
  sideRightOK: boolean;
  sideRightBL: boolean;
  RaiseBrightness: string;
}

export const Context: ContextType = {
  Block: 0,
  deviceState: undefined,
  error: undefined,
  firmwareList: [],
  firmwares: undefined,
  device: undefined,
  isUpdated: undefined,
  isBeta: undefined,
  sideLeftOk: false,
  sideLeftBL: false,
  sideRightOK: false,
  sideRightBL: false,
  RaiseBrightness: "",
};

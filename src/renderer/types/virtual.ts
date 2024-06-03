import { DygmaDeviceType } from "./dygmaDefs";

export interface VirtualType {
  device: DygmaDeviceType;
  virtual: {
    [command: string]: {
      data: string;
      eraseable: boolean;
    };
  };
}

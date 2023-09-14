import { ConnectedDevice } from "./ConnectedDevice";

export interface DeviceManager {
  find: () => Promise<ConnectedDevice[]>;
  open: (index: number) => Promise<ConnectedDevice>;
  close: (index: number) => void;
  isDeviceAccessible: (index: number) => boolean;
  isDeviceSupported: (index: number) => boolean;
}

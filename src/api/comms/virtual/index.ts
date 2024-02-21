import { connect, isDeviceConnected, isDeviceSupported, DeviceType, isVirtualType } from "./VirtualAPI";

interface VirtualType {
  find: () => Array<DeviceType>;
  connect: () => void;
  isDeviceConnected: (device: DeviceType) => boolean;
  isDeviceSupported: (device: DeviceType) => Promise<boolean>;
}

const virtual: VirtualType | any = {};
virtual.find = undefined;
virtual.connect = connect;
virtual.isDeviceConnected = isDeviceConnected;
virtual.isDeviceSupported = isDeviceSupported;

export default virtual;
export { DeviceType, isVirtualType };

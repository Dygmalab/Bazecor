import { find, connect, isDeviceConnected, isDeviceSupported, DeviceType, isSerialType } from "./SerialAPI";

interface SerialType {
  find: () => void;
  connect: () => void;
  isDeviceConnected: (device: DeviceType) => boolean;
  isDeviceSupported: (device: DeviceType) => Promise<boolean>;
}

const serial: SerialType | any = {};
serial.find = find;
serial.connect = connect;
serial.isDeviceConnected = isDeviceConnected;
serial.isDeviceSupported = isDeviceSupported;

export default serial;
export { DeviceType, isSerialType };

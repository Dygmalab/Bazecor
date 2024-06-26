import {
  find,
  ExtendedPort,
  enumerate,
  ConnectType,
  connect,
  DeviceType,
  SerialProperties,
  checkProperties,
  isSerialType,
} from "./SerialAPI";

interface SerialType {
  find: () => Promise<ExtendedPort[]>;
  enumerate: (
    bootloader: boolean,
    device?: USBDevice,
    existingIDs?: string[],
  ) => Promise<{ foundDevices: ExtendedPort[]; validDevices: string[] }>;
  connect: ConnectType;
  checkProperties: (path: string) => Promise<SerialProperties>;
}

const serial: SerialType = { find, enumerate, connect, checkProperties };

export default serial;
export { DeviceType, isSerialType };

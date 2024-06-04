import { find, connect, DeviceType, checkProperties, isSerialType } from "./SerialAPI";

interface SerialType {
  find: () => Array<DeviceType>;
  connect: () => void;
}

const serial: SerialType | any = {};
serial.find = find;
serial.connect = connect;
serial.checkProperties = checkProperties;

export default serial;
export { DeviceType, isSerialType };

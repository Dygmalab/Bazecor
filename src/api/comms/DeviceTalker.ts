import log from "electron-log/renderer";
import serial, { DeviceType, isSerialType } from "./serial";
import hid from "./hid";

class DeviceTalker {
  static list = async () => {
    // working with serial
    const serialDevs = await serial.find();
    const sDevices = serialDevs.filter(async (dev: DeviceType) => {
      log.info(dev);
    });

    return sDevices;
  };

  static connect = async (device: unknown) => {
    if (isSerialType(device)) {
      const result = await serial.connect(device);
      log.verbose(`the device is ${device.type} type, and connected as: ${result}`);
      return result;
    }
    return hid.connect(device);
  };
}

export default DeviceTalker;
export { DeviceType };

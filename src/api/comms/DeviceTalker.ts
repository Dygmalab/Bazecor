import log from "electron-log/renderer";
import serial, { DeviceType, isSerialType } from "./serial";
import hid from "./hid";

/**
 * Handles device discovery and connection.
 */
class DeviceTalker {
  /**
   * Lists available serial devices.
   * @returns {Promise<DeviceType[]>} A promise that resolves with a list of serial devices.
   */
  static list = async (): Promise<DeviceType[]> => {
    // working with serial
    const serialDevs = await serial.find();
    const sDevices = serialDevs.filter(async (dev: DeviceType) => {
      log.info(dev);
    });

    return sDevices;
  };

  /**
   * Connects to a given device, either serial or HID.
   * @param {unknown} device - The device to connect to.
   * @returns {Promise<any>} A promise that resolves with the connection result.
   */
  static connect = async (device: unknown): Promise<any> => {
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

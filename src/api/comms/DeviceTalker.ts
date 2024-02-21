import serial, { isSerialType, DeviceType } from "./serial";
import hid from "./hid";

class DeviceTalker {
  static list = async () => {
    // working with serial
    const serialDevs = await serial.find();
    const sDevices = serialDevs.filter(
      async (dev: DeviceType) => (await DeviceTalker.isDeviceConnected(dev)) && (await DeviceTalker.isDeviceSupported(dev)),
    );

    // working with hid
    // const hidDevs = hid.find();
    // console.log(hidDevs);
    // for (const dev of hidDevs) {
    //   const isConnected = DeviceTalker.isDeviceConnected(dev);
    //   const isSupported = DeviceTalker.isDeviceSupported(dev);
    //   if (isConnected && isSupported) {
    //     devices.push(dev);
    //   }
    // }

    return sDevices;
  };

  static connect = async (device: any) => {
    if (isSerialType(device)) {
      const result = await serial.connect(device);
      console.log("the device is serial type: ", device, " and connected as: ", result);
      return result;
    }
    const result = hid.connect(device);
    return result;
  };

  static isDeviceConnected = async (device: any) => {
    // console.log(isSerialType(device), device);
    if (isSerialType(device)) {
      return serial.isDeviceConnected(device);
    }
    return hid.isDeviceConnected(device);
  };

  static isDeviceSupported = async (device: any) => {
    if (isSerialType(device)) {
      return serial.isDeviceSupported(device);
    }
    return hid.isDeviceSupported(device);
  };
}

export default DeviceTalker;
export { DeviceType };

import serial, { isSerialType } from "./serial";
import hid from "./hid";

class DeviceTalker {
  static list = async () => {
    const devices: any = [];

    // working with serial
    const serialDevs = await serial.find();
    console.log(serialDevs);
    for (const dev of serialDevs) {
      const isConnected = DeviceTalker.isDeviceConnected(dev);
      const isSupported = DeviceTalker.isDeviceSupported(dev);
      if (isConnected && isSupported) {
        devices.push(dev);
      }
    }

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

    return devices;
  };

  static connect = async (device: any) => {
    if (isSerialType(device)) {
      const result = serial.connect(device);
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

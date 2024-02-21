import HID from "./hid";
import { DeviceManager } from "../DeviceManager";
import { ConnectedDevice } from "../ConnectedDevice";

class HIDDeviceManager implements DeviceManager {
  private HIDDevices: HID[] = [];

  find = async () => {
    const currentDevices = await HID.getDevices();
    this.HIDDevices = currentDevices.map(() => new HID());
    return this.HIDDevices as ConnectedDevice[];
  };

  open = async (index: number) => {
    // await this.HIDDevices[index].connectDevice(index);
    await this.HIDDevices[index].open();
    return this.HIDDevices[index] as ConnectedDevice;
  };

  close = async (index: number) => {
    await this.HIDDevices[index].close();
  };
  /* eslint-disable */
  isDeviceAccessible = (index: number) => true;

  isDeviceSupported = (index: number) => true;
  /* eslint-disable */
  // onConnect: () => void;
  // onDisconnect: () => void;
}

export default HIDDeviceManager;

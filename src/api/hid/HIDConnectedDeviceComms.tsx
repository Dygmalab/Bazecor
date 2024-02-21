import HID from "./hid";
import { ConnectedDevice } from "../ConnectedDevice";
import { ConnectedDeviceComms, ConnnectedDeviceCommsHandler, ErrorHandler } from "../ConnectedDeviceComms";

class HIDConnectedDeviceCommsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HIDConnectedDeviceCommsError";
  }
}

class HIDConnectedDeviceComms implements ConnectedDeviceComms {
  private connectedHIDDevice: HID;

  constructor(connectedDevice: ConnectedDevice) {
    this.connectedHIDDevice = connectedDevice as any;
  }

  sendData = async (data: string, receiverHandler: ConnnectedDeviceCommsHandler, errorHandler: ErrorHandler) => {
    // we can make an adaptor to this call
    this.connectedHIDDevice.sendData(data, receiverHandler, errorHandler);
  };
  /* eslint-disable */
  // README!! we need to disable eslint because we do not have implemented raw send over HID so it complains otherwise
  sendRawData = async (data: string, receiverHandler: ConnnectedDeviceCommsHandler, errorHandler: ErrorHandler) => {
    console.log("Raw data send on HID not supported yet");
    throw new HIDConnectedDeviceCommsError("Raw data not supported on HID yet");
  };
  /* eslint-enable */
}

export default HIDConnectedDeviceComms;

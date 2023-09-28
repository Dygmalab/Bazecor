import Hardware from "../hardware";

const DygmavendorID = 13807;
const DygmaproductID = 18;
const HIDReportID = 5;
const DygmaUsage = 1;
const DygmaUsagePage = 65280;

type ReceiverHandler = (dataReceived: string) => void;
type ErrorHandler = (err: Error) => void;

class HIDError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "HIDError";
  }
}

class HID {
  private connectedDevice: HIDDevice;
  private devices: Array<HIDDevice>;
  private dataReceived: string;
  private static encoder: TextEncoder;
  private static decoder: TextDecoder;

  constructor() {
    this.connectedDevice = null;
    this.devices = [];
    this.dataReceived = "";
    if (!HID.encoder || !HID.decoder) {
      HID.encoder = new TextEncoder();
      HID.decoder = new TextDecoder();
    }
  }

  static getDevices = async (): Promise<HIDDevice[]> => {
    const grantedDevices = await navigator.hid.getDevices();
    const filteredDevices = grantedDevices.filter(dev => dev.vendorId === DygmavendorID && dev.productId === DygmaproductID);
    const foundDevices = [];

    for (const device of filteredDevices) {
      for (const Hdevice of Hardware.serial) {
        if (device.productId === Hdevice.usb.productId && device.vendorId === Hdevice.usb.vendorId) {
          const newHID: any = device;
          newHID.device = Hdevice;
          foundDevices.push(newHID);
        }
      }
    }
    console.log("Usable found devices:", foundDevices);
    return foundDevices;
  };

  connectDevice = (device: HIDDevice) => {
    // if we are already connected, we do not care and connect again
    console.log("Trying to connect HID");
    if (this.connectedDevice) {
      throw new HIDError("Device already connected");
    }
    if (device) {
      const connectedDevice = device;
      this.connectedDevice = connectedDevice;
      return connectedDevice;
    }
    throw new HIDError("No HID Devices to connect");
  };

  static isDeviceConnected = (device: any) => {
    // if (process.platform !== "linux") return true;
    // try {
    //   fs.accessSync(device.path, fs.constants.R_OK | fs.constants.W_OK);
    // } catch (e) {
    //   return false;
    // }
    console.log("checking if device is connected: ", device);
    return true;
  };

  static isDeviceSupported = async (device: any) => {
    // if (!device.device.isDeviceSupported) {
    console.log("checking if device is supported: ", device);
    const hid = new HID();
    hid.connectDevice(device);
    await hid.open();
    let chipid = "";
    await hid.sendData(
      "hardware.chip_id\n",
      rxData => {
        console.log("All data received", rxData);
        chipid = rxData;
      },
      err => {
        console.log(err);
      },
    );
    console.log("after send Data");
    await hid.close();
    console.log("after hid close");
    device.serialNumber = chipid;
    return true;
    // }
    // const supported = await device.device.isDeviceSupported(device);
    // console.log("focus.isDeviceSupported: port=", device, "supported=", supported);
    // return supported;
  };

  open = async () => {
    if (this.isConnected() && !this.isOpen()) {
      await this.connectedDevice.open();
      console.log("Device open");
      console.log(this.connectedDevice);
      return;
    }
    if (!this.isConnected()) {
      throw new HIDError("No connected device to open");
    }
    if (this.isOpen()) {
      throw new HIDError("Device already open");
    }
  };

  close = async () => {
    if (this.isOpen()) {
      await this.connectedDevice.close();
    }
    throw new HIDError("Device is not open, no need to close");
  };

  isConnected = () => {
    if (this.connectedDevice) {
      return true;
    }
    return false;
  };

  isOpen = () => this.isConnected() && this.connectedDevice.opened;

  static purgeUselessCharsEnd = (str: string) => {
    // we remove null char and whitespaces from the end of the data received
    const nullCharacterRegex = new RegExp("\u0000", "g");
    const strWithoutNull = str.replace(nullCharacterRegex, "").trimEnd();
    const dataArray = strWithoutNull.split(" ");
    const lastItem = dataArray[dataArray.length - 1];
    const lastItemChar = lastItem.charCodeAt(0);
    if (lastItemChar === 0 || Number.isNaN(lastItemChar)) {
      dataArray.pop();
    }
    const rejoined = dataArray.join(" ");
    return rejoined;
  };

  sendData = async (dataToSend: string, receiverHandler: ReceiverHandler, errorHandler: ErrorHandler) => {
    const maxData = 200;
    this.dataReceived = "";
    const encodedData = HID.encoder.encode(dataToSend);
    const chunks = Math.ceil(encodedData.length / maxData);
    let startIndex;
    let endIndex;
    if (!this.isOpen) {
      throw new HIDError("No open device");
    }
    // we declare the handler here so we can use it when we resolve the promise
    let receiveDataHandler: (event: HIDInputReportEvent) => void;
    const allDataReceived = new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        if (this.connectedDevice) {
          this.connectedDevice.removeEventListener("inputreport", receiveDataHandler);
        }
        reject(new HIDError("HID send data took too much time"));
      }, 5000);
      receiveDataHandler = (event: HIDInputReportEvent) => {
        // we cannot differentiate if the user has several defys
        const { data, device, reportId } = event;

        if (device.productId !== DygmaproductID && reportId !== HIDReportID) return;

        const decodedData = HID.decoder.decode(data);
        if (decodedData.includes("\r\n.\r\n")) {
          const lastChunk = decodedData.replace("\r\n.\r\n", "");
          this.dataReceived += lastChunk;
          this.dataReceived = HID.purgeUselessCharsEnd(this.dataReceived);
          clearTimeout(timeout);
          resolve(this.dataReceived);
        } else {
          this.dataReceived += decodedData;
        }
      };
      this.connectedDevice.addEventListener("inputreport", receiveDataHandler);
    });
    const buffer = new ArrayBuffer(maxData);
    let bufferView;
    for (let i = 0; i < chunks; i += 1) {
      startIndex = maxData * i;
      endIndex = maxData * i + maxData;
      bufferView = new Uint8Array(buffer);
      bufferView.fill(0);
      bufferView.set(encodedData.slice(startIndex, endIndex), 0);
      this.sendChunkData(bufferView);
    }
    return allDataReceived
      .then((totalDataReceived: string) => {
        this.connectedDevice.removeEventListener("inputreport", receiveDataHandler);
        receiverHandler(totalDataReceived);
      })
      .catch(err => errorHandler(err));
  };

  private sendChunkData = async (data: Uint8Array) => {
    await this.connectedDevice.sendReport(HIDReportID, data);
  };
}

export default HID;

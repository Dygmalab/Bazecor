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
  private dataReceived: string;
  private static encoder: TextEncoder;
  private static decoder: TextDecoder;

  constructor() {
    this.connectedDevice = null;
    this.dataReceived = "";
    if (!HID.encoder || !HID.decoder) {
      HID.encoder = new TextEncoder();
      HID.decoder = new TextDecoder();
    }
  }

  static getDevices = async (): Promise<HIDDevice[]> => {
    const grantedDevices = await navigator.hid.getDevices();
    const filteredDevices = grantedDevices.filter(dev => dev.vendorId === DygmavendorID && dev.productId === DygmaproductID);
    console.log(filteredDevices);
    return filteredDevices;
  };

  connectDevice = async (index: number) => {
    // if we are already connected, we do not care and connect again
    console.log("Trying to connect");
    if (this.connectedDevice) {
      throw new HIDError("Device already connected");
    }
    const devices = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: DygmavendorID,
          productId: DygmaproductID,
          usage: DygmaUsage,
          usagePage: DygmaUsagePage,
        },
      ],
    });
    console.log("Devices to connect");
    console.log(devices);
    if (devices.length > 0) {
      const connectedDevice = devices[index];
      this.connectedDevice = connectedDevice;
      return connectedDevice;
    }
    throw new HIDError("No HID Devices to connect");
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

  sendData = async (dataToSend: string, receiverHandler: ReceiverHandler, errorHandler: ErrorHandler) => {
    const maxData = 200;
    this.dataReceived = "";
    const dataWithDelimiter = `${dataToSend}`;
    const encodedData = HID.encoder.encode(dataWithDelimiter);
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
        this.connectedDevice.removeEventListener("inputreport", receiveDataHandler);
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
          clearTimeout(timeout);
          resolve(this.dataReceived);
        } else {
          this.dataReceived += decodedData;
        }
      };
      this.connectedDevice.addEventListener("inputreport", receiveDataHandler);
    });
    for (let i = 0; i < chunks; i += 1) {
      startIndex = maxData * i;
      endIndex = maxData * i + maxData;
      this.sendChunkData(encodedData.slice(startIndex, endIndex));
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

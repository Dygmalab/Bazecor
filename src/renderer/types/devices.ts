// eslint-disable-next-line import/no-cycle
import { SerialPort } from "serialport";
import HID from "../../api/hid/hid";
import DeviceMap from "../../api/comms/deviceMap";

export interface DeviceClass {
  type: string;
  path: string;
  manufacturer: string;
  serialNumber: string;
  pnpId: string;
  locationId: string;
  productId: string;
  vendorId: string;
  timeout: number;
  result: string;
  callbacks: Array<(value: unknown) => void>;
  device: DygmaDeviceType;
  port?: HID | SerialPort;
  commands?: { [key: string]: unknown; help: Array<string> };
  file?: boolean;
  isClosed: boolean;
  isSending: boolean;
  memoryMap: DeviceMap;
  fileData: VirtualType;

  addPort: (serialport: SerialPort) => Promise<void>;
  addHID: () => Promise<void>;
  close: () => Promise<void>;
  request: (command: string, ...args: Array<string>) => Promise<string>;
  serialRequest: (cmd: string, ...args: Array<string>) => Promise<string>;
  hidRequest: (cmd: string, ...args: Array<string>) => Promise<string>;
  virtualRequest: (cmd: string, ...args: Array<string>) => Promise<string>;
  command: (cmd: string, ...args: Array<string>) => Promise<string>;
  noCacheCommand: (cmd: string, ...args: Array<string>) => Promise<string>;
  write_parts: (parts: Array<string>, cb: () => void) => Promise<void>;
  addCommands: (cmds: string) => void;
}

export interface USBDeviceDescriptor {
  idVendor: number;
  idProduct: number;
}

export interface USBDevice {
  deviceDescriptor: USBDeviceDescriptor;
}

export interface NonSerialDeviceDescriptor {
  vendorId: number;
  productId: number;
}

export interface NonSerialDevice {
  usb: NonSerialDeviceDescriptor;
}

export interface DeviceType {
  path: string;
  manufacturer: string | undefined;
  serialNumber: string | undefined;
  pnpId: string | undefined;
  locationId: string | undefined;
  productId: string | undefined;
  vendorId: string | undefined;
  device?: DygmaDeviceType;
}

export interface VirtualType {
  device: DygmaDeviceType;
  virtual: {
    [command: string]: {
      data: string;
      eraseable: boolean;
    };
  };
}

export interface HIDDeviceExtended extends HIDDevice {
  device?: any | undefined;
}

export interface DeviceDescriptor {
  vendor: any;
  product: any;
  keyboardType: string;
  displayName: string;
  urls: any;
}

export type CountProviderProps = { children: React.ReactNode };

export type Action =
  | { type: "changeCurrent"; payload: any }
  | { type: "addDevice"; payload: any }
  | { type: "addDevicesList"; payload: any }
  | { type: "command"; payload: any }
  | { type: unknown; payload?: unknown };

export type Dispatch = (action: Action) => void;

export type State = {
  selected: number;
  currentDevice: DeviceClass;
  deviceList: Array<DeviceClass>;
};

export type DygmaDeviceType = {
  info: {
    vendor: string;
    product: string;
    keyboardType: string;
    displayName: string;
    urls: [
      {
        name: string;
        url: string;
      },
    ];
  };
  usb: {
    vendorId: number;
    productId: number;
  };
  keyboard: {
    rows: number;
    columns: number;
  };
  keyboardUnderglow: {
    rows: number;
    columns: number;
  };
  RGBWMode: boolean;
  components: unknown;
  instructions: {
    en: {
      updateInstructions: string;
    };
  };
  path?: string;
  bootloader?: boolean;
  filePath?: string;
};

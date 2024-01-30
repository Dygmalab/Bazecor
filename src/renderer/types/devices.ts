import Device from "../../api/comms/Device";

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
  currentDevice: Device | undefined;
  deviceList: Array<DeviceType>;
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
  components: {
    keymap: unknown;
  };

  instructions: {
    en: {
      updateInstructions: string;
    };
  };
};

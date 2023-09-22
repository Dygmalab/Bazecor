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

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

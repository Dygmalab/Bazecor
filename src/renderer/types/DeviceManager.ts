import Device from "src/api/comms/Device";

export interface DeviceListType {
  name: string;
  available: boolean;
  path: string;
  file: boolean;
  device: Device;
  serialNumber: string;
}

import Device from "src/api/comms/Device";
import { Neuron } from "./neurons";

export interface DeviceListType {
  name: string;
  available: boolean;
  connected: boolean;
  config: Neuron;
  file: boolean;
  device: Device;
  serialNumber: string;
  index: number;
}

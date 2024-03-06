// eslint-disable-next-line import/no-cycle
import { DygmaDeviceType } from "@Renderer/types/devices";

export interface ExtHIDInterface extends HIDDevice {
  device?: DygmaDeviceType;
}

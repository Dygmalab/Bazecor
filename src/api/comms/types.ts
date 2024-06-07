import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";

export interface ExtHIDInterface extends HIDDevice {
  device?: DygmaDeviceType;
}

import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { DeviceTools } from "@Renderer/DeviceContext";
import log from "electron-log/renderer";
import { ExtendedPort } from "../comms/serial/SerialAPI";
import Hardware from "../hardware";

export const findDevice = async (
  deviceType: "serial" | "nonSerial" | "bootloader",
  message: string,
  desiredDevice?: DygmaDeviceType,
) => {
  log.info("Going to list devices");
  let devices = Hardware[deviceType] as DygmaDeviceType[];
  const bootloader = deviceType === "bootloader";
  let list: ExtendedPort[] = (await DeviceTools.enumerateSerial(bootloader)) as ExtendedPort[];
  if (deviceType === "serial" && desiredDevice?.info.keyboardType !== undefined) devices = [desiredDevice];
  log.verbose("List of Devices: ", list);
  const detected = list.find(dev => {
    log.info("Searching for Device");
    let found = false;
    devices.forEach(device => {
      log.info(
        `Dev bootloader: ${dev.device.bootloader} & HW: ${bootloader}, Dev KBType: ${device.info.keyboardType} & HW: ${dev.device.info.keyboardType}`,
      );
      if (
        bootloader
          ? dev.device.bootloader !== undefined &&
            dev.device.bootloader === bootloader &&
            device.usb.vendorId === dev.device.usb.vendorId &&
            device.usb.productId === dev.device.usb.productId
          : device.usb.vendorId === dev.device.usb.vendorId &&
            device.usb.productId === dev.device.usb.productId &&
            device.info.keyboardType === dev.device.info.keyboardType
      ) {
        found = true;
        return;
      }
    });
    return found;
  });
  log.info(message, detected);
  return detected;
};

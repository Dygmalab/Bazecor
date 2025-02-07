import log from "electron-log/renderer";
import { DeviceTools } from "@Renderer/DeviceContext";
import { DygmaDeviceType } from "@Renderer/types/dygmaDefs";
import { ExtendedPort } from "../comms/serial/SerialAPI";
import Hardware from "../hardware";

function getDeviceList(deviceType: "serial" | "nonSerial" | "bootloader", desiredDevice?: DygmaDeviceType): DygmaDeviceType[] {
  if (deviceType === "serial" && desiredDevice?.info.keyboardType !== undefined) {
    return [desiredDevice];
  }
  return Hardware[deviceType];
}

export const findDevice = async (
  deviceType: "serial" | "nonSerial" | "bootloader",
  desiredDevice?: DygmaDeviceType,
): Promise<ExtendedPort> => {
  log.info(`Going to list devices for type: ${deviceType}`);
  const lookupDevices: DygmaDeviceType[] = getDeviceList(deviceType, desiredDevice);

  const isBootloader = deviceType === "bootloader";
  const hwDevices: ExtendedPort[] = (await DeviceTools.enumerateSerial(isBootloader)).foundDevices;
  log.verbose("List of Devices: ", hwDevices);

  const matchingDevice: ExtendedPort = hwDevices.find(hwDevice =>
    lookupDevices.some(lookupDevice => {
      log.info(
        `Bootloader - Lookup: ${isBootloader} & HW: ${hwDevice.device.bootloader} | KBType - Lookup: ${lookupDevice.info.keyboardType} & HW: ${hwDevice.device.info.keyboardType}`,
      );

      if (lookupDevice.usb.vendorId !== hwDevice.device.usb.vendorId) {
        return false;
      }
      if (lookupDevice.usb.productId !== hwDevice.device.usb.productId) {
        return false;
      }
      if (isBootloader) {
        return hwDevice.device.bootloader === true;
      }
      return lookupDevice.info.keyboardType === hwDevice.device.info.keyboardType;
    }),
  );
  log.info(`${deviceType === "serial" ? "keyboard" : deviceType} detected`, matchingDevice);
  return matchingDevice;
};

// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
 * Copyright (C) 2018-2022  Keyboardio, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { ipcMain } from "electron";
import { getDeviceList, WebUSB } from "usb";
import sendToRenderer from "../utils/sendToRenderer";
import Focus from "../../api/focus";

const dygmaVendorIDs = [0x35ef, 0x1209];

const webusb = new WebUSB({
  allowAllDevices: true,
});

export const onUSBDisconnect = async (event: USBConnectionEvent) => {
  const { device } = event;
  if (device) {
    const vendorID = device.vendorId;
    const productID = device.productId;
    if (dygmaVendorIDs.includes(vendorID)) {
      console.log("Dygma Device USB Disconnection detected");
      console.log("VendorID", vendorID);
      console.log("ProductID", productID);
      sendToRenderer("usb-disconnected", device);
      const focus = new Focus();
      if (focus.device?.usb?.productId === productID) {
        await focus.close();
      }
    }
  }
};
export const onUSBConnect = (event: USBConnectionEvent) => {
  const { device } = event;
  if (device) {
    const vendorID = device.vendorId;
    const productID = device.productId;
    if (dygmaVendorIDs.includes(vendorID)) {
      console.log("Dygma Device USB Connection detected");
      console.log("VendorID", vendorID);
      console.log("ProductID", productID);
      sendToRenderer("usb-connected", vendorID, productID);
    }
  }
};

export const addUSBListeners = () => {
  webusb.addEventListener("connect", onUSBConnect);
  webusb.addEventListener("disconnect", onUSBDisconnect);
};

export const removeUSBListeners = () => {
  webusb.removeEventListener("connect", onUSBConnect);
  webusb.removeEventListener("disconnect", onUSBDisconnect);
};

export const getDevices = () => {
  const devices = getDeviceList();
  return devices;
};

export const configureUSB = async () => {
  // We're relying on webusb to send us notifications about device
  // connect/disconnect events, but it only sends disconnect events for devices
  // it knows. If there are devices connected when we start up, we need to scan
  // them first to notice disconnects. We do that here.
  await webusb.getDevices();

  ipcMain.handle("usb-devices", () => {
    const devices = getDeviceList();
    return devices;
  });

};

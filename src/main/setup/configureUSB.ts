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
import log from "electron-log/main";
import sendToRenderer from "../utils/sendToRenderer";

const dygmaVendorIDs = [0x35ef, 0x1209];

const webusb = new WebUSB({
  allowAllDevices: true,
});

log.info(webusb.getDevices());

export const onUSBDisconnect = async (event: USBConnectionEvent) => {
  const { device } = event;
  if (device) {
    const vendorID = device.vendorId;
    const productID = device.productId;
    if (dygmaVendorIDs.includes(vendorID)) {
      log.verbose("Dygma Device USB Disconnection detected");
      log.verbose("VendorID", vendorID);
      log.verbose("ProductID", productID);
      sendToRenderer("usb-disconnected", JSON.stringify(device));
    }
  }
};
export const onUSBConnect = (event: USBConnectionEvent) => {
  const { device } = event;
  if (device) {
    const vendorID = device.vendorId;
    const productID = device.productId;
    if (dygmaVendorIDs.includes(vendorID)) {
      log.verbose("Dygma Device USB Connection detected");
      log.verbose("VendorID", vendorID);
      log.verbose("ProductID", productID);
      sendToRenderer("usb-connected", JSON.stringify(device));
    }
  }
};

export const addUSBListeners = () => {
  log.verbose("adding USB Listeners");
  webusb.addEventListener("connect", onUSBConnect);
  webusb.addEventListener("disconnect", onUSBDisconnect);
};

export const removeUSBListeners = () => {
  log.verbose("removing USB Listeners");
  webusb.removeEventListener("connect", onUSBConnect);
  webusb.removeEventListener("disconnect", onUSBDisconnect);
  ipcMain.removeHandler("usb-devices");
};

export const getDevices = () => {
  const devices = getDeviceList();
  return devices;
};

export const configureUSB = () => {
  ipcMain.handle("usb-devices", () => {
    const devices = getDeviceList();
    return devices;
  });
  // We're relying on webusb to send us notifications about device
  // connect/disconnect events, but it only sends disconnect events for devices
  // it knows. If there are devices connected when we start up, we need to scan
  // them first to notice disconnects. We do that here.
  // webusb.getDevices();
};

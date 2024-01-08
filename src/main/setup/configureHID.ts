import Window from "../managers/Window";

const onDeviceAdded = (added_device_event: any, device: any) => {
  console.log("hid-device-added FIRED WITH", device);
  // Optionally update details.deviceList
};

const onDeviceRemove = (removed_device_event: any, device: any) => {
  console.log("hid-device-removed FIRED WITH", device);
};

const onDeviceSelect = (event: Event, details: any, callback: any) => {
  // Add events to handle devices being added or removed before the callback on
  // `select-hid-device` is called.
  event.preventDefault();

  if (details.deviceList && details.deviceList.length > 0) {
    const filteredDevices = details.deviceList.filter((device: any) => device.productId === 18 && device.vendorId === 13807);
    console.log("Filtered list");
    console.log(filteredDevices);
    if (filteredDevices.length > 0) {
      callback(filteredDevices[0].deviceId);
    } else {
      callback();
    }
  }
};

export const configureHID = () => {
  const window = Window.getWindow();
  window.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    console.log("hid configuration", permission, details);
    if (permission === "hid") {
      return true;
    }
    return false;
  });

  window.webContents.session.setDevicePermissionHandler(details => {
    console.log("hid permissions", details);
    if (details.deviceType === "hid") {
      return true;
    }
    return false;
  });
  window.webContents.session.on("select-hid-device", onDeviceSelect);

  window.webContents.session.on("hid-device-added", onDeviceAdded);

  window.webContents.session.on("hid-device-removed", onDeviceRemove);
};

export const removeHIDListeners = () => {
  const window = Window.getWindow();
  window.webContents.session.removeListener("select-hid-device", onDeviceSelect);
  window.webContents.session.removeListener("hid-device-added", onDeviceAdded);
  window.webContents.session.removeListener("hid-device-removed", onDeviceRemove);
};

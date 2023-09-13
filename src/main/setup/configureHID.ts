import Window from "../managers/Window";

export const configureHID = () => {
  const window = Window.getWindow();
  window.webContents.session.setPermissionCheckHandler((webContents, permission, requestingOrigin, details) => {
    if (permission === "hid" && details.securityOrigin.includes("http://localhost")) {
      return true;
    }
    return false;
  });

  window.webContents.session.setDevicePermissionHandler(details => {
    if (details.deviceType === "hid" && details.origin.includes("http://localhost")) {
      return true;
    }
    return false;
  });
  window.webContents.session.on("select-hid-device", (event, details, callback) => {
    // Add events to handle devices being added or removed before the callback on
    // `select-hid-device` is called.
    event.preventDefault();

    window.webContents.session.on("hid-device-added", (added_device_event, device) => {
      console.log("hid-device-added FIRED WITH", device);
      // Optionally update details.deviceList
    });

    window.webContents.session.on("hid-device-removed", (removed_device_event, device) => {
      console.log("hid-device-removed FIRED WITH", device);
    });

    if (details.deviceList && details.deviceList.length > 0) {
      const filteredDevices = details.deviceList.filter(device => device.name.includes("Defy"));
      console.log("Filtered list");
      console.log(filteredDevices);
      if (filteredDevices.length > 0) {
        callback(filteredDevices[0].deviceId);
      } else {
        callback();
      }
    }
  });
};

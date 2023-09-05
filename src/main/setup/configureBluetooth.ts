import Window from "../managers/Window";

const configureBluetooth = () => {
  const window = Window.getWindow();
  let counter = 0;

  window.webContents.on("select-bluetooth-device", (event: Event, deviceList: any, callback: any) => {
    event.preventDefault();
    const result = deviceList.find(device => device.deviceName.includes("Defy BLE"));
    console.log("This are the BT Devices!!!");
    console.log(deviceList, result);
    if (!result) {
      // The device wasn't found so we need to either wait longer (eg until the
      // device is turned on) or cancel the request by calling the callback
      // with an empty string.
      if (counter >= 10) {
        counter = 0;
        callback("");
      }
      counter += 1;
    } else {
      console.log("device detected", result);
      callback(result.deviceId);
    }
  });
};

export default configureBluetooth;

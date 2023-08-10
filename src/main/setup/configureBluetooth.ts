import Window from "../managers/Window";

const configureBluetooth = () => {
  const window = Window.getWindow();

  window.webContents.on("select-bluetooth-device", (event: Event, deviceList: any, callback: any) => {
    event.preventDefault();
    // const result = deviceList.find(device => device.deviceName === "test");
    const result: any = { deviceId: 0x1812 };
    console.log("This are the BT Devices!!!");
    console.log(deviceList);
    if (!result) {
      // The device wasn't found so we need to either wait longer (eg until the
      // device is turned on) or cancel the request by calling the callback
      // with an empty string.
      callback("");
    } else {
      callback(result.deviceId);
    }
  });
};

export default configureBluetooth;

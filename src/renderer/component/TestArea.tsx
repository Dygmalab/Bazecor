import React from "react";
import { ipcRenderer } from "electron";
import { RegularButton } from "./Button";

const TestArea = () => {
  const testingMode = true;
  let connectedDevice: undefined | HIDDevice;
  const onGetHIDDevices = async () => {
    const grantedDevices = await navigator.hid.getDevices();
    console.log(grantedDevices);
  };

  const onHIDConnect = async () => {
    const devices = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: 1133,
          productId: 49951,
        },
      ],
    });
    console.log("Devices to connect");
    console.log(devices);
    [connectedDevice] = devices;
    console.log("Connected to");
    console.log(connectedDevice);
  };

  const onHIDOpen = async () => {
    if (connectedDevice) {
      await connectedDevice.open();
      console.log("Device open");
      console.log(connectedDevice);
      connectedDevice.addEventListener("inputreport", event => {
        const { data, device, reportId } = event;
        console.log("inputreport event");

        const value = data.getUint8(0);
        if (value === 0) return;
      });
    }
  };

  const onHIDReports = () => {
    if (connectedDevice) {
      const { collections } = connectedDevice;
      let inputReports;
      let outputReports;
      let featureReports;

      for (const collection of collections) {
        inputReports = collection.inputReports;
        outputReports = collection.outputReports;
        featureReports = collection.featureReports;
        console.log("Input reports");
        for (const inputReport of inputReports) {
          console.log(inputReport);
        }
        console.log("Output reports");
        for (const outputReport of outputReports) {
          console.log(outputReport);
        }
        console.log("Feature reports");
        for (const featureReport of featureReports) {
          console.log(featureReport);
        }
      }
    }
  };

  const onHIDSendReport = async () => {
    if (connectedDevice) {
      const report = new Uint8Array(8);
      report[0] = 2;
      try {
        await connectedDevice.sendFeatureReport(5, report);
      } catch (err) {
        console.log(err);
      }
      console.log("Report sent");
    }
  };

  if (testingMode) {
    return (
      <>
        <RegularButton buttonText="List of HID Devices" styles="primary" onClick={onGetHIDDevices} />
        <RegularButton buttonText="Connect by HID" styles="primary" onClick={onHIDConnect} />
        <RegularButton buttonText="Open device" styles="primary" onClick={onHIDOpen} />
        <RegularButton buttonText="List reports" styles="primary" onClick={onHIDReports} />
        <RegularButton buttonText="Send report" styles="primary" onClick={onHIDSendReport} />
      </>
    );
  }
  return <></>;
};

export default TestArea;

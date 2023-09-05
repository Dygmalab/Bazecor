import React from "react";
import { RegularButton } from "./Button";

const TestArea = () => {
  const testingMode = true;

  const onGetHIDDevices = async () => {
    const grantedDevices = await navigator.hid.getDevices();
    console.log(grantedDevices);
  };

  const onHIDConnect = async () => {
    const device = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: 1133,
          productId: 45095,
        },
      ],
    });
    console.log("Connected to");
    console.log(device);
  };

  if (testingMode) {
    return (
      <>
        <RegularButton buttonText="List of HID Devices" styles="primary" onClick={onGetHIDDevices} />
        <RegularButton buttonText="Connect by HID" styles="primary" onClick={onHIDConnect} />
      </>
    );
  }
  return <></>;
};

export default TestArea;

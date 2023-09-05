import React from "react";
import { RegularButton } from "./Button";

const TestArea = () => {
  const testingMode = true;

  const onGetHIDDevices = () => {
    console.log("Getting HID devices");
  };

  if (testingMode) {
    return <RegularButton buttonText="List of HID Devices" styles="primary" onClick={onGetHIDDevices} />;
  }
  return <></>;
};

export default TestArea;

import React, { useState } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PageHeader from "@Renderer/modules/PageHeader";
import { RegularButton } from "../component/Button";
import HID from "../../api/hid/hid";

const BazecorDevtools = () => {
  let connectedDevice: undefined | HIDDevice;
  const hid = new HID();
  const [keymap, setKeymap] = useState("");
  const onGetHIDDevices = async () => {
    const grantedDevices = await HID.getDevices();
    console.log(grantedDevices);
  };

  const onHIDConnect = async () => {
    try {
      connectedDevice = await hid.connectDevice(0);
      console.log("Connected to");
      console.log(connectedDevice);
    } catch (err) {
      console.log(err);
    }
  };

  const onHIDOpen = async () => {
    try {
      await hid.open();
    } catch (err) {
      console.log(err);
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

  const onHIDHelp = async () => {
    try {
      console.log("Sending help...");
      await hid.sendData(
        "help\n",
        rxData => {
          console.log("All data received");
          console.log(rxData);
        },
        err => {
          console.log(err);
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onHIDGetKeymap = async () => {
    try {
      console.log("Getting keymap...");
      await hid.sendData(
        "keymap.custom\n",
        rxData => {
          console.log("All data received");
          console.log(rxData);
          setKeymap(rxData);
        },
        err => {
          console.log(err);
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onHIDModifyKeymap = async () => {
    try {
      // console.log("Modifying keymap...");
      const previousKeymap = keymap.split(" ");
      const hardcodedKeymap =
        "41 30 31 32 33 34 45 0 0 46 35 36 37 38 39 42 43 20 26 8 21 23 47 0 0 48 28 24 12 18 19 76 57 4 22 7 9 10 17152 0 0 49 11 13 14 15 51 52 225 29 27 6 25 5 0 0 0 0 17 16 54 55 56 229 53980 17452 44 49211 49721 227 0 0 54109 54108 101 49209 49162 44 230 53852 41 0 0 0 0 0 0 0 0 0 83 0 84 85 46 42 43 0 74 82 77 75 0 0 0 0 0 95 96 97 86 0 0 70 80 81 79 78 0 0 0 0 0 92 93 94 87 0 225 0 0 0 0 0 0 0 0 0 99 89 90 91 88 0 0 0 65535 65535 65535 65535 0 0 0 0 0 0 65535 98 0 0 53 58 59 60 61 62 63 65535 65535 64 65 66 67 68 69 0 0 0 0 22710 22709 23785 0 65535 65535 0 0 23663 0 0 65535 0 0 0 22713 22711 22733 23786 0 65535 65535 0 0 23664 20866 20865 0 0 0 0 0 0 0 19682 65535 65535 65535 65535 0 0 0 0 0 0 0 65535 0 0 0 0 0 0 0 0 0 0 0 0 0 0 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 10";
      previousKeymap[previousKeymap.length - 1] = "65500";
      // console.log("Previous keymap in array is");
      // console.log(previousKeymap);
      // const modifiedKeymap = previousKeymap.join(" ");
      // console.log(modifiedKeymap);
      await hid.sendData(
        `keymap.custom ${hardcodedKeymap}\n`,
        rxData => {
          console.log("All data received");
          console.log(rxData);
        },
        err => {
          console.log(err);
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  const onHIDSetOriginalKeymap = async () => {
    try {
      console.log("Setting original keymap...");
      await hid.sendData(
        `keymap.custom ${keymap}\n`,
        rxData => {
          console.log("All data received");
          console.log(rxData);
        },
        err => {
          console.log(err);
        },
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Container fluid className="center-content">
      <PageHeader text="Bazecor dev tools" />
      <Row>
        <RegularButton buttonText="List of HID Devices" styles="primary" onClick={onGetHIDDevices} />
        <RegularButton buttonText="Connect by HID" styles="primary" onClick={onHIDConnect} />
        <RegularButton buttonText="Open device" styles="primary" onClick={onHIDOpen} />
        <RegularButton buttonText="List reports" styles="primary" onClick={onHIDReports} />
        <RegularButton buttonText="Send help" styles="primary" onClick={onHIDHelp} />
        <RegularButton buttonText="Get keymap" styles="primary" onClick={onHIDGetKeymap} />
        <RegularButton buttonText="Modify keymap" styles="primary" onClick={onHIDModifyKeymap} />
        <RegularButton buttonText="Restore keymap" styles="primary" onClick={onHIDSetOriginalKeymap} />
      </Row>
    </Container>
  );
};

export default BazecorDevtools;

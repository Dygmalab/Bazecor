import React from "react";
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PageHeader } from "@Renderer/modules/PageHeader";
import DeviceTalker, { DeviceType } from "../../api/comms";
import { RegularButton } from "../component/Button";
import HID from "../../api/hid/hid";

const Styles = Styled.div`
.button-container {

}
`;

const BazecorDevtools = () => {
  let connectedDevice: undefined | HIDDevice;
  let serialDevices: undefined | Array<DeviceType>;
  let serialDevice: undefined | DeviceType;
  const hid = new HID();
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

  const onHIDSendReport = async () => {
    try {
      console.log("Sending report...");
      await hid.sendData(
        "help",
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

  const onListSerialDevices = async () => {
    serialDevices = await DeviceTalker.list();
    console.log("Listing Serial Devices", serialDevices);
  };

  const onSerialConnect = async () => {
    try {
      serialDevice = await DeviceTalker.connect(serialDevices[0]);
      console.log("Connected to 0", serialDevices[0]);
      console.log(serialDevice);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Styles>
      <Container fluid className="center-content">
        <PageHeader text="Bazecor dev tools" />
        <Row className="button-container">
          <Col className="my-4 col-3">
            <h4>HID Testing Buttons</h4>
            <RegularButton buttonText="List of HID Devices" styles="primary" onClick={onGetHIDDevices} />
            <RegularButton buttonText="Connect by HID" styles="primary" onClick={onHIDConnect} />
            <RegularButton buttonText="Open device" styles="primary" onClick={onHIDOpen} />
            <RegularButton buttonText="List reports" styles="primary" onClick={onHIDReports} />
            <RegularButton buttonText="Send report" styles="primary" onClick={onHIDSendReport} />
          </Col>
          <Col className="my-4 col-3">
            <h4>Serial Testing Buttons</h4>
            <RegularButton buttonText="List of Serial Devices" styles="primary" onClick={onListSerialDevices} />
            <RegularButton buttonText="Connect to Serial Device" styles="primary" onClick={onSerialConnect} />
          </Col>
        </Row>
      </Container>
    </Styles>
  );
};

export default BazecorDevtools;

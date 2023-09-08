import React from "react";
import { ipcRenderer } from "electron";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import PageHeader from "@Renderer/modules/PageHeader";
import { RegularButton } from "../component/Button";

const BazecorDevtools = () => {
  let connectedDevice: undefined | HIDDevice;
  const onGetHIDDevices = async () => {
    const grantedDevices = await navigator.hid.getDevices();
    console.log(grantedDevices);
  };

  const onHIDConnect = async () => {
    const devices = await navigator.hid.requestDevice({
      filters: [
        {
          vendorId: 13807,
          productId: 18,
        },
      ],
    });
    console.log("Devices to connect");
    console.log(devices);
    [connectedDevice] = devices;
    console.log("Connected to");
    console.log(connectedDevice);
  };

  const inputReportHandler = (event: Event) => {
    const { data, device, reportId } = event;

    if (device.productId !== 18 && reportId !== 6) return;
    console.log("inputreport event");

    console.log("Data received");
    const dataReceived = new TextDecoder().decode(data);
    console.log(dataReceived);
  };

  const onHIDOpen = async () => {
    if (connectedDevice) {
      await connectedDevice.open();
      console.log("Device open");
      console.log(connectedDevice);
      connectedDevice.addEventListener("inputreport", inputReportHandler);
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
      const report = new TextEncoder().encode("help\n");
      try {
        await connectedDevice.sendReport(5, report);
        console.log("Report sent", report);
      } catch (err) {
        console.log(err);
      }
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
        <RegularButton buttonText="Send report" styles="primary" onClick={onHIDSendReport} />
      </Row>
    </Container>
  );
};

export default BazecorDevtools;

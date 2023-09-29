import React, { useState } from "react";
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";
import { RegularButton } from "../component/Button";
import HID from "../../api/hid/hid";
import Device from "../../api/comms/Device";

const Styles = Styled.div`
.button-container {

}
`;

const BazecorDevtools = () => {
  const [state, dispatch] = useDevice();

  // HID devices connectiont tools
  let connectedDevice: undefined | HIDDevice;
  const [hid] = useState(new HID());
  const [keymap, setKeymap] = useState("");
  const [grantedDevices, setGrantedDevices] = useState({});

  const onGetHIDDevices = async () => {
    const gDevices = await HID.getDevices();
    setGrantedDevices(gDevices);
    console.log(gDevices);
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
          const encodedRX = new TextEncoder().encode(rxData);
          console.log(encodedRX);
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

  const onHIDHardcodedKeymap = async () => {
    try {
      const hardcodedKeymap =
        "41 30 31 32 33 34 45 0 0 46 35 36 37 38 39 42 43 20 26 8 21 23 47 0 0 48 28 24 12 18 19 76 57 4 22 7 9 10 17152 0 0 49 11 13 14 15 51 52 225 29 27 6 25 5 0 0 0 0 17 16 54 55 56 229 53980 17452 44 49211 49721 227 0 0 54109 54108 101 49209 49162 44 230 53852 41 0 0 0 0 0 0 0 0 0 83 0 84 85 46 42 43 0 74 82 77 75 0 0 0 0 0 95 96 97 86 0 0 70 80 81 79 78 0 0 0 0 0 92 93 94 87 0 225 0 0 0 0 0 0 0 0 0 99 89 90 91 88 0 0 0 65535 65535 65535 65535 0 0 0 0 0 0 65535 98 0 0 53 58 59 60 61 62 63 65535 65535 64 65 66 67 68 69 0 0 0 0 22710 22709 23785 0 65535 65535 0 0 23663 0 0 65535 0 0 0 22713 22711 22733 23786 0 65535 65535 0 0 23664 20866 20865 0 0 0 0 0 0 0 19682 65535 65535 65535 65535 0 0 0 0 0 0 0 65535 0 0 0 0 0 0 0 0 0 0 0 0 0 0 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 10";
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

  const onListSerialDevices = async () => {
    const response = await DeviceTools.list();
    console.log("Listing Serial Devices", response);
    dispatch({ type: "addDevicesList", payload: response });
  };

  const onMessageSend = async () => {
    const dev = state.currentDevice;
    const message = await dev.command("palette");
    console.log("retrieving message help: ", message);
  };

  const onSerialConnect = async (selected: number) => {
    try {
      console.log("going to connect to device: ");
      const response = await DeviceTools.connect(state.deviceList[selected]);
      dispatch({ type: "changeCurrent", payload: { selected, device: response } });
      console.log("Connected!", state);
    } catch (err) {
      console.log("error when connecting");
      console.error(err);
    }
  };

  const onSerialDisconnect = async () => {
    try {
      const response = await state.currentDevice.close();
      console.log("Disconnected!", response);
    } catch (err) {
      console.log("error when disconnecting");
      console.error(err);
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
            <RegularButton buttonText="Send help" styles="primary" onClick={onHIDHelp} />
            <RegularButton buttonText="Get keymap" styles="primary" onClick={onHIDGetKeymap} />
            <RegularButton buttonText="Harcoded keymap" styles="primary" onClick={onHIDHardcodedKeymap} />
            <RegularButton buttonText="Restore keymap" styles="primary" onClick={onHIDSetOriginalKeymap} />
          </Col>
          <Col className="my-4 col-3">
            <h4>Serial Testing Buttons</h4>
            <RegularButton buttonText="List of Serial Devices" styles="primary" onClick={onListSerialDevices} />
            <RegularButton buttonText="Connect to Serial Device" styles="primary" onClick={() => onSerialConnect(0)} />
            <RegularButton buttonText="Send message" styles="primary" onClick={onMessageSend} />
            <RegularButton buttonText="Disconnect" styles="primary" onClick={onSerialDisconnect} />
          </Col>
        </Row>
        <Row>
          <Col md={6}>
            <div>
              <h4>Connection data</h4>
              <ul>
                {state.deviceList.map((dev: Device) => (
                  <li key={`${dev.productId}-${dev.vendorId}: ${dev.path}`}>{`${dev.productId}-${dev.vendorId}: ${dev.path}`}</li>
                ))}
              </ul>
            </div>
          </Col>
          <Col md={6}>
            <div>
              <h4>Connected device</h4>
              <ul>
                <li>{`product ID: ${state.currentDevice?.productId}`}</li>
                <li>{`vendor ID: ${state.currentDevice?.vendorId}`}</li>
                <li>{`COM path: ${state.currentDevice?.path}`}</li>
                <li>{`SerialNumber: ${state.currentDevice?.serialNumber}`}</li>
                <li>{`Connected?: ${state.currentDevice?.port?.isConnected}`}</li>
                <li style={{ overflowWrap: "anywhere" }}>{`Commands?: ${JSON.stringify(
                  state.currentDevice?.commands?.help,
                )}`}</li>
              </ul>
              <ul>
                {state.currentDevice !== undefined && Array.isArray(state.currentDevice.commands)
                  ? state.currentDevice.commands?.map((command: string) => <li key={`${command}`}>{`${command}`}</li>)
                  : ""}
              </ul>
            </div>
          </Col>
        </Row>
      </Container>
    </Styles>
  );
};

export default BazecorDevtools;

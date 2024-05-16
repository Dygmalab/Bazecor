/* eslint-disable no-console */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2023  DygmaLab SE
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState } from "react";
import log from "electron-log/renderer";
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { useDevice, DeviceTools } from "@Renderer/DeviceContext";
import { NavigationButton, RegularButton } from "../component/Button";
import { IconHome } from "../component/Icon";
import HID from "../../api/hid/hid";
import Device from "../../api/comms/Device";

const Styles = Styled.div`
.button-container {

}
`;

const BazecorDevtools = () => {
  const { state, dispatch } = useDevice();

  // HID devices connectiont tools
  let connectedDevice: undefined | HIDDevice;
  const [hid] = useState(new HID());
  const [keymap, setKeymap] = useState("");

  const onGetHIDDevices = async () => {
    const gDevices = await HID.getDevices();
    log.info(gDevices);
  };

  const onHIDConnect = async () => {
    try {
      connectedDevice = await hid.connectDevice(0);
      log.info("Connected to");
      log.info(connectedDevice);
    } catch (err) {
      log.info(err);
    }
  };

  const onHIDOpen = async () => {
    try {
      await hid.open();
    } catch (err) {
      log.info(err);
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
        log.info("Input reports");
        for (const inputReport of inputReports) {
          log.info(inputReport);
        }
        log.info("Output reports");
        for (const outputReport of outputReports) {
          log.info(outputReport);
        }
        log.info("Feature reports");
        for (const featureReport of featureReports) {
          log.info(featureReport);
        }
      }
    }
  };

  const onHIDHelp = async () => {
    try {
      log.info("Sending help...");
      await hid.sendData(
        "help\n",
        rxData => {
          log.info("All data received");
          log.info(rxData);
        },
        err => {
          log.info(err);
        },
      );
    } catch (err) {
      log.info(err);
    }
  };

  const onHIDGetKeymap = async () => {
    try {
      log.info("Getting keymap...");
      await hid.sendData(
        "keymap.custom\n",
        rxData => {
          log.info("All data received");
          log.info(rxData);
          const encodedRX = new TextEncoder().encode(rxData);
          log.info(encodedRX);
          setKeymap(rxData);
        },
        err => {
          log.info(err);
        },
      );
    } catch (err) {
      log.info(err);
    }
  };

  const onHIDHardcodedKeymap = async () => {
    try {
      const hardcodedKeymap =
        "41 30 31 32 33 34 45 0 0 46 35 36 37 38 39 42 43 20 26 8 21 23 47 0 0 48 28 24 12 18 19 76 57 4 22 7 9 10 17152 0 0 49 11 13 14 15 51 52 225 29 27 6 25 5 0 0 0 0 17 16 54 55 56 229 53980 17452 44 49211 49721 227 0 0 54109 54108 101 49209 49162 44 230 53852 41 0 0 0 0 0 0 0 0 0 83 0 84 85 46 42 43 0 74 82 77 75 0 0 0 0 0 95 96 97 86 0 0 70 80 81 79 78 0 0 0 0 0 92 93 94 87 0 225 0 0 0 0 0 0 0 0 0 99 89 90 91 88 0 0 0 65535 65535 65535 65535 0 0 0 0 0 0 65535 98 0 0 53 58 59 60 61 62 63 65535 65535 64 65 66 67 68 69 0 0 0 0 22710 22709 23785 0 65535 65535 0 0 23663 0 0 65535 0 0 0 22713 22711 22733 23786 0 65535 65535 0 0 23664 20866 20865 0 0 0 0 0 0 0 19682 65535 65535 65535 65535 0 0 0 0 0 0 0 65535 0 0 0 0 0 0 0 0 0 0 0 0 0 0 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 65535 10";
      await hid.sendData(
        `keymap.custom ${hardcodedKeymap}\n`,
        rxData => {
          log.info("All data received");
          log.info(rxData);
        },
        err => {
          log.info(err);
        },
      );
    } catch (err) {
      log.info(err);
    }
  };

  const onHIDSetOriginalKeymap = async () => {
    try {
      log.info("Setting original keymap...");
      await hid.sendData(
        `keymap.custom ${keymap}\n`,
        rxData => {
          log.info("All data received");
          log.info(rxData);
        },
        err => {
          log.info(err);
        },
      );
    } catch (err) {
      log.info(err);
    }
  };

  const onListSerialDevices = async () => {
    const response = await DeviceTools.list();
    log.info("Listing Serial Devices", response);
    dispatch({ type: "addDevicesList", payload: response });
  };

  const onMessageSend = async () => {
    const dev = state.currentDevice;
    const message = await dev.command("palette");
    log.info("retrieving message help: ", message);
  };

  const onSerialConnect = async (selected: number) => {
    try {
      log.info("going to connect to device: ");
      const response = await DeviceTools.connect(state.deviceList[selected]);
      dispatch({ type: "changeCurrent", payload: { selected, device: response } });
      log.info("Connected!", state);
    } catch (err) {
      log.info("error when connecting");
      log.error(err);
    }
  };

  const onSerialDisconnect = async () => {
    try {
      const response = await state.currentDevice.close();
      log.info("Disconnected!", response);
    } catch (err) {
      log.info("error when disconnecting");
      log.error(err);
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
          <Col className="col-3">
            <Link to="/device-manager" className="list-link">
              <NavigationButton
                selected={false}
                showNotif={false}
                buttonText="Device Manager"
                icoSVG={<IconHome />}
                disabled={false}
              />
            </Link>
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

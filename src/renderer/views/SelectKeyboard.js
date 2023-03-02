// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
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

import React, { Component } from "react";
import Styled from "styled-components";
import { toast } from "react-toastify";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import { RegularButton } from "../component/Button";

import PageHeader from "../modules/PageHeader";

import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Dropdown from "react-bootstrap/Dropdown";

import Focus from "../../api/focus";
import Hardware from "../../api/hardware";

import { usb, getDeviceList } from "usb";

import i18n from "../i18n";
import NeuronConnection from "../modules/NeuronConnection";
import ToastMessage from "../component/ToastMessage";

const Store = require("electron-store");
const store = new Store();

const Styles = Styled.div`
height: 100vh;
.main-container {
  overflow: hidden;
  height: 100vh;
}
.fileTest {
  display: block;
  width: 53%;
  text-align: center;
  height: 42px;
}
.keyboard-select {
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  .keyboard-row {
    justify-content: center;
    align-items: center;
    display: flex;
    padding-top: 15vh;
    .keyboard-col {
      min-width: 500px;
      max-width: 500px;

      .keyboard-card {
        background: ${({ theme }) => theme.card.background};
        border: none;
        box-shadow: none;
        .loader {
          align-self: center;
          .spinner-border {
            width: 4rem;
            height: 4rem;
          }
        }
        .preview {
          justify-content: center;
          align-items: center;
          display: flex;
          padding: 0px;

          .keyboard {
            justify-content: center;
            align-items: center;
            display: flex;
            svg {
              width: 80%;
              margin-bottom: 10px;
            }
          }
          .options {
            text-align: center;
            .selector {
              width: 100%;
              .dropdown-toggle::after{
                position: absolute;
                right: 10px;
                top: 30px;
              }
              .toggler {
                width: 100%;
                background-color: transparent;
                color: ${({ theme }) => theme.colors.button.text};
                border: 0;
                border-bottom: black 1px solid;
                border-radius: 0px;
                padding-bottom: 6px;
                :hover {
                  background-color: transparent;
                }
              }
              .toggler:hover {
                border-bottom: black 2px solid;
                padding-bottom: 5px;
              }
              .toggler:focus {
                border-bottom: rgba($color: red, $alpha: 0.8) 2px solid;
                box-shadow: none;
              }
              .menu {
                width: inherit;
                justify-content: center;
                align-items: center;
                text-align: center;
              }
              .key-icon {
                background-color: ${({ theme }) => theme.colors.button.background} !important;
                border-radius: 100%;
                padding: 0;
                max-width: 50px;
                height: 50px;
                svg {
                  font-size: 2.1em;
                  margin-top: 18%;
                  width: 100%;
                  color: ${({ theme }) => theme.colors.button.text};
                }
              }
              .key-text {
                span {
                  width: 100%;
                }
              }
              .muted {
                color: rgba(140,140,140,0.8) !important;
              }
              a:hover {
                background-color: ${({ theme }) => theme.colors.button.hover} !important;
              }
              .dropdown-item {
                display: inherit;
              }
            }
            .selector-error {
              color: red;
            }
          }
        }
      }
        .buttons {
          padding: 0px;
          button {
            width: 100%;
          }
        }
    }
  }
}
`;

class SelectKeyboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedPortIndex: 0,
      opening: false,
      devices: null,
      loading: false,
      dropdownOpen: false
    };

    this.onKeyboardConnect = this.onKeyboardConnect.bind(this);
    this.scanDevices = this.scanDevices.bind(this);
    this.selectPort = this.selectPort.bind(this);
  }

  findNonSerialKeyboards = deviceList => {
    const devices = getDeviceList().map(device => device.deviceDescriptor);
    devices.forEach(desc => {
      Hardware.nonSerial.forEach(device => {
        if (desc.idVendor == device.usb.vendorId && desc.idProduct == device.usb.productId) {
          let found = false;
          deviceList.forEach(sDevice => {
            if (sDevice.device.usb.vendorId == desc.idVendor && sDevice.device.usb.productId == desc.idProduct) {
              found = true;
            }
          });
          if (!found) deviceList.push({ device: device });
        }
      });
    });
    return deviceList;
  };

  findKeyboards = async () => {
    this.setState({ loading: true });
    let focus = new Focus();
    const isIterable = this.state.devices != null && typeof this.state.devices[Symbol.iterator] === "function";
    if (focus.closed === false && isIterable) {
      this.setState({
        loading: false
      });
      return;
    }
    return new Promise(resolve => {
      focus
        .find(...Hardware.serial)
        .then(async devices => {
          console.log("Printing devices: ", devices);
          let supported_devices = [];
          for (const device of devices) {
            device.accessible = await focus.isDeviceAccessible(device);
            if (device.accessible && (await focus.isDeviceSupported(device))) {
              supported_devices.push(device);
            } else if (!device.accessible) {
              supported_devices.push(device);
            }
          }
          const list = this.findNonSerialKeyboards(supported_devices);
          this.setState({
            loading: false,
            devices: list
          });
          resolve(list.length > 0);
        })
        .catch(() => {
          const list = this.findNonSerialKeyboards([]);
          this.setState({
            loading: false,
            devices: list
          });
          resolve(list.length > 0);
        });
    });
  };

  scanDevices = async () => {
    let found = await this.findKeyboards();
    this.setState({ scanFoundDevices: found });
    setTimeout(() => {
      this.setState({ scanFoundDevices: undefined });
    }, 1000);
  };

  componentDidMount() {
    this.finder = () => {
      this.findKeyboards();
    };
    usb.on("attach", this.finder);
    usb.on("detach", this.finder);

    this.findKeyboards().then(() => {
      let focus = new Focus();
      if (!focus._port) return;

      for (let device of this.state.devices) {
        if (!device.path) continue;

        if (device.path == focus._port.path) {
          this.setState(state => ({
            selectedPortIndex: state.devices.indexOf(device)
          }));
          break;
        }
      }
    });
  }

  componentWillUnmount() {
    usb.off("attach", this.finder);
    usb.off("detach", this.finder);
  }

  selectPort = event => {
    console.log(event);
    this.setState({ selectedPortIndex: event });
  };

  onKeyboardConnect = async () => {
    this.setState({ opening: true });

    const { devices } = this.state;

    try {
      await this.props.onConnect(devices[this.state.selectedPortIndex]);
    } catch (err) {
      this.setState({
        opening: false
      });
      toast.error(<ToastMessage title={err.toString()} />);
    }
    i18n.refreshHardware(devices[this.state.selectedPortIndex]);
  };

  useAFile = async () => {
    await this.props.onFileConnect();
  };

  render() {
    const { scanFoundDevices, devices, loading, selectedPortIndex, opening, dropdownOpen } = this.state;

    const { onDisconnect } = this.props;

    let loader = null;
    if (this.state.loading) {
      loader = (
        <Card.Body className="loader">
          <Spinner className="spinner-border text-danger" role="status" />
        </Card.Body>
      );
    }

    let deviceItems = null;
    let port = null;
    if (devices && devices.length > 0) {
      deviceItems = devices.map((option, index) => {
        let neurons = store.get("neurons");
        let userName = "Neuron";
        if (neurons != undefined && option.serialNumber != undefined)
          userName = neurons.filter(n =>
            n.id.toLowerCase() == option.serialNumber > 6 ? option.serialNumber.slice(0, -6).toLowerCase() : option.serialNumber
          );
        if (userName.length > 0) {
          userName = userName[0].name;
        } else {
          userName = "";
        }
        // console.log("LOGGING", userName, option.serialNumber.slice(0, -6).toLowerCase());
        let label = option.path;
        if (option.device && option.device.info) {
          label = (
            <Col xs="10" className="key-text">
              <Col>
                <span>{option.device.info.displayName}</span>
              </Col>
              <Col>
                <span>{userName}</span>
              </Col>
              <Col>
                <span className="muted">{option.path || i18n.keyboardSelect.unknown}</span>
              </Col>
            </Col>
          );
        } else if (option.info) {
          label = (
            <Col xs="10" className="key-text">
              <Col>
                <span>{option.device.info.displayName}</span>
              </Col>
              <Col>
                <span className="muted" />
              </Col>
            </Col>
          );
        }

        return {
          index,
          displayName: option.device.info.displayName,
          userName,
          path: option.path || i18n.keyboardSelect.unknown
        };
      });

      const title = devices.map(option => {
        let neurons = store.get("neurons");
        let userName = "Neuron";
        if (neurons != undefined && option.serialNumber != undefined)
          userName = neurons.filter(n =>
            n.id.toLowerCase() == option.serialNumber > 6 ? option.serialNumber.slice(0, -6).toLowerCase() : option.serialNumber
          );
        if (userName.length > 0) {
          userName = userName[0].name;
        } else {
          userName = "";
        }
        // console.log("LOGGING", userName, option.serialNumber.slice(0, -6).toLowerCase());
        let label = option.path;
        if (option.device && option.device.info) {
          label = (
            <Col xs="12" className="key-text">
              <Col>
                <span>{option.device.info.displayName}</span>
              </Col>
              <Col>
                <span>{userName}</span>
              </Col>
              <Col>
                <span className="muted">{option.path || i18n.keyboardSelect.unknown}</span>
              </Col>
            </Col>
          );
        } else if (option.info) {
          label = (
            <Col xs="12" className="key-text">
              <Col>
                <span>{option.device.info.displayName}</span>
              </Col>
              <Col>
                <span className="muted" />
              </Col>
            </Col>
          );
        }

        return <Row key={`key-${option}`}>{label}</Row>;
      });

      port = (
        <Dropdown
          className="selector"
          show={dropdownOpen}
          onClick={() =>
            this.setState(state => {
              return { dropdownOpen: !state.dropdownOpen };
            })
          }
        >
          <Dropdown.Toggle className="toggler">{title[0]}</Dropdown.Toggle>
          <Dropdown.Menu className="menu">{deviceItems}</Dropdown.Menu>
        </Dropdown>
      );
    }

    if (devices && devices.length == 0) {
      port = <span className="selector-error">{i18n.keyboardSelect.noDevices}</span>;
    }

    let connectContent = i18n.keyboardSelect.connect;
    if (this.state.opening) {
      connectContent = <circularProgress color="secondary" size={16} />;
    }

    let connectionButton, permissionWarning;
    let focus = new Focus();
    const selectedDevice = devices && devices[this.state.selectedPortIndex];

    if (selectedDevice && !selectedDevice.accessible) {
      permissionWarning = <span className="selector-error">{i18n.keyboardSelect.permissionError}</span>;
    }

    if (focus.device && selectedDevice && selectedDevice.device == focus.device) {
      connectionButton = (
        <Button disabled={opening || (devices && devices.length === 0)} color="secondary" onClick={onDisconnect}>
          {i18n.keyboardSelect.disconnect}
        </Button>
      );
    } else {
      connectionButton = (
        <RegularButton
          disabled={(selectedDevice ? !selectedDevice.accessible : false) || opening || (devices && devices.length === 0)}
          style="primary"
          onClick={this.onKeyboardConnect}
          buttonText={i18n.keyboardSelect.connect}
          className=""
        >
          {connectContent}
        </RegularButton>
      );
    }

    let preview;
    if (
      devices &&
      devices[this.state.selectedPortIndex] &&
      devices[this.state.selectedPortIndex].device &&
      devices[this.state.selectedPortIndex].device.components
    ) {
      const Keymap = devices[this.state.selectedPortIndex].device.components.keymap;
      preview = <Keymap index={0} className="" showUnderglow={true} />;
    }

    return (
      <Styles>
        <Container fluid className="keyboard-select center-content">
          <PageHeader text={i18n.keyboardSelect.title} />
          <NeuronConnection
            loading={loading}
            scanFoundDevices={scanFoundDevices != undefined ? scanFoundDevices : false}
            scanDevices={this.scanDevices}
            cantConnect={(selectedDevice ? !selectedDevice.accessible : false) || opening || (devices && devices.length === 0)}
            onKeyboardConnect={this.onKeyboardConnect}
            connected={focus.device && selectedDevice && selectedDevice.device == focus.device}
            onDisconnect={onDisconnect}
            deviceItems={deviceItems != null ? deviceItems : []}
            selectPort={this.selectPort}
            selectedPortIndex={selectedPortIndex}
          />
          <div className="fileTest">
            <Button onClick={this.useAFile}>Use a file</Button>
          </div>
        </Container>
      </Styles>
    );
  }
}

export default SelectKeyboard;

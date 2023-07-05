// General imports
import React, { useState, useEffect } from "react";
import i18n from "../i18n";
import Focus from "../../api/focus";

// Bootstrap components imports
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Custom component imports
import PageHeader from "../modules/PageHeader";
import { BatterySettings, RFSettings } from "../modules/Settings";
import { LogoLoader } from "../component/Loader";

const Styles = Styled.div`
  height: 100%;
  .wireless {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    height: 100%;
  }
  .wirelessInner {
    max-width: 960px;
    width: 100%;
    margin: auto;
  }
`;

const Wireless = ({ inContext, connected, allowBeta, updateAllowBeta, cancelContext, startContext }) => {
  const [wireless, setWireless] = useState({});
  const [modified, setModified] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getWirelessPreferences();
  }, []);

  async function sendRePairCommand() {
    let focus = new Focus();
    const result = await focus.command("wireless.rf.syncPairing");
    console.log("command returned", result);
  }

  async function toggleSavingMode() {
    let focus = new Focus();
    await focus.command("wireless.battery.savingMode", !wireless.battery.savingMode);
    let newWireless = { ...wireless };
    newWireless.battery.savingMode = !wireless.battery.savingMode;
    setWireless(newWireless);
  }

  async function destroyContext() {
    setWireless({});
    setModified(false);
    getWirelessPreferences();
    cancelContext();
  }

  async function changeWireless(wireless) {
    setWireless(wireless);
    if (!modified) {
      setModified(true);
      startContext();
    }
  }

  async function saveWirelessChanges() {
    const focus = new Focus();

    // Commands to be sent to the keyboard
    await focus.command("wireless.battery.savingMode", wireless.battery.savingMode);
    await focus.command("wireless.energy.modes", wireless.energy.modes);
    await focus.command("wireless.energy.currentMode", wireless.energy.currentMode);
    await focus.command("wireless.energy.disable", wireless.energy.disable);
    await focus.command("wireless.bluetooth.devices", wireless.bluetooth.devices);
    await focus.command("wireless.bluetooth.state", wireless.bluetooth.state);
    await focus.command("wireless.bluetooth.stability", wireless.bluetooth.stability);
    await focus.command("wireless.rf.channelHop", wireless.rf.channelHop);
    await focus.command("wireless.rf.state", wireless.rf.state);
    await focus.command("wireless.rf.stability", wireless.rf.stability);
  }

  async function getWirelessPreferences() {
    const focus = new Focus();
    // Use focus commands to retrieve wireless data
    let wireless = {};

    // Battery commands
    wireless.battery = {};
    await focus.command("wireless.battery.left.level").then(batteryLevel => {
      wireless.battery.LeftLevel = batteryLevel ? parseInt(batteryLevel) : 100;
    });
    await focus.command("wireless.battery.right.level").then(batteryLevel => {
      wireless.battery.RightLevel = batteryLevel ? parseInt(batteryLevel) : 100;
    });
    await focus.command("wireless.battery.left.state").then(state => {
      wireless.battery.LeftState = state ? parseInt(state) : 0;
    });
    await focus.command("wireless.battery.right.state").then(state => {
      wireless.battery.RightState = state ? parseInt(state) : 0;
    });
    await focus.command("wireless.battery.savingMode").then(batteryMode => {
      wireless.battery.savingMode = batteryMode;
    });

    // Energy commands
    wireless.energy = {};
    await focus.command("wireless.energy.modes").then(energyModes => {
      wireless.energy.modes = energyModes;
    });
    await focus.command("wireless.energy.currentMode").then(energyMode => {
      wireless.energy.currentMode = energyMode;
    });
    await focus.command("wireless.energy.disable").then(energyDisable => {
      wireless.energy.disable = energyDisable;
    });

    // Bluetooth commands
    wireless.bluetooth = {};
    await focus.command("wireless.bluetooth.devices").then(bluetoothDevices => {
      wireless.bluetooth.devices = bluetoothDevices;
    });
    await focus.command("wireless.bluetooth.state").then(bluetoothState => {
      wireless.bluetooth.state = bluetoothState;
    });
    await focus.command("wireless.bluetooth.stability").then(bluetoothStability => {
      wireless.bluetooth.stability = bluetoothStability;
    });

    // rf commands
    wireless.rf = {};
    await focus.command("wireless.rf.channelHop").then(rfChannelHop => {
      wireless.rf.channelHop = rfChannelHop;
    });
    await focus.command("wireless.rf.state").then(rfState => {
      wireless.rf.state = rfState;
    });
    await focus.command("wireless.rf.stability").then(rfStability => {
      wireless.rf.stability = rfStability;
    });

    setWireless(wireless);
    setLoading(false);
  }

  if (loading) <LogoLoader />;
  return (
    <Styles>
      <Container fluid className="wireless center-content">
        <PageHeader
          text={i18n.wireless.title}
          showSaving={true}
          showContentSelector={false}
          saveContext={saveWirelessChanges}
          destroyContext={destroyContext}
          inContext={modified}
        />
        <div className="wirelessWrapper">
          <div className="wirelessInner">
            <Row>
              <Col md={6}>
                <BatterySettings
                  wireless={wireless}
                  changeWireless={changeWireless}
                  toggleSavingMode={toggleSavingMode}
                  batteryStatusLeft={0xff}
                  batteryStatusRight={0xff}
                />
              </Col>
              <Col md={6}>
                <RFSettings wireless={wireless} changeWireless={changeWireless} sendRePair={sendRePairCommand} />
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </Styles>
  );
};

export default Wireless;

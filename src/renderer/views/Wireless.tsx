// General imports
import React, { useState, useEffect } from "react";

// Bootstrap components imports
import Styled from "styled-components";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

// Custom component imports
import { LogoLoader } from "@Renderer/component/Loader";
import ConnectionStatus from "@Renderer/component/ConnectionStatus";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { BatterySettings, EnergyManagement, RFSettings } from "@Renderer/modules/Settings";

// Import Types for wireless
import { WirelessPropsInterface, WirelessInterface } from "@Renderer/types/wireless";

import Focus from "../../api/focus";
import i18n from "../i18n";

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
    padding: 2rem 0;
  }
`;

const initialWireless = {
  battery: {
    LeftLevel: 0,
    RightLevel: 0,
    LeftState: 0,
    RightState: 0,
    savingMode: false,
  },
  energy: {
    modes: 0,
    currentMode: 0,
    disable: 0,
  },
  bluetooth: {
    infoChannel1: "",
    infoChannel2: "",
    infoChannel3: "",
    infoChannel4: "",
    infoChannel5: "",
    deviceName: "",
  },
  rf: {
    channelHop: 0,
    power: 0,
  },
  brightness: 0,
  brightnessUG: 0,
  fade: 0,
  idleleds: 0,
};

function Wireless(props: WirelessPropsInterface) {
  const { startContext, cancelContext } = props;
  const [wireless, setWireless] = useState<WirelessInterface>(initialWireless);
  const [modified, setModified] = useState(false);
  const [loading, setLoading] = useState(true);

  async function getWirelessPreferences() {
    const focus = new Focus();
    // Use focus commands to retrieve wireless data
    // Battery commands

    await focus.command("wireless.battery.left.level").then(batteryLevel => {
      wireless.battery.LeftLevel = batteryLevel ? parseInt(batteryLevel, 10) : 100;
    });
    await focus.command("wireless.battery.right.level").then(batteryLevel => {
      wireless.battery.RightLevel = batteryLevel ? parseInt(batteryLevel, 10) : 100;
    });
    await focus.command("wireless.battery.left.status").then(state => {
      wireless.battery.LeftState = state ? parseInt(state, 10) : 0;
    });
    await focus.command("wireless.battery.right.status").then(state => {
      wireless.battery.RightState = state ? parseInt(state, 10) : 0;
    });
    await focus.command("wireless.battery.savingMode").then(batteryMode => {
      wireless.battery.savingMode = parseInt(batteryMode, 10) > 0;
    });

    // Energy saving commands

    await focus.command("led.brightness.wireless").then(brightness => {
      wireless.brightness = brightness ? parseInt(brightness, 10) : 0;
    });
    await focus.command("led.brightnessUG.wireless").then(brightnessUG => {
      wireless.brightnessUG = brightnessUG ? parseInt(brightnessUG, 10) : 0;
    });
    await focus.command("led.fade").then(fade => {
      wireless.fade = fade ? parseInt(fade, 10) : 0;
    });
    await focus.command("idleleds.wireless").then(idleleds => {
      wireless.idleleds = idleleds ? parseInt(idleleds, 10) : 0;
    });

    // Bluetooth commands

    await focus.command("wireless.bluetooth.infoChannel 1").then(infoChannel1 => {
      wireless.bluetooth.infoChannel1 = infoChannel1;
    });
    await focus.command("wireless.bluetooth.infoChannel 2").then(infoChannel2 => {
      wireless.bluetooth.infoChannel2 = infoChannel2;
    });
    await focus.command("wireless.bluetooth.infoChannel 3").then(infoChannel3 => {
      wireless.bluetooth.infoChannel3 = infoChannel3;
    });
    await focus.command("wireless.bluetooth.infoChannel 4").then(infoChannel4 => {
      wireless.bluetooth.infoChannel4 = infoChannel4;
    });
    await focus.command("wireless.bluetooth.infoChannel 5").then(infoChannel5 => {
      wireless.bluetooth.infoChannel5 = infoChannel5;
    });
    await focus.command("wireless.bluetooth.deviceName").then(bluetoothState => {
      wireless.bluetooth.deviceName = bluetoothState;
    });

    // rf commands

    await focus.command("wireless.rf.channelHop").then(rfChannelHop => {
      wireless.rf.channelHop = rfChannelHop;
    });
    await focus.command("wireless.rf.power").then(rfPower => {
      wireless.rf.power = rfPower ? parseInt(rfPower, 10) : 0;
    });

    setWireless(wireless);
    setLoading(false);
  }

  useEffect(() => {
    getWirelessPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendRePairCommand() {
    const focus = new Focus();
    const result = await focus.command("wireless.rf.syncPairing");
    console.log("command returned", result);
  }

  async function destroyContext() {
    setWireless(initialWireless);
    setModified(false);
    getWirelessPreferences();
    cancelContext();
  }

  async function changeWireless(wless: WirelessInterface) {
    setWireless(wless);
    if (!modified) {
      setModified(true);
      startContext();
    }
  }

  async function saveWirelessChanges() {
    const focus = new Focus();

    // Commands to be sent to the keyboard
    await focus.command("wireless.battery.savingMode", wireless.battery.savingMode ? 1 : 0);
    await focus.command("wireless.bluetooth.deviceName", wireless.bluetooth.deviceName);
    await focus.command("wireless.rf.channelHop", wireless.rf.channelHop);
    await focus.command("wireless.rf.power", wireless.rf.power);

    await focus.command("led.brightness.wireless", wireless.brightness);
    await focus.command("led.brightnessUG.wireless", wireless.brightnessUG);
    await focus.command("led.fade", wireless.fade);
    await focus.command("idleleds.wireless", wireless.idleleds);

    destroyContext();
  }

  if (loading) <LogoLoader />;
  return (
    <Styles>
      <Container fluid className="wireless center-content">
        <PageHeader
          text={i18n.wireless.title}
          showSaving
          saveContext={saveWirelessChanges}
          destroyContext={destroyContext}
          inContext={modified}
        />
        <div className="wirelessWrapper">
          <div className="wirelessInner">
            {/* <Row>
              <Col md={12}>
                <ConnectionStatus connection={0} />
              </Col>
            </Row> */}
            <Row>
              <Col lg={6}>
                <BatterySettings wireless={wireless} changeWireless={changeWireless} isCharging={false} />
                <EnergyManagement wireless={wireless} changeWireless={changeWireless} />
              </Col>
              <Col lg={6}>
                <RFSettings wireless={wireless} changeWireless={changeWireless} sendRePair={sendRePairCommand} />
              </Col>
            </Row>
          </div>
        </div>
      </Container>
    </Styles>
  );
}

export default Wireless;

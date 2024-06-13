/* eslint-disable react/jsx-no-bind */
// General imports
import React, { useState, useEffect } from "react";
import log from "electron-log/renderer";

// Custom component imports
import LogoLoader from "@Renderer/components/atoms/loader/LogoLoader";
import { PageHeader } from "@Renderer/modules/PageHeader";
import { BatterySettings, EnergyManagement, RFSettings } from "@Renderer/modules/Settings";

// Import Types for wireless
import { WirelessPropsInterface, WirelessInterface } from "@Renderer/types/wireless";

import { useDevice } from "@Renderer/DeviceContext";
import { i18n } from "@Renderer/i18n";

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
  true_sleep: false,
  true_sleep_time: 0,
};

const Wireless = (props: WirelessPropsInterface) => {
  const { startContext, cancelContext } = props;
  const [isSaving, setIsSaving] = useState(false);
  const { state } = useDevice();

  const [wireless, setWireless] = useState<WirelessInterface>(initialWireless);
  const [modified, setModified] = useState(false);
  const [loading, setLocalLoading] = useState(true);

  async function getWirelessPreferences() {
    setIsSaving(true);
    // Battery commands
    if (state.currentDevice) {
      await state.currentDevice.command("wireless.battery.left.level").then((batteryLevel: string) => {
        wireless.battery.LeftLevel = batteryLevel ? parseInt(batteryLevel, 10) : 100;
      });
      await state.currentDevice.command("wireless.battery.right.level").then((batteryLevel: string) => {
        wireless.battery.RightLevel = batteryLevel ? parseInt(batteryLevel, 10) : 100;
      });
      await state.currentDevice.command("wireless.battery.left.status").then((stateLeftStatus: string) => {
        wireless.battery.LeftState = stateLeftStatus ? parseInt(stateLeftStatus, 10) : 0;
      });
      await state.currentDevice.command("wireless.battery.right.status").then((stateRightStatus: string) => {
        wireless.battery.RightState = stateRightStatus ? parseInt(stateRightStatus, 10) : 0;
      });
      await state.currentDevice.command("wireless.battery.savingMode").then((batteryMode: string) => {
        wireless.battery.savingMode = parseInt(batteryMode, 10) > 0;
      });

      // Energy saving commands

      await state.currentDevice.command("led.brightness.wireless").then((brightness: string) => {
        wireless.brightness = brightness ? parseInt(brightness, 10) : 0;
      });
      await state.currentDevice.command("led.brightnessUG.wireless").then((brightnessUG: string) => {
        wireless.brightnessUG = brightnessUG ? parseInt(brightnessUG, 10) : 0;
      });
      await state.currentDevice.command("led.fade").then((fade: string) => {
        wireless.fade = fade ? parseInt(fade, 10) : 0;
      });
      await state.currentDevice.command("idleleds.wireless").then((idleleds: string) => {
        wireless.idleleds = idleleds ? parseInt(idleleds, 10) : 0;
      });

      // Bluetooth commands

      await state.currentDevice.command("wireless.bluetooth.infoChannel 1").then((infoChannel1: string) => {
        wireless.bluetooth.infoChannel1 = infoChannel1;
      });
      await state.currentDevice.command("wireless.bluetooth.infoChannel 2").then((infoChannel2: string) => {
        wireless.bluetooth.infoChannel2 = infoChannel2;
      });
      await state.currentDevice.command("wireless.bluetooth.infoChannel 3").then((infoChannel3: string) => {
        wireless.bluetooth.infoChannel3 = infoChannel3;
      });
      await state.currentDevice.command("wireless.bluetooth.infoChannel 4").then((infoChannel4: string) => {
        wireless.bluetooth.infoChannel4 = infoChannel4;
      });
      await state.currentDevice.command("wireless.bluetooth.infoChannel 5").then((infoChannel5: string) => {
        wireless.bluetooth.infoChannel5 = infoChannel5;
      });
      await state.currentDevice.command("wireless.bluetooth.deviceName").then((bluetoothState: string) => {
        wireless.bluetooth.deviceName = bluetoothState;
      });

      // rf commands

      await state.currentDevice.command("wireless.rf.channelHop").then((rfChannelHop: string) => {
        wireless.rf.channelHop = rfChannelHop ? parseInt(rfChannelHop, 10) : 0;
      });
      await state.currentDevice.command("wireless.rf.power").then((rfPower: string) => {
        wireless.rf.power = rfPower ? parseInt(rfPower, 10) : 0;
      });
    }

    setWireless(wireless);
    setLocalLoading(false);
    setIsSaving(false);
  }

  useEffect(() => {
    getWirelessPreferences();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function sendRePairCommand() {
    if (state.currentDevice) {
      const result = await state.currentDevice.command("wireless.rf.syncPairing");
      log.info("command returned", result);
    }
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
    setIsSaving(true);
    if (state.currentDevice) {
      // Commands to be sent to the keyboard
      await state.currentDevice.command("wireless.battery.savingMode", wireless.battery.savingMode ? "1" : "0");
      await state.currentDevice.command("wireless.bluetooth.deviceName", wireless.bluetooth.deviceName);
      await state.currentDevice.command("wireless.rf.channelHop", wireless.rf.channelHop.toString());
      await state.currentDevice.command("wireless.rf.power", wireless.rf.power.toString());

      await state.currentDevice.command("led.brightness.wireless", wireless.brightness.toString());
      await state.currentDevice.command("led.brightnessUG.wireless", wireless.brightnessUG.toString());
      await state.currentDevice.command("led.fade", wireless.fade.toString());
      await state.currentDevice.command("idleleds.wireless", wireless.idleleds.toString());

      await state.currentDevice.command("led.brightness.wireless", wireless.brightness.toString());
      await state.currentDevice.command("led.brightnessUG.wireless", wireless.brightnessUG.toString());
      await state.currentDevice.command("led.fade", wireless.fade.toString());
      await state.currentDevice.command("idleleds.wireless", wireless.idleleds.toString());
      await state.currentDevice.command("idleleds.true_sleep", wireless.true_sleep ? "1" : "0");
      await state.currentDevice.command("idleleds.true_sleep_time", wireless.true_sleep_time.toString());

      setIsSaving(false);
      destroyContext();
    }
  }

  if (loading) <LogoLoader />;
  return (
    <div className="h-full">
      <div className="px-3 h-full">
        <PageHeader
          text={i18n.wireless.title}
          showSaving
          saveContext={saveWirelessChanges}
          destroyContext={destroyContext}
          inContext={modified}
          isSaving={isSaving}
        />
        <div className="wirelessWrapper">
          <div className="wirelessInner">
            {/* <Row>
              <Col md={12}>
                <ConnectionStatus connection={0} />
              </Col>
            </Row> */}
            <div className="w-full flex columns-3 gap-6">
              <div>
                <BatterySettings wireless={wireless} changeWireless={changeWireless} isCharging={false} />
                <EnergyManagement wireless={wireless} changeWireless={changeWireless} />
              </div>
              <div>
                <RFSettings wireless={wireless} changeWireless={changeWireless} sendRePair={sendRePairCommand} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wireless;

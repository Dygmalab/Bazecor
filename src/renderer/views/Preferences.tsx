// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019, 2024  DygmaLab SE
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

import React, { useState, useEffect, useCallback } from "react";
import { ipcRenderer } from "electron";
import { motion } from "framer-motion";

import { toast } from "react-toastify";
import i18n from "@Renderer/i18n";
import "react-toastify/dist/ReactToastify.css";

// Custom modules imports
import { KeyboardSettings } from "@Renderer/modules/Settings/KeyboardSettings";
import {
  DeviceConnectedPreview,
  GeneralSettings,
  NeuronSettings,
  AdvancedSettings,
  LEDSettings,
  RFSettings,
  BatterySettings,
  EnergyManagement,
} from "@Renderer/modules/Settings";

import { PageHeader } from "@Renderer/modules/PageHeader";
import ToastMessage from "@Renderer/component/ToastMessage";
import {
  IconBattery,
  IconBluetooth,
  IconFlashlight,
  IconFloppyDisk,
  IconKeyboard,
  IconLogoDygma,
  IconSignal,
  IconWrench,
  IconNeuronManager,
  IconChip,
} from "@Renderer/component/Icon";
import Version from "@Renderer/component/Version/Version";

import Store from "@Renderer/utils/Store";
import { useDevice } from "@Renderer/DeviceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/ui/tabs";
import { KBDataPref, PrefState, PreferencesProps } from "@Renderer/types/preferences";
import { WirelessInterface } from "@Renderer/types/wireless";
import { LogoLoader } from "@Renderer/component/Loader";
import { Neuron } from "@Renderer/types/neurons";
import Backup from "../../api/backup";

const store = Store.getStore();

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

const initialKBData = {
  keymap: {
    custom: new Array<number>(),
    default: new Array<number>(),
    onlyCustom: 1,
  },
  ledBrightness: 255,
  ledBrightnessUG: 255,
  defaultLayer: 126,
  ledIdleTimeLimit: 0,
  qukeysHoldTimeout: 0,
  qukeysOverlapThreshold: 0,
  SuperTimeout: 0,
  SuperRepeat: 20,
  SuperWaitfor: 500,
  SuperHoldstart: 0,
  SuperOverlapThreshold: 0,
  mouseSpeed: 1,
  mouseSpeedDelay: 2,
  mouseAccelSpeed: 1,
  mouseAccelDelay: 2,
  mouseWheelSpeed: 1,
  mouseWheelDelay: 100,
  mouseSpeedLimit: 1,
  showDefaults: false,
};

const initialPreferences = {
  devTools: false,
  advanced: false,
  verboseFocus: false,
  darkMode: store.get("settings.darkMode") as string,
  neurons: store.get("neurons") as Array<Neuron>,
  selectedNeuron: 0,
  neuronID: "",
};

const Preferences = (props: PreferencesProps) => {
  const [state] = useDevice();
  const [chipID, setchipID] = useState("");
  const [bkp] = useState(new Backup());
  const [modified, setModified] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localloading, setLocalLoading] = useState(true);

  // Keyboard & App Prefrerences data storage
  const [wireless, setWireless] = useState<WirelessInterface>(initialWireless);
  const [kbData, setKbData] = useState<KBDataPref>(initialKBData);
  const [preferencesState, setPreferencesState] = useState<PrefState>(initialPreferences);

  // Destructuring PROPS
  const { inContext, connected, allowBeta, onChangeAllowBetas, startContext, cancelContext, toggleDarkMode } = props;
  const [activeTab, setActiveTab] = useState(connected ? "Keyboard" : "Application");

  const getNeuronData = useCallback(async () => {
    let localNeuronID: string = "";
    const kbData: KBDataPref = initialKBData;

    if (state.currentDevice) {
      await state.currentDevice.command("hardware.chip_id").then((neuronID: string) => {
        const neuronIDParsed = neuronID.replace(/\s/g, "");
        localNeuronID = neuronIDParsed;
      });

      await state.currentDevice.command("settings.defaultLayer").then((layer: string) => {
        const layerParsed = layer ? parseInt(layer, 10) : 126;
        kbData.defaultLayer = layerParsed <= 126 ? layerParsed : 0;
      });

      await state.currentDevice.command("keymap.onlyCustom").then((onlyCustom: string) => {
        kbData.keymap.onlyCustom = parseInt(onlyCustom, 10);
      });
      await state.currentDevice.command("led.brightness").then((brightness: string) => {
        const brightnessParsed = brightness ? parseInt(brightness, 10) : -1;
        kbData.ledBrightness = brightnessParsed;
      });

      await state.currentDevice.command("led.brightnessUG").then((brightness: string) => {
        const brightnessParsed = brightness ? parseInt(brightness, 10) : -1;
        kbData.ledBrightnessUG = brightnessParsed;
      });

      await state.currentDevice.command("idleleds.time_limit").then((limit: string) => {
        kbData.ledIdleTimeLimit = limit ? parseInt(limit, 10) : -1;
      });

      kbData.showDefaults =
        store.get("settings.showDefaults") === undefined ? false : (store.get("settings.showDefaults") as boolean);

      // QUKEYS variables commands
      await state.currentDevice.command("qukeys.holdTimeout").then((holdTimeout: string) => {
        const holdTimeoutParsed = holdTimeout ? parseInt(holdTimeout, 10) : 250;
        kbData.qukeysHoldTimeout = holdTimeoutParsed;
      });

      await state.currentDevice.command("qukeys.overlapThreshold").then((overlapThreshold: string) => {
        const overlapThresholdParsed = overlapThreshold ? parseInt(overlapThreshold, 10) : 80;
        kbData.qukeysOverlapThreshold = overlapThresholdParsed;
      });

      // SuperKeys variables commands
      await state.currentDevice.command("superkeys.timeout").then((timeout: string) => {
        const timeoutParsed = timeout ? parseInt(timeout, 10) : 250;
        kbData.SuperTimeout = timeoutParsed;
      });

      await state.currentDevice.command("superkeys.holdstart").then((holdstart: string) => {
        const holdstartParsed = holdstart ? parseInt(holdstart, 10) : 200;
        kbData.SuperHoldstart = holdstartParsed;
      });

      await state.currentDevice.command("superkeys.overlap").then((overlap: string) => {
        const overlapThreshold = overlap ? parseInt(overlap, 10) : 80;
        kbData.SuperOverlapThreshold = overlapThreshold;
      });

      // MOUSE variables commands
      await state.currentDevice.command("mouse.speed").then((speed: string) => {
        const speedParsed = speed ? parseInt(speed, 10) : 1;
        kbData.mouseSpeed = speedParsed;
      });

      await state.currentDevice.command("mouse.accelSpeed").then((accelSpeed: string) => {
        const accelSpeedParsed = accelSpeed ? parseInt(accelSpeed, 10) : 1;
        kbData.mouseAccelSpeed = accelSpeedParsed;
      });

      await state.currentDevice.command("mouse.wheelSpeed").then((wheelSpeed: string) => {
        const wheelSpeedParsed = wheelSpeed ? parseInt(wheelSpeed, 10) : 1;
        kbData.mouseWheelSpeed = wheelSpeedParsed;
      });

      await state.currentDevice.command("mouse.speedLimit").then((speedLimit: string) => {
        const speedLimitParsed = speedLimit ? parseInt(speedLimit, 10) : 127;
        kbData.mouseSpeedLimit = speedLimitParsed;
      });

      setKbData(prevKbData => ({
        ...prevKbData,
        ...kbData,
      }));
      setPreferencesState(prevPreferencesState => ({
        ...prevPreferencesState,
        neuronID: localNeuronID,
      }));
      return localNeuronID;
    }
  }, [state.currentDevice]);

  const getWirelessPreferences = useCallback(async () => {
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
    setIsSaving(false);
  }, []);

  const saveKeymapChanges = async () => {
    if (state.currentDevice) {
      await state.currentDevice.command("keymap.onlyCustom", kbData.keymap.onlyCustom);
      await state.currentDevice.command("settings.defaultLayer", kbData.defaultLayer);
      await state.currentDevice.command("led.brightness", kbData.ledBrightness);
      await state.currentDevice.command("led.brightnessUG", kbData.ledBrightnessUG);
      if (kbData.ledIdleTimeLimit >= 0) await state.currentDevice.command("idleleds.time_limit", kbData.ledIdleTimeLimit);
      store.set("settings.showDefaults", kbData.showDefaults);
      // QUKEYS
      await state.currentDevice.command("qukeys.holdTimeout", kbData.qukeysHoldTimeout);
      await state.currentDevice.command("qukeys.overlapThreshold", kbData.qukeysOverlapThreshold);
      // SUPER KEYS
      await state.currentDevice.command("superkeys.timeout", kbData.SuperTimeout);
      await state.currentDevice.command("superkeys.repeat", kbData.SuperRepeat);
      await state.currentDevice.command("superkeys.waitfor", kbData.SuperWaitfor);
      await state.currentDevice.command("superkeys.holdstart", kbData.SuperHoldstart);
      await state.currentDevice.command("superkeys.overlap", kbData.SuperOverlapThreshold);
      // MOUSE KEYS
      await state.currentDevice.command("mouse.speed", kbData.mouseSpeed);
      await state.currentDevice.command("mouse.speedDelay", kbData.mouseSpeedDelay);
      await state.currentDevice.command("mouse.accelSpeed", kbData.mouseAccelSpeed);
      await state.currentDevice.command("mouse.accelDelay", kbData.mouseAccelDelay);
      await state.currentDevice.command("mouse.wheelSpeed", kbData.mouseWheelSpeed);
      await state.currentDevice.command("mouse.wheelDelay", kbData.mouseWheelDelay);
      await state.currentDevice.command("mouse.speedLimit", kbData.mouseSpeedLimit);
    }
  };

  const saveWirelessChanges = async () => {
    if (state.currentDevice) {
      // Commands to be sent to the keyboard
      await state.currentDevice.command("wireless.battery.savingMode", wireless.battery.savingMode ? 1 : 0);
      await state.currentDevice.command("wireless.bluetooth.deviceName", wireless.bluetooth.deviceName);
      await state.currentDevice.command("wireless.rf.channelHop", wireless.rf.channelHop);
      await state.currentDevice.command("wireless.rf.power", wireless.rf.power);

      await state.currentDevice.command("led.brightness.wireless", wireless.brightness);
      await state.currentDevice.command("led.brightnessUG.wireless", wireless.brightnessUG);
      await state.currentDevice.command("led.fade", wireless.fade);
      await state.currentDevice.command("idleleds.wireless", wireless.idleleds);

      await state.currentDevice.command("led.brightness.wireless", wireless.brightness);
      await state.currentDevice.command("led.brightnessUG.wireless", wireless.brightnessUG);
      await state.currentDevice.command("led.fade", wireless.fade);
      await state.currentDevice.command("idleleds.wireless", wireless.idleleds);
      await state.currentDevice.command("idleleds.true_sleep", wireless.true_sleep ? 1 : 0);
      await state.currentDevice.command("idleleds.true_sleep_time", wireless.true_sleep_time);
    }
  };

  const saveContext = async () => {
    setIsSaving(true);

    try {
      await saveKeymapChanges();
      await saveWirelessChanges();

      const commands = await Backup.Commands(state.currentDevice);
      const backup = await bkp.DoBackup(commands, preferencesState.neuronID, state.currentDevice);
      Backup.SaveBackup(backup, state.currentDevice);

      toast.success(<ToastMessage title={i18n.success.preferencesSaved} icon={<IconFloppyDisk />} />, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        icon: "",
      });
    } catch (error) {
      console.error(error);
      toast.error(
        <ToastMessage
          title={i18n.errors.preferenceFailOnSave}
          content={i18n.errors.preferenceFailOnSaveBody}
          icon={<IconFloppyDisk />}
        />,
        {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          icon: "",
        },
      );
    }
    await destroyContext();
    setIsSaving(false);
  };

  const destroyContext = async () => {
    setKbData(initialKBData);
    setPreferencesState(initialPreferences);
    if (state.currentDevice.device.info.keyboardType === "wireless") setWireless(initialWireless);
    getNeuronData();
    if (state.currentDevice.device.info.keyboardType === "wireless") getWirelessPreferences();
    setModified(false);
    cancelContext();
  };

  const updateKBData = (newKbData: KBDataPref) => {
    if (modified === false) {
      startContext();
      setKbData(newKbData);
      setModified(true);
    } else {
      setKbData(newKbData);
    }
  };

  const selectDefaultLayer = (value: string) => {
    const newKBData = { ...kbData, defaultLayer: parseInt(value, 10) };
    updateKBData(newKBData);
  };

  const onChangeOnlyCustomLayers = (checked: boolean) => {
    const newKBData = { ...kbData };
    newKBData.keymap.onlyCustom = checked ? 1 : 0;
    updateKBData(newKBData);
  };

  // NON-KEYBOARD PREFERENCES FUNCTIONS

  const onChangeDevTools = async (checked: boolean) => {
    try {
      await ipcRenderer.invoke("manage-devtools", checked);
      setPreferencesState(prevState => ({
        ...prevState,
        devTools: checked,
      }));
    } catch (error) {
      console.error("error when opening devTools");
    }
  };

  const selectDarkMode = (key: string) => {
    toggleDarkMode(key);
    setPreferencesState(prevState => ({
      ...prevState,
      darkMode: key,
    }));
  };

  const onChangeVerbose = () => {
    setPreferencesState(prevState => ({
      ...prevState,
      verboseFocus: !prevState.verboseFocus,
    }));
  };

  const openDevTool = useCallback(() => {
    setPreferencesState(prefState => ({ ...prefState, devTools: true }));
  }, []);

  const closeDevTool = useCallback(() => {
    setPreferencesState(prefState => ({ ...prefState, devTools: false }));
  }, []);

  // NEURON FUNCTIONS
  const selectNeuron = (value: string) => {
    setPreferencesState(prevState => ({
      ...prevState,
      selectedNeuron: parseInt(value, 10),
    }));
  };

  const applyNeurons = (neurons: Neuron[]) => {
    store.set("neurons", neurons);
  };

  const updateNeuronName = (data: string) => {
    const neuronsToChangeName = preferencesState.neurons;
    neuronsToChangeName[preferencesState.selectedNeuron].name = data;
    setPreferencesState(prevState => ({
      ...prevState,
      neurons: neuronsToChangeName,
    }));
    applyNeurons(neuronsToChangeName);
  };

  const deleteNeuron = () => {
    const result = window.confirm(i18n.keyboardSettings.neuronManager.deleteNeuron);
    if (result) {
      const newNeurons = JSON.parse(JSON.stringify(preferencesState.neurons));
      newNeurons.splice(preferencesState.selectedNeuron, 1);
      setPreferencesState(prevState => ({
        ...prevState,
        neurons: newNeurons,
        selectedNeuron:
          newNeurons.length - 1 > preferencesState.selectedNeuron ? preferencesState.selectedNeuron : newNeurons.length - 1,
      }));
      applyNeurons(newNeurons);
    }
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  // WIRELESS PREFERENCES FUNCTIONS

  const updateWireless = (wless: WirelessInterface) => {
    setWireless(wless);
    if (!modified) {
      setModified(true);
      startContext();
    }
  };

  const sendRePairCommand = async () => {
    if (state.currentDevice) {
      try {
        const result = await state.currentDevice.command("wireless.rf.syncPairing");
        console.log("command returned", result);
        toast.success(<ToastMessage title={`${i18n.success.pairedSuccesfully}`} icon={<IconChip />} />, {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: false,
          draggable: false,
          progress: undefined,
          icon: "",
        });
      } catch (error) {}
    }
  };

  // USE EFFECTS!!!

  useEffect(() => {
    const init = async () => {
      let NID = await getNeuronData();
      if (connected && state.currentDevice.device.info.keyboardType === "wireless") await getWirelessPreferences();
      const devTools = await ipcRenderer.invoke("is-devtools-opened");
      let darkMode = store.get("settings.darkMode") as string;
      if (!darkMode) {
        darkMode = "system";
      }
      setPreferencesState(prevPreferencesState => ({
        ...prevPreferencesState,
        devTools,
        darkMode,
        selectedNeuron: prevPreferencesState.neurons.indexOf(prevPreferencesState.neurons.find((x: Neuron) => x.id === NID)),
        verboseFocus: true,
      }));

      ipcRenderer.on("opened-devtool", openDevTool);
      ipcRenderer.on("closed-devtool", closeDevTool);
      await getNeuronData();
      setModified(false);
      setLocalLoading(false);
    };
    init();
    return () => {
      ipcRenderer.off("opened-devtool", openDevTool);
      ipcRenderer.off("close-devtool", closeDevTool);
    };
  }, []);

  // Render variables
  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const { neurons, selectedNeuron, darkMode, neuronID, devTools, verboseFocus } = preferencesState;
  const { defaultLayer } = kbData;

  console.log("current Neuron: ", state.currentDevice, neuronID, "connected?: ", connected);
  if (localloading) <LogoLoader />;

  return (
    <div className="px-2">
      <PageHeader
        text={i18n.preferences.title}
        showSaving
        contentSelector={false}
        saveContext={saveContext}
        destroyContext={destroyContext}
        inContext={modified}
        isSaving={isSaving}
      />
      <div className="flex w-full mx-auto mt-4">
        <Tabs
          defaultValue="Application"
          orientation="vertical"
          className="w-full"
          value={activeTab}
          onValueChange={handleTabChange}
        >
          <div className="flex gap-3 w-full pb-4">
            <TabsList className="sticky top-0 flex flex-col self-start gap-1 px-4 py-4 text-left min-w-64 rounded-xl bg-tabMenu dark:bg-tabMenuDark">
              {connected && state.currentDevice ? (
                <>
                  <DeviceConnectedPreview
                    deviceName={neurons.find(x => x.id === neuronID) ? neurons.find(x => x.id === neuronID).name : ""}
                    deviceDisplayName={state.currentDevice.device.info.displayName}
                    nameChange={updateNeuronName}
                  />
                  <h4 className="uppercase text-xs dark:text-gray-300 pb-2 mb-1 mt-3 border-solid border-b border-gray-300/30 dark:border-gray-300/30">
                    Device settings
                  </h4>
                  <TabsTrigger value="Keyboard" variant="tab">
                    <IconKeyboard /> Typing and Keys
                  </TabsTrigger>
                  <TabsTrigger value="LED" variant="tab">
                    <IconFlashlight /> LED
                  </TabsTrigger>
                  {state.currentDevice.device.info.keyboardType === "wireless" && (
                    <>
                      <TabsTrigger value="Battery" variant="tab">
                        <IconBattery /> Battery Management
                      </TabsTrigger>
                      {/* <TabsTrigger value="Bluetooth" variant="tab">
                        <IconBluetooth /> Bluetooth Settings
                      </TabsTrigger> */}
                      <TabsTrigger value="RF" variant="tab">
                        <IconSignal /> RF Settings
                      </TabsTrigger>
                    </>
                  )}
                  <TabsTrigger value="Advanced" variant="tab">
                    <IconWrench /> Advanced
                  </TabsTrigger>
                </>
              ) : null}
              <h4
                className={`uppercase text-xs dark:text-gray-300 pb-2 mb-1 border-solid border-b border-gray-300/30 dark:border-gray-300/30 ${
                  connected ? "mt-3" : ""
                }`}
              >
                Global settings
              </h4>
              <TabsTrigger value="Application" variant="tab">
                <IconLogoDygma /> Application
              </TabsTrigger>
              {connected && state.currentDevice ? (
                <TabsTrigger value="NeuronManager" variant="tab">
                  <IconNeuronManager /> Neuron Manager
                </TabsTrigger>
              ) : (
                ""
              )}
            </TabsList>
            <div className="rounded-xl bg-gray-25/50 dark:bg-gray-400/15 px-4 py-3 w-full">
              {connected && state.currentDevice ? (
                <>
                  <TabsContent value="Keyboard" className="w-full">
                    <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                      <KeyboardSettings kbData={kbData} setKbData={updateKBData} connected={connected} />
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="LED">
                    <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                      <LEDSettings
                        kbData={kbData}
                        wireless={wireless}
                        setKbData={updateKBData}
                        setWireless={updateWireless}
                        connected={connected}
                        isWireless={state.currentDevice.device.info.keyboardType === "wireless"}
                      />
                    </motion.div>
                  </TabsContent>
                  {state.currentDevice.device.info.keyboardType === "wireless" && (
                    <>
                      <TabsContent value="Battery">
                        <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                          <BatterySettings wireless={wireless} changeWireless={updateWireless} isCharging={false} />
                          <EnergyManagement wireless={wireless} changeWireless={updateWireless} />
                        </motion.div>
                      </TabsContent>
                      {/* <TabsContent value="Bluetooth">
                        <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                          Bluetooth Settings
                        </motion.div>
                      </TabsContent> */}
                      <TabsContent value="RF">
                        <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                          <RFSettings wireless={wireless} changeWireless={updateWireless} sendRePair={sendRePairCommand} />
                        </motion.div>
                      </TabsContent>
                    </>
                  )}
                  <TabsContent value="Advanced">
                    <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                      <AdvancedSettings
                        connected={connected}
                        defaultLayer={defaultLayer}
                        selectDefaultLayer={selectDefaultLayer}
                        keyboardType={state.currentDevice.device.info.product as string}
                        neurons={neurons}
                        neuronID={neuronID}
                        selectedNeuron={selectedNeuron}
                        updateTab={handleTabChange}
                        onlyCustomLayers={kbData.keymap.onlyCustom.toString()}
                        onChangeOnlyCustomLayers={onChangeOnlyCustomLayers}
                      />
                    </motion.div>
                  </TabsContent>
                </>
              ) : null}
              <TabsContent value="Application">
                <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                  <GeneralSettings
                    connected={connected}
                    selectDarkMode={selectDarkMode}
                    darkMode={darkMode}
                    neurons={neurons}
                    selectedNeuron={selectedNeuron}
                    devTools={devTools}
                    onChangeDevTools={onChangeDevTools}
                    verbose={verboseFocus}
                    onChangeVerbose={onChangeVerbose}
                    allowBeta={allowBeta}
                    onChangeAllowBetas={onChangeAllowBetas}
                  />
                  <Version />
                </motion.div>
              </TabsContent>
              {connected && state.currentDevice ? (
                <TabsContent value="NeuronManager">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <NeuronSettings
                      neurons={neurons}
                      selectedNeuron={selectedNeuron}
                      selectNeuron={selectNeuron}
                      applyNeurons={applyNeurons}
                      updateNeuronName={updateNeuronName}
                      deleteNeuron={deleteNeuron}
                    />
                  </motion.div>
                </TabsContent>
              ) : (
                ""
              )}
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default Preferences;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019  DygmaLab SE
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
  BackupSettings,
  DeviceConnectedPreview,
  GeneralSettings,
  NeuronSettings,
  AdvancedSettings,
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
} from "@Renderer/component/Icon";
import Version from "@Renderer/component/Version/Version";

import Store from "@Renderer/utils/Store";
import { useDevice } from "@Renderer/DeviceContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/ui/tabs";
import Backup from "../../api/backup";

const store = Store.getStore();

interface PreferencesProps {
  inContext: boolean;
  cancelContext: () => void;
  onChangeAllowBetas: (checked: boolean) => void;
  allowBeta: boolean;
  connected: boolean;
  startContext: () => void;
  toggleDarkMode: (mode: string) => void;
}

const Preferences = (props: PreferencesProps) => {
  const [state] = useDevice();
  const [bkp] = useState(new Backup());
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { inContext, connected, allowBeta, onChangeAllowBetas, startContext, cancelContext, toggleDarkMode } = props;
  const [kbData, setKbData] = useState({
    keymap: {
      custom: [],
      default: [],
      onlyCustom: "1",
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
    modified: inContext,
    showDefaults: false,
  });
  const [preferencesState, setPreferencesState] = useState({
    devTools: false,
    advanced: false,
    verboseFocus: false,
    darkMode: "system",
    neurons: store.get("neurons") as any,
    selectedNeuron: 0,
    selectNeuron: 0,
    neuronID: "",
    kbData,
    modified: inContext,
  });

  const openDevTool = useCallback(() => {
    setPreferencesState({ ...preferencesState, devTools: true });
  }, []);

  const closeDevTool = useCallback(() => {
    setPreferencesState({ ...preferencesState, devTools: false });
  }, []);

  const getNeuronData = async () => {
    const neuronData: any = {
      neuronID: "",
      kbData: {
        keymap: {},
      },
    };
    if (state.currentDevice) {
      await state.currentDevice.command("hardware.chip_id").then((neuronID: string) => {
        const neuronIDParsed = neuronID.replace(/\s/g, "");
        neuronData.neuronID = neuronIDParsed;
      });

      await state.currentDevice.command("settings.defaultLayer").then((layer: string) => {
        const layerParsed = layer ? parseInt(layer, 10) : 126;
        neuronData.kbData.defaultLayer = layerParsed <= 126 ? layerParsed : 0;
      });

      await state.currentDevice.command("keymap.onlyCustom").then((onlyCustom: string) => {
        neuronData.kbData.keymap.onlyCustom = onlyCustom;
      });
      await state.currentDevice.command("led.brightness").then((brightness: string) => {
        const brightnessParsed = brightness ? parseInt(brightness, 10) : -1;
        neuronData.kbData.ledBrightness = brightnessParsed;
      });

      await state.currentDevice.command("led.brightnessUG").then((brightness: string) => {
        const brightnessParsed = brightness ? parseInt(brightness, 10) : -1;
        neuronData.kbData.ledBrightnessUG = brightnessParsed;
      });

      await state.currentDevice.command("idleleds.time_limit").then((limit: string) => {
        neuronData.kbData.ledIdleTimeLimit = limit ? parseInt(limit, 10) : -1;
      });

      neuronData.kbData.showDefaults =
        store.get("settings.showDefaults") === undefined ? false : store.get("settings.showDefaults");

      // QUKEYS variables commands
      await state.currentDevice.command("qukeys.holdTimeout").then((holdTimeout: string) => {
        const holdTimeoutParsed = holdTimeout ? parseInt(holdTimeout, 10) : 250;
        neuronData.kbData.qukeysHoldTimeout = holdTimeoutParsed;
      });

      await state.currentDevice.command("qukeys.overlapThreshold").then((overlapThreshold: string) => {
        const overlapThresholdParsed = overlapThreshold ? parseInt(overlapThreshold, 10) : 80;
        neuronData.kbData.qukeysOverlapThreshold = overlapThresholdParsed;
      });

      // SuperKeys variables commands
      await state.currentDevice.command("superkeys.timeout").then((timeout: string) => {
        const timeoutParsed = timeout ? parseInt(timeout, 10) : 250;
        neuronData.kbData.SuperTimeout = timeoutParsed;
      });

      await state.currentDevice.command("superkeys.holdstart").then((holdstart: string) => {
        const holdstartParsed = holdstart ? parseInt(holdstart, 10) : 200;
        neuronData.kbData.SuperHoldstart = holdstartParsed;
      });

      // MOUSE variables commands
      await state.currentDevice.command("mouse.speed").then((speed: string) => {
        const speedParsed = speed ? parseInt(speed, 10) : 1;
        neuronData.kbData.mouseSpeed = speedParsed;
      });

      await state.currentDevice.command("mouse.accelSpeed").then((accelSpeed: string) => {
        const accelSpeedParsed = accelSpeed ? parseInt(accelSpeed, 10) : 1;
        neuronData.kbData.mouseAccelSpeed = accelSpeedParsed;
      });

      await state.currentDevice.command("mouse.wheelSpeed").then((wheelSpeed: string) => {
        const wheelSpeedParsed = wheelSpeed ? parseInt(wheelSpeed, 10) : 1;
        neuronData.kbData.mouseWheelSpeed = wheelSpeedParsed;
      });

      await state.currentDevice.command("mouse.speedLimit").then((speedLimit: string) => {
        const speedLimitParsed = speedLimit ? parseInt(speedLimit, 10) : 127;
        neuronData.kbData.mouseSpeedLimit = speedLimitParsed;
      });
      setKbData(prevKbData => ({
        ...prevKbData,
        ...neuronData.kbData,
      }));
      setPreferencesState(prevPreferencesState => ({
        ...prevPreferencesState,
        neuronID: neuronData.neuronID,
        kbData: {
          ...prevPreferencesState.kbData,
          ...neuronData.kbData,
        },
      }));
    }
  };

  useEffect(() => {
    const init = async () => {
      const devTools = await ipcRenderer.invoke("is-devtools-opened");
      let darkModeSetting = store.get("settings.darkMode") as string;
      if (!darkModeSetting) {
        darkModeSetting = "system";
      }
      setPreferencesState(prevPreferencesState => ({
        ...prevPreferencesState,
        devTools,
        verboseFocus: true,
        darkMode: darkModeSetting,
      }));

      ipcRenderer.on("opened-devtool", openDevTool);
      ipcRenderer.on("closed-devtool", closeDevTool);
      await getNeuronData();

      return () => {
        ipcRenderer.off("opened-devtool", openDevTool);
        ipcRenderer.off("close-devtool", closeDevTool);
      };
    };
    init();
  }, []);

  useEffect(() => {
    const fetchNewData = async () => {
      if (isSaved) {
        await getNeuronData();
        setIsSaved(false);
      }
    };
    fetchNewData();
  }, [isSaved]);

  const destroyContext = async () => {
    setKbData(prevKbData => ({
      ...prevKbData,
      modified: false,
    }));
    setPreferencesState(prevState => ({
      ...prevState,
      modified: false,
    }));
    setIsSaved(true);
    cancelContext();
  };

  const saveKeymapChanges = async () => {
    const {
      keymap,
      defaultLayer,
      showDefaults,
      ledBrightness,
      ledBrightnessUG,
      ledIdleTimeLimit,
      qukeysHoldTimeout,
      qukeysOverlapThreshold,
      SuperTimeout,
      SuperRepeat,
      SuperWaitfor,
      SuperHoldstart,
      mouseSpeed,
      mouseSpeedDelay,
      mouseAccelSpeed,
      mouseAccelDelay,
      mouseWheelSpeed,
      mouseWheelDelay,
      mouseSpeedLimit,
    } = kbData;
    setIsSaving(true);
    if (state.currentDevice) {
      await state.currentDevice.command("keymap.onlyCustom", keymap.onlyCustom);
      await state.currentDevice.command("settings.defaultLayer", defaultLayer);
      await state.currentDevice.command("led.brightness", ledBrightness);
      await state.currentDevice.command("led.brightnessUG", ledBrightnessUG);
      if (ledIdleTimeLimit >= 0) await state.currentDevice.command("idleleds.time_limit", ledIdleTimeLimit);
      store.set("settings.showDefaults", showDefaults);
      // QUKEYS
      await state.currentDevice.command("qukeys.holdTimeout", qukeysHoldTimeout);
      await state.currentDevice.command("qukeys.overlapThreshold", qukeysOverlapThreshold);
      // SUPER KEYS
      await state.currentDevice.command("superkeys.timeout", SuperTimeout);
      await state.currentDevice.command("superkeys.repeat", SuperRepeat);
      await state.currentDevice.command("superkeys.waitfor", SuperWaitfor);
      await state.currentDevice.command("superkeys.holdstart", SuperHoldstart);
      // MOUSE KEYS
      await state.currentDevice.command("mouse.speed", mouseSpeed);
      await state.currentDevice.command("mouse.speedDelay", mouseSpeedDelay);
      await state.currentDevice.command("mouse.accelSpeed", mouseAccelSpeed);
      await state.currentDevice.command("mouse.accelDelay", mouseAccelDelay);
      await state.currentDevice.command("mouse.wheelSpeed", mouseWheelSpeed);
      await state.currentDevice.command("mouse.wheelDelay", mouseWheelDelay);
      await state.currentDevice.command("mouse.speedLimit", mouseSpeedLimit);

      // TODO: Review toast popup on try/catch works well.
      try {
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
    }
  };

  const setLanguage = async (event: any) => {
    i18n.setLanguage(event.target.value);
    // await this.setState({}); // what is the meaning of this?
    await store.set("settings.language", event.target.value);
  };

  const setKbDataHandler = (newKbData: any) => {
    if (kbData.modified === false && newKbData.modified === true) {
      startContext();
      setKbData(newKbData);
      setPreferencesState({
        ...preferencesState,
        modified: newKbData.modified,
      });
    } else {
      setKbData(newKbData);
    }
  };

  const selectDefaultLayer = (value: string) => {
    if (kbData.modified === false) {
      setKbData(prevKbData => ({
        ...prevKbData,
        modified: true,
        defaultLayer: parseInt(value, 10),
      }));
      setPreferencesState(prevState => ({
        ...prevState,
        modified: true,
      }));
      startContext();
    } else {
      setKbData(prevKbData => ({
        ...prevKbData,
        defaultLayer: parseInt(value, 10),
      }));
      // this.forceUpdate(); what??
    }
  };

  // ADVANCED FUNCTIONS
  const toggleAdvanced = () => {
    setPreferencesState(prevState => ({
      ...prevState,
      advanced: !prevState.advanced,
    }));
  };

  const onChangeDevTools = async checked => {
    setPreferencesState(prevState => ({
      ...prevState,
      devTools: checked,
    }));
    await ipcRenderer.invoke("manage-devtools", checked);
    startContext();
  };

  // THEME MODE FUNCTIONS
  const selectDarkMode = (key: string) => {
    setPreferencesState(prevState => ({
      ...prevState,
      darkMode: key,
    }));
    toggleDarkMode(key);
  };

  const onChangeVerbose = () => {
    setPreferencesState(prevState => ({
      ...prevState,
      verboseFocus: !prevState.verboseFocus,
    }));
  };

  const toggleOnlyCustom = (event: any) => {
    setKbData(prevKbData => ({
      ...prevKbData,
      keymap: {
        ...prevKbData.keymap,
        onlyCustom: event.target.checked,
      },
      modified: true,
    }));
    setPreferencesState(prevState => ({
      ...prevState,
      modified: true,
    }));
    startContext();
  };

  const onChangeOnlyCustomLayers = checked => {
    setKbData(prevKbData => ({
      ...prevKbData,
      keymap: {
        ...prevKbData.keymap,
        onlyCustom: checked,
      },
      modified: true,
    }));
    setPreferencesState(prevState => ({
      ...prevState,
      modified: true,
    }));
    startContext();
  };

  // NEURON FUNCTIONS
  const selectNeuron = (value: string) => {
    setPreferencesState(prevState => ({
      ...prevState,
      selectedNeuron: parseInt(value, 10),
    }));
  };

  const applyNeuronName = (neurons: any) => {
    store.set("neurons", neurons);
  };

  const updateNeuronName = (data: string) => {
    const temp = preferencesState.neurons;
    temp[preferencesState.selectedNeuron].name = data;
    setPreferencesState(prevState => ({
      ...prevState,
      neurons: temp,
    }));
    applyNeuronName(temp);
  };

  const deleteNeuron = () => {
    const result = window.confirm(i18n.keyboardSettings.neuronManager.deleteNeuron);
    if (result) {
      const temp = JSON.parse(JSON.stringify(preferencesState.neurons));
      temp.splice(preferencesState.selectedNeuron, 1);
      setPreferencesState(prevState => ({
        ...prevState,
        neurons: temp,
        selectedNeuron: temp.length - 1 > preferencesState.selectNeuron ? preferencesState.selectNeuron : temp.length - 1,
      }));
      store.set("neurons", temp);
    }
  };

  const { neurons, selectedNeuron, darkMode, neuronID, devTools, verboseFocus, modified } = preferencesState;
  const { defaultLayer } = kbData;

  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  const ChipID = state.currentDevice.serialNumber.includes("raise")
    ? state.currentDevice.serialNumber.slice(0, -7).toLowerCase()
    : state.currentDevice.serialNumber;

  console.log("current Neuron: ", state.currentDevice, ChipID);
  console.log("Connected: ", connected);

  return (
    <>
      <div className="px-2">
        <PageHeader
          text={i18n.preferences.title}
          showSaving
          contentSelector={false}
          saveContext={saveKeymapChanges}
          destroyContext={destroyContext}
          inContext={modified}
          isSaving={isSaving}
        />
        <div className="flex w-full mx-auto mt-4">
          <Tabs defaultValue="Application" orientation="vertical" className="w-full">
            <div className="flex gap-3 w-full pb-4">
              <TabsList className="flex flex-col self-start gap-1 px-4 py-4 text-left min-w-64 rounded-xl bg-tabMenu dark:bg-tabMenuDark">
                {connected && state.currentDevice ? (
                  <>
                    <DeviceConnectedPreview
                      deviceName={neurons.find(x => x.id === ChipID) ? neurons.find(x => x.id === ChipID).name : ""}
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
                    <TabsTrigger value="Battery" variant="tab">
                      <IconBattery /> Battery Management
                    </TabsTrigger>
                    <TabsTrigger value="Bluetooth" variant="tab">
                      <IconBluetooth /> Bluetooth Settings
                    </TabsTrigger>
                    <TabsTrigger value="RF" variant="tab">
                      <IconSignal /> RF Settings
                    </TabsTrigger>
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
              </TabsList>
              <div className="rounded-xl bg-gray-25/50 dark:bg-gray-400/15 px-4 py-3 w-full">
                <TabsContent value="Keyboard" className="w-full">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <BackupSettings connected={connected} neurons={neurons} neuronID={neuronID} />
                    <NeuronSettings
                      neurons={neurons}
                      selectedNeuron={selectedNeuron}
                      selectNeuron={selectNeuron}
                      updateNeuronName={updateNeuronName}
                      deleteNeuron={deleteNeuron}
                    />
                    <KeyboardSettings kbData={kbData} setKbData={setKbDataHandler} connected={connected} />
                  </motion.div>
                </TabsContent>
                <TabsContent value="LED">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    LED
                  </motion.div>
                </TabsContent>
                <TabsContent value="Battery">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    Battery Management
                  </motion.div>
                </TabsContent>
                <TabsContent value="Bluetooth">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    Bluetooth Settings
                  </motion.div>
                </TabsContent>
                <TabsContent value="RF">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    Content RF Settings
                  </motion.div>
                </TabsContent>
                <TabsContent value="Advanced">
                  <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                    <AdvancedSettings
                      connected={connected}
                      defaultLayer={defaultLayer}
                      selectDefaultLayer={selectDefaultLayer}
                      neurons={neurons}
                      selectedNeuron={selectedNeuron}
                    />
                  </motion.div>
                </TabsContent>
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
                      onlyCustomLayers={kbData.keymap.onlyCustom}
                      onChangeOnlyCustomLayers={onChangeOnlyCustomLayers}
                    />
                    <Version />
                  </motion.div>
                </TabsContent>
              </div>
            </div>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default Preferences;

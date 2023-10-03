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
import Styled from "styled-components";

import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Spinner from "react-bootstrap/Spinner";
import { toast } from "react-toastify";
import i18n from "@Renderer/i18n";
import "react-toastify/dist/ReactToastify.css";

// Custom modules imports
import { KeyboardSettings } from "@Renderer/modules/Settings/KeyboardSettings";
import { BackupSettings, GeneralSettings, NeuronSettings, AdvancedSettings } from "@Renderer/modules/Settings";

import { PageHeader } from "@Renderer/modules/PageHeader";
import ToastMessage from "@Renderer/component/ToastMessage";
import { RegularButton } from "@Renderer/component/Button";
import { IconFloppyDisk } from "@Renderer/component/Icon";
import Version from "@Renderer/component/Version/Version";

import Store from "@Renderer/utils/Store";
import Focus from "../../api/focus";
import Backup from "../../api/backup";
import { useDevice } from "@Renderer/DeviceContext";

const store = Store.getStore();

const Styles = Styled.div`
  .toggle-button{
    text-align: center;
    padding-bottom: 8px;
  }
`;

interface PreferencesProps {
  inContext: boolean;
  cancelContext: () => void;
  updateAllowBeta: () => void;
  allowBeta: boolean;
  connected: boolean;
  startContext: () => void;
  toggleDarkMode: () => void;
}

const Preferences = (props: PreferencesProps) => {
  const [state] = useDevice();
  const [bkp, setBkp] = useState(new Backup());
  const { inContext, connected, allowBeta, updateAllowBeta, startContext, cancelContext, toggleDarkMode } = props;
  const [kbData, setKbData] = useState({
    keymap: {
      custom: [],
      default: [],
      onlyCustom: true,
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
    neurons: store.get("neurons"),
    selectedNeuron: 0,
    selectNeuron: 0,
    neuronID: "",
    kbData,
    modified: inContext,
  });

  const openDevTool = useCallback(() => {
    setPreferencesState({ ...preferencesState, devTools: true });
  }, [preferencesState]);

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
        neuronData.kbData.defaultLayer = layerParsed <= 126 ? layerParsed : 126;
      });
      await state.currentDevice.command("keymap.onlyCustom").then((onlyCustom: string) => {
        const isOnlyCustom = onlyCustom === "1";
        neuronData.kbData.keymap.onlyCustom = isOnlyCustom;
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
      setKbData({
        ...kbData,
        ...neuronData.kbData,
      });
      setPreferencesState({
        ...preferencesState,
        neuronID: neuronData.neuronID,
        kbData: {
          ...kbData,
          ...neuronData.kbData,
        },
      });
    }
  };

  useEffect(() => {
    const init = async () => {
      const devTools = await ipcRenderer.invoke("is-devtools-opened");
      let darkModeSetting = store.get("settings.darkMode") as string;
      if (!darkModeSetting) {
        darkModeSetting = "system";
      }
      setPreferencesState({ ...preferencesState, devTools, verboseFocus: true, darkMode: darkModeSetting });

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
    } = preferencesState.kbData;
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
        const commands = await bkp.Commands();
        const backup = await bkp.DoBackup(commands, preferencesState.neuronID);
        bkp.SaveBackup(backup);
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
    }
  };

  const destroyContext = async () => {
    setKbData({
      ...kbData,
      modified: false,
    });
    setPreferencesState({
      ...preferencesState,
      modified: false,
    });
    await getNeuronData();
    cancelContext();
  };
  const setLanguage = async event => {
    i18n.setLanguage(event.target.value);
    // await this.setState({}); // what is the meaning of this?
    await store.set("settings.language", event.target.value);
  };

  const setKbDataHandler = newKbData => {
    if (kbData.modified === false && newKbData.modified === true) {
      setKbData(newKbData);
      startContext();
      setPreferencesState({
        ...preferencesState,
        modified: newKbData.modified,
      });
    } else {
      setKbData(newKbData);
    }
  };

  const selectDefaultLayer = value => {
    if (kbData.modified === false) {
      setKbData({
        ...kbData,
        modified: true,
        defaultLayer: parseInt(value, 10),
      });
      setPreferencesState({
        ...preferencesState,
        modified: true,
      });
      startContext();
    } else {
      setKbData({
        ...kbData,
        defaultLayer: parseInt(value, 10),
      });
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

  const toggleDevTools = async event => {
    setPreferencesState({
      ...preferencesState,
      devTools: event.target.checked,
    });
    await ipcRenderer.invoke("manage-devtools", event.target.checked);
    startContext();
  };

  // THEME MODE FUNCTIONS
  const selectDarkMode = key => {
    setPreferencesState({
      ...preferencesState,
      darkMode: key,
    });
    toggleDarkMode(key);
  };

  const toggleVerboseFocus = event => {
    //focus.debug = !this.state.verboseFocus;
    setPreferencesState(prevState => ({
      ...preferencesState,
      verboseFocus: !prevState.verboseFocus,
    }));
  };

  const toggleOnlyCustom = event => {
    setKbData({
      ...kbData,
      keymap: {
        ...kbData.keymap,
        onlyCustom: event.target.checked,
      },
      modified: true,
    });
    setPreferencesState({
      ...preferencesState,
      modified: true,
    });
    startContext();
  };

  // NEURON FUNCTIONS
  const selectNeuron = value => {
    setPreferencesState({
      ...preferencesState,
      selectedNeuron: parseInt(value, 10),
    });
  };

  const applyNeuronName = neurons => {
    store.set("neurons", neurons);
  };

  const updateNeuronName = data => {
    const temp = preferencesState.neurons;
    temp[preferencesState.selectedNeuron].name = data;
    setPreferencesState({
      ...preferencesState,
      neurons: temp,
    });
    applyNeuronName(temp);
  };

  const deleteNeuron = async () => {
    const result = await window.confirm(i18n.keyboardSettings.neuronManager.deleteNeuron);
    if (result) {
      const temp = JSON.parse(JSON.stringify(preferencesState.neurons));
      temp.splice(preferencesState.selectedNeuron, 1);
      setPreferencesState({
        ...preferencesState,
        neurons: temp,
        selectedNeuron: temp.length - 1 > preferencesState.selectNeuron ? preferencesState.selectNeuron : temp.length - 1,
      });
      store.set("neurons", temp);
    }
  };

  const { neurons, selectedNeuron, darkMode, neuronID, devTools, verboseFocus, modified } = preferencesState;
  const { defaultLayer } = kbData;
  const devToolsSwitch = <Form.Check type="switch" checked={devTools} onChange={toggleDevTools} />;
  const verboseSwitch = <Form.Check type="switch" checked={verboseFocus} onChange={toggleVerboseFocus} />;
  const onlyCustomSwitch = <Form.Check type="switch" checked={kbData.keymap.onlyCustom} onChange={toggleOnlyCustom} />;
  const allowBetas = <Form.Check value={allowBeta} type="switch" checked={allowBeta} onChange={updateAllowBeta} />;
  /// const pairingButton = <RegularButton buttonText={"Re-Pair RF"} styles="short warning sm" onClick={sendRePairCommand} />;
  // console.log("CHECKING STATUS MOD", modified);
  // console.log("CHECKING STATUS CTX", inContext);

  return (
    <Styles>
      <Container fluid>
        <PageHeader
          text={i18n.preferences.title}
          style="pageHeaderFlatBottom"
          showSaving
          showContentSelector={false}
          saveContext={saveKeymapChanges}
          destroyContext={destroyContext}
          inContext={modified}
        />
        <div className="wrapper wrapperBackground">
          <Container fluid>
            <Row className="justify-content-center">
              <Col lg={9} xl={6}>
                <GeneralSettings
                  selectDarkMode={selectDarkMode}
                  darkMode={darkMode}
                  neurons={neurons}
                  selectedNeuron={selectedNeuron}
                  defaultLayer={defaultLayer}
                  selectDefaultLayer={selectDefaultLayer}
                  connected={connected}
                />
                <BackupSettings connected={connected} />
                <NeuronSettings
                  neurons={neurons}
                  selectedNeuron={selectedNeuron}
                  selectNeuron={selectNeuron}
                  updateNeuronName={updateNeuronName}
                  deleteNeuron={deleteNeuron}
                />
                <KeyboardSettings kbData={kbData} setKbData={setKbDataHandler} connected={connected} />
                <AdvancedSettings
                  devToolsSwitch={devToolsSwitch}
                  verboseSwitch={verboseSwitch}
                  onlyCustomSwitch={onlyCustomSwitch}
                  allowBetas={allowBetas}
                  pairingButton={<></>}
                  connected={connected}
                />
                <Version />
              </Col>
            </Row>
          </Container>
        </div>
      </Container>
    </Styles>
  );
};

export default Preferences;
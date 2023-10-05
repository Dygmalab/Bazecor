// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
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

import React, { useState, useEffect } from "react";
import { Routes, Navigate, Route, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { ipcRenderer } from "electron";
import path from "path";
import i18n from "@Renderer/i18n";

import "react-toastify/dist/ReactToastify.css";

import GlobalStyles from "@Renderer/theme/GlobalStyles";
import Light from "@Renderer/theme/LightTheme";
import Dark from "@Renderer/theme/DarkTheme";

import SelectKeyboard from "@Renderer/views/NewSelectKeyboard";
import FirmwareUpdate from "@Renderer/views/FirmwareUpdate";
import LayoutEditor from "@Renderer/views/LayoutEditor";
import MacroEditor from "@Renderer/views/MacroEditor";
import SuperkeysEditor from "@Renderer/views/SuperkeysEditor";
import Preferences from "@Renderer/views/Preferences";
import Wireless from "@Renderer/views/Wireless";
import Welcome from "@Renderer/views/Welcome";

import Header from "@Renderer/modules/NavigationMenu";
import ToastMessage from "@Renderer/component/ToastMessage";
import { IconNoSignal } from "@Renderer/component/Icon";
import BazecorDevtools from "@Renderer/views/BazecorDevtools";
import { showDevtools } from "@Renderer/devMode";

import Store from "@Renderer/utils/Store";
import Focus from "../api/focus";
import "../api/keymap";
import "../api/colormap";
import { useDevice } from "./DeviceContext";

const store = Store.getStore();

const focus = new Focus();
focus.debug = true;
focus.timeout = 5000;

const App = () => {
  const [flashing, setFlashing] = useState(false);
  const varFlashing = React.useRef(false);
  const navigate = useNavigate();
  const [state] = useDevice();
  const [appState, setAppState] = useState({
    darkMode: false,
    connected: false,
    device: null,
    pages: {},
    contextBar: false,
    fwUpdate: false,
    allowBeta: false,
    loading: true,
  });

  const updateStorageSchema = async () => {
    // Update stored settings schema
    console.log("Retrieving settings: ", store.get("settings"));
    const locale = await ipcRenderer.invoke("get-Locale");
    if (store.get("settings.language") !== undefined) {
      console.log("settings already upgraded, returning");
      i18n.setLanguage(store.get("settings.language").toString());
      return;
    }
    // create locale language identifier
    const translator = {
      en: "english",
      es: "spanish",
      fr: "french",
      de: "german",
      sv: "swedish",
      da: "danish",
      no: "norwegian",
      is: "icelandic",
    };
    // console.log("languageTEST", lang, translator[lang.split("-")[0]], translator["hh"]);

    // Store all settings from electron settings in electron store.
    const data = {} as any;
    const userPath = await ipcRenderer.invoke("get-userPath", "home");
    data.backupFolder = path.join(userPath, "Dygma", "Backups");
    data.backupFrequency = 30;
    data.language = translator[locale.split("-")[0]] !== "" ? translator[locale.split("-")[0]] : "english";
    data.darkMode = "system";
    data.showDefaults = false;
    i18n.setLanguage(data.language);
    store.set("settings", data);
    store.set("neurons", []);
    console.log("Testing results: ", data, store.get("settings"), store.get("settings.darkMode"));
  };

  useEffect(() => {
    const init = async () => {
      await updateStorageSchema();
      let isDark: boolean;
      const mode = store.get("settings.darkMode");
      isDark = mode === "dark";
      if (mode === "system") {
        isDark = await ipcRenderer.invoke("get-NativeTheme");
      }

      // Settings entry creation for the beta toggle, it will have a control in preferences to change the policy
      let allowBeta: boolean;
      if (store.has("settings.allowBeta")) {
        allowBeta = store.get("settings.allowBeta") as boolean;
      } else {
        allowBeta = true;
        store.set("settings.allowBeta", true);
      }

      setAppState({
        darkMode: isDark,
        connected: false,
        device: null,
        pages: {},
        contextBar: false,
        fwUpdate: false,
        allowBeta,
        loading: true,
      });
      localStorage.clear();
    };
    init();
  }, []);

  const forceDarkMode = (mode: any) => {
    setAppState({
      ...appState,
      darkMode: mode,
    });
  };

  const darkThemeListener = (evt, message) => {
    console.log("O.S. DarkTheme Settings changed to ", message);
    const dm = store.get("settings.darkMode");
    if (dm === "system") {
      forceDarkMode(message);
    }
  };

  const handleUSBDisconnection = async (device: any) => {
    const { connected } = appState;
    const isFlashing = varFlashing.current;
    console.log("Handling device disconnect", isFlashing);
    if (isFlashing) {
      console.log("no action due to flashing active");
      return;
    }

    if (state.currentDevice.device?.usb?.productId !== state.currentDevice.device.deviceDescriptor?.idProduct) {
      return;
    }

    // Must await this to stop re-render of components reliant on `focus.device`
    // However, it only renders a blank screen. New route is rendered below.
    if (connected) {
      toast.warning(
        <ToastMessage
          icon={<IconNoSignal />}
          title={i18n.errors.deviceDisconnected}
          content={i18n.errors.deviceDisconnectedContent}
        />,
        { icon: "" },
      );
    }
    onKeyboardDisconnect();
  };

  const usbListener = (event, response) => handleUSBDisconnection(response);

  useEffect(() => {
    const fontFace = new FontFace("Libre Franklin", "@Renderer/theme/fonts/LibreFranklin/LibreFranklin-VariableFont_wght.ttf");
    console.log("Font face: ", fontFace);
    document.fonts.add(fontFace);

    // Setting up function to receive O.S. dark theme changes
    ipcRenderer.on("darkTheme-update", darkThemeListener);
    ipcRenderer.on("usb-disconnected", usbListener);
    return () => {
      ipcRenderer.off("darkTheme-update", darkThemeListener);
      ipcRenderer.off("usb-disconnected", usbListener);
    };
  }, []);

  const startContext = () => {
    setAppState({
      ...appState,
      contextBar: true,
    });
  };

  const doCancelContext = () => {
    setAppState({
      ...appState,
      contextBar: false,
    });
  };

  const cancelContext = () => {
    doCancelContext();
  };

  const onKeyboardDisconnect = async () => {
    setAppState({
      ...appState,
      connected: false,
      device: null,
      pages: {},
    });
    if (state.currentDevice) {
      state.currentDevice.close();
    }
    localStorage.clear();
    navigate("/keyboard-select");
  };

  const onKeyboardConnect = async currentDevice => {
    console.log("Connecting to", currentDevice);

    if (currentDevice.device.bootloader) {
      appState.connected = true;
      appState.pages = {};
      appState.device = currentDevice.device;
      setAppState({ ...appState });
      navigate("/welcome");
      return [];
    }

    // console.log("Probing for Focus support...");
    // focus.setLayerSize(focus.device);
    // focus.setLEDMode(focus.device);
    // const pages = {
    //   keymap: focus.isCommandSupported("keymap.custom") || focus.isCommandSupported("keymap.map"),
    //   colormap: focus.isCommandSupported("colormap.map") && focus.isCommandSupported("palette"),
    // };

    appState.connected = true;
    appState.pages = {};
    appState.device = currentDevice;
    setAppState({ ...appState });
    // navigate(pages.keymap ? "/editor" : "/welcome");
    navigate("/editor");
    return [];
  };

  const toggleDarkMode = async mode => {
    console.log("Dark mode changed to: ", mode, "NativeTheme says: ", ipcRenderer.invoke("get-NativeTheme"));
    let isDark = mode === "dark";
    if (mode === "system") {
      isDark = await ipcRenderer.invoke("get-NativeTheme");
    }
    setAppState({
      ...appState,
      darkMode: isDark,
    });
    store.set("settings.darkMode", mode);
  };

  const toggleFlashing = async () => {
    setFlashing(!flashing);
    varFlashing.current = !flashing;
    console.log("toggled flashing to", varFlashing.current);
    if (flashing) {
      setAppState({
        ...appState,
        connected: false,
        device: null,
        pages: {},
      });
      navigate("/keyboard-select");
    }
  };

  const toggleFwUpdate = () => {
    setAppState(prev => ({
      ...prev,
      fwUpdate: !prev.fwUpdate,
    }));
  };

  const setLoadingData = (loading: boolean) => {
    setAppState(prev => ({
      ...prev,
      loading,
    }));
  };

  const updateAllowBeta = (event: any) => {
    const newValue = event.target.checked;
    // console.log("new allowBeta value: ", newValue);
    store.set("settings.allowBeta", newValue);
    setAppState({
      ...appState,
      allowBeta: newValue,
    });
  };

  const { connected, pages, contextBar, darkMode, fwUpdate, allowBeta, device, loading } = appState;

  return (
    <ThemeProvider theme={darkMode ? Dark : Light}>
      <GlobalStyles />
      <Header connected={connected} pages={pages} flashing={!connected} fwUpdate={fwUpdate || loading} allowBeta={allowBeta} />
      <div className="main-container">
        <Routes>
          <Route exact path="/" element={<Navigate to="/keyboard-select" />} />
          <Route
            path="/welcome"
            element={
              <Welcome
                path="/welcome"
                device={device}
                onConnect={onKeyboardConnect}
                titleElement={() => document.querySelector("#page-title")}
              />
            }
          />
          <Route
            path="/keyboard-select"
            element={
              <SelectKeyboard
                path="/keyboard-select"
                connected={connected}
                onConnect={onKeyboardConnect}
                onDisconnect={onKeyboardDisconnect}
                titleElement={() => document.querySelector("#page-title")}
                device={device}
                darkMode={darkMode}
              />
            }
          />
          <Route
            path="/editor"
            element={
              <LayoutEditor
                path="/editor"
                onDisconnect={onKeyboardDisconnect}
                startContext={startContext}
                cancelContext={cancelContext}
                setLoadingData={setLoadingData}
                inContext={contextBar}
                titleElement={() => document.querySelector("#page-title")}
                appBarElement={() => document.querySelector("#appbar")}
                darkMode={darkMode}
              />
            }
          />
          <Route
            path="/macros"
            element={
              <MacroEditor
                path="/macros"
                onDisconnect={onKeyboardDisconnect}
                startContext={startContext}
                cancelContext={cancelContext}
                setLoadingData={setLoadingData}
                inContext={contextBar}
                titleElement={() => document.querySelector("#page-title")}
              />
            }
          />
          <Route
            path="/superkeys"
            element={
              <SuperkeysEditor
                path="/superkeys"
                onDisconnect={onKeyboardDisconnect}
                startContext={startContext}
                cancelContext={cancelContext}
                setLoadingData={setLoadingData}
                inContext={contextBar}
                titleElement={() => document.querySelector("#page-title")}
              />
            }
          />
          <Route
            path="/firmware-update"
            element={
              <FirmwareUpdate
                path="/firmware-update"
                device={device}
                toggleFlashing={toggleFlashing}
                toggleFwUpdate={toggleFwUpdate}
                onDisconnect={onKeyboardDisconnect}
                titleElement={() => document.querySelector("#page-title")}
                darkMode={darkMode}
                allowBeta={allowBeta}
              />
            }
          />
          {showDevtools && <Route path="/bazecordevtools" element={<BazecorDevtools />} />}
          <Route
            path="/preferences"
            element={
              <Preferences
                connected={connected}
                toggleDarkMode={toggleDarkMode}
                startContext={startContext}
                cancelContext={cancelContext}
                updateAllowBeta={updateAllowBeta}
                allowBeta={allowBeta}
                inContext={contextBar}
              />
            }
          />
          <Route
            path="/wireless"
            element={
              <Wireless
                connected={connected}
                path="/wireless"
                titleElement={() => document.querySelector("#page-title")}
                darkMode={darkMode}
                toggleDarkMode={toggleDarkMode}
                startContext={startContext}
                cancelContext={cancelContext}
                updateAllowBeta={updateAllowBeta}
                allowBeta={allowBeta}
                inContext={contextBar}
              />
            }
          />
        </Routes>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={false}
        hideProgressBar={false}
        newestOnTop={false}
        draggable={false}
        closeOnClick
        pauseOnHover
        pauseOnFocusLoss
      />
    </ThemeProvider>
  );
};

export default App;

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
import { toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { ipcRenderer } from "electron";
import path from "path";
import { i18n } from "@Renderer/i18n";

import GlobalStyles from "@Renderer/theme/GlobalStyles";
import Light from "@Renderer/theme/LightTheme";
import Dark from "@Renderer/theme/DarkTheme";

import Header from "@Renderer/modules/NavigationMenu";
import SelectKeyboard from "@Renderer/views/SelectKeyboard";
import FirmwareUpdate from "@Renderer/views/FirmwareUpdate";
import LayoutEditor from "@Renderer/views/LayoutEditor";
import MacroEditor from "@Renderer/views/MacroEditor";
import SuperkeysEditor from "@Renderer/views/SuperkeysEditor";
import Preferences from "@Renderer/views/Preferences";
import Welcome from "@Renderer/views/Welcome";

import ToastMessage from "@Renderer/component/ToastMessage";
import { IconBluetooth, IconNoSignal } from "@Renderer/component/Icon";
import BazecorDevtools from "@Renderer/views/BazecorDevtools";
import { showDevtools } from "@Renderer/devMode";

import Store from "@Renderer/utils/Store";
import getTranslator from "@Renderer/utils/translator";
import { Neuron } from "@Types/neurons";
import Focus from "../api/focus";
import "../api/keymap";
import "../api/colormap";
import { useDevice } from "./DeviceContext";
import DeviceManager from "./views/DeviceManager";
import Device from "../api/comms/Device";
import { HIDNotifdevice } from "./types/hid";

const store = Store.getStore();

const focus = Focus.getInstance();
focus.debug = true;
focus.timeout = 5000;

function App() {
  const [pages, setPages] = useState({});
  const [contextBar, setContextBar] = useState(false);
  const [allowBeta, setAllowBeta] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const [connected, setConnected] = useState(false);
  const [flashing, setFlashing] = useState(false);
  const [restoredOk, setRestoredOk] = useState(true);
  const [fwUpdate, setFwUpdate] = useState(false);
  const [loading, setLoading] = useState(false);

  const { state } = useDevice();
  const navigate = useNavigate();
  const varFlashing = React.useRef(false);
  const device: any = React.useRef();

  const updateStorageSchema = async () => {
    // Update stored settings schema
    console.log("Retrieving settings: ", store.get("settings"));
    const locale = await ipcRenderer.invoke("get-Locale");
    if (store.get("settings.language") !== undefined) {
      i18n.setLanguage(store.get("settings.language").toString());
    }

    // when moving from other version, config may for superkeys may contain wrong data (wrong legnth, nulls)
    // so we have to fix it. This fix should not be here. It should be in separate file.
    // Store class could handle this kind of things.
    const neurons = store.get("neurons");
    if (neurons !== undefined) {
      (neurons as Neuron[])
        .flatMap(n => n.superkeys)
        .map(sk => sk.actions)
        .filter(a => a.length !== 5 || a.some(n => typeof n !== "number"))
        .forEach(n => {
          for (let i = 0; i < 5; i += 1) {
            if (typeof n[i] !== "number") {
              // eslint-disable-next-line no-param-reassign
              n[i] = 1;
            }
          }
        });

      store.set("neurons", neurons);
      return;
    }

    // Store all settings from electron settings in electron store.
    const data = {} as any;
    const userPath = await ipcRenderer.invoke("get-userPath", "home");
    data.backupFolder = path.join(userPath, "Dygma", "Backups");
    data.backupFrequency = 30;
    data.language = getTranslator(locale);
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
      const mode = store.get("settings.darkMode") as string;
      isDark = mode === "dark";
      if (mode === "system") {
        isDark = await ipcRenderer.invoke("get-NativeTheme");
        if (isDark) {
          document.documentElement.classList.remove("light");
          document.documentElement.classList.add("dark");
        }
      } else {
        document.documentElement.classList.add(mode);
      }

      // Settings entry creation for the beta toggle, it will have a control in preferences to change the policy
      let getAllowBeta: boolean;
      if (store.has("settings.allowBeta")) {
        getAllowBeta = store.get("settings.allowBeta") as boolean;
      } else {
        getAllowBeta = true;
        store.set("settings.allowBeta", true);
      }

      setDarkMode(isDark);
      setConnected(false);
      device.current = null;
      setPages({});
      setContextBar(false);
      setAllowBeta(getAllowBeta);
      setLoading(true);
      setFwUpdate(false);
      localStorage.clear();
    };
    init();
  }, []);

  const startContext = () => {
    setContextBar(true);
  };

  const cancelContext = () => {
    setContextBar(false);
  };

  const onKeyboardDisconnect = () => {
    console.log("disconnecting Keyboard!");
    console.log(state);
    setConnected(false);
    setPages({});
    device.current = null;
    localStorage.clear();
    navigate("/keyboard-select");
  };

  const onKeyboardConnect = async (currentDevice: Device) => {
    console.log("Connecting to", currentDevice);

    if (currentDevice.device.bootloader) {
      setConnected(true);
      device.current = currentDevice.device;
      setPages({});
      navigate("/welcome");
      return;
    }

    console.log("VERSION: ", await currentDevice.command("version"));

    setConnected(true);
    device.current = currentDevice;
    setPages({ keymap: true });
    setLoading(true);
    // navigate(pages.keymap ? "/editor" : "/welcome");
    navigate("/editor");
  };

  const toggleDarkMode = async (mode: string) => {
    document.documentElement.classList.remove("light");
    document.documentElement.classList.remove("dark");
    document.documentElement.classList.remove("system");
    console.log("Dark mode changed to: ", mode, "NativeTheme says: ", ipcRenderer.invoke("get-NativeTheme"));
    let isDark = mode === "dark";
    if (mode === "system") {
      isDark = await ipcRenderer.invoke("get-NativeTheme");
      if (isDark) {
        document.documentElement.classList.remove("light");
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
        document.documentElement.classList.add("light");
      }
    } else {
      document.documentElement.classList.add(mode);
    }
    setDarkMode(isDark);
    store.set("settings.darkMode", mode);
  };

  const darkThemeListener = (event: any, message: boolean) => {
    console.log("O.S. DarkTheme Settings changed to ", message, event);
    const dm = store.get("settings.darkMode");
    if (dm === "system") {
      toggleDarkMode(dm);
    }
    if (dm || (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches)) {
      toggleDarkMode("dark");
    } else {
      toggleDarkMode("light");
    }
  };

  const toggleFlashing = async () => {
    setFlashing(!flashing);
    varFlashing.current = !flashing;
    console.log("toggled flashing to", !flashing);

    // if Flashing is going to be set to false from true
    if (flashing) {
      setConnected(false);
      device.current = null;
      setPages({});
      navigate("/keyboard-select");
    }
  };

  const handleDeviceDisconnection = async (dev: any) => {
    const isFlashing = varFlashing.current;
    console.log("Handling device disconnect", isFlashing, dev, device);
    if (isFlashing) {
      console.log("no action due to flashing active");
      return;
    }

    // if (state.currentDevice?.device?.usb?.productId !== state.currentDevice?.device?.deviceDescriptor?.idProduct) {
    //   return;
    // }

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

  useEffect(() => {
    const fontFace = new FontFace("Libre Franklin", "@Renderer/theme/fonts/LibreFranklin/LibreFranklin-VariableFont_wght.ttf");
    console.log("Font face: ", fontFace);
    document.fonts.add(fontFace);

    const usbListener = (event: unknown, response: unknown) => handleDeviceDisconnection(JSON.parse(response as string));
    const hidListener = (event: unknown, response: unknown) =>
      handleDeviceDisconnection(JSON.parse(response as string) as HIDNotifdevice);

    const notifyBtDevice = (event: any, hidDev: string) => {
      const localDev: HIDNotifdevice = JSON.parse(hidDev);
      console.log("received connection event: ", localDev);
      toast.success(
        <ToastMessage
          icon={<IconBluetooth />}
          title="Detected Dgyma Bluetooth Device"
          content={`Found ${localDev.name} device! to connect, first press scan keyboards button in keyboard selection view`}
        />,
        { autoClose: 3000, icon: "" },
      );
    };

    // Setting up function to receive O.S. dark theme changes
    ipcRenderer.on("darkTheme-update", darkThemeListener);
    ipcRenderer.on("usb-disconnected", usbListener);
    ipcRenderer.on("hid-disconnected", hidListener);
    ipcRenderer.on("hid-connected", notifyBtDevice);
    return () => {
      ipcRenderer.off("darkTheme-update", darkThemeListener);
      ipcRenderer.off("usb-disconnected", usbListener);
      ipcRenderer.off("hid-disconnected", hidListener);
      ipcRenderer.off("hid-connected", notifyBtDevice);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleFwUpdate = async (value: boolean) => {
    console.log("toggling fwUpdate to: ", value);
    setFwUpdate(value);
  };

  const setLoadingData = (isLoading: boolean) => {
    setLoading(isLoading);
  };

  const updateAllowBetas = (checked: boolean) => {
    const newValue = checked;
    // console.log("new allowBeta value: ", newValue);
    store.set("settings.allowBeta", newValue);
    setAllowBeta(newValue);
  };

  const handleSetRestoredOk = (status: boolean) => {
    console.log("CHECK RESTORE", status);
    setRestoredOk(status);
  };

  return (
    <ThemeProvider theme={darkMode ? Dark : Light}>
      <GlobalStyles />
      <Header
        connected={connected}
        pages={pages}
        flashing={!connected}
        fwUpdate={fwUpdate}
        allowBeta={allowBeta}
        modified={contextBar}
        loading={loading}
      />
      <div className="main-container">
        <Routes>
          <Route path="/" element={<Navigate to="/keyboard-select" />} />
          <Route path="/welcome" element={<Welcome device={device} onConnect={onKeyboardConnect} />} />
          <Route path="/device-manager" element={<DeviceManager />} />
          <Route
            path="/keyboard-select"
            element={
              <SelectKeyboard
                connected={connected}
                onConnect={onKeyboardConnect}
                onDisconnect={onKeyboardDisconnect}
                device={device}
                darkMode={darkMode}
                setLoading={setLoadingData}
                restoredOk={restoredOk}
              />
            }
          />
          <Route
            path="/editor"
            element={
              <LayoutEditor
                onDisconnect={onKeyboardDisconnect}
                startContext={startContext}
                cancelContext={cancelContext}
                darkMode={darkMode}
                setLoading={setLoadingData}
                inContext={contextBar}
                restoredOk={restoredOk}
                handleSetRestoredOk={handleSetRestoredOk}
              />
            }
          />
          <Route
            path="/macros"
            element={
              <MacroEditor
                onDisconnect={onKeyboardDisconnect}
                startContext={startContext}
                cancelContext={cancelContext}
                setLoading={setLoadingData}
              />
            }
          />
          <Route
            path="/superkeys"
            element={
              <SuperkeysEditor
                onDisconnect={onKeyboardDisconnect}
                startContext={startContext}
                cancelContext={cancelContext}
                setLoading={setLoadingData}
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
                setRestoredOk={handleSetRestoredOk}
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
                toggleBackup={toggleFwUpdate}
                cancelContext={cancelContext}
                updateAllowBetas={updateAllowBetas}
                allowBeta={allowBeta}
                setLoading={setLoadingData}
              />
            }
          />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;

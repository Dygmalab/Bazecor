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

import React from "react";
import { Routes, Navigate, Route } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "styled-components";
import { ipcRenderer } from "electron";
import path from "path";
import withRouter from "@Renderer/utils/withRouter";
import i18n from "@Renderer/i18n";

import "react-toastify/dist/ReactToastify.css";

import GlobalStyles from "@Renderer/theme/GlobalStyles";
import Light from "@Renderer/theme/LightTheme";
import Dark from "@Renderer/theme/DarkTheme";

import SelectKeyboard from "@Renderer/views/SelectKeyboard";
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

const store = Store.getStore();

const focus = new Focus();
focus.debug = true;
focus.timeout = 5000;

class App extends React.Component {
  flashing = false;

  constructor(props) {
    super(props);
    this.updateStorageSchema();

    let isDark;
    const mode = store.get("settings.darkMode");
    isDark = mode === "dark";
    if (mode === "system") {
      isDark = ipcRenderer.invoke("get-NativeTheme");
    }

    // Settings entry creation for the beta toggle, it will have a control in preferences to change the policy
    let allowBeta;
    if (store.has("settings.allowBeta")) {
      allowBeta = store.get("settings.allowBeta");
    } else {
      allowBeta = true;
      store.set("settings.allowBeta", true);
    }

    this.state = {
      darkMode: isDark,
      connected: false,
      device: null,
      pages: {},
      contextBar: false,
      fwUpdate: false,
      allowBeta,
    };
    localStorage.clear();

    this.forceDarkMode = this.forceDarkMode.bind(this);
  }

  componentDidMount() {
    // Loading font to be sure it wont blink
    // document.fonts.load("Libre Franklin");

    const fontFace = new FontFace("Libre Franklin", "@Renderer/theme/fonts/LibreFranklin/LibreFranklin-VariableFont_wght.ttf");
    console.log("Font face: ", fontFace);
    document.fonts.add(fontFace);

    // Setting up function to receive O.S. dark theme changes
    ipcRenderer.on("darkTheme-update", (evt, message) => {
      console.log("O.S. DarkTheme Settings changed to ", message);
      const dm = store.get("settings.darkMode");
      if (dm === "system") {
        this.forceDarkMode(message);
      }
    });
    ipcRenderer.on("usb-disconnected", (event, response) => this.handleUSBDisconnection(response));
  }

  async handleUSBDisconnection(device) {
    const { connected } = this.state;
    console.log("Handling device disconnect");
    if (this.flashing) {
      console.log("no action due to flashing active");
      return;
    }

    if (focus.device?.usb?.productId !== device.device.deviceDescriptor?.idProduct) {
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
    this.onKeyboardDisconnect();
  }

  startContext = () => {
    this.setState({ contextBar: true });
  };

  doCancelContext = () => {
    this.setState({
      contextBar: false,
    });
  };

  cancelContext = () => {
    this.doCancelContext();
  };

  onKeyboardDisconnect = async () => {
    const { router } = this.props;
    await focus.close();
    this.setState({
      connected: false,
      device: null,
      pages: {},
    });
    localStorage.clear();
    router.navigate("/keyboard-select");
  };

  onKeyboardConnect = async (port, file) => {
    const { router } = this.props;
    await focus.close();
    if (!port.path) {
      this.setState({
        connected: true,
        pages: {},
        device: port.device,
      });

      router.navigate("/welcome");
      return [];
    }

    console.log("Connecting to", port.path);
    await focus.open(port.path, port.device, file);
    console.log("After focus.open");
    if (focus.device.bootloader) {
      this.setState({
        connected: true,
        pages: {},
        device: port,
      });
      router.navigate("/welcome");
      return [];
    }

    console.log("Probing for Focus support...");
    focus.setLayerSize(focus.device);
    focus.setLEDMode(focus.device);
    const pages = {
      keymap: focus.isCommandSupported("keymap.custom") || focus.isCommandSupported("keymap.map"),
      colormap: focus.isCommandSupported("colormap.map") && focus.isCommandSupported("palette"),
    };

    this.setState({
      connected: true,
      device: port,
      pages,
    });
    router.navigate(pages.keymap ? "/editor" : "/welcome");
    return [];
  };

  forceDarkMode = mode => {
    this.setState({
      darkMode: mode,
    });
  };

  toggleDarkMode = async mode => {
    console.log("Dark mode changed to: ", mode, "NativeTheme says: ", ipcRenderer.invoke("get-NativeTheme"));
    let isDark = mode === "dark";
    if (mode === "system") {
      isDark = ipcRenderer.invoke("get-NativeTheme");
    }
    this.setState({
      darkMode: isDark,
    });
    store.set("settings.darkMode", mode);
  };

  toggleFlashing = async () => {
    const { router } = this.props;
    this.flashing = !this.flashing;
    if (!this.flashing) {
      this.setState({
        connected: false,
        device: null,
        pages: {},
      });
      router.navigate("/keyboard-select");
    }
  };

  toggleFwUpdate = () => {
    this.setState(state => ({
      fwUpdate: !state.fwUpdate,
    }));
  };

  updateAllowBeta = event => {
    const newValue = event.target.checked;
    // console.log("new allowBeta value: ", newValue);
    store.set("settings.allowBeta", newValue);
    this.setState({
      allowBeta: newValue,
    });
  };

  async updateStorageSchema() {
    // Update stored settings schema
    console.log("Retrieving settings: ", store.get("settings"));
    const locale = await ipcRenderer.invoke("get-Locale");
    if (store.get("settings.language") !== undefined) {
      console.log("settings already upgraded, returning");
      i18n.setLanguage(store.get("settings.language"));
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
    const data = {};
    const userPath = await ipcRenderer.invoke("get-userPath", "home");
    data.backupFolder = path.join(userPath, "Dygma", "Backups");
    data.backupFrequency = 30;
    data.language = translator[locale.split("-")[0]] !== "" ? translator[locale.split("-")[0]] : "english";
    data.darkMode = "system";
    data.showDefaults = false;
    i18n.setLanguage(data.language);
    store.set("settings", data);
    store.set("neurons", []);
    this.setState();
    console.log("Testing results: ", data, store.get("settings"), store.get("settings.darkMode"));
  }

  render() {
    const { connected, pages, contextBar, darkMode, fwUpdate, allowBeta, device } = this.state;

    return (
      <ThemeProvider theme={darkMode ? Dark : Light}>
        <GlobalStyles />
        <Header connected={connected} pages={pages} flashing={!connected} fwUpdate={fwUpdate} allowBeta={allowBeta} />
        <div className="main-container">
          <Routes>
            <Route exact path="/" element={<Navigate to="/keyboard-select" />} />
            <Route
              path="/welcome"
              element={
                <Welcome
                  path="/welcome"
                  device={device}
                  onConnect={this.onKeyboardConnect}
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
                  onConnect={this.onKeyboardConnect}
                  onDisconnect={this.onKeyboardDisconnect}
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
                  onDisconnect={this.onKeyboardDisconnect}
                  startContext={this.startContext}
                  cancelContext={this.cancelContext}
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
                  onDisconnect={this.onKeyboardDisconnect}
                  startContext={this.startContext}
                  cancelContext={this.cancelContext}
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
                  onDisconnect={this.onKeyboardDisconnect}
                  startContext={this.startContext}
                  cancelContext={this.cancelContext}
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
                  toggleFlashing={this.toggleFlashing}
                  toggleFwUpdate={this.toggleFwUpdate}
                  onDisconnect={this.onKeyboardDisconnect}
                  titleElement={() => document.querySelector("#page-title")}
                  darkMode={darkMode}
                  allowBeta={allowBeta}
                />
              }
            />
            {showDevtools && (
              <Route
                path="/bazecordevtools"
                element={
                  <BazecorDevtools
                    connected={connected}
                    path="/bazecordevtools"
                    titleElement={() => document.querySelector("#page-title")}
                    darkMode={darkMode}
                    toggleDarkMode={this.toggleDarkMode}
                    startContext={this.startContext}
                    cancelContext={this.cancelContext}
                    updateAllowBeta={this.updateAllowBeta}
                    allowBeta={allowBeta}
                    inContext={contextBar}
                  />
                }
              />
            )}
            <Route
              path="/preferences"
              element={
                <Preferences
                  connected={connected}
                  path="/preferences"
                  titleElement={() => document.querySelector("#page-title")}
                  darkMode={darkMode}
                  toggleDarkMode={this.toggleDarkMode}
                  startContext={this.startContext}
                  cancelContext={this.cancelContext}
                  updateAllowBeta={this.updateAllowBeta}
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
                  toggleDarkMode={this.toggleDarkMode}
                  startContext={this.startContext}
                  cancelContext={this.cancelContext}
                  updateAllowBeta={this.updateAllowBeta}
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
  }
}

export default withRouter(App);

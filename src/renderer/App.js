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
import { Switch, Redirect, Route, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { ThemeProvider } from "styled-components";

import { usb } from "usb";

import i18n from "./i18n";

import Focus from "../api/focus";
import "../api/keymap";
import "../api/colormap";
import "react-toastify/dist/ReactToastify.css";

import GlobalStyles from "./theme/GlobalStyles";
import Light from "./theme/LightTheme";
import Dark from "./theme/DarkTheme";

import SelectKeyboard from "./views/SelectKeyboard";
import FirmwareUpdate from "./views/FirmwareUpdate";
import AltFirmwareUpdate from "./views/AltFirmwareUpdate";
import LayoutEditor from "./views/LayoutEditor";
import MacroEditor from "./views/MacroEditor";
import SuperkeysEditor from "./views/SuperkeysEditor";
import Preferences from "./views/Preferences";
import Welcome from "./views/Welcome";

import Header from "./modules/NavigationMenu";
import ToastMessage from "./component/ToastMessage";
import { IconNoSignal } from "./component/Icon";

const Store = require("electron-store");
const store = new Store();

const { ipcRenderer } = require("electron");
const path = require("path");

let focus = new Focus();
focus.debug = true;
focus.timeout = 15000;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.updateStorageSchema();

    const mode = store.get("settings.darkMode");
    let isDark = mode === "dark" ? true : false;
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
      cancelPendingOpen: false,
      fwUpdate: false,
      allowBeta: allowBeta
    };
    localStorage.clear();

    toast.configure({
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      newestOnTop: false,
      draggable: false,
      closeOnClick: true,
      pauseOnHover: true,
      pauseOnFocusLoss: true
    });

    this.forceDarkMode = this.forceDarkMode.bind(this);
  }
  flashing = false;

  async updateStorageSchema() {
    //Update stored settings schema
    console.log("Retrieving settings: ", store.get("settings"));
    const locale = await this.getLocale();
    if (store.get("settings.language") != undefined) {
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
      is: "icelandic"
    };
    // console.log("languageTEST", lang, translator[lang.split("-")[0]], translator["hh"]);

    // Store all settings from electron settings in electron store.
    let data = {};
    data.backupFolder = path.join(ipcRenderer.invoke("get-userPath", "home"), "Raise", "Backups");
    data.backupFrequency = 30;
    data.language = translator[locale.split("-")[0]] != "" ? translator[locale.split("-")[0]] : "english";
    data.darkMode = "system";
    data.showDefaults = false;
    i18n.setLanguage(data.language);
    store.set("settings", data);
    store.set("neurons", []);
    console.log("Testing results: ", data, store.get("settings"), store.get("settings.darkMode"));
  }

  async getLocale() {
    await ipcRenderer.invoke("get-Locale");
  }

  componentDidMount() {
    // Loading font to be sure it wont blink
    //document.fonts.load("Libre Franklin");

    const fontFace = new FontFace("Libre Franklin", "./theme/fonts/LibreFranklin/LibreFranklin-VariableFont_wght.ttf");
    console.log("Font face: ", fontFace);
    document.fonts.add(fontFace);

    // Setting up function to receive O.S. dark theme changes
    const self = this;
    ipcRenderer.on("darkTheme-update", function (evt, message) {
      console.log("O.S. DarkTheme Settings changed to ", message);
      let dm = store.get("settings.darkMode");
      if (dm === "system") {
        self.forceDarkMode(message);
      }
    });

    usb.on("detach", async device => {
      if (!focus.device) return;
      if (this.flashing) return;

      if (
        focus.device.usb.vendorId != device.deviceDescriptor.idVendor ||
        focus.device.usb.productId != device.deviceDescriptor.idProduct
      ) {
        return;
      }

      // Must await this to stop re-render of components reliant on `focus.device`
      // However, it only renders a blank screen. New route is rendered below.
      this.props.history.push("./");

      if (!focus._port.isOpen) {
        toast.warning(
          <ToastMessage
            icon={<IconNoSignal />}
            title={i18n.errors.deviceDisconnected}
            content={i18n.errors.deviceDisconnectedContent}
          />,
          { icon: "" }
        );
      }
      await focus.close();
      await this.setState({
        connected: false,
        device: null,
        pages: {}
      });
      // Second call to `navigate` will actually render the proper route
      this.props.history.push("/keyboard-select");
    });
  }

  forceDarkMode = mode => {
    this.setState({
      darkMode: mode
    });
  };

  toggleDarkMode = async mode => {
    console.log("Dark mode changed to: ", mode, "NativeTheme says: ", ipcRenderer.invoke("get-NativeTheme"));
    let isDark = mode === "dark" ? true : false;
    if (mode === "system") {
      isDark = ipcRenderer.invoke("get-NativeTheme");
    }
    this.setState({
      darkMode: isDark
    });
    store.set("settings.darkMode", mode);
  };

  toggleFlashing = async () => {
    this.flashing = !this.flashing;
    if (!this.flashing) {
      this.setState({
        connected: false,
        device: null,
        pages: {}
      });
      this.props.history.push("/keyboard-select");
    }
  };

  toggleFwUpdate = () => {
    this.setState({
      fwUpdate: !this.state.fwUpdate
    });
  };

  updateAllowBeta = event => {
    let newValue = event.target.checked;
    // console.log("new allowBeta value: ", newValue);
    store.set("settings.allowBeta", newValue);
    this.setState({
      allowBeta: newValue
    });
  };

  onKeyboardConnect = async (port, file) => {
    await focus.close();

    if (!port.path) {
      port.device.device = port.device;

      this.setState({
        connected: true,
        pages: {},
        device: port.device
      });
      this.props.history.push("/welcome");
      return [];
    }

    console.log("Connecting to", port.path);
    await focus.open(port.path, port.device, file);
    console.log("After focus.open");
    if (focus.device.bootloader) {
      this.setState({
        connected: true,
        pages: {},
        device: port
      });
      this.props.history.push("/welcome");
      return [];
    }

    console.log("Probing for Focus support...");
    focus.setLayerSize(focus.device);
    focus.setLEDMode(focus.device);
    const pages = {
      keymap: focus.isCommandSupported("keymap.custom") || focus.isCommandSupported("keymap.map"),
      colormap: focus.isCommandSupported("colormap.map") && focus.isCommandSupported("palette")
    };

    this.setState({
      connected: true,
      device: port,
      pages: pages
    });
    this.props.history.push(pages.keymap ? "/editor" : "/welcome");
    return [];
  };

  onKeyboardDisconnect = async () => {
    focus.close();
    this.setState({
      connected: false,
      device: null,
      pages: {}
    });
    localStorage.clear();
    this.props.history.push("/keyboard-select");
  };

  cancelContext = dirty => {
    if (dirty) {
      this.setState({ cancelPendingOpen: true });
    } else {
      this.doCancelContext();
    }
  };
  doCancelContext = () => {
    this.setState({
      contextBar: false,
      cancelPendingOpen: false
    });
  };
  cancelContextCancellation = () => {
    this.setState({ cancelPendingOpen: false });
  };
  startContext = () => {
    this.setState({ contextBar: true });
  };
  rgbString = color => {
    return `rgb(${color.r},${color.g},${color.b})`;
  };

  render() {
    const { connected, pages, contextBar, darkMode, fwUpdate, allowBeta } = this.state;

    let device =
      (focus.device && focus.device.info) ||
      (this.state.device && this.state.device.device && this.state.device.device.info) ||
      (this.state.device && this.state.device.info);

    return (
      <ThemeProvider theme={darkMode ? Dark : Light}>
        <GlobalStyles />
        <Header
          contextBar={contextBar}
          connected={connected}
          pages={pages}
          device={device}
          cancelContext={this.cancelContext}
          theme={darkMode}
          flashing={!connected}
          fwUpdate={fwUpdate}
          allowBeta={allowBeta}
        />
        <div className="main-container">
          <Switch>
            <Route exact path="/">
              <Redirect to="/keyboard-select" />
            </Route>
            <Welcome
              path="/welcome"
              device={this.state.device}
              onConnect={this.onKeyboardConnect}
              titleElement={() => document.querySelector("#page-title")}
            />
            <SelectKeyboard
              path="/keyboard-select"
              connected={connected}
              onConnect={this.onKeyboardConnect}
              onDisconnect={this.onKeyboardDisconnect}
              titleElement={() => document.querySelector("#page-title")}
              darkMode={darkMode}
            />
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
            <MacroEditor
              path="/macros"
              onDisconnect={this.onKeyboardDisconnect}
              startContext={this.startContext}
              cancelContext={this.cancelContext}
              inContext={contextBar}
              titleElement={() => document.querySelector("#page-title")}
            />
            <SuperkeysEditor
              path="/superkeys"
              onDisconnect={this.onKeyboardDisconnect}
              startContext={this.startContext}
              cancelContext={this.cancelContext}
              inContext={contextBar}
              titleElement={() => document.querySelector("#page-title")}
            />
            <AltFirmwareUpdate
              path="/firmware-update"
              device={this.state.device}
              toggleFlashing={this.toggleFlashing}
              toggleFwUpdate={this.toggleFwUpdate}
              onDisconnect={this.onKeyboardDisconnect}
              titleElement={() => document.querySelector("#page-title")}
              darkMode={darkMode}
              allowBeta={allowBeta}
            />
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
          </Switch>
        </div>
        <ToastContainer />
      </ThemeProvider>
    );
  }
}

export default withRouter(App);

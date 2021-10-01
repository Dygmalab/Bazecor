// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2020  DygmaLab SE.
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
import Styled from "styled-components";

import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Dropdown from "react-bootstrap/Dropdown";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

import RangeSlider from "react-bootstrap-range-slider";

import Focus from "../../../api/focus";
import Backup from "../../../api/backup";

import ConfirmationDialog from "../../components/ConfirmationDialog";
import SaveChangesButton from "../../components/SaveChangesButton";
import i18n from "../../i18n";
import frenchF from "../../../../static/french.png";
import germanF from "../../../../static/german.png";
import japaneseF from "../../../../static/japanese.png";
import spanishF from "../../../../static/spanish.png";
import englishUSUKF from "../../../../static/englishUSUK.png";
import danishF from "../../../../static/danish.png";
import swedishF from "../../../../static/swedish.png";
import icelandicF from "../../../../static/icelandic.png";
import norwegianF from "../../../../static/norwegian.png";

import {
  MdComputer,
  MdBrightness3,
  MdWbSunny,
  MdStorage,
  MdInfo
} from "react-icons/md";
import { BsType, BsBrightnessHigh } from "react-icons/bs";
import { BiMouse, BiCodeAlt, BiWrench } from "react-icons/bi";

import settings from "electron-settings";
import { Spinner } from "react-bootstrap";

const Styles = Styled.div`
  input[type=range].range-slider::-webkit-slider-thumb {
    background-color: ${({ theme }) => theme.slider.color};
  }
  input[type=range].range-slider.range-slider--primary:not(.disabled):focus::-webkit-slider-thumb, input[type=range].range-slider.range-slider--primary:not(.disabled):active::-webkit-slider-thumb {
    box-shadow: 0 0 0 0.2rem ${({ theme }) => theme.slider.color}80;
  }
  .slider{
    width: 100%;
  }
  .greytext{
    color: ${({ theme }) => theme.colors.button.background};
  }
  .dropdownMenu{
    position: absolute;
  }
  .overflowFix{
    overflow: inherit;
  }
  .overflowFix::-webkit-scrollbar {
    display: none;
  }
  .dygmaLogo {
    height: 26px;
    width: 26px;
    margin-right 0.5em;
  }
  .cardStyle {
    border-radius 15px;
  }
  .fullWidth {
    button {
      width: -webkit-fill-available;
    }
  }
  .va3fix {
    vertical-align: -3px;
  }
  .va2fix {
    vertical-align: -2px;
  }
  .va1fix {
    vertical-align: -1px;
  }
  .tagsfix {
    vertical-align: -5px;
    font-weight: 200;
    font-size: 14px;
  }
  .backupbuttons {
    margin: 0;
    padding: 0.44em;
    width: -webkit-fill-available;
  }
  .devfix {
    display: flex;
    justify-content: space-evenly;
  }
  .modinfo {
    font-size: 1rem;
    margin-left: 0.3em;
    color: ${({ theme }) => theme.colors.tipIcon};
  }
  .custom-control-label::before {
    box-shadow: none !important;
  }
  .custom-control-input:checked~.custom-control-label::before {
    border-color: ${({ theme }) => theme.slider.color};
    background-color: ${({ theme }) => theme.slider.color};
    box-shadow: none;
  }
  .save-holder {
    position: fixed;
    height: 40px;
    bottom: 40px;
    right: 40px;
  }
  .select-icon {
    position: absolute;
    left: 8px;
    top: 13px;
    background-color: ${({ theme }) => theme.colors.button.deselected};
    border: 2px solid ${({ theme }) => theme.colors.button.deselected};
    color: ${({ theme }) => theme.colors.button.text};
    font-size: 1.3em;
    border-radius: 4px;
  }
  .flag-icon {
    position: absolute;
    left: 8px;
    top: 10px;
  }
  .dropdown-toggle::after {
    position: absolute;
    right: 7px;
    top: 21px;
  }
`;

const TooltipStyle = Styled.div`
text-align: left;
.ttip-p {
  margin: 0;
}
.ttip-h {
  margin: 0;
  font-size: 1.3em;
}
`;

class KeyboardSettings extends React.Component {
  constructor(props) {
    super(props);

    this.bkp = new Backup();

    this.state = {
      keymap: {
        custom: [],
        default: [],
        onlyCustom: false
      },
      ledBrightness: 255,
      ledIdleTimeLimit: 0,
      defaultLayer: 126,
      qukeysHoldTimeout: 0,
      qukeysOverlapThreshold: 0,
      SuperTimeout: 0,
      SuperRepeat: 20,
      SuperWaitfor: 500,
      SuperHoldstart: 0,
      SuperOverlapThreshold: 0,
      mouseSpeed: 0,
      mouseSpeedDelay: 2,
      mouseAccelSpeed: 0,
      mouseAccelDelay: 2,
      mouseWheelSpeed: 0,
      mouseWheelDelay: 2,
      mouseSpeedLimit: 0,
      modified: false,
      showDefaults: false,
      working: false,
      selectedLanguage: "",
      backupFolder: "",
      storeBackups: 13
    };

    this.ChooseBackupFolder = this.ChooseBackupFolder.bind(this);
    this.restoreBackup = this.restoreBackup.bind(this);
    this.GetBackup = this.GetBackup.bind(this);
  }
  delay = ms => new Promise(res => setTimeout(res, ms));

  async componentDidMount() {
    const focus = new Focus();
    focus.command("keymap").then(keymap => {
      this.setState({ keymap: keymap });
    });
    focus.command("settings.defaultLayer").then(layer => {
      layer = layer ? parseInt(layer) : 126;
      this.setState({ defaultLayer: layer <= 126 ? layer : 126 });
    });

    focus.command("led.brightness").then(brightness => {
      brightness = brightness ? parseInt(brightness) : -1;
      this.setState({ ledBrightness: brightness });
    });

    focus.command("idleleds.time_limit").then(limit => {
      limit = limit ? parseInt(limit) : -1;
      this.setState({ ledIdleTimeLimit: limit });
    });

    this.setState({
      backupFolder: settings.getSync("backupFolder")
    });

    this.setState({
      storeBackups: settings.getSync("backupFrequency")
    });

    this.setState({
      selectedLanguage: settings.getSync("keyboard.language")
    });

    this.setState({
      showDefaults: settings.getSync("keymap.showDefaults")
    });

    // QUKEYS variables commands
    focus.command("qukeys.holdTimeout").then(holdTimeout => {
      holdTimeout = holdTimeout ? parseInt(holdTimeout) : 250;
      this.setState({ qukeysHoldTimeout: holdTimeout });
    });

    focus.command("qukeys.overlapThreshold").then(overlapThreshold => {
      overlapThreshold = overlapThreshold ? parseInt(overlapThreshold) : 80;
      this.setState({ qukeysOverlapThreshold: overlapThreshold });
    });

    // SuperKeys variables commands
    focus.command("superkeys.timeout").then(timeout => {
      timeout = timeout ? parseInt(timeout) : 250;
      this.setState({ SuperTimeout: timeout });
    });

    // focus.command("superkeys.repeat").then(repeat => {
    //   repeat = repeat ? parseInt(repeat) : 20;
    //   this.setState({ SuperRepeat: repeat });
    // });

    // focus.command("superkeys.waitfor").then(waitfor => {
    //   waitfor = waitfor ? parseInt(waitfor) : 500;
    //   this.setState({ SuperWaitfor: waitfor });
    // });

    focus.command("superkeys.holdstart").then(holdstart => {
      holdstart = holdstart ? parseInt(holdstart) : 200;
      this.setState({ SuperHoldstart: holdstart });
    });

    // focus.command("superkeys.overlap").then(overlapThreshold => {
    //   overlapThreshold = overlapThreshold ? parseInt(overlapThreshold) : 20;
    //   this.setState({ SuperOverlapThreshold: overlapThreshold });
    // });

    // MOUSE variables commands
    focus.command("mouse.speed").then(speed => {
      speed = speed ? parseInt(speed) : 1;
      this.setState({ mouseSpeed: speed });
    });

    // focus.command("mouse.speedDelay").then(speedDelay => {
    //   speedDelay = speedDelay ? parseInt(speedDelay) : 6;
    //   this.setState({ mouseSpeedDelay: speedDelay });
    // });

    focus.command("mouse.accelSpeed").then(accelSpeed => {
      accelSpeed = accelSpeed ? parseInt(accelSpeed) : 1;
      this.setState({ mouseAccelSpeed: accelSpeed });
    });

    // focus.command("mouse.accelDelay").then(accelDelay => {
    //   accelDelay = accelDelay ? parseInt(accelDelay) : 64;
    //   this.setState({ mouseAccelDelay: accelDelay });
    // });

    focus.command("mouse.wheelSpeed").then(wheelSpeed => {
      wheelSpeed = wheelSpeed ? parseInt(wheelSpeed) : 1;
      this.setState({ mouseWheelSpeed: wheelSpeed });
    });

    // focus.command("mouse.wheelDelay").then(wheelDelay => {
    //   wheelDelay = wheelDelay ? parseInt(wheelDelay) : 128;
    //   this.setState({ mouseWheelDelay: wheelDelay });
    // });

    focus.command("mouse.speedLimit").then(speedLimit => {
      speedLimit = speedLimit ? parseInt(speedLimit) : 127;
      this.setState({ mouseSpeedLimit: speedLimit });
    });
  }

  UNSAFE_componentWillReceiveProps = nextProps => {
    if (this.props.inContext && !nextProps.inContext) {
      this.componentDidMount();
      this.setState({ modified: false });
    }
  };

  setOnlyCustom = event => {
    const checked = event.target.checked;
    this.setState(state => ({
      modified: true,
      keymap: {
        custom: state.keymap.custom,
        default: state.keymap.default,
        onlyCustom: checked
      }
    }));
    this.props.startContext();
  };

  selectDefaultLayer = value => {
    this.setState({
      defaultLayer: value,
      modified: true
    });
    this.props.startContext();
  };

  selectIdleLEDTime = event => {
    const value = event.target.value;

    this.setState({
      ledIdleTimeLimit: value * 60,
      modified: true
    });
    this.props.startContext();
  };

  setShowDefaults = event => {
    this.setState({
      showDefaults: event.target.checked,
      modified: true
    });
    this.props.startContext();
  };

  setBrightness = event => {
    const value = event.target.value;

    this.setState({
      ledBrightness: (value * 255) / 100,
      modified: true
    });
    this.props.startContext();
  };

  setHoldTimeout = event => {
    const value = event.target.value;
    this.setState({
      qukeysHoldTimeout: value,
      modified: true
    });
    this.props.startContext();
  };

  setOverlapThreshold = event => {
    const value = event.target.value;

    this.setState({
      qukeysOverlapThreshold: value,
      modified: true
    });
    this.props.startContext();
  };

  setSuperTimeout = event => {
    const value = event.target.value;
    const olt = value > 1000 ? 0 : 100 - value / 10;
    this.setState({
      SuperTimeout: value,
      qukeysOverlapThreshold: olt,
      modified: true
    });
    this.props.startContext();
  };

  // setSuperRepeat = event => {
  //   const value = event.target.value;
  //   this.setState({
  //     SuperRepeat: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  // setSuperWaitfor = event => {
  //   const value = event.target.value;
  //   this.setState({
  //     SuperWaitfor: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  setSuperHoldstart = event => {
    const value = event.target.value;
    this.setState({
      SuperHoldstart: value,
      modified: true
    });
    this.props.startContext();
  };

  setTyping = event => {
    const value = (100 - event.target.value) * 10;
    this.setState({
      SuperTimeout: value,
      SuperHoldstart: value - 20,
      qukeysHoldTimeout: value - 20,
      modified: true
    });
    this.props.startContext();
  };

  setChording = event => {
    const value = event.target.value;
    this.setState({
      qukeysOverlapThreshold: value,
      modified: true
    });
    this.props.startContext();
  };

  // setSuperOverlapThreshold = event => {
  //   const value = event.target.value;

  //   this.setState({
  //     SuperOverlapThreshold: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  setSpeed = event => {
    const value = event.target.value;

    this.setState({
      mouseSpeed: value,
      modified: true
    });
    this.props.startContext();
  };

  // setSpeedDelay = event => {
  //   const value = event.target.value;

  //   this.setState({
  //     mouseSpeedDelay: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  setAccelSpeed = event => {
    const value = event.target.value;

    this.setState({
      mouseAccelSpeed: value,
      modified: true
    });
    this.props.startContext();
  };

  // setAccelDelay = event => {
  //   const value = event.target.value;

  //   this.setState({
  //     mouseAccelDelay: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  setWheelSpeed = event => {
    const value = event.target.value;

    this.setState({
      mouseWheelSpeed: value,
      modified: true
    });
    this.props.startContext();
  };

  // setWheelDelay = event => {
  //   const value = event.target.value;

  //   this.setState({
  //     mouseWheelDelay: value,
  //     modified: true
  //   });
  //   this.props.startContext();
  // };

  setSpeedLimit = event => {
    const value = event.target.value;

    this.setState({
      mouseSpeedLimit: value,
      modified: true
    });
    this.props.startContext();
  };

  saveKeymapChanges = async () => {
    const focus = new Focus();

    const {
      keymap,
      defaultLayer,
      showDefaults,
      ledBrightness,
      ledIdleTimeLimit,
      qukeysHoldTimeout,
      qukeysOverlapThreshold,
      SuperTimeout,
      SuperRepeat,
      SuperWaitfor,
      SuperHoldstart,
      SuperOverlapThreshold,
      mouseSpeed,
      mouseSpeedDelay,
      mouseAccelSpeed,
      mouseAccelDelay,
      mouseWheelSpeed,
      mouseWheelDelay,
      mouseSpeedLimit
    } = this.state;

    await focus.command("keymap.onlyCustom", keymap.onlyCustom);
    await focus.command("settings.defaultLayer", defaultLayer);
    await focus.command("led.brightness", ledBrightness);
    if (ledIdleTimeLimit >= 0)
      await focus.command("idleleds.time_limit", ledIdleTimeLimit);
    settings.setSync("keymap.showDefaults", showDefaults);
    // QUKEYS
    await focus.command("qukeys.holdTimeout", qukeysHoldTimeout);
    await focus.command("qukeys.overlapThreshold", qukeysOverlapThreshold);
    // SUPER KEYS
    await focus.command("superkeys.timeout", SuperTimeout);
    await focus.command("superkeys.repeat", SuperRepeat);
    await focus.command("superkeys.waitfor", SuperWaitfor);
    await focus.command("superkeys.holdstart", SuperHoldstart);
    // await focus.command("superkeys.overlap", SuperOverlapThreshold);
    // MOUSE KEYS
    await focus.command("mouse.speed", mouseSpeed);
    await focus.command("mouse.speedDelay", mouseSpeedDelay);
    await focus.command("mouse.accelSpeed", mouseAccelSpeed);
    await focus.command("mouse.accelDelay", mouseAccelDelay);
    await focus.command("mouse.wheelSpeed", mouseWheelSpeed);
    await focus.command("mouse.wheelDelay", mouseWheelDelay);
    await focus.command("mouse.speedLimit", mouseSpeedLimit);

    const commands = await this.bkp.Commands();
    const backup = await this.bkp.DoBackup(commands);
    this.bkp.SaveBackup(backup);

    this.setState({ modified: false });
    this.props.cancelContext();
  };

  changeLanguage = language => {
    this.setState({ selectedLanguage: language });
    settings.setSync("keyboard.language", `${language}`);
  };

  ChooseBackupFolder() {
    let options = {
      title: i18n.keyboardSettings.backupFolder.title,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowButton,
      properties: ["openDirectory"]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showOpenDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePaths);
          this.setState({
            backupFolder: resp.filePaths[0]
          });
          settings.setSync("backupFolder", `${resp.filePaths[0]}`);
        } else {
          console.log("user closed backup folder dialog");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async GetBackup() {
    let options = {
      title: i18n.keyboardSettings.backupFolder.restoreTitle,
      buttonLabel: i18n.keyboardSettings.backupFolder.windowRestore,
      defaultPath: this.state.backupFolder,
      filters: [
        { name: "Json", extensions: ["json"] },
        { name: i18n.dialog.allFiles, extensions: ["*"] }
      ]
    };
    const remote = require("electron").remote;
    const WIN = remote.getCurrentWindow();
    remote.dialog
      .showOpenDialog(WIN, options)
      .then(resp => {
        if (!resp.canceled) {
          console.log(resp.filePaths);
          let backup;
          try {
            backup = JSON.parse(require("fs").readFileSync(resp.filePaths[0]));
            console.log("loaded backup", backup[0].command, backup[0].data);
          } catch (e) {
            console.error(e);
            alert("The file is not a valid macros backup");
            return;
          }
          this.restoreBackup(backup);
        } else {
          console.log("user closed SaveDialog");
        }
      })
      .catch(err => {
        console.log(err);
      });
  }

  async restoreBackup(backup) {
    let focus = new Focus();
    try {
      for (let i = 0; i < backup.length; i++) {
        let val = backup[i].data;
        // Boolean values need to be sent as int
        if (typeof val === "boolean") {
          val = +val;
        }
        console.log(`Going to send ${backup[i].command} to keyboard`);
        await focus.command(`${backup[i].command} ${val}`.trim());
      }
      await focus.command("led.mode 0");
      console.log("Restoring all settings");
      console.log("Firmware update OK");
      return true;
    } catch (e) {
      console.log(`Restore settings: Error: ${e.message}`);
      return false;
    }
  }

  setStoreBackups = event => {
    const value = event.target.value;
    this.setState({
      storeBackups: value
    });
    settings.setSync("backupFrequency", value);
  };

  renderTooltip(tooltips) {
    return (
      <Tooltip id="select-tooltip" className="longtooltip">
        <TooltipStyle>
          {tooltips.map((tip, i) => {
            return (
              <React.Fragment key={`Tip-${i}`}>
                {i % 2 == 1 || !isNaN(tip[0]) || tip[0] == "-" ? (
                  <p className="ttip-p">{tip}</p>
                ) : (
                  <React.Fragment>
                    {i == 0 ? "" : <br></br>}
                    <h5 className="ttip-h">{tip}</h5>
                  </React.Fragment>
                )}
              </React.Fragment>
            );
          })}
        </TooltipStyle>
      </Tooltip>
    );
  }

  render() {
    const {
      keymap,
      defaultLayer,
      modified,
      showDefaults,
      ledBrightness,
      ledIdleTimeLimit,
      qukeysHoldTimeout,
      qukeysOverlapThreshold,
      SuperTimeout,
      // SuperRepeat,
      // SuperWaitfor,
      SuperHoldstart,
      SuperOverlapThreshold,
      mouseSpeed,
      // mouseSpeedDelay,
      mouseAccelSpeed,
      // mouseAccelDelay,
      mouseWheelSpeed,
      // mouseWheelDelay,
      mouseSpeedLimit,
      selectedLanguage,
      backupFolder,
      storeBackups
    } = this.state;
    const { selectDarkMode, darkMode, devToolsSwitch, verboseSwitch } =
      this.props;

    const onlyCustomSwitch = (
      <Form.Check
        type="switch"
        checked={keymap.onlyCustom}
        onChange={this.setOnlyCustom}
      />
    );
    const showDefaultLayersSwitch = (
      <Form.Check
        type="switch"
        checked={showDefaults}
        onChange={this.setShowDefaults}
      />
    );
    let flags = [
      englishUSUKF,
      spanishF,
      germanF,
      frenchF,
      swedishF,
      danishF,
      norwegianF,
      icelandicF,
      japaneseF
    ];
    let language = [
      "english",
      "spanish",
      "german",
      "french",
      "swedish",
      "danish",
      "norwegian",
      "icelandic"
    ];
    let languages = language.map((item, index) => {
      return (
        <Dropdown.Item eventKey={item} key={index}>
          <img src={flags[index]} className="dygmaLogo" />
          {item[0].toUpperCase() + item.slice(1)}
        </Dropdown.Item>
      );
    });
    const selectLanguage = (
      <Dropdown
        onSelect={this.changeLanguage}
        value={selectedLanguage}
        className="fullWidth"
      >
        <Dropdown.Toggle className="toggler">
          <img
            src={
              flags[
                language.flatMap((lang, i) =>
                  lang === selectedLanguage ? i : []
                )
              ]
            }
            className="dygmaLogo flag-icon"
          />
          {`${
            selectedLanguage != undefined && selectedLanguage != ""
              ? selectedLanguage[0].toUpperCase() + selectedLanguage.slice(1)
              : selectedLanguage
          }`}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu">{languages}</Dropdown.Menu>
      </Dropdown>
    );
    let layers;
    if (keymap.onlyCustom) {
      layers = keymap.custom.map((_, index) => {
        return (
          <Dropdown.Item eventKey={index} key={index}>
            {i18n.formatString(i18n.components.layer, index + 1)}
          </Dropdown.Item>
        );
      });
    } else {
      layers = keymap.default.concat(keymap.custom).map((_, index) => {
        return (
          <Dropdown.Item eventKey={index} key={index}>
            {i18n.formatString(i18n.components.layer, index)}
          </Dropdown.Item>
        );
      });
    }
    const defaultLayerSelect = (
      <Dropdown
        onSelect={this.selectDefaultLayer}
        value={defaultLayer}
        className="fullWidth"
      >
        <Dropdown.Toggle className="toggler">
          {defaultLayer == 126
            ? i18n.keyboardSettings.keymap.noDefault
            : `Layer ${parseInt(defaultLayer) + 1}`}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu">
          {/* <Dropdown.Item key={"no-default"} eventKey={126}>
            {i18n.keyboardSettings.keymap.noDefault}
          </Dropdown.Item> */}
          {layers}
        </Dropdown.Menu>
      </Dropdown>
    );
    const idleControl = (
      <Dropdown onSelect={this.selectIdleLEDTime} value={ledIdleTimeLimit}>
        <Dropdown.Toggle className="toggler">
          {ledIdleTimeLimit}
        </Dropdown.Toggle>
        <Dropdown.Menu className="dropdownMenu">
          <Dropdown.Item key={"no-idle"} eventKey={0}>
            {i18n.keyboardSettings.led.idleDisabled}
          </Dropdown.Item>
          <Dropdown.Item key={"oneMinute"} eventKey={60}>
            {i18n.keyboardSettings.led.idle.oneMinute}
          </Dropdown.Item>
          <Dropdown.Item key={"twoMinutes"} eventKey={120}>
            {i18n.keyboardSettings.led.idle.twoMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"threeMinutes"} eventKey={180}>
            {i18n.keyboardSettings.led.idle.threeMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"fourMinutes"} eventKey={240}>
            {i18n.keyboardSettings.led.idle.fourMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"fiveMinutes"} eventKey={300}>
            {i18n.keyboardSettings.led.idle.fiveMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"tenMinutes"} eventKey={600}>
            {i18n.keyboardSettings.led.idle.tenMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"fifteenMinutes"} eventKey={900}>
            {i18n.keyboardSettings.led.idle.fifteenMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"twentyMinutes"} eventKey={1200}>
            {i18n.keyboardSettings.led.idle.twentyMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"thirtyMinutes"} eventKey={1800}>
            {i18n.keyboardSettings.led.idle.thirtyMinutes}
          </Dropdown.Item>
          <Dropdown.Item key={"oneHour"} eventKey={3600}>
            {i18n.keyboardSettings.led.idle.oneHour}
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    const newIdleControl = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">off</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={60}
            step={1}
            value={ledIdleTimeLimit / 60}
            className="slider"
            onChange={this.selectIdleLEDTime}
            marks={[{ value: 255, label: i18n.keyboardSettings.defaultLabel }]}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">60min</span>
        </Col>
      </Row>
    );
    const backupControl = (
      <Row>
        <Col xs={2} className="p-0 text-center">
          <span className="tagsfix">1 month</span>
        </Col>
        <Col xs={8} className="px-1">
          <RangeSlider
            min={1}
            max={13}
            value={storeBackups}
            className="slider"
            onChange={this.setStoreBackups}
          />
        </Col>
        <Col xs={2} className="p-0 text-center">
          <span className="tagsfix">forever</span>
        </Col>
      </Row>
    );
    const brightnessControl = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">none</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={100}
            step={5}
            value={Math.round((ledBrightness * 100) / 255)}
            className="slider"
            onChange={this.setBrightness}
            marks={[{ value: 255, label: i18n.keyboardSettings.defaultLabel }]}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">max</span>
        </Col>
      </Row>
    );
    // const holdT = (
    //   <RangeSlider
    //     min={0}
    //     max={1000}
    //     value={qukeysHoldTimeout}
    //     className="slider"
    //     onChange={this.setHoldTimeout}
    //     marks={[{ value: 250, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    // const overlapT = (
    //   <RangeSlider
    //     min={0}
    //     max={100}
    //     value={qukeysOverlapThreshold}
    //     className="slider"
    //     onChange={this.setOverlapThreshold}
    //     marks={[{ value: 80, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const superT = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">slow</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={95}
            value={100 - SuperTimeout / 10}
            className="slider"
            onChange={this.setTyping}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">fast</span>
        </Col>
      </Row>
    );
    // const superR = (
    //   <RangeSlider
    //     min={0}
    //     max={250}
    //     value={SuperRepeat}
    //     className="slider"
    //     onChange={this.setSuperRepeat}
    //     marks={[{ value: 20, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    // const superW = (
    //   <RangeSlider
    //     min={0}
    //     max={1000}
    //     value={SuperWaitfor}
    //     className="slider"
    //     onChange={this.setSuperWaitfor}
    //     marks={[{ value: 500, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const superH = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">none</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={100}
            value={qukeysOverlapThreshold}
            className="slider"
            onChange={this.setChording}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">high</span>
        </Col>
      </Row>
    );
    // const SuperO = (
    //   <RangeSlider
    //     min={0}
    //     max={100}
    //     value={SuperOverlapThreshold}
    //     className="slider"
    //     onChange={this.setSuperOverlapThreshold}
    //     marks={[{ value: 20, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const mSpeed = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">slow</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={254}
            value={mouseSpeed}
            className="slider"
            onChange={this.setSpeed}
            marks={[{ value: 1, label: i18n.keyboardSettings.defaultLabel }]}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">fast</span>
        </Col>
      </Row>
    );
    // const mSpeedD = (
    //   <RangeSlider
    //     min={0}
    //     max={1000}
    //     value={mouseSpeedDelay}
    //     className="slider"
    //     onChange={this.setSpeedDelay}
    //     marks={[{ value: 6, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const mAccelS = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">slow</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={254}
            value={mouseAccelSpeed}
            className="slider"
            onChange={this.setAccelSpeed}
            marks={[{ value: 1, label: i18n.keyboardSettings.defaultLabel }]}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">fast</span>
        </Col>
      </Row>
    );
    // const maccelD = (
    //   <RangeSlider
    //     min={0}
    //     max={1000}
    //     value={mouseAccelDelay}
    //     className="slider"
    //     onChange={this.setAccelDelay}
    //     marks={[{ value: 64, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const mWheelS = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">slow</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={254}
            value={mouseWheelSpeed}
            className="slider"
            onChange={this.setWheelSpeed}
            marks={[{ value: 1, label: i18n.keyboardSettings.defaultLabel }]}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">fast</span>
        </Col>
      </Row>
    );
    // const mWheelD = (
    //   <RangeSlider
    //     min={0}
    //     max={1000}
    //     value={mouseWheelDelay}
    //     className="slider"
    //     onChange={this.setWheelDelay}
    //     marks={[{ value: 200, label: i18n.keyboardSettings.defaultLabel }]}
    //   />
    // );
    const mSpeedL = (
      <Row>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">slow</span>
        </Col>
        <Col xs={8} md={10} className="px-2">
          <RangeSlider
            min={0}
            max={254}
            value={mouseSpeedLimit}
            className="slider"
            onChange={this.setSpeedLimit}
            marks={[{ value: 127, label: i18n.keyboardSettings.defaultLabel }]}
          />
        </Col>
        <Col xs={2} md={1} className="p-0 text-center">
          <span className="tagsfix">fast</span>
        </Col>
      </Row>
    );
    const darkModeSwitch = (
      <Dropdown
        onSelect={selectDarkMode}
        value={darkMode}
        className="fullWidth"
      >
        <Dropdown.Toggle className="toggler">
          {darkMode === "system" ? (
            <React.Fragment>
              <MdComputer className="select-icon" />
              System
            </React.Fragment>
          ) : darkMode === "dark" ? (
            <React.Fragment>
              <MdBrightness3 className="select-icon" />
              Dark
            </React.Fragment>
          ) : (
            <React.Fragment>
              <MdWbSunny className="select-icon" />
              Light
            </React.Fragment>
          )}
        </Dropdown.Toggle>
        <Dropdown.Menu className="menu">
          <Dropdown.Item key={`theme-system`} eventKey={"system"}>
            <MdComputer className="mr-3" />
            <span className="va1fix">System</span>
          </Dropdown.Item>
          <Dropdown.Item key={`theme-dark`} eventKey={"dark"}>
            <MdBrightness3 className="mr-3" />
            <span className="va1fix">Dark</span>
          </Dropdown.Item>
          <Dropdown.Item key={`theme-light`} eventKey={"light"}>
            <MdWbSunny className="mr-3" />
            <span className="va1fix">Light</span>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );
    const backupFolderButton = (
      <Button onClick={this.ChooseBackupFolder} className="backupbuttons">
        {i18n.keyboardSettings.backupFolder.selectButtonText}
      </Button>
    );
    const restoreBackupButton = (
      <Button onClick={this.GetBackup} className="backupbuttons">
        {i18n.keyboardSettings.backupFolder.restoreButtonText}
      </Button>
    );

    return (
      <Styles>
        {this.state.working && <Spinner role="status" />}
        <Form className="mb-5">
          <Container>
            <Row className="justify-content-center">
              <Col xl={6} lg={8} md={10}>
                <Card className="overflowFix cardStyle mt-4">
                  <Card.Title>
                    <BiWrench className="dygmaLogo" />
                    <span className="va3fix">
                      {i18n.keyboardSettings.keymap.title}
                    </span>
                  </Card.Title>
                  <Card.Body className="pb-0">
                    <Row>
                      <Col md={4}>
                        <Form.Group controlId="selectLanguage" className="m-0">
                          <Form.Label>{i18n.preferences.language}</Form.Label>
                          {selectLanguage}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="defaultLayer" className="m-0">
                          <Form.Label>
                            {i18n.keyboardSettings.keymap.defaultLayer}
                          </Form.Label>
                          {defaultLayerSelect}
                        </Form.Group>
                      </Col>
                      <Col md={4}>
                        <Form.Group controlId="DarkMode" className="m-0">
                          <Form.Label>
                            {i18n.preferences.darkMode.label}
                          </Form.Label>
                          {darkModeSwitch}
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
                <Card className="overflowFix cardStyle mt-4 pb-0">
                  <Card.Title>
                    <MdStorage className="dygmaLogo" />
                    <span className="va2fix">
                      {i18n.keyboardSettings.backupFolder.header}
                    </span>
                  </Card.Title>
                  <Card.Body className="pb-0">
                    <Form.Group controlId="backupFolder" className="mb-3">
                      <Row>
                        <Form.Label>
                          {i18n.keyboardSettings.backupFolder.title}
                        </Form.Label>
                      </Row>
                      <Row className="mb-4">
                        <Col className="pl-0 pr-1">
                          <Form.Control
                            type="text"
                            value={backupFolder}
                            readOnly
                          />
                        </Col>
                        <Col xs={2} className="px-1">
                          {backupFolderButton}
                        </Col>
                        <Col xs={4} className="px-1">
                          {restoreBackupButton}
                        </Col>
                      </Row>
                      <Row>
                        <Form.Label>
                          {i18n.keyboardSettings.backupFolder.storeTime}
                        </Form.Label>
                      </Row>
                      {backupControl}
                    </Form.Group>
                  </Card.Body>
                </Card>
                <Card className="overflowFix cardStyle mt-4 pb-0">
                  <Card.Title>
                    <BsBrightnessHigh className="dygmaLogo" />
                    <span className="va2fix">
                      {i18n.keyboardSettings.led.title}
                    </span>
                  </Card.Title>
                  <Card.Body className="pb-0">
                    {ledIdleTimeLimit >= 0 && (
                      <Form.Group
                        controlId="idleTimeLimit"
                        className="formGroup"
                      >
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.led.idleTimeLimit}
                          </Form.Label>
                        </Row>
                        {newIdleControl}
                      </Form.Group>
                    )}
                    {ledBrightness >= 0 && (
                      <Form.Group
                        controlId="brightnessControl"
                        className="formGroup"
                      >
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.led.brightness}
                          </Form.Label>
                        </Row>
                        {brightnessControl}
                      </Form.Group>
                    )}
                  </Card.Body>
                </Card>
                <Card className="overflowFix cardStyle mt-4 pb-0">
                  <Card.Title>
                    <BiCodeAlt className="dygmaLogo" />
                    <span className="va2fix">{i18n.preferences.advanced}</span>
                  </Card.Title>
                  <Card.Body className="pb-0">
                    <Form>
                      <Row>
                        <Col xs={4} className="p-0">
                          <Form.Group controlId="DevTools" className="devfix">
                            {devToolsSwitch}
                            <Form.Label>{i18n.preferences.devtools}</Form.Label>
                          </Form.Group>
                        </Col>
                        <Col xs={4} className="p-0">
                          <Form.Group controlId="Verbose" className="devfix">
                            {verboseSwitch}
                            <Form.Label>
                              {i18n.preferences.verboseFocus}
                            </Form.Label>
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row className="mb-4">
                        <Col className="p-0">
                          <AdvancedKeyboardSettings />
                        </Col>
                      </Row>
                    </Form>
                  </Card.Body>
                </Card>
              </Col>
              <Col xl={6} lg={8} md={10}>
                <Card className="overflowFix cardStyle mt-4 pb-0">
                  <Card.Title>
                    <BsType className="dygmaLogo" />
                    <span className="va3fix">
                      {i18n.keyboardSettings.superkeys.title}
                    </span>
                  </Card.Title>
                  <Card.Body className="pb-0">
                    {SuperTimeout >= 0 && (
                      <Form.Group
                        controlId="superTimeout"
                        className="formGroup"
                      >
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.superkeys.timeout}
                            <OverlayTrigger
                              rootClose
                              placement="bottom"
                              delay={{ show: 250, hide: 400 }}
                              overlay={this.renderTooltip([
                                i18n.keyboardSettings.superkeys.timeoutTip1,
                                i18n.keyboardSettings.superkeys.timeoutTip2,
                                i18n.keyboardSettings.superkeys.timeoutTip3,
                                i18n.keyboardSettings.superkeys.timeoutTip4
                              ])}
                            >
                              <MdInfo className="modinfo" />
                            </OverlayTrigger>
                          </Form.Label>
                        </Row>
                        {superT}
                      </Form.Group>
                    )}
                    {SuperHoldstart >= 0 && (
                      <Form.Group
                        controlId="superHoldstart"
                        className="formGroup"
                      >
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.superkeys.holdstart}
                            <OverlayTrigger
                              rootClose
                              placement="bottom"
                              delay={{ show: 250, hide: 400 }}
                              overlay={this.renderTooltip([
                                i18n.keyboardSettings.superkeys.chordingTip1,
                                i18n.keyboardSettings.superkeys.chordingTip2,
                                i18n.keyboardSettings.superkeys.chordingTip3,
                                i18n.keyboardSettings.superkeys.chordingTip4
                              ])}
                            >
                              <MdInfo className="modinfo" />
                            </OverlayTrigger>
                          </Form.Label>
                        </Row>
                        {superH}
                      </Form.Group>
                    )}
                  </Card.Body>
                </Card>
                <Card className="overflowFix cardStyle mt-4 pb-0">
                  <Card.Title>
                    <BiMouse className="dygmaLogo" />
                    <span className="va2fix">
                      {i18n.keyboardSettings.mouse.title}
                    </span>
                  </Card.Title>
                  <Card.Body className="pb-0">
                    {mouseSpeed >= 0 && (
                      <Form.Group controlId="mouseSpeed" className="formGroup">
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.mouse.speed}
                          </Form.Label>
                        </Row>
                        {mSpeed}
                      </Form.Group>
                    )}
                    {mouseAccelSpeed >= 0 && (
                      <Form.Group
                        controlId="mousemAccelS"
                        className="formGroup"
                      >
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.mouse.accelSpeed}
                          </Form.Label>
                        </Row>
                        {mAccelS}
                      </Form.Group>
                    )}
                    {mouseSpeedLimit >= 0 && (
                      <Form.Group controlId="mouseSpeedL" className="formGroup">
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.mouse.speedLimit}
                          </Form.Label>
                        </Row>
                        {mSpeedL}
                      </Form.Group>
                    )}
                    {mouseWheelSpeed >= 0 && (
                      <Form.Group
                        controlId="mousemWheelS"
                        className="formGroup"
                      >
                        <Row>
                          <Form.Label>
                            {i18n.keyboardSettings.mouse.wheelSpeed}
                          </Form.Label>
                        </Row>
                        {mWheelS}
                      </Form.Group>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </Form>
        <div className="save-holder">
          <SaveChangesButton
            onClick={this.saveKeymapChanges}
            disabled={!modified}
            centered={true}
          >
            {i18n.components.save.savePreferences}
          </SaveChangesButton>
        </div>
      </Styles>
    );
  }
}

class AdvancedKeyboardSettings extends React.Component {
  state = {
    EEPROMClearConfirmationOpen: false
  };

  clearEEPROM = async () => {
    const focus = new Focus();

    await this.setState({ working: true });
    this.closeEEPROMClearConfirmation();

    let eeprom = await focus.command("eeprom.contents");
    eeprom = eeprom
      .split(" ")
      .filter(v => v.length > 0)
      .map(() => 255)
      .join(" ");
    await focus.command("eeprom.contents", eeprom);
    this.setState({ working: false });
  };
  openEEPROMClearConfirmation = () => {
    this.setState({ EEPROMClearConfirmationOpen: true });
  };
  closeEEPROMClearConfirmation = () => {
    this.setState({ EEPROMClearConfirmationOpen: false });
  };

  render() {
    return (
      <React.Fragment>
        <Button
          disabled={this.state.working}
          variant="contained"
          color="secondary"
          onClick={this.openEEPROMClearConfirmation}
        >
          {i18n.keyboardSettings.resetEEPROM.button}
        </Button>
        <ConfirmationDialog
          title={i18n.keyboardSettings.resetEEPROM.dialogTitle}
          open={this.state.EEPROMClearConfirmationOpen}
          onConfirm={this.clearEEPROM}
          onCancel={this.closeEEPROMClearConfirmation}
        >
          {i18n.keyboardSettings.resetEEPROM.dialogContents}
        </ConfirmationDialog>
      </React.Fragment>
    );
  }
}

export { KeyboardSettings, AdvancedKeyboardSettings };

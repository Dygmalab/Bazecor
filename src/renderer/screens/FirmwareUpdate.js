// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019, 2020  DygmaLab SE
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
import Electron from "electron";
import path from "path";
import fs from "fs";
import { version } from "../../../package.json";

import Focus from "../../api/focus";
import FlashRaise from "../../api/flash";

import BuildIcon from "@material-ui/icons/Build";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import Link from "@material-ui/core/Link";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Divider from "@material-ui/core/Divider";
import ExploreIcon from "@material-ui/icons/ExploreOutlined";
import InfoRounded from "@material-ui/icons/InfoRounded";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Portal from "@material-ui/core/Portal";
import Select from "@material-ui/core/Select";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { toast } from "react-toastify";

import { getStaticPath } from "../config";
import SaveChangesButton from "../components/SaveChangesButton";
import CustomDialog from "../components/CustomDialog";
import i18n from "../i18n";
import { CardHeader } from "@material-ui/core";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center"
  },
  card: {
    margin: theme.spacing(4),
    padding: theme.spacing(5),
    maxWidth: "50%"
  },
  cardTitle: {
    fontWeight: 600
  },
  cardSub: {
    fontSize: "1rem",
    paddingBottom: theme.spacing()
  },
  cardIta: {
    fontStyle: "italic",
    fontSize: "1rem",
    color: "darkgrey"
  },
  cardSnack: {
    width: "85%",
    margin: "auto"
  },
  snackVer: {
    fontSize: "1.2rem",
    backgroundColor:
      theme.palette.type === "dark"
        ? theme.palette.secondary.main
        : theme.palette.primary.main,
    boxShadow: "none",
    placeContent: "center"
  },
  versionText: {
    color: "#fff"
  },
  versionStrong: {
    color: theme.palette.type === "dark" ? theme.palette.primary.main : "#fff"
  },
  notText: {
    color: theme.palette.type === "dark" ? "#fff" : "#000"
  },
  snackNot: {
    fontSize: "1rem",
    backgroundColor:
      theme.palette.type === "dark" ? theme.palette.secondary.main : "#FF9800",
    boxShadow: "none",
    placeContent: "center",
    maxWidth: "none"
  },
  grow: {
    flexGrow: 1
  },
  dropdown: {
    display: "flex",
    minWidth: "15em"
  },
  custom: {
    marginTop: "auto",
    marginBottom: "auto"
  },
  repo: {
    textAlign: "center"
  },
  firmwareSelect: {
    marginLeft: theme.spacing(2)
  },
  grid: {
    width: "70%"
  },
  img: {
    width: "100%"
  },
  paper: {
    width: "85%",
    margin: "auto",
    marginBottom: theme.spacing(2)
  }
});

class FirmwareUpdate extends React.Component {
  constructor(props) {
    super(props);

    let focus = new Focus();
    this.flashRaise = null;
    this.isDevelopment = process.env.NODE_ENV !== "production";

    this.state = {
      firmwareFilename: "",
      selected: "default",
      device: props.device || focus.device,
      confirmationOpen: false,
      countdown: null,
      buttonText: {
        "": "Uploading ...",
        3: "Start countdown",
        2: "Wait",
        1: "Wait",
        0: "Press"
      },
      versions: null
    };
  }

  componentDidMount() {
    const focus = new Focus();
    let versions;

    focus.command("version").then(v => {
      if (!v) return;
      let parts = v.split(" ");
      versions = {
        bazecor: parts[0],
        kaleidoscope: parts[1],
        firmware: parts[2]
      };

      this.setState({ versions: versions });
    });
  }

  selectFirmware = event => {
    this.setState({ selected: event.target.value });
    if (event.target.value != "custom") {
      return this.setState({ firmwareFilename: "" });
    }

    let files = Electron.remote.dialog.showOpenDialog({
      title: i18n.firmwareUpdate.dialog.selectFirmware,
      filters: [
        {
          name: i18n.firmwareUpdate.dialog.firmwareFiles,
          extensions: ["hex"]
        },
        {
          name: i18n.firmwareUpdate.dialog.allFiles,
          extensions: ["*"]
        }
      ]
    });
    files.then(result => {
      this.setState({ firmwareFilename: result.filePaths[0] });
    });
  };

  _defaultFirmwareFilename = () => {
    const { vendor, product } = this.state.device.device.info;
    const cVendor = vendor.replace("/", ""),
      cProduct = product.replace("/", "");
    return path.join(getStaticPath(), cVendor, cProduct, "default.hex");
  };
  _experimentalFirmwareFilename = () => {
    const { vendor, product } = this.state.device.device.info;
    const cVendor = vendor.replace("/", ""),
      cProduct = product.replace("/", "");
    return path.join(getStaticPath(), cVendor, cProduct, "experimental.hex");
  };

  _flash = async () => {
    let focus = new Focus();
    let filename;
    const delay = ms => new Promise(res => setTimeout(res, ms));

    if (this.state.selected == "default") {
      filename = this._defaultFirmwareFilename();
    } else if (this.state.selected == "experimental") {
      filename = this._experimentalFirmwareFilename();
    } else {
      filename = this.state.firmwareFilename;
    }
    if (this.state.device.device.info.product === "Raise") {
      let count = setInterval(() => {
        const { countdown } = this.state;
        countdown === 0
          ? clearInterval(count)
          : this.setState({ countdown: countdown - 1 });
      }, 1000);
      await delay(3000);
      if (!focus.device.bootloader) {
        await this.flashRaise.resetKeyboard(focus._port);
      }
      this.setState({ countdown: "" });
    }

    try {
      if (focus.device.bootloader) {
        this.flashRaise.currentPort = this.props.device;
      }
      await focus.close();
      console.log("done closing focus");
      return await this.state.device.device.flash(
        focus._port,
        filename,
        this.flashRaise
      );
    } catch (e) {
      console.error(e);
    }
  };

  upload = async () => {
    await this.props.toggleFlashing();

    try {
      await this._flash();
    } catch (e) {
      console.error(e);
      const styles = {
        toastText: {
          fontSize: "1rem"
        },
        toastSubText: {
          fontSize: "0.9rem",
          fontStyle: "italic",
          fontWeight: 200,
          color: "#DDD"
        },
        toastButton1: {
          marginRight: "16px"
        },
        toastButton2: {
          marginLeft: "16px",
          float: "right"
        }
      };
      const action = ({ closeToast }) => (
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Typography component="p" gutterBottom style={styles.toastText}>
              {i18n.firmwareUpdate.flashing.error}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Typography component="p" gutterBottom style={styles.toastSubText}>
              {e.message}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                style={styles.toastButton1}
                onClick={() => {
                  const shell = Electron.remote && Electron.remote.shell;
                  shell.openExternal(
                    "https://support.dygma.com/hc/en-us/articles/360017056397"
                  );
                }}
              >
                Troubleshooting
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={closeToast} style={styles.toastButton2}>
                Dismiss
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
      toast.error(action);
      this.props.toggleFlashing();
      this.props.onDisconnect();
      this.setState({ confirmationOpen: false });
      return;
    }

    return new Promise(async resolve => {
      let focus = new Focus();
      if (this.state.versions) await focus.command("led.mode 0");
      setTimeout(() => {
        toast.success(i18n.firmwareUpdate.flashing.success);
        this.props.toggleFlashing();
        this.props.onDisconnect();
        this.setState({ confirmationOpen: false });
        resolve();
      }, 1000);
    });
  };

  uploadRaise = async () => {
    let focus = new Focus();
    if (this.state.versions) await focus.command("led.mode 1");
    this.setState({ confirmationOpen: true, isBeginUpdate: true });
    try {
      this.flashRaise = new FlashRaise(this.props.device);
      if (!focus.device.bootloader) {
        await this.flashRaise.backupSettings();
      }
      this.setState({ countdown: 3 });
    } catch (e) {
      console.error(e);
      const styles = {
        toastText: {
          fontSize: "1rem"
        },
        toastSubText: {
          fontSize: "0.9rem",
          fontStyle: "italic",
          fontWeight: 200,
          color: "#DDD"
        },
        toastButton1: {
          marginRight: "16px"
        },
        toastButton2: {
          marginLeft: "16px",
          float: "right"
        }
      };
      const action = ({ closeToast }) => (
        <Grid container spacing={1}>
          <Grid container item xs={12}>
            <Typography component="p" gutterBottom style={styles.toastText}>
              {i18n.firmwareUpdate.flashing.error}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Typography component="p" gutterBottom style={styles.toastSubText}>
              {e.message}
            </Typography>
          </Grid>
          <Grid container item xs={12}>
            <Grid item xs={6}>
              <Button
                variant="contained"
                style={styles.toastButton1}
                onClick={() => {
                  const shell = Electron.remote && Electron.remote.shell;
                  shell.openExternal(
                    "https://support.dygma.com/hc/en-us/articles/360007272638"
                  );
                }}
              >
                Troubleshooting
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button onClick={closeToast} style={styles.toastButton2}>
                Dismiss
              </Button>
            </Grid>
          </Grid>
        </Grid>
      );
      toast.error(action);
      this.setState({ confirmationOpen: false });
    }
  };

  cancelDialog = async () => {
    let focus = new Focus();
    if (this.state.versions) await focus.command("led.mode 0");
    this.setState({ confirmationOpen: false });
  };

  render() {
    const { classes } = this.props;
    const {
      firmwareFilename,
      buttonText,
      countdown,
      isBeginUpdate,
      versions
    } = this.state;

    let filename = null;
    if (firmwareFilename) {
      filename = firmwareFilename.split(/[\\/]/);
      filename = filename[filename.length - 1];
    }

    const defaultFirmwareItemText = i18n.formatString(
      i18n.firmwareUpdate.defaultFirmware,
      version
    );
    const defaultFirmwareItem = (
      <MenuItem value="default" selected={this.state.selected == "default"}>
        <ListItemIcon>
          <SettingsBackupRestoreIcon />
        </ListItemIcon>
        <ListItemText
          primary={defaultFirmwareItemText}
          secondary={i18n.firmwareUpdate.defaultFirmwareDescription}
        />
      </MenuItem>
    );
    let hasDefaultFirmware = true;
    try {
      fs.accessSync(this._defaultFirmwareFilename(), fs.constants.R_OK);
    } catch (_) {
      hasDefaultFirmware = false;
    }

    const experimentalFirmwareItemText = i18n.formatString(
      i18n.firmwareUpdate.experimentalFirmware,
      version
    );
    const experimentalFirmwareItem = (
      <MenuItem
        value="experimental"
        selected={this.state.selected == "experimental"}
      >
        <ListItemIcon>
          <ExploreIcon />
        </ListItemIcon>
        <ListItemText
          primary={experimentalFirmwareItemText}
          secondary={i18n.firmwareUpdate.experimentalFirmwareDescription}
        />
      </MenuItem>
    );
    let hasExperimentalFirmware = true;

    try {
      fs.accessSync(this._experimentalFirmwareFilename(), fs.constants.R_OK);
    } catch (_) {
      hasExperimentalFirmware = false;
    }

    const firmwareSelect = (
      <FormControl className={classes.firmwareSelect}>
        <InputLabel shrink htmlFor="selected-firmware">
          {i18n.firmwareUpdate.selected}
        </InputLabel>
        <Select
          classes={{ select: classes.dropdown }}
          value={this.state.selected}
          input={<Input id="selected-firmware" />}
          onChange={this.selectFirmware}
        >
          {hasDefaultFirmware && defaultFirmwareItem}
          {hasExperimentalFirmware && experimentalFirmwareItem}
          <MenuItem selected={this.state.selected == "custom"} value="custom">
            <ListItemIcon className={classes.custom}>
              <BuildIcon />
            </ListItemIcon>
            <ListItemText
              primary={i18n.firmwareUpdate.custom}
              secondary={filename}
            />
          </MenuItem>
        </Select>
      </FormControl>
    );

    let dialogChildren;
    if (versions) {
      dialogChildren = (
        <React.Fragment>
          <div className={classes.paper}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ fontWeight: "500", paddingBottom: "1rem" }}
            >
              {i18n.firmwareUpdate.raise.reset}
            </Typography>
            <Typography component="p" gutterBottom className={classes.cardSub}>
              {
                "During the update, the Neuron will pulse a blue pattern followed by a flash of multiple colors for a few seconds. When the update finishes, your keyboard lights will go back to your personalized color mode."
              }
            </Typography>
            <Typography variant="h6" gutterBottom>
              {"Follow these steps to update your firmware:"}
            </Typography>
            <Typography
              component="span"
              gutterBottom
              className={classes.cardSub}
            >
              <ol style={{ lineHeight: "2rem" }}>
                <li>
                  {
                    "Make sure to have at least one backup of your layers, just in case!"
                  }
                </li>
                <li>{"Click 'Start Countdown'."}</li>
                <li>
                  {
                    "When the countdown reaches zero and the keyboard's lights turn off, press repeatedly or hold the key on the "
                  }
                  <Link
                    href="https://support.dygma.com/hc/en-us/articles/360017056397"
                    color={
                      this.props.darkMode === true ? "primary" : "secondary"
                    }
                  >
                    {"top left corner of your Raise"}
                  </Link>
                  {" (usually the Esc key). Do this for 5-7 seconds."}
                </li>
                <li>
                  {
                    "'Firmware flashed successfully!' will appear on Bazecor's screen."
                  }
                </li>
              </ol>
            </Typography>
            <div className={classes.cardSnack}>
              <SnackbarContent
                className={classes.snackNot}
                message={
                  <Typography component="div" gutterBottom>
                    <div style={{ display: "flex" }}>
                      <Typography component="div">
                        <InfoRounded
                          style={{
                            verticalAlign: "middle",
                            marginRight: "1rem",
                            color: "white"
                          }}
                        />
                      </Typography>
                      <Typography component="div" className={classes.notText}>
                        {
                          "Not following the steps can cause the firmware update process to fail. This won't damage your Raise, but will require you to repeat the process. More information "
                        }
                        <Link
                          href="https://support.dygma.com/hc/en-us/articles/360007272638"
                          color={
                            this.props.darkMode === true
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {"here"}
                        </Link>
                        {"."}
                      </Typography>
                    </div>
                  </Typography>
                }
              />
            </div>
          </div>
        </React.Fragment>
      );
    } else {
      dialogChildren = (
        <React.Fragment>
          <div className={classes.paper}>
            <Typography
              variant="h5"
              gutterBottom
              style={{ fontWeight: "500", paddingBottom: "1rem" }}
            >
              {"Firmware Update Process via Bootloader Mode"}
            </Typography>
            <Typography component="p" gutterBottom className={classes.cardSub}>
              {
                "Click Start Countdown to start the update. The Neuron will flash in multiple colors for a few seconds."
              }
            </Typography>
            <Typography component="p" gutterBottom className={classes.cardSub}>
              {
                "After the update, you will see the message: 'Firmware flashed successfully!'"
              }
            </Typography>
            <Typography component="p" gutterBottom className={classes.cardSub}>
              {
                "Your keyboard lights will remain off and the layout will be reverted to its original settings."
              }
            </Typography>
            <br />
            <br />
            <div className={classes.cardSnack}>
              <SnackbarContent
                className={classes.snackNot}
                message={
                  <Typography component="div" gutterBottom>
                    <div style={{ display: "flex" }}>
                      <Typography component="div">
                        <InfoRounded
                          style={{
                            verticalAlign: "middle",
                            marginRight: "1rem",
                            color: "white"
                          }}
                        />
                      </Typography>
                      <Typography component="div" className={classes.notText}>
                        {
                          "In case the Firmware Update fails, this won't damage your Raise. Repeat the process or do it in "
                        }
                        <Link
                          href="https://support.dygma.com/hc/en-us/articles/360014074997"
                          color={
                            this.props.darkMode === true
                              ? "primary"
                              : "secondary"
                          }
                        >
                          {"another way"}
                        </Link>
                        {"."}
                      </Typography>
                    </div>
                  </Typography>
                }
              />
            </div>
          </div>
        </React.Fragment>
      );
    }

    let currentlyRunning;
    if (versions) {
      currentlyRunning = (
        <React.Fragment>
          <CardContent className={classes.cardSnack}>
            <SnackbarContent
              className={classes.snackVer}
              message={
                <Typography component="div">
                  <div style={{ display: "flex" }}>
                    <Typography component="div">
                      <InfoRounded
                        style={{
                          verticalAlign: "middle",
                          marginRight: "1rem",
                          color: "white"
                        }}
                      />
                    </Typography>
                    <Typography component="div" className={classes.versionText}>
                      {"Your Raise is currently running version "}
                      <strong className={classes.versionStrong}>
                        {versions.bazecor}
                      </strong>
                      {" of the firmware."}
                    </Typography>
                  </div>
                </Typography>
              }
            />
          </CardContent>
          <Divider
            variant="middle"
            style={{
              marginTop: "1rem",
              marginBottom: "1rem"
            }}
          />
        </React.Fragment>
      );
    }

    return (
      <div className={classes.root}>
        <Portal container={this.props.titleElement}>
          {i18n.app.menu.firmwareUpdate}
        </Portal>
        <Card className={classes.card}>
          <CardHeader
            classes={{
              title: classes.cardTitle
            }}
            title={
              versions
                ? "Raise Firmware Update"
                : "Firmware Update Process via Bootloader Mode"
            }
          />
          <CardContent>
            <Typography component="p" gutterBottom className={classes.cardSub}>
              {
                "Updating your Raise firmware is how we implement new cool features and bug fixes. "
              }
            </Typography>
            <Typography component="p" gutterBottom className={classes.cardIta}>
              <i>
                <strong>{"For advanced users: "}</strong>
                {"If you have installed your own "}
                <Link
                  href="https://support.dygma.com/hc/en-us/articles/360017062197"
                  color={this.props.darkMode === true ? "primary" : "secondary"}
                >
                  {"custom firmware"}
                </Link>
                {", this update will overwrite it."}
              </i>
            </Typography>
          </CardContent>
          {currentlyRunning}
          <CardActions>
            {firmwareSelect}
            <div className={classes.grow} />
            <SaveChangesButton
              icon={<CloudUploadIcon />}
              onClick={
                this.state.device.device.info.product === "Raise"
                  ? this.uploadRaise
                  : this.upload
              }
              successMessage={i18n.firmwareUpdate.flashing.buttonSuccess}
              isBeginUpdate={isBeginUpdate}
            >
              {i18n.firmwareUpdate.flashing.button}
            </SaveChangesButton>
          </CardActions>
        </Card>
        <CustomDialog
          open={this.state.confirmationOpen}
          buttonText={countdown > -1 ? buttonText[countdown] : buttonText[""]}
          handleClose={this.cancelDialog}
          upload={this.upload}
          countdown={countdown}
          disabled={countdown !== 3}
        >
          {dialogChildren}
        </CustomDialog>
      </div>
    );
  }
}

export default withStyles(styles)(FirmwareUpdate);

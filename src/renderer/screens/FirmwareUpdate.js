// -*- mode: js-jsx -*-
/* Chrysalis -- Kaleidoscope Command Center
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
import Electron from "electron";
import path from "path";
import fs from "fs";
import { version } from "../../../package.json";

import Focus from "@chrysalis-api/focus";
import FlashRaise from "@chrysalis-api/flash/lib/chrysalis-flash-raise";

import BuildIcon from "@material-ui/icons/Build";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import Divider from "@material-ui/core/Divider";
import ExploreIcon from "@material-ui/icons/ExploreOutlined";
import FormControl from "@material-ui/core/FormControl";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import MenuItem from "@material-ui/core/MenuItem";
import Portal from "@material-ui/core/Portal";
import Select from "@material-ui/core/Select";
import Grid from "@material-ui/core/Grid";
import SettingsBackupRestoreIcon from "@material-ui/icons/SettingsBackupRestore";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";

import { withSnackbar } from "notistack";

import { getStaticPath } from "../config";
import SaveChangesButton from "../components/SaveChangesButton";
import CustomDialog from "../components/CustomDialog";
import i18n from "../i18n";

const styles = theme => ({
  root: {
    display: "flex",
    justifyContent: "center"
  },
  card: {
    margin: theme.spacing.unit * 4,
    maxWidth: "50%"
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
    marginLeft: theme.spacing.unit * 2
  },
  grid: {
    width: "70%"
  },
  img: {
    width: "100%"
  },
  paper: {
    color: theme.palette.getContrastText(theme.palette.background.paper),
    marginBottom: theme.spacing.unit * 2
  }
});

class FirmwareUpdate extends React.Component {
  constructor(props) {
    super(props);

    let focus = new Focus();
    this.fleshRaise = null;
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
      }
    };
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
    if (files) {
      this.setState({ firmwareFilename: files[0] });
    }
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
      await delay(500);
      await this.fleshRaise.resetKeyboard(focus._port);
      this.setState({ countdown: "" });
    }

    return this.state.device.device.flash(
      focus._port,
      filename,
      this.fleshRaise
    );
  };

  upload = async () => {
    await this.props.toggleFlashing();

    try {
      await this._flash();
    } catch (e) {
      console.error(e);
      this.props.enqueueSnackbar(
        this.state.device.device.info.product === "Raise"
          ? e.message
          : i18n.firmwareUpdate.flashing.error,
        {
          variant: "error",
          action: (
            <Button
              variant="contained"
              onClick={() => {
                const shell = Electron.remote && Electron.remote.shell;
                shell.openExternal(
                  "https://github.com/keyboardio/Chrysalis/wiki/Troubleshooting"
                );
              }}
            >
              Troubleshooting
            </Button>
          )
        }
      );
      this.props.toggleFlashing();
      this.props.onDisconnect();
      this.setState({ confirmationOpen: false });
      return;
    }

    return new Promise(resolve => {
      setTimeout(() => {
        this.props.enqueueSnackbar(i18n.firmwareUpdate.flashing.success, {
          variant: "success"
        });

        this.props.toggleFlashing();
        this.props.onDisconnect();
        this.setState({ confirmationOpen: false });
        resolve();
      }, 1000);
    });
  };

  uploadRaise = async () => {
    this.setState({ confirmationOpen: true, isBeginUpdate: true });
    try {
      this.fleshRaise = new FlashRaise(this.props.device);
      await this.fleshRaise.backupSettings();
      this.setState({ countdown: 3 });
    } catch (e) {
      console.error(e);
      this.props.enqueueSnackbar(e.message, {
        variant: "error",
        action: (
          <Button
            variant="contained"
            onClick={() => {
              const shell = Electron.remote && Electron.remote.shell;
              shell.openExternal(
                "https://github.com/keyboardio/Chrysalis/wiki/Troubleshooting"
              );
            }}
          >
            Troubleshooting
          </Button>
        )
      });
      this.setState({ confirmationOpen: false });
    }
  };

  cancelDialog = () => {
    this.setState({ confirmationOpen: false });
  };

  render() {
    const { classes } = this.props;
    const {
      firmwareFilename,
      buttonText,
      countdown,
      isBeginUpdate
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

    const dialogChildren = (
      <React.Fragment>
        <div className={classes.paper}>{i18n.hardware.updateInstructions}</div>
        <Grid container direction="row" justify="center">
          <Grid item className={classes.grid}>
            <img
              src={
                this.isDevelopment
                  ? "./press_esc.png"
                  : path.join(getStaticPath(), "press_esc.png")
              }
              className={classes.img}
              alt="press_esc"
            />
          </Grid>
        </Grid>
      </React.Fragment>
    );

    return (
      <div className={classes.root}>
        <Portal container={this.props.titleElement}>
          {i18n.app.menu.firmwareUpdate}
        </Portal>
        <Card className={classes.card}>
          <CardContent>
            <Typography component="p" gutterBottom>
              {i18n.firmwareUpdate.description}
            </Typography>
            <Typography component="p" gutterBottom className={classes.repo}>
              <a href="https://github.com/keyboardio/Chrysalis-Firmware-Bundle#readme">
                Chrysalis-Firmware-Bundle
              </a>
            </Typography>
            <Typography component="p" gutterBottom>
              {i18n.hardware.updateInstructions}
            </Typography>
            <Typography component="p" gutterBottom>
              {i18n.firmwareUpdate.postUpload}
            </Typography>
          </CardContent>
          <Divider variant="middle" />
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
          title={i18n.firmwareUpdate.raise.reset}
          open={this.state.confirmationOpen}
          buttonText={buttonText[countdown]}
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

export default withSnackbar(withStyles(styles)(FirmwareUpdate));

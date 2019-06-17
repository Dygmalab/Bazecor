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
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import uuid from "uuid";
import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import KeyButton from "./KeyButton";

KeyGroup.propTypes = {
  classes: PropTypes.object.isRequired,
  groupName: PropTypes.string.isRequired,
  group: PropTypes.object.isRequired,
  onKeySelect: PropTypes.func.isRequired,
  selectedKey: PropTypes.number.isRequired
};

const styles = () => ({
  paper: {
    margin: "5px 0",
    padding: 10,
    width: "inherit"
  },
  gridItem: {
    padding: "0 2px"
  }
});

/**
 * Reactjs functional component that create area for key group
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {string} groupName Name of key group
 * @param {object} group Object with data of key group (name, keys)
 * @param {function} onKeySelect Function for change key in keyboard button. Parameter - keyCode from API (@chrysalis-api/keymap)
 * @param {number} selectedKey Numder key that selected in keyboard
 */
function KeyGroup(props) {
  const { classes, groupName, group, onKeySelect, selectedKey } = props;

  return (
    <Paper className={classes.paper}>
      <Grid container alignContent="center">
        {group.keys.map((key, index) => (
          <React.Fragment key={uuid()}>
            {index === 0 && (
              <Grid item xs={12}>
                <Typography align="center" variant="h6">
                  {groupName}
                </Typography>
              </Grid>
            )}
            <Grid item md={1} sm={2} className={classes.gridItem}>
              <KeyButton
                name={key.labels.primary === "" ? "TRANS." : key.labels.primary}
                keyInfo={key}
                onKeySelect={onKeySelect}
                isSelected={key.code === selectedKey}
              />
            </Grid>
          </React.Fragment>
        ))}
      </Grid>
    </Paper>
  );
}

export default withStyles(styles)(KeyGroup);

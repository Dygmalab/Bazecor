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
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import KeyGroups from "./KeyGroups";

SearchArea.propTypes = {
  classes: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  onKeySelect: PropTypes.func.isRequired,
  selectedKey: PropTypes.number.isRequired
};

const styles = () => ({
  root: {
    margin: " 50px 3%",
    width: "94%"
  },
  rootPaper: {
    padding: 20,
    width: "100%",
    height: window.innerHeight - 100
  },
  paper: {
    overflow: "auto",
    overflowX: "hidden",
    padding: 10,
    width: "100%",
    height: "100%"
  }
});
/**
 * Reactjs functional component that create modal window with keys groups
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {boolean} open Prop for render or not render component
 * @param {function} onKeySelect Function for change key in keyboard button. Parameter - keyCode from API (@chrysalis-api/keymap)
 * @param {number} selectedKey Numder key that selected in keyboard
 */
function SearchArea(props) {
  const { classes, open, onKeySelect, selectedKey } = props;

  return (
    <React.Fragment>
      {open && (
        <Grid
          className={classes.root}
          container
          alignContent="center"
          tabIndex="-1"
        >
          <Grid item>
            <Paper id="modal-title" className={classes.rootPaper}>
              <Paper className={classes.paper}>
                <Typography variant="h5" align="center">
                  Please, choose a key
                </Typography>
                <KeyGroups
                  onKeySelect={onKeySelect}
                  selectedKey={selectedKey}
                />
              </Paper>
            </Paper>
          </Grid>
        </Grid>
      )}
    </React.Fragment>
  );
}

export default withStyles(styles)(SearchArea);

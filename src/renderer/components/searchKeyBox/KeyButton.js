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
import Button from "@material-ui/core/Button";
import purple from "@material-ui/core/colors/purple";

KeyButton.propTypes = {
  name: PropTypes.string.isRequired,
  classes: PropTypes.object.isRequired,
  onKeySelect: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
  keyInfo: PropTypes.object.isRequired
};

const styles = theme => ({
  root: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    margin: "2px auto",
    width: "100%",
    "&:hover": {
      backgroundColor: purple[50],
      color: theme.palette.getContrastText(purple[50])
    }
  }
});

/**
 * Reactjs functional component that create key button in key group
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {string} name Label of key
 * @param {function} onKeySelect Function for change key in keyboard button. Parameter - keyCode from API (@chrysalis-api/keymap)
 * @param {object} keyInfo All about key (code, labels)
 * @param {boolean} isSelected Button is selected or no
 */
function KeyButton(props) {
  const { classes, name, onKeySelect, keyInfo, isSelected } = props;

  const selectedStyle = {
    color: "black",
    backgroundColor: purple[100],
    boxShadow: `0px 0px 26px 4px black`
  };

  return (
    <Button
      variant="outlined"
      className={classes.root}
      onClick={() => {
        onKeySelect(keyInfo.code);
      }}
      tabIndex="-1"
      style={isSelected ? selectedStyle : null}
    >
      {name}
    </Button>
  );
}

export default withStyles(styles)(KeyButton);

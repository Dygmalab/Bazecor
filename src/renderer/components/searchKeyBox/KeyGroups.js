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
import { baseKeyCodeTable } from "@chrysalis-api/keymap";
import KeyGroup from "./KeyGroup";

KeyGroups.propTypes = {
  classes: PropTypes.object.isRequired,
  onKeySelect: PropTypes.func.isRequired,
  selectedKey: PropTypes.number.isRequired
};

const styles = () => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyСontent: "space-evenly",
    width: "inherit"
  }
});

/**
 * Reactjs functional component that create area for key groups
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {object} onKeySelect Function for change key in keyboard button. Parameter - keyCode from API (@chrysalis-api/keymap)
 * @param {number} selectedKey Numder key that selected in keyboard
 */
function KeyGroups(props) {
  const { classes, onKeySelect, selectedKey } = props;

  return (
    <div className={classes.root}>
      {baseKeyCodeTable.map(group => (
        <KeyGroup
          key={uuid()}
          group={group}
          groupName={group.groupName}
          onKeySelect={onKeySelect}
          selectedKey={selectedKey}
        />
      ))}
    </div>
  );
}

export default withStyles(styles)(KeyGroups);

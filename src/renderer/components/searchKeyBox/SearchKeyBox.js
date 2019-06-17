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
import React, { useState } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import SearchIcon from "@material-ui/icons/Search";
import Button from "@material-ui/core/Button";
import SearchArea from "./SearchArea";

SearchKeyBox.propTypes = {
  classes: PropTypes.object.isRequired,
  onKeySelect: PropTypes.func.isRequired,
  selectedKey: PropTypes.number.isRequired
};

const styles = () => ({
  root: {
    marginLeft: 14
  }
});
/**
 * Reactjs functional component that create button to choose symbols of key in keyboard
 * @param {object} classes Property that sets up CSS classes that adding to HTML elements
 * @param {object} onKeySelect Function for change key in keyboard button. Parameter - keyCode from API (@chrysalis-api/keymap)
 * @param {number} selectedKey Numder key that selected in keyboard
 */
function SearchKeyBox(props) {
  const { classes, onKeySelect, selectedKey } = props;

  /**
   * This is Hook that lets add React state "open" to functional components for open (close) modal window
   * @param {object} [initialState=false] - Sets initial state for "open".
   */
  const [open, setOpen] = useState(false);

  /**
   * Change "open" in functional component state to open Modal
   */
  const handleClick = () => {
    setOpen(true);
  };

  /**
   * Change "open" in functional component state to close Modal
   */
  const handleClose = () => {
    setOpen(false);
  };

  return (
    <React.Fragment>
      <Button
        size="small"
        variant="outlined"
        onClick={handleClick}
        className={classes.root}
      >
        <SearchIcon />
      </Button>
      <Modal
        aria-labelledby="simple-modal-title"
        open={open}
        onClose={handleClose}
      >
        <SearchArea
          open={open}
          onKeySelect={onKeySelect}
          selectedKey={selectedKey}
        />
      </Modal>
    </React.Fragment>
  );
}

export default withStyles(styles)(SearchKeyBox);

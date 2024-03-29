// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
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

function RegularButton({ selected, onClick, size, buttonText, styles, icoSVG, icoPosition, disabled }) {
  return (
    <button
      type="button"
      onClick={disabled ? () => {} : onClick}
      className={`${size || ""} ${selected ? "active" : ""} button ${styles && styles} iconOn${icoPosition || "None"}`}
      disabled={disabled}
      tabIndex={0}
    >
      <div className="buttonLabel">
        {icoSVG && icoPosition !== "right" ? icoSVG : ""}
        <span className="buttonText" dangerouslySetInnerHTML={{ __html: buttonText }} />
        {icoSVG && icoPosition === "right" ? icoSVG : ""}
      </div>
      <div className="buttonFX" />
    </button>
  );
}

RegularButton.propTypes = {
  selected: PropTypes.bool,
  onClick: PropTypes.func,
  size: PropTypes.string,
  buttonText: PropTypes.string,
  styles: PropTypes.string,
  icoSVG: PropTypes.object,
  icoPosition: PropTypes.string,
  disabled: PropTypes.bool,
};

export default RegularButton;

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

import React, { Component } from "react";

import NavigationMenu from "./NavigationMenu";

class Header extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { connected, pages, flashing, fwUpdate, allowBeta } = this.props;

    return <NavigationMenu connected={connected} pages={pages} flashing={flashing} fwUpdate={fwUpdate} allowBeta={allowBeta} />;
  }
}

export default Header;

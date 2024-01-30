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

import React from "react";
import { HeaderInterface } from "@Renderer/types/navigation";
import NavigationMenu from "./NavigationMenu";

function Header(props: HeaderInterface) {
  const { connected, pages, flashing, fwUpdate, allowBeta, modified, loading, setLoading } = props;

  return (
    <NavigationMenu
      connected={connected}
      pages={pages}
      flashing={flashing}
      fwUpdate={fwUpdate}
      allowBeta={allowBeta}
      modified={modified}
      loading={loading}
      setLoading={setLoading}
    />
  );
}

export default Header;

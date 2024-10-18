/* eslint-disable import/no-cycle */
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2024  Dygma Lab S.L.
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

// general
import React from "react";
// types
import { PickerProps } from "@Renderer/types/keyPicker";
// components
import { KeyPicker } from ".";

function Picker(props: PickerProps) {
  const { onKeySelect, selectedlanguage, baseCode, modCode, disable, disableMods, disableMove } = props;

  return (
    <KeyPicker
      onKeySelect={(e: any) => onKeySelect(e)}
      code={{
        base: baseCode,
        modified: modCode,
      }}
      disableMods={disableMods}
      disableMove={disableMove}
      disableAll={disable}
      selectedlanguage={selectedlanguage}
    />
  );
}

export default Picker;

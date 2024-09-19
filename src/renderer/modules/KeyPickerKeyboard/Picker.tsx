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
  const {
    action,
    actions,
    onKeySelect,
    activeTab,
    selectedlanguage,
    kbtype,
    baseCode,
    modCode,
    disable,
    macros,
    superkeys,
    keyCode,
    isWireless,
  } = props;

  return (
    <KeyPicker
      onKeySelect={(e: any) => onKeySelect(e)}
      code={{
        base: actions[action] > 255 ? baseCode : actions[action],
        modified: modCode,
      }}
      disableMods={([0, 3].includes(action) && activeTab === "disabled") || activeTab === "dualFunction"}
      disableMove={(![0, 3].includes(action) && activeTab === "super") || activeTab === "dualFunction"}
      disableAll={disable}
      selectedlanguage={selectedlanguage}
      kbtype={kbtype}
      keyCode={keyCode}
      macros={macros}
      superkeys={superkeys}
      activeTab={activeTab}
      action={action}
      actions={actions}
      isWireless={isWireless}
    />
  );
}

export default Picker;

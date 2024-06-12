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

import React, { Component } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectFixedValue } from "@Renderer/components/atoms/Select";

class SelectMacroCustomDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { keyCode, onKeySelect, macros, disabled } = this.props;
    const KC = keyCode.base + keyCode.modified;
    const mcros = Array(macros.length)
      .fill()
      .map((_, i) => i + 53852);

    return (
      <Select
        value={macros[mcros.indexOf(KC)] != undefined ? String(mcros[mcros.indexOf(KC)]) : ""}
        onValueChange={value => {
          onKeySelect(parseInt(value, 10));
        }}
        disabled={disabled}
      >
        <SelectTrigger
          variant="comboButton"
          size="sm"
          className={`w-full pr-[4px] relative [&>svg]:order-3 ${
            macros[mcros.indexOf(KC)] != undefined
              ? "!bg-configButtonActive dark:!bg-configButtonDarkActive bg-purple-200 dark:!bg-purple-300 !border-purple-200 dark:border-none text-white !shadow-buttonConfigLightActive !text-white [&_svg]:!text-white relative after:absolute after:top-[-4px] after:right-[-2px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary/100"
              : ""
          } ${disabled ? "!pointer-events-none !opacity-50" : ""}`}
        >
          <SelectFixedValue label="Macros" />
        </SelectTrigger>
        <SelectContent className="min-w-80">
          {mcros.map((item, index) => (
            // eslint-disable-next-line
            <SelectItem value={item.toString()} key={`macrosAdvancedView-${index}`} disabled={item === -1}>
              {`${index + 1}. ${macros[index].name}`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
}

export default SelectMacroCustomDropdown;

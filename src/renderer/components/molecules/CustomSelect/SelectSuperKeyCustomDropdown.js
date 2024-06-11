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

class SelectSuperKeyCustomDropdown extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.taps = ["TAP", "HOLD", "T&H", "2TAP", "2T&H"];
  }

  render() {
    const { action, actions, selKeys, onKeySelect, superkeys, keyCode, notifText, disabled } = this.props;

    const KC = keyCode.base + keyCode.modified;
    const superk = Array(superkeys.length)
      .fill()
      .map((_, i) => i + 53980);

    const adjactions = actions;
    if (adjactions.length < 5) {
      while (adjactions.length < 5) {
        adjactions.push(0);
      }
    }

    const skSel = (
      <>
        <Select
          value={superkeys[superk.indexOf(KC)] !== undefined ? superk[superk.indexOf(KC)] : ""}
          onValueChange={value => {
            onKeySelect(parseInt(value));
          }}
          disabled={disabled}
        >
          <SelectTrigger
            variant="comboButton"
            size="sm"
            className={`w-full pr-[4px] relative before:content-['BETA'] before:bg-primary/100 before:rounded-[12px] before:text-[7px] before:px-[4px] before:py-[3px] before:ml-[-8px] before:leading-none before:order-3 before:absolute before:left-[78px] [&>svg]:order-3 ${
              superkeys[superk.indexOf(KC)] !== undefined
                ? "!bg-configButtonActive dark:!bg-configButtonDarkActive bg-purple-200 dark:!bg-purple-300 !border-purple-200 dark:border-none text-white !shadow-buttonConfigLightActive !text-white [&_svg]:!text-white relative after:absolute after:top-[-4px] after:right-[-2px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary/100"
                : ""
            } ${disabled ? "!pointer-events-none !opacity-50" : ""}`}
          >
            <SelectFixedValue label="Superkeys" />
          </SelectTrigger>
          <SelectContent className="min-w-80">
            {superk.map((item, index) => (
              // eslint-disable-next-line
              <SelectItem value={item.toString()} key={`superkeysAdvancedView-${index}`} disabled={item == -1}>
                {`${index + 1}. ${superkeys[index].name}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </>
    );

    return <>{skSel}</>;
  }
}

export default SelectSuperKeyCustomDropdown;

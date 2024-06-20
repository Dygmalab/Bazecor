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

import React, { FC, useMemo, useCallback } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectFixedValue } from "@Renderer/components/atoms/Select";

interface Macro {
  name: string;
}

interface SelectMacroCustomDropdownProps {
  keyCode: { base: number; modified: number };
  onKeySelect: (value: number) => void;
  macros: Macro[];
  disabled?: boolean;
}

const SelectMacroCustomDropdown: FC<SelectMacroCustomDropdownProps> = ({ keyCode, onKeySelect, macros, disabled = false }) => {
  const KC = useMemo(() => keyCode.base + keyCode.modified, [keyCode]);

  const mcros = useMemo(
    () =>
      Array(macros.length)
        .fill(0)
        .map((_, i) => i + 53852),
    [macros.length],
  );

  const handleValueChange = useCallback(
    (value: string) => {
      onKeySelect(parseInt(value, 10));
    },
    [onKeySelect],
  );

  const selectedMacroIndex = useMemo(() => mcros.indexOf(KC), [KC, mcros]);

  const selectedValue = useMemo(
    () => (selectedMacroIndex !== -1 ? String(mcros[selectedMacroIndex]) : ""),
    [selectedMacroIndex, mcros],
  );

  return (
    <Select value={selectedValue} onValueChange={handleValueChange} disabled={disabled}>
      <SelectTrigger
        variant="comboButton"
        size="sm"
        className={`w-full pr-[4px] relative [&>svg]:order-3 ${
          selectedMacroIndex !== -1
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
};

export default SelectMacroCustomDropdown;

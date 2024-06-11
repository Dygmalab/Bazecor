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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectFixedValue } from "@Renderer/components/atoms/select";

import { KeymapDB } from "../../../../api/keymap";

function SelectF13PlusKeys(props: any) {
  const { keyCode, onSelect, value, listElements, content, disabled } = props;
  const [load, setLoad] = React.useState(true);
  const keymapDB = new KeymapDB();

  const labelKey = (id: number) => {
    const aux = keymapDB.parse(id);
    return aux.label;
  };

  React.useEffect(() => {
    if (content !== undefined) {
      // console.log("keyCode: ", keyCode);
      setLoad(false);
    }
  }, [content, value, keyCode]);

  if (load) return null;
  return (
    <div>
      <Select onValueChange={val => onSelect(parseInt(val, 10))} disabled={disabled}>
        <SelectTrigger
          variant="comboButton"
          size="sm"
          className={`w-full pr-[4px] ${
            keyCode.base > 0 && listElements.map(i => i).includes(keyCode.base)
              ? "!bg-configButtonActive dark:!bg-configButtonDarkActive bg-purple-200 dark:!bg-purple-300 !border-purple-200 dark:border-none text-white !shadow-buttonConfigLightActive !text-white [&_svg]:!text-white relative after:absolute after:top-[-4px] after:right-[-2px] after:w-[8px] after:h-[8px] after:rounded-full after:bg-primary/100"
              : ""
          } ${disabled ? "!pointer-events-none !opacity-50" : ""}`}
        >
          <SelectFixedValue label="F13+" />
        </SelectTrigger>
        <SelectContent>
          {listElements.map((item: any, index: number) => (
            // eslint-disable-next-line react/no-array-index-key
            <SelectItem value={item} key={`f13Plus-${index}`}>
              {labelKey(item)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

export default SelectF13PlusKeys;

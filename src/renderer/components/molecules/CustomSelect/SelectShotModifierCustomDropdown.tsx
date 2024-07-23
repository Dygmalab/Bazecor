// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  Dygmalab, Inc.
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
import { Popover, PopoverContent, PopoverTrigger, PopoverButton } from "@Renderer/components/atoms/Popover";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";
import { IconOneShotMode } from "@Renderer/components/atoms/icons";

interface SelectShotModifierCustomDropdownProps {
  keyCode: { base: number; modified: number };
  onKeySelect: (value: number) => void;
  disable?: boolean;
}

interface OneShotKey {
  name: "control" | "shift" | "alt" | "os" | "altGr";
  direction?: "Left" | "Right";
  keynum: number;
}

const SelectShotModifierCustomDropdown: FC<SelectShotModifierCustomDropdownProps> = ({
  keyCode,
  onKeySelect,
  disable = false,
}) => {
  const oneShotLayers = useMemo(
    () => [
      { name: "1", keynum: 49161 },
      { name: "2", keynum: 49162 },
      { name: "3", keynum: 49163 },
      { name: "4", keynum: 49164 },
      { name: "5", keynum: 49165 },
      { name: "6", keynum: 49166 },
      { name: "7", keynum: 49167 },
      { name: "8", keynum: 49168 },
    ],
    [],
  );

  const oneShotModifiers: OneShotKey[] = useMemo(
    () => [
      { name: "shift", direction: "Left", keynum: 49154 },
      { name: "control", direction: "Left", keynum: 49153 },
      { name: "os", direction: "Left", keynum: 49156 },
      { name: "alt", direction: "Left", keynum: 49155 },
      { name: "shift", direction: "Right", keynum: 49158 },
      { name: "control", direction: "Right", keynum: 49157 },
      { name: "os", direction: "Right", keynum: 49160 },
      { name: "altGr", direction: undefined, keynum: 49159 },
    ],
    [],
  );

  const KC = useMemo(() => keyCode.base + keyCode.modified, [keyCode]);

  const isActive = useMemo(
    () => oneShotLayers.some(i => i.keynum === KC) || oneShotModifiers.some(i => i.keynum === KC),
    [KC, oneShotLayers, oneShotModifiers],
  );

  const handleClick = useCallback(
    (keynum: number) => {
      onKeySelect(keynum);
    },
    [onKeySelect],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <PopoverButton active={isActive} disabled={disable}>
          OneShot
        </PopoverButton>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="large-dropdown-inner p-2 rounded-sm bg-gray-25/40 dark:bg-gray-800">
          <div className="dropdown-group">
            <Heading headingLevel={5} renderAs="h5" className="felx gap-2 items-center my-1 text-gray-200 dark:text-gray-300">
              <IconOneShotMode />{" "}
              <span>
                OneShot <span className="text-gray-400 dark:text-gray-50">Layer</span>
              </span>
            </Heading>
            <div className="dropdown-group-buttons flex rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              {oneShotLayers.map(item => (
                <Button
                  variant="config"
                  size="sm"
                  onClick={() => handleClick(item.keynum)}
                  selected={item.keynum === KC}
                  disabled={item.keynum === -1}
                  key={`oneShotLayer-${item.keynum}`}
                  className="shrink grow basis-[0%]"
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>

          <div className="dropdown-group pt-2 mt-2 border-t border-gray-50 dark:border-gray-700">
            <Heading headingLevel={5} renderAs="h5" className="flex gap-2 items-center my-1 text-gray-200 dark:text-gray-300">
              <IconOneShotMode mode="modifier" />{" "}
              <span>
                OneShot <span className="text-gray-400 dark:text-gray-50">Modifiers</span>
              </span>
            </Heading>
            <div className="dropdown-group-buttons grid grid-cols-4 rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              {oneShotModifiers.map(item => (
                <Button
                  variant="config"
                  size="sm"
                  onClick={() => handleClick(item.keynum)}
                  selected={item.keynum === KC}
                  disabled={item.keynum === -1}
                  key={`oneShotModifier-${item.keynum}`}
                  className="shrink grow basis-[0%] items-center"
                >
                  <OSKey renderKey={item.name} direction={item.direction} size="sm" />
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectShotModifierCustomDropdown;

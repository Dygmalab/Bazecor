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
import { i18n } from "@Renderer/i18n";

interface SelectShotModifierCustomDropdownProps {
  keyCode: { base: number; modified: number };
  onKeySelect: (value: number) => void;
  disable?: boolean;
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

  const oneShotModifiers = useMemo(
    () => [
      { name: i18n.editor.standardView.oneShot.leftControl, keynum: 49153 },
      { name: i18n.editor.standardView.oneShot.leftShift, keynum: 49154 },
      { name: i18n.editor.standardView.oneShot.leftAlt, keynum: 49155 },
      { name: i18n.editor.standardView.oneShot.leftOS, keynum: 49156 },
      { name: i18n.editor.standardView.oneShot.rightControl, keynum: 49157 },
      { name: i18n.editor.standardView.oneShot.rightShift, keynum: 49158 },
      { name: i18n.editor.standardView.oneShot.altGr, keynum: 49159 },
      { name: i18n.editor.standardView.oneShot.rightOS, keynum: 49160 },
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
            <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
              OneShot <span className="text-gray-400 dark:text-gray-50">Layer</span>
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
            <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
              OneShot <span className="text-gray-400 dark:text-gray-50">Modifiers</span>
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
                  className="shrink grow basis-[0%]"
                >
                  {item.name}
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

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

interface SelectMouseCustomDropdownProps {
  keyCode: { base: number; modified: number };
  onKeySelect: (value: number) => void;
  disable?: boolean;
  activeTab?: string;
}

const SelectMouseCustomDropdown: FC<SelectMouseCustomDropdownProps> = ({
  keyCode,
  onKeySelect,
  disable = false,
  activeTab = "layout",
}) => {
  const mouseClick = useMemo(
    () => [
      { name: i18n.editor.superkeys.specialKeys.left, keynum: 20545 },
      { name: i18n.editor.superkeys.specialKeys.middle, keynum: 20548 },
      { name: i18n.editor.superkeys.specialKeys.right, keynum: 20546 },
      { name: i18n.editor.superkeys.specialKeys.back, keynum: 20552 },
      { name: i18n.editor.superkeys.specialKeys.fwd, keynum: 20560 },
    ],
    [],
  );

  const mouseMovement = useMemo(
    () => [
      { name: i18n.editor.superkeys.specialKeys.left, keynum: 20484 },
      { name: i18n.editor.superkeys.specialKeys.right, keynum: 20488 },
      { name: i18n.editor.superkeys.specialKeys.up, keynum: 20481 },
      { name: i18n.editor.superkeys.specialKeys.down, keynum: 20482 },
    ],
    [],
  );

  const mouseWheel = useMemo(
    () => [
      { name: i18n.editor.superkeys.specialKeys.left, keynum: 20500 },
      { name: i18n.editor.superkeys.specialKeys.right, keynum: 20504 },
      { name: i18n.editor.superkeys.specialKeys.up, keynum: 20497 },
      { name: i18n.editor.superkeys.specialKeys.down, keynum: 20498 },
    ],
    [],
  );

  const KC = useMemo(() => keyCode.base + keyCode.modified, [keyCode]);

  const isActive = useMemo(
    () =>
      mouseClick.some(i => i.keynum === KC) || mouseMovement.some(i => i.keynum === KC) || mouseWheel.some(i => i.keynum === KC),
    [KC, mouseClick, mouseMovement, mouseWheel],
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
          Mouse events
        </PopoverButton>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="large-dropdown-inner p-2 rounded-sm bg-gray-25/40 dark:bg-gray-800">
          <div className="dropdown-group">
            <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
              Mouse <span className="text-gray-400 dark:text-gray-50">Click</span>
            </Heading>
            <div className="dropdown-group-buttons flex rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              {mouseClick.map(item => (
                <Button
                  variant="config"
                  size="sm"
                  onClick={() => handleClick(item.keynum)}
                  selected={item.keynum === KC}
                  disabled={item.keynum === -1}
                  key={`mouseClick-${item.keynum}`}
                  className="shrink grow basis-[0%]"
                >
                  {item.name}
                </Button>
              ))}
            </div>
          </div>
          {activeTab !== "super" ? (
            <>
              <div className="dropdown-group pt-2 mt-2 border-t border-gray-50 dark:border-gray-700">
                <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
                  Mouse <span className="text-gray-400 dark:text-gray-50">Movement</span>
                </Heading>
                <div className="dropdown-group-buttons flex rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
                  {mouseMovement.map(item => (
                    <Button
                      variant="config"
                      size="sm"
                      onClick={() => handleClick(item.keynum)}
                      selected={item.keynum === KC}
                      disabled={item.keynum === -1}
                      key={`mouseMovement-${item.keynum}`}
                      className="shrink grow basis-[0%]"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
              <div className="dropdown-group pt-2 mt-2 border-t border-gray-50 dark:border-gray-700">
                <Heading headingLevel={5} renderAs="h5" className="my-1 text-gray-200 dark:text-gray-300">
                  Mouse <span className="text-gray-400 dark:text-gray-50">Wheel</span>
                </Heading>
                <div className="dropdown-group-buttons flex rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
                  {mouseWheel.map(item => (
                    <Button
                      variant="config"
                      size="sm"
                      onClick={() => handleClick(item.keynum)}
                      selected={item.keynum === KC}
                      disabled={item.keynum === -1}
                      key={`mouseWheel-${item.keynum}`}
                      className="shrink grow basis-[0%]"
                    >
                      {item.name}
                    </Button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            ""
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectMouseCustomDropdown;

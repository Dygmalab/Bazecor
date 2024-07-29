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
import { Popover, PopoverContent, PopoverTrigger, PopoverButton } from "@Renderer/components/atoms/Popover";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { IconLayerLock, IconLayerShift } from "@Renderer/components/atoms/icons";

interface SelectLayersCustomDropdownProps {
  action?: any;
  keyCode: { base: number; modified: number };
  onKeySelect: (value: number) => void;
  activeTab: string;
  disableMods?: boolean;
  disable?: boolean;
}

const SelectLayersCustomDropdown: FC<SelectLayersCustomDropdownProps> = ({
  action,
  keyCode,
  onKeySelect,
  activeTab,
  disableMods = false,
  disable = false,
}) => {
  const layerLock = useMemo(
    () => [
      { name: "Layer Lock 1", keynum: 17492 },
      { name: "Layer Lock 2", keynum: 17493 },
      { name: "Layer Lock 3", keynum: 17494 },
      { name: "Layer Lock 4", keynum: 17495 },
      { name: "Layer Lock 5", keynum: 17496 },
      { name: "Layer Lock 6", keynum: 17497 },
      { name: "Layer Lock 7", keynum: 17498 },
      { name: "Layer Lock 8", keynum: 17499 },
      { name: "Layer Lock 9", keynum: 17500 },
      { name: "Layer Lock 10", keynum: 17501 },
    ],
    [],
  );

  const layerSwitch = useMemo(
    () => [
      { name: "Layer Shift 1", keynum: 17450 },
      { name: "Layer Shift 2", keynum: 17451 },
      { name: "Layer Shift 3", keynum: 17452 },
      { name: "Layer Shift 4", keynum: 17453 },
      { name: "Layer Shift 5", keynum: 17454 },
      { name: "Layer Shift 6", keynum: 17455 },
      { name: "Layer Shift 7", keynum: 17456 },
      { name: "Layer Shift 8", keynum: 17457 },
      { name: "Layer Shift 9", keynum: 17458 },
      { name: "Layer Shift 10", keynum: 17459 },
    ],
    [],
  );

  const KC = useMemo(() => keyCode.base + keyCode.modified, [keyCode]);

  const handleKeySelect = useCallback(
    (keynum: number) => {
      onKeySelect(keynum);
    },
    [onKeySelect],
  );

  const isActive = useMemo(
    () =>
      keyCode.modified > 0 && (layerLock.some(({ keynum }) => keynum === KC) || layerSwitch.some(({ keynum }) => keynum === KC)),
    [KC, keyCode.modified, layerLock, layerSwitch],
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <PopoverButton active={isActive} disabled={disable}>
          Layers
        </PopoverButton>
      </PopoverTrigger>
      <PopoverContent align="start">
        <div className="large-dropdown-inner p-2 rounded-sm bg-gray-25/40 dark:bg-gray-800">
          <div
            className={`dropdown-group ${activeTab === "super" ? "" : ""} ${
              (action === 0 && activeTab === "super") || (action === 3 && activeTab === "super")
                ? "opacity-50 pointer-events-none"
                : ""
            }`}
          >
            <Heading headingLevel={5} renderAs="h5" className="my-1 flex gap-2 items-center text-gray-200 dark:text-gray-300">
              <IconLayerShift />{" "}
              <span>
                Layer <span className="text-gray-400 dark:text-gray-50">Shift</span>
              </span>
            </Heading>
            <div className="dropdown-group-buttons flex rounded-sm p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              {layerSwitch.map((item, id) => (
                <Button
                  variant="config"
                  size="sm"
                  onClick={() => handleKeySelect(item.keynum)}
                  selected={keyCode.modified > 0 && item.keynum === KC}
                  disabled={
                    disableMods ||
                    item.keynum === -1 ||
                    (action === 0 && activeTab === "super") ||
                    (action === 3 && activeTab === "super")
                  }
                  key={`buttonShiftLayer-${item.keynum}`}
                >
                  {id + 1}
                </Button>
              ))}
            </div>
          </div>
          <div className="dropdown-group pt-2 mt-2 border-t border-gray-50 dark:border-gray-700">
            <Heading headingLevel={5} renderAs="h5" className="my-1 flex gap-2 items-center text-gray-200 dark:text-gray-300">
              <IconLayerLock />{" "}
              <span>
                Layer <span className="text-gray-400 dark:text-gray-50">Lock</span>
              </span>
            </Heading>
            <div className="dropdown-group-buttons rounded-sm flex p-[3px] gap-[3px] bg-white/100 dark:bg-gray-900/20">
              {layerLock.map((item, id) => (
                <Button
                  variant="config"
                  size="sm"
                  onClick={() => handleKeySelect(item.keynum)}
                  selected={keyCode.modified > 0 && item.keynum === KC}
                  disabled={disableMods || item.keynum === -1}
                  key={`buttonLockLayer-${item.keynum}`}
                >
                  {id + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default SelectLayersCustomDropdown;

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

import React from "react";

import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

import { IconLeaf } from "@Renderer/components/atoms/icons";

interface SavingModeIndicatorProps {
  isSavingMode: boolean;
  deviceType?: string;
}

function SavingModeIndicator({ isSavingMode, deviceType }: SavingModeIndicatorProps) {
  const isSonsei = deviceType?.toLowerCase().includes("sonsei");
  const positionClass = isSonsei ? "bottom-[2px]" : "top-[98px]";
  const colorClass = isSonsei && isSavingMode ? "text-gray-900 dark:text-gray-900" : "";

  return (
    <div
      className={`batterySavingMode absolute ${positionClass} left-1/2 transition-colors ${isSavingMode ? "savingModeEnabled status--saving" : "savingModeDisabled status--default"} ${colorClass}`}
    >
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <IconLeaf />
          </TooltipTrigger>
          <TooltipContent>
            Saving mode <strong>{isSavingMode ? "enabled" : "disabled"}</strong>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}

export default SavingModeIndicator;

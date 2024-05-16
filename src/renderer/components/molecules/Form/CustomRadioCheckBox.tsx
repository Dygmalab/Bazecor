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

import { Checkbox } from "@Renderer/components/atoms/Checkbox";
import { Label } from "@Renderer/components/atoms/Label";
import Heading from "@Renderer/components/atoms/Heading";
import { CustomRCBProps } from "@Renderer/types/customRadioCheckBox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

import { IconInformation } from "@Renderer/components/atoms/icons";

function CustomRadioCheckBox(props: CustomRCBProps) {
  const { label, type, id, name, tooltip, className, onClick, disabled, checked } = props;
  return (
    <div className={`customCheckbox ${className}`}>
      <div className="flex flex-nowrap items-center mt-3 hover:cursor-pointer" id={`input-${id}`}>
        <Checkbox
          id={`input-${id}-${type}`}
          name={name}
          disabled={disabled || false}
          checked={checked}
          onCheckedChange={onClick}
        />
        <Label className="pl-2 flex items-center mb-0" htmlFor={`input-${id}-${type}`}>
          <Heading
            headingLevel={6}
            renderAs="paragraph-sm"
            className={`flex items-center ${tooltip ? "gap-2 [&_.tooltipIcon]:text-purple-200" : ""}`}
          >
            {label}
            {tooltip && (
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                    <IconInformation size="sm" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">{tooltip}</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </Heading>
        </Label>
      </div>
    </div>
  );
}

export default CustomRadioCheckBox;

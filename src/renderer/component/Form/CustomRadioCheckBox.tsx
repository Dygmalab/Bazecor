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

import OverlayTrigger from "react-bootstrap/OverlayTrigger";
import Tooltip from "react-bootstrap/Tooltip";

import { Checkbox } from "@Renderer/components/ui/checkbox";
import { Label } from "@Renderer/components/ui/label";
import Heading from "@Renderer/components/ui/heading";
import { CustomRCBProps } from "@Renderer/types/customRadioCheckBox";

import { IconInformationBubble } from "@Renderer/component/Icon";

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
              <OverlayTrigger placement="top" overlay={<Tooltip id="tooltip-top">{tooltip}</Tooltip>}>
                <span className="tooltipIcon">
                  <IconInformationBubble />
                </span>
              </OverlayTrigger>
            )}
          </Heading>
        </Label>
      </div>
    </div>
  );
}

export default CustomRadioCheckBox;

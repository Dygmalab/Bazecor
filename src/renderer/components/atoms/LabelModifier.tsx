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
 *
 */

import React from "react";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";

interface LabelModifierProps {
  label?: "control" | "shift" | "os" | "alt" | "altGr" | "Hyper" | "Meh";
  size?: "xs" | "sm" | "md";
}

const LabelModifier = ({ label, size = "md" }: LabelModifierProps) => (
  <div
    className={`font-semibold tracking-tight rounded-xl backdrop-blur-sm ${
      size === "md"
        ? "border-[1px] border-solid border-gray-800/10 dark:border-gray-800/50 text-gray-25 dark:text-gray-50 bg-gray-400/50 px-[8px] py-[4px] text-[11px]"
        : ""
    } 
    ${size === "sm" ? "text-gray-200 bg-gray-600/60 px-[3px] py-[6px] text-[10px]" : ""}`}
  >
    {label === "Hyper" || label === "Meh" ? label : <OSKey renderKey={label} size={size} />}
  </div>
);

export default LabelModifier;

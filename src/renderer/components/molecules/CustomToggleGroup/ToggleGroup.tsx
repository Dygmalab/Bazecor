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

import React from "react";
import { Button } from "@Renderer/components/atoms/Button";

interface ItemButton {
  name: string;
  value: string | number | boolean;
  index: number;
  icon?: React.ReactNode;
}
interface ToggleGroupProps {
  triggerFunction: (value: string | number | boolean) => void;
  value: string | number | boolean;
  listElements: ItemButton[];
  variant?: "flex" | "regular";
  size?: "sm" | "md";
}
const ToggleGroup = ({ triggerFunction, value, listElements, variant = "regular", size = "md" }: ToggleGroupProps) => (
  <div className="toggleButtonsContainer">
    <strong className="sr-only hidden">{value}</strong>
    <div
      className={`toggleButtonsInner flex items-center justify-start gap-1 p-[4px] rounded-regular border-[1px] border-solid border-gray-100/60 bg-white/30 dark:border-transparent dark:bg-gray-900/25 ${variant === "flex" ? "w-fit [&_.button-config]:basis-full [&_.button-config]:text-center" : "w-full [&_.button-config]:flex-1 [&_.button-config]:text-center"}`}
    >
      {listElements.map(item => (
        <Button
          onClick={() => {
            triggerFunction(item.value);
          }}
          variant="config"
          selected={value === item.value}
          icon={item.icon}
          iconDirection="left"
          key={item.index}
          size={size}
          disabled={false}
          className="shrink grow basis-[0%] text-center"
        >
          {item.name}
        </Button>
      ))}
    </div>
  </div>
);

export default ToggleGroup;

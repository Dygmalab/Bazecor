import React from "react";

import { i18n } from "@Renderer/i18n";

import { ToggleGroup, ToggleGroupItem } from "@Renderer/components/atoms/ToggleGroup";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { IconKeyboard, IconKeysUnderglow } from "@Renderer/components/atoms/icons";

interface ToggleGroupLayoutSelectorProps {
  value: "keys" | "keyboard";
  onValueChange: (value: "keys" | "keyboard") => void;
}

const ToggleGroupKeyboardViewMode = ({ value, onValueChange }: ToggleGroupLayoutSelectorProps) => (
  <ToggleGroup
    type="single"
    value={value}
    onValueChange={next => onValueChange(next === "keys" || next === "keyboard" ? next : value)}
    className="p-[2px]"
  >
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ToggleGroupItem
              value="keys"
              aria-label={i18n.editor.keys}
              className="sm:px-2 md:px-2 lg:px-2 xl:px-[16px] !rounded-2sm"
            >
              <IconKeyboard /> <span className="sm:hidden md:hidden lg:hidden xl:inline-flex">{i18n.editor.keys}</span>
            </ToggleGroupItem>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs sm:flex md:flex lg:flex xl:hidden" size="sm">
          {i18n.editor.keysEditor}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ToggleGroupItem
              value="keyboard"
              aria-label={i18n.app.device}
              className="sm:px-2 md:px-2 lg:px-2 xl:px-[16px] !rounded-2sm"
            >
              <IconKeysUnderglow /> <span className="sm:hidden md:hidden lg:hidden xl:inline-flex">{i18n.app.device}</span>
            </ToggleGroupItem>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs sm:flex md:flex lg:flex xl:hidden" size="sm">
          {i18n.editor.keyboardView}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ToggleGroup>
);

export default ToggleGroupKeyboardViewMode;

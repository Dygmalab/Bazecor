import React from "react";

import { i18n } from "@Renderer/i18n";

import { ToggleGroup, ToggleGroupItem } from "@Renderer/components/atoms/ToggleGroup";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { IconKeyboard, IconFlashlight } from "@Renderer/components/atoms/icons";

interface ToggleGroupLayoutSelectorProps {
  value: string;
  onValueChange: () => void;
}

const ToggleGroupKeyboardViewMode = ({ value, onValueChange }: ToggleGroupLayoutSelectorProps) => (
  <ToggleGroup type="single" value={value} onValueChange={onValueChange} className="p-[2px]">
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <ToggleGroupItem asChild={false} value="keyboard" className="sm:px-2 md:px-2 lg:px-2 xl:px-[16px]">
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
            <ToggleGroupItem asChild={false} value="color" className="sm:px-2 md:px-2 lg:px-2 xl:px-[16px]">
              <IconFlashlight /> <span className="sm:hidden md:hidden lg:hidden xl:inline-flex">{i18n.editor.color.color}</span>
            </ToggleGroupItem>
          </div>
        </TooltipTrigger>
        <TooltipContent className="max-w-xs sm:flex md:flex lg:flex xl:hidden" size="sm">
          {i18n.editor.color.colorEditor}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  </ToggleGroup>
);

export default ToggleGroupKeyboardViewMode;

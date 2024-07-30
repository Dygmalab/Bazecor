import React from "react";

import { i18n } from "@Renderer/i18n";

import { ToggleGroup, ToggleGroupItem } from "@Renderer/components/atoms/ToggleGroup";
import Heading from "@Renderer/components/atoms/Heading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { IconEditModeStandardView, IconEditModeSingleView, IconInformation } from "@Renderer/components/atoms/icons";

interface ToggleGroupLayoutViewModeProps {
  value: string;
  onValueChange: () => void;
  viewMode?: "keyboard" | "color" | "superkeys";
}

const ToggleGroupLayoutViewMode = ({ value, onValueChange, viewMode }: ToggleGroupLayoutViewModeProps) => (
  <div
    className={`self-start mt-auto ${viewMode === "keyboard" && value === "single" ? "-mt-8 -mb-2 pt-1" : "mt-auto mb-6 pt-4"}`}
  >
    <Heading renderAs="h5" headingLevel={5} className="mb-1 gap-2 flex items-center text-[10px] text-gray-300 dark:text-gray-500">
      {i18n.editor.editMode.title}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
            <IconInformation size="sm" />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{i18n.editor.superkeys.tooltip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Heading>
    <ToggleGroup type="single" value={value} onValueChange={onValueChange} size="sm">
      <ToggleGroupItem value="standard" size="sm">
        <IconEditModeStandardView size="sm" /> {i18n.editor.editMode.standardView}
      </ToggleGroupItem>
      <ToggleGroupItem value="single" size="sm">
        <IconEditModeSingleView size="sm" /> {i18n.editor.editMode.singleView}
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
);

export default ToggleGroupLayoutViewMode;

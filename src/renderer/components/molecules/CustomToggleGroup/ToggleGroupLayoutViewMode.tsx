import React from "react";

import { i18n } from "@Renderer/i18n";

import { ToggleGroup, ToggleGroupItem } from "@Renderer/components/atoms/ToggleGroup";
import Heading from "@Renderer/components/atoms/Heading";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { IconEditModeStandardView, IconEditModeSingleView, IconInformation } from "@Renderer/components/atoms/icons";

interface PositionProps {
  x: number;
  y: number;
}
interface ToggleGroupLayoutViewModeProps {
  value: string;
  onValueChange: () => void;
  view: "layout" | "superkeys";
  layoutSelectorPosition?: PositionProps;
}

const ToggleGroupLayoutViewMode = ({
  value,
  onValueChange,
  layoutSelectorPosition = { x: 0, y: 0 },
  view,
}: ToggleGroupLayoutViewModeProps) => (
  <div
    className={`self-start mt-auto mb-6 pt-4 ${value === "single" && view === "layout" ? "absolute" : " "}`}
    style={{ top: layoutSelectorPosition.y, left: layoutSelectorPosition.x }}
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
      <ToggleGroupItem value="standard">
        <IconEditModeStandardView size="sm" /> {i18n.editor.editMode.standardView}
      </ToggleGroupItem>
      <ToggleGroupItem value="single">
        <IconEditModeSingleView size="sm" /> {i18n.editor.editMode.singleView}
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
);

export default ToggleGroupLayoutViewMode;

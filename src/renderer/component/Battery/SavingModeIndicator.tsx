import React from "react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

import Styled from "styled-components";

import { IconLeaf } from "@Renderer/components/atoms/icons";

const Style = Styled.div`
&.status--default {
    --color-status: ${({ theme }) => theme.styles.batteryIndicator.strokeShapeColor};
}
&.status--saving{
    --color-status: ${({ theme }) => theme.colors.brandWarning};
}
&.status--charging.status--saving{
  --color-status: ${({ theme }) => theme.styles.batteryIndicator.fillShapeColor};
}
&.batterySavingMode {
    color: var(--color-status);
    transform: translate3d(-50%, -4px, 0);
}
`;

interface SavingModeIndicatorProps {
  isSavingMode: boolean;
}

function SavingModeIndicator({ isSavingMode }: SavingModeIndicatorProps) {
  return (
    <Style
      className={`batterySavingMode absolute top-[98px] left-1/2 transition-all ${isSavingMode ? "savingModeEnabled status--saving" : "savingModeDisabled status--default"}`}
    >
      <TooltipProvider delayDuration={50}>
        <Tooltip>
          <TooltipTrigger>
            <IconLeaf />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs" side="top" size="sm">
            Saving mode <strong>{isSavingMode ? "enabled" : "disabled"}</strong>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Style>
  );
}

export default SavingModeIndicator;

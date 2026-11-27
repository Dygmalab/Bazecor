import React from "react";

import { i18n } from "@Renderer/i18n";

import { Button } from "@Renderer/components/atoms/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { SegmentedKeyType } from "@Renderer/types/layout";

interface NoKeyTransparentTabProps {
  keyCode: SegmentedKeyType;

  onKeySelect: (keycode: number) => void;
  disabled?: boolean;
}
const NoKeyTransparentTab = ({ keyCode, onKeySelect, disabled }: NoKeyTransparentTabProps) => {
  const KC = keyCode.base + keyCode.modified;
  return (
    <TooltipProvider delayDuration={200} disableHoverableContent>
      <div className="tabsNoKeysTransparent flex flex-col gap-2">
        {[
          { code: 0, label: i18n.editor.standardView.noKey, hint: i18n.editor.standardView.noKeyDescription },
          { code: 65535, label: i18n.editor.standardView.transparent, hint: i18n.editor.standardView.transparentDescription },
        ].map(item => (
          <Tooltip key={item.code}>
            <TooltipTrigger asChild>
              <Button
                variant="config"
                onClick={() => onKeySelect(item.code)}
                size="sm"
                className="w-full h-9 text-ssm text-center"
                selected={KC === item.code}
                disabled={disabled}
              >
                {item.label}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" size="sm" className="max-w-xs">
              {item.hint}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </TooltipProvider>
  );
};

export default NoKeyTransparentTab;

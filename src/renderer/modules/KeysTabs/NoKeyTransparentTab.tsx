import React, { useMemo } from "react";

import { i18n } from "@Renderer/i18n";

// import Callout from "@Renderer/components/molecules/Callout/Callout";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import { IconInformation } from "@Renderer/components/atoms/icons";

interface NoKeyTransparentTabProps {
  keyCode: any;

  onKeySelect: (keycode: number) => void;
  disabled?: boolean;
}
const NoKeyTransparentTab = ({ keyCode, onKeySelect, disabled }: NoKeyTransparentTabProps) => {
  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);
  return (
    <div className={`tabsNoKeysTransparent ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper">
        <div className="buttonsRow">
          <div className="flex flex-wrap gap-1 items-center">
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                  <IconInformation />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <Heading headingLevel={4} renderAs="h4" className="my-0 w-full text-base">
                    {i18n.editor.standardView.noKey}
                  </Heading>
                  <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                    {i18n.editor.standardView.noKeyDescription}
                  </p>
                  <Heading headingLevel={4} renderAs="h4" className="my-0 w-full text-base mt-3">
                    {i18n.editor.standardView.transparent}
                  </Heading>
                  <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                    {i18n.editor.standardView.transparentDescription}
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Button
              variant="config"
              onClick={() => {
                onKeySelect(0);
              }}
              size="sm"
              className="max-w-[102px] w-[102px] h-9 text-ssm text-center"
              selected={KC === 0}
            >
              {i18n.editor.standardView.noKey}
            </Button>
            <Button
              variant="config"
              onClick={() => {
                onKeySelect(65535);
              }}
              selected={KC === 65535}
              size="sm"
              className="max-w-[102px] w-[102px] h-9 text-ssm text-center"
            >
              {i18n.editor.standardView.transparent}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoKeyTransparentTab;

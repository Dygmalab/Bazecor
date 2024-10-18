import React, { useMemo } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

import {
  IconMediaPlayPause,
  IconMediaStop,
  IconMediaRewind,
  IconMediaForward,
  IconMediaShuffle,
  IconMediaSoundMute,
  IconMediaSoundLess,
  IconMediaSoundMore,
  IconBrightnessMore,
  IconToolsBrightnessLess,
  IconToolsCamera,
  IconToolsCalculator,
  IconToolsEject,
  IconLEDPreviousEffect,
  IconLEDNextEffect,
  IconLEDToggleEffect,
  IconSleep,
  IconShutdown,
} from "@Renderer/components/atoms/icons";

const Styles = Styled.div`
display: flex;
flex-wrap: wrap;
height: inherit;

.callOut {
    width: 100%;
    flex: 0 0 100%;
}
.w100 {
    width: 100%;
    flex: 0 0 100%;
}

.buttonsRow {
    flex: 0 0 100%;
    display: grid;
    grid-template-columns: auto auto;
    grid-gap: 24px;
    .button-config {
        margin-left: 8px;
        padding: 12px;
    }
    padding-bottom: 12px;
}
@media screen and (max-width: 1320px) {
  .mediaButtons {
    .keysButtonsList {
      flex-wrap: wrap;
      .button-config {
        margin-bottom: 8px;
      }
    }
  }
}
@media screen and (max-width: 1120px) {
  .buttonsRow {
    grid-template-columns: 1fr;
    grid-gap: 0;
  }
}
`;

interface MediaAndLightTabProps {
  keyCode: any;

  onAddSpecial: (event: any, value: number) => void;
  disabled?: boolean;
}

const MediaAndLightTab = ({ keyCode, onAddSpecial, disabled }: MediaAndLightTabProps) => {
  const handleAddSpecial = (special: number) => {
    onAddSpecial(special, 5);
  };

  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);

  return (
    <Styles className={`tabsMediaAndLED ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper">
        <div className="buttonsRow py-2">
          <div className="mediaButtons flex-1 py-2">
            <Heading headingLevel={4} renderAs="h4" className="m-0 text-base">
              {i18n.editor.superkeys.specialKeys.mediaTitle}
            </Heading>
            <p
              className="description text-ssm font-medium text-gray-400 dark:text-gray-200"
              dangerouslySetInnerHTML={{ __html: i18n.editor.superkeys.specialKeys.mediaDescription }}
            />
            <div className="flex gap-1 mt-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22733)}
                        // selected={isStandardView ? keyCode === 22733 : false}
                        selected={KC === 22733}
                      >
                        <IconMediaPlayPause size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.playPause}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22711)}
                        // selected={isStandardView ? keyCode === 22711 : false}
                        selected={KC === 22711}
                      >
                        <IconMediaStop size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.stop}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22710)}
                        // selected={isStandardView ? keyCode === 22710 : false}
                        selected={KC === 22710}
                      >
                        <IconMediaRewind size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.rewind}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22709)}
                        // selected={isStandardView ? keyCode === 22709 : false}
                        selected={KC === 22709}
                      >
                        <IconMediaForward size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.forward}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22713)}
                        // selected={isStandardView ? keyCode === 22713 : false}
                        selected={KC === 22713}
                      >
                        <IconMediaShuffle size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.shuffle}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(19682)}
                        // selected={isStandardView ? keyCode === 19682 : false}
                        selected={KC === 19682}
                      >
                        <IconMediaSoundMute size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.mute}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(23786)}
                        // selected={isStandardView ? keyCode === 23786 : false}
                        selected={KC === 23786}
                      >
                        <IconMediaSoundLess size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.soundLess}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(23785)}
                        // selected={isStandardView ? keyCode === 23785 : false}
                        selected={KC === 23785}
                      >
                        <IconMediaSoundMore size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.soundMore}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="LEDButtons flex-1 py-2">
            <Heading headingLevel={4} renderAs="h4" className="m-0 text-base">
              {i18n.editor.superkeys.specialKeys.LEDTitle}
            </Heading>
            <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
              {i18n.editor.superkeys.specialKeys.LEDDescription}
            </p>
            <div className="flex gap-1 mt-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(17154)}
                        // selected={isStandardView ? keyCode === 17154 : false}
                        selected={KC === 17154}
                      >
                        <IconLEDToggleEffect size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.ledToggleTootip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(17153)}
                        // selected={isStandardView ? keyCode === 17153 : false}
                        selected={KC === 17153}
                      >
                        <IconLEDPreviousEffect size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.ledPreviousEffectTootip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(17152)}
                        // selected={isStandardView ? keyCode === 17152 : false}
                        selected={KC === 17152}
                      >
                        <IconLEDNextEffect size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.ledNextEffectTootip}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
        <div className="buttonsRow py-2">
          <div className="othersButtons flex-1 py-2">
            <Heading headingLevel={4} renderAs="h4" className="m-0 text-base">
              {i18n.editor.superkeys.specialKeys.othersTitle}
            </Heading>
            <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
              {i18n.editor.superkeys.specialKeys.othersDescription}
            </p>
            <div className="flex gap-1 mt-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22712)}
                        // selected={isStandardView ? keyCode === 22712 : false}
                        selected={KC === 22712}
                      >
                        <IconToolsEject size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.eject}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(18834)}
                        // selected={isStandardView ? keyCode === 18834 : false}
                        selected={KC === 18834}
                      >
                        <IconToolsCalculator size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.calculator}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(18552)}
                        // selected={isStandardView ? keyCode === 18552 : false}
                        selected={KC === 18552}
                      >
                        <IconToolsCamera size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.camera}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(23664)}
                        // selected={isStandardView ? keyCode === 23664 : false}
                        selected={KC === 23664}
                      >
                        <IconToolsBrightnessLess size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.brightnessLess}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(23663)}
                        // selected={isStandardView ? keyCode === 23663 : false}
                        selected={KC === 23663}
                      >
                        <IconBrightnessMore size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.brightnessMore}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(20866)}
                        // selected={isStandardView ? keyCode === 20866 : false}
                        selected={KC === 20866}
                      >
                        <IconSleep size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.sleep}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(20865)}
                        // selected={isStandardView ? keyCode === 20865 : false}
                        selected={KC === 20865}
                      >
                        <IconShutdown size="sm" />
                      </Button>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs" size="sm">
                    {i18n.editor.superkeys.specialKeys.shutdown}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default MediaAndLightTab;

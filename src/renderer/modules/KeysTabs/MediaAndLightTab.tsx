import React from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import log from "electron-log/renderer";

import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
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
h4 {
    font-size: 16px;
    flex: 0 0 100%;
    width: 100%;
    margin-top: 24px;
}
.callOut {
    width: 100%;
    flex: 0 0 100%;
}
.w100 {
    width: 100%;
    flex: 0 0 100%;
}
.description {
    font-size: 14px;
    color: ${({ theme }) => theme.styles.macro.descriptionColor};
    flex: 0 0 100%;
    width: 100%;
}

.keysButtonsList {
    display: flex;
    flex-grow: 1;
    flex: 100%;
    margin-left: -8px;
    margin-right: -8px;
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
  isStandardView: boolean;
  onAddSpecial: (event: any, value: number) => void;
}

const MediaAndLightTab = ({ keyCode, isStandardView, onAddSpecial }: MediaAndLightTabProps) => {
  const handleAddSpecial = (special: number) => {
    onAddSpecial(special, 5);
  };

  return (
    <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsMediaAndLED`}>
      <div className="tabContentWrapper">
        {isStandardView ? (
          <>
            <Heading headingLevel={3} renderAs="h3">
              {i18n.editor.standardView.mediaAndLED.title}
            </Heading>
            <Callout size="sm" className="mt-4">
              <p>{i18n.editor.standardView.mediaAndLED.callOut}</p>
            </Callout>
          </>
        ) : null}
        <div className="buttonsRow">
          <div className="mediaButtons">
            <Heading headingLevel={4} renderAs="h4">
              {i18n.editor.superkeys.specialKeys.mediaTitle}
            </Heading>
            <p className="description" dangerouslySetInnerHTML={{ __html: i18n.editor.superkeys.specialKeys.mediaDescription }} />
            <div className="flex gap-2 mt-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22733)}
                        selected={isStandardView ? keyCode === 22733 : false}
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
                        selected={isStandardView ? keyCode === 22711 : false}
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
                        selected={isStandardView ? keyCode === 22710 : false}
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
                        selected={isStandardView ? keyCode === 22709 : false}
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
                        selected={isStandardView ? keyCode === 22713 : false}
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
                        selected={isStandardView ? keyCode === 19682 : false}
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
                        selected={isStandardView ? keyCode === 23786 : false}
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
                        selected={isStandardView ? keyCode === 23785 : false}
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
          <div className="LEDButtons">
            <Heading headingLevel={4} renderAs="h4">
              {i18n.editor.superkeys.specialKeys.LEDTitle}
            </Heading>
            <p className="description">{i18n.editor.superkeys.specialKeys.LEDDescription}</p>
            <div className="flex gap-2 mt-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(17154)}
                        selected={isStandardView ? keyCode === 17154 : false}
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
                        selected={isStandardView ? keyCode === 17153 : false}
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
                        selected={isStandardView ? keyCode === 17152 : false}
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
        <div className="buttonsRow">
          <div className="othersButtons">
            <Heading headingLevel={4} renderAs="h4">
              {i18n.editor.superkeys.specialKeys.othersTitle}
            </Heading>
            <p className="description">{i18n.editor.superkeys.specialKeys.othersDescription}</p>
            <div className="flex gap-2 mt-2">
              <TooltipProvider delayDuration={50}>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div>
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => handleAddSpecial(22712)}
                        selected={isStandardView ? keyCode === 22712 : false}
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
                        selected={isStandardView ? keyCode === 18834 : false}
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
                        selected={isStandardView ? keyCode === 18552 : false}
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
                        selected={isStandardView ? keyCode === 23664 : false}
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
                        selected={isStandardView ? keyCode === 23663 : false}
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
                        selected={isStandardView ? keyCode === 20866 : false}
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
                        selected={isStandardView ? keyCode === 20865 : false}
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

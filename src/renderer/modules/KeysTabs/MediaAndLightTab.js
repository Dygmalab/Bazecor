import React, { Component } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import Heading from "@Renderer/components/atoms/Heading";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { ButtonConfig } from "@Renderer/component/Button";

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
} from "@Renderer/components/atoms/Icons";

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

class MediaAndLightTab extends Component {
  // function to handle button click with integer parameter and call to props.onAddSpecial
  handleAddSpecial = special => {
    const { onAddSpecial } = this.props;
    onAddSpecial(special, 5);
  };

  render() {
    const { keyCode, isStandardView } = this.props;
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
              <p
                className="description"
                dangerouslySetInnerHTML={{ __html: i18n.editor.superkeys.specialKeys.mediaDescription }}
              />
              <div className="keysButtonsList">
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.playPause}
                  tooltipDelay={100}
                  icoSVG={<IconMediaPlayPause size="sm" />}
                  onClick={() => this.handleAddSpecial(22733)}
                  selected={isStandardView ? keyCode === 22733 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.stop}
                  tooltipDelay={100}
                  icoSVG={<IconMediaStop size="sm" />}
                  onClick={() => this.handleAddSpecial(22711)}
                  selected={isStandardView ? keyCode === 22711 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.rewind}
                  tooltipDelay={100}
                  icoSVG={<IconMediaRewind size="sm" />}
                  onClick={() => this.handleAddSpecial(22710)}
                  selected={isStandardView ? keyCode === 22710 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.forward}
                  tooltipDelay={100}
                  icoSVG={<IconMediaForward size="sm" />}
                  onClick={() => this.handleAddSpecial(22709)}
                  selected={isStandardView ? keyCode === 22709 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.shuffle}
                  tooltipDelay={100}
                  icoSVG={<IconMediaShuffle size="sm" />}
                  onClick={() => this.handleAddSpecial(22713)}
                  selected={isStandardView ? keyCode === 22713 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.mute}
                  tooltipDelay={100}
                  icoSVG={<IconMediaSoundMute size="sm" />}
                  onClick={() => this.handleAddSpecial(19682)}
                  selected={isStandardView ? keyCode === 19682 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.soundLess}
                  tooltipDelay={100}
                  icoSVG={<IconMediaSoundLess size="sm" />}
                  onClick={() => this.handleAddSpecial(23786)}
                  selected={isStandardView ? keyCode === 23786 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.soundMore}
                  tooltipDelay={100}
                  icoSVG={<IconMediaSoundMore size="sm" />}
                  onClick={() => this.handleAddSpecial(23785)}
                  selected={isStandardView ? keyCode === 23785 : false}
                />
              </div>
            </div>
            <div className="LEDButtons">
              <Heading headingLevel={4} renderAs="h4">
                {i18n.editor.superkeys.specialKeys.LEDTitle}
              </Heading>
              <p className="description">{i18n.editor.superkeys.specialKeys.LEDDescription}</p>
              <div className="keysButtonsList">
                <ButtonConfig
                  icoSVG={<IconLEDToggleEffect size="sm" />}
                  tooltip={i18n.editor.superkeys.specialKeys.ledToggleTootip}
                  tooltipDelay={300}
                  className="buttonConfigLED"
                  onClick={() => this.handleAddSpecial(17154)}
                  selected={isStandardView ? keyCode === 17154 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.ledPreviousEffectTootip}
                  tooltipDelay={300}
                  icoSVG={<IconLEDPreviousEffect size="sm" />}
                  className="buttonConfigLED"
                  onClick={() => this.handleAddSpecial(17153)}
                  selected={isStandardView ? keyCode === 17153 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.ledNextEffectTootip}
                  tooltipDelay={300}
                  icoSVG={<IconLEDNextEffect size="sm" />}
                  onClick={() => this.handleAddSpecial(17152)}
                  selected={isStandardView ? keyCode === 17152 : false}
                />
              </div>
            </div>
          </div>
          <div className="buttonsRow">
            <div className="othersButtons">
              <Heading headingLevel={4} renderAs="h4">
                {i18n.editor.superkeys.specialKeys.othersTitle}
              </Heading>
              <p className="description">{i18n.editor.superkeys.specialKeys.othersDescription}</p>
              <div className="keysButtonsList">
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.eject}
                  tooltipDelay={100}
                  icoSVG={<IconToolsEject size="sm" />}
                  onClick={() => this.handleAddSpecial(22712)}
                  selected={isStandardView ? keyCode === 22712 : false}
                />

                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.calculator}
                  tooltipDelay={100}
                  icoSVG={<IconToolsCalculator size="sm" />}
                  onClick={() => this.handleAddSpecial(18834)}
                  selected={isStandardView ? keyCode === 18834 : false}
                />

                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.camera}
                  tooltipDelay={100}
                  icoSVG={<IconToolsCamera size="sm" />}
                  onClick={() => this.handleAddSpecial(18552)}
                  selected={isStandardView ? keyCode === 18552 : false}
                />

                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.brightnessLess}
                  tooltipDelay={100}
                  icoSVG={<IconToolsBrightnessLess size="sm" />}
                  onClick={() => this.handleAddSpecial(23664)}
                  selected={isStandardView ? keyCode === 23664 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.brightnessMore}
                  tooltipDelay={100}
                  icoSVG={<IconBrightnessMore size="sm" />}
                  onClick={() => this.handleAddSpecial(23663)}
                  selected={isStandardView ? keyCode === 23663 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.sleep}
                  tooltipDelay={100}
                  icoSVG={<IconSleep size="sm" />}
                  onClick={() => this.handleAddSpecial(20866)}
                  selected={isStandardView ? keyCode === 20866 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.shutdown}
                  tooltipDelay={100}
                  icoSVG={<IconShutdown size="sm" />}
                  onClick={() => this.handleAddSpecial(20865)}
                  selected={isStandardView ? keyCode === 20865 : false}
                />
              </div>
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}

export default MediaAndLightTab;

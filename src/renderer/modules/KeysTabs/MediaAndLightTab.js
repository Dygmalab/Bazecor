import React, { Component } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

import Title from "@Renderer/component/Title";
import Callout from "@Renderer/component/Callout";
import { ButtonConfig } from "@Renderer/component/Button";

import {
  IconMediaPlayPauseSm,
  IconMediaStopSm,
  IconMediaRewindSm,
  IconMediaForwardSm,
  IconMediaShuffleSm,
  IconMediaSoundMuteSm,
  IconMediaSoundLessSm,
  IconMediaSoundMoreSm,
  IconToolsBrightnessMoreSm,
  IconToolsBrightnessLessSm,
  IconToolsCameraSm,
  IconToolsCalculatorSm,
  IconToolsEjectSm,
  IconLEDPreviousEffectSm,
  IconLEDNextEffectSm,
  IconLEDToggleEffectSm,
  IconSleepSm,
  IconShutdownSm,
} from "@Renderer/component/Icon";

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
              <Title text={i18n.editor.standardView.mediaAndLED.title} headingLevel={3} />
              <Callout content={i18n.editor.standardView.mediaAndLED.callOut} size="sm" />
            </>
          ) : null}
          <div className="buttonsRow">
            <div className="mediaButtons">
              <Title text={i18n.editor.superkeys.specialKeys.mediaTitle} headingLevel={4} />
              <p
                className="description"
                dangerouslySetInnerHTML={{ __html: i18n.editor.superkeys.specialKeys.mediaDescription }}
              />
              <div className="keysButtonsList">
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.playPause}
                  tooltipDelay={100}
                  icoSVG={<IconMediaPlayPauseSm />}
                  onClick={() => this.handleAddSpecial(18637)}
                  selected={isStandardView ? keyCode === 18637 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.stop}
                  tooltipDelay={100}
                  icoSVG={<IconMediaStopSm />}
                  onClick={() => this.handleAddSpecial(18615)}
                  selected={isStandardView ? keyCode === 18615 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.rewind}
                  tooltipDelay={100}
                  icoSVG={<IconMediaRewindSm />}
                  onClick={() => this.handleAddSpecial(18614)}
                  selected={isStandardView ? keyCode === 18614 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.forward}
                  tooltipDelay={100}
                  icoSVG={<IconMediaForwardSm />}
                  onClick={() => this.handleAddSpecial(18613)}
                  selected={isStandardView ? keyCode === 18613 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.shuffle}
                  tooltipDelay={100}
                  icoSVG={<IconMediaShuffleSm />}
                  onClick={() => this.handleAddSpecial(18617)}
                  selected={isStandardView ? keyCode === 18617 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.mute}
                  tooltipDelay={100}
                  icoSVG={<IconMediaSoundMuteSm />}
                  onClick={() => this.handleAddSpecial(18658)}
                  selected={isStandardView ? keyCode === 18658 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.soundLess}
                  tooltipDelay={100}
                  icoSVG={<IconMediaSoundLessSm />}
                  onClick={() => this.handleAddSpecial(18667)}
                  selected={isStandardView ? keyCode === 18667 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.soundMore}
                  tooltipDelay={100}
                  icoSVG={<IconMediaSoundMoreSm />}
                  onClick={() => this.handleAddSpecial(18665)}
                  selected={isStandardView ? keyCode === 18665 : false}
                />
              </div>
            </div>
            <div className="LEDButtons">
              <Title text={i18n.editor.superkeys.specialKeys.LEDTitle} headingLevel={4} />
              <p className="description">{i18n.editor.superkeys.specialKeys.LEDDescription}</p>
              <div className="keysButtonsList">
                <ButtonConfig
                  icoSVG={<IconLEDToggleEffectSm />}
                  tooltip={i18n.editor.superkeys.specialKeys.ledToggleTootip}
                  tooltipDelay={300}
                  className="buttonConfigLED"
                  onClick={() => this.handleAddSpecial(17154)}
                  selected={isStandardView ? keyCode === 17154 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.ledPreviousEffectTootip}
                  tooltipDelay={300}
                  icoSVG={<IconLEDPreviousEffectSm />}
                  className="buttonConfigLED"
                  onClick={() => this.handleAddSpecial(17153)}
                  selected={isStandardView ? keyCode === 17153 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.ledNextEffectTootip}
                  tooltipDelay={300}
                  icoSVG={<IconLEDNextEffectSm />}
                  onClick={() => this.handleAddSpecial(17152)}
                  selected={isStandardView ? keyCode === 17152 : false}
                />
              </div>
            </div>
          </div>
          <div className="buttonsRow">
            <div className="othersButtons">
              <Title text={i18n.editor.superkeys.specialKeys.othersTitle} headingLevel={4} />
              <p className="description">{i18n.editor.superkeys.specialKeys.othersDescription}</p>
              <div className="keysButtonsList">
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.eject}
                  tooltipDelay={100}
                  icoSVG={<IconToolsEjectSm />}
                  onClick={() => this.handleAddSpecial(18616)}
                  selected={isStandardView ? keyCode === 18616 : false}
                />

                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.calculator}
                  tooltipDelay={100}
                  icoSVG={<IconToolsCalculatorSm />}
                  onClick={() => this.handleAddSpecial(18834)}
                  selected={isStandardView ? keyCode === 18834 : false}
                />

                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.camera}
                  tooltipDelay={100}
                  icoSVG={<IconToolsCameraSm />}
                  onClick={() => this.handleAddSpecial(18552)}
                  selected={isStandardView ? keyCode === 18552 : false}
                />

                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.brightnessLess}
                  tooltipDelay={100}
                  icoSVG={<IconToolsBrightnessLessSm />}
                  onClick={() => this.handleAddSpecial(18544)}
                  selected={isStandardView ? keyCode === 18544 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.brightnessMore}
                  tooltipDelay={100}
                  icoSVG={<IconToolsBrightnessMoreSm />}
                  onClick={() => this.handleAddSpecial(18543)}
                  selected={isStandardView ? keyCode === 18543 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.sleep}
                  tooltipDelay={100}
                  icoSVG={<IconSleepSm />}
                  onClick={() => this.handleAddSpecial(20866)}
                  selected={isStandardView ? keyCode === 20866 : false}
                />
                <ButtonConfig
                  tooltip={i18n.editor.superkeys.specialKeys.shutdown}
                  tooltipDelay={100}
                  icoSVG={<IconShutdownSm />}
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

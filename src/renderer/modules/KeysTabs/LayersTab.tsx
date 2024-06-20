import React from "react";
import Styled from "styled-components";

import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";

const Styles = Styled.div`
display: flex;
flex-wrap: wrap;
height: inherit;
h4 {
    font-size: 16px;
    flex: 0 0 100%;
}
.cardButtons {
  margin-top: 8px;
}

.tabContentWrapper {
  width: 100%;
}
&.tabsLayer {
  .cardButtons {
      border-bottom-left-radius: 0;
      border-bottom-right-radius: 0;
  }
  .cardButtons + .cardButtons {
      margin-top: 2px;
      border-bottom-left-radius: 6px;
      border-bottom-right-radius: 6px;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
  }
}
`;

interface LayersTabProps {
  keyCode: any;
  isStandardView: boolean;
  disableMods: boolean;
  onLayerPress: (value: number) => void;
}

const LayersTab = ({ keyCode, isStandardView, disableMods, onLayerPress }: LayersTabProps) => {
  const layerDeltaSwitch = 17450;
  const layerDelta = 17492;

  const shiftButtons = Array.from({ length: 10 }, (_, index) => index + 1);
  const lockButtons = Array.from({ length: 10 }, (_, index) => index + 1);

  return (
    <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsLayer`}>
      <div className="tabContentWrapper">
        <Heading headingLevel={isStandardView ? 3 : 4} renderAs={isStandardView ? "h3" : "h4"}>
          {i18n.editor.layers.title}
        </Heading>
        {isStandardView ? (
          <Callout
            size="sm"
            className="mt-4"
            hasVideo
            media="wsx0OtkKXXg"
            videoTitle="This 60% keyboard can have +2500 keys!"
            videoDuration="6:50"
          >
            <p>{i18n.editor.standardView.layers.callOut}</p>
          </Callout>
        ) : null}
        <div className="cardButtons">
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.standardView.layers.layerSwitch}
          </Heading>
          <p>{i18n.editor.standardView.layers.layerSwitchDescription}</p>
          <div className="groupButtons flex gap-1">
            {shiftButtons.map((button, index) => (
              <Button
                variant="config"
                size="sm"
                onClick={() => {
                  onLayerPress(layerDeltaSwitch + index);
                }}
                selected={layerDeltaSwitch + index === keyCode}
                disabled={disableMods}
                key={`buttonShift-${button}`}
              >
                {button}
              </Button>
            ))}
          </div>
        </div>
        <div className="cardButtons">
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.layers.layerLock}
          </Heading>
          <p>{isStandardView ? i18n.editor.standardView.layers.layerLockDescription : i18n.editor.layers.layerLockDescription}</p>
          <div className="groupButtons flex gap-1">
            {lockButtons.map((button, index) => (
              <Button
                variant="config"
                size="sm"
                onClick={() => {
                  onLayerPress(layerDelta + index);
                }}
                selected={layerDelta + index === keyCode}
                key={`buttonLock-${button}`}
              >
                {button}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default LayersTab;

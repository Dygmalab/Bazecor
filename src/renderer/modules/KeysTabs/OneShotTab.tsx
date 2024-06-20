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
&.tabsOneShot {
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

interface OneShotTabProps {
  keyCode: any;
  isStandardView: boolean;
  onKeySelect: (keycode: number) => void;
}

const OneShotTab = ({ keyCode, onKeySelect, isStandardView }: OneShotTabProps) => {
  const OneShotDeltaMod = 49153;
  const OneShotDeltaLayer = 49161;

  return (
    <Styles className={`${isStandardView ? "standardViewTab" : ""} tabsOneShot`}>
      <div className="tabContentWrapper">
        {isStandardView ? (
          <>
            <Heading headingLevel={3} renderAs="h3">
              {i18n.editor.standardView.oneShot.title}
            </Heading>
            <Callout size="sm" className="mt-4">
              <p>{i18n.editor.standardView.callOut}</p>
            </Callout>
          </>
        ) : null}

        <div className="cardButtons">
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.standardView.oneShot.titleModifiers}
          </Heading>
          <p className="description">{i18n.editor.standardView.oneShot.modifiersDescription}</p>
          <div className="groupButtons groupButtonsGrid mt-2">
            <div className="buttonsGrid">
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 0)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 0 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.leftControl}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 1)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 1 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.leftShift}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 2)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 2 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.leftAlt}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 3)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 3 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.leftOS}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 4)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 4 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.rightControl}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 5)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 5 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.rightShift}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 6)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 6 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.altGr}
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 7)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 7 : false}
                size="sm"
              >
                {i18n.editor.standardView.oneShot.rightOS}
              </Button>
            </div>
          </div>
        </div>
        <div className="cardButtons">
          <Heading headingLevel={4} renderAs="h4">
            {i18n.editor.standardView.oneShot.titleLayers}
          </Heading>
          <p className="description">{i18n.editor.standardView.oneShot.layersDescription}</p>
          <div className="groupButtons flex gap-1 mt-2">
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 0)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 0 : false}
              size="sm"
            >
              1
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 1)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 1 : false}
              size="sm"
            >
              2
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 2)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 2 : false}
              size="sm"
            >
              3
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 3)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 3 : false}
              size="sm"
            >
              4
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 4)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 4 : false}
              size="sm"
            >
              5
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 5)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 5 : false}
              size="sm"
            >
              6
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 6)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 6 : false}
              size="sm"
            >
              7
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 7)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 7 : false}
              size="sm"
            >
              8
            </Button>
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default OneShotTab;

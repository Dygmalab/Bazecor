import React from "react";
import Styled from "styled-components";

import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";
import { IconOneShotMode } from "@Renderer/components/atoms/icons";

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
          <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center">
            <IconOneShotMode mode="modifier" /> {i18n.editor.standardView.oneShot.titleModifiers}
          </Heading>
          <p className="description">{i18n.editor.standardView.oneShot.modifiersDescription}</p>
          <div className="p-0 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-transparent">
            <div className="grid gap-1 p-1 bg-white dark:bg-gray-900/20 rounded-md grid-cols-4">
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 1)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 1 : false}
                size="sm"
              >
                <OSKey renderKey="shift" direction="Left" size="sm" />
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 0)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 0 : false}
                size="sm"
              >
                <OSKey renderKey="control" direction="Left" size="sm" />
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 3)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 3 : false}
                size="sm"
              >
                <OSKey renderKey="os" direction="Left" size="sm" />
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 2)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 2 : false}
                size="sm"
              >
                <OSKey renderKey="alt" direction="Left" size="sm" />
              </Button>

              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 5)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 5 : false}
                size="sm"
              >
                <OSKey renderKey="shift" direction="Right" size="sm" />
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 4)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 4 : false}
                size="sm"
              >
                <OSKey renderKey="control" direction="Right" size="sm" />
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 7)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 7 : false}
                size="sm"
              >
                <OSKey renderKey="os" direction="Right" size="sm" />
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaMod + 6)}
                selected={isStandardView ? keyCode === OneShotDeltaMod + 6 : false}
                size="sm"
              >
                <OSKey renderKey="altGr" size="sm" />
              </Button>
            </div>
          </div>
        </div>
        <div className="cardButtons">
          <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center">
            <IconOneShotMode /> {i18n.editor.standardView.oneShot.titleLayers}
          </Heading>
          <p className="description">{i18n.editor.standardView.oneShot.layersDescription}</p>
          <div className="p-1 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-white dark:bg-gray-900/20">
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 0)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 0 : false}
              size="icon"
            >
              1
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 1)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 1 : false}
              size="icon"
            >
              2
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 2)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 2 : false}
              size="icon"
            >
              3
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 3)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 3 : false}
              size="icon"
            >
              4
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 4)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 4 : false}
              size="icon"
            >
              5
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 5)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 5 : false}
              size="icon"
            >
              6
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 6)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 6 : false}
              size="icon"
            >
              7
            </Button>
            <Button
              variant="config"
              onClick={() => onKeySelect(OneShotDeltaLayer + 7)}
              selected={isStandardView ? keyCode === OneShotDeltaLayer + 7 : false}
              size="icon"
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

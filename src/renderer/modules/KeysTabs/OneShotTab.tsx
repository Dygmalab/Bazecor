import React, { useMemo } from "react";
import Styled from "styled-components";

import { i18n } from "@Renderer/i18n";

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

  onKeySelect: (keycode: number) => void;
  disabled?: boolean;
}

const OneShotTab = ({ keyCode, onKeySelect, disabled }: OneShotTabProps) => {
  const OneShotDeltaMod = 49153;
  const OneShotDeltaLayer = 49161;

  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);

  return (
    <Styles className={`tabsOneShot ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="tabContentWrapper">
        <div className="flex flex-wrap gap-1 py-2">
          <div className="flex-1 py-2 min-w-80">
            <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center">
              <IconOneShotMode mode="modifier" /> {i18n.editor.standardView.oneShot.titleModifiers}
            </Heading>
            <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
              {i18n.editor.standardView.oneShot.modifiersDescription}
            </p>
            <div className="p-0 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-transparent">
              <div className="grid gap-1 p-1 bg-white dark:bg-gray-900/20 rounded-md grid-cols-4">
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 1)}
                  selected={KC === OneShotDeltaMod + 1}
                  size="sm"
                >
                  <OSKey renderKey="shift" direction="Left" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 0)}
                  selected={KC === OneShotDeltaMod + 0}
                  size="sm"
                >
                  <OSKey renderKey="control" direction="Left" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 3)}
                  selected={KC === OneShotDeltaMod + 3}
                  size="sm"
                >
                  <OSKey renderKey="os" direction="Left" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 2)}
                  selected={KC === OneShotDeltaMod + 2}
                  size="sm"
                >
                  <OSKey renderKey="alt" direction="Left" size="sm" />
                </Button>

                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 5)}
                  selected={KC === OneShotDeltaMod + 5}
                  size="sm"
                >
                  <OSKey renderKey="shift" direction="Right" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 4)}
                  selected={KC === OneShotDeltaMod + 4}
                  size="sm"
                >
                  <OSKey renderKey="control" direction="Right" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 7)}
                  selected={KC === OneShotDeltaMod + 7}
                  size="sm"
                >
                  <OSKey renderKey="os" direction="Right" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => onKeySelect(OneShotDeltaMod + 6)}
                  selected={KC === OneShotDeltaMod + 6}
                  size="sm"
                >
                  <OSKey renderKey="altGr" size="sm" />
                </Button>
              </div>
            </div>
          </div>
          <div className="flex-1 py-2">
            <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center">
              <IconOneShotMode /> {i18n.editor.standardView.oneShot.titleLayers}
            </Heading>
            <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
              {i18n.editor.standardView.oneShot.layersDescription}
            </p>
            <div className="p-1 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-white dark:bg-gray-900/20">
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 0)}
                selected={KC === OneShotDeltaLayer + 0}
                size="icon"
              >
                1
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 1)}
                selected={KC === OneShotDeltaLayer + 1}
                size="icon"
              >
                2
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 2)}
                selected={KC === OneShotDeltaLayer + 2}
                size="icon"
              >
                3
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 3)}
                selected={KC === OneShotDeltaLayer + 3}
                size="icon"
              >
                4
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 4)}
                selected={KC === OneShotDeltaLayer + 4}
                size="icon"
              >
                5
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 5)}
                selected={KC === OneShotDeltaLayer + 5}
                size="icon"
              >
                6
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 6)}
                selected={KC === OneShotDeltaLayer + 6}
                size="icon"
              >
                7
              </Button>
              <Button
                variant="config"
                onClick={() => onKeySelect(OneShotDeltaLayer + 7)}
                selected={KC === OneShotDeltaLayer + 7}
                size="icon"
              >
                8
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default OneShotTab;

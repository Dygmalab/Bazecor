import React, { useMemo } from "react";

import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import { IconLayerLock, IconLayerShift } from "@Renderer/components/atoms/icons";

interface LayersTabProps {
  keyCode: any;
  isStandardView: boolean;
  disableMods: boolean;
  onLayerPress: (value: number) => void;
  disabled?: boolean;
}

const LayersTab = ({ keyCode, isStandardView, disableMods, onLayerPress, disabled }: LayersTabProps) => {
  const layerLock = useMemo(
    () => [
      { name: "Layer Lock 1", keynum: 17492 },
      { name: "Layer Lock 2", keynum: 17493 },
      { name: "Layer Lock 3", keynum: 17494 },
      { name: "Layer Lock 4", keynum: 17495 },
      { name: "Layer Lock 5", keynum: 17496 },
      { name: "Layer Lock 6", keynum: 17497 },
      { name: "Layer Lock 7", keynum: 17498 },
      { name: "Layer Lock 8", keynum: 17499 },
      { name: "Layer Lock 9", keynum: 17500 },
      { name: "Layer Lock 10", keynum: 17501 },
    ],
    [],
  );

  const layerSwitch = useMemo(
    () => [
      { name: "Layer Shift 1", keynum: 17450 },
      { name: "Layer Shift 2", keynum: 17451 },
      { name: "Layer Shift 3", keynum: 17452 },
      { name: "Layer Shift 4", keynum: 17453 },
      { name: "Layer Shift 5", keynum: 17454 },
      { name: "Layer Shift 6", keynum: 17455 },
      { name: "Layer Shift 7", keynum: 17456 },
      { name: "Layer Shift 8", keynum: 17457 },
      { name: "Layer Shift 9", keynum: 17458 },
      { name: "Layer Shift 10", keynum: 17459 },
    ],
    [],
  );

  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);

  // const isActive = useMemo(
  //   () =>
  //     keyCode?.modified > 0 && (layerLock.some(({ keynum }) => keynum === KC) || layerSwitch.some(({ keynum }) => keynum === KC)),
  //   [KC, keyCode?.modified, layerLock, layerSwitch],
  // );
  console.log("disableMods: ", disableMods);

  return (
    <div
      className={`flex flex-wrap h-[inherit] ${isStandardView ? "standardViewTab" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""} tabsLayer`}
    >
      <div className="tabContentWrapper w-full">
        {/* <Heading headingLevel={isStandardView ? 3 : 4} renderAs={isStandardView ? "h3" : "h4"}>
          {i18n.editor.layers.title}
        </Heading> */}
        {isStandardView ? (
          <Callout
            size="sm"
            className="mt-0"
            hasVideo
            media="wsx0OtkKXXg"
            videoTitle="This 60% keyboard can have +2500 keys!"
            videoDuration="6:50"
          >
            <p>{i18n.editor.standardView.layers.callOut}</p>
          </Callout>
        ) : null}
        <div className="flex py-2 flex-wrap gap-1">
          <div className={`flex-1 py-2 ${disableMods ? "opacity-50 pointer-events-none" : ""}`}>
            <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center w-full text-base">
              <IconLayerShift /> {i18n.editor.standardView.layers.layerSwitch}
            </Heading>
            <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
              {i18n.editor.standardView.layers.layerSwitchDescription}
            </p>
            <div className="p-1 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-white dark:bg-gray-900/20">
              {layerSwitch.map((button, index) => (
                <Button
                  variant="config"
                  size="icon"
                  onClick={() => {
                    onLayerPress(button.keynum);
                  }}
                  selected={keyCode?.modified > 0 && button.keynum === KC}
                  // selected={layerDeltaSwitch + index === keyCode}
                  disabled={disableMods}
                  key={`buttonShift-${button.keynum}`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
          <div className="flex-1 py-2">
            <Heading headingLevel={4} renderAs="h4" className="flex gap-2 items-center w-full text-base">
              <IconLayerLock /> {i18n.editor.layers.layerLock}
            </Heading>
            <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
              {isStandardView ? i18n.editor.standardView.layers.layerLockDescription : i18n.editor.layers.layerLockDescription}
            </p>
            <div className="p-1 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-white dark:bg-gray-900/20">
              {layerLock.map((button, index) => (
                <Button
                  variant="config"
                  size="icon"
                  onClick={() => {
                    onLayerPress(button.keynum);
                  }}
                  selected={keyCode?.modified > 0 && button.keynum === KC}
                  // selected={keyCode.modified > 0 && layerDelta + index === KC}
                  key={`buttonLock-${button.keynum}`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersTab;

import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import { Separator } from "@Renderer/components/atoms/Separator";
import Heading from "@Renderer/components/atoms/Heading";
import findLayerType from "@Renderer/utils/findLayerType";
import { IconCheckmark, IconInformation } from "@Renderer/components/atoms/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
// eslint-disable-next-line
import { Picker } from "../KeyPickerKeyboard";

interface LayersTabProps {
  keyCode: any;
  isStandardView: boolean;
  disableMods: boolean;
  onKeySelect: (value: number) => void;
  disabled?: boolean;
  actions?: any;
  action?: any;
  baseCode?: any;
  modCode?: any;
  activeTab?: any;
  selectedlanguage?: any;
  // selKeys?: any;
  superkeys?: any;
  kbtype?: any;
  macros?: any;
  isWireless?: any;
  triggerDeleteLastItem?: any;
}

const LayersTab = ({
  keyCode,
  isStandardView,
  disableMods,
  onKeySelect,
  disabled,
  actions,
  action,
  baseCode,
  modCode,
  activeTab,
  selectedlanguage,
  // selKeys,
  superkeys,
  kbtype,
  macros,
  isWireless,
  triggerDeleteLastItem,
}: LayersTabProps) => {
  const [disableOneShot, setDisableOneShot] = useState<boolean>(false);
  const [disableOneShotButtons, setDisableOneShotButtons] = useState<boolean>(false);

  const layers = useMemo(
    () => [
      { layer: 1 },
      { layer: 2 },
      { layer: 3 },
      { layer: 4 },
      { layer: 5 },
      { layer: 6 },
      { layer: 7 },
      { layer: 8 },
      { layer: 9 },
      { layer: 10 },
    ],
    [],
  );

  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);

  let keyNumInternal: number;
  if (typeof KC === "number" && KC < 51217) {
    keyNumInternal = KC;
  } else if (typeof KC === "number" && KC > 51217) {
    keyNumInternal = keyCode.modified;
  } else {
    keyNumInternal = 0;
  }

  // const layerInfo = findLayerType(keyNumInternal);

  const [activeLayerNumber, setActiveLayerNumber] = useState<number>(0);
  const [activeLayerTab, setActiveLayerTab] = useState<string>("");

  // console.log("activeLayerTab : ", activeLayerTab);
  // console.log("disableMods: ", disableMods);
  // console.log("KeyCode modified: ", keyCode.modified);

  const handleLayer = (layerNumber: number) => {
    const layerItem = findLayerType(undefined, activeLayerTab, layerNumber);
    // console.log("Layer inside handle: ", layerItem);
    setActiveLayerNumber(layerNumber);
    if (layerNumber > 8) {
      setDisableOneShot(true);
      setDisableOneShotButtons(true);
    } else {
      setDisableOneShot(false);
      setDisableOneShotButtons(false);
    }
    if (layerItem && layerItem.type !== "layerDual") {
      onKeySelect(layerItem.keynum);
    }
  };

  const handleDual = (keyBase: number) => {
    const layerItem = findLayerType(undefined, activeLayerTab, activeLayerNumber);
    if (layerItem && layerItem.type === "layerDual") {
      onKeySelect(layerItem.keynum + keyBase);
    }
  };

  useEffect(() => {
    const layerItem = findLayerType(undefined, activeLayerTab, activeLayerNumber);

    if (activeLayerNumber > 8) {
      setDisableOneShot(true);
    } else {
      setDisableOneShot(false);
    }
    if (macros && activeTab === "macro" && layerItem && triggerDeleteLastItem) {
      triggerDeleteLastItem.timelineEditorForm.current.timelineEditorMacroTable.current.onDeleteRow(macros.actions.length - 1);
    }
    if (layerItem && layerItem.type !== "layerDual") {
      onKeySelect(layerItem.keynum);
    }
    // eslint-disable-next-line
  }, [activeLayerTab]);

  useEffect(() => {
    const layerItem = findLayerType(keyNumInternal);
    if (layerItem) {
      setActiveLayerTab(layerItem?.type);
      setActiveLayerNumber(layerItem?.layer);
      if (layerItem.type === "layerShot") {
        setDisableOneShotButtons(true);
      } else {
        setDisableOneShotButtons(false);
      }
    } else {
      setActiveLayerTab(disableMods ? "layerLock" : "layerShift");
      setActiveLayerNumber(0);
    }
    // eslint-disable-next-line
  }, [keyNumInternal]);

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
            className="mt-0 mb-4"
            hasVideo
            media="wsx0OtkKXXg"
            videoTitle="This 60% keyboard can have +2500 keys!"
            videoDuration="6:50"
          >
            <p>
              You can navigate between layers in various ways: simply select the layer you want to shift to, or enhance
              functionality by adding a Layer Lock, setting up Dual Function keys, or activating a One Shot Layer.
            </p>
          </Callout>
        ) : null}
        <div className="w-full flex gap-1 flex-row">
          <div className="w-full rounded-regular flex flex-col gap-2 p-3 bg-white dark:bg-gray-700">
            <Heading renderAs="h4" headingLevel={3} className="text-base">
              <small className="text-2xxs text-gray-200 dark:text-gray-500">01.</small>{" "}
              <span className="inline-flex mr-1">Layer</span>
              <TooltipProvider delayDuration={200}>
                <Tooltip>
                  <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                    <IconInformation />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md">
                    <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
                      Layer Shift Navigation (Default value)
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Hold down a key to temporarily activate a layer and switch back once you release it. This is useful for
                      quick actions, such as accessing navigation keys or shortcuts without permanently leaving your current
                      layer.
                    </p>
                    <Heading
                      headingLevel={4}
                      renderAs="h4"
                      className="text-gray-600 dark:text-gray-25 mb-1 mt-2 leading-6 text-base"
                    >
                      Layer Lock Navigation
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Tap a designated key to lock into a specific layer, staying in that layer until you decide to switch back.
                      It&apos;s ideal for extended tasks like video editing or gaming. Ensure you set up a return key to revert to
                      the previous layer easily.
                    </p>
                    <Heading
                      headingLevel={4}
                      renderAs="h4"
                      className="text-gray-600 dark:text-gray-25 mb-1 mt-2 leading-6 text-base"
                    >
                      Dual Function Navigation (Add a key on tap)
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Assign a key with dual functions where a tap performs one action (like space or enter), but holding it
                      activates a specific layer. This allows for efficient layer access without sacrificing key real estate.
                    </p>
                    <Heading
                      headingLevel={4}
                      renderAs="h4"
                      className="text-gray-600 dark:text-gray-25 mb-1 mt-2 text-base leading-6"
                    >
                      One Shot Layer Navigation
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Tap a key to enter a layer for a single action; after that action, the software automatically returns to the
                      previous layer. You can also hold the key to stay in the layer temporarily or double-tap it to lock in and
                      then unlock by tapping the key again.
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Heading>
            <div className="flex gap-1">
              {layers.map((button, index) => (
                <Button
                  variant="config"
                  size="icon"
                  onClick={() => {
                    handleLayer(index + 1);
                  }}
                  selected={index + 1 === activeLayerNumber}
                  // selected={layerDeltaSwitch + index === keyCode}
                  // disabled={(disableMods || (index > 7 && disableOneShotButtons)}
                  disabled={index > 7 && disableOneShotButtons}
                  key={`buttonLayerID-${button.layer}`}
                >
                  {index + 1}
                </Button>
              ))}
            </div>
            <Separator />
            <div className="rounded-regular flex flex-col gap-2 bg-gray-25/50 dark:bg-gray-600/50 p-2">
              <Heading renderAs="h4" headingLevel={3} className="text-base">
                <small className="text-2xxs text-gray-200 dark:text-gray-500">02.</small> Advanced options
              </Heading>
              <div className="rounded-regular flex gap-1 bg-gray-25/75 border border-gray-50 dark:border-none dark:bg-gray-800/20 p-1">
                <Button
                  className="flex-1"
                  variant="config"
                  size="sm"
                  // onClick={() => setActiveLayerTab(previous => (previous === "layerLock" ? "layerShift" : "layerLock"))}
                  onClick={() => {
                    if (activeTab === "super" && disableMods) {
                      return;
                    }
                    setActiveLayerTab(previous => (previous === "layerLock" ? "layerShift" : "layerLock"));
                  }}
                  selected={activeLayerTab === "layerLock"}
                >
                  {activeLayerTab === "layerLock" ? (
                    <IconCheckmark />
                  ) : (
                    <div className="h-[20px] w-[20px] relative after:absolute after:rounded-full after:content-[' '] after:w-3 after:h-3 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:border-2 after:border-gray-200 after:bg-gray-300/20 dark:after:border-gray-200 dark:after:bg-gray-500/50" />
                  )}{" "}
                  Turn into layer lock
                </Button>
                {activeTab === "editor" && (
                  <>
                    <Button
                      className="flex-1"
                      variant="config"
                      size="sm"
                      onClick={() => setActiveLayerTab(previous => (previous === "layerDual" ? "layerShift" : "layerDual"))}
                      selected={activeLayerTab === "layerDual"}
                    >
                      {activeLayerTab === "layerDual" ? (
                        <IconCheckmark />
                      ) : (
                        <div className="h-[20px] w-[20px] relative after:absolute after:rounded-full after:content-[' '] after:w-3 after:h-3 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:border-2 after:border-gray-200 after:bg-gray-300/20 dark:after:border-gray-200 dark:after:bg-gray-500/50" />
                      )}{" "}
                      <div className="pl-1">Add a key on tap</div>
                      <div className="badge bg-gray-400/50 leading-none ml-1 px-1 py-0.5 font-bold text-[8px] text-white rounded-md">
                        PRO
                      </div>
                    </Button>
                    <Button
                      className="flex-1"
                      variant="config"
                      size="sm"
                      disabled={disableOneShot}
                      onClick={() => {
                        setActiveLayerTab(previous => (previous === "layerShot" ? "layerShift" : "layerShot"));
                        setDisableOneShotButtons(true);
                      }}
                      selected={activeLayerTab === "layerShot"}
                    >
                      {activeLayerTab === "layerShot" ? (
                        <IconCheckmark />
                      ) : (
                        <div className="h-[20px] w-[20px] relative after:absolute after:rounded-full after:content-[' '] after:w-3 after:h-3 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:border-2 after:border-gray-200 after:bg-gray-300/20 dark:after:border-gray-200 dark:after:bg-gray-500/50" />
                      )}{" "}
                      <div className="pl-1">Turn into a OneShot layer</div>
                      <div className="badge bg-gray-400/50 leading-none ml-1 px-1 py-0.5 font-bold text-[8px] text-white rounded-md">
                        PRO
                      </div>
                    </Button>
                  </>
                )}
              </div>
              <AnimatePresence>
                <motion.div>
                  {activeLayerTab === "layerDual" && (
                    <>
                      <Separator className="mt-2 mb-2" />
                      <Heading renderAs="h4" headingLevel={3} className="text-base mb-2">
                        <small className="text-2xxs text-gray-200 dark:text-gray-500">03.</small> Key
                      </Heading>
                      <Picker
                        actions={actions}
                        action={action}
                        disable={disabled}
                        baseCode={baseCode}
                        modCode={modCode}
                        onKeySelect={handleDual}
                        activeTab={activeTab}
                        selectedlanguage={selectedlanguage}
                        // selKeys={selKeys}
                        superkeys={superkeys}
                        kbtype={kbtype}
                        keyCode={keyCode}
                        macros={macros}
                        isWireless={isWireless}
                      />
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersTab;

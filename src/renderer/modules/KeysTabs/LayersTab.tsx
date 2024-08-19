import React, { useMemo, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";

import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import { IconLayerLock, IconLayerShift, IconLayers, IconOneShot } from "@Renderer/components/atoms/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/atoms/Tabs";
import OneShotTab from "@Renderer/modules/KeysTabs/OneShotTab";
import { Separator } from "@Renderer/components/atoms/Separator";
import Heading from "@Renderer/components/atoms/Heading";
import findLayerType from "@Renderer/utils/findLayerType";
import { Picker } from "../KeyPickerKeyboard";
import DualFunctionPicker from "../KeyPickerKeyboard/DualFunctionPicker";

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
}: LayersTabProps) => {
  const [disableOneShot, setDisableOneShot] = useState<boolean>(false);
  const [disableOneShotButtons, setDisableOneShotButtons] = useState<boolean>(false);

  const layerLock = useMemo(
    () => [
      { layer: 1, type: "layerLock", name: "Layer Lock 1", keynum: 17492 },
      { layer: 2, type: "layerLock", name: "Layer Lock 2", keynum: 17493 },
      { layer: 3, type: "layerLock", name: "Layer Lock 3", keynum: 17494 },
      { layer: 4, type: "layerLock", name: "Layer Lock 4", keynum: 17495 },
      { layer: 5, type: "layerLock", name: "Layer Lock 5", keynum: 17496 },
      { layer: 6, type: "layerLock", name: "Layer Lock 6", keynum: 17497 },
      { layer: 7, type: "layerLock", name: "Layer Lock 7", keynum: 17498 },
      { layer: 8, type: "layerLock", name: "Layer Lock 8", keynum: 17499 },
      { layer: 9, type: "layerLock", name: "Layer Lock 9", keynum: 17500 },
      { layer: 10, type: "layerLock", name: "Layer Lock 10", keynum: 17501 },
    ],
    [],
  );

  const layerSwitch = useMemo(
    () => [
      { layer: 1, type: "layerShift", name: "Layer Shift 1", keynum: 17450 },
      { layer: 2, type: "layerShift", name: "Layer Shift 2", keynum: 17451 },
      { layer: 3, type: "layerShift", name: "Layer Shift 3", keynum: 17452 },
      { layer: 4, type: "layerShift", name: "Layer Shift 4", keynum: 17453 },
      { layer: 5, type: "layerShift", name: "Layer Shift 5", keynum: 17454 },
      { layer: 6, type: "layerShift", name: "Layer Shift 6", keynum: 17455 },
      { layer: 7, type: "layerShift", name: "Layer Shift 7", keynum: 17456 },
      { layer: 8, type: "layerShift", name: "Layer Shift 8", keynum: 17457 },
      { layer: 9, type: "layerShift", name: "Layer Shift 9", keynum: 17458 },
      { layer: 10, type: "layerShift", name: "Layer Shift 10", keynum: 17459 },
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

  const layerInfo = findLayerType(keyNumInternal);

  const [activeLayerNumber, setActiveLayerNumber] = useState<number>(0);
  const [activeLayerTab, setActiveLayerTab] = useState<string>("");

  console.log("What layer is: ", layerInfo);
  console.log("KC: ", KC);
  console.log("KeyCode modified: ", keyCode.modified);

  const handleLayer = (layerNumber: number) => {
    const layerItem = findLayerType(undefined, activeLayerTab, layerNumber);
    console.log("Layer inside handle: ", layerItem);
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

  useEffect(() => {
    // Call the custom hook inside the useEffect
    const layerItem = findLayerType(undefined, activeLayerTab, activeLayerNumber);
    console.log("Layer inside useEffect: ", layerItem);
    if (activeLayerNumber > 8) {
      setDisableOneShot(true);
    } else {
      setDisableOneShot(false);
    }
    if (layerItem && layerItem.type !== "layerDual") {
      onKeySelect(layerItem.keynum);
    }
    // if (layer.type === "layerShift") {
    //   onKeySelect(layer.keynum);
    // }
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
      setActiveLayerTab("layerShift");
      setActiveLayerNumber(0);
    }
  }, [keyNumInternal]);

  // Render variables
  const tabVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
  };

  return (
    <div
      className={`flex flex-wrap h-[inherit] ${isStandardView ? "standardViewTab" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""} tabsLayer`}
    >
      <div className="tabContentWrapper w-full">
        <Tabs orientation="horizontal" defaultValue={activeLayerTab}>
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
              <p>You can navigate between layers in different ways, adding layer shift or layer lock.</p>
            </Callout>
          ) : null}
          <div className="w-full flex gap-1 flex-row">
            <div className="rounded-regular flex flex-col gap-2 p-3 bg-gray-700">
              <Heading renderAs="h4" headingLevel={3} className="text-base">
                <small>01.</small> Layer
              </Heading>
              <div className="flex gap-1">
                {layerSwitch.map((button, index) => (
                  <Button
                    variant="config"
                    size="icon"
                    onClick={() => {
                      // onKeySelect(button.keynum);
                      handleLayer(index + 1);
                    }}
                    selected={index + 1 === activeLayerNumber}
                    // selected={layerDeltaSwitch + index === keyCode}
                    disabled={disableMods || (index > 7 && disableOneShotButtons)}
                    key={`buttonShift-${button.keynum}`}
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
              <Separator />

              <div className="rounded-sm flex flex-col gap-1 bg-gray-600/50 p-2">
                <Heading renderAs="h4" headingLevel={3} className="text-base">
                  <small>02.</small> Advanced options
                </Heading>
                <div className="rounded-sm flex gap-1 bg-gray-800/20 p-2">
                  <Button
                    className="flex-1"
                    variant="config"
                    size="sm"
                    onClick={() => setActiveLayerTab(previous => (previous === "layerLock" ? "layerShift" : "layerLock"))}
                    selected={activeLayerTab === "layerLock"}
                  >
                    Turn into layer lock
                  </Button>
                  <Button
                    className="flex-1"
                    variant="config"
                    size="sm"
                    onClick={() => setActiveLayerTab(previous => (previous === "layerDual" ? "layerShift" : "layerDual"))}
                    selected={activeLayerTab === "layerDual"}
                  >
                    Add a key on tap
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
                    Turn into a OneShot layer
                  </Button>
                </div>
              </div>
            </div>
            <TabsList className="flex flex-row gap-1">
              <TabsTrigger
                value="lShift"
                variant="tab-horizontal"
                disabled={disableMods}
                className="text-ssm [&_svg]:w-[20px] py-2 text-nowrap"
              >
                <IconLayerShift /> {i18n.editor.standardView.layers.layerSwitch}
              </TabsTrigger>
              <TabsTrigger value="lLock" variant="tab-horizontal" className="text-ssm [&_svg]:w-[20px] py-2 text-nowrap">
                <IconLayerLock /> {i18n.editor.layers.layerLock}
              </TabsTrigger>
              {activeTab !== "super" && activeTab !== "macro" ? (
                <>
                  <TabsTrigger value="lOneShot" variant="tab-horizontal" className="text-ssm [&_svg]:w-[20px] py-2 text-nowrap">
                    <>
                      <IconOneShot size="sm" /> OneShot{" "}
                      <div className="badge badge-primary leading-none ml-1 font-bold text-[9px] text-white">PRO</div>
                    </>
                  </TabsTrigger>
                  <TabsTrigger value="lDual" variant="tab-horizontal" className="text-ssm [&_svg]:w-[20px] py-2 text-nowrap">
                    <>
                      <IconLayers size="sm" /> Dual function{" "}
                      <div className="badge badge-primary leading-none ml-1 font-bold text-[9px] text-white">PRO</div>
                    </>
                  </TabsTrigger>
                </>
              ) : (
                ""
              )}
            </TabsList>
          </div>
          <div className="flex py-2 flex-col">
            <TabsContent value="lShift" className="w-full">
              <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                  {i18n.editor.standardView.layers.layerSwitchDescription}
                </p>
                <div className={`flex-1 py-2 ${disableMods ? "opacity-50 pointer-events-none" : ""}`}>
                  <div className="p-1 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-white dark:bg-gray-900/20">
                    {layerSwitch.map((button, index) => (
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => {
                          onKeySelect(button.keynum);
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
              </motion.div>
            </TabsContent>
            <TabsContent value="lLock" className="w-full">
              <motion.div initial="hidden" animate="visible" variants={tabVariants}>
                <p className="text-ssm font-medium text-gray-400 dark:text-gray-200">
                  {i18n.editor.standardView.layers.layerSwitchDescription}
                </p>
                <div className="flex-1 py-2">
                  <div className="p-1 inline-flex flex-nowrap gap-1 mt-2 w-auto rounded-md bg-white dark:bg-gray-900/20">
                    {layerLock.map((button, index) => (
                      <Button
                        variant="config"
                        size="icon"
                        onClick={() => {
                          onKeySelect(button.keynum);
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
              </motion.div>
            </TabsContent>
            {activeTab !== "super" && activeTab !== "macro" ? (
              <>
                <TabsContent value="lOneShot" key="lOneShot">
                  <motion.div initial="hidden" animate="visible" key="lOneShot" variants={tabVariants}>
                    <OneShotTab keyCode={keyCode} onKeySelect={onKeySelect} isStandardView disabled={disabled} />
                  </motion.div>
                </TabsContent>
                <TabsContent value="lDual">
                  <motion.div initial="hidden" animate="visible" key="tabDualFunction" variants={tabVariants}>
                    <>
                      <Picker
                        actions={actions}
                        action={action}
                        disable={disabled}
                        baseCode={baseCode}
                        modCode={modCode}
                        onKeySelect={onKeySelect}
                        activeTab={activeTab}
                        selectedlanguage={selectedlanguage}
                        // selKeys={selKeys}
                        superkeys={superkeys}
                        kbtype={kbtype}
                        keyCode={keyCode}
                        macros={macros}
                        isWireless={isWireless}
                      />
                      <div
                        className={`ModPicker ${macros[KC - 53852] ? "ModPickerScrollHidden" : ""} ${disabled ? "disable" : ""}`}
                      >
                        <div className="flex gap-2 flex-col lg:flex-row lg:gap-4 py-4">
                          <DualFunctionPicker keyCode={keyCode} onKeySelect={onKeySelect} activeTab={activeTab} isStandardView />
                        </div>
                      </div>
                    </>
                  </motion.div>
                </TabsContent>
              </>
            ) : (
              ""
            )}
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default LayersTab;

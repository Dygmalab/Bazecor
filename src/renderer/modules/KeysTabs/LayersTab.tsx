import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { i18n } from "@Renderer/i18n";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import { IconLayerLock, IconLayerShift, IconLayers, IconOneShot } from "@Renderer/components/atoms/icons";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@Renderer/components/atoms/Tabs";
import OneShotTab from "@Renderer/modules/KeysTabs/OneShotTab";
import { Separator } from "@Renderer/components/atoms/separator";
import Heading from "@Renderer/components/atoms/Heading";
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
  const [activeLayerTab, setActiveLayerTab] = useState(disableMods ? "lLock" : "lShift");
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
  // console.log("disableMods: ", disableMods);

  // const handleTabChange = (value: any) => {
  //   console.log(value);
  //   setActiveLayerTab(value);
  // };

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
              <Separator />

              <div className="rounded-sm flex flex-col gap-1 bg-gray-600/50 p-2">
                <Heading renderAs="h4" headingLevel={3} className="text-base">
                  <small>02.</small> Advanced options
                </Heading>
                <div className="rounded-sm flex gap-1 bg-gray-800/20 p-2">
                  <Button className="flex-1" variant="config" size="sm">
                    Turn into layer lock
                  </Button>
                  <Button className="flex-1" variant="config" size="sm">
                    Add a key on tap
                  </Button>
                  <Button className="flex-1" variant="config" size="sm">
                    Turn into a OneShot layer
                  </Button>
                </div>
              </div>
            </div>
            <TabsList className="hidden flex flex-row gap-1">
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
          <div className="flex py-2 flex-col hidden">
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

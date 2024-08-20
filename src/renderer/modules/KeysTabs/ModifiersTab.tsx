import React, { useMemo, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import { Separator } from "@Renderer/components/atoms/Separator";
import Heading from "@Renderer/components/atoms/Heading";
import findModifierType from "@Renderer/utils/findModifierType";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";
import { IconCheckmark, IconInformation } from "@Renderer/components/atoms/icons";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
// eslint-disable-next-line
import { Picker } from "../KeyPickerKeyboard";

interface ModifiersTabProps {
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

const ModifiersTab = ({
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
}: ModifiersTabProps) => {
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

  const [activeModifier, setActiveModifier] = useState<string>("");
  const [activeModifierTab, setActiveModifierTab] = useState<string>("None");
  const [internalKeyBase, setInternalKeyBase] = useState<number>(0);

  useEffect(() => {
    console.log("activeModifier: ", activeModifier);
  }, [activeModifier]);

  const handleDual = (keyBase: number, modifier?: string) => {
    const modifierItem = findModifierType(undefined, activeModifierTab, modifier || activeModifier);
    setInternalKeyBase(keyBase);
    if (modifierItem && modifierItem.type === "dualModifier") {
      onKeySelect(modifierItem.keynum + keyBase);
    }
  };

  const handleModifier = (modifier: string) => {
    const modifierItem = findModifierType(undefined, activeModifierTab, modifier);
    console.log("modifierItem: ", modifierItem);
    console.log("internalKeyBase: ", internalKeyBase);
    setActiveModifier(modifier);
    if (modifierItem && modifierItem.type !== "dualModifier") {
      onKeySelect(modifierItem.keynum);
    }
    if (modifierItem && modifierItem.type === "dualModifier" && internalKeyBase > 0) {
      handleDual(internalKeyBase, modifier);
    }
  };

  useEffect(() => {
    const modifierItem = findModifierType(undefined, activeModifierTab, activeModifier);
    if (modifierItem && modifierItem.type !== "dualModifier") {
      onKeySelect(modifierItem.keynum);
    }
    // eslint-disable-next-line
  }, [activeModifierTab]);

  useEffect(() => {
    const modifierItem = findModifierType(keyNumInternal);
    if (modifierItem) {
      setActiveModifierTab(modifierItem?.type);
      setActiveModifier(modifierItem?.modifier);
    }
    // eslint-disable-next-line
  }, [keyNumInternal]);

  return (
    <div
      className={`flex flex-wrap h-[inherit] ${isStandardView ? "standardViewTab" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""} tabsLayer`}
    >
      <div className="tabContentWrapper w-full">
        {isStandardView ? (
          <Callout size="sm" className="mt-0 mb-4">
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
              <span className="inline-flex mr-1">Modifier</span>
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
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Heading>
            <div className="flex gap-1">
              <div className="grid gap-1 p-1 bg-white dark:bg-gray-900/20 rounded-md grid-cols-4">
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("shift");
                  }}
                  selected={activeModifier === "shift"}
                  size="sm"
                >
                  <OSKey renderKey="shift" direction="Left" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("control");
                  }}
                  selected={activeModifier === "control"}
                  size="sm"
                >
                  <OSKey renderKey="control" direction="Left" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("os");
                  }}
                  selected={activeModifier === "os"}
                  size="sm"
                >
                  <OSKey renderKey="os" direction="Left" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("alt");
                  }}
                  selected={activeModifier === "alt"}
                  size="sm"
                >
                  <OSKey renderKey="alt" direction="Left" size="sm" />
                </Button>

                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("rshift");
                  }}
                  selected={activeModifier === "rshift"}
                  disabled={activeModifierTab === "dualModifier"}
                  size="sm"
                >
                  <OSKey renderKey="shift" direction="Right" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("rcontrol");
                  }}
                  selected={activeModifier === "rcontrol"}
                  disabled={activeModifierTab === "dualModifier"}
                  size="sm"
                >
                  <OSKey renderKey="control" direction="Right" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("ros");
                  }}
                  selected={activeModifier === "ros"}
                  disabled={activeModifierTab === "dualModifier"}
                  size="sm"
                >
                  <OSKey renderKey="os" direction="Right" size="sm" />
                </Button>
                <Button
                  variant="config"
                  onClick={() => {
                    handleModifier("altGr");
                  }}
                  selected={activeModifier === "altGr"}
                  size="sm"
                >
                  <OSKey renderKey="altGr" size="sm" />
                </Button>
              </div>
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
                  onClick={() => setActiveModifierTab(previous => (previous === "dualModifier" ? "None" : "dualModifier"))}
                  selected={activeModifierTab === "dualModifier"}
                  disabled={activeModifier === "ros" || activeModifier === "rcontrol" || activeModifier === "rshift"}
                >
                  {activeModifierTab === "dualModifier" ? (
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
                  onClick={() => {
                    setActiveModifierTab(previous => (previous === "oneShotModifier" ? "None" : "oneShotModifier"));
                  }}
                  selected={activeModifierTab === "oneShotModifier"}
                >
                  {activeModifierTab === "oneShotModifier" ? (
                    <IconCheckmark />
                  ) : (
                    <div className="h-[20px] w-[20px] relative after:absolute after:rounded-full after:content-[' '] after:w-3 after:h-3 after:left-1/2 after:top-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:border-2 after:border-gray-200 after:bg-gray-300/20 dark:after:border-gray-200 dark:after:bg-gray-500/50" />
                  )}{" "}
                  <div className="pl-1">Turn into a OneShot modifier</div>
                  <div className="badge bg-gray-400/50 leading-none ml-1 px-1 py-0.5 font-bold text-[8px] text-white rounded-md">
                    PRO
                  </div>
                </Button>
              </div>
              <AnimatePresence>
                <motion.div>
                  {activeModifierTab === "dualModifier" && (
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

export default ModifiersTab;

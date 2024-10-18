/* eslint-disable import/no-cycle */
import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";
import findLayerType from "@Renderer/utils/findLayerType";
import { IconWarning, IconPlus, IconPen } from "@Renderer/components/atoms/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@Renderer/components/atoms/Popover";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import CustomRadioCheckBox from "@Renderer/components/molecules/Form/CustomRadioCheckBox";
import { Separator } from "@Renderer/components/atoms/Separator";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { KeymapDB } from "../../../api/keymap";
import { Picker } from "../KeyPickerKeyboard";

interface LayersTabProps {
  keyCode: SegmentedKeyType;

  onKeySelect: (value: number) => void;
  disabled?: boolean;
  activeTab?: string;
  selectedlanguage?: string;
  macros?: any;
  triggerDeleteLastItem?: any;
}

const LayersTab = ({
  keyCode,
  onKeySelect,
  disabled,
  activeTab,
  selectedlanguage,
  macros,
  triggerDeleteLastItem,
}: LayersTabProps) => {
  const [disableOneShotButtons, setDisableOneShotButtons] = useState<boolean>(false);
  const [openKeysPopover, setOpenKeysPopover] = useState<boolean>(false);
  const [KC, setKC] = useState<number>(0);

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

  const triggerToast = () => {
    toast.warn(
      <ToastMessage icon={<IconWarning />} title="Select a layer first" content="Please select a layer to continue." />,
      {
        autoClose: 3000,
        icon: "",
      },
    );
  };
  const triggerToastOneShot = () => {
    toast.warn(
      <ToastMessage
        icon={<IconWarning />}
        title="Action not available"
        content="OneShot Layer 9 and OneShot Layer 10 are currently unavailable. Please select a different layer to continue."
      />,
      {
        autoClose: 3000,
        icon: "",
      },
    );
  };

  useEffect(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      setKC(keyCode.base + keyCode.modified);
    } else {
      setKC(undefined);
    }
  }, [keyCode]);

  let keyNumInternal: number;
  if (typeof KC === "number" && KC <= 51217) {
    keyNumInternal = KC;
  } else if (typeof KC === "number" && KC > 51217) {
    keyNumInternal = keyCode.modified;
  } else {
    keyNumInternal = 0;
  }

  const [activeLayerNumber, setActiveLayerNumber] = useState<number>(0);
  const [activeLayerTab, setActiveLayerTab] = useState<string>("");

  const handleLayer = (layerNumber: number) => {
    const layerItem = findLayerType(undefined, activeLayerTab, layerNumber);
    // console.log("Layer inside handle: ", layerItem);
    setActiveLayerNumber(layerNumber);
    if (layerNumber > 8) {
      // setDisableOneShot(true);
      setDisableOneShotButtons(true);
    } else {
      // setDisableOneShot(false);
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
      setOpenKeysPopover(false);
    }
  };

  useEffect(() => {
    const layerItem = findLayerType(undefined, activeLayerTab, activeLayerNumber);
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
      setActiveLayerTab("layerShift");
      setActiveLayerNumber(0);
    }
    // eslint-disable-next-line
  }, [keyNumInternal]);

  const keymapDB = useMemo(() => new KeymapDB(), []);

  const labelKey = useCallback(
    (id: number): string => {
      const aux = keymapDB.parse(id);
      return String(aux.label);
    },
    [keymapDB],
  );

  return (
    <div className={`flex flex-wrap h-[inherit] ${disabled ? "opacity-50 pointer-events-none" : ""} tabsLayer`}>
      <div className="tabContentWrapper w-full">
        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <Heading renderAs="h4" headingLevel={3} className="text-base flex leading-6 gap-1">
                {activeLayerNumber === 0 && <>Select a layer</>}
                {activeLayerTab === "layerShift" && activeLayerNumber > 0 ? (
                  <>
                    Layer <span className="text-gray-400 dark:text-gray-300">Shift on hold</span>
                  </>
                ) : (
                  ""
                )}
                {activeLayerTab === "layerLock" && activeLayerNumber !== 0 && (
                  <>
                    Layer <span className="text-gray-400 dark:text-gray-300">Lock on tap</span>
                  </>
                )}
                {activeLayerTab === "layerDual" && (
                  <>
                    Layer{" "}
                    <span className="text-gray-400 dark:text-gray-300 gap-1 inline-flex leading-6 align-text-bottom">
                      Shift on hold
                    </span>
                  </>
                )}
                {activeLayerTab === "layerShot" && (
                  <>
                    Layer <span className="text-gray-400 dark:text-gray-300">OneShot</span>
                  </>
                )}
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
                    disabled={index > 7 && disableOneShotButtons && activeLayerTab === "layerShot"}
                    key={`buttonLayerID-${button.layer}`}
                    className="h-9 aspect-square"
                  >
                    {index + 1}
                  </Button>
                ))}
              </div>
            </div>
            <AnimatePresence>
              <motion.div className="flex flex-col gap-2">
                {activeLayerTab === "layerDual" && (
                  <>
                    <Heading renderAs="h4" headingLevel={3} className="text-base flex leading-6 gap-1">
                      Key <span className="text-gray-400 dark:text-gray-300"> on tap</span>
                    </Heading>
                    <Popover open={openKeysPopover} onOpenChange={setOpenKeysPopover}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="config"
                          selected={!!(labelKey(keyCode.base) && labelKey(keyCode.base) !== "KEY")}
                          size="sm"
                          className="min-w-20 h-9 flex gap-2 justify-between"
                        >
                          {labelKey(keyCode.base) && labelKey(keyCode.base) !== "KEY" ? (
                            labelKey(keyCode.base)
                          ) : (
                            <IconPlus size="xs" />
                          )}
                          <div className="flex gap-2">
                            <Separator orientation="vertical" className="bg-gray-50 dark:bg-gray-50 h-[auto] opacity-20" />
                            <IconPen size="xs" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        sideOffset={5}
                        align="center"
                        side="top"
                        className="md:w-[720px] lg:w-[820px] xl:w-[920px] max-w-full"
                      >
                        <div className="w-full p-2 rounded-sm bg-gray-25/40 dark:bg-gray-800">
                          <div className="dropdown-group">
                            <Heading
                              headingLevel={5}
                              renderAs="h5"
                              className="my-1 flex gap-2 items-center text-gray-200 dark:text-gray-300"
                            >
                              <span>
                                Select <span className="text-gray-400 dark:text-gray-50">key</span>
                              </span>
                            </Heading>
                            <Picker
                              disable={disabled}
                              baseCode={keyCode.base}
                              modCode={keyCode.modified}
                              onKeySelect={handleDual}
                              selectedlanguage={selectedlanguage}
                              disableMods
                              disableMove={false}
                            />
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="flex flex-col gap-2 mt-3">
            <Heading renderAs="h4" headingLevel={3} className="text-base flex">
              Advanced options
            </Heading>
            <div className="flex flex-wrap gap-6">
              <CustomRadioCheckBox
                label={
                  <>
                    <div className="pl-0.5">Turn into layer lock</div>
                  </>
                }
                onClick={() => {
                  if (activeLayerNumber > 0) {
                    setActiveLayerTab(previous => (previous === "layerLock" ? "layerShift" : "layerLock"));
                  } else {
                    triggerToast();
                  }
                }}
                checked={activeLayerTab === "layerLock"}
                type="radio"
                name="turnIntoLockLayer"
                id="turnIntoLockLayer"
                tooltip={
                  <>
                    <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
                      Layer Lock
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Tap the key to move permanently to the selected layer. This is ideal for extended tasks like video editing
                      or gaming. Ensure you set up another Layer Lock in the target layer to easily return to the previous layer.
                    </p>
                  </>
                }
                disabled={false}
                className=""
              />
              {activeTab === "editor" && (
                <>
                  <CustomRadioCheckBox
                    label={<div className="pl-0.5">Add a key on tap</div>}
                    disabled={activeLayerNumber >= 9}
                    onClick={() => {
                      if (activeLayerNumber > 0 && activeLayerNumber <= 8) {
                        setActiveLayerTab(previous => (previous === "layerDual" ? "layerShift" : "layerDual"));
                        setOpenKeysPopover(true);
                      } else if (activeLayerNumber >= 9) {
                        triggerToastOneShot();
                      } else {
                        triggerToast();
                      }
                    }}
                    checked={activeLayerTab === "layerDual"}
                    type="radio"
                    name="addDualFunctionLayer"
                    id="addDualFunctionLayer"
                    tooltip={
                      <>
                        <Heading
                          headingLevel={4}
                          renderAs="h4"
                          className="text-gray-600 dark:text-gray-25 mt-2 mb-1 leading-6 text-base"
                        >
                          Add a key on tap (Dual-Function)
                        </Heading>
                        <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                          Tap the key to perform a normal keypress (like space or enter) or hold it to shift to the selected
                          layer. This allows for efficient layer access without sacrificing key real estate.
                          <br />
                          <br />
                          Add key on tap only works for layers 1 to 8.
                        </p>
                      </>
                    }
                    className=""
                  />
                  <CustomRadioCheckBox
                    label={<div className="pl-0.5">Turn into OneShot layer</div>}
                    disabled={activeLayerNumber >= 9}
                    onClick={() => {
                      if (activeLayerNumber > 0 && activeLayerNumber <= 8) {
                        setActiveLayerTab(previous => (previous === "layerShot" ? "layerShift" : "layerShot"));
                        setDisableOneShotButtons(true);
                      } else if (activeLayerNumber >= 9) {
                        triggerToastOneShot();
                      } else {
                        triggerToast();
                      }
                    }}
                    checked={activeLayerTab === "layerShot"}
                    type="radio"
                    name="addOneShotLayer"
                    id="addOneShotLayer"
                    tooltip={
                      <>
                        <Heading
                          headingLevel={4}
                          renderAs="h4"
                          className="text-gray-600 dark:text-gray-25 mt-2 mb-1 leading-6 text-base"
                        >
                          OneShot layer Navigation
                        </Heading>
                        <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                          Tap the key to enter the selected layer for a single keypress; after that keypress, the software
                          automatically returns to the previous layer. You can also hold the key to stay in the layer while you
                          hold it. Double-tap it to lock into the layer; go back to the previous layer by tapping the key again.
                          <br />
                          <br />
                          OneShot layers only work for layers 1 to 8.
                        </p>
                      </>
                    }
                    className=""
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LayersTab;

import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import log from "electron-log/renderer";

import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";
import findModifierType from "@Renderer/utils/findModifierType";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";
import { IconWarning, IconPen, IconPlus } from "@Renderer/components/atoms/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@Renderer/components/atoms/Popover";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import CustomRadioCheckBox from "@Renderer/components/molecules/Form/CustomRadioCheckBox";
import { Separator } from "@Renderer/components/atoms/Separator";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { KeymapDB } from "../../../api/keymap";
// eslint-disable-next-line
import { Picker } from "../KeyPickerKeyboard";

interface ModifiersTabProps {
  keyCode: SegmentedKeyType;
  onKeySelect: (value: number) => void;
  disabled?: boolean;
  baseCode?: number;
  modCode?: number;
  selectedlanguage?: string;
}

const ModifiersTab = ({
  keyCode,

  onKeySelect,
  disabled,
  baseCode,
  modCode,
  selectedlanguage,
}: ModifiersTabProps) => {
  const [activeModifier, setActiveModifier] = useState<string>("");
  const [activeModifierTab, setActiveModifierTab] = useState<string>("None");
  const [internalKeyBase, setInternalKeyBase] = useState<number>(0);
  const [openKeysPopover, setOpenKeysPopover] = useState<boolean>(false);

  const KC = useMemo(() => {
    if (keyCode?.base !== undefined && keyCode?.modified !== undefined) {
      return keyCode.base + keyCode.modified;
    }
    return undefined;
  }, [keyCode]);

  let isDualModifier = false;

  if (
    keyCode.modified === 49425 ||
    keyCode.modified === 49169 ||
    keyCode.modified === 49937 ||
    keyCode.modified === 49681 ||
    keyCode.modified === 50705
  ) {
    isDualModifier = true;
  }

  let keyNumInternal: number;
  if (typeof KC === "number" && !isDualModifier) {
    keyNumInternal = KC;
  } else if (typeof KC === "number" && isDualModifier) {
    keyNumInternal = keyCode.modified;
  } else {
    keyNumInternal = 0;
  }

  const triggerToast = () => {
    toast.warn(
      <ToastMessage
        icon={<IconWarning />}
        title="Select a modifier first"
        content="Please select a modifier key before proceeding. Modifiers, like Shift or Ctrl, are required to complete this action."
      />,
      {
        autoClose: 3000,
        icon: "",
      },
    );
  };

  const handleDual = (keyBase: number, modifier?: string) => {
    const modifierItem = findModifierType(undefined, activeModifierTab, modifier || activeModifier);
    setInternalKeyBase(keyBase);
    if (modifierItem && modifierItem.type === "dualModifier") {
      onKeySelect(modifierItem.keynum + keyBase);
      setOpenKeysPopover(false);
    }
  };

  const handleModifier = (modifier: string) => {
    const modifierItem = findModifierType(undefined, activeModifierTab, modifier);
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
    if (modifierItem && modifierItem.type === "dualModifier") {
      onKeySelect(keyCode.base + modifierItem.keynum);
    }
    // eslint-disable-next-line
  }, [activeModifierTab]);

  useEffect(() => {
    const modifierItem = findModifierType(keyNumInternal);

    if (modifierItem) {
      setActiveModifierTab(modifierItem?.type);
      setActiveModifier(modifierItem?.modifier);
    } else {
      setActiveModifierTab("None");
      setActiveModifier("");
    }

    // eslint-disable-next-line
  }, [keyNumInternal]);

  const modifiersButtons = useMemo(
    () => [
      {
        id: 1,
        label: "Shift",
        identifier: "shift",
        renderElement: <OSKey renderKey="shift" size="sm" />,
        dualDisabled: false,
        keyNumMod: 225,
      },
      {
        id: 2,
        label: "Control",
        identifier: "control",
        renderElement: <OSKey renderKey="control" size="sm" />,
        dualDisabled: false,
        keyNumMod: 224,
      },
      {
        id: 3,
        label: "OS",
        identifier: "os",
        renderElement: <OSKey renderKey="os" size="sm" />,
        dualDisabled: false,
        keyNumMod: 227,
      },
      {
        id: 4,
        label: "Alt",
        identifier: "alt",
        renderElement: <OSKey renderKey="alt" size="sm" />,
        dualDisabled: false,
        keyNumMod: 226,
      },
      {
        id: 5,
        label: "Right Shift",
        identifier: "rshift",
        renderElement: <OSKey renderKey="shift" size="sm" />,
        dualDisabled: true,
        keyNumMod: 229,
      },
      {
        id: 6,
        label: "Right Control",
        identifier: "rcontrol",
        renderElement: <OSKey renderKey="control" size="sm" />,
        dualDisabled: true,
        keyNumMod: 228,
      },
      {
        id: 7,
        label: "Right OS",
        identifier: "ros",
        renderElement: <OSKey renderKey="os" size="sm" />,
        dualDisabled: true,
        keyNumMod: 231,
      },
      {
        id: 7,
        label: "Alt Gr.",
        identifier: "altGr",
        renderElement: <OSKey renderKey="altGr" size="sm" />,
        dualDisabled: false,
        keyNumMod: 230,
      },
    ],
    [],
  );

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
                {activeModifierTab === "None" && <>Select a Modifier</>}
                {activeModifierTab === "dualModifier" && (
                  <>
                    Modifier{" "}
                    <span className="text-gray-400 dark:text-gray-300 gap-1 inline-flex leading-6 align-text-bottom">
                      on hold
                    </span>
                  </>
                )}
                {activeModifierTab === "oneShotModifier" && (
                  <>
                    Modifier <span className="text-gray-400 dark:text-gray-300">OneShot</span>
                  </>
                )}
              </Heading>
              <div className="flex flex-wrap gap-1 items-center">
                {modifiersButtons.map((button, index) => (
                  <div key={`keyIs ${button} + ${String(index)}`}>
                    {index === 0 && <span className="text-sm mr-1 text-gray-500 dark:text-gray-300">Left</span>}
                    {index === 4 && <span className="text-sm ml-2 mr-1 text-gray-500 dark:text-gray-300">Right</span>}
                    <Button
                      variant="config"
                      onClick={() => {
                        handleModifier(button.identifier);
                      }}
                      selected={activeModifier === button.identifier}
                      disabled={activeModifierTab === "dualModifier" && button.dualDisabled}
                      size="sm"
                      className="min-w-16 text-ssm h-9"
                      key={`button-key-${button.identifier}`}
                    >
                      {button.renderElement}
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <AnimatePresence>
              <motion.div className="flex flex-col gap-2">
                {activeModifierTab === "dualModifier" && (
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
                              disableMods
                              disableMove={false}
                              baseCode={baseCode}
                              modCode={modCode}
                              onKeySelect={handleDual}
                              selectedlanguage={selectedlanguage}
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
                label={<div className="pl-0.5">Add a key on tap</div>}
                checked={activeModifierTab === "dualModifier"}
                onClick={() => {
                  if (activeModifier === "") {
                    triggerToast();
                  } else if (activeModifier === "ros" || activeModifier === "rcontrol" || activeModifier === "rshift") {
                    // triggerToastDisabledDual();
                    log.info("Action disabled!");
                  } else {
                    setActiveModifierTab(previous => (previous === "dualModifier" ? "None" : "dualModifier"));
                    // setActiveModifierTab("dualModifier");
                    setOpenKeysPopover(true);
                  }
                }}
                type="radio"
                name="addDualFuncionModifier"
                id="addDualFuncionModifier"
                tooltip={
                  <>
                    <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
                      Add key on tap (Dual-function)
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Tap the key to perform a normal keypress (like space or enter) or hold it to use the selected modifier as
                      usual. This allows you to easily access your modifiers without sacrificing key real estate.
                    </p>
                  </>
                }
                className=""
                disabled={activeModifier === "ros" || activeModifier === "rcontrol" || activeModifier === "rshift"}
              />
              <CustomRadioCheckBox
                label={<div className="pl-0.5">Turn into a OneShot modifier</div>}
                checked={activeModifierTab === "oneShotModifier"}
                onClick={() => {
                  if (activeModifier === "") {
                    triggerToast();
                  } else {
                    setActiveModifierTab(previous => (previous === "oneShotModifier" ? "None" : "oneShotModifier"));
                    // setActiveModifierTab("oneShotModifier");
                  }
                }}
                type="radio"
                name="addOneShotModifier"
                id="addOneShotModifier"
                tooltip={
                  <>
                    <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
                      OneShot Modifier
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      Tap the key to use the selected modifier for a single keypress; after that keypress, the software
                      automatically deactivates the modifier. You can also hold the key to use the modifier normally. Double-tap
                      it to lock the modifier; tap it again to unlock it.
                    </p>
                  </>
                }
                className=""
                disabled={false}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModifiersTab;

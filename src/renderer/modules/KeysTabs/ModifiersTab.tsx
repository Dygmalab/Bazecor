import React, { useMemo, useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";

import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";
import findModifierType from "@Renderer/utils/findModifierType";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";
import { IconWarning, IconPen, IconPlus } from "@Renderer/components/atoms/icons";
import { Popover, PopoverContent, PopoverTrigger } from "@Renderer/components/atoms/Popover";
import ToastMessage from "@Renderer/components/atoms/ToastMessage";
import CustomRadioCheckBox from "@Renderer/components/molecules/Form/CustomRadioCheckBox";
import { Separator } from "@Renderer/components/atoms/Separator";
import { KeymapDB } from "../../../api/keymap";
// eslint-disable-next-line
import { Picker } from "../KeyPickerKeyboard";

interface ModifiersTabProps {
  keyCode: any;
  isStandardView: boolean;
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

  // useEffect(() => {
  //   console.log("activeModifier: ", activeModifier);
  // }, [activeModifier]);

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
  const triggerToastDisabledDual = () => {
    toast.warn(
      <ToastMessage
        icon={<IconWarning />}
        title="Not available on this modifier"
        content="Action not available on Right Shift, Right Control and Right OS, please select another modifier."
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
    // if (!modifierItem && activeModifierTab === "dualModifier") {
    //   onKeySelect(0);
    // }
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
      setInternalKeyBase(0);
    }
    // eslint-disable-next-line
  }, [keyNumInternal]);

  const modifiersButtons = useMemo(
    () => [
      {
        id: 1,
        label: "Shift",
        identifier: "shift",
        renderElement: <OSKey renderKey="shift" direction="Left" size="sm" />,
        dualDisabled: false,
      },
      {
        id: 2,
        label: "Control",
        identifier: "control",
        renderElement: <OSKey renderKey="control" direction="Left" size="sm" />,
        dualDisabled: false,
      },
      {
        id: 3,
        label: "OS",
        identifier: "os",
        renderElement: <OSKey renderKey="os" direction="Left" size="sm" />,
        dualDisabled: false,
      },
      {
        id: 4,
        label: "Alt",
        identifier: "alt",
        renderElement: <OSKey renderKey="alt" direction="Left" size="sm" />,
        dualDisabled: false,
      },
      {
        id: 5,
        label: "Right Shift",
        identifier: "rshift",
        renderElement: <OSKey renderKey="shift" direction="Right" size="sm" />,
        dualDisabled: true,
      },
      {
        id: 6,
        label: "Right Control",
        identifier: "rcontrol",
        renderElement: <OSKey renderKey="control" direction="Right" size="sm" />,
        dualDisabled: true,
      },
      {
        id: 7,
        label: "Right OS",
        identifier: "ros",
        renderElement: <OSKey renderKey="os" direction="Right" size="sm" />,
        dualDisabled: true,
      },
      {
        id: 7,
        label: "Alt Gr.",
        identifier: "altGr",
        renderElement: <OSKey renderKey="altGr" size="sm" />,
        dualDisabled: false,
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
    <div
      className={`flex flex-wrap h-[inherit] ${isStandardView ? "standardViewTab" : ""} ${disabled ? "opacity-50 pointer-events-none" : ""} tabsLayer`}
    >
      <div className="tabContentWrapper w-full">
        {isStandardView ? (
          <Callout size="sm" className="mt-0 mb-4">
            <p>
              Dual Function keys(Add key on tap) act differently when tapped or held, while One Shot Modifiers apply a modifier
              with a single tap for the next key press. These features streamline your workflow and enhance efficiency.
            </p>
          </Callout>
        ) : null}

        <div className="w-full flex flex-col gap-2">
          <div className="w-full flex flex-row flex-wrap gap-6">
            <div className="flex flex-col gap-2">
              <Heading renderAs="h4" headingLevel={3} className="text-base flex leading-6 gap-1">
                Modifier{" "}
                {activeModifierTab === "dualModifier" && (
                  <span className="text-gray-400 dark:text-gray-300">
                    Shift on hold <small>(Dual function)</small>
                  </span>
                )}
                {activeModifierTab === "oneShotModifier" && <span className="text-gray-400 dark:text-gray-300">OneShot</span>}
              </Heading>
              <div className="flex flex-wrap gap-1">
                {modifiersButtons.map(button => (
                  <Button
                    variant="config"
                    onClick={() => {
                      handleModifier(button.identifier);
                    }}
                    selected={activeModifier === button.identifier}
                    disabled={activeModifierTab === "dualModifier" && button.dualDisabled}
                    size="sm"
                    className="min-w-20 text-ssm h-9"
                  >
                    {button.renderElement}
                  </Button>
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
                    <div className="pl-0.5">Add a key on tap</div>
                    <div className="badge bg-gray-400/50 leading-none ml-1 px-1 py-0.5 font-bold text-[8px] text-white rounded-md">
                      PRO
                    </div>
                  </>
                }
                checked={activeModifierTab === "dualModifier"}
                onClick={() => {
                  if (activeModifier === "") {
                    triggerToast();
                  } else if (activeModifier === "ros" || activeModifier === "rcontrol" || activeModifier === "rshift") {
                    triggerToastDisabledDual();
                  } else {
                    // setActiveModifierTab(previous => (previous === "dualModifier" ? "None" : "dualModifier"));
                    setActiveModifierTab("dualModifier");
                    setOpenKeysPopover(true);
                  }
                }}
                type="radio"
                name="addDualFuncionModifier"
                id="addDualFuncionModifier"
                tooltip={
                  <>
                    <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
                      Dual Function Modifier (Add key on tap)
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      A Dual Function Modifier is a key that performs two functions based on how it&apos;s used. When you tap the
                      key, it acts like a regular key (e.g., space or enter), but when you hold it down, it acts as a modifier key
                      (like Shift, Ctrl, or Alt). This allows you to maximize the utility of a single key, enabling more efficient
                      and flexible keyboard use.
                    </p>
                  </>
                }
                className=""
                disabled={false}
              />
              <CustomRadioCheckBox
                label={
                  <>
                    <div className="pl-0.5">Turn into a OneShot modifier</div>
                    <div className="badge bg-gray-400/50 leading-none ml-1 px-1 py-0.5 font-bold text-[8px] text-white rounded-md">
                      PRO
                    </div>
                  </>
                }
                checked={activeModifierTab === "oneShotModifier"}
                onClick={() => {
                  if (activeModifier === "") {
                    triggerToast();
                  } else {
                    // setActiveModifierTab(previous => (previous === "dualModifier" ? "None" : "dualModifier"));
                    setActiveModifierTab("oneShotModifier");
                  }
                }}
                type="radio"
                name="addOneShotModifier"
                id="addOneShotModifier"
                tooltip={
                  <>
                    <Heading
                      headingLevel={4}
                      renderAs="h4"
                      className="text-gray-600 dark:text-gray-25 mt-2 mb-1 leading-6 text-base"
                    >
                      One Shot Modifier
                    </Heading>
                    <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                      A One Shot Modifier allows you to temporarily activate a modifier key with a single tap. Once tapped, the
                      modifier stays active for the next key press, then automatically deactivates. This is useful for executing a
                      quick shortcut or command without needing to hold down the modifier key.
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

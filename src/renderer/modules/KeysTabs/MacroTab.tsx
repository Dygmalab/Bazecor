import React, { useRef, useEffect, useState } from "react";
import { i18n } from "@Renderer/i18n";

import { IconArrowInBoxUp } from "@Renderer/components/atoms/icons";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";
import { SegmentedKeyType } from "@Renderer/types/layout";
import { MacrosType } from "@Renderer/types/macros";

interface MacroTabProps {
  macros: MacrosType[];
  selectedMacro: number;
  onMacrosPress: (value: number) => void;
  actTab: string;
  keyCode?: SegmentedKeyType;
  disabled?: boolean;
}

interface MacroItem {
  name: string;
  value: number;
  disabled: boolean;
}

const MacroTab = (props: MacroTabProps) => {
  const { macros, selectedMacro, onMacrosPress, disabled, keyCode, actTab } = props;
  const selected = useRef(-1);
  const [oldKC, setOldKC] = useState(-1);

  // sendMacro function to props onMacrosPress function to send macro to MacroCreator
  const sendMacro = () => {
    onMacrosPress(selected.current + 53852);
  };

  // update value when dropdown is changed
  const changeSelected = (newValue: string) => {
    const parseSelected = parseInt(newValue, 10);
    selected.current = parseSelected;
    if (actTab === "editor") sendMacro();
  };

  const macrosAux = macros.map((item: any, index: number) => {
    const macrosContainer: any = {};
    if (item.name === "") {
      macrosContainer.name = i18n.general.noname;
    } else {
      macrosContainer.name = item.name;
    }
    macrosContainer.value = index;
    macrosContainer.disabled = index === selectedMacro;
    return macrosContainer;
  });

  const currentlySelectedMacroIndex =
    macros.length > 0 && keyCode && keyCode.modified === 53852 ? String(keyCode.base) : selected.current;

  useEffect(() => {
    if (keyCode.base + keyCode.modified !== oldKC) {
      setOldKC(keyCode.base + keyCode.modified);
      selected.current = -1;
    }
  }, [keyCode, oldKC]);

  return (
    <div className={`h-[inherit] tabsMacro ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
      <div className="h-fit flex flex-wrap flex-initial">
        <div className="w-full py-4">
          <Heading headingLevel={4} renderAs="h4" className="!mt-0 !mb-1 !text-base">
            {i18n.editor.macros.macroTab.label}
          </Heading>
          <Select value={String(currentlySelectedMacroIndex)} onValueChange={changeSelected}>
            <SelectTrigger className="w-[280px]">
              <SelectValue placeholder="Select Macro" />
            </SelectTrigger>
            <SelectContent>
              {macrosAux.map((item: MacroItem) => (
                <SelectItem value={String(item.value)} disabled={item.disabled} key={`macroItem-${item.value}`}>
                  {item.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {actTab === "super" ? (
          <div className="mt-auto ml-auto">
            <Button variant="secondary" onClick={sendMacro} iconDirection="right">
              <IconArrowInBoxUp /> {i18n.editor.macros.textTabs.buttonText}
            </Button>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default MacroTab;

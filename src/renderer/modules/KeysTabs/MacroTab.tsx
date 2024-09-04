import React, { useState } from "react";
import { i18n } from "@Renderer/i18n";

import { IconArrowInBoxUp } from "@Renderer/components/atoms/icons";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { Button } from "@Renderer/components/atoms/Button";
import Heading from "@Renderer/components/atoms/Heading";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@Renderer/components/atoms/Select";

interface MacroTabProps {
  macros: any;
  selectedMacro: any;
  // eslint-disable-next-line react/no-unused-prop-types
  keyCode: any;
  isStandardView: boolean;
  onMacrosPress: any;
  disabled?: boolean;
}

interface MacroItem {
  name: string;
  value: number;
  disabled: boolean;
}

const MacroTab = (props: MacroTabProps) => {
  const { macros, selectedMacro, onMacrosPress, isStandardView, disabled } = props;
  const [selected, setSelected] = useState(0);

  // update value when dropdown is changed
  const changeSelected = (newValue: string) => {
    const parseSelected = parseInt(newValue, 10);
    setSelected(parseSelected);
  };

  const changeSelectedStd = (newValue: string) => {
    const parseSelected = parseInt(newValue, 10);
    setSelected(parseSelected);
    onMacrosPress(parseSelected + 53852);
  };

  // sendMacro function to props onMacrosPress function to send macro to MacroCreator
  const sendMacro = () => {
    onMacrosPress(selected + 53852);
  };

  const macrosAux = macros.map((item: MacroItem, index: number) => {
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

  return (
    <div
      className={`flex flex-wrap h-[inherit] ${isStandardView ? "standardViewTab" : ""} tabsMacro ${disabled ? "opacity-50 pointer-events-none" : ""}`}
    >
      <div className="tabContentWrapper">
        {isStandardView ? (
          <>
            {/* <Heading headingLevel={3} renderAs="h3">
              {i18n.editor.standardView.macros.title}
            </Heading> */}
            <Callout
              size="sm"
              className="mt-0"
              hasVideo
              media="MfTUvFrHLsE"
              videoTitle="13 Time-saving MACROS For Your Keyboard"
              videoDuration="5:24"
            >
              <p>{i18n.editor.standardView.macros.callOut1}</p>
              <p>{i18n.editor.standardView.macros.callOut2}</p>
            </Callout>
          </>
        ) : (
          <Callout size="sm" className="mt-0">
            <p>{i18n.editor.macros.macroTab.callout}</p>
          </Callout>
        )}

        <div className="w-full py-4">
          <Heading headingLevel={4} renderAs="h4" className="!mt-0 !mb-1 !text-base">
            {i18n.editor.macros.macroTab.label}
          </Heading>
          <Select
            // value={
            //   macrosAux.length > 0 && macrosAux[selected] !== undefined && macrosAux[selected].text
            //     ? macrosAux[selected].value
            //     : "Loading"
            // }
            onValueChange={isStandardView ? changeSelectedStd : changeSelected}
          >
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
      </div>
      {!isStandardView ? (
        <div className="tabSaveButton">
          <Button variant="secondary" onClick={sendMacro} iconDirection="right">
            <IconArrowInBoxUp /> {i18n.editor.macros.textTabs.buttonText}
          </Button>
        </div>
      ) : null}
    </div>
  );
};

export default MacroTab;

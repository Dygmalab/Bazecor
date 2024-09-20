/* eslint-disable no-bitwise */
import React, { useEffect, useState } from "react";

// Components
import { SegmentedKeyType } from "@Renderer/types/layout";
import usePrevious from "@Renderer/utils/usePrevious";
import Heading from "@Renderer/components/atoms/Heading";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";
import { IconInformation } from "@Renderer/components/atoms/icons";
import CustomRadioCheckBox from "@Renderer/components/molecules/Form/CustomRadioCheckBox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

interface ModPickerProps {
  keyCode: SegmentedKeyType;
  onKeySelect: (key: number) => void;
  isStandardView: boolean;
}

function ModPicker(props: ModPickerProps) {
  const { keyCode, onKeySelect, isStandardView } = props;
  const [modifs, setModifs] = useState([]);
  const previousKeyCode = usePrevious({ base: keyCode.base, modified: keyCode.modified });

  function parseModifs(keycode: number) {
    const newModifs = [];
    if (keycode & 0b100000000) {
      // Ctrl Decoder
      newModifs.push(1);
    }
    if (keycode & 0b1000000000) {
      // Alt Decoder
      newModifs.push(2);
    }
    if (keycode & 0b10000000000) {
      // AltGr Decoder
      newModifs.push(3);
    }
    if (keycode & 0b100000000000) {
      // Shift Decoder
      newModifs.push(0);
    }
    if (keycode & 0b1000000000000) {
      // Win Decoder
      newModifs.push(4);
    }
    return newModifs;
  }

  function applyModif(data: number[]) {
    let state = 0;
    if (data.includes(0)) {
      state += 2048;
    }
    if (data.includes(1)) {
      state += 256;
    }
    if (data.includes(2)) {
      state += 512;
    }
    if (data.includes(3)) {
      state += 1024;
    }
    if (data.includes(4)) {
      state += 4096;
    }

    return state;
  }

  function SelectModif(data: number) {
    let mod = [...modifs];
    if (mod.includes(data)) {
      mod = mod.filter(e => e !== data);
    } else {
      mod.push(data);
    }
    setModifs(mod);
    onKeySelect(keyCode.base + applyModif(mod));
  }

  function setModifierVisibility() {
    if (
      // (keyCode != undefined &&
      //   keyCode.base + keyCode.modified >= 224 &&
      //   keyCode.base + keyCode.modified <= 255) ||
      (keyCode !== undefined && keyCode.base + keyCode.modified >= 53852 && keyCode.base + keyCode.modified <= 53852 + 128) ||
      keyCode.base + keyCode.modified === 0 ||
      (keyCode.base + keyCode.modified >= 17492 && keyCode.base + keyCode.modified <= 17501) ||
      keyCode.base + keyCode.modified >= 8192
    ) {
      return true;
    }
    return false;
  }

  useEffect(() => {
    if (keyCode.base + keyCode.modified > 10000) return;
    setModifs(parseModifs(keyCode.base + keyCode.modified));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (previousKeyCode !== undefined) {
      const { base, modified } = previousKeyCode;
      if (typeof keyCode === "object" && keyCode.base + keyCode.modified !== base + modified) {
        if (keyCode.base + keyCode.modified > 10000) {
          setModifs([]);
        } else {
          setModifs(parseModifs(keyCode.base + keyCode.modified));
        }
      }
    }
  }, [keyCode, previousKeyCode]);

  return (
    <div className="h-[inherit]">
      <div className={`modPickerInner flex flex-wrap gap-6 ${isStandardView ? "modPickerInnerStd p-0" : "px-0"}`}>
        {!isStandardView ? (
          <Heading
            headingLevel={4}
            renderAs="paragraph-sm"
            className={`flex items-center gap-2 ${setModifierVisibility() ? "opacity-50" : "opacity-100"}`}
          >
            {/* {i18n.editor.standardView.keys.addModifier} */}
            Create a shortcut
            <TooltipProvider delayDuration={200}>
              <Tooltip>
                <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                  <IconInformation />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-1 leading-6 text-base">
                    Create a shortcut
                  </Heading>
                  <p className="description text-ssm font-medium text-gray-400 dark:text-gray-200">
                    Add modifiers to create a shortcut. Modifiers are special keys (like Ctrl, Shift, and Alt) that change the
                    function of other keys or mouse actions when pressed together. For example, CTRL+C to copy text or CTRL+V to
                    paste it.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </Heading>
        ) : null}
        <div className="modPickerButtonsList flex gap-6 items-center">
          <CustomRadioCheckBox
            label={<OSKey renderKey="shift" size={`${isStandardView ? "md" : "sm"}`} />}
            onClick={() => SelectModif(0)}
            checked={modifs.includes(0)}
            type="radio"
            name="addModShift"
            id="addModShift"
            disabled={setModifierVisibility()}
          />
          <CustomRadioCheckBox
            label={<OSKey renderKey="control" size={`${isStandardView ? "sm" : "sm"}`} />}
            onClick={() => SelectModif(1)}
            checked={modifs.includes(1)}
            type="radio"
            name="addModControl"
            id="addModControl"
            disabled={setModifierVisibility()}
          />
          <CustomRadioCheckBox
            label={<OSKey renderKey="os" size={`${isStandardView ? "md" : "sm"}`} />}
            onClick={() => SelectModif(4)}
            checked={modifs.includes(4)}
            type="radio"
            name="addModOS"
            id="addModOS"
            disabled={setModifierVisibility()}
          />
          <CustomRadioCheckBox
            label={<OSKey renderKey="alt" size={`${isStandardView ? "md" : "sm"}`} />}
            onClick={() => SelectModif(2)}
            checked={modifs.includes(2)}
            type="radio"
            name="addModAlt"
            id="addModAlt"
            disabled={setModifierVisibility()}
          />
          <CustomRadioCheckBox
            label={<OSKey renderKey="altGr" size={`${isStandardView ? "sm" : "sm"}`} />}
            onClick={() => SelectModif(3)}
            checked={modifs.includes(3)}
            type="radio"
            name="addModAltGr"
            id="addModAltGr"
            disabled={setModifierVisibility()}
          />
        </div>
      </div>
    </div>
  );
}

export default ModPicker;

/* eslint-disable no-bitwise */
import React, { useEffect, useState } from "react";
import { i18n } from "@Renderer/i18n";

// Components
import { SegmentedKeyType } from "@Renderer/types/layout";
import usePrevious from "@Renderer/utils/usePrevious";
import Heading from "@Renderer/components/atoms/Heading";
import { Button } from "@Renderer/components/atoms/Button";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";

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
      <div className={`modPickerInner ${isStandardView ? "modPickerInnerStd p-0" : "p-[16px]"}`}>
        {!isStandardView ? (
          <Heading headingLevel={4} renderAs="h4" className="text-ssm">
            {i18n.editor.standardView.keys.addModifier}
          </Heading>
        ) : null}
        <div
          className={`modPickerButtonsList gap-1 ${isStandardView ? "flex [&_button]:w-16" : "grid grid-cols-3 [&_button]:w-full"}`}
        >
          <Button
            variant="config"
            size="sm"
            selected={modifs.includes(0)}
            className={`modbutton ${!isStandardView && "!text-3xxs"}`}
            onClick={() => SelectModif(0)}
            disabled={setModifierVisibility()}
          >
            <OSKey renderKey="shift" size={`${isStandardView ? "md" : "sm"}`} />
          </Button>
          <Button
            variant="config"
            size="sm"
            selected={modifs.includes(1)}
            className={`modbutton ${!isStandardView && "!text-3xxs"}`}
            onClick={() => SelectModif(1)}
            disabled={setModifierVisibility()}
          >
            <OSKey renderKey="control" size={`${isStandardView ? "sm" : "sm"}`} />
          </Button>
          <Button
            variant="config"
            size="sm"
            selected={modifs.includes(4)}
            className={`modbutton ${!isStandardView && "!text-3xxs"}`}
            onClick={() => SelectModif(4)}
            disabled={setModifierVisibility()}
          >
            <OSKey renderKey="os" size={`${isStandardView ? "md" : "sm"}`} />
          </Button>
          <Button
            variant="config"
            size="sm"
            selected={modifs.includes(2)}
            className={`modbutton ${!isStandardView && "!text-3xxs"}`}
            onClick={() => SelectModif(2)}
            disabled={setModifierVisibility()}
          >
            <OSKey renderKey="alt" size={`${isStandardView ? "md" : "sm"}`} />
          </Button>
          <Button
            variant="config"
            size="sm"
            selected={modifs.includes(3)}
            className={`modbutton ${!isStandardView && "!text-3xxs"}`}
            onClick={() => SelectModif(3)}
            disabled={setModifierVisibility()}
          >
            <OSKey renderKey="altGr" size={`${isStandardView ? "sm" : "sm"}`} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ModPicker;

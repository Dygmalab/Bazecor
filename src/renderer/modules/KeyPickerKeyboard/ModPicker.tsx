/* eslint-disable no-bitwise */
import React, { useEffect, useState } from "react";
import Styled from "styled-components";
import { i18n } from "@Renderer/i18n";

// Components
import { SegmentedKeyType } from "@Renderer/types/layout";
import usePrevious from "@Renderer/utils/usePrevious";
import Title from "../../component/Title";
import { ButtonConfig } from "../../component/Button";

const Style = Styled.div`
height: inherit;
.modPickerInner {
  padding: 16px;
  h4 {
    font-size: 13px;
  }
}
.modPickerInner.modPickerInnerStd {
  padding: 0;
}
.modPickerButtonsList {
  display: flex;
  margin-left: -2px;
  margin-right: -2px;
  flex-wrap: wrap;
  .button-config {
    margin: 4px 2px 0 2px;
    width: 56px;
    text-align: center;
    padding: 7px 4px;
    // font-size: 12px;
  }
}

`;

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
    <Style>
      <div className={`modPickerInner ${isStandardView ? "modPickerInnerStd" : ""}`}>
        {!isStandardView ? <Title text={i18n.editor.standardView.keys.addModifier} headingLevel={4} /> : null}
        <div className="modPickerButtonsList">
          <ButtonConfig
            selected={modifs.includes(0)}
            buttonText="Shift"
            className="modbutton"
            onClick={() => SelectModif(0)}
            disabled={setModifierVisibility()}
          />
          <ButtonConfig
            selected={modifs.includes(1)}
            buttonText="Ctrl"
            className="modbutton"
            onClick={() => SelectModif(1)}
            disabled={setModifierVisibility()}
          />
          <ButtonConfig
            selected={modifs.includes(2)}
            buttonText="Alt"
            className="modbutton"
            onClick={() => SelectModif(2)}
            disabled={setModifierVisibility()}
          />

          <ButtonConfig
            selected={modifs.includes(3)}
            buttonText="Alt Gr"
            className="modbutton"
            onClick={() => SelectModif(3)}
            disabled={setModifierVisibility()}
          />

          <ButtonConfig
            selected={modifs.includes(4)}
            buttonText="OS"
            className="modbutton"
            onClick={() => SelectModif(4)}
            disabled={setModifierVisibility()}
          />
        </div>
      </div>
    </Style>
  );
}

export default ModPicker;

import React, { useState, useCallback, CSSProperties } from "react";
import { ColorResult, SketchPicker } from "react-color";
import Styled from "styled-components";

import Heading from "@Renderer/components/atoms/Heading";
import { ColorButton } from "@Renderer/component/Button";

// Icons
import { i18n } from "@Renderer/i18n";
import { IconChevronDown, IconColorPalette, IconKeysLight, IconKeysUnderglow } from "@Renderer/components/atoms/icons";
import { ColorEditorProps } from "@Renderer/types/colorEditor";
import { ColorPalette } from "@Renderer/modules/ColorEditor/ColorPalette";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@Renderer/components/atoms/DropdownMenu";
import { Button } from "@Renderer/components/atoms/Button";

const Styles = Styled.div`
width: 100%;
.panelTitle {
  white-space: nowrap;
  padding-right: 24px;
  h4 {
    color: ${({ theme }) => theme.styles.colorPanel.colorTitle};
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.02em;
    white-space: nowrap;
    margin: 0;
  }
}
.panelTools {
  display: flex;
  flex-wrap: nowrap;
  justify-content: space-between;
  width: 100%;
}
.buttonsGroup {
  display: flex;
  flex-wrap: nowrap;
  .buttonColor {
    margin-left: 8px;
  }
}
.buttonEditColor {
  position: relative;
}
.buttonsApplyAll {
  display: flex;
  flex-wrap: nowrap;
}

.colorPalette {
  display: grid;
  grid-auto-columns: auto;
  grid-auto-flow: column;
  align-items: center;
  grid-gap: 4px;
}
.sketch-picker {
  font-weight: 600;
  input {
    font-weight: 500;
    width: 100%;
    color: #000;
  }
}

@media screen and (max-width: 1599px) {
  .panelTitle {
    padding-right: 12px;
  }
}
@media screen and (max-width: 1499px) {
  .panelTitle {
    display: none;
  }
}
`;

const ColorEditor = ({
  colors,
  selected,
  toChangeAllKeysColor,
  deviceName,
  applyColorMapChangeBL,
  applyColorMapChangeUG,
  onColorPick,
  onColorSelect,
  onColorButtonSelect,
}: ColorEditorProps) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleChange = useCallback(
    (color: ColorResult) => {
      onColorPick(selected, color.rgb.r, color.rgb.g, color.rgb.b);
    },
    [selected, onColorPick],
  );

  const selectColor = useCallback(
    (pick: number) => {
      onColorSelect(pick);
      if (pick === selected) {
        onColorButtonSelect("one_button_click", pick);
        return;
      }
      onColorButtonSelect("another_button_click", pick);
    },
    [selected, onColorSelect, onColorButtonSelect],
  );

  const showColorPicker = useCallback(() => {
    setDisplayColorPicker(!displayColorPicker);
  }, [displayColorPicker]);

  const popover = {
    position: "absolute",
    top: "42px",
  } as CSSProperties;
  const cover = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  } as CSSProperties;

  const underglowStart = deviceName === "Defy" ? 70 : 69;

  return (
    <Styles className="extraPanel">
      <div className="panelTitle">
        <Heading headingLevel={4} renderAs="h4">
          {i18n.editor.color.colorPalette}
        </Heading>
      </div>
      <div className="panelTools">
        <ColorPalette colors={colors} selected={selected} onColorSelect={selectColor} />
        <div className="buttonsGroup">
          <div className="buttonEditColor">
            <ColorButton
              onClick={showColorPicker}
              label={i18n.editor.color.selectedColor}
              text={i18n.editor.color.editColor}
              icoSVG={<IconColorPalette />}
              color={colors[selected]}
              disabled={!colors[selected]}
            />
            {displayColorPicker ? (
              <div style={popover}>
                <div style={cover} onClick={showColorPicker} aria-hidden="true" />
                <SketchPicker color={colors[selected]} onChange={handleChange} width="240px" />
              </div>
            ) : null}
          </div>
          <div className="buttonsApplyAll">
            <div className="flex">
              <ColorButton
                onClick={() => {
                  toChangeAllKeysColor(selected, 0, underglowStart);
                }}
                label={i18n.editor.color.applyColor}
                text={i18n.editor.color.allKeys}
                icoSVG={<IconKeysLight />}
                color={colors[selected]}
                disabled={!colors[selected]}
                hasDropdown
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="config"
                    size="sm"
                    className="rounded-l-none border-l-0 py-0.5 px-2 [&_svg]:w-4"
                    disabled={!colors[selected]}
                  >
                    <IconChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => (selected >= 0 ? applyColorMapChangeBL("LEFT", selected) : "")}>
                    Left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => (selected >= 0 ? applyColorMapChangeBL("RIGHT", selected) : "")}>
                    Right
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="flex">
              <ColorButton
                onClick={() => {
                  toChangeAllKeysColor(selected, underglowStart, 177);
                }}
                label={i18n.editor.color.applyColor}
                text={i18n.editor.color.underglow}
                icoSVG={<IconKeysUnderglow />}
                color={colors[selected]}
                disabled={!colors[selected]}
                hasDropdown
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="config"
                    size="sm"
                    className="rounded-l-none border-l-0 py-0.5 px-2 [&_svg]:w-4"
                    disabled={!colors[selected]}
                  >
                    <IconChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => (selected >= 0 ? applyColorMapChangeUG("LEFT", selected) : "")}>
                    Left
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => (selected >= 0 ? applyColorMapChangeUG("RIGHT", selected) : "")}>
                    Right
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </Styles>
  );
};

export default ColorEditor;

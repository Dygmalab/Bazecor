// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2022  Dygmalab, Inc.
 *
 * This program is free software: you can redistribute it and/or modify it under
 * the terms of the GNU General Public License as published by the Free Software
 * Foundation, version 3.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import React, { useState, CSSProperties } from "react";
import { ColorResult, SketchPicker } from "react-color";

// Bootstrap components
import Heading from "@Renderer/components/atoms/Heading";
import { ColorButton } from "@Renderer/component/Button";

// Icons
import { i18n } from "@Renderer/i18n";
import { IconColorPalette, IconKeysLight, IconKeysUnderglow } from "@Renderer/components/atoms/icons";
import { ColorEditorProps } from "@Renderer/types/colorEditor";
import { ColorPalette } from "@Renderer/modules/ColorEditor/ColorPalette";

const ColorEditor: React.FC<ColorEditorProps> = ({
  colors,
  selected,
  toChangeAllKeysColor,
  deviceName,
  onColorPick,
  onColorSelect,
  onColorButtonSelect,
}) => {
  const [displayColorPicker, setDisplayColorPicker] = useState(false);

  const handleChange = (color: ColorResult) => {
    onColorPick(selected, color.rgb.r, color.rgb.g, color.rgb.b);
  };

  const selectColor = (pick: number) => {
    onColorSelect(pick);
    if (pick === selected) {
      onColorButtonSelect("one_button_click", pick);
    } else {
      onColorButtonSelect("another_button_click", pick);
    }
  };

  const showColorPicker = () => {
    setDisplayColorPicker(prev => !prev);
  };

  const popover: CSSProperties = {
    position: "absolute",
    top: "42px",
  };

  const cover: CSSProperties = {
    position: "fixed",
    top: "0px",
    right: "0px",
    bottom: "0px",
    left: "0px",
  };

  const underglowStart = deviceName === "Defy" ? 70 : 69;

  return (
    <div className="extraPanel w-full flex items-center flex-nowrap min-h-14 rounded-tl-none rounded-tr-none rounded-bl-regular rounded-br-regular mt-0.5 py-3 px-6 bg-gray-25/90 dark:bg-gray-400/15">
      <div className="panelTitle whitespace-nowrap pr-6 xs:hidden sm:hidden md:hidden lg:hidden xl:inline-flex">
        <Heading
          headingLevel={4}
          renderAs="h4"
          className="text-sm font-semibold tracking-tight whitespace-nowrap m-0 text-gray-500 dark:text-gray-100"
        >
          {i18n.editor.color.colorPalette}
        </Heading>
      </div>
      <div className="panelTools flex flex-nowrap justify-between w-full">
        <ColorPalette colors={colors} selected={selected} onColorSelect={selectColor} />
        <div className="buttonsGroup flex flex-nowrap gap-1">
          <div className="buttonEditColor relative">
            <ColorButton
              onClick={showColorPicker}
              label={i18n.editor.color.selectedColor}
              text={i18n.editor.color.editColor}
              icoSVG={<IconColorPalette />}
              color={colors[selected]}
            />
            {displayColorPicker && (
              <div style={popover}>
                <div style={cover} onClick={showColorPicker} aria-hidden="true" />
                <SketchPicker color={colors[selected]} onChange={handleChange} width="240px" />
              </div>
            )}
          </div>
          <div className="buttonsApplyAll flex flex-nowrap gap-1">
            <ColorButton
              onClick={() => toChangeAllKeysColor(selected, 0, underglowStart)}
              label={i18n.editor.color.applyColor}
              text={i18n.editor.color.allKeys}
              icoSVG={<IconKeysLight />}
              color={colors[selected]}
            />
            <ColorButton
              onClick={() => toChangeAllKeysColor(selected, underglowStart, 177)}
              label={i18n.editor.color.applyColor}
              text={i18n.editor.color.underglow}
              icoSVG={<IconKeysUnderglow />}
              color={colors[selected]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColorEditor;

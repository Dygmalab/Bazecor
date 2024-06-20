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

import React, { Component, CSSProperties } from "react";
import { ColorResult, SketchPicker } from "react-color";
import Styled from "styled-components";

// Bootstrap components
import Heading from "@Renderer/components/atoms/Heading";
import { ColorButton } from "@Renderer/component/Button";

// Icons
import { i18n } from "@Renderer/i18n";
import { IconColorPalette, IconKeysLight, IconKeysUnderglow } from "@Renderer/components/atoms/icons";
import { ColorEditorProps } from "@Renderer/types/colorEditor";
import { ColorPalette } from "@Renderer/modules/ColorEditor/ColorPalette";

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

class ColorEditor extends Component<ColorEditorProps, { displayColorPicker: boolean }> {
  constructor(props: ColorEditorProps) {
    super(props);

    this.state = {
      displayColorPicker: false,
    };

    this.showColorPicker = this.showColorPicker.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(color: ColorResult) {
    const { selected, onColorPick } = this.props;
    onColorPick(selected, color.rgb.r, color.rgb.g, color.rgb.b);
  }

  selectColor(pick: number) {
    const { selected, onColorSelect, onColorButtonSelect } = this.props;
    onColorSelect(pick);
    if (pick === selected) {
      onColorButtonSelect("one_button_click", pick);
      return;
    }
    onColorButtonSelect("another_button_click", pick);
  }

  showColorPicker() {
    this.setState(state => ({ displayColorPicker: !state.displayColorPicker }));
  }

  render() {
    const { colors, selected, toChangeAllKeysColor, deviceName } = this.props;
    const { displayColorPicker } = this.state;
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
          <ColorPalette colors={colors} selected={selected} onColorSelect={this.selectColor} />
          <div className="buttonsGroup">
            <div className="buttonEditColor">
              <ColorButton
                onClick={this.showColorPicker}
                label={i18n.editor.color.selectedColor}
                text={i18n.editor.color.editColor}
                icoSVG={<IconColorPalette />}
                color={colors[selected]}
              />
              {displayColorPicker ? (
                <div style={popover}>
                  <div style={cover} onClick={this.showColorPicker} aria-hidden="true" />
                  <SketchPicker color={colors[selected]} onChange={this.handleChange} width="240px" />
                </div>
              ) : null}
            </div>
            <div className="buttonsApplyAll">
              <ColorButton
                onClick={() => {
                  toChangeAllKeysColor(selected, 0, underglowStart);
                }}
                label={i18n.editor.color.applyColor}
                text={i18n.editor.color.allKeys}
                icoSVG={<IconKeysLight />}
                color={colors[selected]}
              />
              <ColorButton
                onClick={() => {
                  toChangeAllKeysColor(selected, underglowStart, 177);
                }}
                label={i18n.editor.color.applyColor}
                text={i18n.editor.color.underglow}
                icoSVG={<IconKeysUnderglow />}
                color={colors[selected]}
              />
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}

export default ColorEditor;

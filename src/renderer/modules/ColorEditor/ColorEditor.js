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

import React from "react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";
import Styled from "styled-components";

// Bootstrap components

// import Button from "react-bootstrap/Button";
// import Tooltip from "react-bootstrap/Tooltip";
// import OverlayTrigger from "react-bootstrap/OverlayTrigger";

// import { CgColorPicker } from "react-icons/cg";
import Title from "../../component/Title";
import { ColorButton, ColorPicker } from "../../component/Button";

// Icons
import i18n from "../../i18n";

import { IconColorPalette, IconKeysLight, IconKeysUnderglow } from "../../component/Icon";

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

.colorPallete {
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

class ColorEditor extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayColorPicker: false,
      internalColors: [...props.colors],
    };

    this.showColorPicker = this.showColorPicker.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addNewColorPalette = this.addNewColorPalette.bind(this);
  }

  componentDidMount() {
    const { colors } = this.props;
    this.cleanBlackColors([...colors]);
  }

  handleChange(color) {
    const { selected, onColorPick } = this.props;
    const { internalColors } = this.state;

    internalColors[selected] = {
      r: color.rgb.r,
      g: color.rgb.g,
      b: color.rgb.b,
      rgb: `rgb(${color.rgb.r}, ${color.rgb.g}, ${color.rgb.b})`,
    };
    onColorPick(selected, color.rgb.r, color.rgb.g, color.rgb.b);
  }

  cleanBlackColors = internalColors => {
    const localColors = JSON.parse(JSON.stringify(internalColors));

    for (let i = localColors.length - 1; i > 0; i -= 1) {
      // console.log(localColors[i], i, localColors[i].r === 0 && localColors[i].g === 0 && localColors[i].b === 0);
      if (localColors[i].r === 0 && localColors[i].g === 0 && localColors[i].b === 0) {
        localColors.pop();
        // console.log("lenght after pop: ", localColors.length);
      } else {
        // console.log("color transformation: ", internalColors, localColors);
        this.setState({ internalColors: localColors });
        return;
      }
    }
  };

  deleteColor = id => {
    const { internalColors } = this.state;
    const { updatePalette } = this.props;
    // console.log("clicked in delete color", id, internalColors.length);
    if (id >= 16) return;
    if (id === internalColors.length - 1) {
      const arrayColorPalette = [...internalColors];
      arrayColorPalette.pop();
      this.cleanBlackColors([...arrayColorPalette]);
      this.selectColor(null, arrayColorPalette.length);
      // console.log("palettev1", arrayColorPalette);
      for (let i = arrayColorPalette.length; i < 16; i += 1) {
        arrayColorPalette.push({ r: 0, g: 0, b: 0, rgb: "(0, 0, 0)" });
      }
      // console.log("palettev1", arrayColorPalette);
      updatePalette(arrayColorPalette);
      return;
    }
    const arrayColorPalette = [...internalColors];
    arrayColorPalette.splice(id, 1);
    this.cleanBlackColors([...arrayColorPalette]);
    this.selectColor(null, arrayColorPalette.length);
    // console.log("palettev2", arrayColorPalette);
    for (let i = arrayColorPalette.length; i < 16; i += 1) {
      arrayColorPalette.push({ r: 0, g: 0, b: 0, rgb: "(0, 0, 0)" });
    }
    // console.log("palettev2", arrayColorPalette);
    updatePalette(arrayColorPalette);
  };

  addNewColorPalette() {
    const { internalColors } = this.state;
    const arrayColorPalette = [...internalColors];
    arrayColorPalette.push({ r: 122, g: 121, b: 241, rgb: "(122, 121, 241)" });
    this.setState({ internalColors: arrayColorPalette });

    this.selectColor(null, internalColors.length);
    this.setState({ displayColorPicker: true });
  }

  showColorPicker() {
    this.setState(state => ({ displayColorPicker: !state.displayColorPicker }));
  }

  selectColor(ev, pick) {
    const { selected, onColorSelect, onColorButtonSelect } = this.props;
    onColorSelect(pick);
    if (pick === selected) {
      // setIndexFocusButton(!indexFocusButton);
      onColorButtonSelect("one_button_click", pick);
      return;
    }
    onColorButtonSelect("another_button_click", pick);
    // setIndexFocusButton(index);
    // setColorFocusButton(setColorTamplate(color));
  }

  render() {
    const { selected, toChangeAllKeysColor, deviceName } = this.props;
    const { displayColorPicker, internalColors } = this.state;

    const layerButtons = internalColors.map((data, idx) => {
      const menuKey = `color-${idx.toString()}-${internalColors[idx].rgb.toString()}`;
      const buttonStyle = {
        // backgroundColor: data.rgb
        backgroundColor: internalColors[idx].rgb,
      };
      return (
        // eslint-disable-next-line react/jsx-filename-extension
        <ColorPicker
          onClick={ev => {
            this.selectColor(ev, idx);
          }}
          menuKey={menuKey}
          key={`${menuKey}-key-${internalColors[idx]}`}
          id={idx}
          selected={selected}
          buttonStyle={buttonStyle}
          dataID={data.rgb}
          className="colorPicker"
          deleteColor={this.deleteColor}
        />
      );
    });

    // const iconStyles = { transform: "rotate(180deg)" };
    // CButton(text, func, icon, disable, classes) {
    //   const id = `tooltip-${text}`;

    //   return (
    //     <OverlayTrigger rootClose overlay={<Tooltip id={id}>{text}</Tooltip>} placement="top">
    //       <Button disabled={disable} onClick={func} className={classes}>
    //         {icon}
    //       </Button>
    //     </OverlayTrigger>
    //   );
    // }
    // const edit = <>{this.CButton("Edit current color", this.showColorPicker, <CgColorPicker />, false, "first colorpick")}</>;

    const popover = {
      position: "absolute",
      top: "42px",
    };
    const cover = {
      position: "fixed",
      top: "0px",
      right: "0px",
      bottom: "0px",
      left: "0px",
    };

    const underglowStart = deviceName === "Defy" ? 70 : 69;

    return (
      <Styles className="extraPanel">
        <div className="panelTitle">
          <Title text={i18n.editor.color.colorPalette} headingLevel={4} />
        </div>
        <div className="panelTools">
          <div className="colorPallete">
            {layerButtons}
            {internalColors.length < 16 ? (
              <ColorPicker
                onClick={this.addNewColorPalette}
                menuKey="menuKeyAddNewColor"
                key="buttonAddNewColor"
                className="addColorButton"
                noDelete
              />
            ) : (
              ""
            )}
          </div>
          <div className="buttonsGroup">
            <div className="buttonEditColor">
              <ColorButton
                onClick={this.showColorPicker}
                label={i18n.editor.color.selectedColor}
                text={i18n.editor.color.editColor}
                icoSVG={<IconColorPalette />}
                color={internalColors[selected]}
              />
              {displayColorPicker ? (
                <div style={popover}>
                  <div style={cover} onClick={this.showColorPicker} aria-hidden="true" />
                  <SketchPicker color={internalColors[selected]} onChange={this.handleChange} width={240} />
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
                color={internalColors[selected]}
              />
              <ColorButton
                onClick={() => {
                  toChangeAllKeysColor(selected, underglowStart, 177);
                }}
                label={i18n.editor.color.applyColor}
                text={i18n.editor.color.underglow}
                icoSVG={<IconKeysUnderglow />}
                color={internalColors[selected]}
              />
            </div>
          </div>
        </div>
      </Styles>
    );
  }
}

ColorEditor.propTypes = {
  selected: PropTypes.bool,
  toChangeAllKeysColor: PropTypes.func,
  onColorPick: PropTypes.func,
  updatePalette: PropTypes.func,
  onColorSelect: PropTypes.func,
  onColorButtonSelect: PropTypes.func,
  deviceName: PropTypes.string,
  // eslint-disable-next-line react/forbid-prop-types
  colors: PropTypes.array,
};

export default ColorEditor;

// -*- mode: js-jsx -*-
/* Bazecor -- Kaleidoscope Command Center
 * Copyright (C) 2018, 2019  Keyboardio, Inc.
 * Copyright (C) 2019  DygmaLab SE
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
import Konva from "konva";
import { Stage, Layer, Rect, Circle, Path, Group, Text } from "react-konva";
import Led from "../../hardware/Led";
import Neuron from "../../hardware/Neuron";
import Key from "../../hardware/Key";
import NewKey from "../../hardware/NewKey";
import NewKeyMotion from "../../hardware/NewKeyMotion";
import NewKeyCompressed from "../../hardware/NewKeyCompressed";
import UnderGlowStrip from "../../hardware/UnderGlowStrip";

const XX = 255;
const LEDS_LEFT_KEYS = 33;
const UNDERGLOW = 69;
const led_map = [
  // LHS                            RHS
  [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    XX,
    XX,
    6 + LEDS_LEFT_KEYS,
    5 + LEDS_LEFT_KEYS,
    4 + LEDS_LEFT_KEYS,
    3 + LEDS_LEFT_KEYS,
    2 + LEDS_LEFT_KEYS,
    1 + LEDS_LEFT_KEYS,
    0 + LEDS_LEFT_KEYS,
  ],
  [
    7,
    8,
    9,
    10,
    11,
    12,
    XX,
    XX,
    14 + LEDS_LEFT_KEYS,
    13 + LEDS_LEFT_KEYS,
    12 + LEDS_LEFT_KEYS,
    11 + LEDS_LEFT_KEYS,
    10 + LEDS_LEFT_KEYS,
    9 + LEDS_LEFT_KEYS,
    8 + LEDS_LEFT_KEYS,
    7 + LEDS_LEFT_KEYS,
  ],
  [
    13,
    14,
    15,
    16,
    17,
    18,
    XX,
    29,
    XX,
    21 + LEDS_LEFT_KEYS,
    20 + LEDS_LEFT_KEYS,
    19 + LEDS_LEFT_KEYS,
    18 + LEDS_LEFT_KEYS,
    17 + LEDS_LEFT_KEYS,
    16 + LEDS_LEFT_KEYS,
    15 + LEDS_LEFT_KEYS,
  ],
  [
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    XX,
    XX,
    XX,
    27 + LEDS_LEFT_KEYS,
    26 + LEDS_LEFT_KEYS,
    25 + LEDS_LEFT_KEYS,
    24 + LEDS_LEFT_KEYS,
    23 + LEDS_LEFT_KEYS,
    22 + LEDS_LEFT_KEYS,
  ],
  [
    26,
    27,
    28,
    29,
    30,
    XX,
    31,
    32,
    35 + LEDS_LEFT_KEYS,
    34 + LEDS_LEFT_KEYS,
    33 + LEDS_LEFT_KEYS,
    32 + LEDS_LEFT_KEYS,
    31 + LEDS_LEFT_KEYS,
    30 + LEDS_LEFT_KEYS,
    29 + LEDS_LEFT_KEYS,
    28 + LEDS_LEFT_KEYS,
  ],
];

const no_key_led_map = [...Array.apply(0, Array(63)).map((_, i) => i + UNDERGLOW)];

const keysRowsPosition = {
  row1: 20,
  row2: 102,
  row3: 169,
  row4: 236,
  row5: 303,
  row6: 370,
};

class KeymapANSI extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      underglowIndex: null,
    };
  }

  render() {
    const { underglowIndex } = this.state;
    const keymap =
      this.props.keymap ||
      Array(80)
        .fill()
        .map(() => 0);

    const getContrastText = color => {
      // return this.props.theme
      //   ? this.props.theme.palette.getContrastText(color)
      //   : null;
      const colors = color.match(/\d+/g);
      if (colors == null || colors.length == 0) return "#000";
      let aux;
      if (colors[0] < 131 && colors[1] < 131) {
        aux = "#FFF";
      } else {
        aux = "#000";
      }
      return aux;
    };
    const keyIndex = (row, col) => (col !== undefined ? row * 16 + col : row + 11);

    const getLabel = (row, col) => keymap[keyIndex(row, col)];

    const isSelected = (row, col) => {
      const selectIndex = keyIndex(row, col);
      return underglowIndex ? underglowIndex == selectIndex : this.props.selectedKey == selectIndex;
    };

    const stroke = (row, col) => (isSelected(row, col) ? (this.props.darkMode ? "#fff" : "#000") : "#b3b3b3");

    const getStrokeWidth = (row, col) => (isSelected(row, col) ? "3.0" : "1.5");

    const colormap =
      this.props.colormap ||
      Array(132)
        .fill()
        .map(() => 0);
    const palette =
      this.props.palette && this.props.palette.length > 0
        ? this.props.palette
        : Array(16)
            .fill()
            .map(() => ({
              rgb: "#ffffff",
            }));

    const getColor = (row, col) => {
      const ledIndex = col !== undefined ? led_map[parseInt(row)][parseInt(col)] : no_key_led_map[row - UNDERGLOW];
      const colorIndex = colormap[ledIndex];
      const color = palette[colorIndex].rgb;
      return color;
    };

    const getLEDIndex = (row, col) =>
      col !== undefined ? led_map[parseInt(row)][parseInt(col)] : no_key_led_map[row - UNDERGLOW];

    const onClick = e => {
      this.setState({ underglowIndex: null });

      console.log(e.target.parent.attrs);
      console.log("Click");
      this.props.onKeySelect(e);
    };
    const layer = this.props.index;

    const setUndeglowIndex = (index, e) => {
      this.setState({ underglowIndex: keyIndex(index) });
      console.log("Click");
      console.log("Index: ", index);
      console.log("e: ", e);
      this.props.onKeySelect(e);
    };
    /**
     * GetCurrentKeyElement  on keyboard
     * @props {string} x - horizontal coordinates of the button
     * @props {string} y vertical coordinates of the button
     * @props {string} dy - row spacing
     * @props {string} word - button text
     * @props {string} class - className of the button
     * @props {string} textLength length of the text if the button is small and additional text is longer then button
     */

    function GetCurrentKeyElement(props) {
      return (
        <span className={props.class} textAnchor="middle" x={props.x} y={props.y} dy={props.dy} textLength={props.textLength}>
          {props.word}{" "}
        </span>
      );
    }
    /**
     * getDivideKeys - divides words on keyboard keys
     * @param {string} str Name of key
     * @param {string} xCord Cord of the center position horisontal of each key
     * @param {string} yCord Cord of the center position vertical of each key
     * @param {boolean} smallKey if the word longer than key switch to true
     */
    const getDivideKeys = (str, xCord, yCord, smallKey = false) => {
      const numbers =
        (str.charCodeAt() >= 48 && str.charCodeAt() <= 57) ||
        (str.charCodeAt() >= 96 && str.charCodeAt() <= 105) ||
        str === "\n".charCodeAt(0);
      const interval = "1.1em";
      const longWords = str.split(" ");
      const shortWords = str.split("");
      if (numbers) {
        return (
          <GetCurrentKeyElement key={new Date() + Math.random()} x={xCord} y={String(+yCord - 5)} word={str} class="key-config" />
        );
      }
      if (str.length === 1) {
        return shortWords.map((word, index) => (
          <GetCurrentKeyElement key={index} x={xCord} y={String(+yCord - 5)} word={word} class="letter-config" />
        ));
      }
      if (str.toLowerCase().endsWith("to")) {
        return longWords.map((word, index) => (
          <span key={index}>
            <GetCurrentKeyElement x={xCord} y={String(+yCord + 9)} dy={0} word={word.slice(0, word.indexOf("to") - 1)} />
            <GetCurrentKeyElement x={String(+xCord - 5)} y={String(+yCord + 9)} dy={interval} word={word.slice(-2)} />
          </span>
        ));
      }
      if (str.length > 8 && smallKey === true && (str.startsWith("C+") || str.startsWith("A+") || str.startsWith("AGr+"))) {
        return <GetCurrentKeyElement key={new Date() + Math.random()} x={xCord} y={yCord} word={str} textLength="50" />;
      }
      if (
        longWords.length === 1 &&
        shortWords.length > 7 &&
        !str.startsWith("C+") &&
        !str.startsWith("A+") &&
        !str.startsWith("AGr+") &&
        smallKey
      ) {
        return longWords.map((word, index) => (
          <span key={index}>
            <GetCurrentKeyElement x={xCord} y={String(+yCord - 10)} word={word.slice(0, 4)} dy="0" />
            {` `}
            <GetCurrentKeyElement x={xCord} y={String(+yCord - 10)} word={word.slice(4)} dy={interval} />
          </span>
        ));
      }
      if (longWords.length === 1) {
        return longWords.map((word, index) => <GetCurrentKeyElement key={index} x={xCord} y={yCord} word={word} />);
      }
      if (longWords.length > 1 && smallKey === true) {
        return longWords.map((word, index) => (
          <GetCurrentKeyElement key={index} x={xCord} y={String(+yCord - 10)} word={word} dy={index ? interval : index} />
        ));
      }
      if (longWords.length > 1) {
        return <GetCurrentKeyElement key={new Date() + Math.random()} x={xCord} y={yCord} word={str} />;
      }
      return <GetCurrentKeyElement key={new Date() + Math.random()} x={xCord} y={yCord} word={str} />;
    };
    const topsArr = ["LEDEFF.", "SCadet", "Steno", "M.Btn", "Leader", "Numpad", "Media", "OSL", "Mouse", "M.Wheel", "M.Warp"];
    const topsArrTransfer = ["SHIFTTO", "LockTo"];
    const getCenterExtra = (row, col, xCord, yCord, smallKey = false) =>
      getLabel(row, col).extraLabel !== ""
        ? topsArr.includes(getLabel(row, col).extraLabel)
          ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord - 5, smallKey)
          : getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, String(+yCord - 5), smallKey)
        : getLabel(row, col).extraLabel === getLabel(row, col).extraLabel.toLowerCase().endsWith("to")
        ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord - 5, smallKey)
        : getLabel(row, col).extraLabel;

    const getCenterPrimary = (row, col, xCord, yCord, smallKey = false) =>
      getLabel(row, col).extraLabel !== ""
        ? topsArr.includes(getLabel(row, col).extraLabel)
          ? getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, xCord, yCord + 5, smallKey)
          : topsArrTransfer.includes(getLabel(row, col).extraLabel)
          ? getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, String(+xCord + 10), yCord + 5, smallKey)
          : getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, xCord, String(yCord + 7), smallKey)
        : topsArrTransfer.includes(getLabel(row, col).extraLabel)
        ? getLabel(row, col).label &&
          getDivideKeys(getLabel(row, col).label, xCord, yCord + 5, smallKey) &&
          getDivideKeys(getLabel(row, col).label, String(+xCord + 10), yCord + 5, smallKey)
        : getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, xCord, String(yCord + 7), smallKey);

    // console.log("Selected Key: ", this.props.selectedKey);
    // console.log("Selected LED: ", this.props.selectedLED);

    const matrixLED1 = [];
    const matrixLED2 = [];

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * 124; // Adjust spacing here
        const y = row * 24 + 480; // Adjust spacing here

        matrixLED1.push(
          <Led
            key={`matrixLED1-${row}-${col}`}
            x={x}
            y={y}
            onClick={e => {
              setUndeglowIndex(71, e);
            }}
            selectedLED={this.props.selectedLED}
            visibility={!!(this.props.showUnderglow || this.props.isStandardView)}
            clickAble={!(this.props.isStandardView && !this.props.showUnderglow)}
            fill={getColor(71)}
            stroke={stroke(71)}
            strokeWidth={getStrokeWidth(71)}
            dataLedIndex={getLEDIndex(71)}
            dataKeyIndex={keyIndex(71)}
            dataLayer={layer}
            path="M3.26816 6H74.7318C76.5838 6 78 4.7 78 3C78 1.3 76.5838 0 74.7318 0H3.26816C1.4162 0 -1.48937e-06 1.3 -1.48937e-06 3C-1.48937e-06 4.7 1.4162 6 3.26816 6Z"
          />,
        );
      }
    }

    for (let row = 0; row < 8; row++) {
      for (let col = 0; col < 4; col++) {
        const x = col * 124 + 500; // Adjust spacing here
        const y = row * 24 + 480; // Adjust spacing here

        matrixLED2.push(
          <Led
            key={`matrixLED2-${row}-${col}`}
            x={x}
            y={y}
            onClick={e => {
              setUndeglowIndex(71, e);
            }}
            selectedLED={this.props.selectedLED}
            visibility={!!(this.props.showUnderglow || this.props.isStandardView)}
            clickAble={!(this.props.isStandardView && !this.props.showUnderglow)}
            fill={getColor(71)}
            stroke={stroke(71)}
            strokeWidth={getStrokeWidth(71)}
            dataLedIndex={getLEDIndex(71)}
            dataKeyIndex={keyIndex(71)}
            dataLayer={layer}
            path="M3.26816 6H74.7318C76.5838 6 78 4.7 78 3C78 1.3 76.5838 0 74.7318 0H3.26816C1.4162 0 -1.48937e-06 1.3 -1.48937e-06 3C-1.48937e-06 4.7 1.4162 6 3.26816 6Z"
          />,
        );
      }
    }

    if (layer === null) return <>loading...</>;
    return (
      <Stage width={1200} height={680}>
        <Layer>{matrixLED1}</Layer>
        <Layer>{matrixLED2}</Layer>
        <Layer>
          {/* Row 1  */}
          <NewKeyCompressed
            key="matrixKeysCols1-0"
            keyType="regularKey"
            id="R0C0_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={0 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 0)}
            dataLedIndex={getLEDIndex(0, 0)}
            dataKeyIndex={keyIndex(0, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 0))}
            centerPrimary={getLabel(0, 0)}
            centerExtra={getCenterExtra(0, 0, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-1"
            keyType="regularKey"
            id="R0C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={1 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 1)}
            dataLedIndex={getLEDIndex(0, 1)}
            dataKeyIndex={keyIndex(0, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 1))}
            centerPrimary={getLabel(0, 1)}
            centerExtra={getCenterExtra(0, 1, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-2"
            keyType="regularKey"
            id="R0C2_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={2 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 2)}
            dataLedIndex={getLEDIndex(0, 2)}
            dataKeyIndex={keyIndex(0, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 2))}
            centerPrimary={getLabel(0, 2)}
            centerExtra={getCenterExtra(0, 2, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-3"
            keyType="regularKey"
            id="R0C3_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={3 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 3)}
            dataLedIndex={getLEDIndex(0, 3)}
            dataKeyIndex={keyIndex(0, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 3))}
            centerPrimary={getLabel(0, 3)}
            centerExtra={getCenterExtra(0, 3, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-4"
            keyType="regularKey"
            id="R0C4_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={4 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 4)}
            dataLedIndex={getLEDIndex(0, 4)}
            dataKeyIndex={keyIndex(0, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 4))}
            centerPrimary={getLabel(0, 4)}
            centerExtra={getCenterExtra(0, 4, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-5"
            keyType="regularKey"
            id="R0C5_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={5 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 5)}
            dataLedIndex={getLEDIndex(0, 5)}
            dataKeyIndex={keyIndex(0, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 5))}
            centerPrimary={getLabel(0, 5)}
            centerExtra={getCenterExtra(0, 5, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-6"
            keyType="regularKey"
            id="R0C6_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={6 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 6)}
            dataLedIndex={getLEDIndex(0, 6)}
            dataKeyIndex={keyIndex(0, 6)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 6))}
            centerPrimary={getLabel(0, 6)}
            centerExtra={getCenterExtra(0, 6, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-9"
            keyType="regularKey"
            id="R0C9_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={9 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 9)}
            dataLedIndex={getLEDIndex(0, 9)}
            dataKeyIndex={keyIndex(0, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 9))}
            centerPrimary={getLabel(0, 9)}
            centerExtra={getCenterExtra(0, 9, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-10"
            keyType="regularKey"
            id="R0C10_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={10 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 10)}
            dataLedIndex={getLEDIndex(0, 10)}
            dataKeyIndex={keyIndex(0, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 10))}
            centerPrimary={getLabel(0, 10)}
            centerExtra={getCenterExtra(0, 10, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-11"
            keyType="regularKey"
            id="R0C11_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={11 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 11)}
            dataLedIndex={getLEDIndex(0, 11)}
            dataKeyIndex={keyIndex(0, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 11))}
            centerPrimary={getLabel(0, 11)}
            centerExtra={getCenterExtra(0, 11, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-12"
            keyType="regularKey"
            id="R0C12_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={12 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 12)}
            dataLedIndex={getLEDIndex(0, 12)}
            dataKeyIndex={keyIndex(0, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 12))}
            centerPrimary={getLabel(0, 12)}
            centerExtra={getCenterExtra(0, 12, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-13"
            keyType="regularKey"
            id="R0C13_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={13 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 13)}
            dataLedIndex={getLEDIndex(0, 13)}
            dataKeyIndex={keyIndex(0, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 13))}
            centerPrimary={getLabel(0, 13)}
            centerExtra={getCenterExtra(0, 13, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-14"
            keyType="regularKey"
            id="R0C14_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={14 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 14)}
            dataLedIndex={getLEDIndex(0, 14)}
            dataKeyIndex={keyIndex(0, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 14))}
            centerPrimary={getLabel(0, 14)}
            centerExtra={getCenterExtra(0, 14, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols1-15"
            keyType="regularKey"
            id="R0C15_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={15 * 70}
            y={keysRowsPosition.row1}
            selectedKey={this.props.selectedKey}
            fill={getColor(0, 15)}
            strokeWidth={getStrokeWidth(0, 15)}
            dataLedIndex={getLEDIndex(0, 15)}
            dataKeyIndex={keyIndex(0, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 15))}
            centerPrimary={getLabel(0, 15)}
            centerExtra={getCenterExtra(0, 15, 0, 0, true)}
          />
          {/* Row 2 */}
          <NewKeyCompressed
            key="matrixKeysCols2-0"
            keyType="regularKey"
            id="R1C0_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={0 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 0)}
            dataLedIndex={getLEDIndex(1, 0)}
            dataKeyIndex={keyIndex(1, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 0))}
            centerPrimary={getLabel(1, 0)}
            centerExtra={getCenterExtra(1, 0, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-1"
            keyType="regularKey"
            id="R1C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={1 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 1)}
            dataLedIndex={getLEDIndex(1, 1)}
            dataKeyIndex={keyIndex(1, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 1))}
            centerPrimary={getLabel(1, 1)}
            centerExtra={getCenterExtra(1, 1, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-2"
            keyType="regularKey"
            id="R1C2_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={2 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 2)}
            dataLedIndex={getLEDIndex(1, 2)}
            dataKeyIndex={keyIndex(1, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 2))}
            centerPrimary={getLabel(1, 2)}
            centerExtra={getCenterExtra(1, 2, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCol2-3"
            keyType="regularKey"
            id="R1C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={3 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 3)}
            dataLedIndex={getLEDIndex(1, 3)}
            dataKeyIndex={keyIndex(1, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 3))}
            centerPrimary={getLabel(1, 3)}
            centerExtra={getCenterExtra(1, 3, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-4"
            keyType="regularKey"
            id="R1C4_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={4 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 4)}
            dataLedIndex={getLEDIndex(1, 4)}
            dataKeyIndex={keyIndex(1, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 4))}
            centerPrimary={getLabel(1, 4)}
            centerExtra={getCenterExtra(1, 4, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-5"
            keyType="regularKey"
            id="R1C4_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={5 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 5)}
            dataLedIndex={getLEDIndex(1, 5)}
            dataKeyIndex={keyIndex(1, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 5))}
            centerPrimary={getLabel(1, 5)}
            centerExtra={getCenterExtra(1, 5, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-8"
            keyType="regularKey"
            id="R1C8_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={8 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 8)}
            dataLedIndex={getLEDIndex(1, 8)}
            dataKeyIndex={keyIndex(1, 8)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 8))}
            centerPrimary={getLabel(1, 8)}
            centerExtra={getCenterExtra(1, 8, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-9"
            keyType="regularKey"
            id="R1C9_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={9 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 9)}
            dataLedIndex={getLEDIndex(1, 9)}
            dataKeyIndex={keyIndex(1, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 9))}
            centerPrimary={getLabel(1, 9)}
            centerExtra={getCenterExtra(1, 9, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-10"
            keyType="regularKey"
            id="R1C10_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={10 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 10)}
            dataLedIndex={getLEDIndex(1, 10)}
            dataKeyIndex={keyIndex(1, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 10))}
            centerPrimary={getLabel(1, 10)}
            centerExtra={getCenterExtra(1, 10, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-11"
            keyType="regularKey"
            id="R1C11_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={11 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 11)}
            dataLedIndex={getLEDIndex(1, 11)}
            dataKeyIndex={keyIndex(1, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 11))}
            centerPrimary={getLabel(1, 11)}
            centerExtra={getCenterExtra(1, 11, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-12"
            keyType="regularKey"
            id="R1C12_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={12 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 12)}
            dataLedIndex={getLEDIndex(1, 12)}
            dataKeyIndex={keyIndex(1, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 12))}
            centerPrimary={getLabel(1, 12)}
            centerExtra={getCenterExtra(1, 12, 0, 0, true)}
          />
        </Layer>
        <Layer>
          <NewKeyCompressed
            key="matrixKeysCols2-13"
            keyType="regularKey"
            id="R1C13_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={13 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 13)}
            dataLedIndex={getLEDIndex(1, 13)}
            dataKeyIndex={keyIndex(1, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 13))}
            centerPrimary={getLabel(1, 13)}
            centerExtra={getCenterExtra(1, 13, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-14"
            keyType="regularKey"
            id="R1C14_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={14 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(1, 14)}
            dataLedIndex={getLEDIndex(1, 14)}
            dataKeyIndex={keyIndex(1, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 14))}
            centerPrimary={getLabel(1, 14)}
            centerExtra={getCenterExtra(1, 14, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols2-15"
            keyType="regularKey"
            id="R1C15_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={15 * 70}
            y={keysRowsPosition.row2}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 15)}
            dataLedIndex={getLEDIndex(2, 15)}
            dataKeyIndex={keyIndex(2, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 15))}
            centerPrimary={getLabel(2, 15)}
            centerExtra={getCenterExtra(2, 15, 0, 0, true)}
          />
          {/* Row 3 */}
          <NewKeyCompressed
            key="matrixKeysCols3-0"
            keyType="regularKey"
            id="R2C0_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={0 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 0)}
            dataLedIndex={getLEDIndex(2, 0)}
            dataKeyIndex={keyIndex(2, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 0))}
            centerPrimary={getLabel(2, 0)}
            centerExtra={getCenterExtra(2, 0, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-1"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={1 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 1)}
            dataLedIndex={getLEDIndex(2, 1)}
            dataKeyIndex={keyIndex(2, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 1))}
            centerPrimary={getLabel(2, 1)}
            centerExtra={getCenterExtra(2, 1, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-2"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={2 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 2)}
            dataLedIndex={getLEDIndex(2, 2)}
            dataKeyIndex={keyIndex(2, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 2))}
            centerPrimary={getLabel(2, 2)}
            centerExtra={getCenterExtra(2, 2, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-3"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={3 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 3)}
            dataLedIndex={getLEDIndex(2, 3)}
            dataKeyIndex={keyIndex(2, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 3))}
            centerPrimary={getLabel(2, 3)}
            centerExtra={getCenterExtra(2, 3, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-4"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={4 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 4)}
            dataLedIndex={getLEDIndex(2, 4)}
            dataKeyIndex={keyIndex(2, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 4))}
            centerPrimary={getLabel(2, 4)}
            centerExtra={getCenterExtra(2, 4, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-5"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={5 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 4)}
            dataLedIndex={getLEDIndex(2, 5)}
            dataKeyIndex={keyIndex(2, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 5))}
            centerPrimary={getLabel(2, 5)}
            centerExtra={getCenterExtra(2, 5, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-6"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={6 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 9)}
            dataLedIndex={getLEDIndex(2, 9)}
            dataKeyIndex={keyIndex(2, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 9))}
            centerPrimary={getLabel(2, 9)}
            centerExtra={getCenterExtra(2, 9, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-7"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={7 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 10)}
            dataLedIndex={getLEDIndex(2, 10)}
            dataKeyIndex={keyIndex(2, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 10))}
            centerPrimary={getLabel(2, 10)}
            centerExtra={getCenterExtra(2, 10, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-8"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={8 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 11)}
            dataLedIndex={getLEDIndex(2, 11)}
            dataKeyIndex={keyIndex(2, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 11))}
            centerPrimary={getLabel(2, 11)}
            centerExtra={getCenterExtra(2, 11, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-9"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={9 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 12)}
            dataLedIndex={getLEDIndex(2, 12)}
            dataKeyIndex={keyIndex(2, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 12))}
            centerPrimary={getLabel(2, 12)}
            centerExtra={getCenterExtra(2, 12, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-10"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={10 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 13)}
            dataLedIndex={getLEDIndex(2, 13)}
            dataKeyIndex={keyIndex(2, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 13))}
            centerPrimary={getLabel(2, 13)}
            centerExtra={getCenterExtra(2, 13, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-11"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={11 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 14)}
            dataLedIndex={getLEDIndex(2, 14)}
            dataKeyIndex={keyIndex(2, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 14))}
            centerPrimary={getLabel(2, 14)}
            centerExtra={getCenterExtra(2, 14, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols3-12"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={12 * 70}
            y={keysRowsPosition.row3}
            selectedKey={this.props.selectedKey}
            fill={getColor(2, 15)}
            dataLedIndex={getLEDIndex(2, 15)}
            dataKeyIndex={keyIndex(2, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 15))}
            centerPrimary={getLabel(2, 15)}
            centerExtra={getCenterExtra(2, 15, 0, 0, true)}
          />
          {/* Row 4 */}
          <NewKeyCompressed
            key="matrixKeysCols4-0"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={0 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 0)}
            dataLedIndex={getLEDIndex(3, 0)}
            dataKeyIndex={keyIndex(3, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 0))}
            centerPrimary={getLabel(3, 0)}
            centerExtra={getCenterExtra(3, 0, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-1"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={1 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 2)}
            dataLedIndex={getLEDIndex(3, 2)}
            dataKeyIndex={keyIndex(3, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 2))}
            centerPrimary={getLabel(3, 2)}
            centerExtra={getCenterExtra(3, 2, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-2"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={2 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 3)}
            dataLedIndex={getLEDIndex(3, 3)}
            dataKeyIndex={keyIndex(3, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 3))}
            centerPrimary={getLabel(3, 3)}
            centerExtra={getCenterExtra(3, 3, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-3"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={3 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 4)}
            dataLedIndex={getLEDIndex(3, 4)}
            dataKeyIndex={keyIndex(3, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 4))}
            centerPrimary={getLabel(3, 4)}
            centerExtra={getCenterExtra(3, 4, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-4"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={4 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 5)}
            dataLedIndex={getLEDIndex(3, 5)}
            dataKeyIndex={keyIndex(3, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 5))}
            centerPrimary={getLabel(3, 5)}
            centerExtra={getCenterExtra(3, 5, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-5"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={5 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 6)}
            dataLedIndex={getLEDIndex(3, 6)}
            dataKeyIndex={keyIndex(3, 6)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 6))}
            centerPrimary={getLabel(3, 6)}
            centerExtra={getCenterExtra(3, 6, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-6"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={6 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 10)}
            dataLedIndex={getLEDIndex(3, 10)}
            dataKeyIndex={keyIndex(3, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 10))}
            centerPrimary={getLabel(3, 10)}
            centerExtra={getCenterExtra(3, 10, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-7"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={7 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 11)}
            dataLedIndex={getLEDIndex(3, 11)}
            dataKeyIndex={keyIndex(3, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 11))}
            centerPrimary={getLabel(3, 11)}
            centerExtra={getCenterExtra(3, 11, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-8"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={7 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 12)}
            dataLedIndex={getLEDIndex(3, 12)}
            dataKeyIndex={keyIndex(3, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 12))}
            centerPrimary={getLabel(3, 12)}
            centerExtra={getCenterExtra(3, 12, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-9"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={8 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 13)}
            dataLedIndex={getLEDIndex(3, 13)}
            dataKeyIndex={keyIndex(3, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 13))}
            centerPrimary={getLabel(3, 13)}
            centerExtra={getCenterExtra(3, 13, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-10"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={9 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 14)}
            dataLedIndex={getLEDIndex(3, 14)}
            dataKeyIndex={keyIndex(3, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 14))}
            centerPrimary={getLabel(3, 14)}
            centerExtra={getCenterExtra(3, 14, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols4-11"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={10 * 70}
            y={keysRowsPosition.row4}
            selectedKey={this.props.selectedKey}
            fill={getColor(3, 15)}
            dataLedIndex={getLEDIndex(3, 15)}
            dataKeyIndex={keyIndex(3, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 15))}
            centerPrimary={getLabel(3, 15)}
            centerExtra={getCenterExtra(3, 15, 0, 0, true)}
          />
          {/* Row 5 */}
          <NewKeyCompressed
            key="matrixKeysCols5-0"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={0 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 0)}
            dataLedIndex={getLEDIndex(4, 0)}
            dataKeyIndex={keyIndex(4, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 0))}
            centerPrimary={getLabel(4, 0)}
            centerExtra={getCenterExtra(4, 0, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-1"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={1 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 1)}
            dataLedIndex={getLEDIndex(4, 1)}
            dataKeyIndex={keyIndex(4, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 1))}
            centerPrimary={getLabel(4, 1)}
            centerExtra={getCenterExtra(4, 1, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-2"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={2 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 2)}
            dataLedIndex={getLEDIndex(4, 2)}
            dataKeyIndex={keyIndex(4, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 2))}
            centerPrimary={getLabel(4, 2)}
            centerExtra={getCenterExtra(4, 2, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-3"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={3 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 3)}
            dataLedIndex={getLEDIndex(4, 3)}
            dataKeyIndex={keyIndex(4, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 3))}
            centerPrimary={getLabel(4, 3)}
            centerExtra={getCenterExtra(4, 3, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-4"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={4 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 4)}
            dataLedIndex={getLEDIndex(4, 4)}
            dataKeyIndex={keyIndex(4, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 4))}
            centerPrimary={getLabel(4, 4)}
            centerExtra={getCenterExtra(4, 4, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-5"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={5 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 10)}
            dataLedIndex={getLEDIndex(4, 10)}
            dataKeyIndex={keyIndex(4, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 10))}
            centerPrimary={getLabel(4, 10)}
            centerExtra={getCenterExtra(4, 10, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-6"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={6 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 11)}
            dataLedIndex={getLEDIndex(4, 11)}
            dataKeyIndex={keyIndex(4, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 11))}
            centerPrimary={getLabel(4, 11)}
            centerExtra={getCenterExtra(4, 11, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-7"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={7 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 12)}
            dataLedIndex={getLEDIndex(4, 12)}
            dataKeyIndex={keyIndex(4, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 12))}
            centerPrimary={getLabel(4, 12)}
            centerExtra={getCenterExtra(4, 12, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-8"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={8 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 13)}
            dataLedIndex={getLEDIndex(4, 13)}
            dataKeyIndex={keyIndex(4, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 13))}
            centerPrimary={getLabel(4, 13)}
            centerExtra={getCenterExtra(4, 13, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-9"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={9 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 14)}
            dataLedIndex={getLEDIndex(4, 14)}
            dataKeyIndex={keyIndex(4, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 14))}
            centerPrimary={getLabel(4, 14)}
            centerExtra={getCenterExtra(4, 14, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols5-10"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={10 * 70}
            y={keysRowsPosition.row5}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 15)}
            dataLedIndex={getLEDIndex(4, 15)}
            dataKeyIndex={keyIndex(4, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 15))}
            centerPrimary={getLabel(4, 15)}
            centerExtra={getCenterExtra(4, 15, 0, 0, true)}
          />
          {/* Row 6 */}
          <NewKeyCompressed
            key="matrixKeysCols6-0"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={0 * 70}
            y={keysRowsPosition.row6}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 6)}
            dataLedIndex={getLEDIndex(4, 6)}
            dataKeyIndex={keyIndex(4, 6)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 6))}
            centerPrimary={getLabel(4, 6)}
            centerExtra={getCenterExtra(4, 6, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols6-1"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={1 * 70}
            y={keysRowsPosition.row6}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 7)}
            dataLedIndex={getLEDIndex(4, 7)}
            dataKeyIndex={keyIndex(4, 7)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 7))}
            centerPrimary={getLabel(4, 7)}
            centerExtra={getCenterExtra(4, 7, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols6-2"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={2 * 70}
            y={keysRowsPosition.row6}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 8)}
            dataLedIndex={getLEDIndex(4, 8)}
            dataKeyIndex={keyIndex(4, 8)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 8))}
            centerPrimary={getLabel(4, 8)}
            centerExtra={getCenterExtra(4, 8, 0, 0, true)}
          />
          <NewKeyCompressed
            key="matrixKeysCols6-3"
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={55}
            height={55}
            x={3 * 70}
            y={keysRowsPosition.row6}
            selectedKey={this.props.selectedKey}
            fill={getColor(4, 9)}
            dataLedIndex={getLEDIndex(4, 9)}
            dataKeyIndex={keyIndex(4, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 9))}
            centerPrimary={getLabel(4, 9)}
            centerExtra={getCenterExtra(4, 9, 0, 0, true)}
          />
        </Layer>
      </Stage>
    );
  }
}

export default KeymapANSI;

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
import Neuron from "../../hardware/Neuron";
import Key from "../../hardware/Key";
import UnderGlowStrip from "../../hardware/UnderGlowStrip";

const XX = 255;
const LEDS_LEFT_KEYS = 33;
const LEDS_RIGHT_KEYS = 36;
const UNDERGLOW = 77;
const LedMap = [
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
    31,
    32,
    XX,
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

const NoKeyLedMap = [...Array.apply(0, Array(UNDERGLOW)).map((_, i) => i + LEDS_LEFT_KEYS + LEDS_RIGHT_KEYS)];

const keysRowsPosition = {
  row1: 35,
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
    const { showUnderglow, isStandardView, className, selectedLED, selectedKey } = this.props;
    const keymap =
      this.props.keymap ||
      Array(80)
        .fill()
        .map(() => 0);

    const getContrastText = color => {
      // return this.props.theme
      //   ? this.pros.theme.palette.getContrastText(color)
      //   : null;
      const colors = color.match(/\d+/g);
      if (colors == null || colors.length === 0) return "#000";
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
      return underglowIndex ? underglowIndex === selectIndex : selectedKey === selectIndex;
    };

    const stroke = (row, col) => (isSelected(row, col) ? (this.props.darkMode ? "#fff" : "#000") : "#b3b3b3");

    const getStrokeWidth = (row, col) => (isSelected(row, col) ? "3.0" : "1.5");

    const colormap =
      this.props.colormap ||
      Array(144)
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
      const ledIndex =
        col !== undefined ? LedMap[parseInt(row)][parseInt(col)] : NoKeyLedMap[row - LEDS_LEFT_KEYS - LEDS_RIGHT_KEYS];
      const colorIndex = colormap[ledIndex];
      const color = palette[colorIndex].rgb;
      return color;
    };

    const getLEDIndex = (row, col) =>
      col !== undefined ? LedMap[parseInt(row)][parseInt(col)] : NoKeyLedMap[row - LEDS_LEFT_KEYS - LEDS_RIGHT_KEYS];

    const onClick = e => {
      this.setState({ underglowIndex: null });
      this.props.onKeySelect(e);
    };
    const layer = this.props.index;

    const setUndeglowIndex = (index, e) => {
      this.setState({ underglowIndex: keyIndex(index) });
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
      if (React.isValidElement(str)) return str;
      if (typeof str !== "string") return "";

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
      React.isValidElement(getLabel(row, col).extraLabel)
        ? getLabel(row, col).extraLabel
        : getLabel(row, col).extraLabel?.includes("+")
          ? ""
          : getLabel(row, col).extraLabel;
    // const getCenterExtra = (row, col, xCord, yCord, smallKey = false) =>
    //   getLabel(row, col).extraLabel !== ""
    //     ? topsArr.includes(getLabel(row, col).extraLabel)
    //       ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord - 5, smallKey)
    //       : getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, String(+yCord - 5), smallKey)
    //     : getLabel(row, col).extraLabel === getLabel(row, col).extraLabel.toLowerCase().endsWith("to")
    //       ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord - 5, smallKey)
    //       : getLabel(row, col).extraLabel;

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

    // console.log("Selected Key: ", selectedKey);
    // console.log("Selected LED: ", selectedLED);
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeMiterlimit="1.5"
        clipRule="evenodd"
        viewBox={showUnderglow || isStandardView ? "0 0 1222 705" : "0 0 1222 430"}
        className={className || "layer"}
        height={showUnderglow || isStandardView ? 705 : 480}
        width={1222}
      >
        <g id="keyshapes">
          <Key
            keyType="regularKey"
            id="R0C0_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={84}
            y={keysRowsPosition.row1}
            fill={getColor(0, 0)}
            stroke={stroke(0, 0)}
            strokeWidth={getStrokeWidth(0, 0)}
            dataLedIndex={getLEDIndex(0, 0)}
            dataKeyIndex={keyIndex(0, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 0))}
            centerPrimary={getCenterPrimary(0, 0, 0, 0, true)}
            centerExtra={getCenterExtra(0, 0, 0, 0, true)}
            keyCode={getLabel(0, 0).keyCode}
            selectedKey={getLabel(0, 0)}
          />
          <Key
            keyType="regularKey"
            id="R0C1_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={151}
            y={keysRowsPosition.row1}
            fill={getColor(0, 1)}
            stroke={stroke(0, 1)}
            strokeWidth={getStrokeWidth(0, 1)}
            dataLedIndex={getLEDIndex(0, 1)}
            dataKeyIndex={keyIndex(0, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 1))}
            centerPrimary={getCenterPrimary(0, 1, 0, 0, true)}
            centerExtra={getCenterExtra(0, 1, 0, 0, true)}
            keyCode={getLabel(0, 1).keyCode}
            selectedKey={getLabel(0, 1)}
          />
          <Key
            keyType="regularKey"
            id="R0C2_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={218}
            y={keysRowsPosition.row1}
            fill={getColor(0, 2)}
            stroke={stroke(0, 2)}
            strokeWidth={getStrokeWidth(0, 2)}
            dataLedIndex={getLEDIndex(0, 2)}
            dataKeyIndex={keyIndex(0, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 2))}
            centerPrimary={getCenterPrimary(0, 2, 0, 0, true)}
            centerExtra={getCenterExtra(0, 2, 0, 0, true)}
            keyCode={getLabel(0, 2).keyCode}
            selectedKey={getLabel(0, 2)}
          />
          <Key
            keyType="regularKey"
            id="R0C3_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={285}
            y={keysRowsPosition.row1}
            fill={getColor(0, 3)}
            stroke={stroke(0, 3)}
            strokeWidth={getStrokeWidth(0, 3)}
            dataLedIndex={getLEDIndex(0, 3)}
            dataKeyIndex={keyIndex(0, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 3))}
            centerPrimary={getCenterPrimary(0, 3, 0, 0, true)}
            centerExtra={getCenterExtra(0, 3, 0, 0, true)}
            keyCode={getLabel(0, 3).keyCode}
            selectedKey={getLabel(0, 3)}
          />
          <Key
            keyType="regularKey"
            id="R0C4_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={352}
            y={keysRowsPosition.row1}
            fill={getColor(0, 4)}
            stroke={stroke(0, 4)}
            strokeWidth={getStrokeWidth(0, 4)}
            dataLedIndex={getLEDIndex(0, 4)}
            dataKeyIndex={keyIndex(0, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 4))}
            centerPrimary={getCenterPrimary(0, 4, 0, 0, true)}
            centerExtra={getCenterExtra(0, 4, 0, 0, true)}
            keyCode={getLabel(0, 4).keyCode}
            selectedKey={getLabel(0, 4)}
          />
          <Key
            keyType="regularKey"
            id="R0C5_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={419}
            y={keysRowsPosition.row1}
            fill={getColor(0, 5)}
            stroke={stroke(0, 5)}
            strokeWidth={getStrokeWidth(0, 5)}
            dataLedIndex={getLEDIndex(0, 5)}
            dataKeyIndex={keyIndex(0, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 5))}
            centerPrimary={getCenterPrimary(0, 5, 0, 0, true)}
            centerExtra={getCenterExtra(0, 5, 0, 0, true)}
            keyCode={getLabel(0, 5).keyCode}
            selectedKey={getLabel(0, 5)}
          />
          <Key
            keyType="regularKey"
            id="R0C6_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={486}
            y={keysRowsPosition.row1}
            fill={getColor(0, 6)}
            stroke={stroke(0, 6)}
            strokeWidth={getStrokeWidth(0, 6)}
            dataLedIndex={getLEDIndex(0, 6)}
            dataKeyIndex={keyIndex(0, 6)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 6))}
            centerPrimary={getCenterPrimary(0, 6, 0, 0, true)}
            centerExtra={getCenterExtra(0, 6, 0, 0, true)}
            keyCode={getLabel(0, 6).keyCode}
            selectedKey={getLabel(0, 6)}
          />
          <Key
            keyType="regularKey"
            id="R0C9_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={624}
            y={keysRowsPosition.row1}
            fill={getColor(0, 9)}
            stroke={stroke(0, 9)}
            strokeWidth={getStrokeWidth(0, 9)}
            dataLedIndex={getLEDIndex(0, 9)}
            dataKeyIndex={keyIndex(0, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 9))}
            centerPrimary={getCenterPrimary(0, 9, 0, 0, true)}
            centerExtra={getCenterExtra(0, 9, 0, 0, true)}
            keyCode={getLabel(0, 9).keyCode}
            selectedKey={getLabel(0, 9)}
          />
          <Key
            keyType="regularKey"
            id="R0C10_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={691}
            y={keysRowsPosition.row1}
            fill={getColor(0, 10)}
            stroke={stroke(0, 10)}
            strokeWidth={getStrokeWidth(0, 10)}
            dataLedIndex={getLEDIndex(0, 10)}
            dataKeyIndex={keyIndex(0, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 10))}
            centerPrimary={getCenterPrimary(0, 10, 0, 0, true)}
            centerExtra={getCenterExtra(0, 10, 0, 0, true)}
            keyCode={getLabel(0, 10).keyCode}
            selectedKey={getLabel(0, 10)}
          />
          <Key
            keyType="regularKey"
            id="R0C11_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={758}
            y={keysRowsPosition.row1}
            fill={getColor(0, 11)}
            stroke={stroke(0, 11)}
            strokeWidth={getStrokeWidth(0, 11)}
            dataLedIndex={getLEDIndex(0, 11)}
            dataKeyIndex={keyIndex(0, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 11))}
            centerPrimary={getCenterPrimary(0, 11, 0, 0, true)}
            centerExtra={getCenterExtra(0, 11, 0, 0, true)}
            keyCode={getLabel(0, 11).keyCode}
            selectedKey={getLabel(0, 11)}
          />
          <Key
            keyType="regularKey"
            id="R0C12_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={825}
            y={keysRowsPosition.row1}
            fill={getColor(0, 12)}
            stroke={stroke(0, 12)}
            strokeWidth={getStrokeWidth(0, 12)}
            dataLedIndex={getLEDIndex(0, 12)}
            dataKeyIndex={keyIndex(0, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 12))}
            centerPrimary={getCenterPrimary(0, 12, 0, 0, true)}
            centerExtra={getCenterExtra(0, 12, 0, 0, true)}
            keyCode={getLabel(0, 12).keyCode}
            selectedKey={getLabel(0, 12)}
          />
          <Key
            keyType="regularKey"
            id="R0C13_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={892}
            y={keysRowsPosition.row1}
            fill={getColor(0, 13)}
            stroke={stroke(0, 13)}
            strokeWidth={getStrokeWidth(0, 13)}
            dataLedIndex={getLEDIndex(0, 13)}
            dataKeyIndex={keyIndex(0, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 13))}
            centerPrimary={getCenterPrimary(0, 13, 0, 0, true)}
            centerExtra={getCenterExtra(0, 13, 0, 0, true)}
            keyCode={getLabel(0, 13).keyCode}
            selectedKey={getLabel(0, 13)}
          />
          <Key
            keyType="regularKey"
            id="R0C14_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={959}
            y={keysRowsPosition.row1}
            fill={getColor(0, 14)}
            stroke={stroke(0, 14)}
            strokeWidth={getStrokeWidth(0, 14)}
            dataLedIndex={getLEDIndex(0, 14)}
            dataKeyIndex={keyIndex(0, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 14))}
            centerPrimary={getCenterPrimary(0, 14, 0, 0, true)}
            centerExtra={getCenterExtra(0, 14, 0, 0, true)}
            keyCode={getLabel(0, 14).keyCode}
            selectedKey={getLabel(0, 14)}
          />
          <Key
            keyType="regularKey"
            id="R0C15_keyshape"
            onClick={onClick}
            className="key"
            width={112}
            height={57}
            x={1026}
            y={keysRowsPosition.row1}
            fill={getColor(0, 15)}
            stroke={stroke(0, 15)}
            strokeWidth={getStrokeWidth(0, 15)}
            dataLedIndex={getLEDIndex(0, 15)}
            dataKeyIndex={keyIndex(0, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(0, 15))}
            centerPrimary={getCenterPrimary(0, 15, 0, 0, true)}
            centerExtra={getCenterExtra(0, 15, 0, 0, true)}
            keyCode={getLabel(0, 15).keyCode}
            selectedKey={getLabel(0, 15)}
          />
          <Key
            keyType="regularKey"
            id="R1C0_keyshape"
            onClick={onClick}
            className="key"
            width={94}
            height={57}
            x={84}
            y={keysRowsPosition.row2}
            fill={getColor(1, 0)}
            stroke={stroke(1, 0)}
            strokeWidth={getStrokeWidth(1, 0)}
            dataLedIndex={getLEDIndex(1, 0)}
            dataKeyIndex={keyIndex(1, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 0))}
            centerPrimary={getCenterPrimary(1, 0, 0, 0, true)}
            centerExtra={getCenterExtra(1, 0, 0, 0, true)}
            keyCode={getLabel(1, 0).keyCode}
            selectedKey={getLabel(1, 0)}
          />
          <Key
            keyType="regularKey"
            id="R1C1_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={188}
            y={keysRowsPosition.row2}
            fill={getColor(1, 1)}
            stroke={stroke(1, 1)}
            strokeWidth={getStrokeWidth(1, 1)}
            dataLedIndex={getLEDIndex(1, 1)}
            dataKeyIndex={keyIndex(1, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 1))}
            centerPrimary={getCenterPrimary(1, 1, 0, 0, true)}
            centerExtra={getCenterExtra(1, 1, 0, 0, true)}
            keyCode={getLabel(1, 1).keyCode}
            selectedKey={getLabel(1, 1)}
          />
          <Key
            keyType="regularKey"
            id="R1C2_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={255}
            y={keysRowsPosition.row2}
            fill={getColor(1, 2)}
            stroke={stroke(1, 2)}
            strokeWidth={getStrokeWidth(1, 2)}
            dataLedIndex={getLEDIndex(1, 2)}
            dataKeyIndex={keyIndex(1, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 2))}
            centerPrimary={getCenterPrimary(1, 2, 0, 0, true)}
            centerExtra={getCenterExtra(1, 2, 0, 0, true)}
            keyCode={getLabel(1, 2).keyCode}
            selectedKey={getLabel(1, 2)}
          />
          <Key
            keyType="regularKey"
            id="R1C3_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={322}
            y={keysRowsPosition.row2}
            fill={getColor(1, 3)}
            stroke={stroke(1, 3)}
            strokeWidth={getStrokeWidth(1, 3)}
            dataLedIndex={getLEDIndex(1, 3)}
            dataKeyIndex={keyIndex(1, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 3))}
            centerPrimary={getCenterPrimary(1, 3, 0, 0, true)}
            centerExtra={getCenterExtra(1, 3, 0, 0, true)}
            keyCode={getLabel(1, 3).keyCode}
            selectedKey={getLabel(1, 3)}
          />
          <Key
            keyType="regularKey"
            id="R1C4_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={389}
            y={keysRowsPosition.row2}
            fill={getColor(1, 4)}
            stroke={stroke(1, 4)}
            strokeWidth={getStrokeWidth(1, 4)}
            dataLedIndex={getLEDIndex(1, 4)}
            dataKeyIndex={keyIndex(1, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 4))}
            centerPrimary={getCenterPrimary(1, 4, 0, 0, true)}
            centerExtra={getCenterExtra(1, 4, 0, 0, true)}
            keyCode={getLabel(1, 4).keyCode}
            selectedKey={getLabel(1, 4)}
          />
          <Key
            keyType="regularKey"
            id="R1C5_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={456}
            y={keysRowsPosition.row2}
            fill={getColor(1, 5)}
            stroke={stroke(1, 5)}
            strokeWidth={getStrokeWidth(1, 5)}
            dataLedIndex={getLEDIndex(1, 5)}
            dataKeyIndex={keyIndex(1, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 5))}
            centerPrimary={getCenterPrimary(1, 5, 0, 0, true)}
            centerExtra={getCenterExtra(1, 5, 0, 0, true)}
            keyCode={getLabel(1, 5).keyCode}
            selectedKey={getLabel(1, 5)}
          />
          <Key
            keyType="regularKey"
            id="R1C8_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={600}
            y={keysRowsPosition.row2}
            fill={getColor(1, 8)}
            stroke={stroke(1, 8)}
            strokeWidth={getStrokeWidth(1, 8)}
            dataLedIndex={getLEDIndex(1, 8)}
            dataKeyIndex={keyIndex(1, 8)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 8))}
            centerPrimary={getCenterPrimary(1, 8, 0, 0, true)}
            centerExtra={getCenterExtra(1, 8, 0, 0, true)}
            keyCode={getLabel(1, 8).keyCode}
            selectedKey={getLabel(1, 8)}
          />
          <Key
            keyType="regularKey"
            id="R1C9_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={667}
            y={keysRowsPosition.row2}
            fill={getColor(1, 9)}
            stroke={stroke(1, 9)}
            strokeWidth={getStrokeWidth(1, 9)}
            dataLedIndex={getLEDIndex(1, 9)}
            dataKeyIndex={keyIndex(1, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 9))}
            centerPrimary={getCenterPrimary(1, 9, 0, 0, true)}
            centerExtra={getCenterExtra(1, 9, 0, 0, true)}
            keyCode={getLabel(1, 9).keyCode}
            selectedKey={getLabel(1, 9)}
          />
          <Key
            keyType="regularKey"
            id="R1C10_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={734}
            y={keysRowsPosition.row2}
            fill={getColor(1, 10)}
            stroke={stroke(1, 10)}
            strokeWidth={getStrokeWidth(1, 10)}
            dataLedIndex={getLEDIndex(1, 10)}
            dataKeyIndex={keyIndex(1, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 10))}
            centerPrimary={getCenterPrimary(1, 10, 0, 0, true)}
            centerExtra={getCenterExtra(1, 10, 0, 0, true)}
            keyCode={getLabel(1, 10).keyCode}
            selectedKey={getLabel(1, 10)}
          />
          <Key
            keyType="regularKey"
            id="R1C11_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={801}
            y={keysRowsPosition.row2}
            fill={getColor(1, 11)}
            stroke={stroke(1, 11)}
            strokeWidth={getStrokeWidth(1, 11)}
            dataLedIndex={getLEDIndex(1, 11)}
            dataKeyIndex={keyIndex(1, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 11))}
            centerPrimary={getCenterPrimary(1, 11, 0, 0, true)}
            centerExtra={getCenterExtra(1, 11, 0, 0, true)}
            keyCode={getLabel(1, 11).keyCode}
            selectedKey={getLabel(1, 11)}
          />
          <Key
            keyType="regularKey"
            id="R1C12_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={868}
            y={keysRowsPosition.row2}
            fill={getColor(1, 12)}
            stroke={stroke(1, 12)}
            strokeWidth={getStrokeWidth(1, 12)}
            dataLedIndex={getLEDIndex(1, 12)}
            dataKeyIndex={keyIndex(1, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 12))}
            centerPrimary={getCenterPrimary(1, 12, 0, 0, true)}
            centerExtra={getCenterExtra(1, 12, 0, 0, true)}
            keyCode={getLabel(1, 12).keyCode}
            selectedKey={getLabel(1, 12)}
          />
          <Key
            keyType="regularKey"
            id="R1C13_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={935}
            y={keysRowsPosition.row2}
            fill={getColor(1, 13)}
            stroke={stroke(1, 13)}
            strokeWidth={getStrokeWidth(1, 13)}
            dataLedIndex={getLEDIndex(1, 13)}
            dataKeyIndex={keyIndex(1, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 13))}
            centerPrimary={getCenterPrimary(1, 13, 0, 0, true)}
            centerExtra={getCenterExtra(1, 13, 0, 0, true)}
            keyCode={getLabel(1, 13).keyCode}
            selectedKey={getLabel(1, 13)}
          />
          <Key
            keyType="regularKey"
            id="R1C14_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={1002}
            y={keysRowsPosition.row2}
            fill={getColor(1, 14)}
            stroke={stroke(1, 14)}
            strokeWidth={getStrokeWidth(1, 14)}
            dataLedIndex={getLEDIndex(1, 14)}
            dataKeyIndex={keyIndex(1, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 14))}
            centerPrimary={getCenterPrimary(1, 14, 0, 0, true)}
            centerExtra={getCenterExtra(1, 14, 0, 0, true)}
            keyCode={getLabel(1, 14).keyCode}
            selectedKey={getLabel(1, 14)}
          />
          <Key
            keyType="regularKey"
            id="R1C15_keyshape"
            onClick={onClick}
            className="key"
            width={69}
            height={57}
            x={1069}
            y={keysRowsPosition.row2}
            fill={getColor(1, 15)}
            stroke={stroke(1, 15)}
            strokeWidth={getStrokeWidth(1, 15)}
            dataLedIndex={getLEDIndex(1, 15)}
            dataKeyIndex={keyIndex(1, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(1, 15))}
            centerPrimary={getCenterPrimary(1, 15, 0, 0, true)}
            centerExtra={getCenterExtra(1, 15, 0, 0, true)}
            keyCode={getLabel(1, 15).keyCode}
            selectedKey={getLabel(1, 15)}
          />
          <Key
            keyType="regularKey"
            id="R2C0_keyshape"
            onClick={onClick}
            className="key"
            width={112}
            height={57}
            x={84}
            y={keysRowsPosition.row3}
            fill={getColor(2, 0)}
            stroke={stroke(2, 0)}
            strokeWidth={getStrokeWidth(2, 0)}
            dataLedIndex={getLEDIndex(2, 0)}
            dataKeyIndex={keyIndex(2, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 0))}
            centerPrimary={getCenterPrimary(2, 0, 0, 0, true)}
            centerExtra={getCenterExtra(2, 0, 0, 0, true)}
            keyCode={getLabel(2, 0).keyCode}
            selectedKey={getLabel(2, 0)}
          />
          <Key
            keyType="regularKey"
            id="R2C1_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={206}
            y={keysRowsPosition.row3}
            fill={getColor(2, 1)}
            stroke={stroke(2, 1)}
            strokeWidth={getStrokeWidth(2, 1)}
            dataLedIndex={getLEDIndex(2, 1)}
            dataKeyIndex={keyIndex(2, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 1))}
            centerPrimary={getCenterPrimary(2, 1, 0, 0, true)}
            centerExtra={getCenterExtra(2, 1, 0, 0, true)}
            keyCode={getLabel(2, 1).keyCode}
            selectedKey={getLabel(2, 1)}
          />
          <Key
            keyType="regularKey"
            id="R2C2_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={273}
            y={keysRowsPosition.row3}
            fill={getColor(2, 2)}
            stroke={stroke(2, 2)}
            strokeWidth={getStrokeWidth(2, 2)}
            dataLedIndex={getLEDIndex(2, 2)}
            dataKeyIndex={keyIndex(2, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 2))}
            centerPrimary={getCenterPrimary(2, 2, 0, 0, true)}
            centerExtra={getCenterExtra(2, 2, 0, 0, true)}
            keyCode={getLabel(2, 2).keyCode}
            selectedKey={getLabel(2, 2)}
          />
          <Key
            keyType="regularKey"
            id="R2C3_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={340}
            y={keysRowsPosition.row3}
            fill={getColor(2, 3)}
            stroke={stroke(2, 3)}
            strokeWidth={getStrokeWidth(2, 3)}
            dataLedIndex={getLEDIndex(2, 3)}
            dataKeyIndex={keyIndex(2, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 3))}
            centerPrimary={getCenterPrimary(2, 3, 0, 0, true)}
            centerExtra={getCenterExtra(2, 3, 0, 0, true)}
            keyCode={getLabel(2, 3).keyCode}
            selectedKey={getLabel(2, 3)}
          />
          <Key
            keyType="regularKey"
            id="R2C4_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={407}
            y={keysRowsPosition.row3}
            fill={getColor(2, 4)}
            stroke={stroke(2, 4)}
            strokeWidth={getStrokeWidth(2, 4)}
            dataLedIndex={getLEDIndex(2, 4)}
            dataKeyIndex={keyIndex(2, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 4))}
            centerPrimary={getCenterPrimary(2, 4, 0, 0, true)}
            centerExtra={getCenterExtra(2, 4, 0, 0, true)}
            keyCode={getLabel(2, 4).keyCode}
            selectedKey={getLabel(2, 4)}
          />
          <Key
            keyType="regularKey"
            id="R2C5_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={474}
            y={keysRowsPosition.row3}
            fill={getColor(2, 5)}
            stroke={stroke(2, 5)}
            strokeWidth={getStrokeWidth(2, 5)}
            dataLedIndex={getLEDIndex(2, 5)}
            dataKeyIndex={keyIndex(2, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 5))}
            centerPrimary={getCenterPrimary(2, 5, 0, 0, true)}
            centerExtra={getCenterExtra(2, 5, 0, 0, true)}
            keyCode={getLabel(2, 5).keyCode}
            selectedKey={getLabel(2, 5)}
          />
          <Key
            keyType="regularKey"
            id="R2C9_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={621}
            y={keysRowsPosition.row3}
            fill={getColor(2, 9)}
            stroke={stroke(2, 9)}
            strokeWidth={getStrokeWidth(2, 9)}
            dataLedIndex={getLEDIndex(2, 9)}
            dataKeyIndex={keyIndex(2, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 9))}
            centerPrimary={getCenterPrimary(2, 9, 0, 0, true)}
            centerExtra={getCenterExtra(2, 9, 0, 0, true)}
            keyCode={getLabel(2, 9).keyCode}
            selectedKey={getLabel(2, 9)}
          />
          <Key
            keyType="regularKey"
            id="R2C10_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={688}
            y={keysRowsPosition.row3}
            fill={getColor(2, 10)}
            stroke={stroke(2, 10)}
            strokeWidth={getStrokeWidth(2, 10)}
            dataLedIndex={getLEDIndex(2, 10)}
            dataKeyIndex={keyIndex(2, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 10))}
            centerPrimary={getCenterPrimary(2, 10, 0, 0, true)}
            centerExtra={getCenterExtra(2, 10, 0, 0, true)}
            keyCode={getLabel(2, 10).keyCode}
            selectedKey={getLabel(2, 10)}
          />
          <Key
            keyType="regularKey"
            id="R2C11_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={755}
            y={keysRowsPosition.row3}
            fill={getColor(2, 11)}
            stroke={stroke(2, 11)}
            strokeWidth={getStrokeWidth(2, 11)}
            dataLedIndex={getLEDIndex(2, 11)}
            dataKeyIndex={keyIndex(2, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 11))}
            centerPrimary={getCenterPrimary(2, 11, 0, 0, true)}
            centerExtra={getCenterExtra(2, 11, 0, 0, true)}
            keyCode={getLabel(2, 11).keyCode}
            selectedKey={getLabel(2, 11)}
          />
          <Key
            keyType="regularKey"
            id="R2C12_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={822}
            y={keysRowsPosition.row3}
            fill={getColor(2, 12)}
            stroke={stroke(2, 12)}
            strokeWidth={getStrokeWidth(2, 12)}
            dataLedIndex={getLEDIndex(2, 12)}
            dataKeyIndex={keyIndex(2, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 12))}
            centerPrimary={getCenterPrimary(2, 12, 0, 0, true)}
            centerExtra={getCenterExtra(2, 12, 0, 0, true)}
            keyCode={getLabel(2, 12).keyCode}
            selectedKey={getLabel(2, 12)}
          />
          <Key
            keyType="regularKey"
            id="R2C13_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={889}
            y={keysRowsPosition.row3}
            fill={getColor(2, 13)}
            stroke={stroke(2, 13)}
            strokeWidth={getStrokeWidth(2, 13)}
            dataLedIndex={getLEDIndex(2, 13)}
            dataKeyIndex={keyIndex(2, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 13))}
            centerPrimary={getCenterPrimary(2, 13, 0, 0, true)}
            centerExtra={getCenterExtra(2, 13, 0, 0, true)}
            keyCode={getLabel(2, 13).keyCode}
            selectedKey={getLabel(2, 13)}
          />
          <Key
            keyType="regularKey"
            id="R2C14_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={956}
            y={keysRowsPosition.row3}
            fill={getColor(2, 14)}
            stroke={stroke(2, 14)}
            strokeWidth={getStrokeWidth(2, 14)}
            dataLedIndex={getLEDIndex(2, 14)}
            dataKeyIndex={keyIndex(2, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 14))}
            centerPrimary={getCenterPrimary(2, 14, 0, 0, true)}
            centerExtra={getCenterExtra(2, 14, 0, 0, true)}
            keyCode={getLabel(2, 14).keyCode}
            selectedKey={getLabel(2, 14)}
          />
          <Key
            keyType="regularKey"
            id="R2C15_keyshape"
            onClick={onClick}
            className="key"
            width={115}
            height={57}
            x={1023}
            y={keysRowsPosition.row3}
            fill={getColor(2, 15)}
            stroke={stroke(2, 15)}
            strokeWidth={getStrokeWidth(2, 15)}
            dataLedIndex={getLEDIndex(2, 15)}
            dataKeyIndex={keyIndex(2, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(2, 15))}
            centerPrimary={getCenterPrimary(2, 15, 0, 0, true)}
            centerExtra={getCenterExtra(2, 15, 0, 0, true)}
            keyCode={getLabel(2, 15).keyCode}
            selectedKey={getLabel(2, 15)}
          />
          <Key
            keyType="regularKey"
            id="R3C0_keyshape"
            onClick={onClick}
            className="key"
            width={130}
            height={57}
            x={84}
            y={keysRowsPosition.row4}
            fill={getColor(3, 1)}
            stroke={stroke(3, 1)}
            strokeWidth={getStrokeWidth(3, 1)}
            dataLedIndex={getLEDIndex(3, 1)}
            dataKeyIndex={keyIndex(3, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 1))}
            centerPrimary={getCenterPrimary(3, 1, 0, 0, true)}
            centerExtra={getCenterExtra(3, 1, 0, 0, true)}
            keyCode={getLabel(3, 1).keyCode}
            selectedKey={getLabel(3, 1)}
          />
          <Key
            keyType="regularKey"
            id="R3C2_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={224}
            y={keysRowsPosition.row4}
            fill={getColor(3, 2)}
            stroke={stroke(3, 2)}
            strokeWidth={getStrokeWidth(3, 2)}
            dataLedIndex={getLEDIndex(3, 2)}
            dataKeyIndex={keyIndex(3, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 2))}
            centerPrimary={getCenterPrimary(3, 2, 0, 0, true)}
            centerExtra={getCenterExtra(3, 2, 0, 0, true)}
            keyCode={getLabel(3, 2).keyCode}
            selectedKey={getLabel(3, 2)}
          />
          <Key
            keyType="regularKey"
            id="R3C3_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={291}
            y={keysRowsPosition.row4}
            fill={getColor(3, 3)}
            stroke={stroke(3, 3)}
            strokeWidth={getStrokeWidth(3, 3)}
            dataLedIndex={getLEDIndex(3, 3)}
            dataKeyIndex={keyIndex(3, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 3))}
            centerPrimary={getCenterPrimary(3, 3, 0, 0, true)}
            centerExtra={getCenterExtra(3, 3, 0, 0, true)}
            keyCode={getLabel(3, 3).keyCode}
            selectedKey={getLabel(3, 3)}
          />
          <Key
            keyType="regularKey"
            id="R3C4_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={358}
            y={keysRowsPosition.row4}
            fill={getColor(3, 4)}
            stroke={stroke(3, 4)}
            strokeWidth={getStrokeWidth(3, 4)}
            dataLedIndex={getLEDIndex(3, 4)}
            dataKeyIndex={keyIndex(3, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 4))}
            centerPrimary={getCenterPrimary(3, 4, 0, 0, true)}
            centerExtra={getCenterExtra(3, 4, 0, 0, true)}
            keyCode={getLabel(3, 4).keyCode}
            selectedKey={getLabel(3, 4)}
          />
          <Key
            keyType="regularKey"
            id="R3C5_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={425}
            y={keysRowsPosition.row4}
            fill={getColor(3, 5)}
            stroke={stroke(3, 5)}
            strokeWidth={getStrokeWidth(3, 5)}
            dataLedIndex={getLEDIndex(3, 5)}
            dataKeyIndex={keyIndex(3, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 5))}
            centerPrimary={getCenterPrimary(3, 5, 0, 0, true)}
            centerExtra={getCenterExtra(3, 5, 0, 0, true)}
            keyCode={getLabel(3, 5).keyCode}
            selectedKey={getLabel(3, 5)}
          />
          <Key
            keyType="regularKey"
            id="R3C6_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={492}
            y={keysRowsPosition.row4}
            fill={getColor(3, 6)}
            stroke={stroke(3, 6)}
            strokeWidth={getStrokeWidth(3, 6)}
            dataLedIndex={getLEDIndex(3, 6)}
            dataKeyIndex={keyIndex(3, 6)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 6))}
            centerPrimary={getCenterPrimary(3, 6, 0, 0, true)}
            centerExtra={getCenterExtra(3, 6, 0, 0, true)}
            keyCode={getLabel(3, 6).keyCode}
            selectedKey={getLabel(3, 6)}
          />
          <Key
            keyType="regularKey"
            id="R3C10_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={652}
            y={keysRowsPosition.row4}
            fill={getColor(3, 10)}
            stroke={stroke(3, 10)}
            strokeWidth={getStrokeWidth(3, 10)}
            dataLedIndex={getLEDIndex(3, 10)}
            dataKeyIndex={keyIndex(3, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 10))}
            centerPrimary={getCenterPrimary(3, 10, 0, 0, true)}
            centerExtra={getCenterExtra(3, 10, 0, 0, true)}
            keyCode={getLabel(3, 10).keyCode}
            selectedKey={getLabel(3, 10)}
          />
          <Key
            keyType="regularKey"
            id="R3C11_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={719}
            y={keysRowsPosition.row4}
            fill={getColor(3, 11)}
            stroke={stroke(3, 11)}
            strokeWidth={getStrokeWidth(3, 11)}
            dataLedIndex={getLEDIndex(3, 11)}
            dataKeyIndex={keyIndex(3, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 11))}
            centerPrimary={getCenterPrimary(3, 11, 0, 0, true)}
            centerExtra={getCenterExtra(3, 11, 0, 0, true)}
            keyCode={getLabel(3, 11).keyCode}
            selectedKey={getLabel(3, 11)}
          />
          <Key
            keyType="regularKey"
            id="R3C12_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={786}
            y={keysRowsPosition.row4}
            fill={getColor(3, 12)}
            stroke={stroke(3, 12)}
            strokeWidth={getStrokeWidth(3, 12)}
            dataLedIndex={getLEDIndex(3, 12)}
            dataKeyIndex={keyIndex(3, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 12))}
            centerPrimary={getCenterPrimary(3, 12, 0, 0, true)}
            centerExtra={getCenterExtra(3, 12, 0, 0, true)}
            keyCode={getLabel(3, 12).keyCode}
            selectedKey={getLabel(3, 12)}
          />
          <Key
            keyType="regularKey"
            id="R3C13_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={853}
            y={keysRowsPosition.row4}
            fill={getColor(3, 13)}
            stroke={stroke(3, 13)}
            strokeWidth={getStrokeWidth(3, 13)}
            dataLedIndex={getLEDIndex(3, 13)}
            dataKeyIndex={keyIndex(3, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 13))}
            centerPrimary={getCenterPrimary(3, 13, 0, 0, true)}
            centerExtra={getCenterExtra(3, 13, 0, 0, true)}
            keyCode={getLabel(3, 13).keyCode}
            selectedKey={getLabel(3, 13)}
          />
          <Key
            keyType="regularKey"
            id="R3C14_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={920}
            y={keysRowsPosition.row4}
            fill={getColor(3, 14)}
            stroke={stroke(3, 14)}
            strokeWidth={getStrokeWidth(3, 14)}
            dataLedIndex={getLEDIndex(3, 14)}
            dataKeyIndex={keyIndex(3, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 14))}
            centerPrimary={getCenterPrimary(3, 14, 0, 0, true)}
            centerExtra={getCenterExtra(3, 14, 0, 0, true)}
            keyCode={getLabel(3, 14).keyCode}
            selectedKey={getLabel(3, 14)}
          />
          <Key
            keyType="regularKey"
            id="R3C15_keyshape"
            onClick={onClick}
            className="key"
            width={151}
            height={57}
            x={987}
            y={keysRowsPosition.row4}
            fill={getColor(3, 15)}
            stroke={stroke(3, 15)}
            strokeWidth={getStrokeWidth(3, 15)}
            dataLedIndex={getLEDIndex(3, 15)}
            dataKeyIndex={keyIndex(3, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 15))}
            centerPrimary={getCenterPrimary(3, 15, 0, 0, true)}
            centerExtra={getCenterExtra(3, 15, 0, 0, true)}
            keyCode={getLabel(3, 15).keyCode}
            selectedKey={getLabel(3, 15)}
          />
          <Key
            keyType="regularKey"
            id="R4C0_keyshape"
            onClick={onClick}
            className="key"
            width={67}
            height={57}
            x={84}
            y={keysRowsPosition.row5}
            fill={getColor(4, 0)}
            stroke={stroke(4, 0)}
            strokeWidth={getStrokeWidth(4, 0)}
            dataLedIndex={getLEDIndex(4, 0)}
            dataKeyIndex={keyIndex(4, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 0))}
            centerPrimary={getCenterPrimary(4, 0, 0, 0, true)}
            centerExtra={getCenterExtra(4, 0, 0, 0, true)}
            keyCode={getLabel(4, 0).keyCode}
            selectedKey={getLabel(4, 0)}
          />
          <Key
            keyType="regularKey"
            id="R4C1_keyshape"
            onClick={onClick}
            className="key"
            width={67}
            height={57}
            x={162}
            y={keysRowsPosition.row5}
            fill={getColor(4, 1)}
            stroke={stroke(4, 1)}
            strokeWidth={getStrokeWidth(4, 1)}
            dataLedIndex={getLEDIndex(4, 1)}
            dataKeyIndex={keyIndex(4, 1)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 1))}
            centerPrimary={getCenterPrimary(4, 1, 0, 0, true)}
            centerExtra={getCenterExtra(4, 1, 0, 0, true)}
            keyCode={getLabel(4, 1).keyCode}
            selectedKey={getLabel(4, 1)}
          />
          <Key
            keyType="regularKey"
            id="R4C2_keyshape"
            onClick={onClick}
            className="key"
            width={67}
            height={57}
            x={239}
            y={keysRowsPosition.row5}
            fill={getColor(4, 2)}
            stroke={stroke(4, 2)}
            strokeWidth={getStrokeWidth(4, 2)}
            dataLedIndex={getLEDIndex(4, 2)}
            dataKeyIndex={keyIndex(4, 2)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 2))}
            centerPrimary={getCenterPrimary(4, 2, 0, 0, true)}
            centerExtra={getCenterExtra(4, 2, 0, 0, true)}
            keyCode={getLabel(4, 2).keyCode}
            selectedKey={getLabel(4, 2)}
          />
          <Key
            keyType="regularKey"
            id="R4C3_keyshape"
            onClick={onClick}
            className="key"
            width={115}
            height={57}
            x={316}
            y={keysRowsPosition.row5}
            fill={getColor(4, 3)}
            stroke={stroke(4, 3)}
            strokeWidth={getStrokeWidth(4, 3)}
            dataLedIndex={getLEDIndex(4, 3)}
            dataKeyIndex={keyIndex(4, 3)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 3))}
            centerPrimary={getCenterPrimary(4, 3, 0, 0, true)}
            centerExtra={getCenterExtra(4, 3, 0, 0, true)}
            keyCode={getLabel(4, 3).keyCode}
            selectedKey={getLabel(4, 3)}
          />
          <Key
            keyType="regularKey"
            id="R4C4_keyshape"
            onClick={onClick}
            className="key"
            width={81}
            height={57}
            x={441}
            y={keysRowsPosition.row5}
            fill={getColor(4, 4)}
            stroke={stroke(4, 4)}
            strokeWidth={getStrokeWidth(4, 4)}
            dataLedIndex={getLEDIndex(4, 4)}
            dataKeyIndex={keyIndex(4, 4)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 4))}
            centerPrimary={getCenterPrimary(4, 4, 0, 0, true)}
            centerExtra={getCenterExtra(4, 4, 0, 0, true)}
            keyCode={getLabel(4, 4).keyCode}
            selectedKey={getLabel(4, 4)}
          />
          <Key
            keyType="regularKey"
            id="R4C10_keyshape"
            onClick={onClick}
            className="key"
            width={66}
            height={57}
            x={645}
            y={keysRowsPosition.row5}
            fill={getColor(4, 10)}
            stroke={stroke(4, 10)}
            strokeWidth={getStrokeWidth(4, 10)}
            dataLedIndex={getLEDIndex(4, 10)}
            dataKeyIndex={keyIndex(4, 10)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 10))}
            centerPrimary={getCenterPrimary(4, 10, 0, 0, true)}
            centerExtra={getCenterExtra(4, 10, 0, 0, true)}
            keyCode={getLabel(4, 10).keyCode}
            selectedKey={getLabel(4, 10)}
          />
          <Key
            keyType="regularKey"
            id="R4C11_keyshape"
            onClick={onClick}
            className="key"
            width={115}
            height={57}
            x={719}
            y={keysRowsPosition.row5}
            fill={getColor(4, 11)}
            stroke={stroke(4, 11)}
            strokeWidth={getStrokeWidth(4, 11)}
            dataLedIndex={getLEDIndex(4, 11)}
            dataKeyIndex={keyIndex(4, 11)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 11))}
            centerPrimary={getCenterPrimary(4, 11, 0, 0, true)}
            centerExtra={getCenterExtra(4, 11, 0, 0, true)}
            keyCode={getLabel(4, 11).keyCode}
            selectedKey={getLabel(4, 11)}
          />
          <Key
            keyType="regularKey"
            id="R4C12_keyshape"
            onClick={onClick}
            className="key"
            width={66}
            height={57}
            x={844}
            y={keysRowsPosition.row5}
            fill={getColor(4, 12)}
            stroke={stroke(4, 12)}
            strokeWidth={getStrokeWidth(4, 12)}
            dataLedIndex={getLEDIndex(4, 12)}
            dataKeyIndex={keyIndex(4, 12)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 12))}
            centerPrimary={getCenterPrimary(4, 12, 0, 0, true)}
            centerExtra={getCenterExtra(4, 12, 0, 0, true)}
            keyCode={getLabel(4, 12).keyCode}
            selectedKey={getLabel(4, 12)}
          />
          <Key
            keyType="regularKey"
            id="R4C13_keyshape"
            onClick={onClick}
            className="key"
            width={66}
            height={57}
            x={920}
            y={keysRowsPosition.row5}
            fill={getColor(4, 13)}
            stroke={stroke(4, 13)}
            strokeWidth={getStrokeWidth(4, 13)}
            dataLedIndex={getLEDIndex(4, 13)}
            dataKeyIndex={keyIndex(4, 13)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 13))}
            centerPrimary={getCenterPrimary(4, 13, 0, 0, true)}
            centerExtra={getCenterExtra(4, 13, 0, 0, true)}
            keyCode={getLabel(4, 13).keyCode}
            selectedKey={getLabel(4, 13)}
          />
          <Key
            keyType="regularKey"
            id="R4C14_keyshape"
            onClick={onClick}
            className="key"
            width={66}
            height={57}
            x={996}
            y={keysRowsPosition.row5}
            fill={getColor(4, 14)}
            stroke={stroke(4, 14)}
            strokeWidth={getStrokeWidth(4, 14)}
            dataLedIndex={getLEDIndex(4, 14)}
            dataKeyIndex={keyIndex(4, 14)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 14))}
            centerPrimary={getCenterPrimary(4, 14, 0, 0, true)}
            centerExtra={getCenterExtra(4, 14, 0, 0, true)}
            keyCode={getLabel(4, 14).keyCode}
            selectedKey={getLabel(4, 14)}
          />
          <Key
            keyType="regularKey"
            id="R4C15_keyshape"
            onClick={onClick}
            className="key"
            width={66}
            height={57}
            x={1072}
            y={keysRowsPosition.row5}
            fill={getColor(4, 15)}
            stroke={stroke(4, 15)}
            strokeWidth={getStrokeWidth(4, 15)}
            dataLedIndex={getLEDIndex(4, 15)}
            dataKeyIndex={keyIndex(4, 15)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 15))}
            centerPrimary={getCenterPrimary(4, 15, 0, 0, true)}
            centerExtra={getCenterExtra(4, 15, 0, 0, true)}
            keyCode={getLabel(4, 15).keyCode}
            selectedKey={getLabel(4, 15)}
          />

          <Key
            keyType="t5"
            id="R4C6_keyshape"
            onClick={onClick}
            className="key"
            width={123}
            height={57}
            x={334}
            y={keysRowsPosition.row6}
            fill={getColor(4, 5)}
            stroke={stroke(4, 5)}
            strokeWidth={getStrokeWidth(4, 5)}
            dataLedIndex={getLEDIndex(4, 5)}
            dataKeyIndex={keyIndex(4, 5)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 5))}
            centerPrimary={getCenterPrimary(4, 5, 0, 0, true)}
            centerExtra={getCenterExtra(4, 5, 0, 0, true)}
            keyCode={getLabel(4, 5).keyCode}
            selectedKey={getLabel(4, 5)}
          />

          <Key
            keyType="regularKey"
            id="R4C7_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={464}
            y={keysRowsPosition.row6}
            fill={getColor(4, 6)}
            stroke={stroke(4, 6)}
            strokeWidth={getStrokeWidth(4, 6)}
            dataLedIndex={getLEDIndex(4, 6)}
            dataKeyIndex={keyIndex(4, 6)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 6))}
            centerPrimary={getCenterPrimary(4, 6, 0, 0, true)}
            centerExtra={getCenterExtra(4, 6, 0, 0, true)}
            keyCode={getLabel(4, 6).keyCode}
            selectedKey={getLabel(4, 6)}
          />
          <Key
            keyType="regularKey"
            id="R4C8_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={644}
            y={keysRowsPosition.row6}
            fill={getColor(4, 8)}
            stroke={stroke(4, 8)}
            strokeWidth={getStrokeWidth(4, 8)}
            dataLedIndex={getLEDIndex(4, 8)}
            dataKeyIndex={keyIndex(4, 8)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 8))}
            centerPrimary={getCenterPrimary(4, 8, 0, 0, true)}
            centerExtra={getCenterExtra(4, 8, 0, 0, true)}
            keyCode={getLabel(4, 8).keyCode}
            selectedKey={getLabel(4, 8)}
          />
          <Key
            keyType="t8"
            id="R4C9_keyshape"
            onClick={onClick}
            className="key"
            width={113}
            height={57}
            x={710}
            y={keysRowsPosition.row6}
            fill={getColor(4, 9)}
            stroke={stroke(4, 9)}
            strokeWidth={getStrokeWidth(4, 9)}
            dataLedIndex={getLEDIndex(4, 9)}
            dataKeyIndex={keyIndex(4, 9)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(4, 9))}
            centerPrimary={getCenterPrimary(4, 9, 0, 0, true)}
            centerExtra={getCenterExtra(4, 9, 0, 0, true)}
            keyCode={getLabel(4, 9).keyCode}
            selectedKey={getLabel(4, 9)}
          />
        </g>
        <g id="Areas">
          {/* Left side */}
          <UnderGlowStrip
            id="69_undeglow"
            x={56.6}
            y={13}
            onClick={e => {
              setUndeglowIndex(69, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(69)}
            stroke={stroke(69)}
            strokeWidth={getStrokeWidth(69)}
            dataLedIndex={getLEDIndex(69)}
            dataKeyIndex={keyIndex(69)}
            dataLayer={layer}
            path="M0.600037 29.4C0.600037 13.1909 13.7909 0 30 0H42C44.2092 0 46 1.79086 46 4C46 6.20914 44.2092 8 42 8H30C18.2092 8 8.60004 17.6091 8.60004 29.4V41.4C8.60004 43.6091 6.80918 45.4 4.60004 45.4C2.3909 45.4 0.600037 43.6091 0.600037 41.4V29.4Z"
          />
          <UnderGlowStrip
            id="70_undeglow"
            x={106}
            y={13}
            onClick={e => {
              setUndeglowIndex(70, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(70)}
            stroke={stroke(70)}
            strokeWidth={getStrokeWidth(70)}
            dataLedIndex={getLEDIndex(70)}
            dataKeyIndex={keyIndex(70)}
            dataLayer={layer}
            path="M0 4C0 1.79086 1.79086 0 4 0H64C66.2091 0 68 1.79086 68 4C68 6.20914 66.2091 8 64 8H4C1.79086 8 0 6.20914 0 4Z"
          />
          <UnderGlowStrip
            id="71_undeglow"
            x={178}
            y={13}
            onClick={e => {
              setUndeglowIndex(71, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(71)}
            stroke={stroke(71)}
            strokeWidth={getStrokeWidth(71)}
            dataLedIndex={getLEDIndex(71)}
            dataKeyIndex={keyIndex(71)}
            dataLayer={layer}
            path="M0 4C0 1.79086 1.79086 0 4 0H63.9C66.1091 0 67.9 1.79086 67.9 4C67.9 6.20914 66.1091 8 63.9 8H4C1.79086 8 0 6.20914 0 4Z"
          />
          <UnderGlowStrip
            id="72_undeglow"
            x={250}
            y={13}
            onClick={e => {
              setUndeglowIndex(72, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(72)}
            stroke={stroke(72)}
            strokeWidth={getStrokeWidth(72)}
            dataLedIndex={getLEDIndex(72)}
            dataKeyIndex={keyIndex(72)}
            dataLayer={layer}
            path="M0.900024 4C0.900024 1.79086 2.69089 0 4.90002 0H64.9C67.1092 0 68.9 1.79086 68.9 4C68.9 6.20914 67.1092 8 64.9 8H4.90002C2.69089 8 0.900024 6.20914 0.900024 4Z"
          />
          <UnderGlowStrip
            id="73_undeglow"
            x={321}
            y={13}
            onClick={e => {
              setUndeglowIndex(73, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(73)}
            stroke={stroke(73)}
            strokeWidth={getStrokeWidth(73)}
            dataLedIndex={getLEDIndex(73)}
            dataKeyIndex={keyIndex(73)}
            dataLayer={layer}
            path="M0.899994 4C0.899994 1.79086 2.69085 0 4.89999 0H64.8C67.0091 0 68.8 1.79086 68.8 4C68.8 6.20914 67.0091 8 64.8 8H4.89999C2.69085 8 0.899994 6.20914 0.899994 4Z"
          />
          <UnderGlowStrip
            id="74_undeglow"
            x={394}
            y={13}
            onClick={e => {
              setUndeglowIndex(74, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(74)}
            stroke={stroke(74)}
            strokeWidth={getStrokeWidth(74)}
            dataLedIndex={getLEDIndex(74)}
            dataKeyIndex={keyIndex(74)}
            dataLayer={layer}
            path="M0.799988 4C0.799988 1.79086 2.59085 0 4.79999 0H64.8C67.0091 0 68.8 1.79086 68.8 4C68.8 6.20914 67.0091 8 64.8 8H4.79999C2.59085 8 0.799988 6.20914 0.799988 4Z"
          />
          <UnderGlowStrip
            id="75_undeglow"
            x={465}
            y={13}
            onClick={e => {
              setUndeglowIndex(75, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(75)}
            stroke={stroke(75)}
            strokeWidth={getStrokeWidth(75)}
            dataLedIndex={getLEDIndex(75)}
            dataKeyIndex={keyIndex(75)}
            dataLayer={layer}
            path="M0.799988 4C0.799988 1.79086 2.59085 0 4.79999 0H64.7C66.9091 0 68.7 1.79086 68.7 4C68.7 6.20914 66.9091 8 64.7 8H4.79999C2.59085 8 0.799988 6.20914 0.799988 4Z"
          />
          <UnderGlowStrip
            id="76_undeglow"
            x={537}
            y={13}
            onClick={e => {
              setUndeglowIndex(76, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(76)}
            stroke={stroke(76)}
            strokeWidth={getStrokeWidth(76)}
            dataLedIndex={getLEDIndex(76)}
            dataKeyIndex={keyIndex(76)}
            dataLayer={layer}
            path="M0.700012 4C0.700012 1.79086 2.49087 0 4.70001 0H28C31.508 0 34.6 2.79102 34.6 6.6V21C34.6 23.2091 32.8091 25 30.6 25C28.3908 25 26.6 23.2091 26.6 21V8H4.70001C2.49087 8 0.700012 6.20914 0.700012 4Z"
          />
          <UnderGlowStrip
            id="77_undeglow"
            x={563}
            y={42}
            onClick={e => {
              setUndeglowIndex(77, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(77)}
            stroke={stroke(77)}
            strokeWidth={getStrokeWidth(77)}
            dataLedIndex={getLEDIndex(77)}
            dataKeyIndex={keyIndex(77)}
            dataLayer={layer}
            path="M4.59998 0C6.80911 0 8.59998 1.79086 8.59998 4V34.8C8.59998 37.0091 6.80911 38.8 4.59998 38.8C2.39084 38.8 0.599976 37.0091 0.599976 34.8V4C0.599976 1.79086 2.39084 0 4.59998 0Z"
          />
          <UnderGlowStrip
            id="78_undeglow"
            x={544}
            y={85}
            onClick={e => {
              setUndeglowIndex(78, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(78)}
            stroke={stroke(78)}
            strokeWidth={getStrokeWidth(78)}
            dataLedIndex={getLEDIndex(78)}
            dataKeyIndex={keyIndex(78)}
            dataLayer={layer}
            path="M23.7 0.799988C25.9092 0.799988 27.7 2.59085 27.7 4.79999V13.1C27.7 16.545 24.8707 19 21.8 19H8.09998V45.1C8.09998 47.3091 6.30911 49.1 4.09998 49.1C1.89084 49.1 0.0999756 47.3091 0.0999756 45.1V17.5C0.0999756 13.8908 2.99084 11 6.59998 11H19.7V4.79999C19.7 2.59085 21.4909 0.799988 23.7 0.799988Z"
          />
          <UnderGlowStrip
            id="79_undeglow"
            x={544}
            y={137}
            onClick={e => {
              setUndeglowIndex(79, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(79)}
            stroke={stroke(79)}
            strokeWidth={getStrokeWidth(79)}
            dataLedIndex={getLEDIndex(79)}
            dataKeyIndex={keyIndex(79)}
            dataLayer={layer}
            path="M4.09998 0.0999756C6.30911 0.0999756 8.09998 1.89084 8.09998 4.09998V25H14.8C18.2091 25 21 27.7908 21 31.2V75C21 77.2091 19.2091 79 17 79C14.7909 79 13 77.2091 13 75V33H6C2.9293 33 0.0999756 30.5451 0.0999756 27.1V4.09998C0.0999756 1.89084 1.89084 0.0999756 4.09998 0.0999756Z"
          />
          <UnderGlowStrip
            id="80_undeglow"
            x={557}
            y={220}
            onClick={e => {
              setUndeglowIndex(80, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(80)}
            stroke={stroke(80)}
            strokeWidth={getStrokeWidth(80)}
            dataLedIndex={getLEDIndex(80)}
            dataKeyIndex={keyIndex(80)}
            dataLayer={layer}
            path="M4.90002 0C7.10916 0 8.90002 1.79086 8.90002 4V14H25.2C28.7092 14 31.6 16.8909 31.6 20.4V69.7C31.6 71.9091 29.8091 73.7 27.6 73.7C25.3908 73.7 23.6 71.9091 23.6 69.7V22H7.09998C3.69073 22 0.900024 19.209 0.900024 15.8V4C0.900024 1.79086 2.69089 0 4.90002 0Z"
          />
          <UnderGlowStrip
            id="81_undeglow"
            x={561}
            y={299}
            onClick={e => {
              setUndeglowIndex(81, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(81)}
            stroke={stroke(81)}
            strokeWidth={getStrokeWidth(81)}
            dataLedIndex={getLEDIndex(81)}
            dataKeyIndex={keyIndex(81)}
            dataLayer={layer}
            path="M8.79999 8.09998H23.6C25.8091 8.09998 27.6 6.30911 27.6 4.09998C27.6 1.89084 25.8091 0.0999756 23.6 0.0999756H6.70001C3.62932 0.0999756 0.799988 2.55488 0.799988 5.99997V46.3C0.799988 48.5091 2.59085 50.3 4.79999 50.3C7.00913 50.3 8.79999 48.5091 8.79999 46.3V8.09998Z"
          />
          <UnderGlowStrip
            id="82_undeglow"
            x={561}
            y={352}
            onClick={e => {
              setUndeglowIndex(82, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(82)}
            stroke={stroke(82)}
            strokeWidth={getStrokeWidth(82)}
            dataLedIndex={getLEDIndex(82)}
            dataKeyIndex={keyIndex(82)}
            dataLayer={layer}
            path="M4.79999 0.299988C7.00913 0.299988 8.79999 2.09085 8.79999 4.29999V58.7C8.79999 60.9092 7.00913 62.7 4.79999 62.7C2.59085 62.7 0.799988 60.9092 0.799988 58.7V4.29999C0.799988 2.09085 2.59085 0.299988 4.79999 0.299988Z"
          />
          <UnderGlowStrip
            id="83_undeglow"
            x={525}
            y={419.7}
            onClick={e => {
              setUndeglowIndex(83, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(83)}
            stroke={stroke(83)}
            strokeWidth={getStrokeWidth(83)}
            dataLedIndex={getLEDIndex(83)}
            dataKeyIndex={keyIndex(83)}
            dataLayer={layer}
            path="M39.7 0.700012C41.9092 0.700012 43.7 2.49087 43.7 4.70001V28C43.7 31.4091 40.9091 34.2 37.5 34.2H4C1.79086 34.2 0 32.4092 0 30.2C0 27.9909 1.79086 26.2 4 26.2H35.7V4.70001C35.7 2.49087 37.4909 0.700012 39.7 0.700012Z"
          />
          <UnderGlowStrip
            id="84_undeglow"
            x={459}
            y={445}
            onClick={e => {
              setUndeglowIndex(84, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(84)}
            stroke={stroke(84)}
            strokeWidth={getStrokeWidth(84)}
            dataLedIndex={getLEDIndex(84)}
            dataKeyIndex={keyIndex(84)}
            dataLayer={layer}
            path="M10.4766 19.8859C10.4762 19.8877 10.4757 19.8895 10.4752 19.8913L8.07818 29.3797C7.53708 31.5216 5.36212 32.8193 3.22028 32.2782C1.07843 31.7371 -0.219235 29.5621 0.321862 27.4203L2.72479 17.9087C5.3749 7.5491 14.7616 0.200012 25.5 0.200012H58C60.2091 0.200012 62 1.99087 62 4.20001C62 6.40915 60.2091 8.20001 58 8.20001H25.5C18.4403 8.20001 12.2284 13.0483 10.4766 19.8859Z"
          />

          <UnderGlowStrip
            id="85_undeglow"
            x={444}
            y={482}
            onClick={e => {
              setUndeglowIndex(85, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(85)}
            stroke={stroke(85)}
            strokeWidth={getStrokeWidth(85)}
            dataLedIndex={getLEDIndex(85)}
            dataKeyIndex={keyIndex(85)}
            dataLayer={layer}
            path="M17.2891 0.924239C19.4296 1.47048 20.722 3.64854 20.1758 5.78908L7.87581 53.9891C7.32957 56.1296 5.15151 57.4221 3.01096 56.8758C0.870423 56.3296 -0.422017 54.1515 0.12422 52.011L12.4242 3.81098C12.9704 1.67044 15.1485 0.378002 17.2891 0.924239Z"
          />
          <UnderGlowStrip
            id="86_undeglow"
            x={429}
            y={541}
            onClick={e => {
              setUndeglowIndex(86, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(86)}
            stroke={stroke(86)}
            strokeWidth={getStrokeWidth(86)}
            dataLedIndex={getLEDIndex(86)}
            dataKeyIndex={keyIndex(86)}
            dataLayer={layer}
            path="M16.8877 1.02387C19.0285 1.56937 20.3216 3.74699 19.7761 5.88772L7.87615 52.5877C7.33065 54.7284 5.15303 56.0216 3.0123 55.4761C0.871573 54.9306 -0.421619 52.753 0.123878 50.6123L12.0239 3.9123C12.5694 1.77157 14.747 0.478375 16.8877 1.02387Z"
          />
          <UnderGlowStrip
            id="87_undeglow"
            x={414}
            y={600}
            onClick={e => {
              setUndeglowIndex(87, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(87)}
            stroke={stroke(87)}
            strokeWidth={getStrokeWidth(87)}
            dataLedIndex={getLEDIndex(87)}
            dataKeyIndex={keyIndex(87)}
            dataLayer={layer}
            path="M16.9955 0.625846C19.1351 1.17564 20.4239 3.35586 19.8741 5.49549L7.87413 52.1955C7.32433 54.3351 5.14412 55.6239 3.00449 55.0741C0.864862 54.5243 -0.423952 52.3441 0.125846 50.2045L12.1258 3.50449C12.6756 1.36486 14.8559 0.0760476 16.9955 0.625846Z"
          />

          <UnderGlowStrip
            id="88_undeglow"
            x={373}
            y={658}
            onClick={e => {
              setUndeglowIndex(88, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(88)}
            stroke={stroke(88)}
            strokeWidth={getStrokeWidth(88)}
            dataLedIndex={getLEDIndex(88)}
            dataKeyIndex={keyIndex(88)}
            dataLayer={layer}
            path="M42.8873 0.323703C45.0281 0.868995 46.3215 3.04649 45.7762 5.18727L43.0762 15.7872L43.074 15.7961C39.9201 28.0612 28.8284 36.6999 16.1 36.6999H4.20001C1.99087 36.6999 0.200012 34.9091 0.200012 32.6999C0.200012 30.4908 1.99087 28.6999 4.20001 28.6999H16.1C25.1703 28.6999 33.0776 22.5404 35.325 13.8076C35.3254 13.8063 35.3257 13.805 35.326 13.8037L38.0238 3.2126C38.5691 1.07181 40.7465 -0.221588 42.8873 0.323703Z"
          />
          <UnderGlowStrip
            id="89_undeglow"
            x={313}
            y={687}
            onClick={e => {
              setUndeglowIndex(89, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(89)}
            stroke={stroke(89)}
            strokeWidth={getStrokeWidth(89)}
            dataLedIndex={getLEDIndex(89)}
            dataKeyIndex={keyIndex(89)}
            dataLayer={layer}
            path="M0.100006 4.69995C0.100006 2.49081 1.89087 0.699951 4.10001 0.699951H52.2C54.4092 0.699951 56.2 2.49081 56.2 4.69995C56.2 6.90909 54.4092 8.69995 52.2 8.69995H4.10001C1.89087 8.69995 0.100006 6.90909 0.100006 4.69995Z"
          />
          <UnderGlowStrip
            id="90_undeglow"
            x={253}
            y={687}
            onClick={e => {
              setUndeglowIndex(90, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(90)}
            stroke={stroke(90)}
            strokeWidth={getStrokeWidth(90)}
            dataLedIndex={getLEDIndex(90)}
            dataKeyIndex={keyIndex(90)}
            dataLayer={layer}
            path="M0 4.69995C0 2.49081 1.79086 0.699951 4 0.699951H52.1C54.3091 0.699951 56.1 2.49081 56.1 4.69995C56.1 6.90909 54.3091 8.69995 52.1 8.69995H4C1.79086 8.69995 0 6.90909 0 4.69995Z"
          />
          <UnderGlowStrip
            id="91_undeglow"
            x={193}
            y={687}
            onClick={e => {
              setUndeglowIndex(91, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(91)}
            stroke={stroke(91)}
            strokeWidth={getStrokeWidth(91)}
            dataLedIndex={getLEDIndex(91)}
            dataKeyIndex={keyIndex(91)}
            dataLayer={layer}
            path="M0.900024 4.69995C0.900024 2.49081 2.69089 0.699951 4.90002 0.699951H53C55.2092 0.699951 57 2.49081 57 4.69995C57 6.90909 55.2092 8.69995 53 8.69995H4.90002C2.69089 8.69995 0.900024 6.90909 0.900024 4.69995Z"
          />
          <UnderGlowStrip
            id="92_undeglow"
            x={133}
            y={687}
            onClick={e => {
              setUndeglowIndex(92, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(92)}
            stroke={stroke(92)}
            strokeWidth={getStrokeWidth(92)}
            dataLedIndex={getLEDIndex(92)}
            dataKeyIndex={keyIndex(92)}
            dataLayer={layer}
            path="M0.800018 4.69995C0.800018 2.49081 2.59088 0.699951 4.80002 0.699951H52.9C55.1091 0.699951 56.9 2.49081 56.9 4.69995C56.9 6.90909 55.1091 8.69995 52.9 8.69995H4.80002C2.59088 8.69995 0.800018 6.90909 0.800018 4.69995Z"
          />
          <UnderGlowStrip
            id="93_undeglow"
            x={73}
            y={687}
            onClick={e => {
              setUndeglowIndex(93, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(93)}
            stroke={stroke(93)}
            strokeWidth={getStrokeWidth(93)}
            dataLedIndex={getLEDIndex(93)}
            dataKeyIndex={keyIndex(93)}
            dataLayer={layer}
            path="M0.700012 4.69995C0.700012 2.49081 2.49087 0.699951 4.70001 0.699951H52.8C55.0092 0.699951 56.8 2.49081 56.8 4.69995C56.8 6.90909 55.0092 8.69995 52.8 8.69995H4.70001C2.49087 8.69995 0.700012 6.90909 0.700012 4.69995Z"
          />

          <UnderGlowStrip
            id="94_undeglow"
            x={24.5}
            y={651.6}
            onClick={e => {
              setUndeglowIndex(94, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(94)}
            stroke={stroke(94)}
            strokeWidth={getStrokeWidth(94)}
            dataLedIndex={getLEDIndex(94)}
            dataKeyIndex={keyIndex(94)}
            dataLayer={layer}
            path="M4.33621 0.603272C6.54349 0.51281 8.40619 2.22883 8.49665 4.43612L8.99696 16.6438C9.41316 27.2986 18.1499 35.7 28.8 35.7H40.8C43.0091 35.7 44.8 37.4908 44.8 39.7C44.8 41.9091 43.0091 43.7 40.8 43.7H28.8C13.8514 43.7 1.58901 31.9034 1.00321 16.96C1.00315 16.9587 1.0031 16.9574 1.00305 16.9561L0.503357 4.76371C0.412895 2.55643 2.12892 0.693734 4.33621 0.603272Z"
          />
          <UnderGlowStrip
            id="95_undeglow"
            x={22.1}
            y={588.5}
            onClick={e => {
              setUndeglowIndex(95, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(95)}
            stroke={stroke(95)}
            strokeWidth={getStrokeWidth(95)}
            dataLedIndex={getLEDIndex(95)}
            dataKeyIndex={keyIndex(95)}
            dataLayer={layer}
            path="M3.94994 0.502871C6.15752 0.419977 8.01432 2.14238 8.09721 4.34996L9.99721 54.9499C10.0801 57.1575 8.3577 59.0143 6.15012 59.0972C3.94254 59.1801 2.08574 57.4577 2.00285 55.2501L0.102846 4.65015C0.0199528 2.44256 1.74235 0.585764 3.94994 0.502871Z"
          />
          <UnderGlowStrip
            id="96_undeglow"
            x={19.8}
            y={528.1}
            onClick={e => {
              setUndeglowIndex(96, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(96)}
            stroke={stroke(96)}
            strokeWidth={getStrokeWidth(96)}
            dataLedIndex={getLEDIndex(96)}
            dataKeyIndex={keyIndex(96)}
            dataLayer={layer}
            path="M4.6504 0.102766C6.85799 0.0201532 8.71457 1.74279 8.79718 3.95038L10.5972 52.0504C10.6798 54.258 8.95716 56.1146 6.74957 56.1972C4.54197 56.2798 2.68539 54.5572 2.60278 52.3496L0.802778 4.24955C0.720165 2.04196 2.4428 0.185379 4.6504 0.102766Z"
          />
          <UnderGlowStrip
            id="97_undeglow"
            x={17.5}
            y={467}
            onClick={e => {
              setUndeglowIndex(97, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(97)}
            stroke={stroke(97)}
            strokeWidth={getStrokeWidth(97)}
            dataLedIndex={getLEDIndex(97)}
            dataKeyIndex={keyIndex(97)}
            dataLayer={layer}
            path="M4.34438 0.00302495C6.55184 -0.0829216 8.41102 1.63691 8.49697 3.84438L10.397 52.6444C10.4829 54.8518 8.76308 56.711 6.55562 56.797C4.34815 56.8829 2.48897 55.1631 2.40302 52.9556L0.503025 4.15562C0.417078 1.94815 2.13691 0.0889713 4.34438 0.00302495Z"
          />
          <UnderGlowStrip
            id="98_undeglow"
            x={15.2}
            y={406.1}
            onClick={e => {
              setUndeglowIndex(98, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(98)}
            stroke={stroke(98)}
            strokeWidth={getStrokeWidth(98)}
            dataLedIndex={getLEDIndex(98)}
            dataKeyIndex={keyIndex(98)}
            dataLayer={layer}
            path="M4.04375 0.103087C6.2512 0.0167875 8.11066 1.73632 8.19696 3.94377L10.097 52.5438C10.1833 54.7512 8.46372 56.6107 6.25627 56.697C4.04882 56.7833 2.18936 55.0638 2.10306 52.8563L0.203063 4.25629C0.116763 2.04884 1.8363 0.189387 4.04375 0.103087Z"
          />
          <UnderGlowStrip
            id="99_undeglow"
            x={13}
            y={345.7}
            onClick={e => {
              setUndeglowIndex(99, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(99)}
            stroke={stroke(99)}
            strokeWidth={getStrokeWidth(99)}
            dataLedIndex={getLEDIndex(99)}
            dataKeyIndex={keyIndex(99)}
            dataLayer={layer}
            path="M3.85041 0.702803C6.058 0.62019 7.91458 2.34283 7.99719 4.55042L9.79719 52.6504C9.87981 54.858 8.15717 56.7146 5.94958 56.7972C3.74198 56.8798 1.8854 55.1572 1.80279 52.9496L0.00279041 4.84959C-0.0798223 2.64199 1.64282 0.785415 3.85041 0.702803Z"
          />
          <UnderGlowStrip
            id="100_undeglow"
            x={12.3}
            y={280.8}
            onClick={e => {
              setUndeglowIndex(100, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(100)}
            stroke={stroke(100)}
            strokeWidth={getStrokeWidth(100)}
            dataLedIndex={getLEDIndex(100)}
            dataKeyIndex={keyIndex(100)}
            dataLayer={layer}
            path="M23.0408 1.35978C24.9408 2.48689 25.5673 4.94082 24.4402 6.84081L17.4431 18.6359C17.4426 18.6367 17.4422 18.6376 17.4417 18.6384C11.0361 29.4725 7.92564 41.8123 8.39723 54.4509L8.39765 54.4622L8.49764 57.3622C8.57377 59.57 6.84569 61.4215 4.63786 61.4976C2.43004 61.5738 0.578521 59.8457 0.502389 57.6379L0.402794 54.7492C0.402722 54.7472 0.40265 54.7453 0.402578 54.7434C-0.12463 40.5849 3.36449 26.7277 10.5569 14.5641L17.5598 2.7592C18.6869 0.859215 21.1408 0.232675 23.0408 1.35978Z"
          />
          <UnderGlowStrip
            id="101_undeglow"
            x={35}
            y={215}
            onClick={e => {
              setUndeglowIndex(101, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(101)}
            stroke={stroke(101)}
            strokeWidth={getStrokeWidth(101)}
            dataLedIndex={getLEDIndex(101)}
            dataKeyIndex={keyIndex(101)}
            dataLayer={layer}
            path="M25.6 0C27.8092 0 29.6 1.79086 29.6 4C29.6 17.1069 26.1123 30.0156 19.3375 41.3455C19.3359 41.3481 19.3344 41.3507 19.3328 41.3533L7.44202 61.4378C6.31657 63.3388 3.86318 63.9674 1.96221 62.842C0.0612503 61.7165 -0.56743 59.2632 0.558016 57.3622L12.4626 37.2545L12.4672 37.2467C18.4893 27.1786 21.6 15.6901 21.6 4C21.6 1.79086 23.3909 0 25.6 0Z"
          />
          <UnderGlowStrip
            id="102_undeglow"
            x={56.6}
            y={164.4}
            onClick={e => {
              setUndeglowIndex(102, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(102)}
            stroke={stroke(102)}
            strokeWidth={getStrokeWidth(102)}
            dataLedIndex={getLEDIndex(102)}
            dataKeyIndex={keyIndex(102)}
            dataLayer={layer}
            path="M4.60004 0.400024C6.80918 0.400024 8.60004 2.19089 8.60004 4.40002V43.3C8.60004 45.5092 6.80918 47.3 4.60004 47.3C2.3909 47.3 0.600037 45.5092 0.600037 43.3V4.40002C0.600037 2.19089 2.3909 0.400024 4.60004 0.400024Z"
          />
          <UnderGlowStrip
            id="103_undeglow"
            x={56.6}
            y={113.4}
            onClick={e => {
              setUndeglowIndex(103, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(103)}
            stroke={stroke(103)}
            strokeWidth={getStrokeWidth(103)}
            dataLedIndex={getLEDIndex(103)}
            dataKeyIndex={keyIndex(103)}
            dataLayer={layer}
            path="M4.60004 0.400024C6.80918 0.400024 8.60004 2.19089 8.60004 4.40002V44.3C8.60004 46.5092 6.80918 48.3 4.60004 48.3C2.3909 48.3 0.600037 46.5092 0.600037 44.3V4.40002C0.600037 2.19089 2.3909 0.400024 4.60004 0.400024Z"
          />
          <UnderGlowStrip
            id="104_undeglow"
            x={56.6}
            y={62.4}
            onClick={e => {
              setUndeglowIndex(104, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(104)}
            stroke={stroke(104)}
            strokeWidth={getStrokeWidth(104)}
            dataLedIndex={getLEDIndex(104)}
            dataKeyIndex={keyIndex(104)}
            dataLayer={layer}
            path="M4.60004 0.400024C6.80918 0.400024 8.60004 2.19089 8.60004 4.40002V43.4C8.60004 45.6092 6.80918 47.4 4.60004 47.4C2.3909 47.4 0.600037 45.6092 0.600037 43.4V4.40002C0.600037 2.19089 2.3909 0.400024 4.60004 0.400024Z"
          />

          {/* End Left side */}
          {/* Right side */}
          <UnderGlowStrip
            id="105_undeglow"
            x={1161}
            y={50}
            onClick={e => {
              setUndeglowIndex(105, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(105)}
            stroke={stroke(105)}
            strokeWidth={getStrokeWidth(105)}
            dataLedIndex={getLEDIndex(105)}
            dataKeyIndex={keyIndex(105)}
            dataLayer={layer}
            path="M4 0C6.20914 0 8 1.79086 8 4V47.8C8 50.0091 6.20914 51.8 4 51.8C1.79086 51.8 0 50.0091 0 47.8V4C0 1.79086 1.79086 0 4 0Z"
          />
          <UnderGlowStrip
            id="106_undeglow"
            x={1123.6}
            y={13}
            onClick={e => {
              setUndeglowIndex(106, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(106)}
            stroke={stroke(106)}
            strokeWidth={getStrokeWidth(106)}
            dataLedIndex={getLEDIndex(106)}
            dataKeyIndex={keyIndex(106)}
            dataLayer={layer}
            path="M0.599976 4C0.599976 1.79086 2.39084 0 4.59998 0H16.6C32.8091 0 46 13.1909 46 29.4C46 31.6091 44.2091 33.4 42 33.4C39.7909 33.4 38 31.6091 38 29.4C38 17.6091 28.3908 8 16.6 8H4.59998C2.39084 8 0.599976 6.20914 0.599976 4Z"
          />
          <UnderGlowStrip
            id="107_undeglow"
            x={1056.2}
            y={13}
            onClick={e => {
              setUndeglowIndex(107, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(107)}
            stroke={stroke(107)}
            strokeWidth={getStrokeWidth(107)}
            dataLedIndex={getLEDIndex(107)}
            dataKeyIndex={keyIndex(107)}
            dataLayer={layer}
            path="M0.199951 4C0.199951 1.79086 1.99081 0 4.19995 0H59.6C61.8091 0 63.6 1.79086 63.6 4C63.6 6.20914 61.8091 8 59.6 8H4.19995C1.99081 8 0.199951 6.20914 0.199951 4Z"
          />
          <UnderGlowStrip
            id="108_undeglow"
            x={983.9}
            y={13}
            onClick={e => {
              setUndeglowIndex(108, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(108)}
            stroke={stroke(108)}
            strokeWidth={getStrokeWidth(108)}
            dataLedIndex={getLEDIndex(108)}
            dataKeyIndex={keyIndex(108)}
            dataLayer={layer}
            path="M0.900024 4C0.900024 1.79086 2.69089 0 4.90002 0H65.2C67.4091 0 69.2 1.79086 69.2 4C69.2 6.20914 67.4091 8 65.2 8H4.90002C2.69089 8 0.900024 6.20914 0.900024 4Z"
          />
          <UnderGlowStrip
            id="109_undeglow"
            x={911.5}
            y={13}
            onClick={e => {
              setUndeglowIndex(109, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(109)}
            stroke={stroke(109)}
            strokeWidth={getStrokeWidth(109)}
            dataLedIndex={getLEDIndex(109)}
            dataKeyIndex={keyIndex(109)}
            dataLayer={layer}
            path="M0.5 4C0.5 1.79086 2.29086 0 4.5 0H64.9C67.1092 0 68.9 1.79086 68.9 4C68.9 6.20914 67.1092 8 64.9 8H4.5C2.29086 8 0.5 6.20914 0.5 4Z"
          />
          <UnderGlowStrip
            id="110_undeglow"
            x={839.2}
            y={13}
            onClick={e => {
              setUndeglowIndex(110, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(110)}
            stroke={stroke(110)}
            strokeWidth={getStrokeWidth(110)}
            dataLedIndex={getLEDIndex(110)}
            dataKeyIndex={keyIndex(110)}
            dataLayer={layer}
            path="M0.200012 4C0.200012 1.79086 1.99087 0 4.20001 0H64.5C66.7091 0 68.5 1.79086 68.5 4C68.5 6.20914 66.7091 8 64.5 8H4.20001C1.99087 8 0.200012 6.20914 0.200012 4Z"
          />
          <UnderGlowStrip
            id="111_undeglow"
            x={766.8}
            y={13}
            onClick={e => {
              setUndeglowIndex(111, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(111)}
            stroke={stroke(111)}
            strokeWidth={getStrokeWidth(111)}
            dataLedIndex={getLEDIndex(111)}
            dataKeyIndex={keyIndex(111)}
            dataLayer={layer}
            path="M0.799988 4C0.799988 1.79086 2.59085 0 4.79999 0H65.2C67.4091 0 69.2 1.79086 69.2 4C69.2 6.20914 67.4091 8 65.2 8H4.79999C2.59085 8 0.799988 6.20914 0.799988 4Z"
          />
          <UnderGlowStrip
            id="112_undeglow"
            x={694.4}
            y={13}
            onClick={e => {
              setUndeglowIndex(112, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(112)}
            stroke={stroke(112)}
            strokeWidth={getStrokeWidth(112)}
            dataLedIndex={getLEDIndex(112)}
            dataKeyIndex={keyIndex(112)}
            dataLayer={layer}
            path="M0.400024 4C0.400024 1.79086 2.19089 0 4.40002 0H64.8C67.0091 0 68.8 1.79086 68.8 4C68.8 6.20914 67.0091 8 64.8 8H4.40002C2.19089 8 0.400024 6.20914 0.400024 4Z"
          />
          <UnderGlowStrip
            id="113_undeglow"
            x={619.1}
            y={13}
            onClick={e => {
              setUndeglowIndex(113, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(113)}
            stroke={stroke(113)}
            strokeWidth={getStrokeWidth(113)}
            dataLedIndex={getLEDIndex(113)}
            dataKeyIndex={keyIndex(113)}
            dataLayer={layer}
            path="M0.0999756 4C0.0999756 1.79086 1.89084 0 4.09998 0H64.4C66.6092 0 68.4 1.79086 68.4 4C68.4 6.20914 66.6092 8 64.4 8H4.09998C1.89084 8 0.0999756 6.20914 0.0999756 4Z"
          />
          <UnderGlowStrip
            id="114_undeglow"
            x={586}
            y={13}
            onClick={e => {
              setUndeglowIndex(114, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(114)}
            stroke={stroke(114)}
            strokeWidth={getStrokeWidth(114)}
            dataLedIndex={getLEDIndex(114)}
            dataKeyIndex={keyIndex(114)}
            dataLayer={layer}
            path="M8 8H25C27.2091 8 29 6.20914 29 4C29 1.79086 27.2091 0 25 0H6.59998C3.09201 0 0 2.79102 0 6.6V21C0 23.2091 1.79086 25 4 25C6.20914 25 8 23.2091 8 21V8Z"
          />
          <UnderGlowStrip
            id="115_undeglow"
            x={586}
            y={42}
            onClick={e => {
              setUndeglowIndex(115, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(115)}
            stroke={stroke(115)}
            strokeWidth={getStrokeWidth(115)}
            dataLedIndex={getLEDIndex(115)}
            dataKeyIndex={keyIndex(115)}
            dataLayer={layer}
            path="M4 0C6.20914 0 8 1.79086 8 4V34.8C8 37.0091 6.20914 38.8 4 38.8C1.79086 38.8 0 37.0091 0 34.8V4C0 1.79086 1.79086 0 4 0Z"
          />
          <UnderGlowStrip
            id="116_undeglow"
            x={565.6}
            y={84.8}
            onClick={e => {
              setUndeglowIndex(116, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(116)}
            stroke={stroke(116)}
            strokeWidth={getStrokeWidth(116)}
            dataLedIndex={getLEDIndex(116)}
            dataKeyIndex={keyIndex(116)}
            dataLayer={layer}
            path="M25 0.799988C27.2091 0.799988 29 2.59085 29 4.79999V26.5C29 30.1091 26.1091 33 22.5 33H8.5V45.1C8.5 47.3091 6.70914 49.1 4.5 49.1C2.29086 49.1 0.5 47.3091 0.5 45.1V31.1C0.5 27.9155 3.06816 25 6.59998 25H21V4.79999C21 2.59085 22.7909 0.799988 25 0.799988Z"
          />
          <UnderGlowStrip
            id="117_undeglow"
            x={565.6}
            y={137.1}
            onClick={e => {
              setUndeglowIndex(117, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(117)}
            stroke={stroke(117)}
            strokeWidth={getStrokeWidth(117)}
            dataLedIndex={getLEDIndex(117)}
            dataKeyIndex={keyIndex(117)}
            dataLayer={layer}
            path="M4.59998 0.0999756C6.80911 0.0999756 8.59998 1.89084 8.59998 4.09998V9.99997H14.6C18.009 9.99997 20.7 12.6908 20.7 16.1V44C20.7 46.2091 18.9092 48 16.7 48C14.4909 48 12.7 46.2091 12.7 44V18H6.29999C3.34636 18 0.599976 15.6615 0.599976 12.3V4.09998C0.599976 1.89084 2.39084 0.0999756 4.59998 0.0999756Z"
          />
          <UnderGlowStrip
            id="118_undeglow"
            x={577.7}
            y={189.4}
            onClick={e => {
              setUndeglowIndex(118, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(118)}
            stroke={stroke(118)}
            strokeWidth={getStrokeWidth(118)}
            dataLedIndex={getLEDIndex(118)}
            dataKeyIndex={keyIndex(118)}
            dataLayer={layer}
            path="M4.70001 0.400024C6.90915 0.400024 8.70001 2.19089 8.70001 4.40002V26.9H31.5C35.1091 26.9 38 29.7909 38 33.4V51C38 53.2092 36.2091 55 34 55C31.7909 55 30 53.2092 30 51V34.9H7.09998C3.59077 34.9 0.700012 32.0091 0.700012 28.5V4.40002C0.700012 2.19089 2.49087 0.400024 4.70001 0.400024Z"
          />
          <UnderGlowStrip
            id="119_undeglow"
            x={607}
            y={248}
            onClick={e => {
              setUndeglowIndex(119, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(119)}
            stroke={stroke(119)}
            strokeWidth={getStrokeWidth(119)}
            dataLedIndex={getLEDIndex(119)}
            dataKeyIndex={keyIndex(119)}
            dataLayer={layer}
            path="M4 0C6.20914 0 8 1.79086 8 4V39C8 41.2091 6.20914 43 4 43C1.79086 43 0 41.2091 0 39V4C0 1.79086 1.79086 0 4 0Z"
          />
          <UnderGlowStrip
            id="120_undeglow"
            x={588.9}
            y={295}
            onClick={e => {
              setUndeglowIndex(120, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(120)}
            stroke={stroke(120)}
            strokeWidth={getStrokeWidth(120)}
            dataLedIndex={getLEDIndex(120)}
            dataKeyIndex={keyIndex(120)}
            dataLayer={layer}
            path="M22.9 0C25.1092 0 26.9 1.79086 26.9 4V20.7C26.9 24.1092 24.1091 26.9 20.7 26.9H8.79999V49.5C8.79999 51.7091 7.00913 53.5 4.79999 53.5C2.59085 53.5 0.799988 51.7091 0.799988 49.5V24.8C0.799988 21.7291 3.25509 18.9 6.70001 18.9H18.9V4C18.9 1.79086 20.6909 0 22.9 0Z"
          />
          <UnderGlowStrip
            id="121_undeglow"
            x={588.9}
            y={352.5}
            onClick={e => {
              setUndeglowIndex(121, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(121)}
            stroke={stroke(121)}
            strokeWidth={getStrokeWidth(121)}
            dataLedIndex={getLEDIndex(121)}
            dataKeyIndex={keyIndex(121)}
            dataLayer={layer}
            path="M4.79999 0.5C7.00913 0.5 8.79999 2.29086 8.79999 4.5V59.7C8.79999 61.9092 7.00913 63.7 4.79999 63.7C2.59085 63.7 0.799988 61.9092 0.799988 59.7V4.5C0.799988 2.29086 2.59085 0.5 4.79999 0.5Z"
          />
          <UnderGlowStrip
            id="122_undeglow"
            x={588.9}
            y={419.7}
            onClick={e => {
              setUndeglowIndex(122, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(122)}
            stroke={stroke(122)}
            strokeWidth={getStrokeWidth(122)}
            dataLedIndex={getLEDIndex(122)}
            dataKeyIndex={keyIndex(122)}
            dataLayer={layer}
            path="M4.90002 0.700012C7.10916 0.700012 8.90002 2.49087 8.90002 4.70001V26.2H56.8C59.0091 26.2 60.8 27.9909 60.8 30.2C60.8 32.4092 59.0091 34.2 56.8 34.2H7.29999C3.79072 34.2 0.900024 31.309 0.900024 27.8V4.70001C0.900024 2.49087 2.69089 0.700012 4.90002 0.700012Z"
          />
          <UnderGlowStrip
            id="123_undeglow"
            x={655.9}
            y={445.2}
            onClick={e => {
              setUndeglowIndex(123, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(123)}
            stroke={stroke(123)}
            strokeWidth={getStrokeWidth(123)}
            dataLedIndex={getLEDIndex(123)}
            dataKeyIndex={keyIndex(123)}
            dataLayer={layer}
            path="M0.900024 4.20001C0.900024 1.99087 2.69089 0.200012 4.90002 0.200012H21.9C32.1208 0.200012 41.1202 7.13183 43.6749 17.1076L43.6768 17.115L46.7787 29.4224C47.3186 31.5646 46.0197 33.7388 43.8776 34.2787C41.7354 34.8186 39.5612 33.5197 39.0213 31.3776L35.925 19.0924C35.9245 19.0901 35.9239 19.0879 35.9233 19.0856C34.2757 12.665 28.477 8.20001 21.9 8.20001H4.90002C2.69089 8.20001 0.900024 6.40915 0.900024 4.20001Z"
          />
          <UnderGlowStrip
            id="124_undeglow"
            x={697.1}
            y={483.6}
            onClick={e => {
              setUndeglowIndex(124, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(124)}
            stroke={stroke(124)}
            strokeWidth={getStrokeWidth(124)}
            dataLedIndex={getLEDIndex(124)}
            dataKeyIndex={keyIndex(124)}
            dataLayer={layer}
            path="M3.11746 0.722562C5.25892 0.179929 7.43481 1.47603 7.97744 3.61749L19.1775 47.8175C19.7201 49.9589 18.424 52.1348 16.2825 52.6775C14.1411 53.2201 11.9652 51.924 11.4225 49.7825L0.222531 5.58254C-0.320101 3.44108 0.976003 1.2652 3.11746 0.722562Z"
          />
          <UnderGlowStrip
            id="125_undeglow"
            x={711.2}
            y={539}
            onClick={e => {
              setUndeglowIndex(125, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(125)}
            stroke={stroke(125)}
            strokeWidth={getStrokeWidth(125)}
            dataLedIndex={getLEDIndex(125)}
            dataKeyIndex={keyIndex(125)}
            dataLayer={layer}
            path="M3.20932 0.124611C5.34963 -0.422535 7.52824 0.86898 8.07539 3.00929L21.6754 56.2093C22.2225 58.3496 20.931 60.5282 18.7907 61.0754C16.6504 61.6225 14.4718 60.331 13.9246 58.1907L0.324639 4.99068C-0.222507 2.85037 1.06901 0.671757 3.20932 0.124611Z"
          />
          <UnderGlowStrip
            id="126_undeglow"
            x={727.8}
            y={603.8}
            onClick={e => {
              setUndeglowIndex(126, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(126)}
            stroke={stroke(126)}
            strokeWidth={getStrokeWidth(126)}
            dataLedIndex={getLEDIndex(126)}
            dataKeyIndex={keyIndex(126)}
            dataLayer={layer}
            path="M3.81562 0.923041C5.95683 0.379395 8.13333 1.67447 8.67697 3.81567L20.077 48.7157C20.6206 50.8569 19.3256 53.0334 17.1844 53.577C15.0432 54.1207 12.8667 52.8256 12.323 50.6844L0.922995 5.78439C0.379349 3.64319 1.67442 1.46669 3.81562 0.923041Z"
          />
          <UnderGlowStrip
            id="127_undeglow"
            x={742.6}
            y={662.2}
            onClick={e => {
              setUndeglowIndex(127, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(127)}
            stroke={stroke(127)}
            strokeWidth={getStrokeWidth(127)}
            dataLedIndex={getLEDIndex(127)}
            dataKeyIndex={keyIndex(127)}
            dataLayer={layer}
            path="M3.60223 0.326377C5.74154 -0.224663 7.92251 1.06288 8.47355 3.20219L10.174 9.80375C12.4201 18.5386 20.3284 24.6999 29.4 24.6999H41.3C43.5091 24.6999 45.3 26.4908 45.3 28.6999C45.3 30.9091 43.5091 32.6999 41.3 32.6999H29.4C16.6722 32.6999 5.58087 24.062 2.42643 11.7977C2.42633 11.7973 2.42623 11.7969 2.42614 11.7965C2.4261 11.7964 2.42618 11.7967 2.42614 11.7965L0.726417 5.19769C0.175376 3.05838 1.46292 0.877418 3.60223 0.326377Z"
          />
          <UnderGlowStrip
            id="128_undeglow"
            x={791.3}
            y={686.7}
            onClick={e => {
              setUndeglowIndex(128, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(128)}
            stroke={stroke(128)}
            strokeWidth={getStrokeWidth(128)}
            dataLedIndex={getLEDIndex(128)}
            dataKeyIndex={keyIndex(128)}
            dataLayer={layer}
            path="M0.299988 4.69995C0.299988 2.49081 2.09085 0.699951 4.29999 0.699951H54.1C56.3091 0.699951 58.1 2.49081 58.1 4.69995C58.1 6.90909 56.3091 8.69995 54.1 8.69995H4.29999C2.09085 8.69995 0.299988 6.90909 0.299988 4.69995Z"
          />
          <UnderGlowStrip
            id="129_undeglow"
            x={853.1}
            y={686.7}
            onClick={e => {
              setUndeglowIndex(129, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(129)}
            stroke={stroke(129)}
            strokeWidth={getStrokeWidth(129)}
            dataLedIndex={getLEDIndex(129)}
            dataKeyIndex={keyIndex(129)}
            dataLayer={layer}
            path="M0.0999756 4.69995C0.0999756 2.49081 1.89084 0.699951 4.09998 0.699951H53.8C56.0091 0.699951 57.8 2.49081 57.8 4.69995C57.8 6.90909 56.0091 8.69995 53.8 8.69995H4.09998C1.89084 8.69995 0.0999756 6.90909 0.0999756 4.69995Z"
          />
          <UnderGlowStrip
            id="130_undeglow"
            x={914.8}
            y={686.7}
            onClick={e => {
              setUndeglowIndex(130, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(130)}
            stroke={stroke(130)}
            strokeWidth={getStrokeWidth(130)}
            dataLedIndex={getLEDIndex(130)}
            dataKeyIndex={keyIndex(130)}
            dataLayer={layer}
            path="M0.799988 4.69995C0.799988 2.49081 2.59085 0.699951 4.79999 0.699951H54.6C56.8091 0.699951 58.6 2.49081 58.6 4.69995C58.6 6.90909 56.8091 8.69995 54.6 8.69995H4.79999C2.59085 8.69995 0.799988 6.90909 0.799988 4.69995Z"
          />
          <UnderGlowStrip
            id="131_undeglow"
            x={976.6}
            y={686.7}
            onClick={e => {
              setUndeglowIndex(131, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(131)}
            stroke={stroke(131)}
            strokeWidth={getStrokeWidth(131)}
            dataLedIndex={getLEDIndex(131)}
            dataKeyIndex={keyIndex(131)}
            dataLayer={layer}
            path="M0.599976 4.69995C0.599976 2.49081 2.39084 0.699951 4.59998 0.699951H54.4C56.6092 0.699951 58.4 2.49081 58.4 4.69995C58.4 6.90909 56.6092 8.69995 54.4 8.69995H4.59998C2.39084 8.69995 0.599976 6.90909 0.599976 4.69995Z"
          />
          <UnderGlowStrip
            id="132_undeglow"
            x={1038.4}
            y={686.7}
            onClick={e => {
              setUndeglowIndex(132, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(132)}
            stroke={stroke(132)}
            strokeWidth={getStrokeWidth(132)}
            dataLedIndex={getLEDIndex(132)}
            dataKeyIndex={keyIndex(132)}
            dataLayer={layer}
            path="M0.400024 4.69995C0.400024 2.49081 2.19089 0.699951 4.40002 0.699951H54.1C56.3091 0.699951 58.1 2.49081 58.1 4.69995C58.1 6.90909 56.3091 8.69995 54.1 8.69995H4.40002C2.19089 8.69995 0.400024 6.90909 0.400024 4.69995Z"
          />
          <UnderGlowStrip
            id="133_undeglow"
            x={1100.1}
            y={686.7}
            onClick={e => {
              setUndeglowIndex(133, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(133)}
            stroke={stroke(133)}
            strokeWidth={getStrokeWidth(133)}
            dataLedIndex={getLEDIndex(133)}
            dataKeyIndex={keyIndex(133)}
            dataLayer={layer}
            path="M0.0999756 4.69995C0.0999756 2.49081 1.89084 0.699951 4.09998 0.699951H48.8C51.0092 0.699951 52.8 2.49081 52.8 4.69995C52.8 6.90909 51.0092 8.69995 48.8 8.69995H4.09998C1.89084 8.69995 0.0999756 6.90909 0.0999756 4.69995Z"
          />
          <UnderGlowStrip
            id="134_undeglow"
            x={1156.9}
            y={653}
            onClick={e => {
              setUndeglowIndex(134, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(134)}
            stroke={stroke(134)}
            strokeWidth={getStrokeWidth(134)}
            dataLedIndex={getLEDIndex(134)}
            dataKeyIndex={keyIndex(134)}
            dataLayer={layer}
            path="M41.2494 0.00284587C43.457 0.0853778 45.1797 1.94189 45.0972 4.14949L44.6969 14.8562C44.1131 29.8014 31.85 41.6 16.9 41.6H4.90002C2.69089 41.6 0.900024 39.8092 0.900024 37.6C0.900024 35.3909 2.69089 33.6 4.90002 33.6H16.9C27.5491 33.6 36.2851 25.2003 36.7029 14.547C36.7029 14.546 36.703 14.5449 36.703 14.5439L37.1028 3.85062C37.1853 1.64302 39.0418 -0.0796861 41.2494 0.00284587Z"
          />
          <UnderGlowStrip
            id="135_undeglow"
            x={1193.5}
            y={590.4}
            onClick={e => {
              setUndeglowIndex(135, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(135)}
            stroke={stroke(135)}
            strokeWidth={getStrokeWidth(135)}
            dataLedIndex={getLEDIndex(135)}
            dataKeyIndex={keyIndex(135)}
            dataLayer={layer}
            path="M6.65643 0.403021C8.86388 0.489418 10.5833 2.34895 10.4969 4.5564L8.49694 55.6564C8.41054 57.8638 6.55101 59.5833 4.34356 59.4969C2.13611 59.4105 0.41666 57.5509 0.503057 55.3435L2.50306 4.24352C2.58945 2.03608 4.44898 0.316624 6.65643 0.403021Z"
          />
          <UnderGlowStrip
            id="136_undeglow"
            x={1195.9}
            y={528.2}
            onClick={e => {
              setUndeglowIndex(136, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(136)}
            stroke={stroke(136)}
            strokeWidth={getStrokeWidth(136)}
            dataLedIndex={getLEDIndex(136)}
            dataKeyIndex={keyIndex(136)}
            dataLayer={layer}
            path="M6.95133 0.202868C9.15889 0.286422 10.8807 2.14374 10.7972 4.35129L8.89716 54.5513C8.8136 56.7589 6.95629 58.4807 4.74873 58.3972C2.54117 58.3136 0.819326 56.4563 0.90288 54.2487L2.8029 4.04872C2.88646 1.84116 4.74377 0.119314 6.95133 0.202868Z"
          />
          <UnderGlowStrip
            id="137_undeglow"
            x={1198.2}
            y={464.6}
            onClick={e => {
              setUndeglowIndex(137, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(137)}
            stroke={stroke(137)}
            strokeWidth={getStrokeWidth(137)}
            dataLedIndex={getLEDIndex(137)}
            dataKeyIndex={keyIndex(137)}
            dataLayer={layer}
            path="M6.35487 0.603034C8.56235 0.688595 10.2825 2.54747 10.1969 4.75496L8.19695 56.355C8.11138 58.5624 6.25251 60.2826 4.04502 60.197C1.83754 60.1115 0.117387 58.2526 0.202949 56.0451L2.20295 4.44511C2.28851 2.23763 4.14739 0.517473 6.35487 0.603034Z"
          />
          <UnderGlowStrip
            id="138_undeglow"
            x={1200.6}
            y={402.5}
            onClick={e => {
              setUndeglowIndex(138, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(138)}
            stroke={stroke(138)}
            strokeWidth={getStrokeWidth(138)}
            dataLedIndex={getLEDIndex(138)}
            dataKeyIndex={keyIndex(138)}
            dataLayer={layer}
            path="M6.6495 0.502787C8.85709 0.585356 10.5798 2.4419 10.4972 4.6495L8.59717 55.4495C8.5146 57.6571 6.65806 59.3798 4.45046 59.2972C2.24287 59.2146 0.520194 57.3581 0.602763 55.1505L2.50279 4.35049C2.58536 2.14289 4.4419 0.420218 6.6495 0.502787Z"
          />
          <UnderGlowStrip
            id="139_undeglow"
            x={1203}
            y={339.4}
            onClick={e => {
              setUndeglowIndex(139, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(139)}
            stroke={stroke(139)}
            strokeWidth={getStrokeWidth(139)}
            dataLedIndex={getLEDIndex(139)}
            dataKeyIndex={keyIndex(139)}
            dataLayer={layer}
            path="M6.04864 0.402717C8.25626 0.484802 9.97934 2.34097 9.89725 4.54858L7.99723 55.6486C7.91514 57.8562 6.05898 59.5793 3.85136 59.4972C1.64375 59.4151 -0.0793306 57.5589 0.0027541 55.3513L1.90278 4.25133C1.98486 2.04371 3.84103 0.320633 6.04864 0.402717Z"
          />
          <UnderGlowStrip
            id="140_undeglow"
            x={1186.5}
            y={277.1}
            onClick={e => {
              setUndeglowIndex(140, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(140)}
            stroke={stroke(140)}
            strokeWidth={getStrokeWidth(140)}
            dataLedIndex={getLEDIndex(140)}
            dataKeyIndex={keyIndex(140)}
            dataLayer={layer}
            path="M2.47487 0.650552C4.37995 -0.467912 6.83102 0.169767 7.94948 2.07485L17.0528 17.5805C23.5937 28.7634 27.194 41.4455 27.2999 54.3672C27.3181 56.5763 25.5419 58.3818 23.3329 58.3999C21.1238 58.418 19.3183 56.6418 19.3002 54.4328C19.2061 42.9555 16.0069 31.6387 10.1488 21.6222C10.1483 21.6213 10.1478 21.6204 10.1473 21.6195L1.05058 6.12516C-0.067888 4.22008 0.569791 1.76902 2.47487 0.650552Z"
          />
          <UnderGlowStrip
            id="141_undeglow"
            x={1161}
            y={216.8}
            onClick={e => {
              setUndeglowIndex(141, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(141)}
            stroke={stroke(141)}
            strokeWidth={getStrokeWidth(141)}
            dataLedIndex={getLEDIndex(141)}
            dataKeyIndex={keyIndex(141)}
            dataLayer={layer}
            path="M3.89836 0.801306C6.10679 0.745159 7.94259 2.48993 7.99873 4.69835C8.28164 15.8258 11.3946 26.7557 17.039 36.2571L17.0429 36.2637L26.7429 52.6637C27.8676 54.5651 27.2379 57.0182 25.3364 58.1429C23.435 59.2675 20.9819 58.6378 19.8572 56.7364L10.161 40.343C10.1604 40.3418 10.1597 40.3407 10.159 40.3396C3.8047 29.6418 0.318382 17.3729 0.00131795 4.90168C-0.0548284 2.69325 1.68994 0.857452 3.89836 0.801306Z"
          />
          <UnderGlowStrip
            id="142_undeglow"
            x={1161}
            y={161.5}
            onClick={e => {
              setUndeglowIndex(142, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(142)}
            stroke={stroke(142)}
            strokeWidth={getStrokeWidth(142)}
            dataLedIndex={getLEDIndex(142)}
            dataKeyIndex={keyIndex(142)}
            dataLayer={layer}
            path="M4 0.5C6.20914 0.5 8 2.29086 8 4.5V48C8 50.2091 6.20914 52 4 52C1.79086 52 0 50.2091 0 48V4.5C0 2.29086 1.79086 0.5 4 0.5Z"
          />
          <UnderGlowStrip
            id="143_undeglow"
            x={1161}
            y={105.9}
            onClick={e => {
              setUndeglowIndex(143, e);
            }}
            selectedLED={selectedLED}
            visibility={!!(showUnderglow || isStandardView)}
            clickAble={!(isStandardView && !showUnderglow)}
            fill={getColor(143)}
            stroke={stroke(143)}
            strokeWidth={getStrokeWidth(143)}
            dataLedIndex={getLEDIndex(143)}
            dataKeyIndex={keyIndex(143)}
            dataLayer={layer}
            path="M4 0.900024C6.20914 0.900024 8 2.69089 8 4.90002V48.6C8 50.8092 6.20914 52.6 4 52.6C1.79086 52.6 0 50.8092 0 48.6V4.90002C0 2.69089 1.79086 0.900024 4 0.900024Z"
          />
          {/* End Right side */}
        </g>
      </svg>
    );
  }
}

export default KeymapANSI;

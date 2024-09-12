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
import log from "electron-log/renderer";
import Neuron from "../../hardware/Neuron";
import Key from "../../hardware/Key";
import UnderGlowStrip from "../../hardware/UnderGlowStrip";

const XX = 255;
const LEDS_LEFT_KEYS = 33;
const LEDS_RIGHT_KEYS = 36;
const UNDERGLOW = 108;
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

const leftUnderglowLEDSs = Array(53)
  .fill()
  .map((_, i) => i);
const rightUnderglowLEDSs = Array(54)
  .fill()
  .map((_, i) => i);

class KeymapISO extends React.Component {
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
      //   ? this.props.theme.palette.getContrastText(color)
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
      Array(UNDERGLOW + LEDS_LEFT_KEYS + LEDS_RIGHT_KEYS)
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

    log.info("colormap", colormap, this.props.colormap);

    // console.log("showing BARS", colormap, palette, led_map, no_key_led_map);
    const getColor = (row, col) => {
      const ledIndex =
        col !== undefined ? LedMap[parseInt(row)][parseInt(col)] : NoKeyLedMap[row - LEDS_LEFT_KEYS - LEDS_RIGHT_KEYS];
      const colorIndex = colormap[ledIndex];
      log.info("Row and col", row, NoKeyLedMap.length, colorIndex, colormap);
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
        <span
          className={props.class}
          textAnchor="middle"
          key={props.index}
          x={props.x}
          y={props.y}
          dy={props.dy}
          textLength={props.textLength}
        >
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
    //       ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord, smallKey)
    //       : getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, String(+yCord - 5), smallKey)
    //     : getLabel(row, col).extraLabel === getLabel(row, col).extraLabel.toLowerCase().endsWith("to")
    //       ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord, smallKey)
    //       : getLabel(row, col).extraLabel;

    const getCenterPrimary = (row, col, xCord, yCord, smallKey = false) =>
      getLabel(row, col).extraLabel !== ""
        ? topsArr.includes(getLabel(row, col).extraLabel)
          ? getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, xCord, yCord, smallKey)
          : topsArrTransfer.includes(getLabel(row, col).extraLabel)
            ? getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, String(+xCord + 10), yCord, smallKey)
            : getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, xCord, String(yCord + 2), smallKey)
        : topsArrTransfer.includes(getLabel(row, col).extraLabel)
          ? getLabel(row, col).label &&
            getDivideKeys(getLabel(row, col).label, xCord, yCord, smallKey) &&
            getDivideKeys(getLabel(row, col).label, String(+xCord + 10), yCord, smallKey)
          : getLabel(row, col).label && getDivideKeys(getLabel(row, col).label, xCord, String(yCord + 2), smallKey);

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
            width={57}
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
            keyType="enterKey"
            id="R2C15_keyshape"
            onClick={onClick}
            className="key"
            width={69}
            height={124}
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
            id="R3C0_keyshape"
            onClick={onClick}
            className="key"
            width={67}
            height={57}
            x={84}
            y={keysRowsPosition.row4}
            fill={getColor(3, 0)}
            stroke={stroke(3, 0)}
            strokeWidth={getStrokeWidth(3, 0)}
            dataLedIndex={getLEDIndex(3, 0)}
            dataKeyIndex={keyIndex(3, 0)}
            dataLayer={layer}
            contrastText={getContrastText(getColor(3, 0))}
            centerPrimary={getCenterPrimary(3, 0, 0, 0, true)}
            centerExtra={getCenterExtra(3, 0, 0, 0, true)}
            keyCode={getLabel(3, 0).keyCode}
            selectedKey={getLabel(3, 0)}
          />
          <Key
            keyType="regularKey"
            id="R3C1_keyshape"
            onClick={onClick}
            className="key"
            width={57}
            height={57}
            x={162}
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
            x={229}
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
            x={296}
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
            x={363}
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
            x={430}
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
            x={497}
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
          <g id="underglow-left-side">
            <UnderGlowStrip
              key="underglow_69"
              id="underglow_69"
              x={53}
              y={86}
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
              path="M4.28.4a4 4 0 0 1 4 4v27.7a4 4 0 0 1-8 0V4.4a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_70"
              id="underglow_70"
              x={53}
              y={49}
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
              path="M4.28.37a4 4 0 0 1 4 4V29.5a4 4 0 0 1-8 0V4.37a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_71"
              id="underglow_71"
              x={53}
              y={12}
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
              path="M33.64 3.998A4 4 0 0 1 29.642 8 21.37 21.37 0 0 0 8.28 29.37a4 4 0 0 1-8 0A29.37 29.37 0 0 1 29.639 0a4 4 0 0 1 4.001 3.998"
            />
            <UnderGlowStrip
              key="underglow_72"
              id="underglow_72"
              x={90}
              y={12}
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
              path="M.65 4a4 4 0 0 1 4-4h35.13a4 4 0 1 1 0 8H4.65a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_73"
              id="underglow_73"
              x={139}
              y={12}
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
              path="M.78 4a4 4 0 0 1 4-4h38.38a4 4 0 1 1 0 8H4.78a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_74"
              id="underglow_74"
              x={188}
              y={12}
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
              path="M.16 4a4 4 0 0 1 4-4h38.37a4 4 0 1 1 0 8H4.16a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_75"
              id="underglow_75"
              x={238}
              y={12}
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
              path="M.53 4a4 4 0 0 1 4-4H42.9a4 4 0 1 1 0 8H4.53a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_76"
              id="underglow_76"
              x={288}
              y={12}
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
              path="M.34 4a4 4 0 0 1 4-4h37.72a4 4 0 0 1 0 8H4.34a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_77"
              id="underglow_77"
              x={339}
              y={12}
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
              path="M.28 4a4 4 0 0 1 4-4h39.18a4 4 0 1 1 0 8H4.28a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_78"
              id="underglow_78"
              x={390}
              y={12}
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
              path="M.46 4a4 4 0 0 1 4-4h37.56a4 4 0 0 1 0 8H4.46a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_79"
              id="underglow_79"
              x={440}
              y={12}
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
              path="M.02 4a4 4 0 0 1 4-4h38.37a4 4 0 1 1 0 8H4.02a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_80"
              id="underglow_80"
              x={490}
              y={12}
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
              path="M.39 4a4 4 0 0 1 4-4h39.56a4 4 0 1 1 0 8H4.39a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_81"
              id="underglow_81"
              x={542}
              y={12}
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
              path="M.95 4a4 4 0 0 1 4-4h13.39a8.94 8.94 0 0 1 8.94 8.94V21a4 4 0 0 1-8 0V8.94a.94.94 0 0 0-.94-.94H4.95a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_82"
              id="underglow_82"
              x={561}
              y={41}
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
              path="M4.28 0a4 4 0 0 1 4 4v18.97a4 4 0 0 1-8 0V4a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_83"
              id="underglow_83"
              x={561}
              y={72}
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
              path="M4.28.8a4 4 0 0 1 4 4V30a4 4 0 0 1-8 0V4.8a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_84"
              id="underglow_84"
              x={541}
              y={98}
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
              path="M6.55 0C3.217 0 .523 2.717.526 6.05.53 11.12.5 16.188.5 21.26a4 4 0 0 0 8 0V9a1 1 0 0 1 1-1h2.74a4 4 0 0 0 0-8z"
            />
            <UnderGlowStrip
              key="underglow_85"
              id="underglow_85"
              x={541}
              y={126}
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
              path="M4.72.86a4 4 0 0 1 4 4v18.93a4 4 0 0 1-8 0V4.86a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_86"
              id="underglow_86"
              x={541}
              y={158}
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
              path="M.76 4a4 4 0 0 1 4-4h8.09a8.79 8.79 0 0 1 8.79 8.803V9v-.2 11.6a4 4 0 1 1-8 0V8.792A.79.79 0 0 0 12.85 8H4.76a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_87"
              id="underglow_87"
              x={554}
              y={187}
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
              path="M4.6.69a4 4 0 0 1 4 4v21.06a4 4 0 0 1-8 0V4.69a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_88"
              id="underglow_88"
              x={554}
              y={220}
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
              path="M4.6.75a4 4 0 0 1 4 4v7.65a1.6 1.6 0 0 0 1.6 1.6h17.08a4 4 0 0 1 0 8H10.2a9.6 9.6 0 0 1-9.6-9.6V4.75a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_89"
              id="underglow_89"
              x={576}
              y={245}
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
              path="M4.28.78a4 4 0 0 1 4 4v40.18a4 4 0 0 1-8 0V4.78a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_90"
              id="underglow_90"
              x={557}
              y={298}
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
              path="M9.56 8a1.14 1.14 0 0 0-1.14 1.14v24.5a4 4 0 1 1-8 0V9.14A9.14 9.14 0 0 1 9.56 0h13.72a4 4 0 1 1 0 8z"
            />
            <UnderGlowStrip
              key="underglow_91"
              id="underglow_91"
              x={557}
              y={340}
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
              path="M4.42.28a4 4 0 0 1 4 4v29.93a4 4 0 0 1-8 0V4.28a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_92"
              id="underglow_92"
              x={557}
              y={382}
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
              path="M4.42-.01a4 4 0 0 1 4 4v25.44a4 4 0 0 1-8 0V3.99a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_93"
              id="underglow_93"
              x={528}
              y={420}
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
              path="M33.42.43a4 4 0 0 1 4 4v20.11a8.66 8.66 0 0 1-8.66 8.66H4.36a4 4 0 1 1 0-8h24.4a.66.66 0 0 0 .66-.66V4.43a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_94"
              id="underglow_94"
              x={479.5}
              y={444.8}
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
              path="M.35 4.2a4 4 0 0 1 4-4h35.56a4 4 0 0 1 0 8H4.35a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_95"
              id="underglow_95"
              x={456}
              y={447}
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
              path="M18.647 2.365a4 4 0 0 1-1.082 5.552 16 16 0 0 0-6.56 9.303v.001l-2.489 9.767a4 4 0 1 1-7.752-1.976l2.49-9.773a24 24 0 0 1 9.84-13.956 4 4 0 0 1 5.553 1.082"
            />
            <UnderGlowStrip
              key="underglow_96"
              id="underglow_96"
              x={446}
              y={480}
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
              path="M11.65.944a4 4 0 0 1 2.886 4.866l-5.71 22.36a4 4 0 1 1-7.752-1.98l5.71-22.36A4 4 0 0 1 11.65.944"
            />
            <UnderGlowStrip
              key="underglow_97"
              id="underglow_97"
              x={438}
              y={515}
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
              path="M10.98.904a4 4 0 0 1 2.886 4.866l-5.76 22.55a4 4 0 0 1-7.752-1.98l5.76-22.55A4 4 0 0 1 10.98.904"
            />
            <UnderGlowStrip
              key="underglow_98"
              id="underglow_98"
              x={428}
              y={550}
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
              path="M12.09.714a4 4 0 0 1 2.886 4.866l-6.23 24.4A4 4 0 1 1 .994 28l6.23-24.4A4 4 0 0 1 12.09.714"
            />
            <UnderGlowStrip
              key="underglow_99"
              id="underglow_99"
              x={418}
              y={586}
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
              path="M12.78.165a4 4 0 0 1 2.886 4.865l-7.35 28.76a4 4 0 0 1-7.751-1.98l7.35-28.76A4 4 0 0 1 12.78.165"
            />
            <UnderGlowStrip
              key="underglow_100"
              id="underglow_100"
              x={408}
              y={627}
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
              path="M12.37.894a4 4 0 0 1 2.886 4.865l-6.9 27.03a4 4 0 0 1-7.752-1.978l6.9-27.03A4 4 0 0 1 12.37.894"
            />
            <UnderGlowStrip
              key="underglow_101"
              id="underglow_101"
              x={374}
              y={666}
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
              path="M36.346 1.106a4 4 0 0 1 2.878 4.87l-.446 1.734-.002.008A27.84 27.84 0 0 1 11.802 28.73H4.18a4 4 0 0 1 0-8H11.8A19.84 19.84 0 0 0 31.022 5.75l.002-.008.452-1.758a4 4 0 0 1 4.87-2.878"
            />
            <UnderGlowStrip
              key="underglow_102"
              id="underglow_102"
              x={329.2}
              y={686}
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
              path="M.26 4.73a4 4 0 0 1 4-4h32.49a4 4 0 0 1 0 8H4.26a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_103"
              id="underglow_103"
              x={284.4}
              y={686}
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
              path="M.44 4.73a4 4 0 0 1 4-4H37a4 4 0 0 1 0 8H4.44a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_104"
              id="underglow_104"
              x={240}
              y={686}
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
              path="M.95 4.73a4 4 0 0 1 4-4h32.74a4 4 0 0 1 0 8H4.95a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_105"
              id="underglow_105"
              x={194.8}
              y={686}
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
              path="M.88 4.73a4 4 0 0 1 4-4h33.07a4 4 0 0 1 0 8H4.88a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_106"
              id="underglow_106"
              x={150.2}
              y={686}
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
              path="M.27 4.73a4 4 0 0 1 4-4h32.55a4 4 0 1 1 0 8H4.27a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_107"
              id="underglow_107"
              x={105.7}
              y={686}
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
              path="M.72 4.73a4 4 0 0 1 4-4h32.75a4 4 0 0 1 0 8H4.72a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_108"
              id="underglow_108"
              x={61}
              y={686}
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
              path="M.98 4.73a4 4 0 0 1 4-4h32.46a4 4 0 0 1 0 8H4.98a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_109"
              id="underglow_109"
              x={24}
              y={672.7}
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
              path="M2.342 1.177a4 4 0 0 1 5.381 1.745A19.83 19.83 0 0 0 25.39 13.74h3.25a4 4 0 1 1 0 8h-3.25A27.83 27.83 0 0 1 .598 6.558a4 4 0 0 1 1.745-5.381"
            />
            <UnderGlowStrip
              key="underglow_110"
              id="underglow_110"
              x={20.4}
              y={632.5}
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
              path="M4.28.493A4 4 0 0 1 8.427 4.34l1.07 28.54a4 4 0 0 1-7.994.3L.433 4.64A4 4 0 0 1 4.28.493"
            />
            <UnderGlowStrip
              key="underglow_111"
              id="underglow_111"
              x={18.5}
              y={581.5}
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
              path="M4.36.483A4 4 0 0 1 8.507 4.33l1.44 38.28a4 4 0 0 1-7.994.3L.513 4.63A4 4 0 0 1 4.36.483"
            />
            <UnderGlowStrip
              key="underglow_112"
              id="underglow_112"
              x={16.8}
              y={538}
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
              path="M4.73.003A4 4 0 0 1 8.877 3.85l1.16 30.97a4 4 0 0 1-7.994.3L.883 4.15A4 4 0 0 1 4.73.003"
            />
            <UnderGlowStrip
              key="underglow_113"
              id="underglow_113"
              x={15}
              y={488}
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
              path="M3.86.143A4 4 0 0 1 8.007 3.99l1.41 37.57a4 4 0 1 1-7.994.3L.013 4.29A4 4 0 0 1 3.86.143"
            />
            <UnderGlowStrip
              key="underglow_114"
              id="underglow_114"
              x={13.2}
              y={442}
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
              path="M4.13.113A4 4 0 0 1 8.277 3.96l1.26 33.51a4 4 0 1 1-7.994.3L.283 4.26A4 4 0 0 1 4.13.113"
            />
            <UnderGlowStrip
              key="underglow_115"
              id="underglow_115"
              x={11.2}
              y={388.7}
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
              path="M4.12.713A4 4 0 0 1 8.267 4.56l1.53 40.72a4 4 0 0 1-7.994.3L.273 4.86A4 4 0 0 1 4.12.713"
            />
            <UnderGlowStrip
              key="underglow_116"
              id="underglow_116"
              x={9.6}
              y={344.6}
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
              path="M4.47.693A4 4 0 0 1 8.617 4.54l1.18 31.39a4 4 0 1 1-7.994.3L.623 4.84A4 4 0 0 1 4.47.693"
            />
            <UnderGlowStrip
              key="underglow_117"
              id="underglow_117"
              x={9}
              y={300.4}
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
              path="M10.752.781a4 4 0 0 1 2.177 5.221 65.5 65.5 0 0 0-4.882 27.385v.003l.11 2.877a4 4 0 0 1-7.994.306l-.11-2.883A73.5 73.5 0 0 1 5.53 2.959 4 4 0 0 1 10.752.78"
            />
            <UnderGlowStrip
              key="underglow_118"
              id="underglow_118"
              x={19.8}
              y={259.6}
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
              path="M24.625 1.116a4 4 0 0 1 1.409 5.48l-17.79 30.1a4 4 0 0 1-6.887-4.071l17.79-30.1a4 4 0 0 1 5.478-1.409"
            />
            <UnderGlowStrip
              key="underglow_119"
              id="underglow_119"
              x={43.6}
              y={214}
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
              path="M14.278 0a4 4 0 0 1 4.002 3.998A73.5 73.5 0 0 1 8.085 41.382a4 4 0 1 1-6.89-4.064A65.5 65.5 0 0 0 10.28 4.002 4 4 0 0 1 14.278 0"
            />
            <UnderGlowStrip
              key="underglow_120"
              id="underglow_120"
              x={53.2}
              y={169.3}
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
              path="M4.28.36a4 4 0 0 1 4 4v32.19a4 4 0 0 1-8 0V4.36a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_121"
              id="underglow_121"
              x={53.2}
              y={126}
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
              path="M4.28.08a4 4 0 0 1 4 4v30.88a4 4 0 0 1-8 0V4.08a4 4 0 0 1 4-4"
            />
          </g>
          {/* Right side */}
          <g id="underglow-right-side">
            <UnderGlowStrip
              key="underglow_122"
              id="underglow_122"
              x={1163}
              y={72.3}
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
              path="M4 .23a4 4 0 0 1 4 4V26.7a4 4 0 0 1-8 0V4.23a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_123"
              id="underglow_123"
              x={1163}
              y={37.3}
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
              path="M4 .23a4 4 0 0 1 4 4V26.7a4 4 0 0 1-8 0V4.23a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_124"
              id="underglow_124"
              x={1125}
              y={12}
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
              path="M.25 4a4 4 0 0 1 4-4h12.39a29.38 29.38 0 0 1 25.826 15.373 4 4 0 1 1-7.032 3.814A21.38 21.38 0 0 0 16.64 8H4.25a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_125"
              id="underglow_125"
              x={1074.4}
              y={12}
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
              path="M.43 4a4 4 0 0 1 4-4h38.82a4 4 0 1 1 0 8H4.43a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_126"
              id="underglow_126"
              x={1023.6}
              y={12}
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
              path="M.61 4a4 4 0 0 1 4-4h38.82a4 4 0 0 1 0 8H4.61a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_127"
              id="underglow_127"
              x={972.8}
              y={12}
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
              path="M.79 4a4 4 0 0 1 4-4h38.82a4 4 0 1 1 0 8H4.79a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_128"
              id="underglow_128"
              x={922}
              y={12}
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
              path="M.97 4a4 4 0 0 1 4-4h38.82a4 4 0 0 1 0 8H4.97a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_129"
              id="underglow_129"
              x={871.1}
              y={12}
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
              path="M.15 4a4 4 0 0 1 4-4h38.82a4 4 0 1 1 0 8H4.15a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_130"
              id="underglow_130"
              x={820}
              y={12}
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
              path="M.32 4a4 4 0 0 1 4-4h38.83a4 4 0 0 1 0 8H4.32a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_131"
              id="underglow_131"
              x={770.4}
              y={12}
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
              path="M.41 4a4 4 0 0 1 4-4h37.91a4 4 0 1 1 0 8H4.41a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_132"
              id="underglow_132"
              x={718.7}
              y={12}
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
              path="M.68 4a4 4 0 0 1 4-4H43.5a4 4 0 1 1 0 8H4.68a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_133"
              id="underglow_133"
              x={667.8}
              y={12}
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
              path="M.68 4a4 4 0 0 1 4-4H43.5a4 4 0 1 1 0 8H4.68a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_134"
              id="underglow_134"
              x={617}
              y={12}
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
              path="M.07 4a4 4 0 0 1 4-4h38a4 4 0 0 1 0 8h-38a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_135"
              id="underglow_135"
              x={586}
              y={12}
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
              path="M0 8a8 8 0 0 1 8-8h15.06a4 4 0 0 1 0 8H9a1 1 0 0 0-1 1v10.1a4 4 0 0 1-8 0z"
            />
            <UnderGlowStrip
              key="underglow_136"
              id="underglow_136"
              x={586}
              y={38}
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
              path="M4 .54a4 4 0 0 1 4 4v21.43a4 4 0 0 1-8 0V4.54a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_137"
              id="underglow_137"
              x={586}
              y={71}
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
              path="M4 .97a4 4 0 0 1 4 4v24.87a4 4 0 0 1-8 0V4.97a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_138"
              id="underglow_138"
              x={566}
              y={108}
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
              path="M0 8a8 8 0 0 1 8-8h16a4 4 0 0 1 0 8H9a1 1 0 0 0-1 1v8.58a4 4 0 0 1-8 0z"
            />
            <UnderGlowStrip
              key="underglow_139"
              id="underglow_139"
              x={566}
              y={133.6}
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
              path="M4 .58a4 4 0 0 1 4 4v10.1A1.32 1.32 0 0 0 9.32 16h2.251a9.14 9.14 0 0 1 9.069 9.105V44.12a4 4 0 1 1-8 0V25.13A1.14 1.14 0 0 0 11.519 24H9.32A9.32 9.32 0 0 1 0 14.68V4.58a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_140"
              id="underglow_140"
              x={578.6}
              y={185}
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
              path="M4.68.69a4 4 0 0 1 4 4V33a4 4 0 0 1-8 0V4.69a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_141"
              id="underglow_141"
              x={590.2}
              y={215}
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
              path="M.23 4a4 4 0 0 1 4-4h9.66A9.11 9.11 0 0 1 23 9.11v13.67a4 4 0 1 1-8 0V9.11A1.11 1.11 0 0 0 13.89 8H4.23a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_142"
              id="underglow_142"
              x={605}
              y={245.8}
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
              path="M4 .78a4 4 0 0 1 4 4v38.59a4 4 0 0 1-8 0V4.78a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_143"
              id="underglow_143"
              x={590.8}
              y={296.3}
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
              path="M19.04.37a4 4 0 0 1 4 4V15a9 9 0 0 1-9 9H8.968a.11.11 0 0 0-.108.108V43.81a4 4 0 0 1-8 0V24.09A8.11 8.11 0 0 1 8.95 16h5.09a1 1 0 0 0 1-1V4.37a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_144"
              id="underglow_144"
              x={590.8}
              y={347.8}
              onClick={e => {
                setUndeglowIndex(144, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(144)}
              stroke={stroke(144)}
              strokeWidth={getStrokeWidth(144)}
              dataLedIndex={getLEDIndex(144)}
              dataKeyIndex={keyIndex(144)}
              dataLayer={layer}
              path="M4.86.81a4 4 0 0 1 4 4v23.81a4 4 0 0 1-8 0V4.81a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_145"
              id="underglow_145"
              x={590.8}
              y={383}
              onClick={e => {
                setUndeglowIndex(145, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(145)}
              stroke={stroke(145)}
              strokeWidth={getStrokeWidth(145)}
              dataLedIndex={getLEDIndex(145)}
              dataKeyIndex={keyIndex(145)}
              dataLayer={layer}
              path="M4.86.9a4 4 0 0 1 4 4v24.53a4 4 0 0 1-8 0V4.9a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_146"
              id="underglow_146"
              x={590.8}
              y={420}
              onClick={e => {
                setUndeglowIndex(146, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(146)}
              stroke={stroke(146)}
              strokeWidth={getStrokeWidth(146)}
              dataLedIndex={getLEDIndex(146)}
              dataKeyIndex={keyIndex(146)}
              dataLayer={layer}
              path="M4.86.14a4 4 0 0 1 4 4v18.69a1.37 1.37 0 0 0 1.37 1.37h16.46a4 4 0 0 1 0 8H10.23a9.37 9.37 0 0 1-9.37-9.37V4.14a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_147"
              id="underglow_147"
              x={624.6}
              y={444}
              onClick={e => {
                setUndeglowIndex(147, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(147)}
              stroke={stroke(147)}
              strokeWidth={getStrokeWidth(147)}
              dataLedIndex={getLEDIndex(147)}
              dataKeyIndex={keyIndex(147)}
              dataLayer={layer}
              path="M.69 4.2a4 4 0 0 1 4-4h27.82a4 4 0 1 1 0 8H4.69a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_148"
              id="underglow_148"
              x={664.8}
              y={444}
              onClick={e => {
                setUndeglowIndex(148, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(148)}
              stroke={stroke(148)}
              strokeWidth={getStrokeWidth(148)}
              dataLedIndex={getLEDIndex(148)}
              dataKeyIndex={keyIndex(148)}
              dataLayer={layer}
              path="M.88 4.18a4 4 0 0 1 4-4h5.001a22.52 22.52 0 0 1 21.815 16.95l2.55 10.002a4 4 0 0 1-7.752 1.976l-2.55-9.999A14.52 14.52 0 0 0 9.88 8.18h-5a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_149"
              id="underglow_149"
              x={693.3}
              y={479.7}
              onClick={e => {
                setUndeglowIndex(149, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(149)}
              stroke={stroke(149)}
              strokeWidth={getStrokeWidth(149)}
              dataLedIndex={getLEDIndex(149)}
              dataKeyIndex={keyIndex(149)}
              dataLayer={layer}
              path="M3.35.865a4 4 0 0 1 4.865 2.884l5.73 22.41a4 4 0 0 1-7.75 1.982L.465 5.73A4 4 0 0 1 3.349.865"
            />
            <UnderGlowStrip
              key="underglow_150"
              id="underglow_150"
              x={702}
              y={513.8}
              onClick={e => {
                setUndeglowIndex(150, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(150)}
              stroke={stroke(150)}
              strokeWidth={getStrokeWidth(150)}
              dataLedIndex={getLEDIndex(150)}
              dataKeyIndex={keyIndex(150)}
              dataLayer={layer}
              path="M3.05.904A4 4 0 0 1 7.916 3.79l6.16 24.12a4 4 0 0 1-7.752 1.98L.164 5.77A4 4 0 0 1 3.05.904"
            />
            <UnderGlowStrip
              key="underglow_151"
              id="underglow_151"
              x={711.8}
              y={552.2}
              onClick={e => {
                setUndeglowIndex(151, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(151)}
              stroke={stroke(151)}
              strokeWidth={getStrokeWidth(151)}
              dataLedIndex={getLEDIndex(151)}
              dataKeyIndex={keyIndex(151)}
              dataLayer={layer}
              path="M3.87.344A4 4 0 0 1 8.735 3.23l6.35 24.85a4 4 0 0 1-7.75 1.98L.984 5.21A4 4 0 0 1 3.87.344"
            />
            <UnderGlowStrip
              key="underglow_152"
              id="underglow_152"
              x={720.8}
              y={587.4}
              onClick={e => {
                setUndeglowIndex(152, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(152)}
              stroke={stroke(152)}
              strokeWidth={getStrokeWidth(152)}
              dataLedIndex={getLEDIndex(152)}
              dataKeyIndex={keyIndex(152)}
              dataLayer={layer}
              path="M3.87.574A4 4 0 0 1 8.735 3.46l7 27.41a4 4 0 0 1-7.75 1.98l-7-27.41A4 4 0 0 1 3.87.574"
            />
            <UnderGlowStrip
              key="underglow_153"
              id="underglow_153"
              x={730.8}
              y={626.5}
              onClick={e => {
                setUndeglowIndex(153, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(153)}
              stroke={stroke(153)}
              strokeWidth={getStrokeWidth(153)}
              dataLedIndex={getLEDIndex(153)}
              dataKeyIndex={keyIndex(153)}
              dataLayer={layer}
              path="M3.84.614A4 4 0 0 1 8.706 3.5l7.41 29a4 4 0 1 1-7.751 1.98l-7.41-29A4 4 0 0 1 3.84.614"
            />
            <UnderGlowStrip
              key="underglow_154"
              id="underglow_154"
              x={741.3}
              y={667.7}
              onClick={e => {
                setUndeglowIndex(154, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(154)}
              stroke={stroke(154)}
              strokeWidth={getStrokeWidth(154)}
              dataLedIndex={getLEDIndex(154)}
              dataKeyIndex={keyIndex(154)}
              dataLayer={layer}
              path="M3.4.852A4 4 0 0 1 8.258 3.75 19.84 19.84 0 0 0 27.48 18.73h11.5a4 4 0 1 1 0 8H27.478A27.84 27.84 0 0 1 .502 5.71 4 4 0 0 1 3.4.852"
            />
            <UnderGlowStrip
              key="underglow_155"
              id="underglow_155"
              x={788}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(155, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(155)}
              stroke={stroke(155)}
              strokeWidth={getStrokeWidth(155)}
              dataLedIndex={getLEDIndex(155)}
              dataKeyIndex={keyIndex(155)}
              dataLayer={layer}
              path="M.98 4.73a4 4 0 0 1 4-4h34.38a4 4 0 0 1 0 8H4.98a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_156"
              id="underglow_156"
              x={834.4}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(156, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(156)}
              stroke={stroke(156)}
              strokeWidth={getStrokeWidth(156)}
              dataLedIndex={getLEDIndex(156)}
              dataKeyIndex={keyIndex(156)}
              dataLayer={layer}
              path="M.36 4.73a4 4 0 0 1 4-4h32.85a4 4 0 0 1 0 8H4.36a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_157"
              id="underglow_157"
              x={880.7}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(157, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(157)}
              stroke={stroke(157)}
              strokeWidth={getStrokeWidth(157)}
              dataLedIndex={getLEDIndex(157)}
              dataKeyIndex={keyIndex(157)}
              dataLayer={layer}
              path="M.73 4.73a4 4 0 0 1 4-4h34.38a4 4 0 0 1 0 8H4.73a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_158"
              id="underglow_158"
              x={927}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(158, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(158)}
              stroke={stroke(158)}
              strokeWidth={getStrokeWidth(158)}
              dataLedIndex={getLEDIndex(158)}
              dataKeyIndex={keyIndex(158)}
              dataLayer={layer}
              path="M.11 4.73a4 4 0 0 1 4-4h34.14a4 4 0 0 1 0 8H4.11a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_159"
              id="underglow_159"
              x={973.2}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(159, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(159)}
              stroke={stroke(159)}
              strokeWidth={getStrokeWidth(159)}
              dataLedIndex={getLEDIndex(159)}
              dataKeyIndex={keyIndex(159)}
              dataLayer={layer}
              path="M.25 4.73a4 4 0 0 1 4-4h34.61a4 4 0 0 1 0 8H4.25a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_160"
              id="underglow_160"
              x={1019.8}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(160, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(160)}
              stroke={stroke(160)}
              strokeWidth={getStrokeWidth(160)}
              dataLedIndex={getLEDIndex(160)}
              dataKeyIndex={keyIndex(160)}
              dataLayer={layer}
              path="M.86 4.73a4 4 0 0 1 4-4h34.37a4 4 0 0 1 0 8H4.86a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_161"
              id="underglow_161"
              x={1066.2}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(161, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(161)}
              stroke={stroke(161)}
              strokeWidth={getStrokeWidth(161)}
              dataLedIndex={getLEDIndex(161)}
              dataKeyIndex={keyIndex(161)}
              dataLayer={layer}
              path="M.23 4.73a4 4 0 0 1 4-4h34.38a4 4 0 0 1 0 8H4.23a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_162"
              id="underglow_162"
              x={1112.6}
              y={685.7}
              onClick={e => {
                setUndeglowIndex(162, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(162)}
              stroke={stroke(162)}
              strokeWidth={getStrokeWidth(162)}
              dataLedIndex={getLEDIndex(162)}
              dataKeyIndex={keyIndex(162)}
              dataLayer={layer}
              path="M.61 4.73a4 4 0 0 1 4-4h33.84a4 4 0 1 1 0 8H4.61a4 4 0 0 1-4-4"
            />
            <UnderGlowStrip
              key="underglow_163"
              id="underglow_163"
              x={1158.5}
              y={658}
              onClick={e => {
                setUndeglowIndex(163, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(163)}
              stroke={stroke(163)}
              strokeWidth={getStrokeWidth(163)}
              dataLedIndex={getLEDIndex(163)}
              dataKeyIndex={keyIndex(163)}
              dataLayer={layer}
              path="M41.034.053a4 4 0 0 1 3.853 4.14l-.17 4.73A27.85 27.85 0 0 1 16.891 35.78H4.51a4 4 0 1 1 0-8h12.38A19.85 19.85 0 0 0 36.721 8.637l.17-4.73A4 4 0 0 1 41.035.052"
            />
            <UnderGlowStrip
              key="underglow_164"
              id="underglow_164"
              x={1195.5}
              y={617}
              onClick={e => {
                setUndeglowIndex(164, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(164)}
              stroke={stroke(164)}
              strokeWidth={getStrokeWidth(164)}
              dataLedIndex={getLEDIndex(164)}
              dataKeyIndex={keyIndex(164)}
              dataLayer={layer}
              path="M5.59.963A4 4 0 0 1 9.437 5.11L8.347 34.2a4 4 0 0 1-7.994-.3l1.09-29.09A4 4 0 0 1 5.59.963"
            />
            <UnderGlowStrip
              key="underglow_165"
              id="underglow_165"
              x={1196.8}
              y={576}
              onClick={e => {
                setUndeglowIndex(165, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(165)}
              stroke={stroke(165)}
              strokeWidth={getStrokeWidth(165)}
              dataLedIndex={getLEDIndex(165)}
              dataKeyIndex={keyIndex(165)}
              dataLayer={layer}
              path="M6.13.053A4 4 0 0 1 9.978 4.2l-1.09 28.91a4 4 0 1 1-7.994-.302L1.983 3.9A4 4 0 0 1 6.131.053"
            />
            <UnderGlowStrip
              key="underglow_166"
              id="underglow_166"
              x={1198.4}
              y={533.2}
              onClick={e => {
                setUndeglowIndex(166, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(166)}
              stroke={stroke(166)}
              strokeWidth={getStrokeWidth(166)}
              dataLedIndex={getLEDIndex(166)}
              dataKeyIndex={keyIndex(166)}
              dataLayer={layer}
              path="M5.741.203A4 4 0 0 1 9.587 4.35l-1.15 30.39a4 4 0 0 1-7.994-.302l1.15-30.39A4 4 0 0 1 5.74.203"
            />
            <UnderGlowStrip
              key="underglow_167"
              id="underglow_167"
              x={1200}
              y={489}
              onClick={e => {
                setUndeglowIndex(167, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(167)}
              stroke={stroke(167)}
              strokeWidth={getStrokeWidth(167)}
              dataLedIndex={getLEDIndex(167)}
              dataKeyIndex={keyIndex(167)}
              dataLayer={layer}
              path="M5.39.063a4 4 0 0 1 3.847 4.146l-1.2 32.14a4 4 0 0 1-7.994-.298l1.2-32.14A4 4 0 0 1 5.389.063"
            />
            <UnderGlowStrip
              key="underglow_168"
              id="underglow_168"
              x={1201.7}
              y={438.9}
              onClick={e => {
                setUndeglowIndex(168, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(168)}
              stroke={stroke(168)}
              strokeWidth={getStrokeWidth(168)}
              dataLedIndex={getLEDIndex(168)}
              dataKeyIndex={keyIndex(168)}
              dataLayer={layer}
              path="M6.281.913a4 4 0 0 1 3.846 4.148L8.687 43.2a4 4 0 1 1-7.994-.302l1.44-38.14A4 4 0 0 1 6.28.913"
            />
            <UnderGlowStrip
              key="underglow_169"
              id="underglow_169"
              x={1203.6}
              y={389.5}
              onClick={e => {
                setUndeglowIndex(169, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(169)}
              stroke={stroke(169)}
              strokeWidth={getStrokeWidth(169)}
              dataLedIndex={getLEDIndex(169)}
              dataKeyIndex={keyIndex(169)}
              dataLayer={layer}
              path="M6.13.513A4 4 0 0 1 9.977 4.66l-1.4 37.41a4 4 0 1 1-7.994-.3l1.4-37.41A4 4 0 0 1 6.13.513"
            />
            <UnderGlowStrip
              key="underglow_170"
              id="underglow_170"
              x={1205.4}
              y={346.2}
              onClick={e => {
                setUndeglowIndex(170, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(170)}
              stroke={stroke(170)}
              strokeWidth={getStrokeWidth(170)}
              dataLedIndex={getLEDIndex(170)}
              dataKeyIndex={keyIndex(170)}
              dataLayer={layer}
              path="M5.76.253A4 4 0 0 1 9.608 4.4l-1.16 30.73a4 4 0 1 1-7.994-.302L1.613 4.1A4 4 0 0 1 5.76.253"
            />
            <UnderGlowStrip
              key="underglow_171"
              id="underglow_171"
              x={1196}
              y={289}
              onClick={e => {
                setUndeglowIndex(171, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(171)}
              stroke={stroke(171)}
              strokeWidth={getStrokeWidth(171)}
              dataLedIndex={getLEDIndex(171)}
              dataKeyIndex={keyIndex(171)}
              dataLayer={layer}
              path="M2.055.556a4 4 0 0 1 5.479 1.41l1.53 2.59a73.47 73.47 0 0 1 10.163 40.182v.005l-.17 4.701a4 4 0 0 1-7.994-.288l.17-4.71v-.01A65.47 65.47 0 0 0 2.176 8.626l-1.53-2.59A4 4 0 0 1 2.056.555"
            />
            <UnderGlowStrip
              key="underglow_172"
              id="underglow_172"
              x={1171.5}
              y={247.3}
              onClick={e => {
                setUndeglowIndex(172, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(172)}
              stroke={stroke(172)}
              strokeWidth={getStrokeWidth(172)}
              dataLedIndex={getLEDIndex(172)}
              dataKeyIndex={keyIndex(172)}
              dataLayer={layer}
              path="M2.61.775A4 4 0 0 1 8.025 2.41c.347.647.68 1.23.996 1.721l.043.066 17.13 28.988a4 4 0 0 1-6.888 4.07L2.254 8.399A34 34 0 0 1 .974 6.19 4 4 0 0 1 2.61.775"
            />
            <UnderGlowStrip
              key="underglow_173"
              id="underglow_173"
              x={1163}
              y={200.4}
              onClick={e => {
                setUndeglowIndex(173, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(173)}
              stroke={stroke(173)}
              strokeWidth={getStrokeWidth(173)}
              dataLedIndex={getLEDIndex(173)}
              dataKeyIndex={keyIndex(173)}
              dataLayer={layer}
              path="M4 .46a4 4 0 0 1 4 4V18a65.5 65.5 0 0 0 3.6 21.432 4 4 0 1 1-7.56 2.616A73.5 73.5 0 0 1 0 18V4.46a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_174"
              id="underglow_174"
              x={1163}
              y={152.2}
              onClick={e => {
                setUndeglowIndex(174, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(174)}
              stroke={stroke(174)}
              strokeWidth={getStrokeWidth(174)}
              dataLedIndex={getLEDIndex(174)}
              dataKeyIndex={keyIndex(174)}
              dataLayer={layer}
              path="M4 .22a4 4 0 0 1 4 4v36.24a4 4 0 0 1-8 0V4.22a4 4 0 0 1 4-4"
            />
            <UnderGlowStrip
              key="underglow_175"
              id="underglow_175"
              x={1163}
              y={106.7}
              onClick={e => {
                setUndeglowIndex(175, e);
              }}
              selectedLED={selectedLED}
              visibility={!!(showUnderglow || isStandardView)}
              clickAble={!(isStandardView && !showUnderglow)}
              fill={getColor(175)}
              stroke={stroke(175)}
              strokeWidth={getStrokeWidth(175)}
              dataLedIndex={getLEDIndex(175)}
              dataKeyIndex={keyIndex(175)}
              dataLayer={layer}
              path="M4 .7a4 4 0 0 1 4 4v33.52a4 4 0 1 1-8 0V4.7a4 4 0 0 1 4-4"
            />
          </g>
          {/* End Right side */}
        </g>
      </svg>
    );
  }
}

export default KeymapISO;

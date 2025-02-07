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

    // log.info("colormap", colormap, this.props.colormap);

    // console.log("showing BARS", colormap, palette, led_map, no_key_led_map);
    const getColor = (row, col) => {
      const ledIndex =
        col !== undefined ? LedMap[parseInt(row)][parseInt(col)] : NoKeyLedMap[row - LEDS_LEFT_KEYS - LEDS_RIGHT_KEYS];
      const colorIndex = colormap[ledIndex];
      // log.info("Row and col", row, NoKeyLedMap.length, colorIndex, colormap);
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

    const genKey = (kRow, kCol, kX, kY) => (
      <Key
        keyType="regularKey"
        id={`R${kRow}C${kCol}_keyshape`}
        onClick={onClick}
        className="key"
        width={57}
        height={57}
        x={kX}
        y={kY}
        fill={getColor(kRow, kCol)}
        stroke={stroke(kRow, kCol)}
        strokeWidth={getStrokeWidth(kRow, kCol)}
        dataLedIndex={getLEDIndex(kRow, kCol)}
        dataKeyIndex={keyIndex(kRow, kCol)}
        dataLayer={layer}
        contrastText={getContrastText(getColor(kRow, kCol))}
        centerPrimary={getCenterPrimary(kRow, kCol, 0, 0, true)}
        centerExtra={getCenterExtra(kRow, kCol, 0, 0, true)}
        keyCode={getLabel(kRow, kCol).keyCode}
        selectedKey={getLabel(kRow, kCol)}
      />
    );

    const genUG = (ugPos, x, y, path) => (
      <UnderGlowStrip
        key={`underglow_${ugPos}`}
        id={`underglow_${ugPos}`}
        x={x}
        y={y}
        onClick={e => {
          setUndeglowIndex(ugPos, e);
        }}
        selectedLED={selectedLED}
        visibility={!!(showUnderglow || isStandardView)}
        clickAble={!(isStandardView && !showUnderglow)}
        fill={getColor(ugPos)}
        stroke={stroke(ugPos)}
        strokeWidth={getStrokeWidth(ugPos)}
        dataLedIndex={getLEDIndex(ugPos)}
        dataKeyIndex={keyIndex(ugPos)}
        dataLayer={layer}
        path={path}
      />
    );

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
          {genKey(0, 0, 84, keysRowsPosition.row1)}
          {genKey(0, 1, 151, keysRowsPosition.row1)}
          {genKey(0, 2, 218, keysRowsPosition.row1)}
          {genKey(0, 3, 285, keysRowsPosition.row1)}
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
          {/* prettier-ignore */}
          <g id="underglow-left-side">
            {genUG(69,53,12,"M33.64 3.998A4 4 0 0 1 29.642 8 21.37 21.37 0 0 0 8.28 29.37a4 4 0 0 1-8 0A29.37 29.37 0 0 1 29.639 0a4 4 0 0 1 4.001 3.998",)}
            {genUG(70, 90, 12, "M.65 4a4 4 0 0 1 4-4h35.13a4 4 0 1 1 0 8H4.65a4 4 0 0 1-4-4")}
            {genUG(71, 139, 12, "M.78 4a4 4 0 0 1 4-4h38.38a4 4 0 1 1 0 8H4.78a4 4 0 0 1-4-4")}
            {genUG(72, 188, 12, "M.16 4a4 4 0 0 1 4-4h38.37a4 4 0 1 1 0 8H4.16a4 4 0 0 1-4-4")}
            {genUG(73, 238, 12, "M.53 4a4 4 0 0 1 4-4H42.9a4 4 0 1 1 0 8H4.53a4 4 0 0 1-4-4")}
            {genUG(74, 288, 12, "M.34 4a4 4 0 0 1 4-4h37.72a4 4 0 0 1 0 8H4.34a4 4 0 0 1-4-4")}
            {genUG(75, 339, 12, "M.28 4a4 4 0 0 1 4-4h39.18a4 4 0 1 1 0 8H4.28a4 4 0 0 1-4-4")}
            {genUG(76, 390, 12, "M.46 4a4 4 0 0 1 4-4h37.56a4 4 0 0 1 0 8H4.46a4 4 0 0 1-4-4")}
            {genUG(77, 440, 12, "M.02 4a4 4 0 0 1 4-4h38.37a4 4 0 1 1 0 8H4.02a4 4 0 0 1-4-4")}
            {genUG(78, 490, 12, "M.39 4a4 4 0 0 1 4-4h39.56a4 4 0 1 1 0 8H4.39a4 4 0 0 1-4-4")}
            {genUG(79,542,12,"M.95 4a4 4 0 0 1 4-4h13.39a8.94 8.94 0 0 1 8.94 8.94V21a4 4 0 0 1-8 0V8.94a.94.94 0 0 0-.94-.94H4.95a4 4 0 0 1-4-4",)}
            {genUG(80, 561, 41, "M4.28 0a4 4 0 0 1 4 4v18.97a4 4 0 0 1-8 0V4a4 4 0 0 1 4-4")}
            {genUG(81, 561, 72, "M4.28.8a4 4 0 0 1 4 4V30a4 4 0 0 1-8 0V4.8a4 4 0 0 1 4-4")}
            {genUG(82,541,98,"M6.55 0C3.217 0 .523 2.717.526 6.05.53 11.12.5 16.188.5 21.26a4 4 0 0 0 8 0V9a1 1 0 0 1 1-1h2.74a4 4 0 0 0 0-8z",)}
            {genUG(83, 541, 126, "M4.72.86a4 4 0 0 1 4 4v18.93a4 4 0 0 1-8 0V4.86a4 4 0 0 1 4-4")}
            {genUG(84,541,158,"M.76 4a4 4 0 0 1 4-4h8.09a8.79 8.79 0 0 1 8.79 8.803V9v-.2 11.6a4 4 0 1 1-8 0V8.792A.79.79 0 0 0 12.85 8H4.76a4 4 0 0 1-4-4",)}
            {genUG(85, 554, 187, "M4.6.69a4 4 0 0 1 4 4v21.06a4 4 0 0 1-8 0V4.69a4 4 0 0 1 4-4")}
            {genUG(86,554,220,"M4.6.75a4 4 0 0 1 4 4v7.65a1.6 1.6 0 0 0 1.6 1.6h17.08a4 4 0 0 1 0 8H10.2a9.6 9.6 0 0 1-9.6-9.6V4.75a4 4 0 0 1 4-4",)}
            {genUG(87, 576, 245, "M4.28.78a4 4 0 0 1 4 4v40.18a4 4 0 0 1-8 0V4.78a4 4 0 0 1 4-4")}
            {genUG(88,557,298,"M9.56 8a1.14 1.14 0 0 0-1.14 1.14v24.5a4 4 0 1 1-8 0V9.14A9.14 9.14 0 0 1 9.56 0h13.72a4 4 0 1 1 0 8z",)}
            {genUG(89, 557, 340, "M4.42.28a4 4 0 0 1 4 4v29.93a4 4 0 0 1-8 0V4.28a4 4 0 0 1 4-4")}
            {genUG(90, 557, 382, "M4.42-.01a4 4 0 0 1 4 4v25.44a4 4 0 0 1-8 0V3.99a4 4 0 0 1 4-4")}
            {genUG(91,528,420,"M33.42.43a4 4 0 0 1 4 4v20.11a8.66 8.66 0 0 1-8.66 8.66H4.36a4 4 0 1 1 0-8h24.4a.66.66 0 0 0 .66-.66V4.43a4 4 0 0 1 4-4",)}
            {genUG(92, 479.5, 444.8, "M.35 4.2a4 4 0 0 1 4-4h35.56a4 4 0 0 1 0 8H4.35a4 4 0 0 1-4-4")}
            {genUG(93,456,447,"M18.647 2.365a4 4 0 0 1-1.082 5.552 16 16 0 0 0-6.56 9.303v.001l-2.489 9.767a4 4 0 1 1-7.752-1.976l2.49-9.773a24 24 0 0 1 9.84-13.956 4 4 0 0 1 5.553 1.082",)}
            {genUG(94,446,480,"M11.65.944a4 4 0 0 1 2.886 4.866l-5.71 22.36a4 4 0 1 1-7.752-1.98l5.71-22.36A4 4 0 0 1 11.65.944",)}
            {genUG(95,438,515,"M10.98.904a4 4 0 0 1 2.886 4.866l-5.76 22.55a4 4 0 0 1-7.752-1.98l5.76-22.55A4 4 0 0 1 10.98.904",)}
            {genUG(96, 428, 550, "M12.09.714a4 4 0 0 1 2.886 4.866l-6.23 24.4A4 4 0 1 1 .994 28l6.23-24.4A4 4 0 0 1 12.09.714")}
            {genUG(97,418,586,"M12.78.165a4 4 0 0 1 2.886 4.865l-7.35 28.76a4 4 0 0 1-7.751-1.98l7.35-28.76A4 4 0 0 1 12.78.165",)}
            {genUG(98,408,627,"M12.37.894a4 4 0 0 1 2.886 4.865l-6.9 27.03a4 4 0 0 1-7.752-1.978l6.9-27.03A4 4 0 0 1 12.37.894",)}
            {genUG(99,374,666,"M36.346 1.106a4 4 0 0 1 2.878 4.87l-.446 1.734-.002.008A27.84 27.84 0 0 1 11.802 28.73H4.18a4 4 0 0 1 0-8H11.8A19.84 19.84 0 0 0 31.022 5.75l.002-.008.452-1.758a4 4 0 0 1 4.87-2.878",)}
            {genUG(100, 329.2, 686, "M.26 4.73a4 4 0 0 1 4-4h32.49a4 4 0 0 1 0 8H4.26a4 4 0 0 1-4-4")}
            {genUG(101, 284.4, 686, "M.44 4.73a4 4 0 0 1 4-4H37a4 4 0 0 1 0 8H4.44a4 4 0 0 1-4-4")}
            {genUG(102, 240, 686, "M.95 4.73a4 4 0 0 1 4-4h32.74a4 4 0 0 1 0 8H4.95a4 4 0 0 1-4-4")}
            {genUG(103, 194.8, 686, "M.88 4.73a4 4 0 0 1 4-4h33.07a4 4 0 0 1 0 8H4.88a4 4 0 0 1-4-4")}
            {genUG(104, 150.2, 686, "M.27 4.73a4 4 0 0 1 4-4h32.55a4 4 0 1 1 0 8H4.27a4 4 0 0 1-4-4")}
            {genUG(105, 105.7, 686, "M.72 4.73a4 4 0 0 1 4-4h32.75a4 4 0 0 1 0 8H4.72a4 4 0 0 1-4-4")}
            {genUG(106, 61, 686, "M.98 4.73a4 4 0 0 1 4-4h32.46a4 4 0 0 1 0 8H4.98a4 4 0 0 1-4-4")}
            {genUG(107, 24, 672.7, "M2.342 1.177a4 4 0 0 1 5.381 1.745A19.83 19.83 0 0 0 25.39 13.74h3.25a4 4 0 1 1 0 8h-3.25A27.83 27.83 0 0 1 .598 6.558a4 4 0 0 1 1.745-5.381")}
            {genUG(108, 20.4, 632.5, "M4.28.493A4 4 0 0 1 8.427 4.34l1.07 28.54a4 4 0 0 1-7.994.3L.433 4.64A4 4 0 0 1 4.28.493")}
            {genUG(109, 18.5, 581.5, "M4.36.483A4 4 0 0 1 8.507 4.33l1.44 38.28a4 4 0 0 1-7.994.3L.513 4.63A4 4 0 0 1 4.36.483")}
            {genUG(110, 16.8, 538, "M4.73.003A4 4 0 0 1 8.877 3.85l1.16 30.97a4 4 0 0 1-7.994.3L.883 4.15A4 4 0 0 1 4.73.003")}
            {genUG(111, 15, 488, "M3.86.143A4 4 0 0 1 8.007 3.99l1.41 37.57a4 4 0 1 1-7.994.3L.013 4.29A4 4 0 0 1 3.86.143")}
            {genUG(112, 13.2, 442, "M4.13.113A4 4 0 0 1 8.277 3.96l1.26 33.51a4 4 0 1 1-7.994.3L.283 4.26A4 4 0 0 1 4.13.113")}
            {genUG(113, 11.2, 388.7, "M4.12.713A4 4 0 0 1 8.267 4.56l1.53 40.72a4 4 0 0 1-7.994.3L.273 4.86A4 4 0 0 1 4.12.713")}
            {genUG(114, 9.6, 344.6, "M4.47.693A4 4 0 0 1 8.617 4.54l1.18 31.39a4 4 0 1 1-7.994.3L.623 4.84A4 4 0 0 1 4.47.693")}
            {genUG(115, 9, 300.4, "M10.752.781a4 4 0 0 1 2.177 5.221 65.5 65.5 0 0 0-4.882 27.385v.003l.11 2.877a4 4 0 0 1-7.994.306l-.11-2.883A73.5 73.5 0 0 1 5.53 2.959 4 4 0 0 1 10.752.78")}
            {genUG(116, 19.8, 259.6, "M24.625 1.116a4 4 0 0 1 1.409 5.48l-17.79 30.1a4 4 0 0 1-6.887-4.071l17.79-30.1a4 4 0 0 1 5.478-1.409")}
            {genUG(117, 43.6, 214, "M14.278 0a4 4 0 0 1 4.002 3.998A73.5 73.5 0 0 1 8.085 41.382a4 4 0 1 1-6.89-4.064A65.5 65.5 0 0 0 10.28 4.002 4 4 0 0 1 14.278 0")}
            {genUG(118, 53.2, 169.3, "M4.28.36a4 4 0 0 1 4 4v32.19a4 4 0 0 1-8 0V4.36a4 4 0 0 1 4-4")}
            {genUG(119, 53.2, 126, "M4.28.08a4 4 0 0 1 4 4v30.88a4 4 0 0 1-8 0V4.08a4 4 0 0 1 4-4")}
            {genUG(120, 53, 86, "M4.28.4a4 4 0 0 1 4 4v27.7a4 4 0 0 1-8 0V4.4a4 4 0 0 1 4-4")}
            {genUG(121, 53, 49, "M4.28.37a4 4 0 0 1 4 4V29.5a4 4 0 0 1-8 0V4.37a4 4 0 0 1 4-4")}
          </g>
          {/* Right side */}
          {/* prettier-ignore */}
          <g id="underglow-right-side">
            {genUG(122, 1163, 37.3, "M4 .23a4 4 0 0 1 4 4V26.7a4 4 0 0 1-8 0V4.23a4 4 0 0 1 4-4")}
            {genUG(123, 1125, 12, "M.25 4a4 4 0 0 1 4-4h12.39a29.38 29.38 0 0 1 25.826 15.373 4 4 0 1 1-7.032 3.814A21.38 21.38 0 0 0 16.64 8H4.25a4 4 0 0 1-4-4")}
            {genUG(124, 1074.4, 12, "M.43 4a4 4 0 0 1 4-4h38.82a4 4 0 1 1 0 8H4.43a4 4 0 0 1-4-4")}
            {genUG(125, 1023.6, 12, "M.61 4a4 4 0 0 1 4-4h38.82a4 4 0 0 1 0 8H4.61a4 4 0 0 1-4-4")}
            {genUG(126, 972.8, 12, "M.79 4a4 4 0 0 1 4-4h38.82a4 4 0 1 1 0 8H4.79a4 4 0 0 1-4-4")}
            {genUG(127, 922, 12, "M.97 4a4 4 0 0 1 4-4h38.82a4 4 0 0 1 0 8H4.97a4 4 0 0 1-4-4")}
            {genUG(128, 871.1, 12, "M.15 4a4 4 0 0 1 4-4h38.82a4 4 0 1 1 0 8H4.15a4 4 0 0 1-4-4")}
            {genUG(129, 820, 12, "M.32 4a4 4 0 0 1 4-4h38.83a4 4 0 0 1 0 8H4.32a4 4 0 0 1-4-4")}
            {genUG(130, 770.4, 12, "M.41 4a4 4 0 0 1 4-4h37.91a4 4 0 1 1 0 8H4.41a4 4 0 0 1-4-4")}
            {genUG(131, 718.7, 12, "M.68 4a4 4 0 0 1 4-4H43.5a4 4 0 1 1 0 8H4.68a4 4 0 0 1-4-4")}
            {genUG(132, 667.8, 12, "M.68 4a4 4 0 0 1 4-4H43.5a4 4 0 1 1 0 8H4.68a4 4 0 0 1-4-4")}
            {genUG(133, 617, 12, "M.07 4a4 4 0 0 1 4-4h38a4 4 0 0 1 0 8h-38a4 4 0 0 1-4-4")}
            {genUG(134, 586, 12, "M0 8a8 8 0 0 1 8-8h15.06a4 4 0 0 1 0 8H9a1 1 0 0 0-1 1v10.1a4 4 0 0 1-8 0z")}
            {genUG(135, 586, 38, "M4 .54a4 4 0 0 1 4 4v21.43a4 4 0 0 1-8 0V4.54a4 4 0 0 1 4-4")}
            {genUG(136, 586, 71, "M4 .97a4 4 0 0 1 4 4v24.87a4 4 0 0 1-8 0V4.97a4 4 0 0 1 4-4")}
            {genUG(137, 566, 108, "M0 8a8 8 0 0 1 8-8h16a4 4 0 0 1 0 8H9a1 1 0 0 0-1 1v8.58a4 4 0 0 1-8 0z")}
            {genUG(138, 566, 133.6, "M4 .58a4 4 0 0 1 4 4v10.1A1.32 1.32 0 0 0 9.32 16h2.251a9.14 9.14 0 0 1 9.069 9.105V44.12a4 4 0 1 1-8 0V25.13A1.14 1.14 0 0 0 11.519 24H9.32A9.32 9.32 0 0 1 0 14.68V4.58a4 4 0 0 1 4-4")}
            {genUG(139, 578.6, 185, "M4.68.69a4 4 0 0 1 4 4V33a4 4 0 0 1-8 0V4.69a4 4 0 0 1 4-4")}
            {genUG(140, 590.2, 215, "M.23 4a4 4 0 0 1 4-4h9.66A9.11 9.11 0 0 1 23 9.11v13.67a4 4 0 1 1-8 0V9.11A1.11 1.11 0 0 0 13.89 8H4.23a4 4 0 0 1-4-4")}
            {genUG(141, 605, 245.8, "M4 .78a4 4 0 0 1 4 4v38.59a4 4 0 0 1-8 0V4.78a4 4 0 0 1 4-4")}
            {genUG(142, 590.8, 296.3, "M19.04.37a4 4 0 0 1 4 4V15a9 9 0 0 1-9 9H8.968a.11.11 0 0 0-.108.108V43.81a4 4 0 0 1-8 0V24.09A8.11 8.11 0 0 1 8.95 16h5.09a1 1 0 0 0 1-1V4.37a4 4 0 0 1 4-4")}
            {genUG(143, 590.8, 347.8, "M4.86.81a4 4 0 0 1 4 4v23.81a4 4 0 0 1-8 0V4.81a4 4 0 0 1 4-4")}
            {genUG(144, 590.8, 383, "M4.86.9a4 4 0 0 1 4 4v24.53a4 4 0 0 1-8 0V4.9a4 4 0 0 1 4-4")}
            {genUG(145, 590.8, 420, "M4.86.14a4 4 0 0 1 4 4v18.69a1.37 1.37 0 0 0 1.37 1.37h16.46a4 4 0 0 1 0 8H10.23a9.37 9.37 0 0 1-9.37-9.37V4.14a4 4 0 0 1 4-4")}
            {genUG(146, 624.6, 444, "M.69 4.2a4 4 0 0 1 4-4h27.82a4 4 0 1 1 0 8H4.69a4 4 0 0 1-4-4")}
            {genUG(147, 664.8, 444, "M.88 4.18a4 4 0 0 1 4-4h5.001a22.52 22.52 0 0 1 21.815 16.95l2.55 10.002a4 4 0 0 1-7.752 1.976l-2.55-9.999A14.52 14.52 0 0 0 9.88 8.18h-5a4 4 0 0 1-4-4")}
            {genUG(148, 693.3, 479.7, "M3.35.865a4 4 0 0 1 4.865 2.884l5.73 22.41a4 4 0 0 1-7.75 1.982L.465 5.73A4 4 0 0 1 3.349.865")}
            {genUG(149, 702, 513.8, "M3.05.904A4 4 0 0 1 7.916 3.79l6.16 24.12a4 4 0 0 1-7.752 1.98L.164 5.77A4 4 0 0 1 3.05.904")}
            {genUG(150, 711.8, 552.2, "M3.87.344A4 4 0 0 1 8.735 3.23l6.35 24.85a4 4 0 0 1-7.75 1.98L.984 5.21A4 4 0 0 1 3.87.344")}
            {genUG(151, 720.8, 587.4, "M3.87.574A4 4 0 0 1 8.735 3.46l7 27.41a4 4 0 0 1-7.75 1.98l-7-27.41A4 4 0 0 1 3.87.574")}
            {genUG(152, 730.8, 626.5, "M3.84.614A4 4 0 0 1 8.706 3.5l7.41 29a4 4 0 1 1-7.751 1.98l-7.41-29A4 4 0 0 1 3.84.614")}
            {genUG(153, 741.3, 667.7, "M3.4.852A4 4 0 0 1 8.258 3.75 19.84 19.84 0 0 0 27.48 18.73h11.5a4 4 0 1 1 0 8H27.478A27.84 27.84 0 0 1 .502 5.71 4 4 0 0 1 3.4.852")}
            {genUG(154, 788, 685.7, "M.98 4.73a4 4 0 0 1 4-4h34.38a4 4 0 0 1 0 8H4.98a4 4 0 0 1-4-4")}
            {genUG(155, 834.4, 685.7, "M.36 4.73a4 4 0 0 1 4-4h32.85a4 4 0 0 1 0 8H4.36a4 4 0 0 1-4-4")}
            {genUG(156, 880.7, 685.7, "M.73 4.73a4 4 0 0 1 4-4h34.38a4 4 0 0 1 0 8H4.73a4 4 0 0 1-4-4")}
            {genUG(157, 927, 685.7, "M.11 4.73a4 4 0 0 1 4-4h34.14a4 4 0 0 1 0 8H4.11a4 4 0 0 1-4-4")}
            {genUG(158, 973.2, 685.7, "M.25 4.73a4 4 0 0 1 4-4h34.61a4 4 0 0 1 0 8H4.25a4 4 0 0 1-4-4")}
            {genUG(159, 1019.8, 685.7, "M.86 4.73a4 4 0 0 1 4-4h34.37a4 4 0 0 1 0 8H4.86a4 4 0 0 1-4-4")}
            {genUG(160, 1066.2, 685.7, "M.23 4.73a4 4 0 0 1 4-4h34.38a4 4 0 0 1 0 8H4.23a4 4 0 0 1-4-4")}
            {genUG(161, 1112.6, 685.7, "M.61 4.73a4 4 0 0 1 4-4h33.84a4 4 0 1 1 0 8H4.61a4 4 0 0 1-4-4")}
            {genUG(162, 1158.5, 658, "M41.034.053a4 4 0 0 1 3.853 4.14l-.17 4.73A27.85 27.85 0 0 1 16.891 35.78H4.51a4 4 0 1 1 0-8h12.38A19.85 19.85 0 0 0 36.721 8.637l.17-4.73A4 4 0 0 1 41.035.052")}
            {genUG(163, 1195.5, 617, "M5.59.963A4 4 0 0 1 9.437 5.11L8.347 34.2a4 4 0 0 1-7.994-.3l1.09-29.09A4 4 0 0 1 5.59.963")}
            {genUG(164, 1196.8, 576, "M6.13.053A4 4 0 0 1 9.978 4.2l-1.09 28.91a4 4 0 1 1-7.994-.302L1.983 3.9A4 4 0 0 1 6.131.053")}
            {genUG(165, 1198.4, 533.2, "M5.741.203A4 4 0 0 1 9.587 4.35l-1.15 30.39a4 4 0 0 1-7.994-.302l1.15-30.39A4 4 0 0 1 5.74.203")}
            {genUG(166, 1200, 489, "M5.39.063a4 4 0 0 1 3.847 4.146l-1.2 32.14a4 4 0 0 1-7.994-.298l1.2-32.14A4 4 0 0 1 5.389.063")}
            {genUG(167, 1201.7, 438.9, "M6.281.913a4 4 0 0 1 3.846 4.148L8.687 43.2a4 4 0 1 1-7.994-.302l1.44-38.14A4 4 0 0 1 6.28.913")}
            {genUG(168, 1203.6, 389.5, "M6.13.513A4 4 0 0 1 9.977 4.66l-1.4 37.41a4 4 0 1 1-7.994-.3l1.4-37.41A4 4 0 0 1 6.13.513")}
            {genUG(169, 1205.4, 346.2, "M5.76.253A4 4 0 0 1 9.608 4.4l-1.16 30.73a4 4 0 1 1-7.994-.302L1.613 4.1A4 4 0 0 1 5.76.253")}
            {genUG(170, 1196, 289, "M2.055.556a4 4 0 0 1 5.479 1.41l1.53 2.59a73.47 73.47 0 0 1 10.163 40.182v.005l-.17 4.701a4 4 0 0 1-7.994-.288l.17-4.71v-.01A65.47 65.47 0 0 0 2.176 8.626l-1.53-2.59A4 4 0 0 1 2.056.555")}
            {genUG(171, 1171.5, 247.3, "M2.61.775A4 4 0 0 1 8.025 2.41c.347.647.68 1.23.996 1.721l.043.066 17.13 28.988a4 4 0 0 1-6.888 4.07L2.254 8.399A34 34 0 0 1 .974 6.19 4 4 0 0 1 2.61.775")}
            {genUG(172, 1163, 200.4, "M4 .46a4 4 0 0 1 4 4V18a65.5 65.5 0 0 0 3.6 21.432 4 4 0 1 1-7.56 2.616A73.5 73.5 0 0 1 0 18V4.46a4 4 0 0 1 4-4")}
            {genUG(173, 1163, 152.2, "M4 .22a4 4 0 0 1 4 4v36.24a4 4 0 0 1-8 0V4.22a4 4 0 0 1 4-4")}
            {genUG(174, 1163, 106.7, "M4 .7a4 4 0 0 1 4 4v33.52a4 4 0 1 1-8 0V4.7a4 4 0 0 1 4-4")}
            {genUG(175, 1163, 72.3, "M4 .23a4 4 0 0 1 4 4V26.7a4 4 0 0 1-8 0V4.23a4 4 0 0 1 4-4")}
          </g>
          {/* End Right side */}
        </g>
      </svg>
    );
  }
}

export default KeymapISO;

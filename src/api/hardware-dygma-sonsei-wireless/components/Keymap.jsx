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



const XX = 255;

const led_map = [

  // Left side only - 12 columns, 5 rows

  // Row 0: c0-c11 (12 keys)

  [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],

  // Row 1: c0-c11 (12 keys)

  [12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],

  // Row 2: c0-c11 (12 keys)

  [24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35],

  // Row 3: c0-c11 (12 keys)

  [36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47],

  // Row 4: c0-c3, c8-c11 (8 keys - c4, c5, c6, c7 don't exist)

  [48, 49, 50, 51, XX, XX, XX, XX, 52, 53, 54, 55],

];



const keysRowsPosition = {

  row1: 35,

  row2: 102,

  row3: 169,

  row4: 236,

  row5: 303,

  row6: 370,

};



const keysRowsDefyPosition = {

  row1: {

    y0: 111,

    y1: 88,

    y2: 71,

    y3: 121,

  },

  row2: {

    y0: 176,

    y1: 153,

    y2: 137,

    y3: 186,

  },

  row3: {

    y0: 241,

    y1: 217,

    y2: 203,

    y3: 252,

  },

  row4: {

    y0: 306,

    y1: 282,

    y2: 268,

  },

};

const keysColumnsPosition = {

  x0: 105,

  x1: 171,

  x2: 236,

  x3: 301,

  x4: 366,

  x5: 431,

  x6: 497,

  x7: 718,

  x8: 783,

  x9: 848,

  x10: 913,

  x11: 978,

  x12: 1043,

  x13: 1107,

};



class KeymapSONSEI extends React.Component {

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

      Array(56)

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

    const keyIndex = (row, col) => (col !== undefined ? row * 12 + col : row + 11);



    const getLabel = (row, col) => keymap[keyIndex(row, col)];



    const isSelected = (row, col) => {

      const selectIndex = keyIndex(row, col);

      return underglowIndex ? underglowIndex == selectIndex : this.props.selectedKey == selectIndex;

    };



    const stroke = (row, col) => (isSelected(row, col) ? (this.props.darkMode ? "#fff" : "#000") : "#b3b3b3");



    const getStrokeWidth = (row, col) => (isSelected(row, col) ? "3.0" : "1.5");



    const colormap =

      this.props.colormap ||

      Array(56)

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

    // console.log("showing BARS", colormap, palette, led_map, no_key_led_map);



    const getColor = (row, col) => {

      const ledIndex = col !== undefined ? led_map[parseInt(row)][parseInt(col)] : no_key_led_map[row - UNDERGLOW];

      const colorIndex = colormap[ledIndex];



      // console.log("testing colors", row, col, ledIndex, colorIndex, row - UNDERGLOW);



      const color = palette[colorIndex].rgb;

      return color;

    };



    const getLEDIndex = (row, col) =>

      col !== undefined ? led_map[parseInt(row)][parseInt(col)] : no_key_led_map[row - UNDERGLOW];



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

    // getLabel(row, col).extraLabel !== ""

    //   ? topsArr.includes(getLabel(row, col).extraLabel)

    //     ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord - 5, smallKey)

    //     : getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, String(+yCord - 5), smallKey)

    //   : getLabel(row, col).extraLabel === getLabel(row, col).extraLabel.toLowerCase().endsWith("to")

    //     ? getLabel(row, col).extraLabel && getDivideKeys(getLabel(row, col).extraLabel, xCord, yCord - 5, smallKey)

    //     : getLabel(row, col).extraLabel;



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

    return (

      <svg

        xmlns="http://www.w3.org/2000/svg"

        fillRule="evenodd"

        strokeLinecap="round"

        strokeLinejoin="round"

        strokeMiterlimit="1.5"

        clipRule="evenodd"

        viewBox="0 0 1270 560"

        className={this.props.className || "layer"}

        height={560}

        width={1270}

      >

        <g id="keyshapes-left" transform="rotate(10, 320, 680)">

          {/* Left side keys: columns 0-5 */}

          <Key

            keyType="regularKey"

            id="R0C0_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x0}

            y={keysRowsDefyPosition.row1.y0}

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

            x={keysColumnsPosition.x1}

            y={keysRowsDefyPosition.row1.y0}

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

            x={keysColumnsPosition.x2}

            y={keysRowsDefyPosition.row1.y1}

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

            x={keysColumnsPosition.x3}

            y={keysRowsDefyPosition.row1.y2}

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

            x={keysColumnsPosition.x4}

            y={keysRowsDefyPosition.row1.y1}

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

            x={keysColumnsPosition.x5}

            y={keysRowsDefyPosition.row1.y1}

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

            id="R1C0_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x0}

            y={keysRowsDefyPosition.row2.y0}

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

            x={keysColumnsPosition.x1}

            y={keysRowsDefyPosition.row2.y0}

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

            x={keysColumnsPosition.x2}

            y={keysRowsDefyPosition.row2.y1}

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

            x={keysColumnsPosition.x3}

            y={keysRowsDefyPosition.row2.y2}

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

            x={keysColumnsPosition.x4}

            y={keysRowsDefyPosition.row2.y1}

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

            x={keysColumnsPosition.x5}

            y={keysRowsDefyPosition.row2.y1}

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

            id="R2C0_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x0}

            y={keysRowsDefyPosition.row3.y0}

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

            x={keysColumnsPosition.x1}

            y={keysRowsDefyPosition.row3.y0}

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

            x={keysColumnsPosition.x2}

            y={keysRowsDefyPosition.row3.y1}

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

            x={keysColumnsPosition.x3}

            y={keysRowsDefyPosition.row3.y2}

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

            x={keysColumnsPosition.x4}

            y={keysRowsDefyPosition.row3.y1}

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

            x={keysColumnsPosition.x5}

            y={keysRowsDefyPosition.row3.y1}

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

            id="R3C0_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x0}

            y={keysRowsDefyPosition.row4.y0}

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

            x={keysColumnsPosition.x1}

            y={keysRowsDefyPosition.row4.y0}

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

            x={keysColumnsPosition.x2}

            y={keysRowsDefyPosition.row4.y1}

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

            x={keysColumnsPosition.x3}

            y={keysRowsDefyPosition.row4.y2}

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

            x={keysColumnsPosition.x4}

            y={keysRowsDefyPosition.row4.y1}

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

            x={keysColumnsPosition.x5}

            y={keysRowsDefyPosition.row4.y1}

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

            keyType="sonsei-t1"

            id="R4C0_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={327}

            y={347}

            rotation={0}

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

            keyType="defy-t2"

            id="R4C1_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={390}

            y={350}

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

            keyType="defy-t3"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={449}

            y={351}

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

            keyType="defy-t4"

            id="R4C3_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={497}

            y={373}

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

        </g>

        <g id="keyshapes-right" transform="rotate(-10, 960, 680)">

          {/* Right side keys: columns 6-11 */}

          <Key

            keyType="regularKey"

            id="R0C6_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x8}

            y={keysRowsDefyPosition.row1.y1}

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

            id="R0C7_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x9}

            y={keysRowsDefyPosition.row1.y1}

            fill={getColor(0, 7)}

            stroke={stroke(0, 7)}

            strokeWidth={getStrokeWidth(0, 7)}

            dataLedIndex={getLEDIndex(0, 7)}

            dataKeyIndex={keyIndex(0, 7)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(0, 7))}

            centerPrimary={getCenterPrimary(0, 7, 0, 0, true)}

            centerExtra={getCenterExtra(0, 7, 0, 0, true)}

            keyCode={getLabel(0, 7).keyCode}

            selectedKey={getLabel(0, 7)}

          />

          <Key

            keyType="regularKey"

            id="R0C8_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x10}

            y={keysRowsDefyPosition.row1.y2}

            fill={getColor(0, 8)}

            stroke={stroke(0, 8)}

            strokeWidth={getStrokeWidth(0, 8)}

            dataLedIndex={getLEDIndex(0, 8)}

            dataKeyIndex={keyIndex(0, 8)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(0, 8))}

            centerPrimary={getCenterPrimary(0, 8, 0, 0, true)}

            centerExtra={getCenterExtra(0, 8, 0, 0, true)}

            keyCode={getLabel(0, 8).keyCode}

            selectedKey={getLabel(0, 8)}

          />



          <Key

            keyType="regularKey"

            id="R0C9_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x11}

            y={keysRowsDefyPosition.row1.y1}

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

            x={keysColumnsPosition.x12}

            y={keysRowsDefyPosition.row1.y0}

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

            x={keysColumnsPosition.x13}

            y={keysRowsDefyPosition.row1.y0}

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

            id="R1C6_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x8}

            y={keysRowsDefyPosition.row2.y1}

            fill={getColor(1, 6)}

            stroke={stroke(1, 6)}

            strokeWidth={getStrokeWidth(1, 6)}

            dataLedIndex={getLEDIndex(1, 6)}

            dataKeyIndex={keyIndex(1, 6)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(1, 6))}

            centerPrimary={getCenterPrimary(1, 6, 0, 0, true)}

            centerExtra={getCenterExtra(1, 6, 0, 0, true)}

            keyCode={getLabel(1, 6).keyCode}

            selectedKey={getLabel(1, 6)}

          />

          <Key

            keyType="regularKey"

            id="R1C7_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x9}

            y={keysRowsDefyPosition.row2.y1}

            fill={getColor(1, 7)}

            stroke={stroke(1, 7)}

            strokeWidth={getStrokeWidth(1, 7)}

            dataLedIndex={getLEDIndex(1, 7)}

            dataKeyIndex={keyIndex(1, 7)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(1, 7))}

            centerPrimary={getCenterPrimary(1, 7, 0, 0, true)}

            centerExtra={getCenterExtra(1, 7, 0, 0, true)}

            keyCode={getLabel(1, 7).keyCode}

            selectedKey={getLabel(1, 7)}

          />

          <Key

            keyType="regularKey"

            id="R1C8_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x10}

            y={keysRowsDefyPosition.row2.y2}

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

            x={keysColumnsPosition.x11}

            y={keysRowsDefyPosition.row2.y1}

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

            x={keysColumnsPosition.x12}

            y={keysRowsDefyPosition.row2.y0}

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

            x={keysColumnsPosition.x13}

            y={keysRowsDefyPosition.row2.y0}

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

            id="R2C6_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x8}

            y={keysRowsDefyPosition.row3.y1}

            fill={getColor(2, 6)}

            stroke={stroke(2, 6)}

            strokeWidth={getStrokeWidth(2, 6)}

            dataLedIndex={getLEDIndex(2, 6)}

            dataKeyIndex={keyIndex(2, 6)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(2, 6))}

            centerPrimary={getCenterPrimary(2, 6, 0, 0, true)}

            centerExtra={getCenterExtra(2, 6, 0, 0, true)}

            keyCode={getLabel(2, 6).keyCode}

            selectedKey={getLabel(2, 6)}

          />



          <Key

            keyType="regularKey"

            id="R2C7_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x9}

            y={keysRowsDefyPosition.row3.y1}

            fill={getColor(2, 7)}

            stroke={stroke(2, 7)}

            strokeWidth={getStrokeWidth(2, 7)}

            dataLedIndex={getLEDIndex(2, 7)}

            dataKeyIndex={keyIndex(2, 7)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(2, 7))}

            centerPrimary={getCenterPrimary(2, 7, 0, 0, true)}

            centerExtra={getCenterExtra(2, 7, 0, 0, true)}

            keyCode={getLabel(2, 7).keyCode}

            selectedKey={getLabel(2, 7)}

          />



          <Key

            keyType="regularKey"

            id="R2C8_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x10}

            y={keysRowsDefyPosition.row3.y2}

            fill={getColor(2, 8)}

            stroke={stroke(2, 8)}

            strokeWidth={getStrokeWidth(2, 8)}

            dataLedIndex={getLEDIndex(2, 8)}

            dataKeyIndex={keyIndex(2, 8)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(2, 8))}

            centerPrimary={getCenterPrimary(2, 8, 0, 0, true)}

            centerExtra={getCenterExtra(2, 8, 0, 0, true)}

            keyCode={getLabel(2, 8).keyCode}

            selectedKey={getLabel(2, 8)}

          />



          <Key

            keyType="regularKey"

            id="R2C9_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x11}

            y={keysRowsDefyPosition.row3.y1}

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

            x={keysColumnsPosition.x12}

            y={keysRowsDefyPosition.row3.y0}

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

            x={keysColumnsPosition.x13}

            y={keysRowsDefyPosition.row3.y0}

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

            id="R3C6_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x8}

            y={keysRowsDefyPosition.row4.y1}

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

            id="R3C7_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x9}

            y={keysRowsDefyPosition.row4.y1}

            fill={getColor(3, 7)}

            stroke={stroke(3, 7)}

            strokeWidth={getStrokeWidth(3, 7)}

            dataLedIndex={getLEDIndex(3, 7)}

            dataKeyIndex={keyIndex(3, 7)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(3, 7))}

            centerPrimary={getCenterPrimary(3, 7, 0, 0, true)}

            centerExtra={getCenterExtra(3, 7, 0, 0, true)}

            keyCode={getLabel(3, 7).keyCode}

            selectedKey={getLabel(3, 7)}

          />



          <Key

            keyType="regularKey"

            id="R3C8_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x10}

            y={keysRowsDefyPosition.row4.y2}

            fill={getColor(3, 8)}

            stroke={stroke(3, 8)}

            strokeWidth={getStrokeWidth(3, 8)}

            dataLedIndex={getLEDIndex(3, 8)}

            dataKeyIndex={keyIndex(3, 8)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(3, 8))}

            centerPrimary={getCenterPrimary(3, 8, 0, 0, true)}

            centerExtra={getCenterExtra(3, 8, 0, 0, true)}

            keyCode={getLabel(3, 8).keyCode}

            selectedKey={getLabel(3, 8)}

          />



          <Key

            keyType="regularKey"

            id="R3C9_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x11}

            y={keysRowsDefyPosition.row4.y1}

            fill={getColor(3, 9)}

            stroke={stroke(3, 9)}

            strokeWidth={getStrokeWidth(3, 9)}

            dataLedIndex={getLEDIndex(3, 9)}

            dataKeyIndex={keyIndex(3, 9)}

            dataLayer={layer}

            contrastText={getContrastText(getColor(3, 9))}

            centerPrimary={getCenterPrimary(3, 9, 0, 0, true)}

            centerExtra={getCenterExtra(3, 9, 0, 0, true)}

            keyCode={getLabel(3, 9).keyCode}

            selectedKey={getLabel(3, 9)}

          />



          <Key

            keyType="regularKey"

            id="R3C10_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={keysColumnsPosition.x12}

            y={keysRowsDefyPosition.row4.y0}

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

            x={keysColumnsPosition.x13}

            y={keysRowsDefyPosition.row4.y0}

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

            keyType="defy-tR4"

            id="R4C8_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={698}

            y={372}

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

            keyType="defy-tR3"

            id="R4C9_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={748}

            y={350}

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

          <Key

            keyType="defy-tR2"

            id="R4C10_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={817}

            y={349}

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

            keyType="sonsei-tR1"

            id="R4C11_keyshape"

            onClick={onClick}

            className="key"

            width={57}

            height={57}

            x={886}

            y={349}

            rotation={0}

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

        </g>

      </svg>

    );

  }

}



export default KeymapSONSEI;








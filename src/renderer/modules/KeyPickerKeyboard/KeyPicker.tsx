/*
 * SVG keyboard representation for key picking
 * Made by Alejandro Parcet González From Dygma S.L.
 */

import React, { Component } from "react";
import Styled, { withTheme } from "styled-components";

import { RiStopFill } from "react-icons/ri";
import { IoIosPause, IoIosPlay, IoIosShuffle } from "react-icons/io";
import { FiMenu } from "react-icons/fi";
import { CgToggleOff } from "react-icons/cg";
import { TiCancel } from "react-icons/ti";
import { ImTab } from "react-icons/im";
import { BsFillBrightnessAltLowFill, BsShift, BsBackspace } from "react-icons/bs";
import { FaVolumeDown, FaVolumeMute, FaVolumeUp, FaLinux } from "react-icons/fa";
import {
  BiArrowFromBottom,
  BiArrowFromLeft,
  BiArrowFromRight,
  BiArrowFromTop,
  BiDownArrowCircle,
  BiLeftArrowCircle,
  BiMouseAlt,
  BiRightArrowCircle,
  BiUpArrowCircle,
} from "react-icons/bi";
import {
  AiFillForward,
  AiFillWindows,
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineBackward,
  AiOutlineForward,
} from "react-icons/ai";
import { MdKeyboardReturn, MdSpaceBar, MdKeyboardCapslock, MdEject } from "react-icons/md";

import Key from "@Renderer/modules/KeyPickerKeyboard/Key";
import getLanguage, { LangOptions } from "@Renderer/modules/KeyPickerKeyboard/KeyPickerLanguage";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";

import { getKeyboardLayout } from "@Renderer/utils/getKeyboardLayout";
import { SegmentedKeyType } from "@Renderer/types/layout";

const Style = Styled.div`
width: 100%;
@media screen and (min-width: 1980px) and (min-height: 980px) {
  max-width: 1860px;
  margin: 0 auto;
}
.keyboard {
  margin: 0;
  padding: 16px;
  .keys {
    margin: 0;
    padding: 0;
    justify-content:center;
  }
  .bigger {
    font-size: 1.3rem;
  }
  .biggerWin {
    font-size: 1.2rem;
  }
  .biggerApple {
    font-size: 1.3rem;
  }
  .biggerLinux {
    font-size: 1.3rem;
  }
}
.svgStyle {
    overflow: visible;
    max-width: 1170px;
    margin: 6px auto;
}
.KeysWrapperSpecialKeys {
  margin-top: 4px;
}
.keysRow {
  display: flex;
  flex-wrap: nowrap;
  // background: ${({ theme }) => theme.styles.keyboardPicker.keysRowBackground};
  box-shadow: ${({ theme }) => theme.styles.keyboardPicker.keysRowBoxShadow};
  .keyIcon {
    flex: 0 0 32px;
    text-align: center;
    align-self: center;
    color: ${({ theme }) => theme.styles.keyPicker.iconColor};
    h4 {
      font-size: 9px;
      font-weight: 700;
      letter-spacing: 0.06em;
      margin: 0;
    }
  }
  .keyTitle {
    font-size: 11px;
    color: ${({ theme }) => theme.styles.keyPicker.titleColor};
    display: flex;
    // flex-grow: 1;
    align-self: center;
    line-height: 1.15em;
    flex-wrap: wrap;
    // max-width: 66px;
    span {
      color: ${({ theme }) => theme.styles.keyPicker.titleSpan};
      display: block;
      flex: 0 0 100%;
    }
    &.keyTitleClick {
      padding-left: 16px;
      padding-right: 10px;
    }
  }
}
.keysMediaTools {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-gap: 16px;
}
.keysContainerDropdowns {
  display: grid;
  grid-template-columns: minmax(25%, auto) minmax(25%, auto) minmax(25%, auto);
  grid-gap: 16px;
}

.dropdownItem {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.dropdown-toggle.btn.btn-primary {
  padding-right: 24px;
  padding-left: 12px;
}
.dropdown-toggle::after {
  right: 6px;
}
.keysButtonsList {
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex: calc(100% - 32px);
  grid-gap: 3px;
}
.keysButtonsList .button-config {
  height: 34px;
  display: flex;
  flex-grow: 1;
  text-align: center;
  padding: 5px 3px;
  justify-content: center;
  align-items: center;
  font-size: 12px;
}
.keysMouseEvents .button-config {
  width: 58px;
}

.keysContainerGrid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 2px 4px;
}

.KeysWrapper.notWireless {
  .keysSuperkeys { grid-area: 1 / 1 / 2 / 3; }
  .keysMacros { grid-area: 1 / 3 / 2 / 5; }
  .keysLayerLock { grid-area: 1 / 5 / 2 / 7; }
  .keysOSM { grid-area: 1 / 7 / 2 / 9; }
  .keysMouseEvents { grid-area: 1 / 9 / 2 / 11; }
  .keysNoKey { grid-area: 1 / 11 / 2 / 13; }
  .keysMedia { grid-area: 2 / 1 / 3 / 6; }
  .keysTools { grid-area: 2 / 6 / 3 / 10; }
  .keysLED { grid-area: 2 / 10 / 3 / 12; }
  .keysCustom { grid-area: 2 / 12 / 3 / 13; }
}
.KeysWrapper.super.notWireless {
  .keysContainerGrid {
    grid-template-columns: repeat(12, 1fr);
  }
  .keysMacros { grid-area:  1 / 1 / 2 / 5; }
  .keysLayerLock { grid-area: 1 / 5 / 2 / 9; }
  .keysMouseEvents { grid-area: 1 / 9 / 2 / 13; }
  .keysMedia { grid-area: 2 / 1 / 3 / 6; }
  .keysTools { grid-area: 2 / 6 / 3 / 10; }
  .keysLED { grid-area: 2 / 10 / 3 / 12; }
  .keysCustom { grid-area: 2 / 12 / 3 / 13; }
}
@media (max-width: 1460px) {
  .KeysWrapper.notWireless {
    .keysContainerGrid {
      grid-template-rows: repeat(3, 1fr);
    }
    .keysSuperkeys { grid-area: 1 / 1 / 2 / 5; }
    .keysMacros { grid-area: 1 / 5 / 2 / 9; }
    .keysLayerLock { grid-area: 1 / 9 / 2 / 13; }
    .keysOSM { grid-area: 2 / 1 / 3 / 4; }
    .keysMouseEvents { grid-area: 2 / 4 / 3 / 7; }
    .keysNoKey { grid-area: 2 / 7 / 3 / 10; }
    .keysLED { grid-area: 2 / 10 / 3 / 13; }
    .keysMedia { grid-area: 3 / 1 / 4 / 7; }
    .keysTools { grid-area: 3 / 7 / 4 / 12; }
    .keysCustom { grid-area: 3 / 12 / 4 / 13; }
  }
}

.KeysWrapper.isWireless {
  .keysContainerGrid {
    grid-template-rows: repeat(3, 1fr);
  }
  .keysSuperkeys { grid-area: 1 / 1 / 2 / 4; }
  .keysMacros { grid-area: 1 / 4 / 2 / 7; }
  .keysLayerLock { grid-area: 1 / 7 / 2 / 10; }
  .keysWireless { grid-area: 1 / 10 / 2 / 13; }
  .keysOSM { grid-area: 2 / 1 / 3 / 4; }
  .keysMouseEvents { grid-area: 2 / 4 / 3 / 7; }
  .keysNoKey { grid-area: 2 / 7 / 3 / 10; }
  .keysLED { grid-area: 2 / 10 / 3 / 13; }
  .keysMedia { grid-area: 3 / 1 / 4 / 7; }
  .keysTools { grid-area: 3 / 7 / 4 / 12; }
  .keysCustom { grid-area: 3 / 12 / 4 / 13; }
}
.KeysWrapper.super.isWireless {
  .keysContainerGrid {
    grid-template-columns: repeat(12, 1fr);
    grid-template-rows: repeat(2, 1fr);
  }
  .keysMacros { grid-area:  1 / 1 / 2 / 5; }
  .keysLayerLock { grid-area: 1 / 5 / 2 / 9; }
  .keysMouseEvents { grid-area: 1 / 9 / 2 / 13; }
  .keysMedia { grid-area: 2 / 1 / 3 / 6; }
  .keysTools { grid-area: 2 / 6 / 3 / 10; }
  .keysLED { grid-area: 2 / 10 / 3 / 12; }
  .keysCustom { grid-area: 2 / 12 / 3 / 13; }
}

.editor {
  .dropdownLayerShift .dropdown-toggle.btn.btn-primary,
  .dropdownOneShotModifiers .dropdown-toggle.btn.btn-primary{
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .dropdownLayerLock .dropdown-toggle.btn.btn-primary,
  .dropdownOneShotLayers .dropdown-toggle.btn.btn-primary{
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.super {
  .keysContainerGrid {
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) minmax(0, 1fr);
  }
  .keysContainerGrid2 {
    grid-template-columns: auto auto auto;
  }
}
`;
const IconColor = Styled.span`
    color: ${props => props.color};
`;

type Props = {
  onKeySelect: (value: number) => void;
  code: SegmentedKeyType;
  disableMods: boolean;
  disableMove: boolean;
  disableAll: boolean;
  selectedlanguage: string;
  theme: any;
};

class KeyPicker extends Component<Props> {
  constructor(props: Props) {
    super(props);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress = (keycode: number) => {
    const { onKeySelect } = this.props;
    onKeySelect(keycode);
  };

  render() {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { code, disableMods, disableMove, disableAll, selectedlanguage, theme } = this.props;

    const Lang = getLanguage(selectedlanguage as LangOptions);
    const keyboardLayout = getKeyboardLayout(selectedlanguage);

    const os = process.platform;
    type IconListType = {
      [index: string]: JSX.Element;
    };
    const iconlist: IconListType = {
      Backspace: <BsBackspace />,
      Enter: <MdKeyboardReturn />,
      Space: <MdSpaceBar />,
      CapsLock: <MdKeyboardCapslock />,
      Tab: <ImTab />,
      Shift: <BsShift />,
      App: <FiMenu />,
      Win: (
        <>
          {os === "win32" ? <AiFillWindows className="biggerWin" /> : ""}
          {os === "darwin" ? <OSKey renderKey="os" /> : ""}
          {os !== "win32" && os !== "darwin" ? <FaLinux className="biggerLinux" /> : ""}
        </>
      ),
      ArrUp: <AiOutlineArrowUp className="bigger" />,
      ArrDwn: <AiOutlineArrowDown className="bigger" />,
      ArrLeft: <AiOutlineArrowLeft className="bigger" />,
      ArrRight: <AiOutlineArrowRight className="bigger" />,
      LDToggl: (
        <>
          <BsFillBrightnessAltLowFill className="bigger" />
          <CgToggleOff className="" />
        </>
      ),
      LDForward: (
        <>
          <BsFillBrightnessAltLowFill className="bigger" />
          <AiOutlineForward className="" />
        </>
      ),
      VolAdd: <FaVolumeUp className="bigger" />,
      VolSub: <FaVolumeDown className="bigger" />,
      VolMute: <FaVolumeMute className="bigger" />,
      Pause: <IoIosPause className="bigger" />,
      Play: <IoIosPlay className="bigger" />,
      Stop: <RiStopFill className="bigger" />,
      Eject: <MdEject className="bigger" />,
      Shuffle: <IoIosShuffle className="bigger" />,
      Forward: <AiFillForward className="bigger" />,
      Backward: <AiOutlineBackward className="bigger" />,
      Cancel: <TiCancel className="bigger" />,
      ScrlUp: (
        <>
          <BiMouseAlt className="bigger" />
          <BiArrowFromBottom className="" />
        </>
      ),
      ScrlDwn: (
        <>
          <BiMouseAlt className="bigger" />
          <BiArrowFromTop className="" />
        </>
      ),
      ScrlLeft: (
        <>
          <BiMouseAlt className="bigger" />
          <BiArrowFromRight className="" />
        </>
      ),
      ScrlRight: (
        <>
          <BiMouseAlt className="bigger" />
          <BiArrowFromLeft className="" />
        </>
      ),
      MvUp: (
        <>
          <BiMouseAlt className="bigger" />
          <BiUpArrowCircle className="" />
        </>
      ),
      MvDwn: (
        <>
          <BiMouseAlt className="bigger" />
          <BiDownArrowCircle className="" />
        </>
      ),
      MvLeft: (
        <>
          <BiMouseAlt className="bigger" />
          <BiLeftArrowCircle className="" />
        </>
      ),
      MvRight: (
        <>
          <BiMouseAlt className="bigger" />
          <BiRightArrowCircle className="" />
        </>
      ),
    };

    const returnData = (key: any) => {
      const KeyIsKey =
        code.base === key.id &&
        (code.base + code.modified < 53267 || code.base + code.modified > 60000) &&
        (code.base + code.modified < 17450 || code.base + code.modified > 17501) &&
        (code.base + code.modified < 49153 || code.base + code.modified > 49168)
          ? true
          : !!(code.modified > 0 && code.base + code.modified === key.id);
      const keyArray = Array.isArray(key.idArray)
        ? key.idArray.some(
            (Lkey: any) => Lkey === code.base + code.modified || (Lkey === code.base && Lkey >= 104 && Lkey <= 115),
          )
        : KeyIsKey;
      return keyArray;
    };

    const keyboard = Lang.map((key, id) => (
      <Key
        key={`id-${key.content.first}-${String(id)}`}
        id={id}
        x={key.x}
        y={key.y}
        selected={code === null ? false : returnData(key)}
        clicked={() => {
          if (!(key.mod === true && key.mod === disableMods)) this.onKeyPress(key.id);
        }}
        onKeyPress={this.onKeyPress}
        centered={key.centered}
        content={key.content}
        iconpresent={key.icon}
        icon={
          <IconColor
            color={
              key.mod === true && key.mod === disableMods
                ? theme.keyboardPicker.keyTextDisabledColor
                : theme.keyboardPicker.keyIconColor
            }
          >
            {iconlist[key.iconname]}
          </IconColor>
        }
        iconx={key.iconx}
        icony={key.icony}
        iconsize={key.iconsize}
        disabled={key.mod === disableMods || disableAll}
        idArray={key.idArray}
        keyCode={code}
        platform={process.platform}
      />
    ));

    return (
      <Style>
        <div className="KeysWrapper">
          <div className="keysContainer">
            <div className=" flex flex-wrap bg-white dark:bg-gray-700/60 keysOrdinaryKeyboard relative z-[4] p-3 rounded-t-regular [&_svg]:mx-auto [&_svg]:max-w-6xl">
              {disableAll ? (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-25 tracking-tight text-xl text-nowrap">
                  Select a key in the keyboard above to start
                </div>
              ) : (
                ""
              )}
              <svg
                className={`svgStyle ${process.platform} ${keyboardLayout}`}
                viewBox="0 0 1070 208"
                preserveAspectRatio="xMidYMin slice"
              >
                {keyboard}
                <defs>
                  <linearGradient id="paint_gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="5%" stopColor="#fff" />
                    <stop offset="95%" stopColor="#fff" stopOpacity={0} />
                  </linearGradient>
                  <filter id="filter0_d_2211_181319" x="0%" y="0%" width="200%" height="200%">
                    <feOffset result="offOut" in="SourceGraphic" dx="0" dy="-2" />
                    <feColorMatrix
                      result="matrixOut"
                      in="offOut"
                      type="matrix"
                      values="0 0 0 0 0.552941 0 0 0 0 0.517647 0 0 0 0 0.737255 0 0 0 0.1 0"
                    />
                    <feGaussianBlur result="blurOut" in="matrixOut" stdDeviation="0" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                  </filter>
                </defs>
              </svg>
            </div>
          </div>
        </div>
      </Style>
    );
  }
}

export default withTheme(KeyPicker);

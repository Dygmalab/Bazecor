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
  AiFillApple,
  AiOutlineArrowDown,
  AiOutlineArrowLeft,
  AiOutlineArrowRight,
  AiOutlineArrowUp,
  AiOutlineBackward,
  AiOutlineForward,
} from "react-icons/ai";
import { MdKeyboardReturn, MdSpaceBar, MdKeyboardCapslock, MdInfoOutline, MdEject } from "react-icons/md";

import { Button } from "@Renderer/components/atoms/Button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";
import {
  SelectLayersCustomDropdown,
  SelectSuperKeyCustomDropdown,
  SelectMacroCustomDropdown,
  SelectMouseCustomDropdown,
  SelectShotModifierCustomDropdown,
  SelectWirelessDropdown,
} from "@Renderer/components/molecules/CustomSelect";

import {
  IconLayers,
  IconLEDNextEffect,
  IconLEDPreviousEffect,
  IconMediaForward,
  IconMediaPlayPause,
  IconMediaRewind,
  IconMediaShuffle,
  IconMediaSoundLess,
  IconMediaSoundMore,
  IconMediaSoundMute,
  IconMediaStop,
  IconNull,
  IconNote,
  IconMouse,
  IconOneShot,
  IconThunder,
  IconToolsCalculator,
  IconToolsCamera,
  IconToolsEject,
  IconToolsBrightnessLess,
  IconBrightnessMore,
  IconSleep,
  IconShutdown,
  IconRobot,
  IconWireless,
  IconLEDToggleEffect,
  IconWrench,
} from "@Renderer/components/atoms/icons";

import { i18n } from "@Renderer/i18n";

import Key from "@Renderer/modules/KeyPickerKeyboard/Key";
import getLanguage from "@Renderer/modules/KeyPickerKeyboard/KeyPickerLanguage";
import CustomKeyCodeModal from "@Renderer/components/molecules/CustomModal/ModalCustomKeycode";
import OSKey from "@Renderer/components/molecules/KeyTags/OSKey";

import { getKeyboardLayout } from "@Renderer/utils/getKeyboardLayout";

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
.keysOrdinaryKeyboard {
  position: relative;
  z-index: 4;
}


.KeysWrapper {
  max-width: 1080px;
  margin: auto;
}
.keysContainer + .keysContainer {
  margin-top: 4px;
}
.KeysWrapperSpecialKeys {
  margin-top: 4px;
}
.keysRow {
  display: flex;
  flex-wrap: nowrap;
  background: ${({ theme }) => theme.styles.keyboardPicker.keysRowBackground};
  box-shadow: ${({ theme }) => theme.styles.keyboardPicker.keysRowBoxShadow};
  border-radius: 6px;
  padding: 5px;
  padding-left: 3px;
  &.keysOrdinaryKeyboard {
    padding: 12px 24px;
  }
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
const TooltipStyle = Styled.div`
text-align: left;
.ttip-p {
  margin: 0;
}
.ttip-h {
  margin: 0;
  font-size: 1.3em;
}
`;

class KeyPicker extends Component {
  constructor(props) {
    super(props);

    this.state = { customModal: false };
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  toggleModal = () => {
    const { customModal: cModal } = this.state;
    this.setState({ customModal: !cModal });
  };

  onKeyPress = keycode => {
    const { onKeySelect } = this.props;
    onKeySelect(keycode);
  };

  renderTooltip(tooltips) {
    return (
      <>
        {tooltips.map((tip, i) => (
          <React.Fragment key={`Tip-${i}`}>
            {i % 2 === 1 || !Number.isNaN(tip[0]) || tip[0] === "-" ? (
              <p className="ttip-p">{tip}</p>
            ) : (
              <>
                {i === 0 ? "" : <br />}
                <h5 className="ttip-h">{tip}</h5>
              </>
            )}
          </React.Fragment>
        ))}
      </>
    );
  }

  render() {
    const {
      action,
      actions,
      code,
      disableMods,
      disableMove,
      disableAll,
      selectedlanguage,
      superkeys,
      selKeys,
      kbtype,
      macros,
      keyCode,
      onKeySelect,
      activeTab,
      isWireless,
      theme,
    } = this.props;

    // let boxShadowMatrix = useTheme().styles.keyPicker.keyMatrixShadow;

    const Lang = getLanguage(selectedlanguage);
    const keyboardLayout = getKeyboardLayout(selectedlanguage);

    const os = process.platform;
    const iconlist = {
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
    const keyboard = Lang.map((key, id) => {
      if (key.tooltip) {
        return (
          <foreignObject key={`id-${key.content.first}-${id}`} x={key.x} y={key.y} width={25} height={25}>
            <TooltipProvider delayDuration={100}>
              <Tooltip>
                <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                  <MdInfoOutline className="info" />
                </TooltipTrigger>
                <TooltipContent>{this.renderTooltip(key.tooltip)}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </foreignObject>
        );
      }
      return (
        <Key
          key={`id-${key.content.first}-${id}`}
          id={id}
          x={key.x}
          y={key.y}
          selected={
            code === null
              ? false
              : Array.isArray(key.idArray)
                ? key.idArray.some(key => key === code.base + code.modified || (key === code.base && key >= 104 && key <= 115))
                : code.base === key.id &&
                    (code.base + code.modified < 53267 || code.base + code.modified > 60000) &&
                    (code.base + code.modified < 17450 || code.base + code.modified > 17501) &&
                    (code.base + code.modified < 49153 || code.base + code.modified > 49168)
                  ? true
                  : !!(code.modified > 0 && code.base + code.modified === key.id)
          }
          clicked={() => {
            key.mod === disableMods || key.move === disableMove ? () => {} : this.onKeyPress(key.id);
          }}
          onKeyPress={this.onKeyPress}
          centered={key.centered}
          content={key.content}
          iconpresent={key.icon}
          icon={
            <IconColor
              color={
                key.mod === disableMods || key.move === disableMove
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
          disabled={key.mod === disableMods || key.move === disableMove || disableAll}
          idArray={key.idArray}
          keyCode={code}
          platform={process.platform}
        />
      );
    });

    const { customModal } = this.state;
    return (
      <Style>
        <div className="KeysWrapper">
          <div className="keysContainer">
            <div className="keysRow keysOrdinaryKeyboard">
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
        <div className={`KeysWrapper KeysWrapperSpecialKeys ${activeTab} ${isWireless ? "isWireless" : "notWireless"}`}>
          <div className="keysContainer keysContainerGrid">
            {activeTab === "super" ? (
              ""
            ) : (
              <div className="keysRow keysSuperkeys keyRowsDropdowns">
                <div className="keyIcon">
                  <IconThunder size="sm" />
                </div>
                <div className="keysButtonsList">
                  <SelectSuperKeyCustomDropdown
                    // action={action}
                    // actions={actions}
                    // selKeys={selKeys}
                    onKeySelect={onKeySelect}
                    disabled={disableAll}
                    superkeys={superkeys}
                    keyCode={code}
                  />
                </div>
              </div>
            )}

            <div className="keysRow keysMacros keyRowsDropdowns">
              <div className="keyIcon">
                <IconRobot size="sm" />
              </div>
              <div className="keysButtonsList">
                <SelectMacroCustomDropdown macros={macros} keyCode={code} onKeySelect={onKeySelect} disabled={disableAll} />
              </div>
            </div>

            <div className="keysRow keysLayerLock keyRowsDropdowns">
              <div className="keyIcon">
                <IconLayers size="sm" />
              </div>
              <div className="keysButtonsList">
                <SelectLayersCustomDropdown
                  action={action}
                  activeTab={activeTab}
                  keyCode={code}
                  disable={disableAll}
                  onKeySelect={onKeySelect}
                  disableMods={disableMods}
                />
              </div>
            </div>
            {isWireless && (
              <div className="keysRow keysWireless keyRowsDropdowns">
                <div className="keyIcon">
                  <IconWireless size="sm" />
                </div>
                <div className="keysButtonsList">
                  <SelectWirelessDropdown
                    action={action}
                    activeTab={activeTab}
                    keyCode={code}
                    onKeySelect={onKeySelect}
                    disable={disableAll}
                  />
                </div>
              </div>
            )}
            {activeTab === "super" ? (
              ""
            ) : (
              <div className="keysRow keysOSM keyRowsDropdowns">
                <div className="keyIcon">
                  <IconOneShot size="sm" />
                </div>
                <div className="keysButtonsList">
                  <SelectShotModifierCustomDropdown
                    action={action}
                    activeTab={activeTab}
                    keyCode={code}
                    disable={disableAll}
                    onKeySelect={onKeySelect}
                  />
                </div>
              </div>
            )}
            <div className="keysRow keysMouseEvents">
              <div className="keyIcon">
                <IconMouse size="sm" />
              </div>
              <div className="keysButtonsList">
                <SelectMouseCustomDropdown keyCode={code} onKeySelect={onKeySelect} disable={disableAll} activeTab={activeTab} />
              </div>
            </div>
            {activeTab === "super" ? (
              ""
            ) : (
              <div className="keysRow keysNoKey keyRowsDropdowns">
                <div className="keyIcon">
                  <IconNull size="sm" />
                </div>
                <div className="keysButtonsList flex gap-2">
                  <Button
                    variant="config"
                    disabled={disableAll}
                    onClick={() => {
                      onKeySelect(0);
                    }}
                    size="xs"
                    className="px-[12px] text-center basis-full"
                    selected={keyCode.base + keyCode.modified === 0}
                  >
                    {i18n.editor.superkeys.specialKeys.noKey}
                  </Button>
                  <Button
                    variant="config"
                    disabled={disableAll}
                    onClick={() => {
                      onKeySelect(65535);
                    }}
                    size="xs"
                    className="px-[12px] text-center basis-full"
                    selected={keyCode.base + keyCode.modified === 65535}
                  >
                    {i18n.editor.standardView.trans}
                  </Button>
                </div>
              </div>
            )}

            <div className="keysRow keysMedia">
              <div className="keyIcon">
                <IconNote size="sm" />
              </div>
              <div className="keysButtonsList flex gap-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 22733}
                          onClick={() => {
                            onKeySelect(22733);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaPlayPause size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.playPause}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 22711}
                          onClick={() => {
                            onKeySelect(22711);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaStop size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.stop}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 22710}
                          onClick={() => {
                            onKeySelect(22710);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaRewind size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.rewind}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 22709}
                          onClick={() => {
                            onKeySelect(22709);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaForward size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.forward}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 22713}
                          onClick={() => {
                            onKeySelect(22713);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaShuffle size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.shuffle}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 19682}
                          onClick={() => {
                            onKeySelect(19682);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaSoundMute size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.mute}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 23786}
                          onClick={() => {
                            onKeySelect(23786);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaSoundLess size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.soundLess}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 23785}
                          onClick={() => {
                            onKeySelect(23785);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconMediaSoundMore size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.soundMore}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="keysRow keysTools">
              <div className="keyIcon">
                <IconWrench size="sm" />
              </div>
              <div className="keysButtonsList flex gap-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 22712}
                          onClick={() => {
                            onKeySelect(22712);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconToolsEject size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.eject}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 18834}
                          onClick={() => {
                            onKeySelect(18834);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconToolsCalculator size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.calculator}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 18552}
                          onClick={() => {
                            onKeySelect(18552);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconToolsCamera size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.camera}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 23664}
                          onClick={() => {
                            onKeySelect(23664);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconToolsBrightnessLess size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.brightnessLess}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 23663}
                          onClick={() => {
                            onKeySelect(23663);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconBrightnessMore size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.brightnessMore}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 20866}
                          onClick={() => {
                            onKeySelect(20866);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconSleep size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.sleep}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 20865}
                          onClick={() => {
                            onKeySelect(20865);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconShutdown size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.shutdown}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            <div className="keysRow keysLED">
              <div className="keyIcon">
                <h4>LED</h4>
              </div>
              <div className="keysButtonsList">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 17154}
                          onClick={() => {
                            onKeySelect(17154);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconLEDToggleEffect size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.ledToggleTootip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 17153}
                          onClick={() => {
                            onKeySelect(17153);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconLEDPreviousEffect size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.ledPreviousEffectTootip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified === 17152}
                          onClick={() => {
                            onKeySelect(17152);
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconLEDNextEffect size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.ledNextEffectTootip}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>
            <div className="keysRow keysCustom">
              <div className="keyIcon">
                <h4>Cust.</h4>
              </div>
              <div className="keysButtonsList flex gap-2">
                <TooltipProvider delayDuration={100}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="basis-full">
                        <Button
                          variant="config"
                          disabled={disableAll}
                          selected={keyCode.base + keyCode.modified >= 20000}
                          onClick={() => {
                            this.toggleModal();
                          }}
                          size="iconXS"
                          className="basis-full !w-full"
                        >
                          <IconWrench size="sm" />
                        </Button>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent size="sm" className="max-w-xs">
                      {i18n.editor.superkeys.specialKeys.custom}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                <CustomKeyCodeModal
                  show={customModal}
                  name={(keyCode.base + keyCode.modified).toString(16)}
                  toggleShow={this.toggleModal}
                  handleSave={data => {
                    // console.log("CustomKey selected key", data);
                    onKeySelect(parseInt(data, 16));
                    this.toggleModal();
                  }}
                  modalTitle={i18n.editor.modal.customKeyCodeModal.title}
                  modalMessage={i18n.editor.modal.customKeyCodeModal.message}
                  labelInput={i18n.editor.modal.customKeyCodeModal.labelInput}
                />
              </div>
            </div>
          </div>
        </div>
      </Style>
    );
  }
}

export default withTheme(KeyPicker);

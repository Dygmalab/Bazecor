/*
 * SVG keyboard representation for key picking
 * Made by Alejandro Parcet González From Dygma S.L.
 */

import React, { Component } from "react";
import Styled, { withTheme } from "styled-components";

import Tooltip from "react-bootstrap/Tooltip";
import OverlayTrigger from "react-bootstrap/OverlayTrigger";

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

import { ButtonConfig } from "@Renderer/component/Button";
import {
  SelectMacroCustomDropdown,
  SelectSuperKeyCustomDropdown,
  SelectLayersCustomDropdown,
  SelectMouseCustomDropdown,
  SelectShotModifierCustomDropdown,
  SelectWirelessDropdown,
} from "@Renderer/component/Select";

import {
  IconLayersSm,
  IconLEDNextEffectSm,
  IconLEDPreviousEffectSm,
  IconMediaForwardSm,
  IconMediaPlayPauseSm,
  IconMediaRewindSm,
  IconMediaShuffleSm,
  IconMediaSoundLessSm,
  IconMediaSoundMoreSm,
  IconMediaSoundMuteSm,
  IconMediaStopSm,
  IconNullSm,
  IconNoteSm,
  IconMouseSm,
  IconOneShotSm,
  IconThunderSm,
  IconToolsCalculatorSm,
  IconToolsCameraSm,
  IconToolsEjectSm,
  IconToolsBrightnessLessSm,
  IconToolsBrightnessMoreSm,
  IconSleepSm,
  IconShutdownSm,
  IconRobotSm,
  IconWrenchSm,
  IconWirelessSm,
} from "@Renderer/component/Icon";

import i18n from "@Renderer/i18n";

import Key from "@Renderer/modules/KeyPickerKeyboard/Key";
import ES from "@Renderer/modules/KeyPickerKeyboard/ES.json";
import ENi from "@Renderer/modules/KeyPickerKeyboard/ENi.json";
import ENa from "@Renderer/modules/KeyPickerKeyboard/ENa.json";
import GR from "@Renderer/modules/KeyPickerKeyboard/GR.json";
import FR from "@Renderer/modules/KeyPickerKeyboard/FR.json";
import UK from "@Renderer/modules/KeyPickerKeyboard/UK.json";
import FRBEPO from "@Renderer/modules/KeyPickerKeyboard/FR-BEPO.json";
import FROPTIMOT from "@Renderer/modules/KeyPickerKeyboard/FR-OPTIMOT.json";
import SW from "@Renderer/modules/KeyPickerKeyboard/SW.json";
import DN from "@Renderer/modules/KeyPickerKeyboard/DN.json";
import NW from "@Renderer/modules/KeyPickerKeyboard/NW.json";
import IC from "@Renderer/modules/KeyPickerKeyboard/IC.json";
import JP from "@Renderer/modules/KeyPickerKeyboard/JP.json";
import KR from "@Renderer/modules/KeyPickerKeyboard/KR.json";
import SWGR from "@Renderer/modules/KeyPickerKeyboard/SWGR.json";
import EU from "@Renderer/modules/KeyPickerKeyboard/EU.json";

const Style = Styled.div`
width: 100%;
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
`;
const IconColor = Styled.span`
    color: ${props => props.color};
`;

class KeyPickerPreview extends Component {
  constructor(props) {
    super(props);

    // this.state = { selected: 0 };
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  onKeyPress = keycode => {
    const { onKeySelect } = this.props;
    onKeySelect(keycode);
  };

  renderTooltip(tooltips) {
    return (
      <Tooltip id="select-tooltip" className="longtooltip">
        <div>
          {tooltips.map((tip, i) => (
            <React.Fragment key={`Tip-${i}`}>
              {i % 2 == 1 || !isNaN(tip[0]) || tip[0] == "-" ? (
                <p className="ttip-p">{tip}</p>
              ) : (
                <>
                  {i == 0 ? "" : <br />}
                  <h5 className="ttip-h">{tip}</h5>
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </Tooltip>
    );
  }

  render() {
    const { code, disableMods, disableMove, disableAll, selectedlanguage, kbtype, theme } = this.props;

    // let boxShadowMatrix = useTheme().styles.keyPicker.keyMatrixShadow;

    const liso = {
      english: ENi,
      british: UK,
      spanish: ES,
      german: GR,
      french: FR,
      frenchBepo: FRBEPO,
      frenchOptimot: FROPTIMOT,
      swedish: SW,
      finnish: SW,
      danish: DN,
      norwegian: NW,
      icelandic: IC,
      japanese: JP,
      swissGerman: SWGR,
    };
    const lansi = {
      english: ENa,
      korean: KR,
      eurkey: EU,
    };
    let Lang = ENa;

    if (selectedlanguage === "english") {
      if (kbtype === "ansi") {
        if (lansi[selectedlanguage] !== undefined) {
          Lang = lansi[selectedlanguage];
        }
      } else {
        Lang = liso[selectedlanguage];
      }
    } else if (selectedlanguage !== "") {
      if (liso[selectedlanguage] !== undefined) {
        Lang = liso[selectedlanguage];
      } else if (lansi[selectedlanguage] !== undefined) {
        Lang = lansi[selectedlanguage];
      }
    }

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
          {os === "darwin" ? <AiFillApple className="biggerApple" /> : ""}
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
            <OverlayTrigger rootClose placement="top" delay={{ show: 250, hide: 400 }} overlay={this.renderTooltip(key.tooltip)}>
              <MdInfoOutline className="info" />
            </OverlayTrigger>
          </foreignObject>
        );
      }
      return (
        <Key
          key={`id-${key.content.first}-${id}`}
          id={id}
          x={key.x}
          y={key.y}
          selected={false}
          clicked={() => {}}
          onKeyPress={() => {}}
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
        />
      );
    });
    return (
      <Style>
        <div className="max-w-[1080px] mx-auto">
          <div className="px-3 py-3 rounded-md mt-3 flex flex-col w-full bg-gray-25 dark:bg-gray-700/60">
            <h4 className="mt-0 mb-1 uppercase text-xs tracking-wide text-gray-300 dark:text-gray-500">Preview</h4>
            <svg
              className="mx-auto w-full max-w-[1170px] overflow-hidden pointer-events-none"
              viewBox="0 0 860 180"
              preserveAspectRatio="xMidYMin slice"
            >
              <g transform="translate(0 -30)">{keyboard}</g>
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
      </Style>
    );
  }
}

export default withTheme(KeyPickerPreview);

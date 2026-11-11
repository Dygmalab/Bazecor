// -*- mode: js-jsx -*-
/* Bazecor
 * Copyright (C) 2024  DygmaLab SE.
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

import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Styled from "styled-components";

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";
import { KBDataPref } from "@Renderer/types/preferences";
import { MAX_COMBO_IDLE_TIME, MAX_COMBO_WINDOW, MIN_COMBO_WINDOW } from "@Renderer/types/combos";
import {
  IconTypo,
  IconMouse,
  IconInformation,
  IconThunder,
  IconLayerShift,
  IconKeyboard,
} from "@Renderer/components/atoms/icons";
import { Slider } from "@Renderer/components/atoms/slider";
import Heading from "@Renderer/components/atoms/Heading";
import Store from "@Renderer/utils/Store";

// Assets
import { i18n } from "@Renderer/i18n";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@Renderer/components/atoms/Tooltip";

const Styles = Styled.div`

  .slider{
    width: 100%;
  }
  .greytext{
    color: ${({ theme }) => theme.colors.button.background};
  }
  .dropdownMenu{
    position: absolute;
  }
  .overflowFix{
    overflow: inherit;
  }
  .overflowFix::-webkit-scrollbar {
    display: none;
  }
  .dygmaLogo {
    height: 26px;
    width: 26px;
    margin-right 0.5em;
  }
  .fullWidth {
    button {
      width: -webkit-fill-available;
    }
  }
  .va3fix {
    vertical-align: -3px;
  }
  .va2fix {
    vertical-align: -2px;
  }
  .va1fix {
    vertical-align: -1px;
  }
  .backupbuttons {
    margin: 0;
    padding: 0.44em;
    width: -webkit-fill-available;
  }
  .devfix {
    display: flex;
    justify-content: space-evenly;
  }
  .modinfo {
    font-size: 1rem;
    margin-left: 0.3em;
    color: ${({ theme }) => theme.colors.tipIcon};
  }
  .save-holder {
    position: fixed;
    height: 40px;
    bottom: 40px;
    right: 40px;
  }
  .select-icon {
    position: absolute;
    left: 8px;
    top: 13px;
    background-color: ${({ theme }) => theme.colors.button.deselected};
    border: 2px solid ${({ theme }) => theme.colors.button.deselected};
    color: ${({ theme }) => theme.colors.button.text};
    font-size: 1.3em;
    border-radius: 4px;
  }
  .delete-icon {
    font-size: 1.5rem;
    vertical-align: text-top;
  }
  .align-left {
    float: right;
    margin-top: 6px;
  }
  .neuronToggler{
    text-align: left;
    line-height: 1.8em;
    letter-spacing: 0.02em;
    button.btn.btn-error {
      line-height: 1.8em;
      float: right;
      :hover {
        background-color: #c75454;
      }
    }
  }
  .neuronName{
    .nTitle span{
      line-height: 2.8rem;
      white-space: nowrap;
    }
    .nControl input{
      margin-top: 5px;
      line-height: 2.3rem;
    }
    .nButton button{
    line-height: 1.7rem;
    }
  }
  .neuron-lh{
    line-height: 2.4rem;
  }
  .deleteButton {
    min-width: 100%;
    :hover {
      color: inherit;
    }
  }
  .successButton {
    min-width: 100%;
  }
  .accSpan {
    cursor: pointer;
  }
`;

/* Slider bounds of the mouse keys rework settings. They mirror what the firmware stores
 * (MouseKeysDygma: speeds in steps of 20 px/s up to 5100, boost time in steps of 4 ms);
 * the firmware clamps anything outside them anyway. */
const MOUSE_SPEED = { min: 20, max: 5100, step: 20 };
/* Windows moves the cursor one pixel per count, so this speed already feels fast there. macOS moves it
 * much less per count, which is what the range above it is for. */
const MOUSE_SPEED_FAST_ON_WINDOWS = 2000;
const MOUSE_WHEEL = { min: 1, max: 60, step: 1 };
const MOUSE_RAMP = { min: 0, max: 250, step: 5 };
const MOUSE_BOOST_DISTANCE = { min: 0, max: 3000, step: 10 };
const MOUSE_BOOST_TIME = { min: 0, max: 400, step: 4 };

interface SettingTipProps {
  label: string;
  tip: string;
}

function SettingTip({ label, tip }: SettingTipProps) {
  return (
    <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
      {label}
      <TooltipProvider delayDuration={200}>
        <Tooltip>
          <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
            <IconInformation />
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">{tip}</TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </Heading>
  );
}

interface SettingSliderProps {
  label: React.ReactNode;
  display: string;
  value: number;
  bounds: { min: number; max: number; step: number };
  minLabel: string;
  maxLabel: string;
  onValueChange: (value: number[]) => void;
  /** A reference value drawn as a tick on the track. */
  mark?: { value: number; label: string };
}

/* Radix keeps the 16 px thumb inside the track, so the thumb center runs from 8 px to (width - 8 px) */
const SLIDER_THUMB_SIZE = 16;

function SettingSlider({ label, display, value, bounds, minLabel, maxLabel, onValueChange, mark }: SettingSliderProps) {
  const markPercent = mark ? ((mark.value - bounds.min) / (bounds.max - bounds.min)) * 100 : 0;
  const markLeft = `calc(${markPercent}% + ${(0.5 - markPercent / 100) * SLIDER_THUMB_SIZE}px)`;

  return (
    <div className="w-full">
      <div className="w-full flex gap-2">
        <div className="w-full">
          {/* A plain label names one value of the group heading above it */}
          {typeof label === "string" ? (
            <span className="text-ssm font-medium text-gray-400 dark:text-gray-200">{label}</span>
          ) : (
            label
          )}
        </div>
        <div className="flex items-center text-right">
          <span className="tagsfix whitespace-nowrap">{display}</span>
        </div>
      </div>
      <div className="w-full flex gap-2">
        <div className="flex max-w-12 p-0 text-center items-center">
          <span className="tagsfix">{minLabel}</span>
        </div>
        <div className="relative w-full flex items-center p-0">
          {mark && (
            <div className="pointer-events-none absolute inset-y-0 flex flex-col items-center" style={{ left: markLeft }}>
              <span className="absolute top-1/2 h-3 w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-300 dark:bg-gray-200" />
              <span className="absolute top-[calc(50%+8px)] -translate-x-1/2 whitespace-nowrap text-[10px] leading-none text-gray-400 dark:text-gray-200">
                {mark.label}
              </span>
            </div>
          )}
          <Slider min={bounds.min} max={bounds.max} step={bounds.step} value={[value]} onValueChange={onValueChange} />
        </div>
        <div className="flex max-w-12 p-0 text-center items-center">
          <span className="tagsfix">{maxLabel}</span>
        </div>
      </div>
    </div>
  );
}

interface MouseKeysCardProps {
  kbData: KBDataPref;
  setSetting: (field: keyof KBDataPref) => (value: number[]) => void;
}

/* Mouse keys rework firmware (capabilities.mousekeys): constant speeds picked with the
 * Slow / Medium / Fast keys, and the Boost key. */
function MouseKeysCard({ kbData, setSetting }: MouseKeysCardProps) {
  const t = i18n.keyboardSettings.mouse;
  const cardRef = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [highlight, setHighlight] = useState(false);

  // The "Set up Speeds" button in the Layout Editor mouse tab lands here with state.focus = "mouseKeys".
  // Runs on mount only: clearing the state below changes `location`, and re-running would cancel the scroll.
  useEffect(() => {
    if ((location.state as { focus?: string } | null)?.focus !== "mouseKeys") return undefined;
    // Drop the state so the card doesn't scroll again when Preferences reloads after a save
    navigate(location.pathname, { replace: true, state: null });
    const frame = requestAnimationFrame(() => {
      cardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      setHighlight(true);
    });
    const timer = setTimeout(() => setHighlight(false), 2000);
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const {
    mouseSpeedSlow,
    mouseSpeedMedium,
    mouseSpeedFast,
    mouseWheelSlow,
    mouseWheelMedium,
    mouseWheelFast,
    mouseRamp,
    mouseBoostDistance,
    mouseBoostTime,
  } = kbData;
  const speedMark = { value: MOUSE_SPEED_FAST_ON_WINDOWS, label: t.fastOnWindows };

  return (
    <Card
      ref={cardRef}
      className={`mt-3 max-w-2xl mx-auto scroll-mt-24 transition-shadow duration-500 ${
        highlight ? "ring-2 ring-purple-200 dark:ring-purple-300" : ""
      }`}
      variant="default"
    >
      <CardHeader>
        <CardTitle>
          <IconMouse /> {t.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <SettingTip label={t.cursorSpeed} tip={t.cursorSpeedTip} />
          <SettingSlider
            label={t.speedSlow}
            display={`${mouseSpeedSlow} px/s`}
            value={mouseSpeedSlow}
            bounds={MOUSE_SPEED}
            minLabel="Slower"
            maxLabel="Faster"
            onValueChange={setSetting("mouseSpeedSlow")}
            mark={speedMark}
          />
          <SettingSlider
            label={t.speedMedium}
            display={`${mouseSpeedMedium} px/s`}
            value={mouseSpeedMedium}
            bounds={MOUSE_SPEED}
            minLabel="Slower"
            maxLabel="Faster"
            onValueChange={setSetting("mouseSpeedMedium")}
            mark={speedMark}
          />
          <SettingSlider
            label={t.speedFast}
            display={`${mouseSpeedFast} px/s`}
            value={mouseSpeedFast}
            bounds={MOUSE_SPEED}
            minLabel="Slower"
            maxLabel="Faster"
            onValueChange={setSetting("mouseSpeedFast")}
            mark={speedMark}
          />
          <SettingSlider
            label={<SettingTip label={t.ramp} tip={t.rampTip} />}
            display={mouseRamp === 0 ? t.rampInstant : `${mouseRamp} ms`}
            value={mouseRamp}
            bounds={MOUSE_RAMP}
            minLabel="Sharper"
            maxLabel="Smoother"
            onValueChange={setSetting("mouseRamp")}
          />
          <SettingTip label={t.wheelSpeedModes} tip={t.wheelSpeedModesTip} />
          <SettingSlider
            label={t.speedSlow}
            display={`${mouseWheelSlow} /s`}
            value={mouseWheelSlow}
            bounds={MOUSE_WHEEL}
            minLabel="Slower"
            maxLabel="Faster"
            onValueChange={setSetting("mouseWheelSlow")}
          />
          <SettingSlider
            label={t.speedMedium}
            display={`${mouseWheelMedium} /s`}
            value={mouseWheelMedium}
            bounds={MOUSE_WHEEL}
            minLabel="Slower"
            maxLabel="Faster"
            onValueChange={setSetting("mouseWheelMedium")}
          />
          <SettingSlider
            label={t.speedFast}
            display={`${mouseWheelFast} /s`}
            value={mouseWheelFast}
            bounds={MOUSE_WHEEL}
            minLabel="Slower"
            maxLabel="Faster"
            onValueChange={setSetting("mouseWheelFast")}
          />
          <SettingSlider
            label={<SettingTip label={t.boostDistance} tip={t.boostDistanceTip} />}
            display={mouseBoostDistance === 0 ? t.boostOff : `${mouseBoostDistance} px`}
            value={mouseBoostDistance}
            bounds={MOUSE_BOOST_DISTANCE}
            minLabel="Off"
            maxLabel="Farther"
            onValueChange={setSetting("mouseBoostDistance")}
          />
          <SettingSlider
            label={<SettingTip label={t.boostTime} tip={t.boostTimeTip} />}
            display={mouseBoostTime === 0 ? t.rampInstant : `${mouseBoostTime} ms`}
            value={mouseBoostTime}
            bounds={MOUSE_BOOST_TIME}
            minLabel="Snappier"
            maxLabel="Smoother"
            onValueChange={setSetting("mouseBoostTime")}
          />
        </div>
      </CardContent>
    </Card>
  );
}

interface KeyboardSettingsProps {
  kbData: KBDataPref;
  setKbData: (data: KBDataPref) => void;
  connected: boolean;
}

function KeyboardSettings(props: KeyboardSettingsProps) {
  const { kbData, setKbData, connected } = props;
  const [localKBData, setLocalKBData] = useState(kbData);
  const store = Store.getStore();
  const sk20Raw = store.get("capabilities.sk20");
  const sk20 = sk20Raw === true || sk20Raw === "true" || sk20Raw === 1 || sk20Raw === "1";
  const labelWithFastSuper = (text: string) => (sk20 ? text.replace("Add Key on Tap", "Superkeys") : text);
  // Firmware older than the one that ships these features doesn't know their commands
  const autoshift = Boolean(store.get("capabilities.autoshift"));
  const combos = Boolean(store.get("capabilities.combos"));
  const capsword = Boolean(store.get("capabilities.capsword"));
  const mouseKeys = Boolean(store.get("capabilities.mousekeys"));

  useEffect(() => {
    const { kbData: newKBData } = props;
    setLocalKBData(newKBData);
  }, [props, setKbData]);

  const setHoldTimeout = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      qukeysHoldTimeout: value[0],
      SuperHoldstart: sk20 ? value[0] : data.SuperHoldstart,
    }));
    setKbData({
      ...localKBData,
      qukeysHoldTimeout: value[0],
      SuperHoldstart: sk20 ? value[0] : localKBData.SuperHoldstart,
    });
  };

  const setOverlapThreshold = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      qukeysOverlapThreshold: value[0],
    }));
    setKbData({ ...localKBData, qukeysOverlapThreshold: value[0] });
  };

  const setMinHold = (value: number[]) => {
    const clamped = value[0] > 255 ? 255 : value[0];
    setLocalKBData(data => ({
      ...data,
      qukeysMinHold: clamped,
    }));
    setKbData({ ...localKBData, qukeysMinHold: clamped });
  };

  const setMinPrior = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      qukeysMinPrior: value[0],
    }));
    setKbData({ ...localKBData, qukeysMinPrior: value[0] });
  };

  const setSuperTimeout = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      SuperTimeout: value[0],
    }));
    setKbData({ ...localKBData, SuperTimeout: value[0] });
  };

  const setSuperHoldstart = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      SuperHoldstart: value[0],
    }));
    setKbData({ ...localKBData, SuperHoldstart: value[0] });
  };

  const setAutoshiftTimeout = (value: number[]) => {
    setLocalKBData(data => ({ ...data, autoshiftTimeout: value[0] }));
    setKbData({ ...localKBData, autoshiftTimeout: value[0] });
  };

  const setCombosWindow = (value: number[]) => {
    setLocalKBData(data => ({ ...data, combosWindow: value[0] }));
    setKbData({ ...localKBData, combosWindow: value[0] });
  };

  const setCombosIdleTime = (value: number[]) => {
    setLocalKBData(data => ({ ...data, combosIdleTime: value[0] }));
    setKbData({ ...localKBData, combosIdleTime: value[0] });
  };

  const setCapswordTimeout = (value: number[]) => {
    setLocalKBData(data => ({ ...data, capswordTimeout: value[0] }));
    setKbData({ ...localKBData, capswordTimeout: value[0] });
  };

  // const setSuperOverlapThreshold = (value: number[]) => {
  //   setLocalKBData(data => ({
  //     ...data,
  //     SuperOverlapThreshold: value[0],
  //   }));
  //   setKbData({
  //     ...localKBData,
  //     SuperOverlapThreshold: value[0],
  //   });
  // };

  const setSpeed = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      mouseSpeed: value[0],
      mouseSpeedDelay: 10,
    }));
    setKbData({ ...localKBData, mouseSpeed: value[0], mouseSpeedDelay: 10 });
  };

  const setAccelSpeed = async (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      mouseAccelSpeed: value[0],
      mouseAccelDelay: 600,
    }));
    setKbData({ ...localKBData, mouseAccelSpeed: value[0], mouseAccelDelay: 600 });
  };

  const setWheelSpeed = async (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      mouseWheelSpeed: value[0],
      mouseWheelDelay: 100,
    }));
    setKbData({ ...localKBData, mouseWheelSpeed: value[0], mouseWheelDelay: 100 });
  };

  const setSpeedLimit = async (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      mouseSpeedLimit: value[0],
    }));
    setKbData({ ...localKBData, mouseSpeedLimit: value[0] });
  };

  const setMouseKeysSetting = (field: keyof KBDataPref) => (value: number[]) => {
    setLocalKBData(data => ({ ...data, [field]: value[0] }));
    setKbData({ ...localKBData, [field]: value[0] });
  };

  const {
    qukeysHoldTimeout,
    qukeysOverlapThreshold,
    qukeysMinHold,
    qukeysMinPrior,
    SuperTimeout,
    SuperHoldstart,
    // SuperOverlapThreshold,
    autoshiftTimeout,
    capswordTimeout,
    combosWindow,
    combosIdleTime,
    mouseSpeed,
    mouseAccelSpeed,
    mouseWheelSpeed,
    mouseSpeedLimit,
  } = localKBData;

  const mSpeed = (
    <div className="w-full flex gap-2">
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Slow</span>
      </div>
      <div className="w-full flex items-center p-0">
        <Slider min={0} max={127} value={[mouseSpeed]} onValueChange={setSpeed} />
      </div>
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Fast</span>
      </div>
    </div>
  );

  const mAccelS = (
    <div className="w-full flex gap-2">
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Slow</span>
      </div>
      <div className="w-full flex items-center p-0">
        <Slider min={0} max={254} value={[mouseAccelSpeed]} onValueChange={setAccelSpeed} />
      </div>
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Fast</span>
      </div>
    </div>
  );

  const mWheelS = (
    <div className="w-full flex gap-2">
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Slow</span>
      </div>
      <div className="w-full flex items-center p-0">
        <Slider min={1} max={15} value={[mouseWheelSpeed]} onValueChange={setWheelSpeed} />
      </div>
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Fast</span>
      </div>
    </div>
  );

  const mSpeedL = (
    <div className="w-full flex gap-2">
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Slow</span>
      </div>
      <div className="w-full flex items-center p-0">
        <Slider min={0} max={255} value={[mouseSpeedLimit]} onValueChange={setSpeedLimit} />
      </div>
      <div className="flex max-w-12 p-0 text-center items-center">
        <span className="tagsfix">Fast</span>
      </div>
    </div>
  );

  if (connected) {
    return (
      <Styles>
        <Card className="max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle>
              <IconTypo /> {sk20 ? "Superkeys" : i18n.keyboardSettings.superkeys.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {qukeysHoldTimeout >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {sk20
                          ? i18n.keyboardSettings.superkeys.holdstart.replace("Superkeys - ", "")
                          : labelWithFastSuper(i18n.keyboardSettings.qukeys.holdTimeout)}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.holdTimeoutTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.qukeys.holdTimeoutTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.holdTimeoutTip3}</li>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.holdTimeoutTip4}</li>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.holdTimeoutTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{qukeysHoldTimeout} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={1} max={255} value={[qukeysHoldTimeout]} onValueChange={setHoldTimeout} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              )}
              {qukeysOverlapThreshold >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {sk20
                          ? labelWithFastSuper(i18n.keyboardSettings.qukeys.overlapThreshold).replace("Superkeys - ", "").trim()
                          : labelWithFastSuper(i18n.keyboardSettings.qukeys.overlapThreshold)}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.overlapThresholdTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.qukeys.overlapThresholdTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.overlapThresholdTip3}</li>
                                {sk20 && <li className="text-left">{i18n.keyboardSettings.qukeys.superkeysAffectsNote}</li>}
                                <li className="text-left">{i18n.keyboardSettings.qukeys.overlapThresholdTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{qukeysOverlapThreshold}%</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={0} max={100} value={[qukeysOverlapThreshold]} onValueChange={setOverlapThreshold} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              )}
              {qukeysMinHold >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {sk20
                          ? labelWithFastSuper(i18n.keyboardSettings.qukeys.minHold).replace("Superkeys - ", "").trim()
                          : labelWithFastSuper(i18n.keyboardSettings.qukeys.minHold)}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.minHoldTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.qukeys.minHoldTip2}</li>
                                {sk20 && <li className="text-left">{i18n.keyboardSettings.qukeys.superkeysAffectsNote}</li>}
                                <li className="text-left">{i18n.keyboardSettings.qukeys.minHoldTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{qukeysMinHold} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={1} max={254} value={[qukeysMinHold]} onValueChange={setMinHold} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              )}
              {qukeysMinPrior >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {sk20
                          ? labelWithFastSuper(i18n.keyboardSettings.qukeys.minPrior).replace("Superkeys - ", "").trim()
                          : labelWithFastSuper(i18n.keyboardSettings.qukeys.minPrior)}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.minPriorTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.qukeys.minPriorTip2}</li>
                                {sk20 && <li className="text-left">{i18n.keyboardSettings.qukeys.superkeysAffectsNote}</li>}
                                <li className="text-left">{i18n.keyboardSettings.qukeys.minPriorTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{qukeysMinPrior} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={1} max={254} value={[qukeysMinPrior]} onValueChange={setMinPrior} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              )}
              {SuperHoldstart >= 0 && !sk20 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.superkeys.holdstart}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.superkeys.chordingTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.superkeys.chordingTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.chordingTip3}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.chordingTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{SuperHoldstart} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={120} max={500} value={[SuperHoldstart]} onValueChange={setSuperHoldstart} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              )}
              {/* {SuperOverlapThreshold >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.superkeys.overlap}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.superkeys.overlapTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.superkeys.overlapTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.overlapTip3}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.overlapTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Less</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={0} max={80} value={[SuperOverlapThreshold]} onValueChange={setSuperOverlapThreshold} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )} */}
              {SuperTimeout >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {sk20
                          ? i18n.keyboardSettings.superkeys.timeout.replace("Superkeys - ", "")
                          : i18n.keyboardSettings.superkeys.timeout}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.superkeys.timeoutTip1}
                              </Heading>
                              <ul className="list-disc pl-4">
                                <li className="text-left">{i18n.keyboardSettings.superkeys.timeoutTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.timeoutTip3}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.timeoutTip4}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.timeoutTipDefault}</li>
                              </ul>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{SuperTimeout} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={1} max={500} value={[SuperTimeout]} onValueChange={setSuperTimeout} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {autoshift && (
          <Card className="mt-3 max-w-2xl mx-auto" variant="default">
            <CardHeader>
              <CardTitle>
                <IconThunder /> {i18n.keyboardSettings.autoshift.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* No on/off switch: Autoshift is always enabled. A key only behaves
               * differently once it is actually assigned as autoshiftable in the
               * Layout Editor, so a global toggle added a second place to look
               * when a key "did nothing". */}
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.autoshift.holdTimeout}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{i18n.keyboardSettings.autoshift.holdTimeoutTip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{autoshiftTimeout} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={50} max={2000} step={5} value={[autoshiftTimeout]} onValueChange={setAutoshiftTimeout} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Safer</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {combos && (
          <Card className="mt-3 max-w-2xl mx-auto" variant="default">
            <CardHeader>
              <CardTitle>
                <IconKeyboard /> {i18n.keyboardSettings.combos.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.combos.window}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{i18n.keyboardSettings.combos.windowTip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">{combosWindow} ms</span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Stricter</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      {/* Bounds mirror CombosDygma::MIN/MAX_MATCH_WINDOW_MS; the
                       * firmware clamps anything outside them anyway. */}
                      <Slider
                        min={MIN_COMBO_WINDOW}
                        max={MAX_COMBO_WINDOW}
                        step={5}
                        value={[combosWindow]}
                        onValueChange={setCombosWindow}
                      />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Looser</span>
                    </div>
                  </div>
                </div>
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.combos.idleTime}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{i18n.keyboardSettings.combos.idleTimeTip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">
                        {combosIdleTime === 0 ? i18n.keyboardSettings.combos.idleTimeDisabled : `${combosIdleTime} ms`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Off</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      {/* Bounds mirror CombosDygma::MAX_IDLE_TIME_MS; 0 turns the
                       * requirement off. */}
                      <Slider
                        min={0}
                        max={MAX_COMBO_IDLE_TIME}
                        step={10}
                        value={[combosIdleTime]}
                        onValueChange={setCombosIdleTime}
                      />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Faster</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {capsword && (
          <Card className="mt-3 max-w-2xl mx-auto" variant="default">
            <CardHeader>
              <CardTitle>
                <IconLayerShift /> {i18n.keyboardSettings.capsword.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Always enabled; the CapsWord key has to be assigned to do
               * anything, which is toggle enough. */}
              <div className="flex flex-col gap-4">
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.capsword.idleTimeout}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">{i18n.keyboardSettings.capsword.idleTimeoutTip}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </Heading>
                    </div>
                    <div className="flex items-center text-right">
                      <span className="tagsfix whitespace-nowrap">
                        {capswordTimeout === 0 ? i18n.keyboardSettings.capsword.idleDisabled : `${capswordTimeout / 1000} s`}
                      </span>
                    </div>
                  </div>
                  <div className="w-full flex gap-2">
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Never</span>
                    </div>
                    <div className="w-full flex items-center p-0">
                      <Slider min={0} max={30000} step={500} value={[capswordTimeout]} onValueChange={setCapswordTimeout} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">Longer</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
        {mouseKeys ? (
          <MouseKeysCard kbData={localKBData} setSetting={setMouseKeysSetting} />
        ) : (
          <Card className="mt-3 max-w-2xl mx-auto" variant="default">
            <CardHeader>
              <CardTitle>
                <IconMouse /> {i18n.keyboardSettings.mouse.title}
              </CardTitle>
            </CardHeader>
            <CardContent className="pb-0">
              <div className="flex flex-col gap-4">
                {mouseSpeed >= 0 && (
                  <div className="w-full">
                    <div className="w-full flex gap-2">
                      <div className="w-full">{i18n.keyboardSettings.mouse.speed}</div>
                      <div className="flex items-center text-right">
                        <span className="tagsfix whitespace-nowrap">{mouseSpeed}</span>
                      </div>
                    </div>
                    {mSpeed}
                  </div>
                )}
                {mouseAccelSpeed >= 0 && (
                  <div className="w-full">
                    <div className="w-full flex gap-2">
                      <div className="w-full">{i18n.keyboardSettings.mouse.accelSpeed}</div>
                      <div className="flex items-center text-right">
                        <span className="tagsfix whitespace-nowrap">{mouseAccelSpeed}</span>
                      </div>
                    </div>
                    {mAccelS}
                  </div>
                )}
                {mouseSpeedLimit >= 0 && (
                  <div className="w-full">
                    <div className="w-full flex gap-2">
                      <div className="w-full">{i18n.keyboardSettings.mouse.speedLimit}</div>
                      <div className="flex items-center text-right">
                        <span className="tagsfix whitespace-nowrap">{mouseSpeedLimit}</span>
                      </div>
                    </div>
                    {mSpeedL}
                  </div>
                )}
                {mouseWheelSpeed >= 0 && (
                  <div className="w-full">
                    <div className="w-full flex gap-2">
                      <div className="w-full">{i18n.keyboardSettings.mouse.wheelSpeed}</div>
                      <div className="flex items-center text-right">
                        <span className="tagsfix whitespace-nowrap">{mouseWheelSpeed}</span>
                      </div>
                    </div>
                    {mWheelS}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </Styles>
    );
  }
}

export { KeyboardSettings };

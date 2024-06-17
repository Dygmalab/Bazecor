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

import React, { useEffect, useState } from "react";
import Styled from "styled-components";

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";
import { KBDataPref } from "@Renderer/types/preferences";
import { IconTypo, IconMouse, IconInformation } from "@Renderer/components/atoms/icons";
import { Slider } from "@Renderer/components/atoms/slider";
import Heading from "@Renderer/components/atoms/Heading";

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

interface KeyboardSettingsProps {
  kbData: KBDataPref;
  setKbData: (data: KBDataPref) => void;
  connected: boolean;
}

function KeyboardSettings(props: KeyboardSettingsProps) {
  const { kbData, setKbData, connected } = props;
  const [localKBData, setLocalKBData] = useState(kbData);

  useEffect(() => {
    const { kbData: newKBData } = props;
    setLocalKBData(newKBData);
  }, [props, setKbData]);

  const setHoldTimeout = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      qukeysHoldTimeout: value[0],
    }));
    setKbData({ ...localKBData, qukeysHoldTimeout: value[0] });
  };

  const setOverlapThreshold = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      qukeysOverlapThreshold: value[0],
    }));
    setKbData({ ...localKBData, qukeysOverlapThreshold: value[0] });
  };

  const setMinHold = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      qukeysMinHold: value[0],
    }));
    setKbData({ ...localKBData, qukeysMinHold: value[0] });
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

  const setSuperOverlapThreshold = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      SuperOverlapThreshold: value[0],
    }));
    setKbData({
      ...localKBData,
      SuperOverlapThreshold: value[0],
    });
  };

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

  const {
    qukeysHoldTimeout,
    qukeysOverlapThreshold,
    qukeysMinHold,
    qukeysMinPrior,
    SuperTimeout,
    SuperHoldstart,
    SuperOverlapThreshold,
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
              <IconTypo /> {i18n.keyboardSettings.superkeys.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4">
              {qukeysOverlapThreshold >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.qukeys.overlapThreshold}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.overlapThresholdTip1}
                              </Heading>
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.overlapThresholdTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.overlapThresholdTip3}</li>
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
                      <Slider min={0} max={100} value={[qukeysOverlapThreshold]} onValueChange={setOverlapThreshold} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )}
              {qukeysHoldTimeout >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.qukeys.holdTimeout}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.holdTimeoutTip1}
                              </Heading>
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.holdTimeoutTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.holdTimeoutTip3}</li>
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
                      <Slider min={1} max={255} value={[qukeysHoldTimeout]} onValueChange={setHoldTimeout} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )}
              {qukeysMinHold >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.qukeys.minHold}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.minHoldTip1}
                              </Heading>
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.minHoldTip2}</li>
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
                      <Slider min={1} max={254} value={[qukeysMinHold]} onValueChange={setMinHold} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )}
              {qukeysMinPrior >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.qukeys.minPrior}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.qukeys.minPriorTip1}
                              </Heading>
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.qukeys.minPriorTip2}</li>
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
                      <Slider min={1} max={254} value={[qukeysMinPrior]} onValueChange={setMinPrior} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )}
              {SuperOverlapThreshold >= 0 && (
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
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.overlapTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.overlapTip3}</li>
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
              )}
              {SuperTimeout >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">
                      <Heading headingLevel={3} renderAs="paragraph-sm" className="flex items-center gap-2">
                        {i18n.keyboardSettings.superkeys.timeout}
                        <TooltipProvider delayDuration={200}>
                          <Tooltip>
                            <TooltipTrigger className="[&_svg]:text-purple-100 [&_svg]:dark:text-purple-200">
                              <IconInformation />
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <Heading headingLevel={4} renderAs="h4" className="text-gray-600 dark:text-gray-25 mb-3 leading-6">
                                {i18n.keyboardSettings.superkeys.timeoutTip1}
                              </Heading>
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.timeoutTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.timeoutTip3}</li>
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
                      <Slider min={1} max={500} value={[SuperTimeout]} onValueChange={setSuperTimeout} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )}
              {SuperHoldstart >= 0 && (
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
                              <ul>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.chordingTip2}</li>
                                <li className="text-left">{i18n.keyboardSettings.superkeys.chordingTip3}</li>
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
                      <Slider min={120} max={500} value={[SuperHoldstart]} onValueChange={setSuperHoldstart} />
                    </div>
                    <div className="flex max-w-12 p-0 text-center items-center">
                      <span className="tagsfix">More</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
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
                  </div>
                  {mSpeed}
                </div>
              )}
              {mouseAccelSpeed >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">{i18n.keyboardSettings.mouse.accelSpeed}</div>
                  </div>
                  {mAccelS}
                </div>
              )}
              {mouseSpeedLimit >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">{i18n.keyboardSettings.mouse.speedLimit}</div>
                  </div>
                  {mSpeedL}
                </div>
              )}
              {mouseWheelSpeed >= 0 && (
                <div className="w-full">
                  <div className="w-full flex gap-2">
                    <div className="w-full">{i18n.keyboardSettings.mouse.wheelSpeed}</div>
                  </div>
                  {mWheelS}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </Styles>
    );
  }
}

export { KeyboardSettings };

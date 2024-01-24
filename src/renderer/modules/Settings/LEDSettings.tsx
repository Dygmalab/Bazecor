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

// External components
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Slider from "@appigram/react-rangeslider";

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import { Switch } from "@Renderer/components/ui/switch";
import { KBDataPref } from "@Renderer/types/preferences";

// Assets
import { Badge } from "@Renderer/component/Badge";
import { IconFlashlight, IconIridescentWhiteBalance, IconThunder } from "@Renderer/component/Icon";
import Callout from "@Renderer/component/Callout";
import i18n from "../../i18n";
import Heading from "@Renderer/components/ui/heading";

interface KeyboardSettingsProps {
  kbData: KBDataPref;
  setKbData: (data: KBDataPref) => void;
  connected: boolean;
  isWireless: boolean;
}

function LEDSettings(props: KeyboardSettingsProps) {
  const { kbData, setKbData, connected, isWireless } = props;
  const [localKBData, setLocalKBData] = useState(kbData);

  useEffect(() => {
    const { kbData: newKBData } = props;
    setLocalKBData(newKBData);
  }, [props, setKbData]);

  const selectIdleLEDTime = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      ledIdleTimeLimit: value * 60,
    }));
    setKbData({ ...localKBData, ledIdleTimeLimit: value * 60 });
  };

  const setBrightness = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      ledBrightness: (value * 255) / 100,
    }));
    setKbData({ ...localKBData, ledBrightness: (value * 255) / 100 });
  };

  const setBrightnessUG = (value: number) => {
    setLocalKBData(data => ({
      ...data,
      ledBrightnessUG: (value * 255) / 100,
    }));
    setKbData({ ...localKBData, ledBrightnessUG: (value * 255) / 100 });
  };

  const { ledBrightness, ledBrightnessUG, ledIdleTimeLimit } = localKBData;

  if (connected) {
    return (
      <>
        {isWireless && (
          <div className="max-w-2xl mx-auto mb-3">
            <Callout content="These configurations only apply when the Saving Mode is NOT active." size="sm" />
          </div>
        )}
        <Card className="max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFlashlight /> {i18n.keyboardSettings.led.title}
              </div>{" "}
              {isWireless && (
                <Badge content={i18n.wireless.energyManagement.settings.highBatteryImpact} variation="danger-low" size="sm" />
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {ledIdleTimeLimit >= 0 && (
              <div className={`${isWireless ? "px-3 py-3 bg-gray-100/20 dark:bg-gray-900/15 rounded" : ""}`}>
                <Heading headingLevel={2} renderAs="paragraph-sm" className={`tracking-normal ${isWireless && "mb-2"}`}>
                  {i18n.keyboardSettings.led.idleTimeLimit}
                </Heading>
                <div className="flex flex-col">
                  <div className="flex w-full gap-2 items-center">
                    {isWireless && <label className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wired</label>}
                    <div className="block w-full relative">
                      <Slider min={0} max={60} step={1} value={ledIdleTimeLimit / 60} onChange={selectIdleLEDTime} />
                    </div>
                  </div>
                  {isWireless && (
                    <div className="flex w-full gap-2 items-center">
                      <label className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wireless</label>
                      {/* <Slider min={0} max={60} value={Math.round(wireless.idleleds / 60)} onChange={setIdleleds} /> */}
                      <div className="block w-full relative">
                        <Slider
                          min={0}
                          max={60}
                          step={1}
                          value={ledIdleTimeLimit / 60}
                          onChange={selectIdleLEDTime}
                          className="slider-danger"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`flex justify-between ${isWireless && "pl-[4.5rem]"}`}>
                    <span className="text-xs text-gray-300 dark:text-gray-200">Off</span>
                    <span className="text-xs text-gray-300 dark:text-gray-200">60min</span>
                  </div>
                </div>
              </div>
            )}
            {ledBrightness >= 0 && (
              <div className={`${isWireless ? "px-3 py-3 bg-gray-100/20 dark:bg-gray-900/15 rounded mt-3" : "mt-4"}`}>
                <Heading headingLevel={2} renderAs="paragraph-sm" className={`tracking-normal ${isWireless && "mb-2"}`}>
                  {i18n.keyboardSettings.led.brightness}
                </Heading>
                <div className="flex flex-col">
                  <div className="flex w-full gap-2 items-center">
                    {isWireless && <label className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wired</label>}
                    <div className="block w-full relative">
                      {/* <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round((wireless.brightness * 100) / 255)}
                        onChange={setBrightness}
                      /> */}
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round((ledBrightness * 100) / 255)}
                        onChange={setBrightness}
                      />
                    </div>
                  </div>
                  {isWireless && (
                    <div className="flex w-full gap-2 items-center">
                      <label className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wireless</label>
                      <div className="block w-full relative">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={Math.round((ledBrightness * 100) / 255)}
                          onChange={setBrightness}
                          className="slider-danger"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`flex justify-between ${isWireless && "pl-[4.5rem]"}`}>
                    <span className="text-xs text-gray-300 dark:text-gray-200">0%</span>
                    <span className="text-xs text-gray-300 dark:text-gray-200">100%</span>
                  </div>
                </div>
              </div>
            )}
            {ledBrightnessUG >= 0 && (
              <div className={`${isWireless ? "px-3 py-3 bg-gray-100/20 dark:bg-gray-900/15 rounded mt-3" : "mt-4"}`}>
                <Heading headingLevel={2} renderAs="paragraph-sm" className={`tracking-normal ${isWireless && "mb-2"}`}>
                  {i18n.keyboardSettings.led.brightnessUG}
                </Heading>
                <div className="flex flex-col">
                  <div className="flex w-full gap-2 items-center">
                    {isWireless && <label className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wired</label>}
                    <div className="block w-full relative">
                      {/* <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round((wireless.brightnessUG * 100) / 255)}
                        onChange={setBrightnessUG}
                      /> */}
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={Math.round((ledBrightnessUG * 100) / 255)}
                        onChange={setBrightnessUG}
                      />
                    </div>
                  </div>
                  {isWireless && (
                    <div className="flex w-full gap-2 items-center">
                      <label className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wireless</label>
                      <div className="block w-full relative">
                        <Slider
                          min={0}
                          max={100}
                          step={1}
                          value={Math.round((ledBrightnessUG * 100) / 255)}
                          onChange={setBrightnessUG}
                          className="slider-danger"
                        />
                      </div>
                    </div>
                  )}
                  <div className={`flex justify-between ${isWireless && "pl-[4.5rem]"}`}>
                    <span className="text-xs text-gray-300 dark:text-gray-200">0%</span>
                    <span className="text-xs text-gray-300 dark:text-gray-200">100%</span>
                  </div>
                </div>
              </div>
            )}
            {isWireless && (
              <div className="mt-3 rounded-sm bg-primary/35 border-[1px] border-primary/90 py-3 px-3">
                <p className="flex flex-row gap-2 items-center text-xs text-gray-50">
                  <span className="w-[24px]">
                    <IconThunder />
                  </span>{" "}
                  It's essential to note that LEDs can significantly impact battery consumption. To optimize battery life when
                  using your device wirelessly, you can finely adjust LED intensity.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
        {isWireless && (
          <Card className="mt-3 max-w-2xl mx-auto" variant="default">
            <CardHeader>
              <CardTitle className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-2">
                  <IconIridescentWhiteBalance /> {i18n.wireless.energyManagement.settings.highlightLayerChanging}
                </div>{" "}
                <Badge content={i18n.wireless.energyManagement.settings.lowBatteryImpact} variation="subtle" size="sm" />
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-row gap-3 justify-between items-center">
              <p className="text-sm font-normal text-gray-300 dark:text-gray-100">
                {i18n.wireless.energyManagement.settings.highlightLayerChangingDesc}
              </p>
              <Switch
                id="FadeSwitch"
                defaultChecked={false}
                checked={false}
                onCheckedChange={() => {}}
                variant="default"
                size="sm"
              />
            </CardContent>
          </Card>
        )}
      </>
    );
  }
}

export default LEDSettings;

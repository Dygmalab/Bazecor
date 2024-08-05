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
import log from "electron-log/renderer";

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";
import { Switch } from "@Renderer/components/atoms/Switch";
import { LEDSettingsPreferences } from "@Renderer/types/preferences";
import { Slider } from "@Renderer/components/atoms/slider";

// Assets
// import { Badge } from "@Renderer/component/Badge";
import { Badge } from "@Renderer/components/atoms/Badge";
import { IconFlashlight, IconIridescentWhiteBalance, IconThunder } from "@Renderer/components/atoms/icons";
import Callout from "@Renderer/components/molecules/Callout/Callout";
import { i18n } from "@Renderer/i18n";
import Heading from "@Renderer/components/atoms/Heading";

function LEDSettings(props: LEDSettingsPreferences) {
  const { kbData, wireless, setKbData, setWireless, connected, isWireless } = props;
  const [localKBData, setLocalKBData] = useState(kbData);
  const [localWireless, setLocalWireless] = useState(wireless);

  const selectIdleLEDTime = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      ledIdleTimeLimit: value[0] * 60,
    }));
    setKbData({ ...localKBData, ledIdleTimeLimit: value[0] * 60 });
  };

  const selectIdleLEDTimeWireless = (value: number[]) => {
    setLocalWireless(data => ({
      ...data,
      idleleds: value[0] * 60,
    }));
    setWireless({ ...localWireless, idleleds: value[0] * 60 });
  };

  const setBrightness = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      ledBrightness: (value[0] * 255) / 100,
    }));
    setKbData({ ...localKBData, ledBrightness: (value[0] * 255) / 100 });
  };

  const setBrightnessWireless = (value: number[]) => {
    setLocalWireless(data => ({
      ...data,
      brightness: (value[0] * 255) / 100,
    }));
    setWireless({ ...localWireless, brightness: (value[0] * 255) / 100 });
  };

  const setBrightnessUG = (value: number[]) => {
    setLocalKBData(data => ({
      ...data,
      ledBrightnessUG: (value[0] * 255) / 100,
    }));
    setKbData({ ...localKBData, ledBrightnessUG: (value[0] * 255) / 100 });
  };

  const setBrightnessUGWireless = (value: number[]) => {
    setLocalWireless(data => ({
      ...data,
      brightnessUG: (value[0] * 255) / 100,
    }));
    setWireless({ ...localWireless, brightnessUG: (value[0] * 255) / 100 });
  };

  const setFade = async (checked: boolean) => {
    setLocalWireless(data => ({
      ...data,
      fade: checked ? 1 : 0,
    }));
    setWireless({ ...localWireless, fade: checked ? 1 : 0 });
  };

  useEffect(() => {
    const { kbData: newKBData, wireless: newWireless } = props;
    log.log("checking for changes", newKBData, newWireless);

    setLocalKBData(newKBData);
    setLocalWireless(newWireless);
  }, [props]);

  const { ledBrightness, ledBrightnessUG, ledIdleTimeLimit } = localKBData;
  const { idleleds, brightness, brightnessUG, fade } = localWireless;

  if (connected) {
    return (
      <>
        {isWireless && (
          <div className="max-w-2xl mx-auto mb-3">
            <Callout size="sm" className="mt-4">
              <p>These wireless configurations only apply when the Saving Mode is NOT active.</p>
            </Callout>
          </div>
        )}
        <Card className="max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFlashlight /> {i18n.keyboardSettings.led.title} brightness intensity
              </div>{" "}
              {isWireless && (
                <Badge variant="danger" size="xs">
                  {i18n.wireless.energyManagement.settings.highBatteryImpact}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${isWireless ? "px-3 py-3 bg-gray-100/20 dark:bg-gray-900/15 rounded mt-3" : "mt-4"}`}>
              <Heading headingLevel={2} renderAs="paragraph-sm" className={`tracking-normal ${isWireless && "mb-2"}`}>
                {i18n.keyboardSettings.led.brightness}
              </Heading>
              <div className="flex flex-col">
                <div className="flex w-full gap-2 items-center">
                  {isWireless && <div className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wired</div>}
                  <div className="block w-full relative">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[Math.round((ledBrightness * 100) / 255)]}
                      onValueChange={setBrightness}
                    />
                  </div>
                </div>
                {isWireless && (
                  <div className="flex w-full gap-2 items-center">
                    <div className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wireless</div>
                    <div className="block w-full relative">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[Math.round((brightness * 100) / 255)]}
                        onValueChange={setBrightnessWireless}
                        className="slider-danger"
                        variant="alert"
                        dataPlacement="bottom"
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
            <div className={`${isWireless ? "px-3 py-3 bg-gray-100/20 dark:bg-gray-900/15 rounded mt-3" : "mt-4"}`}>
              <Heading headingLevel={2} renderAs="paragraph-sm" className={`tracking-normal ${isWireless && "mb-2"}`}>
                {i18n.keyboardSettings.led.brightnessUG}
              </Heading>
              <div className="flex flex-col">
                <div className="flex w-full gap-2 items-center">
                  {isWireless && <div className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wired</div>}
                  <div className="block w-full relative">
                    <Slider
                      min={0}
                      max={100}
                      step={1}
                      value={[Math.round((ledBrightnessUG * 100) / 255)]}
                      onValueChange={setBrightnessUG}
                    />
                  </div>
                </div>
                {isWireless && (
                  <div className="flex w-full gap-2 items-center">
                    <div className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wireless</div>
                    <div className="block w-full relative">
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[Math.round((brightnessUG * 100) / 255)]}
                        onValueChange={setBrightnessUGWireless}
                        className="slider-danger"
                        variant="alert"
                        dataPlacement="bottom"
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
          </CardContent>
        </Card>
        <Card className="mt-3 max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <IconFlashlight /> {i18n.keyboardSettings.led.title} timer off
              </div>
              {isWireless && (
                <Badge variant="danger" size="xs">
                  {i18n.wireless.energyManagement.settings.highBatteryImpact}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-row gap-3 justify-between items-center">
            {ledIdleTimeLimit >= 0 && (
              <div className={`${isWireless ? "px-3 py-3 bg-gray-100/20 dark:bg-gray-900/15 rounded w-full" : "w-full"}`}>
                <Heading headingLevel={2} renderAs="paragraph-sm" className={`tracking-normal ${isWireless && "mb-2"}`}>
                  {i18n.keyboardSettings.led.idleTimeLimit}
                </Heading>
                <div className="flex flex-col w-full">
                  <div className="flex w-full gap-2 items-center">
                    {isWireless && <div className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wired</div>}
                    <div className="block w-full relative">
                      <Slider min={0} max={60} step={1} value={[ledIdleTimeLimit / 60]} onValueChange={selectIdleLEDTime} />
                    </div>
                  </div>
                  {isWireless && (
                    <div className="flex w-full gap-2 items-center">
                      <div className="min-w-16 mb-0 text-sm text-gray-400 dark:text-gray-100">Wireless</div>
                      <div className="block w-full relative">
                        <Slider
                          min={0}
                          max={60}
                          step={1}
                          value={[idleleds / 60]}
                          onValueChange={selectIdleLEDTimeWireless}
                          className="slider-danger"
                          variant="alert"
                          dataPlacement="bottom"
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
          </CardContent>
        </Card>

        {isWireless && (
          <>
            <Card className="mt-3 max-w-2xl mx-auto" variant="default">
              <CardHeader>
                <CardTitle className="flex flex-row items-center justify-between">
                  <div className="flex items-center gap-2">
                    <IconIridescentWhiteBalance /> {i18n.wireless.energyManagement.settings.highlightLayerChanging}
                  </div>{" "}
                  <Badge variant="subtle" size="xs">
                    {i18n.wireless.energyManagement.settings.lowBatteryImpact}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-row gap-3 justify-between items-center">
                <p className="text-sm font-normal text-gray-300 dark:text-gray-100">
                  {i18n.wireless.energyManagement.settings.highlightLayerChangingDesc}
                </p>
                <Switch id="FadeSwitch" checked={fade > 0} onCheckedChange={setFade} variant="default" size="sm" />
              </CardContent>
            </Card>
            <div className="mt-3 max-w-2xl mx-auto py-3 px-3 rounded-sm border-[1px] border-primary/15 dark:border-primary/90 bg-primary/15 dark:bg-primary/35">
              <p className="flex flex-row gap-2 items-center text-xs text-primary/75 dark:text-gray-50">
                <span className="w-[24px]">
                  <IconThunder />
                </span>
                {`It's essential to note that LEDs can significantly impact battery consumption. To optimize battery life when using
                your device wirelessly, you can finely adjust LED intensity.`}
              </p>
            </div>
          </>
        )}
      </>
    );
  }
}

export default LEDSettings;

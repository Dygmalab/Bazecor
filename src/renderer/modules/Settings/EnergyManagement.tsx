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

import React from "react";
import Styled from "styled-components";

// External components
import Slider from "@appigram/react-rangeslider";

// Modules
import { AdvancedBatterySettings, SavingMode } from "@Renderer/modules/Battery";

// Custom components
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import { Switch } from "@Renderer/components/ui/switch";
import Title from "@Renderer/component/Title";
import { Badge } from "@Renderer/component/Badge";
import { IconFlashlight, IconLeaf } from "@Renderer/component/Icon";
import Heading from "@Renderer/components/ui/heading";
import i18n from "@Renderer/i18n";

// Import Types for wireless
import { EnergyManagementProps } from "@Renderer/types/wireless";

const Styles = Styled.div`
.card {
  height: inherit;
}
.battery-defy--indicator {
  display: flex;
  grid-gap: 8px;
  margin-bottom: 42px;
  position: relative;
  max-width: 202px;
}
.custom-switch {
  min-height: 36px;
}
.savingModedescription {
  margin-top: 24px;
  p {
    font-size: 0.75rem;
    font-weight: 401;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.styles.batterySettings.descriptionColor};
    strong {
      font-weight: 401;
      color: ${({ theme }) => theme.styles.batterySettings.descriptionHighlightColor};
    }
  }
}
`;

function EnergyManagement(props: EnergyManagementProps) {
  const { wireless, changeWireless } = props;

  const setTrueSleep = async (checked: boolean) => {
    // console.log("clicked true sleep");
    const newWireless = { ...wireless };
    newWireless.true_sleep = checked;
    changeWireless(newWireless);
  };

  const setTrueSleepTime = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.true_sleep_time = value * 60;
    changeWireless(newWireless);
  };

  return (
    <Styles>
      <Card className="mt-3 max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle>
            <IconLeaf /> {i18n.wireless.energyManagement.savingMode}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 pb-3">
          <SavingMode wireless={wireless} changeWireless={changeWireless} />
        </CardContent>
      </Card>
      <Card className="mt-3 max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <IconFlashlight /> {i18n.wireless.energyManagement.settings.trueSleepEnabling} mode
            </div>{" "}
            <Badge content={i18n.wireless.energyManagement.settings.mediumBatteryImpact} variation="warning" size="sm" />
          </CardTitle>
          <CardDescription>
            <p className="text-sm font-semibold tracking-tight text-gray-500 dark:text-gray-100">
              {i18n.wireless.energyManagement.settings.trueSleepEnablingDesc}
            </p>
          </CardDescription>
        </CardHeader>
        <CardContent className="py-3">
          <div className="flex flex-col">
            <div className="flex items-center w-full justify-between py-2 border-b-[1px] border-gray-50 dark:border-gray-700">
              <label htmlFor="TrueSleepSwitch" className="m-0 text-sm font-semibold tracking-tight">
                Enable true sleep mode
              </label>
              <Switch
                id="TrueSleepSwitch"
                value={wireless.true_sleep ? 1 : 0}
                checked={wireless.true_sleep === true}
                onCheckedChange={setTrueSleep}
                variant="default"
                size="sm"
              />
            </div>
            <div className={`flex flex-col gap-2 pt-3 ${wireless.true_sleep ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
              <Heading headingLevel={3} renderAs="paragraph-sm" className="flex flex-row gap-2 items-center">
                {i18n.wireless.energyManagement.settings.trueSleepTimeDesc}
              </Heading>
              <div className="block w-full relative">
                <Slider
                  min={0}
                  max={100}
                  step={1}
                  value={Math.round(wireless.true_sleep_time / 60)}
                  onChange={setTrueSleepTime}
                  className="slider-danger"
                  disabled={wireless.true_sleep === true}
                />
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-300 dark:text-gray-200">1 min</span>
              <span className="text-xs text-gray-300 dark:text-gray-200">240 min</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Styles>
  );
}

export default EnergyManagement;

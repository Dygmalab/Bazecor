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

// Import Types
import { BatterySettingsProps } from "@Types/wireless";

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/atoms/Card";
import { BatteryStatusSide, SavingModeIndicator } from "@Renderer/components/atoms/battery";

// Assets
import { IconBattery } from "@Renderer/components/atoms/icons";
import { i18n } from "@Renderer/i18n";

const Styles = Styled.div`
padding-top: 24px;
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
.battery-sonsei--container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
}
`;

function BatterySettings(props: BatterySettingsProps) {
  const { wireless, deviceType } = props;
  const isSonsei = deviceType?.toLowerCase().includes("sonsei");

  if (isSonsei) {
    return (
      <Styles>
        <Card className="max-w-2xl mx-auto" variant="default">
          <CardHeader>
            <CardTitle variant="default">
              <IconBattery /> {i18n.wireless.batteryPreferences.battery}
            </CardTitle>
          </CardHeader>

          <CardContent className="py-0">
            <div className="battery-sonsei--container">
              <div className="relative">
                <BatteryStatusSide
                  side="left"
                  batteryLevel={wireless.battery ? wireless.battery.LeftLevel : 100}
                  isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
                  batteryStatus={wireless.battery ? wireless.battery.LeftState : 0}
                  size="lg"
                  deviceType={deviceType}
                />
                <SavingModeIndicator
                  isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
                  deviceType={deviceType}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </Styles>
    );
  }

  return (
    <Styles>
      <Card className="max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle variant="default">
            <IconBattery /> {i18n.wireless.batteryPreferences.battery}
          </CardTitle>
        </CardHeader>

        <CardContent className="py-0">
          <div className="battery-defy--indicator">
            <BatteryStatusSide
              side="left"
              batteryLevel={wireless.battery ? wireless.battery.LeftLevel : 100}
              isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
              batteryStatus={wireless.battery ? wireless.battery.LeftState : 0}
              size="lg"
              deviceType={deviceType}
            />
            <BatteryStatusSide
              side="right"
              batteryLevel={wireless.battery ? wireless.battery.RightLevel : 100}
              isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
              batteryStatus={wireless.battery ? wireless.battery.RightState : 0}
              size="lg"
              deviceType={deviceType}
            />
            <SavingModeIndicator isSavingMode={wireless.battery ? wireless.battery.savingMode : false} deviceType={deviceType} />
          </div>
        </CardContent>
      </Card>
    </Styles>
  );
}

export default BatterySettings;

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
import { Card, CardContent, CardHeader } from "@Renderer/components/ui/card";
import Title from "@Renderer/component/Title";
import { BatteryStatusSide, SavingModeIndicator } from "@Renderer/component/Battery";

// Assets
import { IconBattery } from "@Renderer/component/Icon";
import i18n from "@Renderer/i18n";

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
`;

function BatterySettings(props: BatterySettingsProps) {
  const { wireless } = props;
  return (
    <Styles>
      <Card className="max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <Title text={i18n.wireless.batteryPreferences.battery} headingLevel={3} svgICO={<IconBattery />} />
        </CardHeader>
        <CardContent className="py-0">
          <div className="battery-defy--indicator">
            <BatteryStatusSide
              side="left"
              batteryLevel={wireless.battery ? wireless.battery.LeftLevel : 100}
              isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
              batteryStatus={wireless.battery ? wireless.battery.LeftState : 0}
              size="lg"
            />
            <BatteryStatusSide
              side="right"
              batteryLevel={wireless.battery ? wireless.battery.RightLevel : 100}
              isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
              batteryStatus={wireless.battery ? wireless.battery.RightState : 0}
              size="lg"
            />
            <SavingModeIndicator isSavingMode={wireless.battery ? wireless.battery.savingMode : false} />
          </div>
        </CardContent>
      </Card>
    </Styles>
  );
}

export default BatterySettings;

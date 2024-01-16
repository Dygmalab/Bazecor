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

// Modules
import { AdvancedBatterySettings, SavingMode } from "@Renderer/modules/Battery";

// Custom components
import { Card, CardContent, CardHeader } from "@Renderer/components/ui/card";
import Title from "@Renderer/component/Title";
import { IconThunder } from "@Renderer/component/Icon";
import i18n from "@Renderer/i18n";

// Import Types for wireless
import { EnergyManagementProps } from "@Renderer/types/wireless";

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
  return (
    <Styles>
      <Card className="overflowFix card-preferences">
        <CardHeader>
          <Title text={i18n.wireless.energyManagement.title} headingLevel={3} svgICO={<IconThunder />} />
        </CardHeader>
        <CardContent className="py-0">
          <AdvancedBatterySettings wireless={wireless} changeWireless={changeWireless} />
          <SavingMode wireless={wireless} changeWireless={changeWireless} />
        </CardContent>
      </Card>
    </Styles>
  );
}

export default EnergyManagement;

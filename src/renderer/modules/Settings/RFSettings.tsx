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
import i18n from "@Renderer/i18n";
import Styled from "styled-components";

// Custom components
import { Card, CardContent, CardHeader } from "@Renderer/components/ui/card";
import Title from "@Renderer/component/Title";
import { RegularButton } from "@Renderer/component/Button";

// Assets
import { IconSignal } from "@Renderer/component/Icon";
import { RFSettingsProps } from "@Renderer/types/wireless";

const Styles = Styled.div`
height: 100%;
padding-top: 24px;
.card {
  height: inherit;
}
.RFdescription {
  margin-top: 24px;
  p {
    font-size: 0.75rem;
    font-weight: 401;
    color: ${({ theme }) => theme.styles.batterySettings.descriptionColor};
    strong {
      font-weight: 401;
      color: ${({ theme }) => theme.styles.batterySettings.descriptionHighlightColor};
    }
  }
}
.button.outline {
  margin-top: 4px;
}
`;

function RFSettings(props: RFSettingsProps) {
  const { sendRePair } = props;
  return (
    <Styles>
      <Card className="overflowFix card-preferences">
        <CardHeader>
          <Title text={i18n.wireless.RFPreferences.RFSettings} headingLevel={3} svgICO={<IconSignal />} />
        </CardHeader>
        <CardContent className="py-0">
          <Title text={i18n.wireless.RFPreferences.repairChannel} headingLevel={4} />
          <RegularButton
            buttonText={i18n.wireless.RFPreferences.reconnectSides}
            onClick={sendRePair}
            styles="outline gradient"
            size="sm"
          />
          <div className="RFdescription">
            <p>{i18n.wireless.RFPreferences.repairChannelDescription}</p>
          </div>
        </CardContent>
      </Card>
    </Styles>
  );
}

export default RFSettings;

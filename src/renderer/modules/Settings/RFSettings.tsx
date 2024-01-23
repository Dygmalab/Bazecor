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

// Custom components
import { Card, CardContent, CardHeader, CardTitle } from "@Renderer/components/ui/card";
import Heading from "@Renderer/components/ui/heading";
import Title from "@Renderer/component/Title";
import { RegularButton } from "@Renderer/component/Button";

import { Row, Col } from "react-bootstrap";
import { ToggleButtons } from "@Renderer/component/ToggleButtons";

// Assets
import { IconSignal, IconRadar } from "@Renderer/component/Icon";
import { Badge } from "@Renderer/component/Badge";
import { RFSettingsProps } from "@Renderer/types/wireless";

function RFSettings(props: RFSettingsProps) {
  const { sendRePair, wireless, changeWireless } = props;

  const RFModes = [
    {
      name: "Low",
      value: 0,
      index: 0,
    },
    {
      name: "Medium",
      value: 1,
      index: 1,
    },
    {
      name: "High",
      value: 2,
      index: 2,
    },
  ];
  const setRfPower = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.rf.power = value;
    changeWireless(newWireless);
  };
  return (
    <>
      <Card className="max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle>
            <IconSignal /> {i18n.wireless.RFPreferences.RFSettings}
          </CardTitle>
        </CardHeader>
        <CardContent className="py-0">
          <Title text={i18n.wireless.RFPreferences.repairChannel} headingLevel={4} />
          <RegularButton
            buttonText={i18n.wireless.RFPreferences.reconnectSides}
            onClick={sendRePair}
            styles="outline gradient"
            size="sm"
          />
          <div className="py-3 mb-2 text-sm font-normal tracking-tight text-gray-400 dark:text-gray-100">
            <p>{i18n.wireless.RFPreferences.repairChannelDescription}</p>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-3 max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-3">
              <IconRadar /> {i18n.wireless.RFPreferences.RFRadioSignal}
            </div>{" "}
            <Badge content={i18n.wireless.energyManagement.settings.lowBatteryImpact} variation="subtle" size="sm" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Row className="card-preferences--option justify-between">
            <Col lg={5}>
              <Heading headingLevel={1} renderAs="h1">
                {i18n.wireless.energyManagement.settings.manageRFSignal}
              </Heading>
              <Title
                text={i18n.wireless.energyManagement.settings.manageRFSignal}
                tooltip={i18n.wireless.energyManagement.settings.tooltipRF}
                headingLevel={6}
              />
            </Col>
            <ToggleButtons selectDarkMode={setRfPower} value={wireless.rf.power} listElements={RFModes} styles="flex" size="sm" />
          </Row>
        </CardContent>
      </Card>
    </>
  );
}

export default RFSettings;

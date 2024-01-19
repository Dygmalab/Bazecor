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
import { KBDataPref } from "@Renderer/types/preferences";

// Assets
import { IconFlashlight } from "@Renderer/component/Icon";
import i18n from "../../i18n";

interface KeyboardSettingsProps {
  kbData: KBDataPref;
  setKbData: (data: KBDataPref) => void;
  connected: boolean;
}

function LEDSettings(props: KeyboardSettingsProps) {
  const { kbData, setKbData, connected } = props;
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
      <Card className="max-w-2xl mx-auto" variant="default">
        <CardHeader>
          <CardTitle variant="default">
            <IconFlashlight /> {i18n.keyboardSettings.led.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {ledIdleTimeLimit >= 0 && (
            <Form.Group controlId="idleTimeLimit" className="formGroup">
              <Row>
                <Col>
                  <Form.Label>{i18n.keyboardSettings.led.idleTimeLimit}</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={2} md={1} className="p-0 text-center align-self-center">
                  <span className="tagsfix">Off</span>
                </Col>
                <Col xs={8} md={10} className="px-2">
                  <Slider min={0} max={60} step={1} value={ledIdleTimeLimit / 60} onChange={selectIdleLEDTime} />
                </Col>
                <Col xs={2} md={1} className="p-0 text-center align-self-center">
                  <span className="tagsfix">60min</span>
                </Col>
              </Row>
            </Form.Group>
          )}
          {ledBrightness >= 0 && (
            <Form.Group controlId="brightnessControl" className="formGroup">
              <Row>
                <Col>
                  <Form.Label>{i18n.keyboardSettings.led.brightness}</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={2} md={1} className="p-0 text-center align-self-center">
                  <span className="tagsfix">None</span>
                </Col>
                <Col xs={8} md={10} className="px-2">
                  <Slider min={0} max={100} step={1} value={Math.round((ledBrightness * 100) / 255)} onChange={setBrightness} />
                </Col>
                <Col xs={2} md={1} className="p-0 text-center align-self-center">
                  <span className="tagsfix">Max</span>
                </Col>
              </Row>
            </Form.Group>
          )}
          {ledBrightnessUG >= 0 && (
            <Form.Group controlId="brightnessUGControl" className="formGroup">
              <Row>
                <Col>
                  <Form.Label>{i18n.keyboardSettings.led.brightnessUG}</Form.Label>
                </Col>
              </Row>
              <Row>
                <Col xs={2} md={1} className="p-0 text-center align-self-center">
                  <span className="tagsfix">None</span>
                </Col>
                <Col xs={8} md={10} className="px-2">
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((ledBrightnessUG * 100) / 255)}
                    onChange={setBrightnessUG}
                  />
                </Col>
                <Col xs={2} md={1} className="p-0 text-center align-self-center">
                  <span className="tagsfix">Max</span>
                </Col>
              </Row>
            </Form.Group>
          )}
        </CardContent>
      </Card>
    );
  }
}

export default LEDSettings;

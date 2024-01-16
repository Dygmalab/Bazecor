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

// Import Types
import { AdvancedEnergyManagementProps } from "@Renderer/types/wireless";

// External components
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Slider from "@appigram/react-rangeslider";

// Custom components
import { Card, CardContent, CardHeader } from "@Renderer/components/ui/card";
import { Switch } from "@Renderer/components/ui/switch";
import Title from "@Renderer/component/Title";
import { Badge } from "@Renderer/component/Badge";
import { RegularButton } from "@Renderer/component/Button";
import { ToggleButtons } from "@Renderer/component/ToggleButtons";

// Assets
import i18n from "@Renderer/i18n";

function AdvancedBatterySettingsModal(props: AdvancedEnergyManagementProps) {
  const { wireless, changeWireless, showModal, setShowModal } = props;
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

  const setBrightness = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.brightness = (value * 255) / 100;
    changeWireless(newWireless);
  };

  const setBrightnessUG = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.brightnessUG = (value * 255) / 100;
    changeWireless(newWireless);
  };

  const setIdleleds = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.idleleds = value * 60;
    changeWireless(newWireless);
  };

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

  const setFade = async (checked: boolean) => {
    // console.log("clicked fade");
    const newWireless = { ...wireless };
    newWireless.fade = checked ? 1 : 0;
    changeWireless(newWireless);
  };

  const setRfPower = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.rf.power = value;
    changeWireless(newWireless);
  };

  return (
    <Modal
      size="xl"
      show={showModal}
      onHide={() => setShowModal(false)}
      aria-labelledby="contained-modal-title-vcenter"
      centered
      backdrop="static"
    >
      <Modal.Header closeButton>
        <Modal.Title>{i18n.wireless.energyManagement.advancedSettings}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="overflowFix card-preferences card-preferences--battery">
          <CardHeader>
            <Title text={i18n.wireless.energyManagement.settings.maximumLED} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.highBatteryImpact} variation="danger-low" size="sm" />
          </CardHeader>
          <CardContent>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.maximumLEDBackLight} headingLevel={6} />
              </Col>
              <Col lg={5}>
                <div className="slider-wrapper">
                  <span className="tagsfix slider-label">0%</span>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((wireless.brightness * 100) / 255)}
                    onChange={setBrightness}
                  />
                  <span className="tagsfix slider-label">100%</span>
                </div>
              </Col>
            </Row>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.maximumLEDUnderglow} headingLevel={6} />
              </Col>
              <Col lg={5}>
                <div className="slider-wrapper">
                  <span className="tagsfix slider-label">0%</span>
                  <Slider
                    min={0}
                    max={100}
                    step={1}
                    value={Math.round((wireless.brightnessUG * 100) / 255)}
                    onChange={setBrightnessUG}
                  />
                  <span className="tagsfix slider-label">100%</span>
                </div>
              </Col>
            </Row>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.idleLedsTime} headingLevel={6} />
              </Col>
              <Col lg={5}>
                <div className="slider-wrapper">
                  <span className="tagsfix slider-label">off </span>
                  <Slider min={0} max={60} value={Math.round(wireless.idleleds / 60)} onChange={setIdleleds} />
                  <span className="tagsfix slider-label">60 min</span>
                </div>
              </Col>
            </Row>
          </CardContent>
        </Card>
        <Card className="overflowFix card-preferences card-preferences--battery mt-4">
          <CardHeader>
            <Title text={i18n.wireless.energyManagement.settings.trueSleepEnabling} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.mediumBatteryImpact} variation="warning" size="sm" />
          </CardHeader>
          <CardContent>
            <Row className="card-preferences--option justify-between">
              <Col sm={8} lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.trueSleepEnablingDesc} headingLevel={6} />
              </Col>
              <Switch
                id="TrueSleepSwitch"
                defaultChecked={false}
                checked={wireless.true_sleep === true}
                onCheckedChange={setTrueSleep}
              />
            </Row>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.trueSleepTimeDesc} headingLevel={6} />
              </Col>
              <Col lg={5}>
                <div className="slider-wrapper">
                  <span className="tagsfix slider-label">1 min </span>
                  <Slider min={1} max={240} value={Math.round(wireless.true_sleep_time / 60)} onChange={setTrueSleepTime} />
                  <span className="tagsfix slider-label">240 min</span>
                </div>
              </Col>
            </Row>
          </CardContent>
        </Card>
        <Card className="overflowFix card-preferences card-preferences--battery mt-4">
          <CardHeader>
            <Title text={i18n.wireless.energyManagement.settings.highlightLayerChanging} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.lowBatteryImpact} variation="subtle" size="sm" />
          </CardHeader>
          <CardContent>
            <Row className="card-preferences--option justify-between">
              <Col sm={8} lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.highlightLayerChangingDesc} headingLevel={6} />
              </Col>
              <Switch id="FadeSwitch" defaultChecked={false} checked={wireless.fade === 1} onCheckedChange={setFade} />
            </Row>
          </CardContent>
        </Card>
        <Card className="overflowFix card-preferences card-preferences--battery mt-4">
          <CardHeader>
            <Title text={i18n.wireless.energyManagement.settings.RFSettingTitle} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.lowBatteryImpact} variation="subtle" size="sm" />
          </CardHeader>
          <CardContent>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title
                  text={i18n.wireless.energyManagement.settings.manageRFSignal}
                  tooltip={i18n.wireless.energyManagement.settings.tooltipRF}
                  headingLevel={6}
                />
              </Col>
              <ToggleButtons
                selectDarkMode={setRfPower}
                value={wireless.rf.power}
                listElements={RFModes}
                styles="flex"
                size="sm"
              />
            </Row>
          </CardContent>
        </Card>
      </Modal.Body>
      <Modal.Footer>
        <RegularButton
          buttonText={i18n.app.cancelPending.button}
          styles="outline transp-bg"
          onClick={() => setShowModal(false)}
        />
        <RegularButton buttonText={i18n.dialog.applyChanges} styles="outline gradient" onClick={() => setShowModal(false)} />
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedBatterySettingsModal;

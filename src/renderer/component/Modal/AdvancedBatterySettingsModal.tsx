import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";

import Slider from "@appigram/react-rangeslider";

import Title from "@Renderer/component/Title";
import { Badge } from "@Renderer/component/Badge";
import { RegularButton } from "@Renderer/component/Button";
import { ToggleButtons } from "@Renderer/component/ToggleButtons";
import { AdvancedEnergyManagementProps } from "@Renderer/types/wireless";

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
    console.log("idleleds new value", value, newWireless.idleleds);
    changeWireless(newWireless);
  };

  const setFade = async (value: any) => {
    const newWireless = { ...wireless };
    newWireless.fade = value.target.checked ? 1 : 0;
    changeWireless(newWireless);
  };

  const setRfPower = async (value: number) => {
    const newWireless = { ...wireless };
    newWireless.rf.power = value;
    changeWireless(newWireless);
  };

  return (
    <Modal size="xl" show={showModal} onHide={() => setShowModal(false)} aria-labelledby="contained-modal-title-vcenter" centered>
      <Modal.Header closeButton>
        <Modal.Title>{i18n.wireless.energyManagement.advancedSettings}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Card className="overflowFix card-preferences card-preferences--battery">
          <Card.Title>
            <Title text={i18n.wireless.energyManagement.settings.maximumLED} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.highBatteryImpact} variation="danger-low" size="sm" />
          </Card.Title>
          <Card.Body>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.maximumLEDBackLight} headingLevel={6} />
              </Col>
              <Col lg={5}>
                <div className="slider-wrapper">
                  <span className="tagsfix slider-label">0%</span>
                  <Slider min={1} max={100} value={Math.round((wireless.brightness * 100) / 255)} onChange={setBrightness} />
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
                  <Slider min={1} max={100} value={Math.round((wireless.brightnessUG * 100) / 255)} onChange={setBrightnessUG} />
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
          </Card.Body>
        </Card>
        <Card className="overflowFix card-preferences card-preferences--battery mt-4">
          <Card.Title>
            <Title text={i18n.wireless.energyManagement.settings.highlightLayerChanging} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.lowBatteryImpact} variation="subtle" size="sm" />
          </Card.Title>
          <Card.Body>
            <Row className="card-preferences--option justify-between">
              <Col sm={8} lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.highlightLayerChangingDesc} headingLevel={6} />
              </Col>
              <Form.Check type="switch" id="toggleLayerHighlight" checked={wireless.fade === 1} onChange={setFade} />
            </Row>
          </Card.Body>
        </Card>
        <Card className="overflowFix card-preferences card-preferences--battery mt-4">
          <Card.Title>
            <Title text={i18n.wireless.energyManagement.settings.RFSettingTitle} headingLevel={4} />
            <Badge content={i18n.wireless.energyManagement.settings.lowBatteryImpact} variation="subtle" size="sm" />
          </Card.Title>
          <Card.Body>
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
                style="flex"
                size="sm"
              />
            </Row>
          </Card.Body>
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

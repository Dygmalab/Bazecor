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

import i18n from "../../i18n";

function AdvancedBatterySettingsModal({ showModal, setShowModal }) {
  const RFModes = [
    {
      name: "Low",
      value: "low",
      index: 0,
    },
    {
      name: "Medium",
      value: "medium",
      index: 1,
    },
    {
      name: "High",
      value: "high",
      index: 2,
    },
  ];
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
                  <Slider min={1} max={100} value={80} onChange={() => {}} />
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
                  <Slider min={1} max={100} value={80} onChange={() => {}} />
                  <span className="tagsfix slider-label">100%</span>
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
              <Form.Check type="switch" id="toggleLayerHighlight" checked={false} onChange={() => {}} />
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
              <ToggleButtons selectDarkMode={() => {}} value="medium" listElements={RFModes} style="flex" size="sm" />
            </Row>
            <Row className="card-preferences--option justify-between">
              <Col sm={8} lg={5}>
                <Title text={i18n.wireless.energyManagement.settings.reduceRFFrequency} headingLevel={6} />
              </Col>
              <Form.Check type="switch" id="toggleLayerHighlight" checked={false} onChange={() => {}} />
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

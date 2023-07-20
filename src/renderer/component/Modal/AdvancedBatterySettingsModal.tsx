import React from "react";

import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import Card from "react-bootstrap/Card";

import Slider from "@appigram/react-rangeslider";

import Title from "@Renderer/component/Title";
import Badge from "@Renderer/component/Badge";
import { RegularButton } from "@Renderer/component/Button";
import { ToggleButtons } from "@Renderer/component/ToggleButtons";

import i18n from "../../i18n";

interface AdvancedBatterySettingsProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function AdvancedBatterySettingsModal({ showModal, setShowModal }: AdvancedBatterySettingsProps) {
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
            <Badge content="High battery impact" variation="danger-low" size="sm" />
          </Card.Title>
          <Card.Body>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text="Maximum Per-key LED intensity while the device is NOT connected by cable" headingLevel={6} />
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
                <Title text="Maximum Underglow intensity while the device is NOT connected by cable" headingLevel={6} />
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
            <Title text="Highlight layer changing" headingLevel={4} />
            <Badge content="Low battery impact" variation="subtle" size="sm" />
          </Card.Title>
          <Card.Body>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title
                  text="Adjust underglow and backlight intensity as you switch layers. The maximum intensity smoothly fades to a lower level."
                  headingLevel={6}
                />
              </Col>
              <Form.Check type="switch" id="toggleLayerHighlight" checked={false} onChange={() => {}} />
            </Row>
          </Card.Body>
        </Card>
        <Card className="overflowFix card-preferences card-preferences--battery mt-4">
          <Card.Title>
            <Title text="Highlight layer changing" headingLevel={4} />
            <Badge content="Low battery impact" variation="subtle" size="sm" />
          </Card.Title>
          <Card.Body>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title
                  text="Manage the power of the radio signal"
                  tooltip={i18n.wireless.energyManagement.settings.tooltipRF}
                  headingLevel={6}
                />
              </Col>
              <ToggleButtons selectDarkMode={() => {}} value={"medium"} listElements={RFModes} style="flex" size="sm" />
            </Row>
            <Row className="card-preferences--option justify-between">
              <Col lg={5}>
                <Title text="Reduce the frequency of data exchange in RF" headingLevel={6} />
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
          size="sm"
          onClick={() => setShowModal(false)}
        />
        <RegularButton
          buttonText={i18n.components.save.button}
          styles="outline gradient"
          size="sm"
          onClick={() => setShowModal(false)}
        />
      </Modal.Footer>
    </Modal>
  );
}

export default AdvancedBatterySettingsModal;

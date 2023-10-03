import PropTypes from "prop-types";
import React, { Component, useState } from "react";
import Styled from "styled-components";

// React Bootstrap Components
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Focus from "../../../api/focus";
import i18n from "../../i18n";

// Own Components
import Title from "../../component/Title";
import { RegularButton } from "../../component/Button";
import ConfirmationDialog from "../../component/ConfirmationDialog";

// Icons Imports
import { IconChip } from "../../component/Icon";
import { useDevice } from "@Renderer/DeviceContext";

const Style = Styled.div`
.advancedToggles {
  display: flex;
  .switchHolder {
    margin-right: 2rem;
  } 
}
`;

export default class AdvancedSettings extends Component {
  render() {
    const { devToolsSwitch, verboseSwitch, onlyCustomSwitch, allowBetas, pairingButton } = this.props;
    return (
      <Style>
        <Card className="overflowFix card-preferences mt-4 mb-4">
          <Card.Title>
            <Title text={i18n.preferences.advanced} headingLevel={3} svgICO={<IconChip />} />
          </Card.Title>
          <Card.Body className="pb-0">
            <Row>
              <Col xs={12}>
                <div className="advancedToggles">
                  <Form.Group controlId="DevTools" className="switchHolder">
                    <Form.Label>{i18n.preferences.devtools}</Form.Label>
                    {devToolsSwitch}
                  </Form.Group>
                  <Form.Group controlId="Verbose" className="switchHolder">
                    <Form.Label>{i18n.preferences.verboseFocus}</Form.Label>
                    {verboseSwitch}
                  </Form.Group>
                  <Form.Group controlId="allowBetas" className="switchHolder">
                    <Form.Label>{i18n.preferences.allowBeta}</Form.Label>
                    {allowBetas}
                  </Form.Group>
                  {this.props.connected ? (
                    <Form.Group controlId="onlyCustom" className="switchHolder">
                      <Form.Label>{i18n.preferences.onlyCustom}</Form.Label>
                      {onlyCustomSwitch}
                    </Form.Group>
                  ) : (
                    ""
                  )}
                </div>
              </Col>
            </Row>
            {this.props.connected ? (
              <Row>
                <Col xs={12} className="mt-4">
                  <Title headingLevel={6} text={i18n.keyboardSettings.resetEEPROM.title} />
                </Col>
                <Col xs={12}>
                  <AdvancedKeyboardSettings />
                  {pairingButton}
                </Col>
              </Row>
            ) : (
              ""
            )}
          </Card.Body>
        </Card>
      </Style>
    );
  }
}

const AdvancedKeyboardSettings = () => {
  const [EEPROMClearConfirmationOpen, setEEPROMClearConfirmationOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const [state] = useDevice();

  const openEEPROMClearConfirmation = () => {
    setEEPROMClearConfirmationOpen(true);
  };

  const closeEEPROMClearConfirmation = () => {
    setEEPROMClearConfirmationOpen(false);
  };

  const clearEEPROM = async () => {
    setWorking(true);
    closeEEPROMClearConfirmation();
    if (state.currentDevice) {
      let eeprom = await state.currentDevice.command("eeprom.contents");
      eeprom = eeprom
        .split(" ")
        .filter(v => v.length > 0)
        .map(() => 255)
        .join(" ");
      await state.currentDevice.command("eeprom.contents", eeprom);
    }
    setWorking(false);
  };

  return (
    <>
      <RegularButton
        buttonText={i18n.keyboardSettings.resetEEPROM.button}
        styles="short danger"
        onClick={openEEPROMClearConfirmation}
        disabled={working}
      />
      <ConfirmationDialog
        title={i18n.keyboardSettings.resetEEPROM.dialogTitle}
        open={EEPROMClearConfirmationOpen}
        onConfirm={clearEEPROM}
        onCancel={closeEEPROMClearConfirmation}
      >
        {i18n.keyboardSettings.resetEEPROM.dialogContents}
      </ConfirmationDialog>
    </>
  );
};

AdvancedSettings.propTypes = {
  devToolsSwitch: PropTypes.object.isRequired,
  verboseSwitch: PropTypes.object.isRequired,
  connected: PropTypes.bool.isRequired,
};

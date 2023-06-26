import React from "react";
import i18n from "../../i18n";

//Bootstrap components
import Styled from "styled-components";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";

//Custom components
import Title from "../../component/Title";
import { BatteryStatusSide } from "../../component/Battery";

//Assets
import { IconBattery } from "../../component/Icon";

const Styles = Styled.div`
.battery-defy--indicator {
  display: flex;
  grid-gap: 4px;
  margin-bottom: 42px;
}
.savingModedescription {
  margin-top: 16px;
  font-size: 0.75rem;
  font-weight: 401;
  letter-spacing: -0.01em;
  color: ${({ theme }) => theme.colors.gray300}
  strong {
    font-weight: 401;
    color: ${({ theme }) => theme.colors.gray100}
  }
}
`;

const BatterySettings = ({ bLeft, bRight, isSavingMode, setIsSavingMode, isCharging }) => {
  return (
    <Styles>
      <Card className="overflowFix card-preferences mt-4">
        <Card.Title>
          <Title text={i18n.wireless.batteryPreferences.battery} headingLevel={3} svgICO={<IconBattery />} />
        </Card.Title>
        <Card.Body className="py-0">
          <div className="battery-defy--indicator">
            <BatteryStatusSide side="left" batteryLevel={bLeft} size="lg" isSavingMode={isSavingMode} isCharging={isCharging} />
            <BatteryStatusSide side="right" batteryLevel={bRight} size="lg" isSavingMode={isSavingMode} isCharging={isCharging} />
          </div>
          <Form className="batterySettingItem batterySetSavingMode">
            <div className="batterySettingLabel">Saving Mode</div>
            <Form.Check
              type="switch"
              id="settingSavingMode"
              checked={isSavingMode}
              onChange={() => setIsSavingMode(!isSavingMode)}
              size="sm"
            />
          </Form>
          <div
            className="savingModedescription"
            dangerouslySetInnerHTML={{ __html: i18n.wireless.batteryPreferences.savingModeDescription }}
          />
        </Card.Body>
      </Card>
    </Styles>
  );
};

export default BatterySettings;

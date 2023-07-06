import React from "react";

// Bootstrap components
import Styled from "styled-components";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import i18n from "../../i18n";

// Custom components
import Title from "../../component/Title";
import { BatteryStatusSide, SavingModeIndicator } from "../../component/Battery";

// Assets
import { IconBattery } from "../../component/Icon";

const Styles = Styled.div`
height: 100%;
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

const BatterySettings = ({ wireless, toggleSavingMode, changeWireless, isCharging }) => (
  // console.log("Wireless: ", wireless);
  <Styles>
    <Card className="overflowFix card-preferences">
      <Card.Title>
        <Title text={i18n.wireless.batteryPreferences.battery} headingLevel={3} svgICO={<IconBattery />} />
      </Card.Title>
      <Card.Body className="py-0">
        <div className="battery-defy--indicator">
          <BatteryStatusSide
            side="left"
            batteryLevel={wireless.battery ? wireless.battery.LeftLevel : 100}
            isSavingMode={wireless.battery ? String(wireless.battery.savingMode).includes("true") : false}
            isCharging={isCharging}
            size="lg"
          />
          <BatteryStatusSide
            side="right"
            batteryLevel={wireless.battery ? wireless.battery.RightLevel : 100}
            isSavingMode={wireless.battery ? String(wireless.battery.savingMode).includes("true") : false}
            isCharging={isCharging}
            size="lg"
          />
          <SavingModeIndicator
            isSavingMode={wireless.battery ? String(wireless.battery.savingMode).includes("true") : false}
            isCharging={isCharging}
          />
        </div>
        <Form className="batterySettingItem batterySetSavingMode">
          <div className="batterySettingLabel">Saving Mode</div>
          <Form.Check
            type="switch"
            id="settingSavingMode"
            checked={wireless.battery ? String(wireless.battery.savingMode).includes("true") : false}
            onChange={toggleSavingMode}
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
export default BatterySettings;

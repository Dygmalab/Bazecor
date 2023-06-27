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
height: 100%;
padding-top: 24px;
.card {
  height: inherit;
}
.battery-defy--indicator {
  display: flex;
  grid-gap: 4px;
  margin-bottom: 42px;
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
    color: ${({ theme }) => theme.colors.gray200};
    strong {
      font-weight: 401;
      color: ${({ theme }) => theme.colors.gray50};
    }
  }
}
`;

function BatterySettings({ wireless, toggleSavingMode, changeWireless }) {
  return (
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
              isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
              size="lg"
            />
            <BatteryStatusSide
              side="right"
              batteryLevel={wireless.battery ? wireless.battery.RightLevel : 100}
              isSavingMode={wireless.battery ? wireless.battery.savingMode : false}
              size="lg"
            />
          </div>
          <Form className="batterySettingItem batterySetSavingMode">
            <div className="batterySettingLabel">Saving Mode</div>
            <Form.Check
              type="switch"
              id="settingSavingMode"
              checked={wireless.battery ? wireless.battery.savingMode : false}
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
}

export default BatterySettings;

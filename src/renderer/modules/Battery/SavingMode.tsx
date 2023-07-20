import React from "react";
import Styled from "styled-components";

import Form from "react-bootstrap/Form";

// Internal components
import Title from "@Renderer/component/Title";

import { EnergyManagementProps } from "@Renderer/types/wireless";
import i18n from "../../i18n";

const Styles = Styled.div`
h5 {
  font-size: 0.75rem;
  border-bottom: 1px solid ${({ theme }) => theme.styles.energyManagement.borderColor};
  color: ${({ theme }) => theme.styles.energyManagement.lowPowerModeTitleColor};
  padding-bottom: 0.5rem;
  margin: 1.5rem 0 0 0;
}
.settingsWrapper {
  display: flex;
  align-items: center;
  grid-gap: 1rem; 
  justify-content: space-between;
  padding: 1rem 0;
}
.settingsContent {
  h4 {
    font-size: 0.915rem;
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.styles.energyManagement.titleColor};
  }
  p {
    font-size: 0.815rem;
    font-weight: 401;
    margin: 0;
    color: ${({ theme }) => theme.styles.energyManagement.descriptionColor};
    small {
      font-family: inherit;
      font-size: 0.75rem;
      font-weight: 401;
      opacity: 0.8;
    }
  }
  p + p {
    margin-top: 0.25rem;
  }
}
.settingsActions {
  .custom-switch {
    width: 60px;
  }
}
`;

function SavingMode({ wireless, toggleSavingMode }: EnergyManagementProps) {
  return (
    <Styles>
      <Title text={i18n.wireless.energyManagement.lowPowerMode} headingLevel={5} />
      <div className="settingsWrapper">
        <div className="settingsContent">
          <Title text={i18n.wireless.energyManagement.savingMode} headingLevel={4} />
          <p>{i18n.wireless.energyManagement.savingModeDesc}</p>
          <p>
            <small>{i18n.wireless.energyManagement.savingModeInfo}</small>
          </p>
        </div>
        <div className="settingsActions">
          <Form className="batterySettingItem batterySetSavingMode">
            <Form.Check
              type="switch"
              id="settingSavingMode"
              checked={wireless.battery ? wireless.battery.savingMode : false}
              onChange={() => toggleSavingMode}
            />
          </Form>
        </div>
      </div>
    </Styles>
  );
}

export default SavingMode;

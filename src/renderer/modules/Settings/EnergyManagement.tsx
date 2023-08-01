import React from "react";

// Bootstrap components
import Styled from "styled-components";
import Card from "react-bootstrap/Card";

// Modules
import { SavingMode } from "@Renderer/modules/Battery";
// Internal components
import Title from "@Renderer/component/Title";
import { IconThunder } from "@Renderer/component/Icon";
import i18n from "@Renderer/i18n";

// Import Types for wireless
import { EnergyManagementProps } from "@Renderer/types/wireless";

const Styles = Styled.div`
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

function EnergyManagement(props: EnergyManagementProps) {
  const { wireless, toggleSavingMode } = props;
  return (
    <Styles>
      <Card className="overflowFix card-preferences">
        <Card.Title>
          <Title text={i18n.wireless.energyManagement.title} headingLevel={3} svgICO={<IconThunder />} />
        </Card.Title>
        <Card.Body className="py-0">
          {/* <AdvancedBatterySettings /> */}
          <SavingMode wireless={wireless} toggleSavingMode={toggleSavingMode} />
        </Card.Body>
      </Card>
    </Styles>
  );
}

export default EnergyManagement;
